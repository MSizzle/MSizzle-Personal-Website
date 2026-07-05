import type { ReactNode } from "react";

type Props = {
  year: string | number;
  children: ReactNode;
};

/**
 * Editorial year-grouped section block. Used on /writing and /photos.
 *
 * Layout: 2-column grid `[180px | 1fr]` at md+. Left column holds a
 * tracked-uppercase year label that sticks to top-9 (36px) so it stays
 * visible while the user scrolls through that year's entries. Mobile
 * collapses to single column; the year renders as a non-sticky heading
 * above the entries.
 *
 * Critical implementation detail: the year label includes `md:self-start`
 * because a grid child defaults to `align-self: stretch`, and a stretched
 * element cannot stick (it has no room to scroll within its container).
 *
 * Server Component — pure presentation, no client interactivity. Callers
 * own the dividers between successive `<YearBlock>` instances (e.g., a
 * `<Rule />` between blocks).
 *
 * References: D-07 (location), D-08 (props), D-09 (layout), D-10 REVISED
 * (md:self-start requirement), D-29 (uses Phase 9 `text-label` token).
 */
export function YearBlock({ year, children }: Props) {
  return (
    <section className="px-6 py-12 md:px-40 md:py-20">
      <div className="grid grid-cols-1 gap-6 md:grid-cols-[180px_1fr] md:gap-20">
        <div className="text-label uppercase font-bold text-[var(--color-text)] md:sticky md:top-9 md:self-start">
          {year}
        </div>
        <div>{children}</div>
      </div>
    </section>
  );
}
