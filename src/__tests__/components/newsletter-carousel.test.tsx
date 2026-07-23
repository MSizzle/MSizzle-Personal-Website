/**
 * Tests for NewsletterCarousel neutral blur placeholder.
 * Quick task 260723-g2q, Task 2 (FIX 1: fade-in + placeholder).
 */
import React from "react";
import { describe, it, expect, vi, afterEach } from "vitest";
import { render, cleanup } from "@testing-library/react";

vi.mock("next/image", () => ({
  default: (props: Record<string, unknown>) =>
    React.createElement("img", { ...props }),
}));

vi.mock("next/link", () => ({
  default: ({ children, href, ...props }: any) =>
    React.createElement("a", { href, ...props }, children),
}));

afterEach(() => {
  cleanup();
});

describe("NewsletterCarousel neutral placeholder (260723-g2q Task 2)", () => {
  it("renders placeholder=blur and a neutral blurDataURL when thumbnail is set", async () => {
    const { NewsletterCarousel } = await import("@/components/v3/newsletter-carousel");
    const { container } = render(
      React.createElement(NewsletterCarousel, {
        issues: [{ title: "T", date: "2026-01", thumbnail: "https://x.com/y.jpg" }],
      })
    );
    const img = container.querySelector("img");
    expect(img).not.toBeNull();
    expect(img?.getAttribute("placeholder")).toBe("blur");
    expect(img?.getAttribute("blurDataURL")).toMatch(/^data:image\/png;base64,/);
  });

  it("renders the MM glyph fallback and no img when thumbnail is null", async () => {
    const { NewsletterCarousel } = await import("@/components/v3/newsletter-carousel");
    const { container, getByText } = render(
      React.createElement(NewsletterCarousel, {
        issues: [{ title: "T", date: "2026-01", thumbnail: null }],
      })
    );
    expect(container.querySelector("img")).toBeNull();
    expect(getByText("MM")).toBeDefined();
  });
});
