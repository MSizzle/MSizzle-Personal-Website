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

export type LoveType = "Place" | "Book" | "YouTube" | "Hobby";
const LOVE_TYPES: LoveType[] = ["Place", "Book", "YouTube", "Hobby"];

export interface LoveItem {
  id: string;
  /** Card style: drives which face renders. */
  type: LoveType;
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
  // Notion label "Thing" maps to the generic Hobby card style.
  const normalizedType = rawType === "Thing" ? "Hobby" : rawType;
  const type: LoveType = LOVE_TYPES.includes(normalizedType as LoveType)
    ? (normalizedType as LoveType)
    : "Place";

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

/**
 * Fetch every Published item from the "Things I Love" Notion database, sorted
 * by manual Order (ascending, nulls last) then most-recently-edited.
 *
 * Gated behind NOTION_LOVES_DB_ID: with no database configured (or any Notion
 * failure) this returns [] so the homepage falls back to its current design.
 */
export async function getLovesItems(): Promise<LoveItem[]> {
  if (!process.env.NOTION_TOKEN || !process.env.NOTION_LOVES_DB_ID) {
    return [];
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
      .filter((item) => item.title.trim() !== "");

    // Manual Order ascending, nulls last; ties keep the query's last-edited-desc.
    return items.sort((a, b) => {
      if (a.order == null && b.order == null) return 0;
      if (a.order == null) return 1;
      if (b.order == null) return -1;
      return a.order - b.order;
    });
  } catch {
    return [];
  }
}
