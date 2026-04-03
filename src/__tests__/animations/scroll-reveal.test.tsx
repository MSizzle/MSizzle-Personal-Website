import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";

vi.mock("motion/react", () => ({
  m: {
    div: ({ children, ...props }: any) => <div data-testid="scroll-reveal-wrapper" {...props}>{children}</div>,
  },
  useReducedMotion: () => false,
}));

describe("ScrollReveal (DSGN-04)", () => {
  it("renders children", async () => {
    const { ScrollReveal } = await import("@/components/animations/scroll-reveal");
    render(<ScrollReveal><p>Revealed content</p></ScrollReveal>);
    expect(screen.getByText("Revealed content")).toBeDefined();
  });

  it("renders without motion wrapper when reduced motion is active", async () => {
    vi.doMock("motion/react", () => ({
      m: { div: ({ children }: any) => <div>{children}</div> },
      useReducedMotion: () => true,
    }));
    const { ScrollReveal } = await import("@/components/animations/scroll-reveal");
    render(<ScrollReveal><p>Static content</p></ScrollReveal>);
    expect(screen.getByText("Static content")).toBeDefined();
  });
});
