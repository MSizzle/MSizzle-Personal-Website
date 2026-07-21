import { Photo } from "./photo";

/** One marquee card: a caption label and an optional real image src. */
export type MarqueeItem = { label: string; src?: string; alt?: string };

type Props = {
  /** Photo cards; `src` renders a real image, otherwise a placeholder block. */
  items: MarqueeItem[];
};

/**
 * PhotoMarquee - static row of photo cards (MS-01: no ambient motion).
 *
 * Renders a duplicated track of `.photo` cards (aspect-ratio 3/4) with captions
 * from `items`. The track is doubled to keep the DOM/layout shape consistent
 * with the sliding version this replaced, but no animation runs.
 *
 * The second half of doubled cards is aria-hidden so screen readers see
 * each label only once.
 *
 * Default items used by the consumer (Plan 07):
 *   "A place I go" / "A tool I trust" / "Off the clock" / "Reading now"
 */
export function PhotoMarquee({ items }: Props) {
  // Duplicate items back-to-back to keep the pre-existing track layout shape
  const doubled = [...items, ...items];

  return (
    <div className="marquee" aria-label="Things I love photo marquee">
      <div className="track" style={{ gap: 18 }}>
        {doubled.map((item, i) => {
          const isDuplicate = i >= items.length;
          return (
            <div
              key={i}
              style={{ flex: "0 0 clamp(220px,25vw,310px)" }}
              aria-hidden={isDuplicate ? "true" : undefined}
            >
              {/* Renders a real image when item.src is set, else a placeholder. */}
              <Photo
                aspectRatio="3/4"
                caption={item.label}
                src={item.src}
                alt={item.alt}
              />
            </div>
          );
        })}
      </div>
    </div>
  );
}
