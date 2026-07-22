import React from "react";
import { describe, it, expect, vi, afterEach } from "vitest";
import { render, screen, cleanup } from "@testing-library/react";
import type { LoveItem } from "@/lib/notion-loves";

// Stub the two children so we test SectionLoves' branching, not their internals.
vi.mock("@/components/home/pinboard", () => ({
  Pinboard: ({ items }: { items: LoveItem[] }) =>
    React.createElement("div", { "data-testid": "pinboard", "data-count": items.length }),
}));
vi.mock("@/components/home/photo-marquee", () => ({
  PhotoMarquee: () => React.createElement("div", { "data-testid": "marquee" }),
}));

import { SectionLoves } from "@/components/home/section-loves";

const oneItem: LoveItem[] = [
  {
    id: "p1",
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
  },
];

afterEach(() => cleanup());

describe("SectionLoves", () => {
  it("always renders the plain mono '03 · Things I Love' label + heading", () => {
    render(React.createElement(SectionLoves));
    expect(screen.getByText("03 · Things I Love")).toBeDefined();
    expect(screen.getByText(/Things I love outside of work/i)).toBeDefined();
  });

  it("falls back to the PhotoMarquee when there are no items", () => {
    render(React.createElement(SectionLoves, { items: [] }));
    expect(screen.getByTestId("marquee")).toBeDefined();
    expect(screen.queryByTestId("pinboard")).toBeNull();
  });

  it("renders the Pinboard when items are present", () => {
    render(React.createElement(SectionLoves, { items: oneItem }));
    const board = screen.getByTestId("pinboard");
    expect(board).toBeDefined();
    expect(board.getAttribute("data-count")).toBe("1");
    expect(screen.queryByTestId("marquee")).toBeNull();
  });
});
