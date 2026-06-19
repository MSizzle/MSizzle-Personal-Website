"use client";

import { useEffect, useRef, useCallback } from "react";

// ---------------------------------------------------------------------------
// easeInOutCubic — verbatim port from site.js line 139
// ---------------------------------------------------------------------------
const ease = (x: number) =>
  x < 0.5 ? 4 * x * x * x : 1 - Math.pow(-2 * x + 2, 3) / 2;

// ---------------------------------------------------------------------------
// objEnter — CSS entrance animation for the object wrapper (D-07 / site.js)
// Spawn right → fly in from left → settle right
// ---------------------------------------------------------------------------
export function objEnter(objWrapRef: React.RefObject<HTMLElement | null>) {
  const el = objWrapRef.current;
  if (!el) return;
  const vw = window.innerWidth / 100;
  el.style.transition = "none";
  el.style.transform = `translateX(${(20 * vw).toFixed(1)}px)`;
  el.style.opacity = "0";
  requestAnimationFrame(() =>
    requestAnimationFrame(() => {
      el.style.transition =
        "transform 1s cubic-bezier(.16,1,.3,1), opacity .55s ease";
      el.style.transform = `translateX(${(38 * vw).toFixed(1)}px)`;
      el.style.opacity = "1";
    })
  );
}

// ---------------------------------------------------------------------------
// detectDeckMode — pure detection utility; testable without browser setup
// Returns showDeck: true when the device supports the deck experience.
// Deck is disabled on touch/coarse-pointer devices and small screens (HD-05).
// ---------------------------------------------------------------------------
export function detectDeckMode({
  matchesCoarse,
  innerWidth,
}: {
  matchesCoarse: boolean;
  innerWidth: number;
}): { showDeck: boolean } {
  const isTouchOrSmall = matchesCoarse || innerWidth < 760;
  return { showDeck: !isTouchOrSmall };
}

// ---------------------------------------------------------------------------
// useDeckController — faithful port of CHOMP deckInit() (site.js 110-169)
// All state in refs: zero useState, zero re-renders from this hook.
// ---------------------------------------------------------------------------
export function useDeckController({
  scrollerRef,
  slideCount,
  onSlideChange,
}: {
  scrollerRef: React.RefObject<HTMLElement | null>;
  slideCount: number;
  onSlideChange: (idx: number) => void;
}) {
  // All state in refs — per D-06 and PATTERNS.md ref-only pattern
  const idxRef     = useRef(0);
  const lockRef    = useRef(0);
  const rafRef     = useRef(0);
  const wTRef      = useRef(0);
  const wDirRef    = useRef(0);
  const wAbsRef    = useRef(0);
  const stepDirRef = useRef(0);

  const getSlides = useCallback((): HTMLElement[] => {
    if (!scrollerRef.current) return [];
    return Array.from(
      scrollerRef.current.querySelectorAll<HTMLElement>(".deck-slide")
    );
  }, [scrollerRef]);

  const animateTo = useCallback(
    (top: number, dur: number) => {
      const sc = scrollerRef.current;
      if (!sc) return;
      cancelAnimationFrame(rafRef.current);
      const from = sc.scrollTop;
      const dist = top - from;
      const t0 = performance.now();
      const tick = (now: number) => {
        const p = dur ? Math.min((now - t0) / dur, 1) : 1;
        sc.scrollTop = from + dist * ease(p);
        if (p < 1) rafRef.current = requestAnimationFrame(tick);
      };
      rafRef.current = requestAnimationFrame(tick);
    },
    [scrollerRef]
  );

  // goTo: clamp, skip same, set lock, call onSlideChange, tween
  const goTo = useCallback(
    (i: number) => {
      const slides = getSlides();
      i = Math.max(0, Math.min(slides.length - 1, i));
      if (i === idxRef.current) return;
      idxRef.current = i;
      lockRef.current = Date.now() + 820; // 820ms lock (site.js line 142)
      onSlideChange(i);
      animateTo(slides[i].offsetTop, 800); // 800ms tween (site.js line 142)
    },
    [getSlides, animateTo, onSlideChange]
  );

  // step: honour lock for same direction; bypass lock on direction reversal (D-06)
  const step = useCallback(
    (dir: number) => {
      const locked = Date.now() < lockRef.current;
      if (locked && dir === stepDirRef.current) return;
      stepDirRef.current = dir;
      goTo(idxRef.current + dir);
    },
    [goTo]
  );

  useEffect(() => {
    const sc = scrollerRef.current;
    if (!sc) return;

    // ------------------------------------------------------------------
    // Wheel handler — fresh-gesture detection verbatim from site.js line 147
    // adel<4 guard prevents micro-vibration spam (T-15-01)
    // ------------------------------------------------------------------
    const onWheel = (e: WheelEvent) => {
      e.preventDefault();
      const adel = Math.abs(e.deltaY);
      if (adel < 4) return;
      const dir = e.deltaY > 0 ? 1 : -1;
      const now = Date.now();
      const fresh =
        now - wTRef.current > 110 ||
        dir !== wDirRef.current ||
        adel > wAbsRef.current * 1.25 + 2;
      wTRef.current = now;
      wDirRef.current = dir;
      wAbsRef.current = adel;
      if (!fresh) return;
      step(dir);
    };

    // ------------------------------------------------------------------
    // Touch handler — 28px threshold (HD-05 / site.js)
    // ------------------------------------------------------------------
    let tY: number | null = null;
    const onTouchStart = (e: TouchEvent) => {
      tY = e.touches[0].clientY;
    };
    const onTouchMove = (e: TouchEvent) => {
      e.preventDefault();
    };
    const onTouchEnd = (e: TouchEvent) => {
      if (tY == null) return;
      const end = e.changedTouches[0]?.clientY ?? tY;
      const dy = tY - end;
      if (Math.abs(dy) > 28) step(dy > 0 ? 1 : -1);
      tY = null;
    };

    // ------------------------------------------------------------------
    // Keyboard handler — input-field guard (T-15-02)
    // ArrowDown/Space/PageDown → +1, ArrowUp/PageUp → -1, Home → 0, End → last
    // ------------------------------------------------------------------
    const onKeyDown = (e: KeyboardEvent) => {
      const tag = (e.target as HTMLElement)?.tagName ?? "";
      if (/^(input|textarea|select)$/i.test(tag)) return;
      if (["ArrowDown", "PageDown", " "].includes(e.key)) {
        e.preventDefault();
        step(1);
      } else if (["ArrowUp", "PageUp"].includes(e.key)) {
        e.preventDefault();
        step(-1);
      } else if (e.key === "Home") {
        e.preventDefault();
        goTo(0);
      } else if (e.key === "End") {
        e.preventDefault();
        goTo(getSlides().length - 1);
      }
    };

    // ------------------------------------------------------------------
    // Scroll resync — debounced 90ms; snaps to nearest slide after drag
    // ------------------------------------------------------------------
    let resyncTimeout: ReturnType<typeof setTimeout>;
    const onScroll = () => {
      if (Date.now() < lockRef.current) return;
      clearTimeout(resyncTimeout);
      resyncTimeout = setTimeout(() => {
        const slides = getSlides();
        const mid = sc.scrollTop + sc.clientHeight / 2;
        let near = 0;
        let best = Infinity;
        slides.forEach((el, i) => {
          const d = Math.abs(el.offsetTop + el.offsetHeight / 2 - mid);
          if (d < best) {
            best = d;
            near = i;
          }
        });
        if (near !== idxRef.current) {
          idxRef.current = near;
          onSlideChange(near);
        }
      }, 90);
    };

    // ------------------------------------------------------------------
    // Resize handler — scroll to current slide immediately on resize
    // ------------------------------------------------------------------
    const onResize = () => {
      const slides = getSlides();
      if (slides[idxRef.current]) {
        sc.scrollTop = slides[idxRef.current].offsetTop;
      }
    };

    // Attach all listeners
    sc.addEventListener("wheel", onWheel, { passive: false });
    sc.addEventListener("touchstart", onTouchStart, { passive: true });
    sc.addEventListener("touchmove", onTouchMove, { passive: false });
    sc.addEventListener("touchend", onTouchEnd, { passive: true });
    sc.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("keydown", onKeyDown);
    window.addEventListener("resize", onResize);

    return () => {
      sc.removeEventListener("wheel", onWheel);
      sc.removeEventListener("touchstart", onTouchStart);
      sc.removeEventListener("touchmove", onTouchMove);
      sc.removeEventListener("touchend", onTouchEnd);
      sc.removeEventListener("scroll", onScroll);
      window.removeEventListener("keydown", onKeyDown);
      window.removeEventListener("resize", onResize);
      cancelAnimationFrame(rafRef.current);
      clearTimeout(resyncTimeout);
    };
  }, [scrollerRef, step, goTo, getSlides, onSlideChange]);

  return { idxRef };
}
