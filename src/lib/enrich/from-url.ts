import type { LoveType } from "@/lib/notion-loves";
import { fetchRetry } from "./http";
import { fetchOpenGraph, type OpenGraph } from "./opengraph";

/**
 * The URL-first path: hand it a single URL and it returns everything needed to
 * fill a "Things I Love" row (title, auto-detected Type, subtitle, note, cover).
 * Every field is optional; the engine only writes the blanks it gets back.
 */
export interface UrlEnrichResult {
  title?: string;
  type?: LoveType;
  subtitle?: string;
  note?: string;
  coverUrl?: string;
  /** Canonical URL to store back (defaults to the input if none found). */
  url?: string;
}

const VALID_TYPES: LoveType[] = ["Place", "Book", "Movie", "YouTube", "Thing"];
const DEFAULT_MODEL = "claude-haiku-4-5-20251001";

function hostOf(url: string): string {
  try {
    return new URL(url).hostname.toLowerCase().replace(/^www\./, "");
  } catch {
    return "";
  }
}

function isYouTube(host: string): boolean {
  return host === "youtube.com" || host === "youtu.be" || host.endsWith(".youtube.com");
}

/** Best-effort Type when we have no Anthropic key, from og:type + the domain. */
function heuristicType(og: OpenGraph, host: string): LoveType {
  if (isYouTube(host)) return "YouTube";
  const t = og.type ?? "";
  if (t.includes("book")) return "Book";
  if (t.includes("movie") || t.includes("film")) return "Movie";
  if (
    t.includes("place") ||
    t.includes("restaurant") ||
    t.includes("business") ||
    t.includes("hotel")
  ) {
    return "Place";
  }
  return "Thing";
}

interface YouTubeExtra {
  channel?: string;
  title?: string;
  thumbnail?: string;
}

/** oEmbed gives us the channel (great subtitle) and a title fallback. */
async function youtubeExtra(watchUrl: string): Promise<YouTubeExtra | null> {
  try {
    const res = await fetchRetry(
      `https://www.youtube.com/oembed?url=${encodeURIComponent(watchUrl)}&format=json`
    );
    if (!res.ok) return null;
    const data = (await res.json()) as {
      title?: string;
      author_name?: string;
      thumbnail_url?: string;
    };
    return {
      channel: data.author_name,
      title: data.title,
      thumbnail: data.thumbnail_url,
    };
  } catch {
    return null;
  }
}

/** Grab a clean poster from TMDB when the URL is a themoviedb.org movie page. */
async function tmdbPoster(host: string, url: string): Promise<string | undefined> {
  const key = process.env.TMDB_API_KEY;
  if (!key || !host.endsWith("themoviedb.org")) return undefined;
  const idMatch = url.match(/\/movie\/(\d+)/);
  if (!idMatch) return undefined;
  try {
    const res = await fetchRetry(
      `https://api.themoviedb.org/3/movie/${idMatch[1]}?api_key=${key}`
    );
    if (!res.ok) return undefined;
    const data = (await res.json()) as { poster_path?: string | null };
    return data.poster_path
      ? `https://image.tmdb.org/t/p/w500${data.poster_path}`
      : undefined;
  } catch {
    return undefined;
  }
}

interface AiExtract {
  title?: string;
  type?: LoveType;
  subtitle?: string;
  note?: string;
}

const AI_SYSTEM = [
  "You extract structured metadata for a card on Monty's \"Things I Love\" pinboard,",
  "from the OpenGraph metadata of a web page he pasted a link to.",
  "",
  "Detect the item TYPE yourself (Monty does not set it):",
  "- Movie: a film or TV show. subtitle = \"Director, Year\" when known.",
  "- Book: subtitle = the author.",
  "- YouTube: a YouTube video. subtitle = the channel name.",
  "- Place: a physical location (restaurant, city, park, museum, hotel, shop).",
  "- Thing: anything else (a product, gadget, app, website, tool, or hobby).",
  "",
  "The note is the short \"why I love this\" line shown when the card opens.",
  "Voice: first person, warm but restrained, specific, understated. Sound like a",
  "real person jotting a quick note, not a marketer.",
  "",
  "Hard rules:",
  "- title: the clean item name, not the page's full <title> with site suffixes.",
  "- subtitle: one short credit line; empty string if you are unsure.",
  "- note: one or two short sentences, OR an empty string if you do not genuinely",
  "  recognize the item (never invent facts about it).",
  "- NEVER use an em dash or en dash anywhere. Use commas, periods, or parentheses.",
  "- No hype words (\"must-read\", \"masterpiece\", \"stunning\").",
].join("\n");

/** One forced-tool call returns {title, type, subtitle, note}. Null with no key. */
async function aiExtract(
  og: OpenGraph,
  host: string
): Promise<AiExtract | null> {
  const key = process.env.ANTHROPIC_API_KEY;
  if (!key) return null;
  const model = process.env.ENRICH_NOTE_MODEL || DEFAULT_MODEL;

  const userLines = [
    `URL: ${og.canonicalUrl ?? og.finalUrl}`,
    `Domain: ${host}`,
  ];
  if (og.siteName) userLines.push(`Site name: ${og.siteName}`);
  if (og.type) userLines.push(`og:type: ${og.type}`);
  if (og.title) userLines.push(`Page title: ${og.title}`);
  if (og.description)
    userLines.push(`Description: ${og.description.slice(0, 800)}`);

  try {
    const res = await fetch("https://api.anthropic.com/v1/messages", {
      method: "POST",
      headers: {
        "x-api-key": key,
        "anthropic-version": "2023-06-01",
        "content-type": "application/json",
      },
      body: JSON.stringify({
        model,
        max_tokens: 400,
        system: AI_SYSTEM,
        tool_choice: { type: "tool", name: "record_item" },
        tools: [
          {
            name: "record_item",
            description: "Record the extracted card metadata.",
            input_schema: {
              type: "object",
              properties: {
                title: { type: "string", description: "Clean item name." },
                itemType: {
                  type: "string",
                  enum: VALID_TYPES,
                  description: "Detected type.",
                },
                subtitle: {
                  type: "string",
                  description: "Short credit line, or empty string.",
                },
                note: {
                  type: "string",
                  description: "One or two sentence note, or empty string.",
                },
              },
              required: ["title", "itemType"],
            },
          },
        ],
        messages: [{ role: "user", content: userLines.join("\n") }],
      }),
    });
    if (!res.ok) return null;

    const data = (await res.json()) as {
      content?: { type: string; input?: Record<string, unknown> }[];
    };
    const block = (data.content ?? []).find((b) => b.type === "tool_use");
    const input = block?.input;
    if (!input) return null;

    const clean = (v: unknown): string | undefined => {
      if (typeof v !== "string") return undefined;
      const s = v.replace(/\s*[—–]\s*/g, ", ").trim();
      return s || undefined;
    };
    const rawType = typeof input.itemType === "string" ? input.itemType : "";
    const type = VALID_TYPES.includes(rawType as LoveType)
      ? (rawType as LoveType)
      : undefined;

    return {
      title: clean(input.title),
      type,
      subtitle: clean(input.subtitle),
      note: clean(input.note),
    };
  } catch {
    return null;
  }
}

/**
 * Turn a single pasted URL into a fillable set of card fields. Fetches the page's
 * OpenGraph tags, enhances the cover / subtitle for known sources (YouTube,
 * TMDB), and runs one structured Claude call to detect the Type and draft a note.
 * With no ANTHROPIC_API_KEY it degrades to OG-only (og:title + a heuristic Type).
 * Returns null only when the page cannot be fetched at all.
 */
export async function enrichFromUrl(rawUrl: string): Promise<UrlEnrichResult | null> {
  const og = await fetchOpenGraph(rawUrl);
  if (!og) return null;

  const host = hostOf(og.finalUrl);
  const yt = isYouTube(host) ? await youtubeExtra(rawUrl) : null;

  const ai = await aiExtract(og, host);

  const title = ai?.title ?? og.title ?? yt?.title;
  const type = ai?.type ?? heuristicType(og, host);

  // YouTube channel is authoritative for the subtitle; otherwise trust the AI.
  const subtitle =
    type === "YouTube" && yt?.channel ? yt.channel : ai?.subtitle;

  const coverUrl =
    (await tmdbPoster(host, og.finalUrl)) ?? og.image ?? yt?.thumbnail;

  return {
    title,
    type,
    subtitle,
    note: ai?.note,
    coverUrl,
    url: og.canonicalUrl ?? og.finalUrl ?? rawUrl,
  };
}
