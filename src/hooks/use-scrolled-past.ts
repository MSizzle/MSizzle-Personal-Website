"use client";

import { useEffect, useRef, useState } from "react";

/**
 * useScrolledPast - shared scroll-threshold hook with hysteresis (quick task
 * 260916-lqq, simplified from the 260726-fe6 version).
 *
 * Drives the SiteHeader's background/border swap on an always-visible bar
 * (not a reveal — the header no longer hides offscreen at any scroll
 * position). `enterAt` is the scrollY the bar must pass to go solid; `exitAt`
 * (default: same as enterAt) is the scrollY it must drop back below to go
 * transparent again. Using a lower exitAt than enterAt gives the transition
 * hysteresis, so Lenis's lagging scroll position (lerp: 0.1) cannot flicker
 * the class by repeatedly crossing a single hard line.
 *
 * `window` is only ever touched inside useEffect, so server-side rendering is
 * unaffected: the initial render always returns false, and the value only
 * flips after the first "scroll" event fires.
 */
export function useScrolledPast(
  enterAt: number,
  exitAt: number = enterAt,
): boolean {
  const [solid, setSolid] = useState(false);
  // Tracks the current side without triggering a re-render on every scroll
  // tick — setState only fires when the side actually flips.
  const solidRef = useRef(false);

  useEffect(() => {
    const handleScroll = () => {
      const y = window.scrollY;
      if (!solidRef.current && y > enterAt) {
        solidRef.current = true;
        setSolid(true);
      } else if (solidRef.current && y <= exitAt) {
        solidRef.current = false;
        setSolid(false);
      }
    };

    handleScroll();
    window.addEventListener("scroll", handleScroll, { passive: true });

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, [enterAt, exitAt]);

  return solid;
}
