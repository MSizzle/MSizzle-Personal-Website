import Link from "next/link";
import type { ReactNode } from "react";

type Props = {
  kicker?: string;
  title: ReactNode;
  blurb?: ReactNode;
  href?: string;
};

/**
 * Essay/works grid card — brutalist Crimson Poster style (DS-04).
 * Ported from site.css lines 92-98.
 *
 * The .cards CONTAINER (provided by the page/layout wrapping Card cells) must use:
 *   grid auto-fill minmax(260px,1fr) gap-px bg-border border border-border
 *
 * Example:
 *   <div className="grid [grid-template-columns:repeat(auto-fill,minmax(260px,1fr))] gap-px bg-border border border-border">
 *     <Card ... />
 *     <Card ... />
 *   </div>
 */
export function Card({ kicker, title, blurb, href }: Props) {
  const inner = (
    <>
      {kicker && (
        <span className="font-mono text-xs text-accent block mb-[14px]">{kicker}</span>
      )}
      <h3 className="font-display font-medium text-lg uppercase mb-2">{title}</h3>
      {blurb && <p className="text-sm text-text-dim">{blurb}</p>}
    </>
  );

  if (href) {
    return (
      <Link href={href} className="block bg-bg p-[26px] hover:bg-bg-2 transition-colors">
        {inner}
      </Link>
    );
  }

  return (
    <div className="bg-bg p-[26px] hover:bg-bg-2 transition-colors">
      {inner}
    </div>
  );
}
