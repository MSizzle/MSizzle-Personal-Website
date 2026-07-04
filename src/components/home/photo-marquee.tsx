"use client";

import { useReducedMotion } from "motion/react";

type Props = {
  /** Caption labels for each placeholder photo card (e.g. "A place I go"). */
  items: string[];
};

/**
 * PhotoMarquee — horizontally-scrolling placeholder photo row (D-07, D-08).
 *
 * Renders a duplicated track of `.photo` cards (aspect-ratio 3/4) with captions
 * from `items`. The track is doubled so the CSS `slide` keyframe
 * (translateX 0 → -50%) loops seamlessly.
 *
 * D-07: photo cards with captions animate left as a continuous marquee.
 * D-08: useReducedMotion pauses the CSS animation (belt-and-suspenders —
 *   Plan-01 globals.css also kills the animation via media query).
 *
 * The second half of doubled cards is aria-hidden so screen readers see
 * each label only once.
 *
 * Default items used by the consumer (Plan 07):
 *   "A place I go" / "A tool I trust" / "Off the clock" / "Reading now"
 */
export function PhotoMarquee({ items }: Props) {
  const reducedMotion = useReducedMotion();

  // Duplicate items back-to-back for seamless -50% translateX loop
  const doubled = [...items, ...items];

  return (
    <div className="marquee" aria-label="Things I love photo marquee">
      {/* .marquee .track CSS drives the slide animation (globals.css Plan 01).
          Inline animationPlayState pauses it when reducedMotion is active
          (belt-and-suspenders alongside the CSS @media guard). */}
      <div
        className="track"
        style={{
          gap: 18,
          animationPlayState: reducedMotion ? "paused" : "running",
        }}
      >
        {doubled.map((item, i) => {
          const isDuplicate = i >= items.length;
          return (
            <div
              key={i}
              style={{ flex: "0 0 clamp(220px,25vw,310px)" }}
              aria-hidden={isDuplicate ? "true" : undefined}
            >
              {/* Placeholder photo card — matches .photo system in globals.css.
                  Real photography replaces these blocks in a future asset swap. */}
              <div className="photo" style={{ aspectRatio: "3/4" }}>
                <div className="img" />
                <span className="icon">◲</span>
                <span className="cap">{item}</span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
