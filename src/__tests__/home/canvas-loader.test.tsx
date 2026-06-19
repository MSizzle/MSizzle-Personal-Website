import { describe, it, expect, vi } from "vitest";

// Mock next/dynamic so the loader compiles without the actual dynamic import
vi.mock("next/dynamic", () => ({
  default: (_fn: unknown, _opts?: unknown) => {
    // Return a simple stub component
    function DynamicStub() {
      return null;
    }
    DynamicStub.displayName = "DynamicStub";
    return DynamicStub;
  },
}));

// Stub the real component (does not exist yet — created in Plan 15-02)
vi.mock("@/components/home/canvas-loader", () => ({
  CanvasLoader: function CanvasLoaderStub() {
    return null;
  },
}));

describe("CanvasLoader (TD-02)", () => {
  it("stub is importable before real component exists", async () => {
    const { CanvasLoader } = await import("@/components/home/canvas-loader");
    expect(CanvasLoader).toBeDefined();
  });

  // Will be promoted to real tests in Plan 15-02 Task 1
  it.todo("renders null before requestIdleCallback fires");
  it.todo("renders HeroBlobCanvas after idle fires (with requestIdleCallback)");
  it.todo("renders HeroBlobCanvas after setTimeout fires (Safari path, 200ms)");
});
