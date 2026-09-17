import React from "react";
import { describe, it, expect, afterEach } from "vitest";
import { render, screen, cleanup } from "@testing-library/react";
import { LovesTeaser } from "@/components/home/loves-teaser";
import type { LoveItem } from "@/lib/notion-loves";

afterEach(() => cleanup());

function makeItem(overrides: Partial<LoveItem> = {}): LoveItem {
  return {
    id: "item-1",
    type: "Place",
    category: "Place",
    title: "Big Sur",
    subtitle: "",
    note: "",
    url: "",
    youtubeId: null,
    cover: null,
    order: null,
    published: true,
    lastEdited: "2026-01-01",
    ...overrides,
  };
}

describe("LovesTeaser", () => {
  it("renders nothing when there are no items", () => {
    const { container } = render(React.createElement(LovesTeaser, { items: [] }));
    expect(container.firstChild).toBeNull();
  });

  it("renders nothing with no items prop at all", () => {
    const { container } = render(React.createElement(LovesTeaser));
    expect(container.firstChild).toBeNull();
  });

  it("caps the strip at 5 tiles", () => {
    const items = Array.from({ length: 8 }, (_, i) =>
      makeItem({ id: `item-${i}`, title: `Item ${i}` })
    );
    const { container } = render(React.createElement(LovesTeaser, { items }));
    expect(container.querySelectorAll('a[href="#loves"] > div:last-child > span'))
      .toHaveLength(5);
  });

  it("wraps the whole strip in a single link to #loves", () => {
    render(React.createElement(LovesTeaser, { items: [makeItem()] }));
    const links = screen.getAllByRole("link");
    expect(links).toHaveLength(1);
    expect(links[0].getAttribute("href")).toBe("#loves");
  });

  it("renders a real cover image when the item has one", () => {
    const { container } = render(
      React.createElement(LovesTeaser, {
        items: [makeItem({ id: "p1", cover: "https://example.com/x.jpg" })],
      })
    );
    const img = container.querySelector("img");
    expect(img?.getAttribute("src")).toBe(
      "/api/notion-cover?pageId=p1&w=200"
    );
  });

  it("falls back to a swatch when the item has no cover", () => {
    const { container } = render(
      React.createElement(LovesTeaser, { items: [makeItem({ cover: null })] })
    );
    expect(container.querySelector("img")).toBeNull();
  });

  it("uses the YouTube thumbnail for a YouTube item with a video id", () => {
    const { container } = render(
      React.createElement(LovesTeaser, {
        items: [
          makeItem({
            id: "yt1",
            type: "YouTube",
            youtubeId: "abc123",
            cover: null,
          }),
        ],
      })
    );
    const img = container.querySelector("img");
    expect(img?.getAttribute("src")).toBe(
      "https://img.youtube.com/vi/abc123/hqdefault.jpg"
    );
  });
});
