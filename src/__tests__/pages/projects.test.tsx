/**
 * Tests for /projects page -- Plan 04 (16-04) photo grid rebuild.
 * Tests for /projects/[slug] detail page -- Plan 07 (16-07) repaint.
 *
 * Asserts (index page):
 * (a) Card components render for each project (not ListRow)
 * (b) When getPublishedProjects returns [] the text "No projects yet" appears
 * (c) PageHero renders with title="Building"
 *
 * Route note: /projects was renamed to /building (quick 260706-tx6); these tests
 * now import @/app/building/* and assert /building hrefs.
 *
 * Asserts (detail page - Plan 07):
 * (d) Breadcrumbs Building item href is /building
 * (e) PageHero renders with project title
 * (f) Cover image renders with fetchPriority="high" when project.cover exists
 * (g) No cover image when project.cover is null/absent
 * (h) externalUrl renders with rel="noopener noreferrer" target="_blank"
 * (i) NotionRenderer is present
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
vi.mock("@/lib/notion-projects", () => ({
  getPublishedProjects: vi.fn(),
  getProjectBySlug: vi.fn(),
}));

vi.mock("@/lib/notion", () => ({
  getBlocks: vi.fn(),
}));

// Mock SEO metadata builder for project detail
vi.mock("@/lib/seo/project-metadata", () => ({
  buildProjectMetadata: vi.fn(() => ({ title: "Test Project | Monty Singer" })),
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
async function renderProjectsPage() {
  const { default: BuildingPage } = await import("@/app/building/page");
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
        cover: null,
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
        cover: "https://example.com/img.jpg",
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
    // Cards link to /building/[slug]
    const links = screen.getAllByRole("link");
    const hrefs = links.map((l) => l.getAttribute("href"));
    expect(hrefs).toContain("/building/ai-assistant");
    expect(hrefs).toContain("/building/design-tool");
  });

  it("renders a title-card face instead of a cover image when project.image is non-null (Phase 19)", async () => {
    const { getPublishedProjects } = await import("@/lib/notion-projects");
    vi.mocked(getPublishedProjects).mockResolvedValue([
      {
        id: "proj-with-image",
        slug: "project-with-image",
        title: "Project With Image",
        description: "Has an image",
        cover: "https://notion.so/image.jpg",
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
    // Projects no longer use cover images as card faces (Phase 19 decision)
    const allImgs = document.querySelectorAll("img");
    const coverImg = Array.from(allImgs).find((img) =>
      img.getAttribute("src")?.includes("notion-cover?pageId=proj-with-image")
    );
    expect(coverImg).toBeUndefined();
    // A title-card element containing the project title should render instead
    const titleCards = document.querySelectorAll(".title-card");
    expect(titleCards.length).toBeGreaterThan(0);
    const titleTexts = Array.from(titleCards).map((el) => el.textContent ?? "");
    expect(titleTexts.some((t) => t.includes("Project With Image"))).toBe(true);
  });

  it("does NOT render cover image when project.image is null", async () => {
    const { getPublishedProjects } = await import("@/lib/notion-projects");
    vi.mocked(getPublishedProjects).mockResolvedValue([
      {
        id: "proj-no-image",
        slug: "project-no-image",
        title: "Project No Image",
        description: "No image here",
        cover: null,
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

describe("/projects title-card grid (Phase 19 / 19-02)", () => {
  it("grid container has class card-grid", async () => {
    const { getPublishedProjects } = await import("@/lib/notion-projects");
    vi.mocked(getPublishedProjects).mockResolvedValue([
      {
        id: "grid-proj",
        slug: "grid-project",
        title: "Grid Project",
        description: "For grid class test",
        cover: null,
        image: null,
        emoji: null,
        externalUrl: "",
        tags: [],
        featured: false,
        published: true,
        lastEdited: "2025-04-01",
      },
    ]);
    await renderProjectsPage();
    const cardGrid = document.querySelector(".card-grid");
    expect(cardGrid).not.toBeNull();
  });

  it("first project card has paper field and second has ink field (deterministic index alternation)", async () => {
    const { getPublishedProjects } = await import("@/lib/notion-projects");
    vi.mocked(getPublishedProjects).mockResolvedValue([
      {
        id: "proj-a",
        slug: "project-a",
        title: "Project Alpha",
        description: "First project",
        cover: null,
        image: null,
        emoji: null,
        externalUrl: "",
        tags: [],
        featured: false,
        published: true,
        lastEdited: "2025-06-01",
      },
      {
        id: "proj-b",
        slug: "project-b",
        title: "Project Beta",
        description: "Second project",
        cover: null,
        image: null,
        emoji: null,
        externalUrl: "",
        tags: [],
        featured: false,
        published: true,
        lastEdited: "2025-06-01",
      },
    ]);
    await renderProjectsPage();
    const titleCards = document.querySelectorAll(".title-card");
    expect(titleCards.length).toBeGreaterThanOrEqual(2);
    // First card: paper field -- has "title-card" class but NOT "title-card--ink"
    expect(titleCards[0].classList.contains("title-card--ink")).toBe(false);
    // Second card: ink field -- has "title-card--ink"
    expect(titleCards[1].classList.contains("title-card--ink")).toBe(true);
  });
});

// ── Plan 07: /projects/[slug] detail page tests ─────────────────────────────

const makeMockProject = (overrides: Partial<Record<string, unknown>> = {}) => ({
  id: "proj-detail-abc",
  slug: "my-project",
  title: "My Cool Project",
  description: "A detailed project description",
  published: true,
  tags: ["AI", "Product"],
  cover: null,
  image: null,
  emoji: null,
  externalUrl: null,
  featured: false,
  lastEdited: "2026-03-15",
  ...overrides,
});

async function renderProjectDetailPage(slug: string) {
  const { default: ProjectPage } = await import("@/app/building/[slug]/page");
  const element = await (ProjectPage as any)({ params: Promise.resolve({ slug }) });
  render(element as any);
}

describe("/projects/[slug] detail page (Plan 07 / PG-01, PG-04)", () => {
  it("Breadcrumbs Building item href is /building (260706-tx6)", async () => {
    const { getProjectBySlug } = await import("@/lib/notion-projects");
    const { getBlocks } = await import("@/lib/notion");
    vi.mocked(getProjectBySlug).mockResolvedValue(makeMockProject() as any);
    vi.mocked(getBlocks).mockResolvedValue([]);
    await renderProjectDetailPage("my-project");
    const allLinks = document.querySelectorAll("a");
    const hrefs = Array.from(allLinks).map((a) => a.getAttribute("href"));
    expect(hrefs).toContain("/building");
    expect(hrefs).not.toContain("/projects");
  });

  it("renders project title in PageHero h1 (D-02)", async () => {
    const { getProjectBySlug } = await import("@/lib/notion-projects");
    const { getBlocks } = await import("@/lib/notion");
    vi.mocked(getProjectBySlug).mockResolvedValue(makeMockProject() as any);
    vi.mocked(getBlocks).mockResolvedValue([]);
    await renderProjectDetailPage("my-project");
    const h1 = screen.getByRole("heading", { level: 1 });
    expect(h1.textContent).toContain("My Cool Project");
  });

  it("renders cover image with fetchPriority=high when project.cover exists (D-02, nextjs16-fetchpriority-quirk)", async () => {
    const { getProjectBySlug } = await import("@/lib/notion-projects");
    const { getBlocks } = await import("@/lib/notion");
    vi.mocked(getProjectBySlug).mockResolvedValue(
      makeMockProject({ cover: "https://notion.so/some-cover.jpg" }) as any
    );
    vi.mocked(getBlocks).mockResolvedValue([]);
    await renderProjectDetailPage("my-project");
    const imgs = document.querySelectorAll("img");
    const coverImg = Array.from(imgs).find((img) =>
      img.getAttribute("src")?.includes("notion-cover?pageId=proj-detail-abc")
    );
    expect(coverImg).toBeDefined();
    expect(coverImg?.getAttribute("fetchpriority")).toBe("high");
  });

  it("does NOT render cover image when project.cover is null", async () => {
    const { getProjectBySlug } = await import("@/lib/notion-projects");
    const { getBlocks } = await import("@/lib/notion");
    vi.mocked(getProjectBySlug).mockResolvedValue(
      makeMockProject({ cover: null }) as any
    );
    vi.mocked(getBlocks).mockResolvedValue([]);
    await renderProjectDetailPage("my-project");
    const imgs = document.querySelectorAll("img");
    const coverImg = Array.from(imgs).find((img) =>
      img.getAttribute("src")?.includes("notion-cover?pageId=proj-detail-abc")
    );
    expect(coverImg).toBeUndefined();
  });

  it("externalUrl anchor has rel=noopener noreferrer target=_blank (T-16-15)", async () => {
    const { getProjectBySlug } = await import("@/lib/notion-projects");
    const { getBlocks } = await import("@/lib/notion");
    vi.mocked(getProjectBySlug).mockResolvedValue(
      makeMockProject({ externalUrl: "https://github.com/user/my-project" }) as any
    );
    vi.mocked(getBlocks).mockResolvedValue([]);
    await renderProjectDetailPage("my-project");
    const allLinks = document.querySelectorAll("a");
    const externalLink = Array.from(allLinks).find((a) =>
      a.getAttribute("href") === "https://github.com/user/my-project"
    );
    expect(externalLink).toBeDefined();
    expect(externalLink?.getAttribute("rel")).toContain("noopener");
    expect(externalLink?.getAttribute("rel")).toContain("noreferrer");
    expect(externalLink?.getAttribute("target")).toBe("_blank");
  });

  it("NotionRenderer is present with fetched blocks (IN-02)", async () => {
    const { getProjectBySlug } = await import("@/lib/notion-projects");
    const { getBlocks } = await import("@/lib/notion");
    vi.mocked(getProjectBySlug).mockResolvedValue(makeMockProject() as any);
    vi.mocked(getBlocks).mockResolvedValue([
      { id: "blk-1" },
      { id: "blk-2" },
      { id: "blk-3" },
    ] as any);
    await renderProjectDetailPage("my-project");
    const renderer = screen.getByTestId("notion-renderer");
    expect(renderer).toBeDefined();
    expect(renderer.getAttribute("data-block-count")).toBe("3");
  });
});
