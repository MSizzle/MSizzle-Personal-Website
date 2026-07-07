import type { EnrichInput, ProviderResult } from "./types";
import { fetchRetry } from "./http";

const TMDB_BASE = "https://api.themoviedb.org/3";
const POSTER_BASE = "https://image.tmdb.org/t/p/w500";

interface TmdbMovie {
  id: number;
  title: string;
  release_date?: string;
  poster_path?: string | null;
  overview?: string;
}

/**
 * Movie lookup via TMDB. Feature-flagged on TMDB_API_KEY: with no key this
 * returns null and the row is left for a manual pass. Grabs poster + director
 * + year; keeps the overview to seed the Note draft.
 */
export async function tmdbLookup(
  input: EnrichInput
): Promise<ProviderResult | null> {
  const key = process.env.TMDB_API_KEY;
  if (!key) return null;

  const searchUrl = `${TMDB_BASE}/search/movie?api_key=${key}&query=${encodeURIComponent(
    input.title
  )}&include_adult=false`;
  const res = await fetchRetry(searchUrl);
  if (!res.ok) return null;

  const data = (await res.json()) as { results?: TmdbMovie[] };
  const movie = data.results?.[0];
  if (!movie) return null;

  const year = movie.release_date ? movie.release_date.slice(0, 4) : "";

  // A second call for the director (not in search results).
  let director = "";
  try {
    const creditsRes = await fetchRetry(
      `${TMDB_BASE}/movie/${movie.id}/credits?api_key=${key}`
    );
    if (creditsRes.ok) {
      const credits = (await creditsRes.json()) as {
        crew?: { job?: string; name?: string }[];
      };
      director = credits.crew?.find((c) => c.job === "Director")?.name ?? "";
    }
  } catch {
    // Non-fatal: fall back to just the year.
  }

  const subtitle = [director, year].filter(Boolean).join(", ");

  return {
    coverUrl: movie.poster_path
      ? `${POSTER_BASE}${movie.poster_path}`
      : undefined,
    subtitle: subtitle || undefined,
    url: `https://www.themoviedb.org/movie/${movie.id}`,
    context: movie.overview || undefined,
  };
}
