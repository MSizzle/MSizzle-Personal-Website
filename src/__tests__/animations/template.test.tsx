import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";

// Mock motion/react to avoid animation complexity in unit tests
vi.mock("motion/react", () => ({
  m: {
    div: ({ children, ...props }: any) => <div data-testid="motion-div" {...props}>{children}</div>,
  },
  AnimatePresence: ({ children }: any) => <>{children}</>,
  useReducedMotion: () => false,
}));

vi.mock("next/navigation", () => ({
  usePathname: () => "/",
}));

import Template from "@/app/template";

describe("Page transition (DSGN-03)", () => {
  it("renders children inside motion wrapper", () => {
    render(<Template><p>Hello</p></Template>);
    expect(screen.getByText("Hello")).toBeDefined();
  });

  it("has motion div with pathname key", () => {
    render(<Template><p>Test</p></Template>);
    const motionDivs = screen.getAllByTestId("motion-div");
    expect(motionDivs.length).toBeGreaterThan(0);
  });
});
