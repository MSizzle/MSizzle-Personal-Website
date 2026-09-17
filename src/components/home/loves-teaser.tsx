import type { LoveItem } from "@/lib/notion-loves";

/**
 * LovesTeaser: a compact preview strip of "Things I Love" tiles, surfaced
 * high on the homepage (between Hero and Building) so visitors who never
 * scroll ~2100px down to the real 03 Things I Love band still see the
 * warmest, most personal content on the site. The whole strip is one link
 * down to the real band (#loves) -- a11y-friendlier than repeating the same
 * destination across five separate identical links, and simpler code.
 *
 * Deliberately does NOT import pinboard.tsx (Phase 22 owns that file's
 * recolor and is off-limits for this plan); the small cover-URL/fallback-
 * swatch logic below is a duplicate of pinboard.tsx's, not a reuse of it.
 *
 * Server Component: no drag, no interaction, just a handful of static tiles.
 * Renders nothing when there's no Loves data (Notion DB not configured yet,
 * empty, or Notion down) rather than showing a broken or misleadingly empty
 * strip.
 */

const TEASER_COUNT = 5;

/** Muted, on-brand fallback swatches for a tile with no cover -- mirrors
 *  pinboard.tsx's SWATCHES (duplicated, not imported; see file header). */
const SWATCHES = [
  "#8f9e86",
  "#7c93a6",
  "#b9805f",
  "#c9a14e",
  "#a49e93",
  "#8a6f82",
];

/** Small stable string hash for deterministic swatch choice (SSR-stable). */
function hashId(id: string): number {
  let h = 0;
  for (let i = 0; i < id.length; i++) h = (h * 31 + id.charCodeAt(i)) | 0;
  return h;
}

function tileSrc(item: LoveItem): string | null {
  if (item.type === "YouTube" && item.youtubeId) {
    return `https://img.youtube.com/vi/${item.youtubeId}/hqdefault.jpg`;
  }
  if (!item.cover) return null;
  return `/api/notion-cover?pageId=${item.id}&w=200`;
}

export function LovesTeaser({ items = [] }: { items?: LoveItem[] }) {
  if (items.length === 0) return null;

  const tiles = items.slice(0, TEASER_COUNT);

  return (
    <section className="wrap reveal py-8 md:py-12" aria-label="A few things I love">
      <a href="#loves" className="group block">
        <div className="flex items-baseline justify-between gap-4 font-mono text-xs uppercase tracking-[0.12em] text-text-muted transition-colors group-hover:text-text">
          <span>A few things I love</span>
          <span>See all &darr;</span>
        </div>
        <div className="mt-4 grid grid-cols-5 gap-2 sm:gap-3">
          {tiles.map((item) => {
            const src = tileSrc(item);
            const swatch =
              SWATCHES[Math.abs(hashId(item.id)) % SWATCHES.length];
            return (
              <span
                key={item.id}
                className="block aspect-square overflow-hidden border border-border"
              >
                {src ? (
                  // Plain img on purpose: external YouTube host + same-origin
                  // proxy, decorative teaser tile (mirrors pinboard.tsx's
                  // CardFace media choice and its reasoning).
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={src}
                    alt=""
                    loading="lazy"
                    decoding="async"
                    className="h-full w-full object-cover"
                  />
                ) : (
                  <span
                    className="block h-full w-full"
                    style={{ background: swatch }}
                    aria-hidden="true"
                  />
                )}
              </span>
            );
          })}
        </div>
      </a>
    </section>
  );
}
