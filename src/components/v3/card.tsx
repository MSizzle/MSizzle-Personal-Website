import Image from "next/image";
import Link from "next/link";
import type { ReactNode } from "react";

type Props = {
  kicker?: string;
  title: ReactNode;
  blurb?: ReactNode;
  href?: string;
  /** Optional cover image URL (e.g. /api/notion-cover?pageId=...). When provided,
   *  the image renders full-width above the padded text block. When absent, the card
   *  renders exactly as before — text only. D-02: photo-forward index pages. */
  coverSrc?: string;
  /** Alt text for the cover image. Defaults to "" (decorative) when not provided. */
  coverAlt?: string;
};

/**
 * Essay/works grid card — brutalist Pumpkin Amber style (DS-04).
 * Ported from site.css lines 92-98.
 *
 * The .cards CONTAINER (provided by the page/layout wrapping Card cells) must use:
 *   grid auto-fill minmax(260px,1fr) gap-px bg-border border border-border
 *
 * Example:
 *   <div className="grid [grid-template-columns:repeat(auto-fill,minmax(260px,1fr))] gap-px bg-[var(--color-border)] border border-[var(--color-border)]">
 *     <Card ... />
 *     <Card ... />
 *   </div>
 *
 * Optional coverSrc prop: when provided, a 4:3 cover image bleeds to card edges
 * above the padded text block. Backward compatible — omitting coverSrc renders
 * the card identically to the original text-only layout.
 */
export function Card({ kicker, title, blurb, href, coverSrc, coverAlt }: Props) {
  const inner = (
    <>
      {kicker && (
        <span className="font-mono text-xs text-accent block mb-[14px]">{kicker}</span>
      )}
      <h3 className="font-display font-medium text-lg uppercase mb-2">{title}</h3>
      {blurb && <p className="text-sm text-text-dim">{blurb}</p>}
    </>
  );

  const coverSlot = coverSrc ? (
    <div className="relative w-full aspect-[4/3] overflow-hidden">
      <Image
        src={coverSrc}
        alt={coverAlt ?? ""}
        fill
        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
        className="object-cover"
      />
    </div>
  ) : null;

  if (href) {
    return (
      <Link href={href} className="block bg-bg hover:bg-bg-2 transition-colors">
        {coverSlot}
        <div className="p-[26px]">{inner}</div>
      </Link>
    );
  }

  return (
    <div className="bg-bg hover:bg-bg-2 transition-colors">
      {coverSlot}
      <div className="p-[26px]">{inner}</div>
    </div>
  );
}
