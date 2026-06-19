---
phase: 15-slide-deck-homepage-3d-hero
reviewed: 2026-06-19T00:00:00Z
depth: standard
files_reviewed: 14
files_reviewed_list:
  - src/app/page.tsx
  - src/app/globals.css
  - src/components/home/canvas-loader.tsx
  - src/components/home/explorative-homepage.tsx
  - src/components/home/fallback-poster.tsx
  - src/components/home/hero-blob.tsx
  - src/components/home/hero-blob-canvas.tsx
  - src/components/home/hero-podium.tsx
  - src/components/home/section-building.tsx
  - src/components/home/section-writing.tsx
  - src/components/home/section-newsletter.tsx
  - src/components/home/section-footer.tsx
  - src/components/v3/newsletter-carousel.tsx
  - src/components/visit-survey.tsx
findings:
  critical: 0
  warning: 5
  info: 4
  total: 9
status: issues_found
---

# Phase 15: Code Review Report

**Reviewed:** 2026-06-19
**Depth:** standard
**Files Reviewed:** 14
**Status:** issues_found

## Summary

Reviewed the Phase 15 WebGL explorative homepage: the SSR/client boundary
(`page.tsx` Server Component → `ExplorativeHomepage` client orchestrator →
`CanvasLoader` dynamic `ssr:false` → `HeroBlobCanvas`), the capability gate,
the R3F blob/canvas/podium, the static section beats, and the two checkpoint
fixes (`newsletter-carousel`, `visit-survey`).

The architectural boundaries hold well. `dynamic({ssr:false})` is correctly
isolated inside the `"use client"` `canvas-loader.tsx`; the Server/Client split
is correct (only `explorative-homepage`, `canvas-loader`, `visit-survey`, and
the v3 `Button` carry `"use client"`); the `addEffect` RAF driver returns its
cleanup correctly; the `HeroBlob` procedural/wrapper split keeps hooks order
stable; and the `ConditionalFooter` does in fact suppress `InkFooter` on `/`
(verified in `src/components/layout/conditional-footer.tsx`), so the
`SectionFooter` "only footer" claim is accurate.

No security issues found. All dynamic content is hardcoded JSX or static arrays;
no user input reaches the GLSL shader, the DOM via `innerHTML`, or any sink.
External links carry `rel="noopener noreferrer"`.

The defects below are correctness/robustness and content-labeling issues. None
block ship, but two (the visit-survey nested-timer leak and the R3F resource
disposal gap) are real bugs that fire under unmount.

## Warnings

### WR-01: visit-survey inner auto-open timer is never cleaned up (setState after unmount)

**File:** `src/components/visit-survey.tsx:22-33`
**Issue:** The `useEffect` schedules an outer 30s `setTimeout`; inside its
callback a second `openTimer` is scheduled and the callback `return`s
`() => clearTimeout(openTimer)`. But a `setTimeout` callback's return value is
discarded — it is **not** the effect's cleanup function. The effect's actual
cleanup (`return () => clearTimeout(timer)`) only clears the *outer* timer. If
the component unmounts during the 600ms window after the bubble appears (route
change on this SPA), `openTimer` still fires `setWidgetState('open')` on an
unmounted component, producing a React state-update-on-unmounted warning and a
wasted render.
**Fix:** Track both timers in the effect scope and clear both in the single
effect cleanup:
```tsx
useEffect(() => {
  if (sessionStorage.getItem('visit-survey-done')) return;
  let openTimer: ReturnType<typeof setTimeout>;
  const timer = setTimeout(() => {
    setWidgetState('bubble');
    openTimer = setTimeout(() => setWidgetState('open'), 600);
  }, 30000);
  return () => {
    clearTimeout(timer);
    clearTimeout(openTimer);
  };
}, []);
```

### WR-02: HeroBlob leaks GPU geometry/material/env-map on unmount

**File:** `src/components/home/hero-blob.tsx:52-82` (and `src/components/home/hero-podium.tsx:11`)
**Issue:** `blobGeo` (`IcosahedronGeometry(1.3, 12)` — a high-subdivision mesh),
the `CustomShaderMaterial`, and the PMREM `envMap` are all created in `useMemo`
but never disposed. The canvas is mounted/unmounted by `CanvasLoader` behind the
capability gate and on client-side route changes; each remount allocates fresh
GPU buffers and PMREM textures while the previous ones are never released by
three.js (three does not auto-dispose). `HeroPodium`'s `CylinderGeometry` has the
same gap. Repeated navigation to/from `/` accumulates GPU memory.
**Fix:** Dispose in an effect cleanup. Example for the blob:
```tsx
useEffect(() => () => {
  blobGeo.dispose();
  mat.dispose();
  if (scene.environment) scene.environment.dispose();
}, [blobGeo, mat, scene]);
```
For `HeroPodium`, dispose `geo` in a cleanup effect (or use drei `<Cylinder>`
which auto-disposes).

### WR-03: IBL setup runs as a side effect inside useMemo (impure render)

**File:** `src/components/home/hero-blob.tsx:60-65`
**Issue:** The PMREMGenerator/`scene.environment` assignment is performed inside
`useMemo(..., [gl, scene])`. `useMemo` is for memoized *values*, not side
effects — React explicitly reserves the right to drop and recompute memoized
values, and mutating `scene.environment` during render is an impure render side
effect. In Strict Mode (double-invoked render) this runs twice and creates two
PMREM passes, the first of which leaks (compounding WR-02). It works today only
because the memo happens not to be discarded.
**Fix:** Move the IBL setup into `useEffect`:
```tsx
useEffect(() => {
  const pmrem = new THREE.PMREMGenerator(gl);
  const envMap = pmrem.fromScene(new RoomEnvironment()).texture;
  scene.environment = envMap;
  pmrem.dispose();
  return () => { envMap.dispose(); scene.environment = null; };
}, [gl, scene]);
```

### WR-04: Section numeral sequence skips "03"

**File:** `src/components/home/section-newsletter.tsx:14`
**Issue:** Rendered section labels are `01` (Building), `02` (Writing), `04`
(Newsletter) — the numeral `03` is skipped. Because the sections render in
document order with no section between Writing and Newsletter, a visitor sees
"01 … 02 … 04", which reads as a missing/broken beat. This is a visible content
defect, not a style nit.
**Fix:** Renumber Newsletter to `03`:
```tsx
<SectionLabel numeral="03">Newsletter</SectionLabel>
```
(Confirm no other home section claims `03`; the footer carries no numeral.)

### WR-05: visit-survey thank-you / auto-hide timer not cleaned up

**File:** `src/components/visit-survey.tsx:38-40`
**Issue:** `handleOptionClick` schedules `setTimeout(() => setWidgetState('hidden'), 2000)`
with no stored handle and no cleanup. If the user navigates away within those
2s, the timer fires `setWidgetState` on an unmounted component (same class of
bug as WR-01). The pattern repeats untracked one-shot timers throughout the
component.
**Fix:** Store the handle in a `useRef` and clear it in the effect cleanup, or
guard the setState behind a mounted ref. Minimal version:
```tsx
const hideTimer = useRef<ReturnType<typeof setTimeout>>();
function handleOptionClick() {
  sessionStorage.setItem('visit-survey-done', 'true');
  setWidgetState('thankyou');
  hideTimer.current = setTimeout(() => setWidgetState('hidden'), 2000);
}
useEffect(() => () => clearTimeout(hideTimer.current), []);
```

## Info

### IN-01: FallbackPoster alt text is wasted under aria-hidden wrapper

**File:** `src/components/home/explorative-homepage.tsx:56-58`, `src/components/home/fallback-poster.tsx:24`
**Issue:** The canvas/poster slot wrapper sets `aria-hidden="true"`, which is
correct for the decorative hero. But `FallbackPoster` supplies a descriptive
`alt="3D hero object — morphing blob with crimson rim"`. The `alt` is never
exposed to assistive tech (the ancestor is hidden), so it is dead metadata, and
the intent (decorative vs. described) is ambiguous. Decide one way: if
decorative, set `alt=""` on the `Image`; the wrapper `aria-hidden` already
removes it from the tree.
**Fix:** `alt=""` on the poster `Image`, keeping the wrapper `aria-hidden`.

### IN-02: WebGL2 capability probe leaks a throwaway context per mount

**File:** `src/components/home/explorative-homepage.tsx:34-40`
**Issue:** The gate creates a `<canvas>` and acquires a `webgl2` context purely
to test capability, then drops both. Browsers cap concurrent WebGL contexts
(~16); the probe context is GC-eligible but not explicitly released, and the
real `HeroBlobCanvas` then acquires a second context. On capable desktop this is
two contexts where one would do.
**Fix:** Release the probe context after detection:
```tsx
const ctx = c.getContext("webgl2", { failIfMajorPerformanceCaveat: true });
setWebglOk(!!ctx);
ctx?.getExtension("WEBGL_lose_context")?.loseContext();
```

### IN-03: Capability probe and real Canvas use different GL flags

**File:** `src/components/home/explorative-homepage.tsx:36` vs `src/components/home/hero-blob-canvas.tsx:57`
**Issue:** The gate probes with `failIfMajorPerformanceCaveat: true`, but the
actual `<Canvas gl={{ antialias: true, alpha: true }}>` does not pass that flag.
So the probe can reject a software renderer while the real canvas would still
mount one if conditions change between probe and mount. Low risk (same frame
window), but the two paths are not guaranteed consistent.
**Fix:** Pass `gl={{ antialias: true, alpha: true, failIfMajorPerformanceCaveat: true }}`
to the `<Canvas>` so both paths agree, and let R3F's `onCreated`/error path drive
the fallback if context creation fails.

### IN-04: Newsletter/essay placeholder hrefs ship as "#" / non-existent slugs

**File:** `src/components/home/section-newsletter.tsx:34,40,46`, `src/components/home/section-writing.tsx:14-28`
**Issue:** All three newsletter issues link to `href: "#"` (clicking scrolls to
top / no-ops), and `FEATURED_ESSAYS` points to `/blog/...` slugs that are
curated placeholders with no backing Notion content (D-13 defers wiring to Phase
16). These will 404 or no-op in production until Phase 16. The carousel key fix
(keying by `issue.title`) is correct, but the underlying `#` hrefs remain a
known-placeholder UX gap that should be tracked, not silently shipped.
**Fix:** Track as a Phase 16 follow-up; consider rendering the newsletter cards
as non-link `<div>`s (the component already supports `href`-absent fallback) so a
dead `#` link is not presented as clickable until real URLs exist.

---

_Reviewed: 2026-06-19_
_Reviewer: Claude (gsd-code-reviewer)_
_Depth: standard_
