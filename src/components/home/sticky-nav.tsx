"use client";

import { useState, useEffect } from "react";

/**
 * StickyNav - D-10, D-13
 *
 * Scroll-triggered sticky mini-nav that slides down from the top once the user
 * has scrolled past ~82% of the initial viewport height. Carries a persistent
 * vermilion "Say Hi" CTA that opens a prefilled email draft to Monty
 * (mailto with a ready-to-send subject + greeting).
 *
 * Single-CTA model: "Say Hi" is the only button; no email form, no competing
 * engagement buttons.
 *
 * Z-index: relies on Plan 01's `.stickynav` CSS rule (z-index: 9000) to sit
 * above the existing z-50 mobile header (nav/navigation.tsx).
 *
 * SSR: `window` is accessed only inside `useEffect` (never on the server).
 */
export function StickyNav() {
  const [show, setShow] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setShow(window.scrollY > window.innerHeight * 0.82);
    };

    window.addEventListener("scroll", handleScroll, { passive: true });

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  return (
    <div className={`stickynav${show ? " show" : ""}`}>
      <div className="inner">
        {/* Brand mark — matches the editorial header wordmark */}
        <div className="mk">Monty Singer</div>

        {/* Section anchor links - hidden on mobile via .stickynav ul CSS */}
        <ul>
          <li>
            <a href="#building">Building</a>
          </li>
          <li>
            <a href="#work">Work</a>
          </li>
          <li>
            <a href="#loves">Loves</a>
          </li>
          <li>
            <a href="#writing">Writing</a>
          </li>
        </ul>

        {/* Persistent "Say Hi" CTA — opens a prefilled email draft to Monty */}
        <a
          className="cta"
          href="mailto:monty@prometheus.today?subject=Saying%20hi&body=Hi%20Monty%2C%0A%0A"
        >
          Say Hi
        </a>
      </div>
    </div>
  );
}
