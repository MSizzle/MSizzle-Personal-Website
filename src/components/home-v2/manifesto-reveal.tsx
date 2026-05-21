"use client";

import { useEffect, useState } from "react";
import { m, useReducedMotion, type Variants } from "motion/react";

// Animation timing constants per D-03 (700ms transform, 500ms opacity, 18ms per-letter)
// and D-05 (300ms reduced-motion fade fallback).
const STAGGER_PER_LETTER = 0.018;
const TRANSFORM_DURATION = 0.7;
const OPACITY_DURATION = 0.5;
const FADE_FALLBACK_DURATION = 0.3;

// D-04 sessionStorage key — gsd: prefix namespaces the flag and matches the
// 10-CONTEXT spec verbatim. Tab-scoped so a new tab replays the animation.
const SESSION_FLAG = "gsd:manifesto-shown";

// D-01 manifesto text. Desktop = 2 lines; mobile = 3 lines per D-32 REVISED.
// Both arrays are owned internally so page.tsx can use a single <ManifestoReveal />.
const DESKTOP_LINES = ["BRING FIRE", "TO HUMANITY."] as const;
const MOBILE_LINES = ["BRING", "FIRE TO", "HUMANITY."] as const;

// Per-letter cubic-bezier (D-03 transform easing).
const TRANSFORM_EASE: [number, number, number, number] = [0.2, 0.7, 0.2, 1];

// Per-character variants — the `custom` arg carries the cumulative-index delay
// computed in the render loop below. Single accumulator across all lines so the
// wave is continuous across line breaks (per D-03 + RESEARCH skeleton).
const letterVariants: Variants = {
  hidden: { y: "110%", opacity: 0 },
  visible: (delay: number) => ({
    y: "0%",
    opacity: 1,
    transition: {
      y: { duration: TRANSFORM_DURATION, ease: TRANSFORM_EASE, delay },
      opacity: { duration: OPACITY_DURATION, ease: "easeOut", delay },
    },
  }),
};

/** Manifesto letter-stagger interaction (MOTION-07). Tab-scoped via sessionStorage; respects useReducedMotion. */
export function ManifestoReveal() {
  const shouldReduceMotion = useReducedMotion();
  // Initial lines = desktop so SSR matches the desktop-default viewport. The
  // matchMedia effect below swaps to mobile lines after mount.
  const [lines, setLines] = useState<readonly string[]>(DESKTOP_LINES);
  // Three-phase state machine: pending = SSR/first paint (static, no animation);
  // animate = run the stagger; skip = sessionStorage said we've already shown it.
  const [phase, setPhase] = useState<"pending" | "animate" | "skip">("pending");

  // sessionStorage gate (D-04). Read in useEffect — never during render
  // (10-RESEARCH Pitfall 3: typeof window === 'undefined' on SSR).
  useEffect(() => {
    const already = sessionStorage.getItem(SESSION_FLAG);
    if (already) {
      setPhase("skip");
    } else {
      sessionStorage.setItem(SESSION_FLAG, "1");
      setPhase("animate");
    }
  }, []);

  // matchMedia breakpoint switch (D-32 REVISED + RESEARCH approach #2). Picks
  // mobile lines under 768px, desktop lines at 768px+. Subscribes to viewport
  // changes (DevTools device-toggle, orientation change) and cleans up on unmount.
  useEffect(() => {
    const mql = window.matchMedia("(max-width: 767px)");
    const update = () => setLines(mql.matches ? MOBILE_LINES : DESKTOP_LINES);
    update();
    mql.addEventListener("change", update);
    return () => mql.removeEventListener("change", update);
  }, []);

  // The mobile manifesto uses arbitrary-value Tailwind classes (D-32 exception
  // — 56px / 0.96 / -0.045em / 700 is a manifesto-only override that no other
  // element on the site reuses). Desktop uses the text-display Phase 9 token.
  // lines.length === 3 = mobile array; lines.length === 2 = desktop array.
  const isMobile = lines.length === 3;
  const h1Class = isMobile
    ? "text-[56px] leading-[0.96] tracking-[-0.045em] font-bold uppercase text-ink"
    : "text-display uppercase text-ink";

  // Branch A — Reduced-motion fallback (D-05). Single 300ms opacity fade for the
  // whole <m.h1>, no per-letter stagger. The phase === "skip" path skips the
  // initial-opacity-0 so the manifesto appears instantly on revisit.
  if (shouldReduceMotion) {
    return (
      <m.h1
        className={h1Class}
        initial={phase === "animate" ? { opacity: 0 } : { opacity: 1 }}
        animate={{ opacity: 1 }}
        transition={{ duration: FADE_FALLBACK_DURATION, ease: "easeOut" }}
      >
        {lines.map((line, i) => (
          <span key={i} className="block whitespace-nowrap">
            {line}
          </span>
        ))}
      </m.h1>
    );
  }

  // Branch B — SSR-stable static render (phase === "pending" || phase === "skip").
  // Server renders this; client's first paint matches; no hydration mismatch
  // (10-RESEARCH Pitfall 4). After mount, useEffect transitions phase to
  // "animate" or stays at "skip" depending on the sessionStorage flag.
  if (phase !== "animate") {
    return (
      <h1 className={h1Class}>
        {lines.map((line, i) => (
          <span key={i} className="block whitespace-nowrap">
            {line}
          </span>
        ))}
      </h1>
    );
  }

  // Branch C — Full per-character stagger (phase === "animate" && !shouldReduceMotion).
  // The cumulative-index delay across all lines is computed inline; staggerChildren
  // is left at 0 because we hand-set each letter's delay via the variants' custom arg.
  // Each line wrapper gets overflow-hidden so letters slide up from below the visible
  // line clip (10-RESEARCH Pitfall 5).
  return (
    <m.h1 className={h1Class} initial="hidden" animate="visible">
      {lines.map((line, lineIdx) => {
        const priorChars = lines
          .slice(0, lineIdx)
          .reduce((sum, l) => sum + l.length, 0);
        return (
          <span
            key={lineIdx}
            className="block whitespace-nowrap overflow-hidden"
          >
            {Array.from(line).map((char, charIdx) => {
              const delay = (priorChars + charIdx) * STAGGER_PER_LETTER;
              // Render U+00A0 (non-breaking space) for spaces so inline-block
              // letters retain layout width inside the overflow-hidden parent.
              const display = char === " " ? " " : char;
              return (
                <m.span
                  key={charIdx}
                  className="inline-block"
                  variants={letterVariants}
                  custom={delay}
                >
                  {display}
                </m.span>
              );
            })}
          </span>
        );
      })}
    </m.h1>
  );
}
