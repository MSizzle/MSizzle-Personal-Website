import React, { act } from "react";
import { describe, it, expect, afterEach } from "vitest";
import { render, cleanup } from "@testing-library/react";
import { StickyNav } from "@/components/home/sticky-nav";

afterEach(() => cleanup());

function setScrollY(value: number) {
  Object.defineProperty(window, "scrollY", {
    value,
    writable: true,
    configurable: true,
  });
}

// StickyNav reveals at 80% of the viewport height rather than a fixed 24px, so
// the bar arrives once most of the first screen has scrolled away instead of
// popping in on the first trackpad nudge. jsdom reports a 768px viewport, which
// puts the reveal point at ~614px.
const REVEAL_AT = window.innerHeight * 0.8;

describe("StickyNav", () => {
  it("has no .show element at scrollY = 0", () => {
    setScrollY(0);
    const { container } = render(React.createElement(StickyNav));
    expect(container.querySelector(".stickynav.show")).toBeNull();
  });

  it("stays hidden after a small nudge well below the viewport-relative threshold", () => {
    setScrollY(0);
    const { container } = render(React.createElement(StickyNav));
    setScrollY(30);
    act(() => {
      window.dispatchEvent(new Event("scroll"));
    });
    expect(container.querySelector(".stickynav.show")).toBeNull();
  });

  it("stays hidden just below the viewport-relative threshold", () => {
    setScrollY(0);
    const { container } = render(React.createElement(StickyNav));
    setScrollY(REVEAL_AT - 10);
    act(() => {
      window.dispatchEvent(new Event("scroll"));
    });
    expect(container.querySelector(".stickynav.show")).toBeNull();
  });

  it("shows once scrolled past the viewport-relative threshold", () => {
    setScrollY(0);
    const { container } = render(React.createElement(StickyNav));
    setScrollY(REVEAL_AT + 10);
    act(() => {
      window.dispatchEvent(new Event("scroll"));
    });
    expect(container.querySelector(".stickynav.show")).not.toBeNull();
  });
});
