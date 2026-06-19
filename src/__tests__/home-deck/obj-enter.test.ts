import { describe, it, expect, vi, afterEach } from "vitest";

describe("objEnter entrance animation (TD-02)", () => {
  afterEach(() => {
    vi.restoreAllMocks();
    vi.unstubAllGlobals();
  });

  it("initial transform = translateX(200.0px) and opacity='0' before rAF", async () => {
    // Mock window.innerWidth so vw = 10, 20*vw = 200
    vi.stubGlobal("innerWidth", 1000);

    // Capture initial state before rAF fires
    let initialTransform = "";
    let initialOpacity = "";

    // Override requestAnimationFrame to capture initial state then fire inner rAF
    const rAFCalls: FrameRequestCallback[] = [];
    vi.stubGlobal(
      "requestAnimationFrame",
      vi.fn((cb: FrameRequestCallback) => {
        rAFCalls.push(cb);
        return rAFCalls.length;
      })
    );

    const el = { style: {} as CSSStyleDeclaration };
    const ref = { current: el as unknown as HTMLElement };

    const { objEnter } = await import("@/components/home-deck/deck-controller");
    objEnter(ref);

    // Capture initial state (before any rAF fires)
    initialTransform = el.style.transform;
    initialOpacity = el.style.opacity;

    expect(initialTransform).toBe("translateX(200.0px)");
    expect(initialOpacity).toBe("0");
  });

  it("settled transform = translateX(380.0px) and opacity='1' after double-rAF", async () => {
    // Mock window.innerWidth so vw = 10, 38*vw = 380
    vi.stubGlobal("innerWidth", 1000);

    // Make rAF call the callback immediately (synchronous)
    vi.stubGlobal(
      "requestAnimationFrame",
      vi.fn((cb: FrameRequestCallback) => {
        cb(0);
        return 0;
      })
    );

    const el = { style: {} as CSSStyleDeclaration };
    const ref = { current: el as unknown as HTMLElement };

    const { objEnter } = await import("@/components/home-deck/deck-controller");
    objEnter(ref);

    // After double-rAF, should be at settled position
    expect(el.style.transform).toBe("translateX(380.0px)");
    expect(el.style.opacity).toBe("1");
  });
});
