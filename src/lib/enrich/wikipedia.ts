import type { EnrichInput, ProviderResult } from "./types";
import { fetchRetry } from "./http";

interface WikiPage {
  title?: string;
  fullurl?: string;
  description?: string;
  extract?: string;
  original?: { source?: string };
  thumbnail?: { source?: string };
}

/** Uppercase the first letter of a Wikidata short description. */
function tidy(desc?: string): string | undefined {
  if (!desc) return undefined;
  const trimmed = desc.trim();
  if (!trimmed) return undefined;
  return trimmed.charAt(0).toUpperCase() + trimmed.slice(1);
}

/**
 * Place / Thing lookup via the Wikipedia action API (no key). One request pulls
 * the best-matching page's lead image, Wikidata short description (great as a
 * subtitle), canonical URL, and intro extract (to seed the Note draft). Best
 * effort: obscure entries return null and are left for a manual pass.
 */
export async function wikipediaLookup(
  input: EnrichInput
): Promise<ProviderResult | null> {
  const params = new URLSearchParams({
    action: "query",
    format: "json",
    generator: "search",
    gsrsearch: input.title,
    gsrlimit: "1",
    prop: "pageimages|extracts|info|description",
    inprop: "url",
    piprop: "original|thumbnail",
    pithumbsize: "600",
    exintro: "1",
    explaintext: "1",
    origin: "*",
  });

  const res = await fetchRetry(`https://en.wikipedia.org/w/api.php?${params.toString()}`, {
    headers: {
      // Wikipedia asks API clients to identify themselves.
      "User-Agent": "MSizzleWebsite-LovesEnrich/1.0 (https://msizzle.com)",
    },
  });
  if (!res.ok) return null;

  const data = (await res.json()) as {
    query?: { pages?: Record<string, WikiPage> };
  };
  const pages = data.query?.pages;
  if (!pages) return null;

  const page = Object.values(pages)[0];
  if (!page) return null;

  const cover = page.original?.source ?? page.thumbnail?.source;

  return {
    coverUrl: cover,
    subtitle: tidy(page.description),
    url: page.fullurl,
    context: page.extract,
  };
}
