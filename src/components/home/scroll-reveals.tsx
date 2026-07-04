"use client";

import { useEffect } from "react";

/**
 * ScrollReveals — headless IntersectionObserver island (D-07, D-08).
 *
 * Mount this component once in the page orchestrator (Plan 08). It renders
 * nothing into the DOM — its sole job is to wire one IntersectionObserver
 * that observes every `.reveal`, `.slide`, and `.shadowed` element and adds
 * `.in` when each one enters the viewport.
 *
 * D-07: elements with .reveal/.slide/.shadowed gain `.in` on scroll, enabling
 *   the CSS transitions defined in globals.css (opacity/translateX + shadow settle).
 *
 * D-08: reduced-motion path — if `prefers-reduced-motion: reduce` is set, all
 *   targets receive `.in` immediately so the static layout is fully visible
 *   without any observer or animation.
 */
export function ScrollReveals() {
  useEffect(() => {
    const selector = ".reveal, .slide, .shadowed";

    // Collect targets that are not already revealed
    const targets = Array.from(
      document.querySelectorAll<Element>(selector)
    ).filter((el) => !el.classList.contains("in"));

    // D-08: prefers-reduced-motion → mark all targets as .in immediately (static layout)
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      targets.forEach((el) => el.classList.add("in"));
      return;
    }

    // D-07: IntersectionObserver — add .in when element enters viewport,
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
      { threshold: 0, rootMargin: "0px 0px -38% 0px" }
    );

    targets.forEach((el) => io.observe(el));

    return () => {
      io.disconnect();
    };
  }, []);

  // Headless island — renders nothing into the DOM
  return null;
}
