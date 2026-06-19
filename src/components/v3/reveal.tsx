"use client";

import type { ReactNode } from "react";
import { m, useReducedMotion } from "motion/react";

type Props = {
  children: ReactNode;
  className?: string;
  delay?: number;
};

/**
 * Reveal-on-scroll wrapper — brutalist Crimson Poster style (DS-05).
 *
 * Fades + translates content into view when scrolled into the viewport.
 * Ported from site.css lines 142-144:
 *   .reveal { opacity: 0; transform: translateY(30px); }
 *   .reveal.in { opacity: 1; transform: none; }
 *
 * CRITICAL (DS-05): when useReducedMotion() returns true, renders a plain static
 * <div> with children fully visible — no animation, no initial hidden state.
 *
 * Requires MotionProvider (<LazyMotion strict>) in the tree.
 * MUST use `m` (not `motion`) — LazyMotion strict throws at runtime otherwise.
 */
export function Reveal({ children, className, delay = 0 }: Props) {
  const shouldReduceMotion = useReducedMotion();

  // DS-05 short-circuit: reduced motion users get a static, fully-visible render.
  // Branch A — no motion component used, no initial hidden state.
  if (shouldReduceMotion) {
    return <div className={className}>{children}</div>;
  }

  // Branch B — animated reveal via motion/react whileInView.
  return (
    <m.div
      className={className}
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "0px 0px -10% 0px" }}
      transition={{
        duration: 0.9,
        ease: [0.25, 0.1, 0.25, 1],
        delay,
      }}
    >
      {children}
    </m.div>
  );
}
