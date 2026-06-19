import { describe, it, expect, vi } from "vitest";

// Mock next/image — standard pattern for testing components that use Next.js Image
vi.mock("next/image", () => ({
  default: function ImageMock(props: { src: string; alt: string; [key: string]: unknown }) {
    const React = require("react");
    // eslint-disable-next-line @next/next/no-img-element, jsx-a11y/alt-text
    return React.createElement("img", { src: props.src, alt: props.alt, "data-testid": "next-image" });
  },
}));

// Stub the real component (does not exist yet — created in Plan 15-04)
vi.mock("@/components/home/fallback-poster", () => ({
  FallbackPoster: function FallbackPosterStub() {
    const React = require("react");
    return React.createElement("div", { "data-testid": "fallback-poster" });
  },
}));

describe("TD-03 / HD-05 — FallbackPoster", () => {
  it("stub is importable before real component exists", async () => {
    const { FallbackPoster } = await import("@/components/home/fallback-poster");
    expect(FallbackPoster).toBeDefined();
  });

  // Will be promoted to real test in Plan 15-04 Task 1 (FallbackPoster implementation)
  it.todo(
    "renders an img with src containing hero-blob-poster.webp — wire to real component"
  );
  it.todo(
    "img has fetchPriority=high attribute (required for LCP in Next 16) — wire to real component"
  );
  it.todo(
    "renders with data-testid=fallback-poster for gate detection — wire to real component"
  );
});
