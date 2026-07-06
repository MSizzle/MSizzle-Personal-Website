import React from "react";
import { describe, it, expect, afterEach } from "vitest";
import { render, screen, cleanup } from "@testing-library/react";
import { Pinboard } from "@/components/home/pinboard";
import type { LoveItem } from "@/lib/notion-loves";

function make(partial: Partial<LoveItem> & Pick<LoveItem, "id" | "type">): LoveItem {
  return {
    title: "Title",
    subtitle: "",
    note: "",
    url: "",
    youtubeId: null,
    cover: null,
    order: null,
    published: true,
    lastEdited: "2026-01-01",
    ...partial,
  };
}

const ITEMS: LoveItem[] = [
  make({ id: "p1", type: "Place", title: "Big Sur", note: "I go to reset.", cover: "https://notion.so/x.jpg" }),
  make({ id: "b1", type: "Book", title: "The Book", subtitle: "An Author" }),
  make({
    id: "y1",
    type: "YouTube",
    title: "A talk",
    subtitle: "Conference",
    url: "https://www.youtube.com/watch?v=dQw4w9WgXcQ",
    youtubeId: "dQw4w9WgXcQ",
    note: "Re-watched more than any other.",
  }),
  make({ id: "h1", type: "Hobby", title: "Mushrooms", subtitle: "Since a dorm room" }),
];

afterEach(() => cleanup());

describe("Pinboard (sketch 012)", () => {
  it("renders one card per item", () => {
    const { container } = render(<Pinboard items={ITEMS} />);
    expect(container.querySelectorAll(".pb-card").length).toBe(4);
  });

  it("renders a YouTube thumbnail from the video id", () => {
    const { container } = render(<Pinboard items={ITEMS} />);
    const img = container.querySelector('img[src*="img.youtube.com/vi/dQw4w9WgXcQ"]');
    expect(img).not.toBeNull();
  });

  it("renders the Notion cover proxy for a Place with a cover", () => {
    const { container } = render(<Pinboard items={ITEMS} />);
    const img = container.querySelector('img[src="/api/notion-cover?pageId=p1"]');
    expect(img).not.toBeNull();
  });

  it("renders a fallback swatch for an item with no cover", () => {
    const { container } = render(<Pinboard items={[make({ id: "b1", type: "Book" })]} />);
    expect(container.querySelector(".pb-swatch")).not.toBeNull();
  });

  it("includes the note text and an external Open link with safe rel", () => {
    render(<Pinboard items={ITEMS} />);
    expect(screen.getByText(/Re-watched more than any other/)).toBeDefined();
    const open = screen
      .getAllByRole("link")
      .find((a) => a.getAttribute("href") === "https://www.youtube.com/watch?v=dQw4w9WgXcQ");
    expect(open).toBeDefined();
    expect(open!.getAttribute("target")).toBe("_blank");
    expect(open!.getAttribute("rel")).toContain("noopener");
    expect(open!.getAttribute("rel")).toContain("noreferrer");
  });

  it("does not render a note panel when the item has no note", () => {
    const { container } = render(<Pinboard items={[make({ id: "b1", type: "Book", note: "" })]} />);
    expect(container.querySelector(".pb-note")).toBeNull();
  });
});
