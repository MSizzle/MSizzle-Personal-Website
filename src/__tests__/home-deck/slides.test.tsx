import { describe, it, expect, vi } from "vitest";

vi.mock("motion/react", () => ({ useReducedMotion: () => false }));

describe("SlideIndex (HD-04)", () => {
  it("renders 3 items: Works, Writing, Prometheus links", () => {
    expect(false).toBe(true);
  });
});
