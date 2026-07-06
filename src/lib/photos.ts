/**
 * Hard-coded photo archive data for the /photos route (ARCH-03).
 *
 * Year values are EMPIRICAL — derived from macOS
 * `mdls kMDItemContentCreationDate` on each file in
 * /public/MSizzle-website-photos/. Verified during Phase 11 research
 * (.planning/phases/11-archive-pages/11-RESEARCH.md § Photo Year Mapping).
 *
 * Distribution: 3 photos in 2023 + 3 photos in 2025. NO 2024 photos.
 * The /photos page renders two `<YearBlock>` groups in descending order
 * (2025 first, then 2023).
 *
 * For future content additions, append entries to PHOTOS_BY_YEAR with
 * empirically derived year values. A Notion-driven photo source is
 * explicitly deferred to a future milestone per D-11 + D-24.
 */

export type ArchivePhoto = {
  filename: string;
  year: number;
  alt: string;
  caption?: string;
};

export const PHOTOS_BY_YEAR: ArchivePhoto[] = [
  {
    filename: "000092530012.jpeg",
    year: 2025,
    alt: "Film negative: a year in motion",
    caption: "Film, 2025",
  },
  {
    filename: "IMG_2129.jpeg",
    year: 2025,
    alt: "Personal moment, late 2025",
    caption: "iPhone, Nov 2025",
  },
  {
    filename: "Patricof09.jpg",
    year: 2025,
    alt: "Patricof, February 2025",
    caption: "Feb 2025",
  },
  {
    filename: "IMG_1075.JPG",
    year: 2023,
    alt: "December 2023",
    caption: "Dec 2023",
  },
  {
    filename: "20230928 MSB_0114.jpg",
    year: 2023,
    alt: "September 2023",
    caption: "Sep 2023",
  },
  {
    filename: "IMG_0028.jpeg",
    year: 2023,
    alt: "Summer 2023",
    caption: "Jul 2023",
  },
];

/**
 * Group photos by year, returning a Map sorted by year descending
 * so iteration order matches the page render order (newest → oldest).
 *
 * Reference: D-12 — groupPhotosByYear returns entries sorted descending.
 */
export function groupPhotosByYear(): Map<number, ArchivePhoto[]> {
  const groups = new Map<number, ArchivePhoto[]>();
  for (const photo of PHOTOS_BY_YEAR) {
    const bucket = groups.get(photo.year) ?? [];
    bucket.push(photo);
    groups.set(photo.year, bucket);
  }
  return new Map([...groups.entries()].sort(([a], [b]) => b - a));
}
