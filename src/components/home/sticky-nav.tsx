"use client";

import Link from "next/link";
import { useScrolledPast } from "@/hooks/use-scrolled-past";

// Mirrors the global EditorialHeader link set (quick task 260706-tx6, reverses D-08):
// Prometheus, Building, Writing, Contact. Contact is the /contact route (quick
// task 260708-lqc; was a #contact footer anchor), matching the top header these
// links slide over.
const LINKS = [
  { label: "Prometheus", href: "https://prometheus.today" },
  { label: "Building", href: "/building" },
  { label: "Writing", href: "/writing" },
  { label: "Contact", href: "/contact" },
] as const;

/**
 * StickyNav - D-10, D-13
 *
 * Scroll-triggered sticky mini-nav that curls into view (wave-curl reveal,
 * quick task 260722-wov item 1) on the very first scroll tick -- a small,
 * fixed 24px threshold, not the old ~82%-of-viewport gate. Carries the brand
 * mark and the primary nav links (Prometheus / Building / Writing / Contact).
 * No CTA.
 *
 * Z-index: relies on Plan 01's `.stickynav` CSS rule (z-index: 9000) to sit
 * above the existing z-50 mobile header (nav/navigation.tsx).
 *
 * Scroll-gate: the threshold check now lives in the shared `useScrolledPast`
 * hook (quick task 260726-fe6) instead of an inline listener, so this and the
 * mobile header stay in sync on one threshold definition. SSR-safe: `window`
 * is accessed only inside the hook's `useEffect` (never on the server).
 */
export function StickyNav() {
  // Reveals once most of the first screen has scrolled away, so the bar is a
  // deliberate arrival rather than something that pops in on the first nudge.
  const show = useScrolledPast(24, 0.8);

  return (
    <div className={`stickynav${show ? " show" : ""}`}>
      <div className="inner">
        {/* Brand mark — matches the editorial header wordmark; always a live
            link back to the homepage (parity with the top header + mobile bar). */}
        <Link href="/" className="mk">Monty Singer</Link>

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
