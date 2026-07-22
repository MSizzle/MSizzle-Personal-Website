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

function groupByYear(posts: EssayGridPost[]): Map<number, EssayGridPost[]> {
  const groups = new Map<number, EssayGridPost[]>();
  for (const post of posts) {
    const bucket = groups.get(post.year) ?? [];
    bucket.push(post);
    groups.set(post.year, bucket);
  }
  return new Map([...groups.entries()].sort(([a], [b]) => b - a));
}

function cardProps(post: EssayGridPost, i: number) {
  return {
    href: `/blog/${post.slug}`,
    title: post.title,
    blurb: post.description,
    kicker: post.tags?.[0] ?? "Essay",
    coverSrc: post.cover ? `/api/notion-cover?pageId=${post.id}` : undefined,
    coverAlt: post.cover ? post.title : undefined,
    readingTime: post.readingTime,
    titleCardField: (i % 2 === 0 ? "paper" : "ink") as "paper" | "ink",
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
          {posts.slice(0, INITIAL_VISIBLE).map((post, i) => (
            <Card key={post.id} {...cardProps(post, i)} />
          ))}
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

  return (
    <div className="-mx-6 md:-mx-40">
      {yearEntries.map(([year, yearPosts], i, arr) => (
        <Fragment key={year}>
          <YearBlock year={year}>
            <div className="card-grid">
              {yearPosts.map((post, i) => (
                <Card key={post.id} {...cardProps(post, i)} />
              ))}
            </div>
          </YearBlock>
          {i < arr.length - 1 && <RuleStrong />}
        </Fragment>
      ))}
    </div>
  );
}
