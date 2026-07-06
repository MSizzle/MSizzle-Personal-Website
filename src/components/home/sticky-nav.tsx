"use client";

import { useState, useEffect } from "react";
import Link from "next/link";

// Mirrors the global EditorialHeader link set (quick task 260706-tx6, reverses D-08):
// Prometheus, Building, Writing, Contact. Contact is an in-page anchor to the
// footer; the other three are route links, matching the top header they slide over.
const LINKS = [
  { label: "Prometheus", href: "https://prometheus.today" },
  { label: "Building", href: "/building" },
  { label: "Writing", href: "/writing" },
  { label: "Contact", href: "#contact" },
] as const;

/**
 * StickyNav - D-10, D-13
 *
 * Scroll-triggered sticky mini-nav that slides down from the top once the user
 * has scrolled past ~82% of the initial viewport height. Carries the brand mark
 * and the primary nav links (Prometheus / Building / Writing / Contact). No CTA.
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

        {/* Route links mirroring the global header - hidden on mobile via .stickynav ul CSS */}
        <ul>
          {LINKS.map((link) =>
            link.href.startsWith("#") || link.href.startsWith("http") ? (
              <li key={link.href}>
                <a
                  className="nav-cell"
                  href={link.href}
                  {...(link.href.startsWith("http")
                    ? { target: "_blank", rel: "noopener noreferrer" }
                    : {})}
                >
                  <span>{link.label}</span>
                </a>
              </li>
            ) : (
              <li key={link.href}>
                <Link className="nav-cell" href={link.href}><span>{link.label}</span></Link>
              </li>
            )
          )}
        </ul>
      </div>
    </div>
  );
}
