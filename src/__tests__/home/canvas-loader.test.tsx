import { describe, it, expect, vi, afterEach } from "vitest";
import { render, act } from "@testing-library/react";
import React from "react";

// Mock next/dynamic so it returns the stub synchronously (no real dynamic split)
vi.mock("next/dynamic", () => ({
  default: (_fn: unknown, _opts?: unknown) => {
    // Return a stub that renders data-testid="canvas"
    function HeroBlobCanvasStub() {
      return React.createElement("div", { "data-testid": "canvas" });
    }
    HeroBlobCanvasStub.displayName = "HeroBlobCanvasStub";
    return HeroBlobCanvasStub;
  },
}));

// Ensure the real canvas-loader module is used (not the old vi.mock stub)
// by NOT mocking @/components/home/canvas-loader here

describe("CanvasLoader (TD-02)", () => {
  afterEach(() => {
    vi.useRealTimers();
    vi.restoreAllMocks();
  });

  it("renders null before requestIdleCallback/setTimeout fires", async () => {
    vi.useFakeTimers();
    const { CanvasLoader } = await import("@/components/home/canvas-loader");
    const { container } = render(React.createElement(CanvasLoader));
    // Before any timers advance, mounted=false → null
    expect(container.firstChild).toBeNull();
  });

  it("renders HeroBlobCanvas after setTimeout fires (Safari path, 200ms)", async () => {
    vi.useFakeTimers();
    const { CanvasLoader } = await import("@/components/home/canvas-loader");
    const { getByTestId } = render(React.createElement(CanvasLoader));
    await act(async () => {
      vi.advanceTimersByTime(300);
    });
    expect(getByTestId("canvas")).toBeTruthy();
  });
});
