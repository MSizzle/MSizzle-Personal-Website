import React from "react";
import { describe, it, expect, afterEach } from "vitest";
import { render, screen, cleanup } from "@testing-library/react";
import type { BlogPost } from "@/lib/notion";
import type { MontyMonthlyIssue } from "@/lib/rss/substack";

import { SectionWriting } from "@/components/home/section-writing";

afterEach(() => cleanup());

function post(overrides: Partial<BlogPost>): BlogPost {
  return {
    id: overrides.slug ?? "post-id",
    slug: "post-slug",
    title: "Post title",
    description: "A short description with a handful of words in it.",
    published: true,
    date: "2026-01-15T00:00:00.000Z",
    tags: [],
    cover: null,
    emoji: null,
    lastEdited: "2026-01-15T00:00:00.000Z",
    ...overrides,
  };
}

function issue(overrides: Partial<MontyMonthlyIssue>): MontyMonthlyIssue {
  return {
    title: "Monty Monthly issue",
    link: "https://montymonthly.substack.com/p/issue",
    pubDate: "Wed, 02 Jul 2026 12:00:00 GMT",
    description: "A newsletter issue description with several words.",
    thumbnail: null,
    readingTime: 1,
    ...overrides,
  };
}

describe("SectionWriting", () => {
  it("renders the ~/writing header and empty-state text with no items", () => {
    render(React.createElement(SectionWriting));
    expect(screen.getByText("~/writing")).toBeDefined();
    expect(
      screen.getByText("Nothing here yet. Check back soon.")
    ).toBeDefined();
    expect(document.querySelectorAll(".e-post").length).toBe(0);
  });

  it("merges posts and issues, sorted newest-first across sources, capped at 5", () => {
    const posts: BlogPost[] = [
      post({ slug: "p1", title: "Post 1", date: "2026-07-01T00:00:00.000Z" }),
      post({ slug: "p2", title: "Post 2", date: "2026-06-01T00:00:00.000Z" }),
      post({ slug: "p3", title: "Post 3", date: "2026-05-01T00:00:00.000Z" }),
      post({ slug: "p4", title: "Post 4", date: "2026-01-01T00:00:00.000Z" }),
    ];
    const issues: MontyMonthlyIssue[] = [
      issue({
        title: "Issue 1",
        pubDate: "Sun, 21 Jun 2026 00:00:00 GMT",
      }),
      issue({
        title: "Issue 2",
        pubDate: "Mon, 15 Feb 2026 00:00:00 GMT",
      }),
      issue({
        title: "Issue 3",
        pubDate: "Thu, 01 Jan 2026 00:00:00 GMT",
      }),
    ];

    render(
      React.createElement(SectionWriting, { posts, montyIssues: issues })
    );

    const rows = document.querySelectorAll(".e-post");
    expect(rows.length).toBe(5);

    const titles = Array.from(rows).map((row) => row.textContent);
    // Newest-first by date, merged across both sources:
    // Post 1 (07-01) > Post 2 (06-01) > Issue 1 (06-21 -> wait, sort check below)
    expect(titles[0]).toContain("Post 1");
    expect(titles[1]).toContain("Issue 1");
    expect(titles[2]).toContain("Post 2");
    expect(titles[3]).toContain("Post 3");
    expect(titles[4]).toContain("Issue 2");
  });

  it("skips posts with a falsy date entirely", () => {
    const posts: BlogPost[] = [
      post({ slug: "p1", title: "Has date", date: "2026-01-01T00:00:00.000Z" }),
      post({ slug: "p2", title: "No date", date: "" }),
    ];
    render(React.createElement(SectionWriting, { posts }));
    expect(screen.getByText("Has date")).toBeDefined();
    expect(screen.queryByText("No date")).toBeNull();
    expect(document.body.textContent).not.toContain("Invalid Date");
  });

  it("renders each row's date in YYYY-MM format", () => {
    const posts: BlogPost[] = [
      post({ slug: "p1", title: "Dated post", date: "2026-07-15T00:00:00.000Z" }),
    ];
    render(React.createElement(SectionWriting, { posts }));
    expect(screen.getByText("2026-07")).toBeDefined();
  });

  it("renders each row's read time as estimateReadingTime output formatted '{n} min'", () => {
    const longDescription = Array(250).fill("word").join(" ");
    const posts: BlogPost[] = [
      post({
        slug: "p1",
        title: "Long post",
        description: longDescription,
        date: "2026-07-15T00:00:00.000Z",
      }),
    ];
    render(React.createElement(SectionWriting, { posts }));
    // 250 words / 200 = 1.25 -> ceil -> 2
    expect(screen.getByText("2 min")).toBeDefined();
  });

  it("prefers the real per-post reading time over the description estimate", () => {
    const posts: BlogPost[] = [
      post({
        id: "post-1",
        slug: "p1",
        title: "Real post",
        // A one-line description estimates to 1 min; the real body is 9.
        description: "Short summary.",
        date: "2026-07-15T00:00:00.000Z",
      }),
    ];
    render(
      React.createElement(SectionWriting, {
        posts,
        readingTimes: { "post-1": 9 },
      })
    );
    expect(screen.getByText("9 min")).toBeDefined();
    expect(screen.queryByText("1 min")).toBeNull();
  });

  it("falls back to the estimate when a post has no measured reading time", () => {
    const longDescription = Array(250).fill("word").join(" ");
    const posts: BlogPost[] = [
      post({
        id: "missing",
        slug: "p1",
        title: "Unmeasured post",
        description: longDescription,
        date: "2026-07-15T00:00:00.000Z",
      }),
    ];
    render(
      React.createElement(SectionWriting, { posts, readingTimes: {} })
    );
    expect(screen.getByText("2 min")).toBeDefined();
  });

  it("uses each issue's own reading time from the feed body", () => {
    const issues = [
      issue({
        title: "Long issue",
        description: "Short subtitle.",
        pubDate: "Wed, 02 Jul 2026 12:00:00 GMT",
        readingTime: 7,
      }),
    ];
    render(React.createElement(SectionWriting, { montyIssues: issues }));
    expect(screen.getByText("7 min")).toBeDefined();
  });

  it("links blog post rows to /blog/{slug} with no target/rel", () => {
    const posts: BlogPost[] = [
      post({ slug: "my-post", title: "My post", date: "2026-07-15T00:00:00.000Z" }),
    ];
    render(React.createElement(SectionWriting, { posts }));
    const link = screen.getByText("My post").closest("a");
    expect(link?.getAttribute("href")).toBe("/blog/my-post");
    expect(link?.getAttribute("target")).toBeNull();
    expect(link?.getAttribute("rel")).toBeNull();
  });

  it("links Monty Monthly rows to issue.link with target=_blank rel=noopener noreferrer", () => {
    const issues: MontyMonthlyIssue[] = [
      issue({
        title: "External issue",
        link: "https://montymonthly.substack.com/p/external-issue",
        pubDate: "Wed, 02 Jul 2026 12:00:00 GMT",
      }),
    ];
    render(React.createElement(SectionWriting, { montyIssues: issues }));
    const link = screen.getByText("External issue").closest("a");
    expect(link?.getAttribute("href")).toBe(
      "https://montymonthly.substack.com/p/external-issue"
    );
    expect(link?.getAttribute("target")).toBe("_blank");
    expect(link?.getAttribute("rel")).toBe("noopener noreferrer");
  });

  it("renders exactly one 'all posts ->' link to /writing after the row list", () => {
    const posts: BlogPost[] = [
      post({ slug: "p1", title: "Post 1", date: "2026-07-15T00:00:00.000Z" }),
    ];
    render(React.createElement(SectionWriting, { posts }));
    const links = screen.getAllByText("all posts →");
    expect(links.length).toBe(1);
    expect(links[0].getAttribute("href")).toBe("/writing");
  });

  it("has no box/frame wrapper class", () => {
    const posts: BlogPost[] = [
      post({ slug: "p1", title: "Post 1", date: "2026-07-15T00:00:00.000Z" }),
    ];
    const { container } = render(
      React.createElement(SectionWriting, { posts })
    );
    expect(container.querySelector('[class*="frame"]')).toBeNull();
    expect(container.querySelector('[class*="box"]')).toBeNull();
  });
});
