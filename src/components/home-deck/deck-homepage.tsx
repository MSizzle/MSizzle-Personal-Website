"use client";

import dynamic from "next/dynamic";
import { useReducedMotion } from "motion/react";
import { useCallback, useEffect, useRef, useState } from "react";
import { useDeckController, objEnter } from "./deck-controller";
import { useLenisControl } from "@/components/providers/lenis-provider";
import { SlideHero } from "./slide-hero";
import { SlideIndex } from "./slide-index";
import { SlidePrometheus } from "./slide-prometheus";
import { SlideNewsletter } from "./slide-newsletter";
import { SlideFooter } from "./slide-footer";
import { FallbackPoster } from "./fallback-poster";

// ---------------------------------------------------------------------------
// HeroBlobCanvas — dynamically imported with ssr:false.
// MUST be inside a "use client" file (Next.js 15+ constraint — Pitfall 2).
// ---------------------------------------------------------------------------
const HeroBlobCanvas = dynamic(() => import("./hero-blob-canvas"), {
  ssr: false,
  loading: () => null,
});

// ---------------------------------------------------------------------------
// DeckHomepage — orchestrator client component.
//
// Branching logic:
//   showDeck = !isTouchOrSmall && !prefersReduced   (D-09: both gates trigger fallback)
//   showCanvas = showDeck && webglOk
//
// Lenis stop/start: Lenis is stopped while the deck is active so raw wheel
// deltaY values reach the deck controller unmodified. (Research §Pitfall 1)
// ---------------------------------------------------------------------------
export function DeckHomepage() {
  const prefersReduced = useReducedMotion();
  const [isTouchOrSmall, setIsTouchOrSmall] = useState(false);
  const [webglOk, setWebglOk] = useState(false);
  const [activeIdx, setActiveIdx] = useState(0);

  const scrollerRef = useRef<HTMLDivElement>(null);
  const objWrapRef = useRef<HTMLDivElement>(null);

  // ---------------------------------------------------------------------------
  // Mount-time detection — runs once in the browser (never on server)
  // ---------------------------------------------------------------------------
  useEffect(() => {
    // Touch / small-screen detection (HD-05, D-09)
    const coarse = window.matchMedia("(pointer: coarse)").matches;
    setIsTouchOrSmall(coarse || window.innerWidth < 760);

    // WebGL2 detection with software-renderer guard (Pitfall 6)
    try {
      const c = document.createElement("canvas");
      const ctx = c.getContext("webgl2", { failIfMajorPerformanceCaveat: true });
      setWebglOk(!!ctx);
    } catch {
      setWebglOk(false);
    }
  }, []);

  // ---------------------------------------------------------------------------
  // Derived flags
  // ---------------------------------------------------------------------------
  const showDeck = !isTouchOrSmall && !prefersReduced;
  const showCanvas = showDeck && webglOk;

  // ---------------------------------------------------------------------------
  // Lenis stop/start (Research §Pattern 6 / §Pitfall 1)
  // ---------------------------------------------------------------------------
  const lenis = useLenisControl();
  useEffect(() => {
    if (showDeck) {
      lenis?.stop();
      return () => lenis?.start();
    }
  }, [showDeck, lenis]);

  // ---------------------------------------------------------------------------
  // onSlideChange — updates progress dots and fires objEnter entrance
  // ---------------------------------------------------------------------------
  const onSlideChange = useCallback(
    (idx: number) => {
      setActiveIdx(idx);
      objEnter(objWrapRef);
    },
    []
  );

  // ---------------------------------------------------------------------------
  // Deck controller — wires wheel/key/touch to the scroller
  // Unconditionally called; internally no-ops if scrollerRef.current is null.
  // ---------------------------------------------------------------------------
  const { idxRef } = useDeckController({
    scrollerRef: scrollerRef as React.RefObject<HTMLElement | null>,
    slideCount: 5,
    onSlideChange,
  });

  // ---------------------------------------------------------------------------
  // Initial objEnter on mount once showDeck is resolved (Pitfall 7 accepted)
  // ---------------------------------------------------------------------------
  useEffect(() => {
    if (showDeck) {
      objEnter(objWrapRef);
    }
  }, [showDeck]);

  // ---------------------------------------------------------------------------
  // goToSlide — imperative navigation for progress dot clicks
  // ---------------------------------------------------------------------------
  const goToSlide = useCallback(
    (i: number) => {
      const sc = scrollerRef.current;
      if (!sc) return;
      const slides = Array.from(sc.querySelectorAll<HTMLElement>(".deck-slide"));
      if (!slides[i]) return;
      // Update idxRef directly then call onSlideChange
      idxRef.current = i;
      onSlideChange(i);
      // Scroll the scroller to the target slide
      sc.scrollTop = slides[i].offsetTop;
    },
    [idxRef, onSlideChange]
  );

  // ---------------------------------------------------------------------------
  // DECK LAYOUT (showDeck=true)
  // ---------------------------------------------------------------------------
  if (showDeck) {
    return (
      <div className="deck-homepage -mt-16 md:mt-0">
        {/* Atmosphere — fixed bg layer, z-index:0 */}
        <div id="atmosphere" />

        {/* Object stage — fixed right side, z-index:10 */}
        <div id="objstage">
          <div className="objwrap" ref={objWrapRef}>
            {showCanvas ? <HeroBlobCanvas /> : <FallbackPoster />}
          </div>
        </div>

        {/* Progress dots — fixed right, z-index:30 */}
        <nav className="deck-dots" aria-label="Slide navigation">
          {[0, 1, 2, 3, 4].map((i) => (
            <button
              key={i}
              className={i === activeIdx ? "deck-dot deck-dot--active" : "deck-dot"}
              onClick={() => goToSlide(i)}
              aria-label={`Go to slide ${i + 1}`}
            />
          ))}
        </nav>

        {/* Scroller — fixed full viewport, z-index:20, owns wheel events */}
        <div
          id="scroller"
          ref={scrollerRef}
          className="deck-scroller"
        >
          <SlideHero />
          <SlideIndex />
          <SlidePrometheus />
          <SlideNewsletter />
          <SlideFooter />
        </div>
      </div>
    );
  }

  // ---------------------------------------------------------------------------
  // NATIVE-SCROLL LAYOUT (showDeck=false: touch OR reduced-motion per D-09)
  // ---------------------------------------------------------------------------
  return (
    <div className="deck-homepage deck-homepage--native">
      {/* Static object slot at top */}
      <div className="objstage-static">
        <FallbackPoster />
      </div>

      {/* All 5 slides as normal flow block elements (vertical scroll) */}
      <SlideHero />
      <SlideIndex />
      <SlidePrometheus />
      <SlideNewsletter />
      <SlideFooter />
    </div>
  );
}
