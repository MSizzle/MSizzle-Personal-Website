import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";

vi.mock("motion/react", () => ({ useReducedMotion: () => false }));

describe("SlideIndex (HD-04)", () => {
  it("renders BigList with Works, Writing, Prometheus links", async () => {
    const { SlideIndex } = await import("@/components/home-deck/slide-index");
    render(<SlideIndex />);
    // HD-04: "Slide 2 is the brutalist big-type index linking to Works / Writing / Prometheus"
    expect(screen.getByText(/Building/i)).toBeDefined();
    expect(screen.getByText(/Writing/i)).toBeDefined();
    expect(screen.getByText(/Doing/i)).toBeDefined();
  });

  it("has deck-slide class on wrapper", async () => {
    const { SlideIndex } = await import("@/components/home-deck/slide-index");
    const { container } = render(<SlideIndex />);
    expect(container.querySelector(".deck-slide")).toBeTruthy();
  });
});
