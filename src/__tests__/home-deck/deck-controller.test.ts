import { describe, it, expect, vi } from "vitest";

vi.mock("motion/react", () => ({ useReducedMotion: () => false }));

describe("useDeckController (HD-01, HD-02, HD-03)", () => {
  it("advances slide on wheel event (HD-01)", () => {
    expect(false).toBe(true);
  });

  it("ignores momentum: fresh-gesture detection filters deltaY < threshold (HD-02)", () => {
    expect(false).toBe(true);
  });

  it("direction reversal bypasses 820ms lock (HD-02)", () => {
    expect(false).toBe(true);
  });

  it("ArrowDown advances slide; ArrowUp retreats; Home->0; End->last (HD-03)", () => {
    expect(false).toBe(true);
  });
});
