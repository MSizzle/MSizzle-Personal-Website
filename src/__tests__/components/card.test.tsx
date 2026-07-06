/**
 * Tests for Card component — extended with optional coverSrc prop.
 * Plan 04 (16-04) TDD RED gate.
 *
 * Asserts:
 * (a) coverSrc renders an image element
 * (b) absent coverSrc renders no img
 * (c) href wraps in Link (anchor)
 * (d) text content (title/blurb) renders correctly in both cases
 *
 * Plan 19-01 additions:
 * (e) no coverSrc renders title-card face
 * (f) titleCardField="ink" renders title-card--ink class
 * (g) readingTime renders "N min read"
 * (h) cover error swaps to title-card face client-side
 */
import React from "react";
import { describe, it, expect, vi, afterEach } from "vitest";
import { render, screen, cleanup, fireEvent } from "@testing-library/react";

// Mock next/image — renders as a plain img element for testing
vi.mock("next/image", () => ({
  default: (props: Record<string, unknown>) =>
    React.createElement("img", { ...props }),
}));

// Mock next/link — renders as a plain anchor for testing
vi.mock("next/link", () => ({
  default: ({ children, href, ...props }: any) =>
    React.createElement("a", { href, ...props }, children),
}));

afterEach(() => {
  cleanup();
});

describe("Card component (Plan 04 / 16-04)", () => {
  it("renders title text", async () => {
    const { Card } = await import("@/components/v3/card");
    render(React.createElement(Card, { title: "My Essay" }));
    expect(screen.getByText("My Essay")).toBeDefined();
  });

  it("renders blurb text when provided", async () => {
    const { Card } = await import("@/components/v3/card");
    render(React.createElement(Card, { title: "Title", blurb: "A short description" }));
    expect(screen.getByText("A short description")).toBeDefined();
  });

  it("renders kicker text when provided", async () => {
    const { Card } = await import("@/components/v3/card");
    render(React.createElement(Card, { title: "Title", kicker: "Philosophy" }));
    expect(screen.getByText("Philosophy")).toBeDefined();
  });

  it("wraps in an anchor tag when href is provided", async () => {
    const { Card } = await import("@/components/v3/card");
    const { container } = render(
      React.createElement(Card, { title: "Title", href: "/blog/my-post" })
    );
    const anchor = container.querySelector("a");
    expect(anchor).toBeDefined();
    expect(anchor?.getAttribute("href")).toBe("/blog/my-post");
  });

  it("does NOT render an anchor tag when href is omitted", async () => {
    const { Card } = await import("@/components/v3/card");
    const { container } = render(
      React.createElement(Card, { title: "Title" })
    );
    const anchor = container.querySelector("a");
    expect(anchor).toBeNull();
  });

  it("renders an img element when coverSrc is provided", async () => {
    const { Card } = await import("@/components/v3/card");
    const { container } = render(
      React.createElement(Card, {
        title: "Cover Post",
        coverSrc: "/api/notion-cover?pageId=abc123",
        coverAlt: "Cover image",
      })
    );
    const img = container.querySelector("img");
    expect(img).toBeDefined();
    expect(img?.getAttribute("src")).toBe("/api/notion-cover?pageId=abc123");
    expect(img?.getAttribute("alt")).toBe("Cover image");
  });

  it("does NOT render an img element when coverSrc is absent", async () => {
    const { Card } = await import("@/components/v3/card");
    const { container } = render(
      React.createElement(Card, { title: "No Cover Post" })
    );
    const img = container.querySelector("img");
    expect(img).toBeNull();
  });

  it("renders correctly with href AND coverSrc (link wraps image + text)", async () => {
    const { Card } = await import("@/components/v3/card");
    const { container } = render(
      React.createElement(Card, {
        title: "Linked Cover Card",
        blurb: "Some blurb",
        href: "/blog/test",
        coverSrc: "/api/notion-cover?pageId=xyz",
        coverAlt: "Test cover",
      })
    );
    const anchor = container.querySelector("a");
    expect(anchor).toBeDefined();
    expect(anchor?.getAttribute("href")).toBe("/blog/test");
    const img = container.querySelector("img");
    expect(img).toBeDefined();
    expect(screen.getByText("Linked Cover Card")).toBeDefined();
    expect(screen.getByText("Some blurb")).toBeDefined();
  });

  it("coverAlt defaults to empty string when not provided alongside coverSrc", async () => {
    const { Card } = await import("@/components/v3/card");
    const { container } = render(
      React.createElement(Card, {
        title: "Alt Default",
        coverSrc: "/api/notion-cover?pageId=xyz",
      })
    );
    const img = container.querySelector("img");
    expect(img).toBeDefined();
    // alt should be "" (decorative) when coverAlt is not provided
    expect(img?.getAttribute("alt")).toBe("");
  });
});

describe("Card title-card fallback (Phase 19 / 19-01)", () => {
  it("Card with no coverSrc renders a title-card face containing the title text", async () => {
    const { Card } = await import("@/components/v3/card");
    const { container } = render(
      React.createElement(Card, { title: "My Fallback Title" })
    );
    const titleCard = container.querySelector(".title-card");
    expect(titleCard).toBeDefined();
    expect(titleCard?.textContent).toContain("My Fallback Title");
  });

  it("Card with titleCardField='ink' and no coverSrc renders an element with class title-card--ink", async () => {
    const { Card } = await import("@/components/v3/card");
    const { container } = render(
      React.createElement(Card, { title: "Ink Card", titleCardField: "ink" })
    );
    const inkCard = container.querySelector(".title-card--ink");
    expect(inkCard).toBeDefined();
  });

  it("Card with readingTime=4 renders the exact text '4 min read'", async () => {
    const { Card } = await import("@/components/v3/card");
    render(
      React.createElement(Card, { title: "Essay", readingTime: 4 })
    );
    expect(screen.getByText("4 min read")).toBeDefined();
  });

  it("Card with coverSrc swaps to title-card face after cover image error", async () => {
    const { Card } = await import("@/components/v3/card");
    const { container } = render(
      React.createElement(Card, {
        title: "Error Fallback",
        coverSrc: "/api/notion-cover?pageId=broken",
        coverAlt: "Broken cover",
      })
    );
    // Image should be present initially
    const img = container.querySelector("img");
    expect(img).toBeDefined();
    // Fire error on the img to trigger the fallback swap
    fireEvent.error(img!);
    // After error: img is gone, title-card is present
    expect(container.querySelector("img")).toBeNull();
    const titleCard = container.querySelector(".title-card");
    expect(titleCard).toBeDefined();
  });
});
