import type { EnrichInput, ProviderResult } from "./types";
import { fetchRetry } from "./http";

interface GoogleVolume {
  volumeInfo?: {
    authors?: string[];
    description?: string;
    infoLink?: string;
    imageLinks?: { thumbnail?: string; smallThumbnail?: string };
  };
}

interface OpenLibraryDoc {
  title?: string;
  author_name?: string[];
  cover_i?: number;
  key?: string;
}

/** Upgrade a Google Books cover URL: force https and drop the page-curl overlay. */
function cleanGoogleCover(raw?: string): string | undefined {
  if (!raw) return undefined;
  return raw.replace(/^http:/, "https:").replace(/&edge=curl/, "");
}

/** Primary book source: Google Books (richest metadata, incl. a description). */
async function googleBooks(input: EnrichInput): Promise<ProviderResult | null> {
  const key = process.env.GOOGLE_BOOKS_API_KEY;
  const url =
    `https://www.googleapis.com/books/v1/volumes?q=${encodeURIComponent(input.title)}` +
    `&maxResults=5&printType=books${key ? `&key=${key}` : ""}`;

  const res = await fetchRetry(url);
  if (!res.ok) return null;

  const data = (await res.json()) as { items?: GoogleVolume[] };
  const info = data.items?.[0]?.volumeInfo;
  if (!info) return null;

  const cover = cleanGoogleCover(
    info.imageLinks?.thumbnail ?? info.imageLinks?.smallThumbnail
  );
  const authors = info.authors?.length ? info.authors.join(", ") : undefined;

  // A hit with no cover and no author is not worth using; let the fallback try.
  if (!cover && !authors) return null;

  return {
    coverUrl: cover,
    subtitle: authors,
    url: info.infoLink,
    context: info.description,
  };
}

/** Fallback book source: Open Library (fully free, reliable, no key). */
async function openLibrary(input: EnrichInput): Promise<ProviderResult | null> {
  const url =
    `https://openlibrary.org/search.json?title=${encodeURIComponent(input.title)}` +
    `&limit=3&fields=title,author_name,cover_i,key`;

  const res = await fetchRetry(url);
  if (!res.ok) return null;

  const data = (await res.json()) as { docs?: OpenLibraryDoc[] };
  const doc = data.docs?.[0];
  if (!doc) return null;

  const cover =
    doc.cover_i != null
      ? `https://covers.openlibrary.org/b/id/${doc.cover_i}-L.jpg`
      : undefined;
  const authors = doc.author_name?.length
    ? doc.author_name.join(", ")
    : undefined;

  if (!cover && !authors) return null;

  return {
    coverUrl: cover,
    subtitle: authors,
    url: doc.key ? `https://openlibrary.org${doc.key}` : undefined,
    context: undefined,
  };
}

async function safe(
  fn: (input: EnrichInput) => Promise<ProviderResult | null>,
  input: EnrichInput
): Promise<ProviderResult | null> {
  try {
    return await fn(input);
  } catch {
    return null;
  }
}

/**
 * Book lookup (no key required). Uses Google Books for its richer metadata
 * (description, author), and Open Library to fill in a cover when Google has
 * none or is rate-limited (its keyless endpoint throttles hard from shared IPs).
 * The two sources are merged, preferring Google field-by-field.
 */
export async function bookLookup(
  input: EnrichInput
): Promise<ProviderResult | null> {
  const google = await safe(googleBooks, input);

  // Only pay for the second call when Google is missing or has no cover.
  const openlib =
    !google || !google.coverUrl ? await safe(openLibrary, input) : null;

  if (!google && !openlib) return null;

  return {
    coverUrl: google?.coverUrl ?? openlib?.coverUrl,
    subtitle: google?.subtitle ?? openlib?.subtitle,
    url: google?.url ?? openlib?.url,
    context: google?.context ?? openlib?.context,
  };
}
