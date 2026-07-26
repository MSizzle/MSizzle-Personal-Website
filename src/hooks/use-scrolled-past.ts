"use client";

import { useEffect, useState } from "react";

/**
 * useScrolledPast - shared scroll-threshold hook (quick task 260726-fe6).
 *
 * Extracted from StickyNav's original inline scroll listener so StickyNav and
 * the mobile header (Navigation) share one threshold definition instead of
 * duplicating the magic number 24. `window` is only ever touched inside
 * useEffect, so server-side rendering is unaffected: the initial render
 * always returns false, and the value only flips after the first "scroll"
 * event fires past `threshold`.
 */
export function useScrolledPast(
  threshold: number,
  viewportFraction?: number,
): boolean {
  const [scrolledPast, setScrolledPast] = useState(false);

  useEffect(() => {
    // A viewportFraction reveals the bar only after that share of the first
    // screen has scrolled away, so it arrives as a deliberate transition
    // instead of popping in on the first trackpad nudge. Falls back to the
    // fixed pixel threshold when no fraction is given.
    const limit = () =>
      viewportFraction ? window.innerHeight * viewportFraction : threshold;

    const handleScroll = () => {
      setScrolledPast(window.scrollY > limit());
    };

    handleScroll();
    window.addEventListener("scroll", handleScroll, { passive: true });
    window.addEventListener("resize", handleScroll, { passive: true });

    return () => {
      window.removeEventListener("scroll", handleScroll);
      window.removeEventListener("resize", handleScroll);
    };
  }, [threshold, viewportFraction]);

  return scrolledPast;
}
