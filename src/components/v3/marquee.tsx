/* ── v3 Marquee ──
   site.css lines 75-80:
     .marquee { overflow:hidden; border-y; white-space:nowrap; py-4 }
     .track { display:inline-block; animation:scroll 30s linear infinite }
     span { font-display 700 uppercase 2xl px-[26px] text-text-muted }
     span.hot { -webkit-text-stroke:1.5px invert; color:transparent }
   @keyframes scroll defined in globals.css (Plan 01): to { transform:translateX(-50%) }
   DS-05: useReducedMotion → static track, no animation, content still readable
*/
"use client";

import { useReducedMotion } from "motion/react";
import { cn } from "@/utils/cn";

type MarqueeItem = {
  text: string;
  /** Outline stroke ("hot") variant */
  hot?: boolean;
};

type Props = {
  items: MarqueeItem[];
};

export function Marquee({ items }: Props) {
  const reducedMotion = useReducedMotion();

  // Duplicate items back-to-back so the -50% translateX loop is seamless
  const doubled = [...items, ...items];

  return (
    <div
      className="overflow-hidden border-t border-b border-border py-4 whitespace-nowrap"
      aria-label="Marquee"
    >
      <div
        className={cn(
          "inline-block",
          // Apply keyframe animation unless user prefers reduced motion (DS-05)
          !reducedMotion && "[animation:scroll_30s_linear_infinite]"
        )}
      >
        {doubled.map((item, i) => (
          <span
            key={i}
            className={cn(
              "font-display font-bold uppercase text-2xl px-[26px]",
              item.hot
                ? // outline-stroke "hot" variant: no Tailwind utility exists for -webkit-text-stroke
                  "[color:transparent] [-webkit-text-stroke:1.5px_var(--color-invert)]"
                : "text-text-muted"
            )}
            aria-hidden={i >= items.length ? "true" : undefined}
          >
            {item.text}
          </span>
        ))}
      </div>
    </div>
  );
}
