"use client";

import { useEffect, useRef } from "react";
import Lenis from "lenis";
import gsap from "gsap";
import ScrollTrigger from "gsap/ScrollTrigger";
import { useReducedMotion } from "motion/react";

gsap.registerPlugin(ScrollTrigger);

export function LenisProvider({ children }: { children: React.ReactNode }) {
  const lenisRef = useRef<Lenis | null>(null);
  const shouldReduceMotion = useReducedMotion();

  useEffect(() => {
    if (shouldReduceMotion) return; // D-10: skip Lenis entirely, native scroll returns

    const lenis = new Lenis({
      lerp: 0.1,
      smoothWheel: true,
    });
    lenisRef.current = lenis;

    // Sync Lenis scroll events to ScrollTrigger
    lenis.on("scroll", ScrollTrigger.update);

    // Add Lenis to GSAP ticker (GSAP time is in seconds, Lenis needs ms)
    const tickerFn = (time: number) => {
      lenis.raf(time * 1000);
    };
    gsap.ticker.add(tickerFn);
    gsap.ticker.lagSmoothing(0); // Prevent scroll jumps on tab focus

    return () => {
      gsap.ticker.remove(tickerFn);
      lenis.destroy();
    };
  }, [shouldReduceMotion]);

  return <>{children}</>;
}
