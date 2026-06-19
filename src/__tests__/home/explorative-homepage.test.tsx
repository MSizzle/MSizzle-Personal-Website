import { describe, it, expect, vi, afterEach } from "vitest";
import { render, screen, act, cleanup } from "@testing-library/react";
import React from "react";

// Mock motion/react — no real animation in test env
vi.mock("motion/react", () => ({ useReducedMotion: () => false }));

// Mock CanvasLoader so the test doesn't need WebGL
vi.mock("@/components/home/canvas-loader", () => ({
  CanvasLoader: function CanvasLoaderMock() {
    return React.createElement("div", { "data-testid": "canvas-loader" });
  },
}));

// Mock FallbackPoster so the test doesn't need next/image
vi.mock("@/components/home/fallback-poster", () => ({
  FallbackPoster: function FallbackPosterMock() {
    return React.createElement("div", { "data-testid": "fallback-poster" });
  },
}));

// Mock all section components — not under test here
vi.mock("@/components/home/section-building", () => ({
  SectionBuilding: function SectionBuildingMock() {
    return null;
  },
}));
vi.mock("@/components/home/section-writing", () => ({
  SectionWriting: function SectionWritingMock() {
    return null;
  },
}));
vi.mock("@/components/home/section-newsletter", () => ({
  SectionNewsletter: function SectionNewsletterMock() {
    return null;
  },
}));
vi.mock("@/components/home/section-footer", () => ({
  SectionFooter: function SectionFooterMock() {
    return null;
  },
}));

// Standard matchMedia mock helper (jsdom does not define window.matchMedia)
function mockMatchMedia(coarse: boolean) {
  Object.defineProperty(window, "matchMedia", {
    writable: true,
    configurable: true,
    value: (query: string) => ({
      matches: coarse ? query === "(pointer: coarse)" : false,
      media: query,
      onchange: null,
      addListener: vi.fn(),
      removeListener: vi.fn(),
      addEventListener: vi.fn(),
      removeEventListener: vi.fn(),
      dispatchEvent: vi.fn(),
    }),
  });
}

describe("ExplorativeHomepage gate (TD-03 + HD-05)", () => {
  afterEach(() => {
    cleanup(); // unmount all rendered components
    vi.restoreAllMocks();
    // Reset matchMedia to undefined so spies don't bleed between tests
    Object.defineProperty(window, "matchMedia", {
      writable: true,
      configurable: true,
      value: undefined,
    });
  });

  it("shows fallback-poster on pointer:coarse (touch device)", async () => {
    // coarse = true → isTouchOrSmall = true → showCanvas = false
    mockMatchMedia(true);
    const { ExplorativeHomepage } = await import(
      "@/components/home/explorative-homepage"
    );
    await act(async () => {
      render(React.createElement(ExplorativeHomepage));
    });
    expect(screen.getByTestId("fallback-poster")).toBeTruthy();
  });

  it("shows fallback-poster when WebGL2 unavailable", async () => {
    // fine pointer, large screen — but WebGL2 returns null
    mockMatchMedia(false);
    // Capture original before spying to avoid infinite recursion
    const originalCreateElement = document.createElement.bind(document);
    vi.spyOn(document, "createElement").mockImplementation((tag: string) => {
      if (tag === "canvas") {
        return { getContext: () => null } as unknown as HTMLElement;
      }
      return originalCreateElement(tag);
    });
    const { ExplorativeHomepage } = await import(
      "@/components/home/explorative-homepage"
    );
    await act(async () => {
      render(React.createElement(ExplorativeHomepage));
    });
    expect(screen.getByTestId("fallback-poster")).toBeTruthy();
  });
});
