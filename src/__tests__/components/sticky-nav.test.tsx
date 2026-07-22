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

describe("StickyNav", () => {
  it("has no .show element at scrollY = 0", () => {
    setScrollY(0);
    const { container } = render(React.createElement(StickyNav));
    expect(container.querySelector(".stickynav.show")).toBeNull();
  });

  it("stays hidden at scrollY = 20 (below the new 24px threshold) after a scroll event", () => {
    setScrollY(0);
    const { container } = render(React.createElement(StickyNav));
    setScrollY(20);
    act(() => {
      window.dispatchEvent(new Event("scroll"));
    });
    expect(container.querySelector(".stickynav.show")).toBeNull();
  });

  it("shows at scrollY = 30 (above the threshold) after a scroll event", () => {
    setScrollY(0);
    const { container } = render(React.createElement(StickyNav));
    setScrollY(30);
    act(() => {
      window.dispatchEvent(new Event("scroll"));
    });
    expect(container.querySelector(".stickynav.show")).not.toBeNull();
  });
});
