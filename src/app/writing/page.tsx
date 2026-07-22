import type { Metadata } from "next";
import { getPublishedPosts, getBlocks, type BlogPost } from "@/lib/notion";
import { calculateReadingTime } from "@/utils/reading-time";
import { fetchMontyMonthlyIssues } from "@/lib/rss/substack";
import { RuleStrong } from "@/components/editorial/rule-strong";
import { EssayGrid, type EssayGridPost } from "@/components/editorial/essay-grid";
import { PageHeroBand } from "@/components/v3/page-hero-band";
import { NewsletterCarousel } from "@/components/v3/newsletter-carousel";

// ISR -- matches /, /events cadence (RESEARCH § Pitfall 9). 30 minutes balances
// fresh Notion-sourced essays against Vercel build minutes on the free tier.
export const revalidate = 1800;

export const metadata: Metadata = {
  title: "Writing",
  description:
    "Long-form essays on philosophy, technology, and the texture of an attentive life.",
  alternates: { canonical: "/writing" },
  openGraph: {
    title: "Writing",
    description:
      "Long-form essays on philosophy, technology, and the texture of an attentive life.",
    url: "/writing",
    type: "website",
  },
};

/**
 * Format an RSS pubDate ("Wed, 02 Jul 2026 12:00:00 GMT") as a readable
 * "July 2, 2026". Falls back to the raw string if the date can't be parsed so
 * the carousel never renders "Invalid Date".
 */
function formatIssueDate(pubDate: string): string {
  const d = new Date(pubDate);
  if (Number.isNaN(d.getTime())) return pubDate;
  return new Intl.DateTimeFormat("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric",
    timeZone: "UTC",
  }).format(d);
}

/**
 * /writing -- merged essay archive + Monty Monthly surface (D-03, D-04).
 *
 * Layout per D-03/D-04 (17.2-03), restyled to match /building:
 *   1. PageHeroBand (v3) -- full-bleed vermilion band, title "Writing"
 *      (replaces the pale PageHero so Writing reads like Building)
 *   3. Essay grid -- delegated to <EssayGrid> (quick task 260722-wov, item 3):
 *      a flat, capped (<=6) grid of Cards with a click-to-expand control that
 *      reveals the full year-grouped view (unchanged grouping) for larger
 *      archives. Essays KEEP real Notion covers when present; title-card is
 *      the fallback (SC-1). Reading time per D (Phase 19 SC-4) computed from
 *      content blocks via getBlocks + calculateReadingTime with per-post
 *      .catch(() => undefined); ISR revalidate=1800 caps Notion call frequency
 *      to one fan-out per 30 min. Failure degrades gracefully to omitting the
 *      reading-time line, never crashing. Grid uses Phase 19 card-grid
 *      offset-shadow treatment (SC-3): 8px ink shadow, vermilion hover, radius 0.
 *   4. <RuleStrong />
 *   5. Monty Monthly section -- section-scale heading/subtitle (quick task
 *      260722-wov, item 3) above an enlarged NewsletterCarousel fed from
 *      Substack RSS (D-04). /newsletter redirects here (301); no link to
 *      /newsletter anywhere.
 *   6. <RuleStrong />
 *   7. WritingSubscribeCTA -- Substack outbound CTA
 *
 * Defensive fetches: both Notion and Substack failures render gracefully with
 * empty content rather than crashing. (T-16-07, T-17.2-05, T-19-04)
 */
export default async function WritingPage() {
  let posts: BlogPost[] = [];
  try {
    posts = await getPublishedPosts();
  } catch {}

  // Per-post reading time from content blocks. Each failure degrades gracefully
  // to undefined (no reading-time line) rather than crashing the page. (T-19-04)
  const readingTimeEntries = await Promise.all(
    posts.map(
      async (post) =>
        [
          post.id,
          await getBlocks(post.id)
            .then(calculateReadingTime)
            .catch(() => undefined),
        ] as const
    )
  );
  const readingTimes = new Map(readingTimeEntries);

  const rawIssues = await fetchMontyMonthlyIssues(6);
  const carouselIssues = rawIssues.map((issue) => ({
    title: issue.title,
    date: formatIssueDate(issue.pubDate),
    href: issue.link || undefined,
    thumbnail: issue.thumbnail,
  }));

  // Flat, capped essay grid (quick task 260722-wov item 3) -- delegates
  // year-grouping/expand behavior to <EssayGrid>. Same falsy/unparseable-date
  // guard the old groupPostsByYear used.
  const gridPosts: EssayGridPost[] = posts
    .filter((post) => {
      if (!post.date) return false;
      return !Number.isNaN(new Date(post.date).getUTCFullYear());
    })
    .map((post) => ({
      id: post.id,
      slug: post.slug,
      title: post.title,
      description: post.description,
      tags: post.tags,
      cover: post.cover,
      year: new Date(post.date).getUTCFullYear(),
      readingTime: readingTimes.get(post.id),
    }));

  return (
    <>
      {/* Full-bleed vermilion hero band -- matches /building's PageHeroBand
          (replaces the pale PageHero so Writing and Building read the same). */}
      <PageHeroBand
        title="Writing"
        crumb="Home / Writing"
        sub="Essays on philosophy, technology, and the texture of an attentive life."
      />

      {/* Essay grid: capped flat grid with a show-all control that reveals
          the full year-grouped view (D-03, D-04, Phase 19 SC-3/SC-4, quick
          task 260722-wov item 3). */}
      <section className="px-6 md:px-40">
        <EssayGrid posts={gridPosts} />
      </section>

      <RuleStrong />

      {/* Monty Monthly section -- folded from deleted /newsletter route (D-04),
          enlarged to section scale (quick task 260722-wov item 3). Hidden when
          the Substack RSS fetch returns nothing so we never render a bare
          heading over an empty carousel. */}
      {carouselIssues.length > 0 && (
        <>
          <section className="px-6 md:px-40 py-24 md:py-32">
            <span className="font-mono text-xs uppercase tracking-[0.12em] text-text-muted">
              Newsletter
            </span>
            <h2 className="font-display text-2xl md:text-4xl font-extrabold uppercase tracking-[-0.02em] mt-3 mb-4">
              Monty Monthly
            </h2>
            <p className="font-sans text-base text-text-dim max-w-[52ch] mb-10">
              Monthly essays on building, technology, and the texture of an
              attentive life, sent straight from Substack.
            </p>
            <NewsletterCarousel issues={carouselIssues} />
          </section>

          <RuleStrong />
        </>
      )}
    </>
  );
}
