"use client";

import { Fragment, useState } from "react";
import { Card } from "@/components/v3/card";
import { YearBlock } from "@/components/editorial/year-block";
import { RuleStrong } from "@/components/editorial/rule-strong";

export type EssayGridPost = {
  id: string;
  slug: string;
  title: string;
  description: string;
  tags?: string[];
  cover: string | null;
  year: number;
  readingTime?: number;
};

// Roughly two rows at the grid's own `repeat(auto-fill, minmax(280px,1fr))`
// breakpoint on a typical desktop content width (~3 columns). This is an
// approximation since auto-fill column count varies by viewport -- matches
// the todo's own "roughly two rows" wording (quick task 260722-wov, item 3).
const INITIAL_VISIBLE = 6;

// The collapsed grid renders EVERY post and hides the overflow with
// `display: none` rather than slicing the array (quick task 260728-fri).
// Slicing left 10 of 16 essays with zero inbound links anywhere in the served
// HTML, so Google filed them under "Discovered - currently not indexed": a
// sitemap entry alone doesn't earn crawl budget on a low-authority domain.
// Googlebot parses and follows `display:none` anchors, so keeping them in the
// DOM restores the internal links at no visual cost. Do NOT reintroduce a
// .slice() here.

function groupByYear(posts: EssayGridPost[]): Map<number, EssayGridPost[]> {
  const groups = new Map<number, EssayGridPost[]>();
  for (const post of posts) {
    const bucket = groups.get(post.year) ?? [];
    bucket.push(post);
    groups.set(post.year, bucket);
  }
  return new Map([...groups.entries()].sort(([a], [b]) => b - a));
}

/**
 * `i` drives the paper/ink title-card alternation (unchanged). `accentIndex`
 * drives the Phase 23 rotating-accent hover and defaults to `i`, which is
 * already page-continuous in every view except the year-grouped one below --
 * that view passes an explicit continuous index so the accent never resets
 * at a year boundary while titleCardField alternation stays exactly as it
 * was (avoids touching already-covered behaviour).
 */
function cardProps(post: EssayGridPost, i: number, accentIndex: number = i) {
  return {
    href: `/blog/${post.slug}`,
    title: post.title,
    blurb: post.description,
    kicker: post.tags?.[0] ?? "Essay",
    coverSrc: post.cover ? `/api/notion-cover?pageId=${post.id}` : undefined,
    coverAlt: post.cover ? post.title : undefined,
    readingTime: post.readingTime,
    titleCardField: (i % 2 === 0 ? "paper" : "ink") as "paper" | "ink",
    accentIndex,
  };
}

export function EssayGrid({ posts }: { posts: EssayGridPost[] }) {
  const [expanded, setExpanded] = useState(false);

  if (posts.length === 0) {
    return (
      <p className="text-center py-12 text-[var(--color-text-muted)]">
        No essays yet. Check back soon.
      </p>
    );
  }

  if (!expanded && posts.length > INITIAL_VISIBLE) {
    return (
      <div className="-mx-6 md:-mx-40">
        <div className="card-grid">
          {posts.map((post, i) =>
            i < INITIAL_VISIBLE ? (
              <Card key={post.id} {...cardProps(post, i)} />
            ) : (
              // Present in the SSR payload for crawlers, `display: none` for
              // humans -- so it claims no grid track, no layout space, and no
              // tab stop until the user expands.
              <div key={post.id} className="hidden">
                <Card {...cardProps(post, i)} />
              </div>
            ),
          )}
        </div>
        <button
          type="button"
          onClick={() => setExpanded(true)}
          className="mt-8 font-mono text-sm uppercase tracking-[0.08em] text-text-muted hover:text-text underline underline-offset-4 transition-colors"
        >
          show all essays ({posts.length}) &rarr;
        </button>
      </div>
    );
  }

  if (!expanded) {
    return (
      <div className="-mx-6 md:-mx-40">
        <div className="card-grid">
          {posts.map((post, i) => (
            <Card key={post.id} {...cardProps(post, i)} />
          ))}
        </div>
      </div>
    );
  }

  const postsByYear = groupByYear(posts);
  const yearEntries = [...postsByYear.entries()];

  // Phase 23 (SW-01): continuous, page-wide accent index across every year
  // group, kept separate from the per-year `i` that still drives
  // titleCardField alternation unchanged (mirrors building/page.tsx).
  let accentCounter = 0;

  return (
    <div className="-mx-6 md:-mx-40">
      {yearEntries.map(([year, yearPosts], i, arr) => (
        <Fragment key={year}>
          <YearBlock year={year}>
            <div className="card-grid">
              {yearPosts.map((post, i) => (
                <Card key={post.id} {...cardProps(post, i, accentCounter++)} />
              ))}
            </div>
          </YearBlock>
          {i < arr.length - 1 && <RuleStrong />}
        </Fragment>
      ))}
    </div>
  );
}
