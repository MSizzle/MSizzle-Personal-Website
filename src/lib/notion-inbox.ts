import { Client } from "@notionhq/client";

// Create Notion client at module level, matching notion-loves.ts pattern.
const notion = new Client({ auth: process.env.NOTION_TOKEN });

export type InboxEntryInput = {
  message: string;
  name?: string;
  contact?: string;
  path?: string;
};

/**
 * Create a page in the Inbox database with message + optional sender/contact fields.
 * Throws if NOTION_INBOX_DB_ID is not set.
 */
export async function createInboxEntry(input: InboxEntryInput): Promise<void> {
  const dbId = process.env.NOTION_INBOX_DB_ID;
  if (!dbId) {
    throw new Error("NOTION_INBOX_DB_ID not set");
  }

  // Title: first 80 chars, whitespace collapsed, "..." suffix if truncated.
  const collapsed = input.message.replace(/\s+/g, " ").trim();
  const title =
    collapsed.length > 80 ? collapsed.slice(0, 80) + "..." : collapsed;

  // Message segments: Notion caps one text segment at 2000 chars.
  const segments: Array<{
    type: "text";
    text: { content: string };
  }> = [];
  for (let i = 0; i < input.message.length; i += 2000) {
    segments.push({
      type: "text",
      text: { content: input.message.slice(i, i + 2000) },
    });
  }

  // Build properties object with exact keys.
  type PageProperties = Parameters<typeof notion.pages.create>[0]["properties"];
  const properties: PageProperties = {
    Name: {
      title: [{ type: "text" as const, text: { content: title } }],
    },
    Message: {
      rich_text: segments,
    },
    Status: {
      select: { name: "New" },
    },
    Received: {
      date: { start: new Date().toISOString() },
    },
  };

  // Add optional fields only if provided and non-empty.
  if (typeof input.name === "string" && input.name.length > 0) {
    properties.Sender = {
      rich_text: [{ type: "text" as const, text: { content: input.name } }],
    };
  }
  if (typeof input.contact === "string" && input.contact.length > 0) {
    properties.Contact = {
      rich_text: [{ type: "text" as const, text: { content: input.contact } }],
    };
  }
  if (typeof input.path === "string" && input.path.length > 0) {
    properties.Page = {
      rich_text: [{ type: "text" as const, text: { content: input.path } }],
    };
  }

  await notion.pages.create({
    parent: { database_id: dbId },
    properties,
  });
}
