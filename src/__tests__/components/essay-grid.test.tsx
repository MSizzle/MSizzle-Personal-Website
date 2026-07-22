import React from "react";
import { describe, it, expect, vi, afterEach } from "vitest";
import { render, screen, cleanup, fireEvent } from "@testing-library/react";
import { EssayGrid, type EssayGridPost } from "@/components/editorial/essay-grid";

// Mock next/image
vi.mock("next/image", () => ({
  default: (props: Record<string, unknown>) =>
    React.createElement("img", { ...props }),
}));

// Mock next/link
vi.mock("next/link", () => ({
  default: ({ children, href, ...props }: any) =>
    React.createElement("a", { href, ...props }, children),
}));

afterEach(() => cleanup());

function makePost(overrides: Partial<EssayGridPost>): EssayGridPost {
  return {
    id: overrides.slug ?? "post-id",
    slug: "post-slug",
    title: "Post title",
    description: "A short description.",
    tags: [],
    cover: null,
    year: 2026,
    ...overrides,
  };
}

describe("EssayGrid", () => {
  it("renders 3 posts in one flat grid, no expand button, no year headings", () => {
    const posts = [
      makePost({ slug: "p1", id: "p1", title: "Post 1", year: 2026 }),
      makePost({ slug: "p2", id: "p2", title: "Post 2", year: 2026 }),
      makePost({ slug: "p3", id: "p3", title: "Post 3", year: 2025 }),
    ];
    render(React.createElement(EssayGrid, { posts }));

    expect(screen.getByText("Post 1")).toBeDefined();
    expect(screen.getByText("Post 2")).toBeDefined();
    expect(screen.getByText("Post 3")).toBeDefined();
    expect(screen.queryByText(/show all essays/i)).toBeNull();
    expect(document.querySelectorAll(".card-grid").length).toBe(1);
    expect(screen.queryByText("2026")).toBeNull();
    expect(screen.queryByText("2025")).toBeNull();
  });

  it("8 posts across two years render exactly 6 Cards initially plus a show-all button", () => {
    const posts: EssayGridPost[] = Array.from({ length: 8 }, (_, i) =>
      makePost({
        slug: `p${i}`,
        id: `p${i}`,
        title: `Post ${i}`,
        year: i < 5 ? 2026 : 2025,
      })
    );
    render(React.createElement(EssayGrid, { posts }));

    // Only first 6 (newest, i.e. posts[0..5]) render.
    for (let i = 0; i < 6; i++) {
      expect(screen.getByText(`Post ${i}`)).toBeDefined();
    }
    expect(screen.queryByText("Post 6")).toBeNull();
    expect(screen.queryByText("Post 7")).toBeNull();

    expect(screen.getByText("show all essays (8) →")).toBeDefined();
  });

  it("clicking the show-all button reveals all 8 posts, both years' labels, and hides the button", () => {
    const posts: EssayGridPost[] = Array.from({ length: 8 }, (_, i) =>
      makePost({
        slug: `p${i}`,
        id: `p${i}`,
        title: `Post ${i}`,
        year: i < 5 ? 2026 : 2025,
      })
    );
    render(React.createElement(EssayGrid, { posts }));

    fireEvent.click(screen.getByText("show all essays (8) →"));

    for (let i = 0; i < 8; i++) {
      expect(screen.getByText(`Post ${i}`)).toBeDefined();
    }
    expect(screen.getByText("2026")).toBeDefined();
    expect(screen.getByText("2025")).toBeDefined();
    expect(screen.queryByText(/show all essays/i)).toBeNull();
  });

  it("renders 'No essays yet. Check back soon.' and zero .card-grid elements for an empty array", () => {
    render(React.createElement(EssayGrid, { posts: [] }));
    expect(screen.getByText("No essays yet. Check back soon.")).toBeDefined();
    expect(document.querySelectorAll(".card-grid").length).toBe(0);
  });
});
