import Image from "next/image";
import { Fragment } from "react";
import type { Metadata } from "next";
import { getPublishedPosts, type BlogPost } from "@/lib/notion";
import { formatMonthYear } from "@/lib/dates";
import { RuleStrong } from "@/components/editorial/rule-strong";
import { Rule } from "@/components/editorial/rule";
import { IntroLink } from "@/components/editorial/intro-link";
import { ListRow } from "@/components/editorial/list-row";
import { YearBlock } from "@/components/editorial/year-block";
import { WritingSubscribeCTA } from "@/components/home-v2/writing-subscribe-cta";

// ISR — matches /, /events cadence (RESEARCH § Pitfall 9). 30 minutes balances
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
 * are skipped defensively — `BlogPost.date` is "" when the Notion record has
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
 * /writing — editorial archive page (ARCH-01).
 *
 * Layout per handoff §3 + D-13/D-14/D-15 REVISED:
 *   1. The shared editorial nav is rendered globally via `Navigation` (Path 2) —
 *      "Writing" is bolded automatically via the pathname → active-label mapping
 *      there. No inline header is rendered from this page.
 *   2. Title block — 2-col grid: tracked label · "Writing." 120px page title ·
 *      muted blurb with IntroLink to Monty Monthly · 360×480 atmosphere photo
 *      (Patricof09.jpg per D-13). Photo hidden on mobile so the page title
 *      stays above the fold (RESEARCH § Pitfall 6).
 *   3. <RuleStrong />
 *   4. Year-grouped essays via <YearBlock> (Plan 11-01 primitive) — posts come
 *      from Notion getPublishedPosts() grouped client-side by year, sorted desc.
 *      Each essay rendered with <ListRow big> per Phase 9 D-29. Post permalinks
 *      keep the /blog/[slug] shape per D-02 (only the index moves to /writing).
 *   5. <RuleStrong />
 *   6. Inverted-ink Substack-outbound subscribe footer — single styled <a> to
 *      https://montymonthly.substack.com per D-15 REVISED. NOT a markup form,
 *      NOT an in-house subscribe endpoint — the Substack outbound IS the
 *      existing pipeline (mirrors src/app/newsletter/page.tsx:39).
 *
 * Defensive Notion fetch mirrors src/app/page.tsx — a transient Notion API
 * failure renders the page with an empty-state message instead of crashing.
 */
export default async function WritingPage() {
  let posts: BlogPost[] = [];
  try {
    posts = await getPublishedPosts();
  } catch {}

  const postsByYear = groupPostsByYear(posts);
  const yearEntries = [...postsByYear.entries()];

  return (
    <>
      {/* Title block — handoff §3 padding `160px 160px 100px` desktop / `64px 24px 60px` mobile */}
      <section className="px-6 pt-16 pb-15 md:px-40 md:pt-40 md:pb-25">
        <div className="grid grid-cols-1 items-end gap-10 md:grid-cols-[1fr_360px] md:gap-20">
          <div>
            <div className="text-label uppercase text-muted">── The Library · 02</div>
            <h1 className="mt-6 text-page-title uppercase text-ink">Writing.</h1>
            <p className="mt-10 max-w-[35rem] text-body-lead text-muted">
              Long-form essays on philosophy, technology, and the texture of an
              attentive life. Published monthly, sometimes more, never less.
              Subscribe at{" "}
              <IntroLink href="/newsletter">Monty Monthly</IntroLink>.
            </p>
          </div>
          <div className="hidden md:block">
            <div className="relative h-[480px] w-[360px] overflow-hidden bg-rule-strong">
              <Image
                src="/MSizzle-website-photos/Patricof09.jpg"
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

      {/* Year-grouped essays via <YearBlock> (Plan 11-01) */}
      <section className="px-6 md:px-40">
        {yearEntries.length === 0 ? (
          <div className="py-20 md:py-32">
            <p className="text-caption text-muted">More essays coming soon.</p>
          </div>
        ) : (
          <div className="-mx-6 md:-mx-40">
            {yearEntries.map(([year, yearPosts], i, arr) => (
              <Fragment key={year}>
                <YearBlock year={year}>
                  {yearPosts.map((post) => (
                    <ListRow
                      key={post.id}
                      big
                      href={`/blog/${post.slug}`}
                      title={post.title}
                      extra={post.description}
                      meta={formatMonthYear(post.date)}
                    />
                  ))}
                </YearBlock>
                {i < arr.length - 1 && (
                  <div className="px-6 md:px-40">
                    <Rule />
                  </div>
                )}
              </Fragment>
            ))}
          </div>
        )}
      </section>

      <RuleStrong />

      <WritingSubscribeCTA />
    </>
  );
}
