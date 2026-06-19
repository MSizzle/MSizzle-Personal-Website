import React from "react";
import { describe, it, expect, vi, afterEach } from "vitest";
import { render, cleanup } from "@testing-library/react";

// Mock next/image — renders as a plain img element for testing
vi.mock("next/image", () => ({
  default: (props: Record<string, unknown>) =>
    React.createElement("img", { ...props, "data-testid": "fallback-image" }),
}));

afterEach(() => {
  cleanup();
});

describe("TD-03 / HD-05 — FallbackPoster", () => {
  it("renders an img with src containing hero-blob-poster.webp", async () => {
    const { FallbackPoster } = await import("@/components/home/fallback-poster");
    const { getByTestId } = render(React.createElement(FallbackPoster));
    const img = getByTestId("fallback-image");
    expect(img).toBeDefined();
    expect((img as HTMLImageElement).src).toContain("hero-blob-poster.webp");
  });

  it("img has fetchPriority=high attribute (required for LCP in Next 16)", async () => {
    const { FallbackPoster } = await import("@/components/home/fallback-poster");
    const { getByTestId } = render(React.createElement(FallbackPoster));
    const img = getByTestId("fallback-image");
    // fetchPriority prop is passed as a string attribute via the mock
    expect(img.getAttribute("fetchPriority") ?? img.getAttribute("fetchpriority")).toBe("high");
  });
});
