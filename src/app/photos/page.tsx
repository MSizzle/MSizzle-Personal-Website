import { Fragment } from "react";
import Image from "next/image";
import type { Metadata } from "next";
import { groupPhotosByYear } from "@/lib/photos";
import { EditorialHeader } from "@/components/home-v2/editorial-header";
import { RuleStrong } from "@/components/editorial/rule-strong";
import { YearBlock } from "@/components/editorial/year-block";

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
      {/* Shared editorial header — no active prop: no nav link bolded on /photos per Assumption A4 */}
      <EditorialHeader />

      {/* Title block — matching /writing skeleton per RESEARCH Pattern 1 */}
      <section className="px-6 pt-40 pb-24 md:px-40 md:pt-[160px] md:pb-[100px]">
        <div className="grid grid-cols-1 items-end gap-10 md:grid-cols-[1fr_360px] md:gap-20">
          {/* Left: label + page title + blurb */}
          <div>
            <div className="text-label uppercase text-muted">── The Archive · 04</div>
            <h1 className="mt-6 text-page-title uppercase text-ink">Photographs.</h1>
            <p className="mt-10 max-w-[35rem] text-body-lead text-muted">
              A film-led survey of years in motion. Stills, fragments, and frames from a year of
              quiet attention. Updated when something earns the page.
            </p>
          </div>

          {/* Right: atmosphere photo — PHOTOS[1] per D-22 — hidden on mobile per RESEARCH Pitfall 6 */}
          <div className="hidden md:block">
            <div className="relative h-[480px] w-[360px] overflow-hidden bg-rule-strong">
              {/* Filename: "20230928 MSB_0114.jpg" — space URL-encoded as %20, matching src/app/page.tsx line 23 pattern */}
              <Image
                src="/MSizzle-website-photos/20230928%20MSB_0114.jpg"
                alt=""
                fill
                sizes="360px"
                className="object-cover saturate-[0.92]"
              />
            </div>
          </div>
        </div>
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
                    <div className="relative aspect-square overflow-hidden bg-rule-strong">
                      <Image
                        src={`/MSizzle-website-photos/${encodeURIComponent(photo.filename).replace(/%2F/g, "/")}`}
                        alt={photo.alt}
                        fill
                        sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                        className="object-cover saturate-[0.92]"
                      />
                    </div>
                    {photo.caption && (
                      <figcaption className="mt-3 text-meta uppercase text-muted">
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
