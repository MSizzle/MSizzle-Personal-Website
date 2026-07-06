import { describe, it, expect, vi, afterEach } from "vitest";
import { render, cleanup } from "@testing-library/react";
import React from "react";

// Mock motion/react — no real animation in test env
vi.mock("motion/react", () => ({ useReducedMotion: () => false }));

// Mock Hero: renders its own light hero band
vi.mock("@/components/home/hero", () => ({
  Hero: function HeroMock() {
    return React.createElement("section", { "data-testid": "hero" });
  },
}));

// Mock StickyNav: must render something so we can assert it mounts
vi.mock("@/components/home/sticky-nav", () => ({
  StickyNav: function StickyNavMock() {
    return React.createElement("div", { "data-testid": "sticky-nav" });
  },
}));

// Mock ScrollReveals: headless but must render a node for assertion
vi.mock("@/components/home/scroll-reveals", () => ({
  ScrollReveals: function ScrollRevealsMock() {
    return React.createElement("div", { "data-testid": "scroll-reveals" });
  },
}));

// Mock all section components — not under test here
vi.mock("@/components/home/section-building", () => ({
  SectionBuilding: function SectionBuildingMock() {
    return React.createElement("span", null, "Building content");
  },
}));
vi.mock("@/components/home/section-work", () => ({
  SectionWork: function SectionWorkMock() {
    return React.createElement("span", null, "Work content");
  },
}));
vi.mock("@/components/home/section-loves", () => ({
  SectionLoves: function SectionLovesMock() {
    return React.createElement("span", null, "Loves content");
  },
}));
vi.mock("@/components/home/section-newsletter", () => ({
  SectionNewsletter: function SectionNewsletterMock() {
    return React.createElement("span", null, "Newsletter content");
  },
}));
vi.mock("@/components/home/section-footer", () => ({
  SectionFooter: function SectionFooterMock() {
    return React.createElement("span", null, "Footer content");
  },
}));

describe("ExplorativeHomepage orchestrator (17.4 band structure)", () => {
  afterEach(() => {
    cleanup();
    vi.restoreAllMocks();
  });

  it("mounts StickyNav island", async () => {
    const { ExplorativeHomepage } = await import(
      "@/components/home/explorative-homepage"
    );
    const { getByTestId } = render(React.createElement(ExplorativeHomepage));
    expect(getByTestId("sticky-nav")).toBeTruthy();
  });

  it("mounts ScrollReveals island", async () => {
    const { ExplorativeHomepage } = await import(
      "@/components/home/explorative-homepage"
    );
    const { getByTestId } = render(React.createElement(ExplorativeHomepage));
    expect(getByTestId("scroll-reveals")).toBeTruthy();
  });

  it("band id=building is present on a dark band", async () => {
    const { ExplorativeHomepage } = await import(
      "@/components/home/explorative-homepage"
    );
    const { container } = render(React.createElement(ExplorativeHomepage));
    const el = container.querySelector("#building");
    expect(el).toBeTruthy();
    expect(el?.className).toContain("band-dark");
  });

  it("band id=work is present on a light band (no band-dark)", async () => {
    const { ExplorativeHomepage } = await import(
      "@/components/home/explorative-homepage"
    );
    const { container } = render(React.createElement(ExplorativeHomepage));
    const el = container.querySelector("#work");
    expect(el).toBeTruthy();
    expect(el?.className).not.toContain("band-dark");
  });

  it("band id=loves is present on a light band (no band-dark)", async () => {
    const { ExplorativeHomepage } = await import(
      "@/components/home/explorative-homepage"
    );
    const { container } = render(React.createElement(ExplorativeHomepage));
    const el = container.querySelector("#loves");
    expect(el).toBeTruthy();
    expect(el?.className).not.toContain("band-dark");
  });

  it("band id=writing is present on a dark band", async () => {
    const { ExplorativeHomepage } = await import(
      "@/components/home/explorative-homepage"
    );
    const { container } = render(React.createElement(ExplorativeHomepage));
    const el = container.querySelector("#writing");
    expect(el).toBeTruthy();
    expect(el?.className).toContain("band-dark");
  });
});
