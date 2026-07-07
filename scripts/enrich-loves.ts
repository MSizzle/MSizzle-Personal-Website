/**
 * CLI entry for "Things I Love" auto-enrichment.
 *
 *   npm run enrich-loves            # enrich every candidate row, then refresh the site
 *   npm run enrich-loves -- --dry   # show what WOULD be written, change nothing
 *
 * Loads .env.local (then .env) before importing the engine, so the Notion client
 * sees the token. Keyless sources (Book / YouTube / Place / Thing) work with no
 * extra setup; movies need TMDB_API_KEY and Note drafts need ANTHROPIC_API_KEY.
 */
import { config } from "dotenv";

config({ path: ".env.local" });
config({ path: ".env" });

async function main() {
  const dryRun =
    process.argv.includes("--dry") || process.argv.includes("--dry-run");

  // Dynamic import AFTER env is loaded (the engine builds its Notion client lazily,
  // but this also keeps env resolution unambiguous).
  const { enrichAll, summarize } = await import("../src/lib/enrich/index");

  console.log(
    dryRun
      ? "Scanning Things I Love (dry run — nothing will be written)...\n"
      : "Scanning Things I Love and enriching candidates...\n"
  );

  const results = await enrichAll({ dryRun });
  const s = summarize(results);

  for (const r of results) {
    const fields = r.fields.length ? r.fields.join(", ") : "-";
    const mark =
      r.status === "enriched"
        ? dryRun
          ? "would write"
          : "wrote"
        : r.status;
    console.log(
      `  [${mark}] ${r.title || "(untitled)"} (${r.type ?? "?"})` +
        (r.fields.length ? ` -> ${fields}` : "") +
        (r.reason ? `  (${r.reason})` : "")
    );
  }

  console.log(
    `\nDone. ${s.enriched} ${dryRun ? "to enrich" : "enriched"}, ` +
      `${s.noData} without source data, ${s.errors} errors ` +
      `(scanned ${s.total} candidate rows).`
  );

  // Refresh the live site so enriched rows appear without waiting for ISR.
  if (!dryRun && s.enriched > 0) {
    const site = process.env.NEXT_PUBLIC_SITE_URL;
    const token = process.env.ENRICH_LOVES_TOKEN;
    if (site && token) {
      try {
        const res = await fetch(
          `${site.replace(/\/$/, "")}/api/revalidate?token=${encodeURIComponent(token)}`
        );
        console.log(
          res.ok
            ? "Triggered on-demand revalidation of the live site."
            : `Revalidation request returned ${res.status}.`
        );
      } catch {
        console.log("Could not reach the revalidation endpoint (site may be local).");
      }
    } else {
      console.log(
        "Set NEXT_PUBLIC_SITE_URL + ENRICH_LOVES_TOKEN to auto-refresh the live site."
      );
    }
  }
}

main().catch((err) => {
  console.error("\nenrich-loves failed:", err instanceof Error ? err.message : err);
  process.exit(1);
});
