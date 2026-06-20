/**
 * Tests for /projects page -- Plan 04 (16-04) photo grid rebuild.
 *
 * Asserts:
 * (a) Card components render for each project (not ListRow)
 * (b) When getPublishedProjects returns [] the text "No projects yet" appears
 * (c) PageHero renders with title="Building"
 *
 * Also retains Plan 01 WATCHING_ITEMS shape verifications.
 */
import React from "react";
import { describe, it, expect, vi, afterEach } from "vitest";
import { render, screen, cleanup } from "@testing-library/react";
import { WATCHING_ITEMS } from "@/lib/watching";

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

// Mock Notion loader
vi.mock("@/lib/notion-projects", () => ({
  getPublishedProjects: vi.fn(),
}));

afterEach(() => {
  cleanup();
  vi.clearAllMocks();
});

// Helper to render the async Server Component in a test context
async function renderProjectsPage() {
  const { default: BuildingPage } = await import("@/app/projects/page");
  const element = await BuildingPage();
  render(element as any);
}

describe("/projects page (Plan 04 / PG-03)", () => {
  // ── Plan 01 data module shape verifications (retained) ──────────────────
  it("WATCHING_ITEMS from @/lib/watching has length 6 (Plan 01 deliverable)", () => {
    expect(WATCHING_ITEMS.length).toBe(6);
  });

  it("every WatchingItem has non-empty id, title, channel, url fields", () => {
    WATCHING_ITEMS.forEach((item) => {
      expect(item.id.length).toBeGreaterThan(0);
      expect(item.title.length).toBeGreaterThan(0);
      expect(item.channel.length).toBeGreaterThan(0);
      expect(item.url.length).toBeGreaterThan(0);
    });
  });

  it("every WatchingItem url matches the YouTube watch URL pattern for its id", () => {
    WATCHING_ITEMS.forEach((item) => {
      expect(item.url).toBe(
        `https://www.youtube.com/watch?v=${item.id}`
      );
    });
  });

  // ── Plan 04 page integration tests ──────────────────────────────────────
  it('renders empty-state "No projects yet" when getPublishedProjects returns []', async () => {
    const { getPublishedProjects } = await import("@/lib/notion-projects");
    vi.mocked(getPublishedProjects).mockResolvedValue([]);
    await renderProjectsPage();
    expect(screen.getByText(/No projects yet/i)).toBeDefined();
  });

  it("renders PageHero with title Building", async () => {
    const { getPublishedProjects } = await import("@/lib/notion-projects");
    vi.mocked(getPublishedProjects).mockResolvedValue([]);
    await renderProjectsPage();
    const h1 = screen.getByRole("heading", { level: 1 });
    expect(h1.textContent).toContain("Building");
  });

  it("renders Card components for each project (not ListRow)", async () => {
    const { getPublishedProjects } = await import("@/lib/notion-projects");
    vi.mocked(getPublishedProjects).mockResolvedValue([
      {
        id: "proj-1",
        slug: "ai-assistant",
        title: "AI Assistant",
        description: "An AI product",
        image: null,
        emoji: null,
        externalUrl: "",
        tags: ["AI"],
        featured: true,
        published: true,
        lastEdited: "2025-04-01",
      },
      {
        id: "proj-2",
        slug: "design-tool",
        title: "Design Tool",
        description: "A design product",
        image: "https://example.com/img.jpg",
        emoji: null,
        externalUrl: "https://example.com",
        tags: ["Design"],
        featured: false,
        published: true,
        lastEdited: "2025-06-15",
      },
    ]);
    await renderProjectsPage();
    expect(screen.getByText("AI Assistant")).toBeDefined();
    expect(screen.getByText("Design Tool")).toBeDefined();
    // Cards link to /projects/[slug]
    const links = screen.getAllByRole("link");
    const hrefs = links.map((l) => l.getAttribute("href"));
    expect(hrefs).toContain("/projects/ai-assistant");
    expect(hrefs).toContain("/projects/design-tool");
  });

  it("renders cover image when project.image is non-null", async () => {
    const { getPublishedProjects } = await import("@/lib/notion-projects");
    vi.mocked(getPublishedProjects).mockResolvedValue([
      {
        id: "proj-with-image",
        slug: "project-with-image",
        title: "Project With Image",
        description: "Has an image",
        image: "https://notion.so/image.jpg",
        emoji: null,
        externalUrl: "",
        tags: [],
        featured: false,
        published: true,
        lastEdited: "2025-07-01",
      },
    ]);
    await renderProjectsPage();
    const allImgs = document.querySelectorAll("img");
    const coverImg = Array.from(allImgs).find((img) =>
      img.getAttribute("src")?.includes("notion-cover?pageId=proj-with-image")
    );
    expect(coverImg).toBeDefined();
  });

  it("does NOT render cover image when project.image is null", async () => {
    const { getPublishedProjects } = await import("@/lib/notion-projects");
    vi.mocked(getPublishedProjects).mockResolvedValue([
      {
        id: "proj-no-image",
        slug: "project-no-image",
        title: "Project No Image",
        description: "No image here",
        image: null,
        emoji: null,
        externalUrl: "",
        tags: [],
        featured: false,
        published: true,
        lastEdited: "2025-07-01",
      },
    ]);
    await renderProjectsPage();
    const allImgs = document.querySelectorAll("img");
    const coverImg = Array.from(allImgs).find((img) =>
      img.getAttribute("src")?.includes("notion-cover?pageId=proj-no-image")
    );
    expect(coverImg).toBeUndefined();
  });
});
