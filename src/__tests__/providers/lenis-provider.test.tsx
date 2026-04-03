import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";

vi.mock("lenis", () => {
  class MockLenis {
    on = vi.fn();
    raf = vi.fn();
    destroy = vi.fn();
  }
  return { default: MockLenis };
});

vi.mock("gsap", () => ({
  default: {
    registerPlugin: vi.fn(),
    ticker: {
      add: vi.fn(),
      remove: vi.fn(),
      lagSmoothing: vi.fn(),
    },
  },
}));

vi.mock("gsap/ScrollTrigger", () => ({
  default: { update: vi.fn() },
}));

vi.mock("motion/react", () => ({
  useReducedMotion: () => false,
}));

describe("LenisProvider (HOME-04)", () => {
  it("renders children", async () => {
    const { LenisProvider } = await import("@/components/providers/lenis-provider");
    render(<LenisProvider><p>Child content</p></LenisProvider>);
    expect(screen.getByText("Child content")).toBeDefined();
  });
});
