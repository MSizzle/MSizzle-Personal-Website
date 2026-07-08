import { Client } from "@notionhq/client";
import type { PageObjectResponse } from "@notionhq/client/build/src/api-endpoints";
import pLimit from "p-limit";

// --- Client & rate limiter (same pattern as notion-projects.ts) ---

const notion = new Client({ auth: process.env.NOTION_TOKEN });

// Notion allows 3 req/s. Keep headroom at 2 concurrent.
const limit = pLimit(2);

async function withRetry<T>(fn: () => Promise<T>, retries = 3): Promise<T> {
  for (let attempt = 0; attempt < retries; attempt++) {
    try {
      return await limit(fn);
    } catch (err: unknown) {
      const isRateLimited =
        err instanceof Object &&
        "code" in err &&
        (err as { code: string }).code === "rate_limited";
      if (isRateLimited && attempt < retries - 1) {
        const delay = Math.pow(2, attempt) * 1000;
        await new Promise((r) => setTimeout(r, delay));
        continue;
      }
      throw err;
    }
  }
  throw new Error("withRetry: exhausted retries");
}

// --- Types ---

export type LoveType = "Place" | "Book" | "Movie" | "YouTube" | "Thing";
const LOVE_TYPES: LoveType[] = ["Place", "Book", "Movie", "YouTube", "Thing"];

export interface LoveItem {
  id: string;
  /** Card style: drives which face renders (one of 5 known styles). */
  type: LoveType;
  /**
   * Raw Notion "Type" select value, used only to group the Organize-by-topic
   * view. Independent of `type` (the render style): a brand-new Type option in
   * Notion becomes its own organize band while still rendering with a safe
   * fallback card. "" when no Type is set (falls under "Uncategorized").
   */
  category: string;
  /** Primary label — place name, book title, video title, hobby name. */
  title: string;
  /** Secondary line — book author, video channel, hobby one-liner. */
  subtitle: string;
  /** The "why I love it" copy revealed on click. */
  note: string;
  /** Link out; for YouTube this is the watch URL the thumbnail derives from. */
  url: string;
  /** Video id parsed from `url` when type is YouTube; null otherwise. */
  youtubeId: string | null;
  /** Notion page-cover URL (raw). Rendered via /api/notion-cover?pageId=id; null renders a fallback face. */
  cover: string | null;
  /** Optional manual ordering (ascending); nulls sort last. */
  order: number | null;
  published: boolean;
  lastEdited: string;
}

const LOVES_DATABASE_ID = process.env.NOTION_LOVES_DB_ID!;

/** Extract an 11-char YouTube id from a watch/share/embed URL. */
export function extractYouTubeId(url: string): string | null {
  const match = url.match(
    /(?:youtube\.com\/(?:watch\?v=|embed\/)|youtu\.be\/)([A-Za-z0-9_-]{6,})/
  );
  return match ? match[1] : null;
}

function extractLoveProperties(page: PageObjectResponse): LoveItem {
  const props = page.properties;

  const titleProp = props["Name"] || props["Title"] || props["title"];
  const title =
    titleProp?.type === "title"
      ? titleProp.title.map((t) => t.plain_text).join("")
      : "Untitled";

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
  const rawType =
    typeProp?.type === "select" ? typeProp.select?.name ?? "" : "";
  // Legacy "Hobby" label maps to the generic "Thing" card style.
  const normalizedType = rawType === "Hobby" ? "Thing" : rawType;
  // Unknown / new Type values render with the generic "Thing" card (a neutral
  // catch-all) rather than a Place polaroid, so a category Monty adds later
  // still looks reasonable on the board. The raw value is preserved in
  // `category` for grouping.
  const type: LoveType = LOVE_TYPES.includes(normalizedType as LoveType)
    ? (normalizedType as LoveType)
    : "Thing";

  const urlProp = props["URL"] || props["url"];
  const url = urlProp?.type === "url" ? urlProp.url ?? "" : "";

  const publishedProp = props["Published"] || props["published"];
  const published =
    publishedProp?.type === "checkbox" ? publishedProp.checkbox : false;

  const orderProp =
    props["Order"] || props["Order (Optional)"] || props["order"];
  const order = orderProp?.type === "number" ? orderProp.number : null;

  const cover = page.cover
    ? page.cover.type === "external"
      ? page.cover.external.url
      : page.cover.file.url
    : null;

  return {
    id: page.id,
    type,
    category: rawType,
    title,
    subtitle,
    note,
    url,
    youtubeId: type === "YouTube" ? extractYouTubeId(url) : null,
    cover,
    order,
    published,
    lastEdited: page.last_edited_time,
  };
}

export interface LovesData {
  items: LoveItem[];
  /**
   * Distinct Type values in Notion's own select-option order. Drives the
   * Organize-by-topic band order so reordering the options in Notion reorders
   * the bands. Items with no Type collect under "Uncategorized" (shown last by
   * the board, not listed here). [] when the DB isn't configured.
   */
  categoryOrder: string[];
}

/**
 * Read the "Type" select's options in the order they're defined in Notion, so
 * the Organize-by-topic view can order its bands to match. Best-effort: any
 * failure (or a non-select Type) yields [], and the board falls back to
 * ordering bands alphabetically.
 */
async function fetchTypeOptionOrder(): Promise<string[]> {
  try {
    const db = await withRetry(() =>
      notion.databases.retrieve({ database_id: LOVES_DATABASE_ID })
    );
    const props = "properties" in db ? db.properties : {};
    const typeProp = props["Type"] || props["type"];
    if (typeProp && typeProp.type === "select") {
      return typeProp.select.options.map((o) => o.name);
    }
  } catch {
    // fall through to []
  }
  return [];
}

/**
 * Fetch every Published item from the "Things I Love" Notion database (sorted by
 * manual Order ascending, nulls last, then most-recently-edited) plus the
 * ordered list of Type categories that drives Organize-by-topic.
 *
 * Gated behind NOTION_LOVES_DB_ID: with no database configured (or any Notion
 * failure) this returns empty data so the homepage falls back to its current
 * design.
 */
export async function getLovesData(): Promise<LovesData> {
  if (!process.env.NOTION_TOKEN || !process.env.NOTION_LOVES_DB_ID) {
    return { items: [], categoryOrder: [] };
  }

  try {
    const pages: PageObjectResponse[] = [];
    let cursor: string | undefined;

    do {
      const response = await withRetry(() =>
        notion.databases.query({
          database_id: LOVES_DATABASE_ID,
          filter: {
            property: "Published",
            checkbox: { equals: true },
          },
          sorts: [{ timestamp: "last_edited_time", direction: "descending" }],
          start_cursor: cursor,
        })
      );

      for (const page of response.results) {
        if ("properties" in page) {
          pages.push(page as PageObjectResponse);
        }
      }
      cursor = response.has_more ? response.next_cursor ?? undefined : undefined;
    } while (cursor);

    const items = pages
      .map(extractLoveProperties)
      // Drop rows with no name — nothing to label a card with (likely a draft).
      .filter((item) => item.title.trim() !== "")
      // Manual Order ascending, nulls last; ties keep the query's last-edited-desc.
      .sort((a, b) => {
        if (a.order == null && b.order == null) return 0;
        if (a.order == null) return 1;
        if (b.order == null) return -1;
        return a.order - b.order;
      });

    const categoryOrder = await fetchTypeOptionOrder();
    return { items, categoryOrder };
  } catch {
    return { items: [], categoryOrder: [] };
  }
}

/** Back-compat convenience: just the items (Organize-by-topic order aside). */
export async function getLovesItems(): Promise<LoveItem[]> {
  return (await getLovesData()).items;
}
