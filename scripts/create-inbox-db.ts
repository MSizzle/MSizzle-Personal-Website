/**
 * One-shot script to create the Inbox database for anonymous advice.
 * Usage: npm run create-inbox-db -- --parent <notion page id>
 *
 * Creates a database with Name, Message, Sender, Contact, Status, Received, Page.
 * Prints the database id for pasting into .env.local and Vercel.
 */
import { config } from "dotenv";

config({ path: ".env.local" });
config({ path: ".env" });

import { Client } from "@notionhq/client";

async function main() {
  const i = process.argv.indexOf("--parent");
  const parentId = i >= 0 ? process.argv[i + 1] : undefined;

  if (!parentId) {
    console.error("usage: npm run create-inbox-db -- --parent <notion page id>");
    process.exit(1);
  }

  if (!process.env.NOTION_TOKEN) {
    console.error("NOTION_TOKEN not set (add it to .env.local)");
    process.exit(1);
  }

  const notion = new Client({ auth: process.env.NOTION_TOKEN });

  const db = await notion.databases.create({
    parent: { type: "page_id", page_id: parentId },
    title: [{ type: "text", text: { content: "Inbox" } }],
    properties: {
      Name: { title: {} },
      Message: { rich_text: {} },
      Sender: { rich_text: {} },
      Contact: { rich_text: {} },
      Status: {
        select: {
          options: [
            { name: "New" },
            { name: "Read" },
            { name: "Replied" },
            { name: "Spam" },
          ],
        },
      },
      Received: { date: {} },
      Page: { rich_text: {} },
    },
  });

  console.log("Created Inbox database");
  console.log("url: " + ((db as { url?: string }).url ?? "(no url in response)"));
  console.log("NOTION_INBOX_DB_ID=" + db.id);
  console.log(
    "Paste that line into .env.local and into the Vercel project env."
  );
}

main().catch((err) => {
  console.error("create-inbox-db: " + (err as Error).message);
  process.exit(1);
});
