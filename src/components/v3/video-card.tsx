import Link from "next/link";
import type { ReactNode } from "react";

type Props = {
  title: ReactNode;
  channel?: string;
  href: string;
};

/**
 * Video card with play-triangle thumb and hover lift — brutalist Crimson Poster style (DS-04).
 * Ported from site.css lines 113-123.
 *
 * The .videos CONTAINER (provided by the page/layout wrapping VideoCard cells) should use:
 *   grid [grid-template-columns:repeat(auto-fill,minmax(320px,1fr))] gap-[22px]
 */
export function VideoCard({ title, channel, href }: Props) {
  return (
    <Link
      href={href}
      className="group block border border-border hover:-translate-y-1 transition-transform"
    >
      {/* Thumb: fills with accent on hover; play-triangle inverts on hover */}
      <div className="aspect-video bg-surface border-b border-border relative flex items-center justify-center group-hover:bg-accent transition-colors">
        {/* Play triangle: border-trick CSS triangle, inverts on hover */}
        <span
          className="
            border-l-[24px] border-l-accent
            border-y-[15px] border-y-transparent
            ml-[6px]
            group-hover:border-l-bg
            transition-[border-left-color]
          "
          aria-hidden="true"
        />
      </div>

      {/* Card body */}
      <div className="p-4 flex justify-between gap-3 items-baseline">
        <h3 className="font-display font-medium text-base uppercase tracking-[-0.01em]">
          {title}
        </h3>
        {channel && (
          <span className="font-mono text-xs text-text-muted whitespace-nowrap">{channel}</span>
        )}
      </div>
    </Link>
  );
}
