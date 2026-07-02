/**
 * Tests for /uses page — Phase 17.2 Plan 03 (D-06, D-07).
 *
 * Asserts:
 * (a) metadata.title equals 'Things I Love | Monty Singer'
 * (b) metadata.alternates.canonical equals '/uses'
 * (c) metadata.openGraph.title equals 'Things I Love | Monty Singer'
 * (d) Breadcrumbs renders 'Home' item
 * (e) Breadcrumbs renders 'Things I Love' item
 */
import React from "react";
import { describe, it, expect, vi, afterEach } from "vitest";
import { render, screen, cleanup } from "@testing-library/react";

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

// Mock UsesList — avoid rendering its DL/DT/DD internals
vi.mock("@/components/v3/uses-list", () => ({
  UsesList: () =>
    React.createElement("div", { "data-testid": "uses-list" }),
}));

// Mock VideoCard — avoid rendering Next.js Image and Link internals
vi.mock("@/components/v3/video-card", () => ({
  VideoCard: ({ title }: { title: React.ReactNode }) =>
    React.createElement("div", { "data-testid": "video-card" }, title),
}));

// Mock RuleStrong — just an hr
vi.mock("@/components/editorial/rule-strong", () => ({
  RuleStrong: () =>
    React.createElement("hr", { "data-testid": "rule-strong" }),
}));

// Mock PageHero — render title as h1 for assertions
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

async function renderUsesPage() {
  const { default: UsesPage } = await import("@/app/uses/page");
  const element = await UsesPage();
  render(element as any);
}

describe("/uses page — Things I Love (Phase 17.2 / D-06, D-07)", () => {
  it("metadata.title equals 'Things I Love | Monty Singer'", async () => {
    const { metadata } = await import("@/app/uses/page");
    const resolved = typeof metadata === "function" ? await metadata() : metadata;
    expect(resolved.title).toBe("Things I Love | Monty Singer");
  });

  it("metadata.alternates.canonical equals '/uses'", async () => {
    const { metadata } = await import("@/app/uses/page");
    const resolved = typeof metadata === "function" ? await metadata() : metadata;
    expect((resolved as any).alternates?.canonical).toBe("/uses");
  });

  it("metadata.openGraph.title equals 'Things I Love | Monty Singer'", async () => {
    const { metadata } = await import("@/app/uses/page");
    const resolved = typeof metadata === "function" ? await metadata() : metadata;
    expect((resolved as any).openGraph?.title).toBe("Things I Love | Monty Singer");
  });

  it("renders breadcrumb 'Home' item", async () => {
    await renderUsesPage();
    expect(screen.getAllByText("Home").length).toBeGreaterThan(0);
  });

  it("renders breadcrumb 'Things I Love' item", async () => {
    await renderUsesPage();
    expect(screen.getAllByText("Things I Love").length).toBeGreaterThan(0);
  });
});
