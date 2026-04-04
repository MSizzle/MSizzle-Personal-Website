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

const PROJECTS_DATABASE_ID = process.env.NOTION_PROJECTS_DATABASE_ID!;

export interface Project {
  id: string;
  slug: string;
  title: string;
  description: string;
  image: string | null;
  externalUrl: string;
  tags: string[];
  featured: boolean;
  published: boolean;
  lastEdited: string;
}

function extractProjectProperties(page: PageObjectResponse): Project {
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

  const tagsProp = props["Tags"] || props["tags"];
  const tags =
    tagsProp?.type === "multi_select"
      ? tagsProp.multi_select.map((t) => t.name)
      : [];

  const urlProp = props["URL"] || props["url"];
  const externalUrl =
    urlProp?.type === "url" ? (urlProp.url ?? "") : "";

  const featuredProp = props["Featured"] || props["featured"];
  const featured =
    featuredProp?.type === "checkbox" ? featuredProp.checkbox : false;

  const image = page.cover
    ? page.cover.type === "external"
      ? page.cover.external.url
      : page.cover.file.url
    : null;

  return {
    id: page.id,
    slug,
    title,
    description,
    image,
    externalUrl,
    tags,
    featured,
    published,
    lastEdited: page.last_edited_time,
  };
}

export async function getPublishedProjects(): Promise<Project[]> {
  if (!process.env.NOTION_TOKEN || !process.env.NOTION_PROJECTS_DATABASE_ID) {
    return [];
  }

  try {
    const pages: PageObjectResponse[] = [];
    let cursor: string | undefined;

    do {
      const response = await withRetry(() =>
        notion.databases.query({
          database_id: PROJECTS_DATABASE_ID,
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

    return pages.map(extractProjectProperties);
  } catch {
    return [];
  }
}

export async function getProjectBySlug(
  slug: string
): Promise<Project | null> {
  if (!process.env.NOTION_TOKEN || !process.env.NOTION_PROJECTS_DATABASE_ID) {
    return null;
  }

  try {
    const response = await withRetry(() =>
      notion.databases.query({
        database_id: PROJECTS_DATABASE_ID,
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
    return extractProjectProperties(page as PageObjectResponse);
  } catch {
    return null;
  }
}

export async function getFeaturedProjects(): Promise<Project[]> {
  if (!process.env.NOTION_TOKEN || !process.env.NOTION_PROJECTS_DATABASE_ID) {
    return [];
  }

  try {
    const pages: PageObjectResponse[] = [];
    let cursor: string | undefined;

    do {
      const response = await withRetry(() =>
        notion.databases.query({
          database_id: PROJECTS_DATABASE_ID,
          filter: {
            and: [
              { property: "Published", checkbox: { equals: true } },
              { property: "Featured", checkbox: { equals: true } },
            ],
          },
          sorts: [{ property: "Date", direction: "descending" }],
          page_size: 3,
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

    return pages.slice(0, 3).map(extractProjectProperties);
  } catch {
    return [];
  }
}
