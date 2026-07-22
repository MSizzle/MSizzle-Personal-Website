import Image from "next/image";
import Link from "next/link";
import type { ReactNode } from "react";

type Props = {
  title: ReactNode;
  channel?: string;
  href: string;
  /** Optional YouTube thumbnail URL (or any image src). When provided, renders a Next.js Image instead of the CSS play-triangle placeholder. */
  thumbnail?: string;
  /** Forwarded to the Link anchor element — use "_blank" for external links. */
  target?: string;
  /** Forwarded to the Link anchor element — use "noopener noreferrer" for external links. */
  rel?: string;
};

/**
 * Video card with play-triangle thumb and hover lift — brutalist Crimson Poster style (DS-04).
 * Ported from site.css lines 113-123.
 *
 * The .videos CONTAINER (provided by the page/layout wrapping VideoCard cells) should use:
 *   grid [grid-template-columns:repeat(auto-fill,minmax(320px,1fr))] gap-[22px]
 *
 * Plan 05 patch: adds thumbnail?, target?, rel? props.
 * - thumbnail: renders a Next.js Image in the thumb div (replaces CSS play-triangle)
 * - target/rel: forwarded to Link for external YouTube links (D-09 tabnapping mitigation)
 */
export function VideoCard({ title, channel, href, thumbnail, target, rel }: Props) {
  return (
    <Link
      href={href}
      target={target}
      rel={rel}
      className="group block border border-border hover:-translate-y-1 transition-transform"
    >
      {/* Thumb: neutral placeholder fill until it inverts to black on hover; play-triangle inverts on hover (fallback when no thumbnail) */}
      <div className="aspect-video bg-[rgba(0,0,0,0.08)] border-b border-border relative flex items-center justify-center group-hover:bg-invert transition-colors overflow-hidden">
        {thumbnail ? (
          <Image
            src={thumbnail}
            alt=""
            aria-hidden
            width={480}
            height={360}
            sizes="(max-width:600px) 100vw, (max-width:1024px) 50vw, 33vw"
            className="w-full h-full object-cover"
          />
        ) : (
          /* Play triangle: border-trick CSS triangle, inverts on hover */
          <span
            className="
              border-l-[24px] border-l-invert
              border-y-[15px] border-y-transparent
              ml-[6px]
              group-hover:border-l-[color:var(--color-text-inverse)]
              transition-[border-left-color]
            "
            aria-hidden="true"
          />
        )}
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
