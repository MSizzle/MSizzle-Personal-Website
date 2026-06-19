"use client";

import { useReducedMotion } from "motion/react";
import { useEffect, useState } from "react";
import { CanvasLoader } from "./canvas-loader";
import { FallbackPoster } from "./fallback-poster";
import { SectionBuilding } from "./section-building";
import { SectionWriting } from "./section-writing";
import { SectionNewsletter } from "./section-newsletter";
import { SectionFooter } from "./section-footer";

/**
 * ExplorativeHomepage — device/capability gate orchestrator.
 *
 * Owns the WebGL2 + touch/small-screen + reduced-motion gate (D-03, D-04, HD-05).
 * Renders CanvasLoader when desktop + WebGL2 + no reduced-motion; FallbackPoster otherwise.
 *
 * Does NOT stop or start Lenis — the explorative scroll layout uses Lenis
 * as the primary scroll controller. Halting Lenis here would break smooth scroll
 * site-wide (Pitfall 4 in RESEARCH.md / T-15-10).
 */
export function ExplorativeHomepage() {
  const prefersReduced = useReducedMotion();
  const [isTouchOrSmall, setIsTouchOrSmall] = useState(false);
  const [webglOk, setWebglOk] = useState(false);

  // Mount-time detection — runs once in the browser (never on server)
  useEffect(() => {
    // Touch / small-screen detection (HD-05, D-04)
    const coarse = window.matchMedia("(pointer: coarse)").matches;
    setIsTouchOrSmall(coarse || window.innerWidth < 760);

    // WebGL2 detection with software-renderer guard (T-15-08)
    try {
      const c = document.createElement("canvas");
      const ctx = c.getContext("webgl2", { failIfMajorPerformanceCaveat: true });
      setWebglOk(!!ctx);
    } catch {
      setWebglOk(false);
    }
  }, []);

  // No showDeck concept in explorative layout — scroll is always native
  const showCanvas = !isTouchOrSmall && !prefersReduced && webglOk;

  return (
    <div className="explorative-homepage min-h-screen bg-bg">
      {/* Hero section — full viewport height, WebGL canvas overlaid */}
      <section className="relative min-h-dvh flex flex-col justify-center px-[8vw]">
        {/* LCP element — SSR'd text, never inside canvas slot */}
        <h1 className="font-display font-bold uppercase leading-[0.9] sig">
          Monty Singer
        </h1>

        {/* Canvas slot — positioned absolute, fills hero section */}
        <div className="absolute inset-0 pointer-events-none" aria-hidden="true">
          {showCanvas ? <CanvasLoader /> : <FallbackPoster />}
        </div>
      </section>

      {/* Section beats — normal document flow (expansive scroll) */}
      <SectionBuilding />
      <SectionWriting />
      <SectionNewsletter />
      <SectionFooter />
    </div>
  );
}
