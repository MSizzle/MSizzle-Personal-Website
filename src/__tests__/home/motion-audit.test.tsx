import { describe, it, expect, afterEach, beforeAll } from "vitest";
import { render, cleanup } from "@testing-library/react";
import React from "react";
import { ExplorativeHomepage } from "@/components/home/explorative-homepage";

/**
 * motion-audit.test.tsx: mechanical MS-01/MS-02 gate (21-05).
 *
 * Renders the REAL, unmocked homepage tree (Hero, SectionBuilding,
 * SectionWriting, SectionLoves, and SectionLoves's real PhotoMarquee
 * fallback -> real Photo components, since no `loves` items are passed) and
 * asserts that every ambient/slide motion class this phase retired is absent
 * anywhere in the rendered output. No children are mocked here -- that is
 * the whole point of this test: catch a stray motion class anywhere in the
 * real tree, not just in a component's own unit test.
 */
describe("motion-audit (MS-01/MS-02 mechanical gate)", () => {
  // ScrollReveals (real, unmocked here) reads window.matchMedia and
  // constructs an IntersectionObserver on mount; jsdom implements neither.
  // Minimal no-op polyfills so the real orchestrator tree can mount --
  // this test only cares about the static rendered class list, not
  // ScrollReveals' own runtime behavior (that's scroll-reveals' own concern).
  beforeAll(() => {
    window.matchMedia =
      window.matchMedia ||
      ((query: string) => ({
        matches: false,
        media: query,
        onchange: null,
        addListener: () => {},
        removeListener: () => {},
        addEventListener: () => {},
        removeEventListener: () => {},
        dispatchEvent: () => false,
      }));

    // @ts-expect-error -- minimal test-only stub, not a full IO implementation
    window.IntersectionObserver =
      window.IntersectionObserver ||
      class {
        observe() {}
        unobserve() {}
        disconnect() {}
      };
  });

  afterEach(() => cleanup());

  it("renders the real homepage tree with zero kenburns/breathe/slide/shadowed/hero-ticker/statustag classes", () => {
    const { container } = render(React.createElement(ExplorativeHomepage));
    const offenders = container.querySelectorAll(
      ".kenburns, .breathe, .slide, .shadowed, .hero-ticker, .statustag"
    );
    expect(offenders.length).toBe(0);
  });
});
