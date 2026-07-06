import Link from "next/link";
import type { ReactNode } from "react";
import { TitleCard } from "@/components/v3/title-card";
import { CardCover } from "@/components/v3/card-cover";

type Props = {
  kicker?: string;
  title: ReactNode;
  blurb?: ReactNode;
  href?: string;
  /** Optional cover image URL (e.g. /api/notion-cover?pageId=...). When provided,
   *  the image renders full-width above the padded text block. When absent, the card
   *  renders a TitleCard face. D-02: photo-forward index pages. Phase 19 SC-1. */
  coverSrc?: string;
  /** Alt text for the cover image. Defaults to "" (decorative) when not provided. */
  coverAlt?: string;
  /** Reading time in minutes (e.g. 4). Rendered as "4 min read". For /writing only. */
  readingTime?: number;
  /**
   * Field color for the TitleCard fallback face: "paper" (default) or "ink".
   * MUST be driven by callers from list index (e.g. index % 2 === 0 ? "paper" : "ink")
   * for deterministic SSG/ISR output. Never pass a random value.
   */
  titleCardField?: "paper" | "ink";
};

/**
 * Essay/works grid card -- brutalist v3 style (DS-04).
 * Phase 19 SC-1: falls back to a TitleCard typographic face when coverSrc is absent
 * or when the cover image errors at runtime (client-side swap via CardCover).
 *
 * titleCardField alternation must be deterministic: callers pass from list index.
 * No em dashes in any user-visible string.
 *
 * The .cards CONTAINER (provided by the page/layout wrapping Card cells) must use:
 *   grid auto-fill minmax(260px,1fr) gap-px bg-border border border-border
 *
 * Example:
 *   <div className="grid [grid-template-columns:repeat(auto-fill,minmax(260px,1fr))] gap-px bg-[var(--color-border)] border border-[var(--color-border)]">
 *     <Card ... />
 *     <Card ... />
 *   </div>
 */
export function Card({
  kicker,
  title,
  blurb,
  href,
  coverSrc,
  coverAlt,
  readingTime,
  titleCardField,
}: Props) {
  // Pre-build the fallback face once -- passed into CardCover so it doesn't
  // need to re-import TitleCard, keeping CardCover's API generic.
  const titleCardFace = (
    <TitleCard
      title={title}
      kicker={kicker}
      field={titleCardField}
      aspectRatio="4/3"
    />
  );

  // Cover slot: CardCover handles error swap client-side; title-card is the
  // direct fallback when no cover URL is provided at all.
  const coverSlot = coverSrc ? (
    <CardCover
      src={coverSrc}
      alt={coverAlt ?? ""}
      fallback={titleCardFace}
    />
  ) : (
    titleCardFace
  );

  // Text block below the cover. When a cover is present (image face), show
  // kicker, title, blurb, and readingTime in the padded area.
  // When a cover is ABSENT (title-card face), title and kicker live on the
  // face itself -- the text block only renders if blurb or readingTime exists.
  const hasCover = Boolean(coverSrc);

  const textBlock = hasCover ? (
    <div className="p-[26px]">
      {kicker && (
        <span className="font-mono text-xs text-accent block mb-[14px]">{kicker}</span>
      )}
      <h3 className="font-display font-medium text-lg uppercase mb-2">{title}</h3>
      {blurb && <p className="text-sm text-text-dim">{blurb}</p>}
      {readingTime !== undefined && (
        <p className="font-mono text-xs text-[var(--color-text-muted)] mt-2">
          {readingTime} min read
        </p>
      )}
    </div>
  ) : blurb || readingTime !== undefined ? (
    <div className="p-[26px]">
      {blurb && <p className="text-sm text-text-dim">{blurb}</p>}
      {readingTime !== undefined && (
        <p className="font-mono text-xs text-[var(--color-text-muted)] mt-2">
          {readingTime} min read
        </p>
      )}
    </div>
  ) : null;

  if (href) {
    return (
      <Link href={href} className="block bg-bg hover:bg-bg-2 transition-colors">
        {coverSlot}
        {textBlock}
      </Link>
    );
  }

  return (
    <div className="bg-bg hover:bg-bg-2 transition-colors">
      {coverSlot}
      {textBlock}
    </div>
  );
}
