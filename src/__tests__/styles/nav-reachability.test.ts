import { describe, it, expect } from "vitest";
import { readFileSync } from "node:fs";
import { join } from "node:path";

// globals.css is NOT loaded into the jsdom test environment, so this is a
// source-text regression guard (not a getComputedStyle assertion). Replaces
// the deleted focus-reveal.test.ts (260726-kjp) now that the header is
// always visible — quick task 260916-lqq.
const rawCss = readFileSync(join(process.cwd(), "src/app/globals.css"), "utf-8");
// Strip comments first so prose mentioning old class names cannot satisfy —
// or accidentally break — a match.
const css = rawCss.replace(/\/\*[\s\S]*?\*\//g, "");

describe("nav reachability (260916-lqq)", () => {
  it(".site-header declares position: sticky and top: 0", () => {
    const match = css.match(/\.site-header\s*\{[^}]*\}/);
    expect(match).not.toBeNull();
    const rule = match![0];
    expect(rule).toMatch(/position:\s*sticky/);
    expect(rule).toMatch(/top:\s*0/);
  });

  it("neither .stickynav nor .mobile-header-gate appears anywhere", () => {
    expect(css).not.toMatch(/\.stickynav/);
    expect(css).not.toMatch(/\.mobile-header-gate/);
  });

  it(".nav-cell:hover::before, .nav-cell:focus-visible::before reveal survives", () => {
    expect(css).toMatch(
      /\.nav-cell:hover::before\s*,\s*\.nav-cell:focus-visible::before\s*\{\s*transform:\s*translateY\(0\)/
    );
  });
});
