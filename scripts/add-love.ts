/**
 * Add one URL to the "Things I Love" Notion database and enrich it in place.
 *
 *   npx tsx scripts/add-love.ts "https://…"
 *
 * Backs the desktop "Add to Things I Love" app: it creates a row holding just
 * the URL (Published = true), runs the URL-first enrichment on that single row
 * (auto-detecting Name, Type, cover, subtitle, note), then refreshes the live
 * site. Prints a single human-readable status line as its LAST stdout line so
 * the AppleScript wrapper can show it in a notification.
 *
 * Loads .env.local (then .env) before touching Notion, exactly like
 * enrich-loves.ts. The row is Published on creation so it goes straight to the
 * site; Monty can untick Published in Notion later if he wants to pull it.
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
  // Args: <url> [--cover <imageUrl>]. --cover pins the page cover to the photo
  // the user chose in the picker; enrichment then fills everything else but
  // leaves the (now non-empty) cover alone.
  const args = process.argv.slice(2);
  let cover: string | undefined;
  const positional: string[] = [];
  for (let i = 0; i < args.length; i++) {
    if (args[i] === "--cover") cover = args[++i];
    else positional.push(args[i]);
  }

  const input = positional[0]?.trim();
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
  // Create the row UNPUBLISHED. enrichById() skips published rows
  // (needsEnrichment bails on `row.published`), so publishing on creation would
  // leave the row blank forever. We flip Published=true below, after enrichment
  // has actually filled Name/Type/cover/subtitle.
  if (publishedProp) properties[publishedProp] = { checkbox: false };

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const createParams: any = {
    parent: { database_id: dbId },
    properties,
  };
  if (cover && /^https?:\/\//i.test(cover)) {
    createParams.cover = { type: "external", external: { url: cover } };
  }
  const page = await notion.pages.create(createParams);

  // Enrich the row we just created (dynamic import so env is already loaded).
  const { enrichById } = await import("../src/lib/enrich/index");
  const result = await enrichById(page.id);

  // Publish only once enrichment produced a usable card, so a blank row never
  // reaches the site. If nothing was found, the row stays unpublished for Monty
  // to finish by hand in Notion.
  if (publishedProp && result.status === "enriched") {
    try {
      await notion.pages.update({
        page_id: page.id,
        properties: { [publishedProp]: { checkbox: true } },
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
      } as any);
    } catch {
      // Non-fatal: the row is enriched; Monty can tick Published by hand.
    }
  }

  // Refresh the live site so the new (now published) row shows without waiting.
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
    done(`Added + published "${name}" (${result.type ?? "?"}). It's live.`);
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
