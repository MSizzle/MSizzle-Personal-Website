import { Fragment } from "react";
import type { Metadata } from "next";
import { getPublishedPosts, getBlocks, type BlogPost } from "@/lib/notion";
import { calculateReadingTime } from "@/utils/reading-time";
import { fetchMontyMonthlyIssues } from "@/lib/rss/substack";
import { RuleStrong } from "@/components/editorial/rule-strong";
import { YearBlock } from "@/components/editorial/year-block";
import { PageHeroBand } from "@/components/v3/page-hero-band";
import { Card } from "@/components/v3/card";
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
 * Group published posts by the UTC year of `post.date`. Returns a Map sorted
 * descending so iteration order is newest-year-first. Posts missing a date
 * are skipped defensively -- `BlogPost.date` is "" when the Notion record has
 * no date property set (D-17 carryforward from Phase 10).
 */
function groupPostsByYear(posts: BlogPost[]): Map<number, BlogPost[]> {
  const groups = new Map<number, BlogPost[]>();
  for (const post of posts) {
    if (!post.date) continue;
    const year = new Date(post.date).getUTCFullYear();
    if (Number.isNaN(year)) continue;
    const bucket = groups.get(year) ?? [];
    bucket.push(post);
    groups.set(year, bucket);
  }
  return new Map([...groups.entries()].sort(([a], [b]) => b - a));
}

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
 *   3. Year-grouped essays -- YearBlock heading above a card-grid of Cards (D-03)
 *      Essays KEEP real Notion covers when present; title-card is the fallback (SC-1).
 *      Reading time per D (Phase 19 SC-4) computed from content blocks via
 *      getBlocks + calculateReadingTime with per-post .catch(() => undefined);
 *      ISR revalidate=1800 caps Notion call frequency to one fan-out per 30 min.
 *      Failure degrades gracefully to omitting the reading-time line, never crashing.
 *      Grid uses Phase 19 card-grid offset-shadow treatment (SC-3): 8px ink shadow,
 *      vermilion hover, radius 0.
 *   4. <RuleStrong />
 *   5. Monty Monthly section -- NewsletterCarousel fed from Substack RSS (D-04)
 *      /newsletter redirects here (301); no link to /newsletter anywhere.
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

  const postsByYear = groupPostsByYear(posts);
  const yearEntries = [...postsByYear.entries()];

  return (
    <>
      {/* Full-bleed vermilion hero band -- matches /building's PageHeroBand
          (replaces the pale PageHero so Writing and Building read the same). */}
      <PageHeroBand
        title="Writing"
        crumb="Home / Writing"
        sub="Essays on philosophy, technology, and the texture of an attentive life."
      />

      {/* Year-grouped card grid of essays (D-03, D-04, Phase 19 SC-3/SC-4) */}
      <section className="px-6 md:px-40">
        {yearEntries.length === 0 ? (
          <p className="text-center py-12 text-[var(--color-text-muted)]">
            No essays yet. Check back soon.
          </p>
        ) : (
          <div className="-mx-6 md:-mx-40">
            {yearEntries.map(([year, yearPosts], i, arr) => (
              <Fragment key={year}>
                <YearBlock year={year}>
                  {/* Phase 19 SC-3: offset-shadow card grid with vermilion hover */}
                  <div className="card-grid">
                    {yearPosts.map((post, i) => (
                      <Card
                        key={post.id}
                        href={`/blog/${post.slug}`}
                        title={post.title}
                        blurb={post.description}
                        kicker={post.tags?.[0] ?? "Essay"}
                        coverSrc={
                          post.cover
                            ? `/api/notion-cover?pageId=${post.id}`
                            : undefined
                        }
                        coverAlt={post.cover ? post.title : undefined}
                        readingTime={readingTimes.get(post.id)}
                        titleCardField={i % 2 === 0 ? "paper" : "ink"}
                      />
                    ))}
                  </div>
                </YearBlock>
                {i < arr.length - 1 && <RuleStrong />}
              </Fragment>
            ))}
          </div>
        )}
      </section>

      <RuleStrong />

      {/* Monty Monthly section -- folded from deleted /newsletter route (D-04).
          Hidden when the Substack RSS fetch returns nothing so we never render
          a bare heading over an empty carousel. */}
      {carouselIssues.length > 0 && (
        <>
          <section className="px-6 md:px-40 pb-16">
            <h3 className="font-mono text-sm uppercase tracking-[0.12em] text-text-dim mb-[18px]">
              Monty Monthly
            </h3>
            <NewsletterCarousel issues={carouselIssues} />
          </section>

          <RuleStrong />
        </>
      )}
    </>
  );
}
