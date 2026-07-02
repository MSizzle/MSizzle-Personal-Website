import { Fragment } from "react";
import type { Metadata } from "next";
import { getPublishedPosts, type BlogPost } from "@/lib/notion";
import { fetchMontyMonthlyIssues } from "@/lib/rss/substack";
import { RuleStrong } from "@/components/editorial/rule-strong";
import { YearBlock } from "@/components/editorial/year-block";
import { WritingSubscribeCTA } from "@/components/home-v2/writing-subscribe-cta";
import { PageHero } from "@/components/v3/page-hero";
import { Card } from "@/components/v3/card";
import { NewsletterCarousel } from "@/components/v3/newsletter-carousel";

// ISR -- matches /, /events cadence (RESEARCH § Pitfall 9). 30 minutes balances
// fresh Notion-sourced essays against Vercel build minutes on the free tier.
export const revalidate = 1800;

export const metadata: Metadata = {
  title: "Writing | Monty Singer",
  description:
    "Long-form essays on philosophy, technology, and the texture of an attentive life.",
  alternates: { canonical: "/writing" },
  openGraph: {
    title: "Writing | Monty Singer",
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
 * /writing -- merged essay archive + Monty Monthly surface (D-03, D-04).
 *
 * Layout per D-03/D-04 (17.2-03):
 *   1. PageHero (v3) -- title "Writing", canonical /writing (unchanged)
 *   2. <RuleStrong />
 *   3. Year-grouped essays -- YearBlock heading above a photo grid of Cards (D-03)
 *      Each Card: cover image via /api/notion-cover proxy (D-02), calm color-only
 *      hover (D-01). Cards link to /blog/[slug] per D-02.
 *   4. <RuleStrong />
 *   5. Monty Monthly section -- NewsletterCarousel fed from Substack RSS (D-04)
 *      /newsletter redirects here (301); no link to /newsletter anywhere.
 *   6. <RuleStrong />
 *   7. WritingSubscribeCTA -- Substack outbound CTA
 *
 * Defensive fetches: both Notion and Substack failures render gracefully with
 * empty content rather than crashing. (T-16-07, T-17.2-05)
 */
export default async function WritingPage() {
  let posts: BlogPost[] = [];
  try {
    posts = await getPublishedPosts();
  } catch {}

  const rawIssues = await fetchMontyMonthlyIssues(6);
  const carouselIssues = rawIssues.map((issue) => ({
    title: issue.title,
    date: issue.pubDate,
    href: issue.link || undefined,
  }));

  const postsByYear = groupPostsByYear(posts);
  const yearEntries = [...postsByYear.entries()];

  return (
    <>
      {/* PageHero -- v3 title block (replaces atmosphere-photo two-column grid) */}
      <section className="px-6 md:px-40">
        <PageHero
          title="Writing"
          crumb="Home / Writing"
          sub="Essays on philosophy, technology, and the texture of an attentive life."
        />
      </section>

      <RuleStrong />

      {/* Year-grouped photo grid of cards (D-03, D-04) */}
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
                  {/* Photo grid of Cards (D-03) -- auto-fill minmax 260px */}
                  <div className="grid [grid-template-columns:repeat(auto-fill,minmax(260px,1fr))] gap-px bg-[var(--color-border)] border border-[var(--color-border)]">
                    {yearPosts.map((post) => (
                      <Card
                        key={post.id}
                        href={`/blog/${post.slug}`}
                        title={post.title}
                        blurb={post.description}
                        kicker={post.tags?.[0]}
                        coverSrc={
                          post.cover
                            ? `/api/notion-cover?pageId=${post.id}`
                            : undefined
                        }
                        coverAlt={post.cover ? post.title : undefined}
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

      {/* Monty Monthly section — folded from deleted /newsletter route (D-04) */}
      <section className="px-6 md:px-40 pb-16">
        <h3 className="font-mono text-sm uppercase tracking-[0.12em] text-accent mb-[18px]">
          Monty Monthly
        </h3>
        <NewsletterCarousel issues={carouselIssues} />
      </section>

      <RuleStrong />

      <WritingSubscribeCTA />
    </>
  );
}
