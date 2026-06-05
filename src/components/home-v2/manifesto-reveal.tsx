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
const DESKTOP_LINES = ["BRING FIRE", "TO HUMANITY."] as const;
const MOBILE_LINES = ["BRING", "FIRE TO", "HUMANITY."] as const;

// Mobile uses an arbitrary-value override (D-32 exception); desktop uses the
// text-display Phase 9 token. Both variants are rendered side-by-side and the
// CSS responsive toggle (`md:hidden` / `hidden md:block`) decides which the user
// sees. Previously the lines + font swapped post-hydration via matchMedia, which
// reshaped the mobile hero by hundreds of pixels and drove a ~0.47 CLS hit.
const MOBILE_CLASS =
  "md:hidden text-[56px] leading-[0.96] tracking-[-0.045em] font-bold uppercase text-ink";
const DESKTOP_CLASS = "hidden md:block text-display uppercase text-ink";

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

function StaticManifesto({
  lines,
  className,
}: {
  lines: readonly string[];
  className: string;
}) {
  return (
    <h1 className={className}>
      {lines.map((line, i) => (
        <span key={i} className="block whitespace-nowrap">
          {line}
        </span>
      ))}
    </h1>
  );
}

function FadeManifesto({
  lines,
  className,
  shouldAnimate,
}: {
  lines: readonly string[];
  className: string;
  shouldAnimate: boolean;
}) {
  return (
    <m.h1
      className={className}
      initial={shouldAnimate ? { opacity: 0 } : { opacity: 1 }}
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

function StaggerManifesto({
  lines,
  className,
}: {
  lines: readonly string[];
  className: string;
}) {
  return (
    <m.h1 className={className} initial="hidden" animate="visible">
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

/** Manifesto letter-stagger interaction (MOTION-07). Tab-scoped via sessionStorage; respects useReducedMotion. */
export function ManifestoReveal() {
  const shouldReduceMotion = useReducedMotion();
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

  // Branch A — Reduced-motion fallback (D-05). Single 300ms opacity fade,
  // no per-letter stagger.
  if (shouldReduceMotion) {
    const shouldAnimate = phase === "animate";
    return (
      <>
        <FadeManifesto lines={MOBILE_LINES} className={MOBILE_CLASS} shouldAnimate={shouldAnimate} />
        <FadeManifesto lines={DESKTOP_LINES} className={DESKTOP_CLASS} shouldAnimate={shouldAnimate} />
      </>
    );
  }

  // Branch B — SSR-stable static render (phase === "pending" || phase === "skip").
  if (phase !== "animate") {
    return (
      <>
        <StaticManifesto lines={MOBILE_LINES} className={MOBILE_CLASS} />
        <StaticManifesto lines={DESKTOP_LINES} className={DESKTOP_CLASS} />
      </>
    );
  }

  // Branch C — Full per-character stagger.
  return (
    <>
      <StaggerManifesto lines={MOBILE_LINES} className={MOBILE_CLASS} />
      <StaggerManifesto lines={DESKTOP_LINES} className={DESKTOP_CLASS} />
    </>
  );
}
