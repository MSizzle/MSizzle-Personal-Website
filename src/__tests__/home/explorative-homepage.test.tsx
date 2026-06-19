import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";

// Mock motion/react — no real animation in test env
vi.mock("motion/react", () => ({ useReducedMotion: () => false }));

// Mock CanvasLoader so the test doesn't need WebGL
vi.mock("@/components/home/canvas-loader", () => ({
  CanvasLoader: function CanvasLoaderMock() {
    const React = require("react");
    return React.createElement("div", { "data-testid": "canvas-loader" });
  },
}));

// Mock FallbackPoster so the test doesn't need next/image
vi.mock("@/components/home/fallback-poster", () => ({
  FallbackPoster: function FallbackPosterMock() {
    const React = require("react");
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

// Stub the real component (does not exist yet — created in Plan 15-02)
vi.mock("@/components/home/explorative-homepage", () => ({
  ExplorativeHomepage: function ExplorativeHomepageStub() {
    return null;
  },
}));

// Standard matchMedia mock (from Shared Patterns — PATTERNS.md)
function mockMatchMedia(coarse: boolean) {
  vi.spyOn(window, "matchMedia").mockImplementation((query: string) => ({
    matches: coarse ? query === "(pointer: coarse)" : false,
    media: query,
    onchange: null,
    addListener: vi.fn(),
    removeListener: vi.fn(),
    addEventListener: vi.fn(),
    removeEventListener: vi.fn(),
    dispatchEvent: vi.fn(),
  } as MediaQueryList));
}

describe("ExplorativeHomepage gate (TD-03 + HD-05)", () => {
  afterEach(() => {
    vi.restoreAllMocks();
  });

  it("stub is importable before real component exists", async () => {
    const { ExplorativeHomepage } = await import(
      "@/components/home/explorative-homepage"
    );
    expect(ExplorativeHomepage).toBeDefined();
  });

  // Will be promoted to real tests in Plan 15-02 Task 3 (gate logic)
  it.todo(
    "shows fallback-poster on pointer:coarse (touch device) — wire to real component"
  );
  it.todo(
    "shows fallback-poster when WebGL2 unavailable — wire to real component"
  );
  it.todo(
    "shows canvas-loader on pointer:fine with WebGL2 available — wire to real component"
  );
  it.todo(
    "shows fallback-poster when prefers-reduced-motion — wire to real component"
  );
});
