/**
 * Fetch cover-photo candidates (and the proposed fields) for a URL, WITHOUT
 * writing anything to Notion. Backs the desktop app's photo picker: it shows the
 * candidates, the user picks one, then add-love.ts is called with --cover.
 *
 *   npx tsx scripts/love-candidates.ts "https://…"
 *
 * Prints ONE line of JSON: { title, type, subtitle, note, candidates: string[] }
 * (or { error } on failure). candidates[0] is the auto-picked cover.
 */
import { config } from "dotenv";

config({ path: ".env.local" });
config({ path: ".env" });

function emit(obj: unknown, code = 0): never {
  console.log(JSON.stringify(obj));
  process.exit(code);
}

async function main() {
  const input = process.argv[2]?.trim();
  if (!input) emit({ error: "No URL provided." }, 1);

  let url: string;
  try {
    url = new URL(input).toString();
  } catch {
    emit({ error: "Not a valid URL." }, 1);
  }

  const { enrichFromUrl } = await import("../src/lib/enrich/from-url");
  const r = await enrichFromUrl(url, { candidates: true });
  if (!r) emit({ error: "Could not read that page." }, 1);

  emit({
    title: r.title ?? "",
    type: r.type ?? "",
    subtitle: r.subtitle ?? "",
    note: r.note ?? "",
    candidates: r.candidates ?? [],
  });
}

main().catch((err) => {
  emit({ error: err instanceof Error ? err.message : String(err) }, 1);
});
