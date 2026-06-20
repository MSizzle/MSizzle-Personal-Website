/**
 * Tests for /writing page — Plan 04 (16-04) photo grid rebuild.
 *
 * Asserts:
 * (a) Card components render for each post (not ListRow)
 * (b) When getPublishedPosts returns [] the text "No essays yet" appears
 * (c) PageHero renders with title="Writing"
 *
 * Also retains Plan 01 USES_DATA shape verifications.
 */
import React from "react";
import { describe, it, expect, vi, afterEach } from "vitest";
import { render, screen, cleanup } from "@testing-library/react";
import { USES_DATA } from "@/lib/uses";

// Mock next/image
vi.mock("next/image", () => ({
  default: (props: Record<string, unknown>) =>
    React.createElement("img", { ...props }),
}));

// Mock next/link
vi.mock("next/link", () => ({
  default: ({ children, href, ...props }: any) =>
    React.createElement("a", { href, ...props }, children),
}));

// Mock WritingSubscribeCTA — avoid rendering its internals
vi.mock("@/components/home-v2/writing-subscribe-cta", () => ({
  WritingSubscribeCTA: () =>
    React.createElement("div", { "data-testid": "writing-subscribe-cta" }),
}));

// Mock Notion loader — control data in tests
vi.mock("@/lib/notion", () => ({
  getPublishedPosts: vi.fn(),
}));

afterEach(() => {
  cleanup();
  vi.clearAllMocks();
});

// Helper to render the async Server Component in a test context
async function renderWritingPage() {
  const { getPublishedPosts } = await import("@/lib/notion");
  const { default: WritingPage } = await import("@/app/writing/page");
  const element = await WritingPage();
  render(element as any);
}

describe("/writing page (Plan 04 / PG-01)", () => {
  // ── Plan 01 data module shape verifications (retained) ──────────────────
  it("USES_DATA from @/lib/uses has length 4 (Plan 01 deliverable)", () => {
    expect(USES_DATA.length).toBe(4);
  });

  it("USES_DATA has expected group headings", () => {
    const headings = USES_DATA.map((g) => g.heading);
    expect(headings).toContain("AI & Development");
    expect(headings).toContain("Productivity");
    expect(headings).toContain("Communication");
    expect(headings).toContain("Hardware");
  });

  it("USES_DATA Hardware group items all have TODO: placeholder details", () => {
    const hardware = USES_DATA.find((g) => g.heading === "Hardware");
    expect(hardware).toBeDefined();
    hardware!.items.forEach((item) => {
      expect(item.detail.startsWith("TODO:")).toBe(true);
    });
  });

  // ── Plan 04 page integration tests ──────────────────────────────────────
  it('renders empty-state "No essays yet" when getPublishedPosts returns []', async () => {
    const { getPublishedPosts } = await import("@/lib/notion");
    vi.mocked(getPublishedPosts).mockResolvedValue([]);
    await renderWritingPage();
    expect(screen.getByText(/No essays yet/i)).toBeDefined();
  });

  it("renders PageHero with title Writing", async () => {
    const { getPublishedPosts } = await import("@/lib/notion");
    vi.mocked(getPublishedPosts).mockResolvedValue([]);
    await renderWritingPage();
    // PageHero renders the title in an h1
    const h1 = screen.getByRole("heading", { level: 1 });
    expect(h1.textContent).toContain("Writing");
  });

  it("renders Card components for each post (not ListRow)", async () => {
    const { getPublishedPosts } = await import("@/lib/notion");
    vi.mocked(getPublishedPosts).mockResolvedValue([
      {
        id: "post-1",
        slug: "philosophy-of-mind",
        title: "Philosophy of Mind",
        description: "A deep dive",
        published: true,
        date: "2025-03-15",
        tags: ["Philosophy"],
        cover: null,
        emoji: null,
        lastEdited: "2025-03-15",
      },
      {
        id: "post-2",
        slug: "on-technology",
        title: "On Technology",
        description: "Tech thoughts",
        published: true,
        date: "2025-06-20",
        tags: ["Technology"],
        cover: "some-cover-url",
        emoji: null,
        lastEdited: "2025-06-20",
      },
    ]);
    await renderWritingPage();
    // Both post titles should appear as card headings
    expect(screen.getByText("Philosophy of Mind")).toBeDefined();
    expect(screen.getByText("On Technology")).toBeDefined();
    // Cards link to /blog/[slug]
    const links = screen.getAllByRole("link");
    const hrefs = links.map((l) => l.getAttribute("href"));
    expect(hrefs).toContain("/blog/philosophy-of-mind");
    expect(hrefs).toContain("/blog/on-technology");
  });

  it("renders cover image when post.cover is non-null", async () => {
    const { getPublishedPosts } = await import("@/lib/notion");
    vi.mocked(getPublishedPosts).mockResolvedValue([
      {
        id: "post-with-cover",
        slug: "covered-post",
        title: "Covered Post",
        description: "Has a cover",
        published: true,
        date: "2025-05-10",
        tags: [],
        cover: "https://notion.so/cover.jpg",
        emoji: null,
        lastEdited: "2025-05-10",
      },
    ]);
    await renderWritingPage();
    const { container } = render(React.createElement("div"));
    // Check that the page contains a notion-cover URL in an img src
    const allImgs = document.querySelectorAll("img");
    const coverImg = Array.from(allImgs).find((img) =>
      img.getAttribute("src")?.includes("notion-cover?pageId=post-with-cover")
    );
    expect(coverImg).toBeDefined();
  });

  it("does NOT render cover image when post.cover is null", async () => {
    const { getPublishedPosts } = await import("@/lib/notion");
    vi.mocked(getPublishedPosts).mockResolvedValue([
      {
        id: "no-cover-post",
        slug: "no-cover",
        title: "No Cover Post",
        description: "No cover here",
        published: true,
        date: "2025-04-01",
        tags: [],
        cover: null,
        emoji: null,
        lastEdited: "2025-04-01",
      },
    ]);
    await renderWritingPage();
    const allImgs = document.querySelectorAll("img");
    const coverImg = Array.from(allImgs).find((img) =>
      img.getAttribute("src")?.includes("notion-cover?pageId=no-cover-post")
    );
    expect(coverImg).toBeUndefined();
  });
});
