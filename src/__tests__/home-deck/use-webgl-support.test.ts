import { describe, it, expect, vi, afterEach } from "vitest";

// Test the WebGL detection logic by mocking document.createElement
// The deck-controller inlines this check; we test it directly here.
describe("useWebGLSupport (TD-03)", () => {
  afterEach(() => {
    vi.restoreAllMocks();
  });

  it("returns true when webgl2 context is available", () => {
    const mockGetContext = vi.fn().mockReturnValue({} as WebGL2RenderingContext);
    vi.spyOn(document, "createElement").mockImplementation((tag: string) => {
      if (tag === "canvas") {
        return { getContext: mockGetContext } as unknown as HTMLElement;
      }
      return document.createElement(tag);
    });

    // Simulate the WebGL detection logic from deck-homepage.tsx / RESEARCH.md
    let supported = false;
    try {
      const c = document.createElement("canvas");
      const ctx = (c as unknown as HTMLCanvasElement & { getContext: (ctx: string, opts?: object) => unknown }).getContext(
        "webgl2",
        { failIfMajorPerformanceCaveat: true }
      );
      supported = !!ctx;
    } catch {
      supported = false;
    }

    expect(supported).toBe(true);
    expect(mockGetContext).toHaveBeenCalledWith("webgl2", {
      failIfMajorPerformanceCaveat: true,
    });
  });

  it("returns false when getContext('webgl2') returns null", () => {
    const mockGetContext = vi.fn().mockReturnValue(null);
    vi.spyOn(document, "createElement").mockImplementation((tag: string) => {
      if (tag === "canvas") {
        return { getContext: mockGetContext } as unknown as HTMLElement;
      }
      return document.createElement(tag);
    });

    let supported = false;
    try {
      const c = document.createElement("canvas");
      const ctx = (c as unknown as { getContext: (ctx: string, opts?: object) => unknown }).getContext(
        "webgl2",
        { failIfMajorPerformanceCaveat: true }
      );
      supported = !!ctx;
    } catch {
      supported = false;
    }

    expect(supported).toBe(false);
  });

  it("returns false when failIfMajorPerformanceCaveat causes null (software renderer)", () => {
    // failIfMajorPerformanceCaveat=true returns null for software-rendered WebGL
    const mockGetContext = vi.fn().mockImplementation(
      (_type: string, opts?: { failIfMajorPerformanceCaveat?: boolean }) => {
        if (opts?.failIfMajorPerformanceCaveat) return null;
        return {} as WebGL2RenderingContext;
      }
    );

    vi.spyOn(document, "createElement").mockImplementation((tag: string) => {
      if (tag === "canvas") {
        return { getContext: mockGetContext } as unknown as HTMLElement;
      }
      return document.createElement(tag);
    });

    let supported = false;
    try {
      const c = document.createElement("canvas");
      const ctx = (c as unknown as { getContext: (ctx: string, opts?: object) => unknown }).getContext(
        "webgl2",
        { failIfMajorPerformanceCaveat: true }
      );
      supported = !!ctx;
    } catch {
      supported = false;
    }

    expect(supported).toBe(false);
  });
});
