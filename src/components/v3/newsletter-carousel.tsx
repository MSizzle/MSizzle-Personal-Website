import Link from "next/link";
import Image from "next/image";

type Issue = {
  title: string;
  date: string;
  href?: string;
  /** Cover image pulled from the Substack RSS feed; null when the issue has none. */
  thumbnail?: string | null;
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
            {/* Issue cover from the Substack feed; falls back to the "MM" glyph
                when an issue has no image. */}
            <div className="relative aspect-[3/2] bg-[rgba(0,0,0,0.08)] border-b-2 border-invert flex items-center justify-center overflow-hidden">
              {issue.thumbnail ? (
                <Image
                  src={issue.thumbnail}
                  alt=""
                  fill
                  sizes="300px"
                  className="object-cover"
                />
              ) : (
                <span className="font-display font-bold text-2xl text-text-muted" aria-hidden="true">
                  MM
                </span>
              )}
            </div>
            {/* Card body */}
            <div className="p-[28px]">
              <h3 className="font-display font-medium text-xl mb-2">{issue.title}</h3>
              <p className="font-mono text-xs text-text-muted">{issue.date}</p>
            </div>
          </>
        );

        const cardClasses =
          "flex-[0_0_420px] [scroll-snap-align:start] border border-border bg-bg block";

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
