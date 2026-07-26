"use client";

/**
 * CardCover - Phase 19 client-side cover image with onError fallback (SC-1).
 *
 * Retires the gray broken-image placeholder: when a Notion cover image 404s
 * or fails to load, the component swaps client-side to the provided fallback
 * ReactNode (typically a TitleCard). The swap is one-way (failed state is
 * boolean, not retried) to prevent any amplification loop (T-19-02).
 *
 * Only this component is a client component. Card and TitleCard stay server
 * components -- they pass the pre-built fallback ReactNode into CardCover.
 *
 * Copy rule: no em dashes in any string this file renders.
 */

import { useState } from "react";
import type { ReactNode } from "react";
import Image from "next/image";
import { NEUTRAL_BLUR_DATA_URL } from "@/lib/image-placeholder";

type Props = {
  /** Absolute or relative URL for the cover image (e.g. /api/notion-cover?pageId=...). */
  src: string;
  /** Alt text for the cover image. Pass "" for decorative images. */
  alt: string;
  /** Responsive sizes attribute for next/image. Falls back to a sensible default. */
  sizes?: string;
  /** ReactNode to render when the image fails to load (e.g. a TitleCard). */
  fallback: ReactNode;
};

/**
 * Client component: renders a cover image with onError swap to the fallback.
 * Safe to use inside server-component trees (only this node is client).
 */
export function CardCover({ src, alt, sizes, fallback }: Props) {
  const [failed, setFailed] = useState(false);

  if (failed) {
    return <>{fallback}</>;
  }

  // Matting: the photo is inset to the same 26px gutter the card's text block
  // uses, so the cover reads as a framed plate rather than the one element that
  // bleeds to the card border. No bottom padding here: the text block below
  // already supplies its own 26px top padding. The fallback TitleCard path
  // above stays full bleed, unchanged.
  return (
    <div className="px-[26px] pt-[26px]">
      <div className="relative w-full aspect-[4/3] overflow-hidden border border-[var(--color-border-strong)]">
        {/* unoptimized (260723-g2q Task 4): /api/notion-cover already resizes,
            rotates, and webp-encodes this image server-side via sharp; wrapping
            it in next/image's own optimizer would re-fetch, re-decode, and
            re-encode it a second time for no benefit. */}
        <Image
          src={src}
          alt={alt}
          fill
          sizes={sizes ?? "(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"}
          className="object-cover"
          placeholder="blur"
          blurDataURL={NEUTRAL_BLUR_DATA_URL}
          unoptimized
          onError={() => setFailed(true)}
        />
      </div>
    </div>
  );
}
