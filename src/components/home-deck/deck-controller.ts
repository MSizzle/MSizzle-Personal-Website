"use client";

import { useEffect, useRef, useCallback } from "react";

// objEnter: entrance animation for the 3D object wrapper
// Pure CSS transition — no R3F, no Motion library.
// Double-rAF trick ensures the browser flushes the initial transform before applying the transition.
// (Port of prototype site.js objEnter)
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

// useDeckController: ref-only wheel/key/touch deck navigation hook
// All state lives in refs — zero setState — so handlers never cause re-renders.
export function useDeckController({
  scrollerRef,
  slideCount,
  onSlideChange,
}: {
  scrollerRef: React.RefObject<HTMLElement | null>;
  slideCount: number;
  onSlideChange: (idx: number) => void;
}) {
  const idxRef = useRef(0);
  const lockRef = useRef(0);
  const rafRef = useRef(0);
  const wTRef = useRef(0);
  const wDirRef = useRef(0);
  const wAbsRef = useRef(0);
  const stepDirRef = useRef(0);

  const ease = (x: number) =>
    x < 0.5 ? 4 * x * x * x : 1 - Math.pow(-2 * x + 2, 3) / 2;

  const getSlides = useCallback(() => {
    return scrollerRef.current
      ? Array.from(
          scrollerRef.current.querySelectorAll<HTMLElement>(".deck-slide")
        )
      : [];
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

  const goTo = useCallback(
    (i: number) => {
      const slides = getSlides();
      i = Math.max(0, Math.min(slides.length - 1, i));
      if (i === idxRef.current) return;
      idxRef.current = i;
      lockRef.current = Date.now() + 820;
      onSlideChange(i);
      animateTo(slides[i].offsetTop, 800);
    },
    [getSlides, animateTo, onSlideChange]
  );

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

    let st: ReturnType<typeof setTimeout>;
    const onScroll = () => {
      if (Date.now() < lockRef.current) return;
      clearTimeout(st);
      st = setTimeout(() => {
        const slides = getSlides();
        const mid = sc.scrollTop + sc.clientHeight / 2;
        let near = 0,
          best = Infinity;
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

    const onResize = () => {
      const slides = getSlides();
      if (slides[idxRef.current]) sc.scrollTop = slides[idxRef.current].offsetTop;
    };

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
    };
  }, [scrollerRef, step, goTo, getSlides, slideCount]);

  return { idxRef };
}
