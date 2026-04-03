"use client";

import { m, AnimatePresence, useReducedMotion } from "motion/react";
import { usePathname } from "next/navigation";

export default function Template({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const shouldReduceMotion = useReducedMotion();

  const variants = {
    initial: shouldReduceMotion ? { opacity: 0 } : { opacity: 0, y: 20 },
    animate: shouldReduceMotion ? { opacity: 1 } : { opacity: 1, y: 0 },
    exit: shouldReduceMotion ? { opacity: 0 } : { opacity: 0, y: 10 },
  };

  return (
    <AnimatePresence mode="wait">
      <m.div
        key={pathname}
        variants={variants}
        initial="initial"
        animate="animate"
        exit="exit"
        transition={{
          duration: shouldReduceMotion ? 0.15 : 0.3,
          ease: "easeOut",
        }}
      >
        {children}
      </m.div>
    </AnimatePresence>
  );
}
