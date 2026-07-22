"use client";

import { useEffect } from "react";

/**
 * ScrollReveals - headless IntersectionObserver island (D-07, D-08).
 *
 * Mount this component once in the page orchestrator (Plan 08). It renders
 * nothing into the DOM - its sole job is to wire one IntersectionObserver
 * that observes every `.reveal` element and adds `.in` when it enters the
 * viewport. `.slide` and `.shadowed` were retired in Plan 21-06 (no live
 * consumer left in src/) - this is now the phase's one surviving scroll
 * motion, retuned to the sketch's exact timing.
 *
 * D-07: elements with .reveal gain `.in` on scroll, enabling the CSS
 *   transition defined in globals.css (opacity/translateY fade-up).
 *
 * D-08: reduced-motion path - if `prefers-reduced-motion: reduce` is set, all
 *   targets receive `.in` immediately so the static layout is fully visible
 *   without any observer or animation.
 */
export function ScrollReveals() {
  useEffect(() => {
    const selector = ".reveal";

    // Collect targets that are not already revealed
    const targets = Array.from(
      document.querySelectorAll<Element>(selector)
    ).filter((el) => !el.classList.contains("in"));

    // D-08: prefers-reduced-motion → mark all targets as .in immediately (static layout)
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      targets.forEach((el) => el.classList.add("in"));
      return;
    }

    // D-07: IntersectionObserver - add .in when element enters viewport,
    // then unobserve it (fire-once, minimal memory footprint).
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("in");
            io.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.05, rootMargin: "0px 0px -8% 0px" }
    );

    targets.forEach((el) => io.observe(el));

    return () => {
      io.disconnect();
    };
  }, []);

  // Headless island - renders nothing into the DOM
  return null;
}
