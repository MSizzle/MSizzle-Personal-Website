import Link from "next/link";

type Issue = {
  title: string;
  date: string;
  href?: string;
};

type Props = {
  issues: Issue[];
};

/**
 * Horizontally scroll-snapping carousel of newsletter issue cards — brutalist Crimson Poster style (DS-04).
 * Ported from site.css lines 104-111.
 *
 * Server component — no "use client".
 */
export function NewsletterCarousel({ issues }: Props) {
  return (
    <div className="flex gap-[18px] overflow-x-auto [scroll-snap-type:x_mandatory] pb-[18px] [scrollbar-width:thin]">
      {issues.map((issue) => {
        const body = (
          <>
            {/* Thumb with placeholder glyph (replaces CSS ::after{content:'MM'}) */}
            <div className="aspect-[3/2] bg-surface border-b-2 border-accent flex items-center justify-center">
              <span className="font-display font-bold text-2xl text-text-muted" aria-hidden="true">
                MM
              </span>
            </div>
            {/* Card body */}
            <div className="p-[18px]">
              <h3 className="font-display font-medium text-base mb-2">{issue.title}</h3>
              <p className="font-mono text-xs text-text-muted">{issue.date}</p>
            </div>
          </>
        );

        const cardClasses =
          "flex-[0_0_300px] [scroll-snap-align:start] border border-border bg-bg-2 block";

        return issue.href ? (
          <Link key={issue.title} href={issue.href} className={cardClasses}>
            {body}
          </Link>
        ) : (
          <div key={issue.title} className={cardClasses}>
            {body}
          </div>
        );
      })}
    </div>
  );
}
