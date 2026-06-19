"use client";

import { createContext, useContext, useEffect, useRef } from "react";
import { useReducedMotion } from "motion/react";

const LenisControlContext = createContext<{ stop: () => void; start: () => void } | null>(null);
export function useLenisControl() { return useContext(LenisControlContext); }

export function LenisProvider({ children }: { children: React.ReactNode }) {
  const lenisRef = useRef<InstanceType<typeof import("lenis").default> | null>(null);
  const shouldReduceMotion = useReducedMotion();

  useEffect(() => {
    if (shouldReduceMotion) return;

    let cancelled = false;

    (async () => {
      const [{ default: Lenis }, { default: gsap }, { default: ScrollTrigger }] =
        await Promise.all([
          import("lenis"),
          import("gsap"),
          import("gsap/ScrollTrigger"),
        ]);

      if (cancelled) return;

      gsap.registerPlugin(ScrollTrigger);

      const lenis = new Lenis({ lerp: 0.1, smoothWheel: true });
      lenisRef.current = lenis;

      lenis.on("scroll", ScrollTrigger.update);

      const tickerFn = (time: number) => lenis.raf(time * 1000);
      gsap.ticker.add(tickerFn);
      gsap.ticker.lagSmoothing(0);

      lenisRef.current = Object.assign(lenis, { __tickerFn: tickerFn, __gsap: gsap });
    })();

    return () => {
      cancelled = true;
      const inst = lenisRef.current as any;
      if (inst) {
        inst.__gsap?.ticker.remove(inst.__tickerFn);
        inst.destroy();
      }
    };
  }, [shouldReduceMotion]);

  return (
    <LenisControlContext.Provider value={{
      stop:  () => lenisRef.current?.stop(),
      start: () => lenisRef.current?.start(),
    }}>
      {children}
    </LenisControlContext.Provider>
  );
}
