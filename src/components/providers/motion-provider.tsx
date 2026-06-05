"use client";

import { LazyMotion, MotionConfig } from "motion/react";

// Lazy-load `domAnimation` so the ~20KB feature bundle is split out of the main
// chunk and fetched after first paint. `m` components mount synchronously; they
// just skip animations until features arrive — invisible during LCP.
const loadDomAnimation = () =>
  import("motion/react").then((mod) => mod.domAnimation);

export function MotionProvider({ children }: { children: React.ReactNode }) {
  return (
    <LazyMotion features={loadDomAnimation} strict>
      <MotionConfig reducedMotion="user">
        {children}
      </MotionConfig>
    </LazyMotion>
  );
}
