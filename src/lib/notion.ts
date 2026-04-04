import { Client } from "@notionhq/client";
import type {
  PageObjectResponse,
  BlockObjectResponse,
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

const DATABASE_ID = process.env.NOTION_DATABASE_ID!;

export interface BlogPost {
  id: string;
  slug: string;
  title: string;
  description: string;
  published: boolean;
  date: string;
  tags: string[];
  cover: string | null;
  lastEdited: string;
}

function extractPageProperties(page: PageObjectResponse): BlogPost {
  const props = page.properties;

  const titleProp = props["Name"] || props["Title"] || props["title"];
  const title =
    titleProp?.type === "title"
      ? titleProp.title.map((t) => t.plain_text).join("")
      : "Untitled";

  const slugProp = props["Slug"] || props["slug"];
  const slug =
    slugProp?.type === "rich_text"
      ? slugProp.rich_text.map((t) => t.plain_text).join("")
      : page.id;

  const descProp = props["Description"] || props["description"];
  const description =
    descProp?.type === "rich_text"
      ? descProp.rich_text.map((t) => t.plain_text).join("")
      : "";

  const publishedProp = props["Published"] || props["published"];
  const published =
    publishedProp?.type === "checkbox" ? publishedProp.checkbox : false;

  const dateProp = props["Date"] || props["date"];
  const date =
    dateProp?.type === "date" ? (dateProp.date?.start ?? "") : "";

  const tagsProp = props["Tags"] || props["tags"];
  const tags =
    tagsProp?.type === "multi_select"
      ? tagsProp.multi_select.map((t) => t.name)
      : [];

  const cover = page.cover
    ? page.cover.type === "external"
      ? page.cover.external.url
      : page.cover.file.url
    : null;

  return {
    id: page.id,
    slug,
    title,
    description,
    published,
    date,
    tags,
    cover,
    lastEdited: page.last_edited_time,
  };
}

export async function getPublishedPosts(): Promise<BlogPost[]> {
  const pages: PageObjectResponse[] = [];
  let cursor: string | undefined;

  do {
    const response = await withRetry(() =>
      notion.databases.query({
        database_id: DATABASE_ID,
        filter: {
          property: "Published",
          checkbox: { equals: true },
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

  return pages.map(extractPageProperties);
}

export async function getPostBySlug(
  slug: string
): Promise<BlogPost | null> {
  const response = await withRetry(() =>
    notion.databases.query({
      database_id: DATABASE_ID,
      filter: {
        and: [
          { property: "Slug", rich_text: { equals: slug } },
          { property: "Published", checkbox: { equals: true } },
        ],
      },
      page_size: 1,
    })
  );

  const page = response.results[0];
  if (!page || !("properties" in page)) return null;
  return extractPageProperties(page as PageObjectResponse);
}

// --- Block fetching ---

export async function getBlocks(blockId: string): Promise<BlockObjectResponse[]> {
  const blocks: BlockObjectResponse[] = [];
  let cursor: string | undefined;

  do {
    const response = await withRetry(() =>
      notion.blocks.children.list({
        block_id: blockId,
        start_cursor: cursor,
        page_size: 100,
      })
    );

    for (const block of response.results) {
      if ("type" in block) {
        const b = block as BlockObjectResponse;
        blocks.push(b);

        // Fetch nested children (toggles, synced blocks, etc.)
        if (b.has_children) {
          const children = await getBlocks(b.id);
          (b as BlockObjectResponse & { children: BlockObjectResponse[] }).children = children;
        }
      }
    }
    cursor = response.has_more ? response.next_cursor ?? undefined : undefined;
  } while (cursor);

  return blocks;
}

// --- Image URL refresh ---

export async function getFreshImageUrl(blockId: string): Promise<string | null> {
  const block = await withRetry(() => notion.blocks.retrieve({ block_id: blockId }));

  if (!("type" in block)) return null;
  const b = block as BlockObjectResponse;

  if (b.type === "image") {
    const img = b.image;
    if (img.type === "file") return img.file.url;
    if (img.type === "external") return img.external.url;
  }

  return null;
}
