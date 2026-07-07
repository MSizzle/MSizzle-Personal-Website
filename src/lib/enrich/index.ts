import { Client } from "@notionhq/client";
import type {
  PageObjectResponse,
  UpdatePageParameters,
} from "@notionhq/client/build/src/api-endpoints";
import pLimit from "p-limit";
import type { LoveType } from "@/lib/notion-loves";
import type { LovePatch, Provider, ProviderResult } from "./types";
import { tmdbLookup } from "./tmdb";
import { bookLookup } from "./book";
import { youtubeLookup } from "./youtube";
import { wikipediaLookup } from "./wikipedia";
import { draftNote } from "./note-draft";

// --- Notion client & rate limiter (same pattern as notion-loves.ts) ---

// Lazy so the CLI script can load .env before the client reads NOTION_TOKEN.
let client: Client | null = null;
function notion(): Client {
  if (!client) client = new Client({ auth: process.env.NOTION_TOKEN });
  return client;
}

const limit = pLimit(2);

function isRetriable(err: unknown): boolean {
  if (!(err instanceof Object)) return false;
  const code = "code" in err ? (err as { code: unknown }).code : undefined;
  if (code === "rate_limited") return true;
  // Transient network blips (undici "fetch failed", resets, timeouts) — a single
  // one should not abort an unattended cron run.
  const message =
    "message" in err ? String((err as { message: unknown }).message) : "";
  return (
    message.includes("fetch failed") ||
    code === "ECONNRESET" ||
    code === "ETIMEDOUT" ||
    code === "UND_ERR_CONNECT_TIMEOUT"
  );
}

async function withRetry<T>(fn: () => Promise<T>, retries = 3): Promise<T> {
  for (let attempt = 0; attempt < retries; attempt++) {
    try {
      return await limit(fn);
    } catch (err: unknown) {
      if (isRetriable(err) && attempt < retries - 1) {
        await new Promise((r) => setTimeout(r, Math.pow(2, attempt) * 1000));
        continue;
      }
      throw err;
    }
  }
  throw new Error("withRetry: exhausted retries");
}

// --- Row model ---

const VALID_TYPES: LoveType[] = ["Place", "Book", "Movie", "YouTube", "Thing"];

export interface Row {
  id: string;
  title: string;
  /** Normalized type, or null when unset/unrecognized (row is then skipped). */
  type: LoveType | null;
  subtitle: string;
  note: string;
  url: string;
  published: boolean;
  hasCover: boolean;
}

function firstKey(
  props: PageObjectResponse["properties"],
  candidates: string[]
): string | null {
  for (const c of candidates) if (c in props) return c;
  return null;
}

function normalizeType(raw: string): LoveType | null {
  const normalized = raw === "Hobby" ? "Thing" : raw;
  return VALID_TYPES.includes(normalized as LoveType)
    ? (normalized as LoveType)
    : null;
}

function readRow(page: PageObjectResponse): Row {
  const props = page.properties;

  const titleProp = props["Name"] || props["Title"] || props["title"];
  const title =
    titleProp?.type === "title"
      ? titleProp.title.map((t) => t.plain_text).join("")
      : "";

  const subtitleProp = props["Subtitle"] || props["subtitle"];
  const subtitle =
    subtitleProp?.type === "rich_text"
      ? subtitleProp.rich_text.map((t) => t.plain_text).join("")
      : "";

  const noteProp = props["Note"] || props["note"];
  const note =
    noteProp?.type === "rich_text"
      ? noteProp.rich_text.map((t) => t.plain_text).join("")
      : "";

  const typeProp = props["Type"] || props["type"];
  const rawType = typeProp?.type === "select" ? typeProp.select?.name ?? "" : "";

  const urlProp = props["URL"] || props["url"];
  const url = urlProp?.type === "url" ? urlProp.url ?? "" : "";

  const publishedProp = props["Published"] || props["published"];
  const published =
    publishedProp?.type === "checkbox" ? publishedProp.checkbox : false;

  return {
    id: page.id,
    title,
    type: normalizeType(rawType),
    subtitle,
    note,
    url,
    published,
    hasCover: Boolean(page.cover),
  };
}

/**
 * A row is a candidate when it is not yet published, has a name and a recognized
 * type, and is still missing its cover or its subtitle. Published rows are never
 * touched; nothing here overwrites a field the user already filled.
 */
export function needsEnrichment(row: Row): boolean {
  return (
    !row.published &&
    row.title.trim() !== "" &&
    row.type !== null &&
    (!row.hasCover || row.subtitle.trim() === "")
  );
}

function skipReason(row: Row): string {
  if (row.published) return "already published";
  if (row.title.trim() === "") return "no name";
  if (row.type === null) return "no recognized Type";
  return "already has cover and subtitle";
}

// --- Providers ---

function providerFor(type: LoveType): Provider {
  switch (type) {
    case "Movie":
      return tmdbLookup;
    case "Book":
      return bookLookup;
    case "YouTube":
      return youtubeLookup;
    case "Place":
    case "Thing":
      return wikipediaLookup;
  }
}

/** Compute the fields to write. Only ever fills blanks; never overwrites. */
async function computePatch(row: Row): Promise<LovePatch> {
  const patch: LovePatch = {};
  if (!row.type) return patch;

  let result: ProviderResult | null = null;
  try {
    result = await providerFor(row.type)({
      title: row.title,
      type: row.type,
      url: row.url,
    });
  } catch (err) {
    console.warn(
      `  provider error for "${row.title}": ${(err as Error).message}`
    );
  }

  if (result) {
    if (!row.hasCover && result.coverUrl) patch.coverUrl = result.coverUrl;
    if (row.subtitle.trim() === "" && result.subtitle)
      patch.subtitle = result.subtitle;
    if (row.url.trim() === "" && result.url) patch.url = result.url;
  }

  // Draft a Note only when it is empty and we have something grounded to write
  // from (a provider hit or an existing subtitle). Avoids hallucinating.
  if (row.note.trim() === "" && (result || row.subtitle.trim() !== "")) {
    const note = await draftNote({
      title: row.title,
      type: row.type,
      subtitle: patch.subtitle || row.subtitle || result?.subtitle,
      context: result?.context,
    });
    if (note) patch.note = note;
  }

  return patch;
}

function patchFields(patch: LovePatch): string[] {
  return Object.keys(patch).map((k) => (k === "coverUrl" ? "cover" : k));
}

/** Write the patch to Notion, resolving the real (case-tolerant) property keys. */
async function applyPatch(
  page: PageObjectResponse,
  patch: LovePatch
): Promise<void> {
  const props = page.properties;
  const properties: Record<string, unknown> = {};

  if (patch.subtitle !== undefined) {
    const k = firstKey(props, ["Subtitle", "subtitle"]);
    if (k) properties[k] = { rich_text: [{ text: { content: patch.subtitle } }] };
  }
  if (patch.note !== undefined) {
    const k = firstKey(props, ["Note", "note"]);
    if (k) properties[k] = { rich_text: [{ text: { content: patch.note } }] };
  }
  if (patch.url !== undefined) {
    const k = firstKey(props, ["URL", "url"]);
    if (k) properties[k] = { url: patch.url };
  }

  const params: Record<string, unknown> = { page_id: page.id };
  if (Object.keys(properties).length > 0) params.properties = properties;
  if (patch.coverUrl !== undefined) {
    params.cover = { type: "external", external: { url: patch.coverUrl } };
  }

  await withRetry(() => notion().pages.update(params as UpdatePageParameters));
}

// --- Public API ---

export interface EnrichResult {
  id: string;
  title: string;
  type: LoveType | null;
  status: "enriched" | "skipped" | "no-data" | "error";
  fields: string[];
  reason?: string;
}

function assertConfigured(): void {
  if (!process.env.NOTION_TOKEN || !process.env.NOTION_LOVES_DB_ID) {
    throw new Error(
      "NOTION_TOKEN and NOTION_LOVES_DB_ID must be set to enrich the loves DB."
    );
  }
}

/** Query every row (DB is small); filtering happens in-process for name tolerance. */
async function scanAllPages(): Promise<PageObjectResponse[]> {
  const pages: PageObjectResponse[] = [];
  let cursor: string | undefined;
  do {
    const response = await withRetry(() =>
      notion().databases.query({
        database_id: process.env.NOTION_LOVES_DB_ID!,
        start_cursor: cursor,
      })
    );
    for (const page of response.results) {
      if ("properties" in page) pages.push(page as PageObjectResponse);
    }
    cursor = response.has_more ? response.next_cursor ?? undefined : undefined;
  } while (cursor);
  return pages;
}

async function enrichPage(
  page: PageObjectResponse,
  opts: { dryRun: boolean }
): Promise<EnrichResult> {
  const row = readRow(page);
  const base = { id: page.id, title: row.title, type: row.type };

  if (!needsEnrichment(row)) {
    return { ...base, status: "skipped", fields: [], reason: skipReason(row) };
  }

  let patch: LovePatch;
  try {
    patch = await computePatch(row);
  } catch (err) {
    return { ...base, status: "error", fields: [], reason: (err as Error).message };
  }

  const fields = patchFields(patch);
  if (fields.length === 0) {
    return { ...base, status: "no-data", fields, reason: "no source data found" };
  }

  if (!opts.dryRun) {
    try {
      await applyPatch(page, patch);
    } catch (err) {
      return { ...base, status: "error", fields, reason: (err as Error).message };
    }
  }

  return { ...base, status: "enriched", fields };
}

/** Scan the whole DB and enrich every candidate row. */
export async function enrichAll(
  opts: { dryRun?: boolean } = {}
): Promise<EnrichResult[]> {
  assertConfigured();
  const dryRun = opts.dryRun ?? false;
  const pages = await scanAllPages();

  const results: EnrichResult[] = [];
  for (const page of pages) {
    if (!needsEnrichment(readRow(page))) continue;
    results.push(await enrichPage(page, { dryRun }));
  }
  return results;
}

/** Enrich a single page by id (used by the webhook POST / future Notion button). */
export async function enrichById(
  pageId: string,
  opts: { dryRun?: boolean } = {}
): Promise<EnrichResult> {
  assertConfigured();
  const page = await withRetry(() => notion().pages.retrieve({ page_id: pageId }));
  if (!("properties" in page)) {
    throw new Error("Retrieved object is not a full page.");
  }
  return enrichPage(page as PageObjectResponse, { dryRun: opts.dryRun ?? false });
}

export function summarize(results: EnrichResult[]) {
  const count = (s: EnrichResult["status"]) =>
    results.filter((r) => r.status === s).length;
  return {
    total: results.length,
    enriched: count("enriched"),
    noData: count("no-data"),
    errors: count("error"),
    results,
  };
}
