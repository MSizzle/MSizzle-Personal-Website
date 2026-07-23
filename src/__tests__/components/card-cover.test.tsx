/**
 * Tests for CardCover neutral blur placeholder.
 * Quick task 260723-g2q, Task 2 (FIX 1: fade-in + placeholder).
 */
import React from "react";
import { describe, it, expect, vi, afterEach } from "vitest";
import { render, cleanup } from "@testing-library/react";

// Mock next/image — renders as a plain img element for testing
vi.mock("next/image", () => ({
  default: (props: Record<string, unknown>) =>
    React.createElement("img", { ...props }),
}));

afterEach(() => {
  cleanup();
});

describe("CardCover neutral placeholder (260723-g2q Task 2)", () => {
  it("renders placeholder=blur and a neutral blurDataURL", async () => {
    const { CardCover } = await import("@/components/v3/card-cover");
    const { container } = render(
      React.createElement(CardCover, {
        src: "/api/notion-cover?pageId=x",
        alt: "",
        fallback: React.createElement("div", null, "fallback"),
      })
    );
    const img = container.querySelector("img");
    expect(img).not.toBeNull();
    expect(img?.getAttribute("placeholder")).toBe("blur");
    expect(img?.getAttribute("blurDataURL")).toMatch(/^data:image\/png;base64,/);
  });
});
