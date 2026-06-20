/**
 * Test scaffold for /blog/[slug] page — owned by Plan 06 (16-06).
 *
 * Wave 0 tests verify:
 * (a) calculateReadingTime utility imports correctly and returns a number
 * (b) The utility handles empty blocks array gracefully
 *
 * Plan 06 tests verify:
 * (c) Breadcrumbs renders Writing item with href="/writing" (not /blog) — D-14
 * (d) PageHero renders with post title
 * (e) Reading time appears in meta row
 * (f) Cover image renders fetchPriority="high" when post.cover exists
 * (g) No cover image rendered when post.cover is null
 */
import React from "react";
import { describe, it, expect, vi, afterEach } from "vitest";
import { render, screen, cleanup } from "@testing-library/react";
import { calculateReadingTime } from "@/utils/reading-time";

// Mock next/image
vi.mock("next/image", () => ({
  default: (props: Record<string, unknown>) =>
    React.createElement("img", { ...props, "data-testid": "next-image" }),
}));

// Mock next/link
vi.mock("next/link", () => ({
  default: ({ children, href, ...props }: any) =>
    React.createElement("a", { href, ...props }, children),
}));

// Mock next/navigation
vi.mock("next/navigation", () => ({
  notFound: vi.fn(() => {
    throw new Error("NEXT_NOT_FOUND");
  }),
}));

// Mock Notion loaders
vi.mock("@/lib/notion", () => ({
  getPublishedPosts: vi.fn(),
  getPostBySlug: vi.fn(),
  getBlocks: vi.fn(),
}));

// Mock SEO metadata builder
vi.mock("@/lib/seo/blog-metadata", () => ({
  buildBlogPostMetadata: vi.fn(() => ({ title: "Test Post | Monty Singer" })),
}));

// Mock RelatedEssays to avoid Notion calls
vi.mock("@/components/blog/related-essays", () => ({
  RelatedEssays: ({ currentSlug }: { currentSlug: string }) =>
    React.createElement("div", { "data-testid": "related-essays", "data-slug": currentSlug }),
}));

// Mock NewsletterCta to avoid external concerns
vi.mock("@/components/blog/newsletter-cta", () => ({
  NewsletterCta: () =>
    React.createElement("div", { "data-testid": "newsletter-cta" }),
}));

// Mock NotionRenderer — pure content rendering, not relevant here
vi.mock("@/components/notion/notion-renderer", () => ({
  NotionRenderer: ({ blocks }: { blocks: any[] }) =>
    React.createElement("div", { "data-testid": "notion-renderer", "data-block-count": blocks.length }),
}));

afterEach(() => {
  cleanup();
  vi.clearAllMocks();
});

const makeMockPost = (overrides: Partial<Record<string, unknown>> = {}) => ({
  id: "post-abc",
  slug: "my-essay",
  title: "My Essay on Life",
  description: "A short description",
  published: true,
  date: "2026-03-15",
  tags: ["Philosophy"],
  cover: null,
  emoji: null,
  lastEdited: "2026-03-15",
  ...overrides,
});

async function renderBlogSlugPage(slug: string) {
  const { default: BlogPostPage } = await import("@/app/blog/[slug]/page");
  const element = await (BlogPostPage as any)({ params: Promise.resolve({ slug }) });
  render(element as any);
}

describe("/blog/[slug] page (Plan 06)", () => {
  // ── Utility verification (Wave 0 tests retained) ────────────────────────
  it("calculateReadingTime returns a number for empty blocks array", () => {
    const result = calculateReadingTime([]);
    expect(typeof result).toBe("number");
  });

  it("calculateReadingTime returns at least 1 for empty blocks array", () => {
    const result = calculateReadingTime([]);
    expect(result).toBeGreaterThanOrEqual(1);
  });

  // ── Plan 06 integration tests ────────────────────────────────────────────

  it("renders post title in PageHero h1 (D-14)", async () => {
    const { getPostBySlug, getBlocks } = await import("@/lib/notion");
    vi.mocked(getPostBySlug).mockResolvedValue(makeMockPost() as any);
    vi.mocked(getBlocks).mockResolvedValue([]);
    await renderBlogSlugPage("my-essay");
    const h1 = screen.getByRole("heading", { level: 1 });
    expect(h1.textContent).toContain("My Essay on Life");
  });

  it("Breadcrumbs Writing item href is /writing NOT /blog (D-14 / D-breadcrumb-writing)", async () => {
    const { getPostBySlug, getBlocks } = await import("@/lib/notion");
    vi.mocked(getPostBySlug).mockResolvedValue(makeMockPost() as any);
    vi.mocked(getBlocks).mockResolvedValue([]);
    await renderBlogSlugPage("my-essay");
    // The Breadcrumbs component (sr-only / JSON-LD) renders anchors with hrefs
    // The Writing breadcrumb must link to /writing (not /blog)
    const allLinks = document.querySelectorAll("a");
    const hrefs = Array.from(allLinks).map((a) => a.getAttribute("href"));
    expect(hrefs).toContain("/writing");
    expect(hrefs).not.toContain("/blog");
  });

  it("reading time appears in meta row (D-14)", async () => {
    const { getPostBySlug, getBlocks } = await import("@/lib/notion");
    vi.mocked(getPostBySlug).mockResolvedValue(makeMockPost() as any);
    vi.mocked(getBlocks).mockResolvedValue([]);
    await renderBlogSlugPage("my-essay");
    // Look for "min read" text in the rendered page
    expect(screen.getByText(/min read/i)).toBeDefined();
  });

  it("renders cover image with fetchPriority=high when post.cover exists (D-02, nextjs16-fetchpriority-quirk)", async () => {
    const { getPostBySlug, getBlocks } = await import("@/lib/notion");
    vi.mocked(getPostBySlug).mockResolvedValue(
      makeMockPost({ cover: "https://notion.so/some-cover.jpg" }) as any
    );
    vi.mocked(getBlocks).mockResolvedValue([]);
    await renderBlogSlugPage("my-essay");
    const imgs = document.querySelectorAll("img");
    const coverImg = Array.from(imgs).find((img) =>
      img.getAttribute("src")?.includes("notion-cover?pageId=post-abc")
    );
    expect(coverImg).toBeDefined();
    expect(coverImg?.getAttribute("fetchpriority")).toBe("high");
  });

  it("does NOT render cover image when post.cover is null (type-only fallback)", async () => {
    const { getPostBySlug, getBlocks } = await import("@/lib/notion");
    vi.mocked(getPostBySlug).mockResolvedValue(makeMockPost({ cover: null }) as any);
    vi.mocked(getBlocks).mockResolvedValue([]);
    await renderBlogSlugPage("my-essay");
    const imgs = document.querySelectorAll("img");
    const coverImg = Array.from(imgs).find((img) =>
      img.getAttribute("src")?.includes("notion-cover?pageId=post-abc")
    );
    expect(coverImg).toBeUndefined();
  });

  it("calls notFound() when post is missing", async () => {
    const { getPostBySlug } = await import("@/lib/notion");
    const { notFound } = await import("next/navigation");
    vi.mocked(getPostBySlug).mockResolvedValue(null as any);
    await expect(renderBlogSlugPage("missing-slug")).rejects.toThrow("NEXT_NOT_FOUND");
    expect(notFound).toHaveBeenCalled();
  });

  it("NotionRenderer is present with the fetched blocks (IN-02)", async () => {
    const { getPostBySlug, getBlocks } = await import("@/lib/notion");
    vi.mocked(getPostBySlug).mockResolvedValue(makeMockPost() as any);
    vi.mocked(getBlocks).mockResolvedValue([{ id: "block-1" }, { id: "block-2" }] as any);
    await renderBlogSlugPage("my-essay");
    const renderer = screen.getByTestId("notion-renderer");
    expect(renderer).toBeDefined();
    expect(renderer.getAttribute("data-block-count")).toBe("2");
  });
});
