/**
 * "Update Entries" action for the desktop app.
 *
 *   npx tsx scripts/refresh-loves.ts
 *
 * For when Monty edits the Things I Love rows himself in Notion and just wants
 * the live site to catch up. It runs enrichment across the DB (filling any blanks
 * on rows he added by hand) and then ALWAYS revalidates the site, even when
 * nothing needed enriching, so manual edits to already-published rows go live too.
 *
 * Prints a single human-readable status line LAST for the app to display.
 */
import { config } from "dotenv";

config({ path: ".env.local" });
config({ path: ".env" });

async function main() {
  const { enrichAll, summarize } = await import("../src/lib/enrich/index");

  const results = await enrichAll({ dryRun: false });
  const s = summarize(results);

  const site = (process.env.NEXT_PUBLIC_SITE_URL || "https://montysinger.com").replace(
    /\/$/,
    ""
  );
  const token = process.env.ENRICH_LOVES_TOKEN;

  let refreshed = false;
  if (token) {
    try {
      const res = await fetch(
        `${site}/api/revalidate?token=${encodeURIComponent(token)}`
      );
      refreshed = res.ok;
    } catch {
      refreshed = false;
    }
  }

  const bits: string[] = [];
  if (s.enriched > 0) bits.push(`enriched ${s.enriched}`);
  if (s.errors > 0) bits.push(`${s.errors} errors`);
  bits.push(refreshed ? "site refreshed" : "site refresh unavailable");

  console.log(`Up to date: ${bits.join(", ")}.`);
}

main().catch((err) => {
  console.log(`Failed: ${err instanceof Error ? err.message : String(err)}`);
  process.exit(1);
});
