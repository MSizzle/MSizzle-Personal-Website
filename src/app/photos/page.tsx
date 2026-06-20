import { Fragment } from "react";
import Image from "next/image";
import type { Metadata } from "next";
import { groupPhotosByYear } from "@/lib/photos";
import { RuleStrong } from "@/components/editorial/rule-strong";
import { YearBlock } from "@/components/editorial/year-block";
import { PageHero } from "@/components/v3/page-hero";

/**
 * /photos — ARCH-03 editorial photo archive.
 *
 * Data source: src/lib/photos.ts (Plan 11-02) — hardcoded 6 photos in
 * two year groups (2025: 3 photos, 2023: 3 photos). groupPhotosByYear()
 * returns entries sorted year-descending so 2025 renders first.
 *
 * v1.0 chrome (Navigation, Footer, MainOffset) is suppressed on this
 * route via the pathname gate extended by Plan 11-03 per D-26.
 *
 * References: D-04 (NEW route), D-22 (page structure + atmosphere photo),
 * D-23 (saturate(0.92) + captions below, NOT mix-blend overlay),
 * D-24 (2×YearBlock: 2025 + 2023), D-30 (per-plan build gate).
 */

// ISR cadence — 30 minutes, matches /, /writing, /events per D-30.
// Harmless for a hardcoded data module; keeps route consistent and ready
// for the future Notion-driven photo source deferred in D-11.
export const revalidate = 1800;

export const metadata: Metadata = {
  title: "Photographs | Monty Singer",
  description: "A film-led survey of years in motion.",
  alternates: { canonical: "/photos" },
  openGraph: {
    title: "Photographs | Monty Singer",
    description: "A film-led survey of years in motion.",
    url: "/photos",
    type: "website",
  },
};

export default function PhotosPage() {
  const photosByYear = groupPhotosByYear();
  const yearEntries = [...photosByYear.entries()];

  return (
    <Fragment>
      {/* Title block — v3 PageHero replaces old two-column atmosphere-photo grid */}
      <section className="px-6 md:px-40">
        <PageHero
          title="Photographs"
          crumb="Home / Photographs"
          sub="A film-led survey of years in motion. Updated when something earns the page."
        />
      </section>

      <RuleStrong />

      {/* Year-grouped photo grid — iterates groupPhotosByYear() entries sorted year-desc */}
      <section className="px-6 md:px-40">
        {yearEntries.map(([year, yearPhotos], i, arr) => (
          <Fragment key={year}>
            <YearBlock year={year}>
              <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 lg:gap-8">
                {yearPhotos.map((photo) => (
                  <figure key={photo.filename}>
                    <div className="relative aspect-square overflow-hidden bg-[var(--color-surface)]">
                      <Image
                        src={`/MSizzle-website-photos/${encodeURIComponent(photo.filename).replace(/%2F/g, "/")}`}
                        alt={photo.alt}
                        fill
                        sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                        className="object-cover saturate-[0.92]"
                      />
                    </div>
                    {photo.caption && (
                      <figcaption className="mt-3 text-xs uppercase tracking-[0.08em] text-[var(--color-text-muted)]">
                        {photo.caption}
                      </figcaption>
                    )}
                  </figure>
                ))}
              </div>
            </YearBlock>
            {/* RuleStrong divider between year groups; omit after the last group */}
            {i < arr.length - 1 && <RuleStrong />}
          </Fragment>
        ))}
      </section>
    </Fragment>
  );
}
