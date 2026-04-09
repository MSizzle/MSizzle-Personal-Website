import { Client } from "@notionhq/client";
import type {
  PageObjectResponse,
} from "@notionhq/client/build/src/api-endpoints";
import pLimit from "p-limit";

// --- Client & rate limiter ---

const notion = new Client({ auth: process.env.NOTION_TOKEN });

// Notion allows 3 req/s — keep headroom at 2 concurrent
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

// --- Database queries ---

const EVENTS_DATABASE_ID = process.env.NOTION_EVENTS_DB_ID!;

export interface EventItem {
  id: string;
  name: string;
  date: string | null;       // ISO date string from Notion date property
  endDate: string | null;    // end date if range provided
  location: string;
  link: string | null;
  description: string;
  emoji: string | null;
  published: boolean;
}

function extractEventProperties(page: PageObjectResponse): EventItem {
  const props = page.properties;

  const titleProp = props["Name"] || props["Title"] || props["title"];
  const name =
    titleProp?.type === "title"
      ? titleProp.title.map((t) => t.plain_text).join("")
      : "Untitled";

  const dateProp = props["Date"] || props["date"];
  const date =
    dateProp?.type === "date" ? (dateProp.date?.start ?? null) : null;
  const endDate =
    dateProp?.type === "date" ? (dateProp.date?.end ?? null) : null;

  const locationProp = props["Location"] || props["location"];
  const location =
    locationProp?.type === "rich_text"
      ? locationProp.rich_text.map((t) => t.plain_text).join("")
      : "";

  const linkProp = props["Link"] || props["link"];
  const link =
    linkProp?.type === "url" ? (linkProp.url ?? null) : null;

  const descProp = props["Description"] || props["description"];
  const description =
    descProp?.type === "rich_text"
      ? descProp.rich_text.map((t) => t.plain_text).join("")
      : "";

  const publishedProp = props["Published"] || props["published"];
  const published =
    publishedProp?.type === "checkbox" ? publishedProp.checkbox : false;

  const emoji = page.icon?.type === "emoji" ? page.icon.emoji : null;

  return {
    id: page.id,
    name,
    date,
    endDate,
    location,
    link,
    description,
    emoji,
    published,
  };
}

export async function getPublishedEvents(): Promise<EventItem[]> {
  if (!process.env.NOTION_TOKEN || !process.env.NOTION_EVENTS_DB_ID) {
    return [];
  }

  try {
    const pages: PageObjectResponse[] = [];
    let cursor: string | undefined;

    do {
      const response = await withRetry(() =>
        notion.databases.query({
          database_id: EVENTS_DATABASE_ID,
          filter: {
            property: "Published",
            checkbox: { equals: true },
          },
          sorts: [{ property: "Date", direction: "ascending" }],
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

    return pages.map(extractEventProperties);
  } catch {
    return [];
  }
}

export async function getUpcomingEvents(): Promise<EventItem[]> {
  if (!process.env.NOTION_TOKEN || !process.env.NOTION_EVENTS_DB_ID) {
    return [];
  }

  const today = new Date().toISOString().split("T")[0];

  try {
    const pages: PageObjectResponse[] = [];
    let cursor: string | undefined;

    do {
      const response = await withRetry(() =>
        notion.databases.query({
          database_id: EVENTS_DATABASE_ID,
          filter: {
            and: [
              { property: "Published", checkbox: { equals: true } },
              { property: "Date", date: { on_or_after: today } },
            ],
          },
          sorts: [{ property: "Date", direction: "ascending" }],
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

    return pages.map(extractEventProperties);
  } catch {
    return [];
  }
}

export async function getPastEvents(): Promise<EventItem[]> {
  if (!process.env.NOTION_TOKEN || !process.env.NOTION_EVENTS_DB_ID) {
    return [];
  }

  const today = new Date().toISOString().split("T")[0];

  try {
    const pages: PageObjectResponse[] = [];
    let cursor: string | undefined;

    do {
      const response = await withRetry(() =>
        notion.databases.query({
          database_id: EVENTS_DATABASE_ID,
          filter: {
            and: [
              { property: "Published", checkbox: { equals: true } },
              { property: "Date", date: { before: today } },
            ],
          },
          sorts: [{ property: "Date", direction: "descending" }],
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

    return pages.map(extractEventProperties);
  } catch {
    return [];
  }
}
