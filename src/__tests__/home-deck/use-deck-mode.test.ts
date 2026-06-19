import { describe, it, expect, vi } from "vitest";

vi.stubGlobal("matchMedia", vi.fn().mockImplementation(() => ({
  matches: false,
  addEventListener: vi.fn(),
  removeEventListener: vi.fn(),
})));

describe("touch/small-screen detection (HD-05)", () => {
  it("returns isTouchOrSmall=true when pointer: coarse matches", () => {
    expect(false).toBe(true);
  });

  it("returns isTouchOrSmall=true when innerWidth < 760", () => {
    expect(false).toBe(true);
  });
});
