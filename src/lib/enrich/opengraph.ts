import { fetchRetry } from "./http";

/**
 * OpenGraph facts scraped from an arbitrary page. Every field is best-effort;
 * `finalUrl` is the URL after any redirects and is always present on success.
 */
export interface OpenGraph {
  title?: string;
  description?: string;
  image?: string;
  siteName?: string;
  /** og:type, e.g. "video.other", "book", "article". Lowercased. */
  type?: string;
  /** og:url canonical link, if the page declares one. */
  canonicalUrl?: string;
  finalUrl: string;
}

// A handful of named HTML entities show up constantly in titles; decode those
// plus any numeric entity. Good enough for meta-tag content (not full HTML).
const NAMED_ENTITIES: Record<string, string> = {
  amp: "&",
  lt: "<",
  gt: ">",
  quot: '"',
  apos: "'",
  nbsp: " ",
  "#39": "'",
};

function decodeEntities(s: string): string {
  return s.replace(/&(#x?[0-9a-f]+|[a-z]+);/gi, (whole, body: string) => {
    const key = body.toLowerCase();
    if (key in NAMED_ENTITIES) return NAMED_ENTITIES[key];
    if (body[0] === "#") {
      const code =
        body[1] === "x" || body[1] === "X"
          ? parseInt(body.slice(2), 16)
          : parseInt(body.slice(1), 10);
      return Number.isFinite(code) ? String.fromCodePoint(code) : whole;
    }
    return whole;
  });
}

/** Pull a single attribute's value (double- or single-quoted) from one tag. */
function attr(tag: string, name: string): string | undefined {
  const re = new RegExp(`${name}\\s*=\\s*("([^"]*)"|'([^']*)')`, "i");
  const m = tag.match(re);
  if (!m) return undefined;
  const raw = m[2] ?? m[3] ?? "";
  return decodeEntities(raw).trim();
}

/** Collect every <meta property|name=... content=...> pair, key lowercased. */
function readMeta(html: string): Map<string, string> {
  const out = new Map<string, string>();
  const metaRe = /<meta\b[^>]*>/gi;
  let m: RegExpExecArray | null;
  while ((m = metaRe.exec(html))) {
    const tag = m[0];
    const key = attr(tag, "property") ?? attr(tag, "name");
    const value = attr(tag, "content");
    // First occurrence wins (og tags usually appear once, near the top).
    if (key && value && !out.has(key.toLowerCase())) {
      out.set(key.toLowerCase(), value);
    }
  }
  return out;
}

function readTitleTag(html: string): string | undefined {
  const m = html.match(/<title[^>]*>([^<]*)<\/title>/i);
  return m ? decodeEntities(m[1]).trim() || undefined : undefined;
}

/** Resolve a possibly-relative image URL against the page it came from. */
function absolutize(image: string | undefined, base: string): string | undefined {
  if (!image) return undefined;
  try {
    return new URL(image, base).toString();
  } catch {
    return image;
  }
}

/**
 * Fetch a page and extract its OpenGraph metadata. Returns null when the URL is
 * unreachable or clearly not HTML. Uses a browser-like User-Agent because many
 * sites 403 the default fetch agent, and caps the body read so a giant page
 * cannot hang an unattended run.
 */
export async function fetchOpenGraph(rawUrl: string): Promise<OpenGraph | null> {
  let target: string;
  try {
    target = new URL(rawUrl).toString();
  } catch {
    return null;
  }

  let res: Response;
  try {
    res = await fetchRetry(target, {
      redirect: "follow",
      headers: {
        "User-Agent":
          "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 " +
          "(KHTML, like Gecko) Chrome/124.0 Safari/537.36",
        Accept: "text/html,application/xhtml+xml",
      },
    });
  } catch {
    return null;
  }
  if (!res.ok) return null;

  const contentType = res.headers.get("content-type") ?? "";
  if (contentType && !contentType.includes("html")) return null;

  const finalUrl = res.url || target;
  // Only the <head> matters for OG tags; 512KB is plenty and bounds the read.
  const full = await res.text();
  const html = full.slice(0, 512 * 1024);
  const meta = readMeta(html);

  const title =
    meta.get("og:title") ?? meta.get("twitter:title") ?? readTitleTag(html);
  const description =
    meta.get("og:description") ?? meta.get("twitter:description") ?? meta.get("description");
  const image =
    meta.get("og:image:secure_url") ??
    meta.get("og:image") ??
    meta.get("twitter:image") ??
    meta.get("twitter:image:src");

  return {
    title,
    description,
    image: absolutize(image, finalUrl),
    siteName: meta.get("og:site_name"),
    type: meta.get("og:type")?.toLowerCase(),
    canonicalUrl: meta.get("og:url"),
    finalUrl,
  };
}
