import type { EnrichInput, ProviderResult } from "./types";
import { fetchRetry } from "./http";

interface OEmbed {
  title?: string;
  author_name?: string;
  thumbnail_url?: string;
}

/**
 * YouTube lookup via oEmbed (no API key). Needs the watch URL already on the row
 * (that IS the input for a video). Fills the channel as the subtitle; the cover
 * is a fallback only, since the pinboard derives its own thumbnail from the URL.
 */
export async function youtubeLookup(
  input: EnrichInput
): Promise<ProviderResult | null> {
  const watchUrl = input.url?.trim();
  if (!watchUrl) return null;

  const res = await fetchRetry(
    `https://www.youtube.com/oembed?url=${encodeURIComponent(watchUrl)}&format=json`
  );
  if (!res.ok) return null;

  const data = (await res.json()) as OEmbed;

  return {
    coverUrl: data.thumbnail_url,
    subtitle: data.author_name,
    url: watchUrl,
    context: data.title,
  };
}
