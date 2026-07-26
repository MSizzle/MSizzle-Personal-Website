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
export function useScrolledPast(threshold: number): boolean {
  const [scrolledPast, setScrolledPast] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolledPast(window.scrollY > threshold);
    };

    window.addEventListener("scroll", handleScroll, { passive: true });

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, [threshold]);

  return scrolledPast;
}
