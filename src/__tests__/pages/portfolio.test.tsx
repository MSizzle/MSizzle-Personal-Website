/**
 * Tests for /portfolio page -- Phase 17.3 SC-1.
 *
 * Asserts:
 * (DEF-1) Empty-state "No featured projects yet" when getFeaturedProjects returns []
 * (SC-1.3) PageHero renders with title="Portfolio"
 * (SC-1.1, SC-1.4) Featured projects render as Cards with correct hrefs to /projects/[slug]
 * (cover-present) Cover image rendered via /api/notion-cover proxy when project.image is non-null
 * (cover-absent, SC-1.4) No cover image rendered when project.image is null
 */
import React from "react";
import { describe, it, expect, vi, afterEach } from "vitest";
import { render, screen, cleanup } from "@testing-library/react";

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

// Mock Notion loaders -- expose getFeaturedProjects only (portfolio does not use getPublishedProjects)
vi.mock("@/lib/notion-projects", () => ({
  getFeaturedProjects: vi.fn(),
}));

// Mock NotionRenderer to isolate page rendering
vi.mock("@/components/notion/notion-renderer", () => ({
  NotionRenderer: ({ blocks }: { blocks: any[] }) =>
    React.createElement("div", {
      "data-testid": "notion-renderer",
      "data-block-count": blocks.length,
    }),
}));

afterEach(() => {
  cleanup();
  vi.clearAllMocks();
});

// Helper to render the async Server Component in a test context
async function renderPortfolioPage() {
  const { default: PortfolioPage } = await import("@/app/portfolio/page");
  const element = await PortfolioPage();
  render(element as any);
}

describe("/portfolio page (Phase 17.3 SC-1)", () => {
  it("DEF-1: renders empty-state when getFeaturedProjects returns []", async () => {
    const { getFeaturedProjects } = await import("@/lib/notion-projects");
    vi.mocked(getFeaturedProjects).mockResolvedValue([]);
    await renderPortfolioPage();
    expect(screen.getByText(/No featured projects yet/i)).toBeDefined();
  });

  it("SC-1.3: renders PageHero with title Portfolio", async () => {
    const { getFeaturedProjects } = await import("@/lib/notion-projects");
    vi.mocked(getFeaturedProjects).mockResolvedValue([]);
    await renderPortfolioPage();
    const h1 = screen.getByRole("heading", { level: 1 });
    expect(h1.textContent).toContain("Portfolio");
  });

  it("SC-1.1 and SC-1.4: renders featured projects as Cards with /projects/[slug] hrefs", async () => {
    const { getFeaturedProjects } = await import("@/lib/notion-projects");
    vi.mocked(getFeaturedProjects).mockResolvedValue([
      {
        id: "proj-1",
        slug: "ai-assistant",
        title: "AI Assistant",
        lastEdited: "2025-04-01",
        featured: true,
        published: true,
        image: null,
        cover: null,
        description: "An AI product",
        emoji: null,
        externalUrl: "",
        tags: ["AI"],
      },
      {
        id: "proj-2",
        slug: "design-tool",
        title: "Design Tool",
        lastEdited: "2025-06-15",
        featured: true,
        published: true,
        image: "https://example.com/img.jpg",
        cover: "https://example.com/img.jpg",
        description: "A design product",
        emoji: null,
        externalUrl: "https://example.com",
        tags: ["Design"],
      },
    ]);
    await renderPortfolioPage();
    expect(screen.getByText("AI Assistant")).toBeDefined();
    expect(screen.getByText("Design Tool")).toBeDefined();
    const links = screen.getAllByRole("link");
    const hrefs = links.map((l) => l.getAttribute("href"));
    expect(hrefs).toContain("/projects/ai-assistant");
    expect(hrefs).toContain("/projects/design-tool");
  });

  it("cover-present: renders cover image via notion-cover proxy when project.image is non-null", async () => {
    const { getFeaturedProjects } = await import("@/lib/notion-projects");
    vi.mocked(getFeaturedProjects).mockResolvedValue([
      {
        id: "proj-with-image",
        slug: "project-with-image",
        title: "Project With Image",
        lastEdited: "2025-07-01",
        featured: true,
        published: true,
        image: "https://notion.so/image.jpg",
        cover: "https://notion.so/image.jpg",
        description: "Has an image",
        emoji: null,
        externalUrl: "",
        tags: [],
      },
    ]);
    await renderPortfolioPage();
    const allImgs = document.querySelectorAll("img");
    const coverImg = Array.from(allImgs).find((img) =>
      img.getAttribute("src")?.includes("notion-cover?pageId=proj-with-image")
    );
    expect(coverImg).toBeDefined();
  });

  it("cover-absent SC-1.4: does NOT render cover image when project.image is null", async () => {
    const { getFeaturedProjects } = await import("@/lib/notion-projects");
    vi.mocked(getFeaturedProjects).mockResolvedValue([
      {
        id: "proj-no-image",
        slug: "project-no-image",
        title: "Project No Image",
        lastEdited: "2025-07-01",
        featured: true,
        published: true,
        image: null,
        cover: null,
        description: "No image here",
        emoji: null,
        externalUrl: "",
        tags: [],
      },
    ]);
    await renderPortfolioPage();
    const allImgs = document.querySelectorAll("img");
    const coverImg = Array.from(allImgs).find((img) =>
      img.getAttribute("src")?.includes("notion-cover?pageId=proj-no-image")
    );
    expect(coverImg).toBeUndefined();
  });
});
