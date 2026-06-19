"use client";
import dynamic from "next/dynamic";
import { useState, useEffect } from "react";

// dynamic() MUST be called in a "use client" file — Next 16 build hard-fails otherwise.
// This file is the sole owner of the dynamic import for HeroBlobCanvas.
const HeroBlobCanvas = dynamic(() => import("./hero-blob-canvas"), { ssr: false });

/**
 * CanvasLoader — after-LCP dynamic canvas mount.
 *
 * Defers mounting until requestIdleCallback fires (or 200ms Safari fallback),
 * ensuring the canvas never competes with the LCP text element for main-thread time.
 * Gate logic (WebGL2, pointer:coarse, reduced-motion) lives in explorative-homepage.tsx.
 */
export function CanvasLoader() {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    // requestIdleCallback defers until after LCP + first user interaction window
    if (typeof requestIdleCallback !== "undefined") {
      const id = requestIdleCallback(() => setMounted(true), { timeout: 3000 });
      return () => cancelIdleCallback(id);
    }
    // Safari fallback — 200ms is past LCP paint in virtually all cases
    const id = setTimeout(() => setMounted(true), 200);
    return () => clearTimeout(id);
  }, []);

  if (!mounted) return null;
  return <HeroBlobCanvas />;
}
