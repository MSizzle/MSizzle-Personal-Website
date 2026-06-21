/**
 * Tests for /watching page — Phase 17 Plan 01 (IN-03).
 *
 * Asserts:
 * (a) metadata.title equals 'Watching | Monty Singer'
 * (b) metadata.alternates.canonical equals '/watching'
 * (c) metadata.openGraph.title equals 'Watching | Monty Singer'
 * (d) Breadcrumbs renders 'Home' item
 * (e) Breadcrumbs renders 'Watching' item
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

// Mock VideoCard — renders a div stub per item
vi.mock("@/components/v3/video-card", () => ({
  VideoCard: ({ title }: { title: string }) =>
    React.createElement("div", { "data-testid": "video-card" }, title),
}));

// Mock PageHero — render title as h1
vi.mock("@/components/v3/page-hero", () => ({
  PageHero: ({ title }: { title: string }) =>
    React.createElement("h1", { "data-testid": "page-hero" }, title),
}));

// Mock Breadcrumbs — render nav with item names so screen.getByText works
vi.mock("@/components/seo/breadcrumbs", () => ({
  Breadcrumbs: ({ items }: { items: Array<{ name: string; href?: string }> }) =>
    React.createElement(
      "nav",
      { "aria-label": "Breadcrumb" },
      ...items.map((item, idx) =>
        React.createElement("span", { key: idx }, item.name)
      )
    ),
}));

afterEach(() => {
  cleanup();
  vi.clearAllMocks();
});

async function renderWatchingPage() {
  const { default: WatchingPage } = await import("@/app/watching/page");
  const element = await WatchingPage();
  render(element as any);
}

describe("/watching page (Phase 17 / IN-03)", () => {
  it("metadata.title equals 'Watching | Monty Singer'", async () => {
    const { metadata } = await import("@/app/watching/page");
    const resolved = typeof metadata === "function" ? await metadata() : metadata;
    expect(resolved.title).toBe("Watching | Monty Singer");
  });

  it("metadata.alternates.canonical equals '/watching'", async () => {
    const { metadata } = await import("@/app/watching/page");
    const resolved = typeof metadata === "function" ? await metadata() : metadata;
    expect((resolved as any).alternates?.canonical).toBe("/watching");
  });

  it("metadata.openGraph.title equals 'Watching | Monty Singer'", async () => {
    const { metadata } = await import("@/app/watching/page");
    const resolved = typeof metadata === "function" ? await metadata() : metadata;
    expect((resolved as any).openGraph?.title).toBe("Watching | Monty Singer");
  });

  it("renders breadcrumb 'Home' item", async () => {
    await renderWatchingPage();
    expect(screen.getAllByText("Home").length).toBeGreaterThan(0);
  });

  it("renders breadcrumb 'Watching' item", async () => {
    await renderWatchingPage();
    expect(screen.getAllByText("Watching").length).toBeGreaterThan(0);
  });
});
