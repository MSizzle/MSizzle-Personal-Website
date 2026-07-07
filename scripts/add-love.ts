/**
 * Add one URL to the "Things I Love" Notion database and enrich it in place.
 *
 *   npx tsx scripts/add-love.ts "https://…"
 *
 * Backs the desktop "Add to Things I Love" app: it creates a draft row holding
 * just the URL (Published = false), runs the URL-first enrichment on that single
 * row (auto-detecting Name, Type, cover, subtitle, note), then refreshes the
 * live site. Prints a single human-readable status line as its LAST stdout line
 * so the AppleScript wrapper can show it in a notification.
 *
 * Loads .env.local (then .env) before touching Notion, exactly like
 * enrich-loves.ts. The row is left UNPUBLISHED on purpose: Monty reviews it in
 * Notion and ticks Published when he wants it on the site.
 */
import { config } from "dotenv";

config({ path: ".env.local" });
config({ path: ".env" });

/** Print the final status line and exit. Keeps the notification text tidy. */
function done(message: string, code = 0): never {
  console.log(message);
  process.exit(code);
}

async function main() {
  const input = process.argv[2]?.trim();
  if (!input) done("No URL provided.", 1);

  let url: string;
  try {
    url = new URL(input).toString();
  } catch {
    done(`Not a valid URL: ${input}`, 1);
  }

  const dbId = process.env.NOTION_LOVES_DB_ID;
  if (!process.env.NOTION_TOKEN || !dbId) {
    done("NOTION_TOKEN and NOTION_LOVES_DB_ID must be set in .env.local.", 1);
  }

  const { Client } = await import("@notionhq/client");
  const notion = new Client({ auth: process.env.NOTION_TOKEN });

  // Resolve the real property names from the DB schema (casing tolerant).
  const db = await notion.databases.retrieve({ database_id: dbId });
  const entries = Object.entries(db.properties) as [string, { type: string }][];
  const byType = (t: string) => entries.find(([, def]) => def.type === t)?.[0];
  const byName = (names: string[]) =>
    entries.find(([name]) => names.includes(name))?.[0];

  const titleProp = byType("title");
  const urlProp = byName(["URL", "url", "Url"]) ?? byType("url");
  const publishedProp = byName(["Published", "published"]);

  if (!titleProp || !urlProp) {
    done("Could not find the Name (title) or URL property on the database.", 1);
  }

  const properties: Record<string, unknown> = {
    // Empty title on purpose; URL-first enrichment fills it from the page.
    [titleProp]: { title: [] },
    [urlProp]: { url },
  };
  if (publishedProp) properties[publishedProp] = { checkbox: false };

  const page = await notion.pages.create({
    parent: { database_id: dbId },
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    properties: properties as any,
  });

  // Enrich the row we just created (dynamic import so env is already loaded).
  const { enrichById } = await import("../src/lib/enrich/index");
  const result = await enrichById(page.id);

  // Refresh the live site so the new (once published) row shows without waiting.
  const site = process.env.NEXT_PUBLIC_SITE_URL || "https://montysinger.com";
  const token = process.env.ENRICH_LOVES_TOKEN;
  if (token) {
    try {
      await fetch(
        `${site.replace(/\/$/, "")}/api/revalidate?token=${encodeURIComponent(token)}`
      );
    } catch {
      // Non-fatal: the row is saved; ISR will pick it up on its own schedule.
    }
  }

  const name = result.title?.trim() || "(untitled draft)";
  if (result.status === "enriched") {
    done(`Added "${name}" (${result.type ?? "?"}). Review + publish in Notion.`);
  }
  if (result.status === "no-data") {
    done(`Saved the URL, but found nothing to auto-fill. Finish it in Notion.`);
  }
  if (result.status === "error") {
    done(`Saved the URL, but enrichment failed: ${result.reason ?? "unknown"}`, 1);
  }
  done(`Saved the URL to Things I Love.`);
}

main().catch((err) => {
  const message = err instanceof Error ? err.message : String(err);
  console.log(`Failed: ${message}`);
  process.exit(1);
});
