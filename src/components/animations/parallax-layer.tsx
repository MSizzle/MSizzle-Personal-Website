"use client";

import { useRef } from "react";
import { m, useScroll, useTransform, useReducedMotion } from "motion/react";

interface ParallaxLayerProps {
  children: React.ReactNode;
  speed?: number;
  rotate?: [number, number];
  className?: string;
}

export function ParallaxLayer({
  children,
  speed = 0.3,
  rotate,
  className,
}: ParallaxLayerProps) {
  const ref = useRef<HTMLDivElement>(null);
  const shouldReduceMotion = useReducedMotion();

  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"],
  });

  const y = useTransform(scrollYProgress, [0, 1], ["0%", `${speed * -30}%`]);
  const rotateValue = useTransform(
    scrollYProgress,
    [0, 1],
    rotate || [0, 0]
  );

  if (shouldReduceMotion) {
    return <div ref={ref} className={className}>{children}</div>;
  }

  return (
    <div ref={ref} className={className}>
      <m.div style={{ y, rotate: rotateValue }}>
        {children}
      </m.div>
    </div>
  );
}
