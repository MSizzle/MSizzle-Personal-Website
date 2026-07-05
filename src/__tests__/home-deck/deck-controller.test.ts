import { describe, it, expect, vi, beforeEach } from "vitest";
import { renderHook, act } from "@testing-library/react";
import { useRef } from "react";

vi.mock("motion/react", () => ({ useReducedMotion: () => false }));

// ---------------------------------------------------------------------------
// Helpers: build a fake scroller with N deck-slide children
// ---------------------------------------------------------------------------
function buildScroller(slideCount = 5) {
  const scroller = document.createElement("div");
  // Make clientHeight accessible via jsdom property
  Object.defineProperty(scroller, "clientHeight", { value: 600, writable: true });
  Object.defineProperty(scroller, "scrollTop", {
    value: 0,
    writable: true,
    configurable: true,
  });

  for (let i = 0; i < slideCount; i++) {
    const slide = document.createElement("div");
    slide.className = "deck-slide";
    Object.defineProperty(slide, "offsetTop", {
      value: i * 600,
      writable: true,
      configurable: true,
    });
    Object.defineProperty(slide, "offsetHeight", {
      value: 600,
      writable: true,
      configurable: true,
    });
    scroller.appendChild(slide);
  }
  return scroller;
}

// Dispatch a wheel event with the given deltaY on an element
function dispatchWheel(el: HTMLElement, deltaY: number) {
  const event = new WheelEvent("wheel", {
    deltaY,
    bubbles: true,
    cancelable: true,
  });
  el.dispatchEvent(event);
}

// Dispatch a keydown event on window
function dispatchKey(key: string) {
  const event = new KeyboardEvent("keydown", { key, bubbles: true, cancelable: true });
  window.dispatchEvent(event);
}

describe("useDeckController (HD-01, HD-02, HD-03)", () => {
  beforeEach(() => {
    vi.useFakeTimers();
    vi.spyOn(performance, "now").mockReturnValue(0);
  });

  it("advances slide on wheel event (HD-01)", async () => {
    const { useDeckController } = await import(
      "@/components/home-deck/deck-controller"
    );

    const scroller = buildScroller(5);
    const onSlideChange = vi.fn();

    const { result } = renderHook(() => {
      const scrollerRef = useRef<HTMLElement>(scroller);
      return useDeckController({
        scrollerRef,
        slideCount: 5,
        onSlideChange,
      });
    });

    // Dispatch a downward wheel event with a high enough delta to be "fresh"
    act(() => {
      dispatchWheel(scroller, 120);
    });

    // onSlideChange should be called with idx=1
    expect(onSlideChange).toHaveBeenCalledWith(1);
    expect(result.current.idxRef.current).toBe(1);
  });

  it("ignores momentum: duplicate wheel events not fresh (HD-02)", async () => {
    const { useDeckController } = await import(
      "@/components/home-deck/deck-controller"
    );

    const scroller = buildScroller(5);
    const onSlideChange = vi.fn();

    renderHook(() => {
      const scrollerRef = useRef<HTMLElement>(scroller);
      return useDeckController({ scrollerRef, slideCount: 5, onSlideChange });
    });

    // First wheel event — timestamp 0, fresh
    act(() => {
      dispatchWheel(scroller, 120);
    });

    expect(onSlideChange).toHaveBeenCalledTimes(1);

    // Second wheel event: same direction, same delta (120), only 20ms later —
    // adel (120) is NOT > wAbs (120)*1.25+2 (152), so NOT fresh
    vi.spyOn(Date, "now").mockReturnValue(20);
    act(() => {
      dispatchWheel(scroller, 120);
    });

    // Should still be called only once — momentum filtered
    expect(onSlideChange).toHaveBeenCalledTimes(1);
  });

  it("direction reversal bypasses 820ms lock (HD-02)", async () => {
    const { useDeckController } = await import(
      "@/components/home-deck/deck-controller"
    );

    const scroller = buildScroller(5);
    const onSlideChange = vi.fn();

    renderHook(() => {
      const scrollerRef = useRef<HTMLElement>(scroller);
      return useDeckController({ scrollerRef, slideCount: 5, onSlideChange });
    });

    // Move to slide 1 (lock set at Date.now() + 820)
    const now = Date.now();
    act(() => {
      dispatchWheel(scroller, 120);
    });
    expect(onSlideChange).toHaveBeenCalledWith(1);

    // Immediately dispatch opposite direction (time still within 820ms lock)
    // Direction reversal should bypass the lock
    vi.spyOn(Date, "now").mockReturnValue(now + 50); // 50ms later — still locked
    act(() => {
      dispatchWheel(scroller, -120);
    });

    // Should have moved back to idx=0 despite lock
    expect(onSlideChange).toHaveBeenCalledWith(0);
    expect(onSlideChange).toHaveBeenCalledTimes(2);
  });

  it("ArrowDown advances slide; ArrowUp retreats; Home->0; End->last (HD-03)", async () => {
    const { useDeckController } = await import(
      "@/components/home-deck/deck-controller"
    );

    const scroller = buildScroller(5);
    const onSlideChange = vi.fn();

    renderHook(() => {
      const scrollerRef = useRef<HTMLElement>(scroller);
      return useDeckController({ scrollerRef, slideCount: 5, onSlideChange });
    });

    // ArrowDown → idx 0 → 1
    act(() => {
      dispatchKey("ArrowDown");
    });
    expect(onSlideChange).toHaveBeenLastCalledWith(1);

    // Advance past the lock (920ms later)
    vi.spyOn(Date, "now").mockReturnValue(Date.now() + 920);

    // ArrowUp → idx 1 → 0
    act(() => {
      dispatchKey("ArrowUp");
    });
    expect(onSlideChange).toHaveBeenLastCalledWith(0);

    // End → last slide (idx=4)
    vi.spyOn(Date, "now").mockReturnValue(Date.now() + 1840);
    act(() => {
      dispatchKey("End");
    });
    expect(onSlideChange).toHaveBeenLastCalledWith(4);

    // Home → idx=0
    vi.spyOn(Date, "now").mockReturnValue(Date.now() + 2760);
    act(() => {
      dispatchKey("Home");
    });
    expect(onSlideChange).toHaveBeenLastCalledWith(0);
  });
});
