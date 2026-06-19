---
phase: 15-slide-deck-homepage-3d-hero
plan: "02"
subsystem: deck-controller
tags: [lenis, deck-controller, wheel-handler, keyboard, touch, animations, wave-1]
dependency_graph:
  requires: [15-01]
  provides: [useLenisControl, useDeckController, objEnter, detectDeckMode]
  affects: [15-03, 15-04, 15-05, 15-06]
tech_stack:
  added: []
  patterns:
    - React createContext + useContext for Lenis stop/start exposure
    - Ref-only hook state (zero useState) for event-driven deck controller
    - CHOMP deckInit() fresh-gesture detection: now-wT>110 || dir!==wDir || adel>wAbs*1.25+2
    - Double-rAF entrance pattern for objEnter CSS transition
    - Pure detectDeckMode() utility for testable touch/screen-size detection
key_files:
  created:
    - src/components/home-deck/deck-controller.ts
  modified:
    - src/components/providers/lenis-provider.tsx
    - src/__tests__/home-deck/deck-controller.test.ts
    - src/__tests__/home-deck/use-deck-mode.test.ts
decisions:
  - "LenisControlContext placed above LenisProvider as module-level createContext; useLenisControl() exported alongside — follows motion-provider.tsx context shape pattern"
  - "detectDeckMode() exported as a pure function (takes matchesCoarse + innerWidth) so it can be unit-tested without browser globals — avoids matchMedia mock complexity"
  - "Third detectDeckMode test added (both false → showDeck=true) beyond plan spec for completeness"
  - "resync timeout clearTimeout added to cleanup to avoid stale callbacks after unmount"
metrics:
  duration: "~3.5 minutes"
  completed: "2026-06-18"
  tasks_completed: 2
  tasks_total: 2
  files_created: 1
  files_modified: 3
---

# Phase 15 Plan 02: LenisProvider augmentation + CHOMP deck controller Summary

**One-liner:** Augmented LenisProvider with LenisControlContext (stop/start) and implemented the full CHOMP deckInit port as useDeckController hook with fresh-gesture detection, 820ms lock, 800ms tween, keyboard/touch/resync, and objEnter entrance.

## What Was Built

**Task 1 — LenisProvider augmented with useLenisControl() context**

Added a `LenisControlContext` above `LenisProvider` using `createContext<{ stop: () => void; start: () => void } | null>(null)`. The exported `useLenisControl()` hook returns this context. The `LenisProvider` return statement changed from `<>{children}</>` to `<LenisControlContext.Provider value={{ stop: ..., start: ... }}>`. The stop/start functions call `lenisRef.current?.stop()` and `lenisRef.current?.start()` via optional chaining. The GSAP ticker wiring (lines 30-36) was not touched.

**Task 2 — deck-controller.ts + test stubs turned GREEN**

Created `src/components/home-deck/deck-controller.ts` with three exports:

1. `useDeckController({ scrollerRef, slideCount, onSlideChange })` — CHOMP deckInit() port:
   - All state in 7 refs (`idxRef`, `lockRef`, `rafRef`, `wTRef`, `wDirRef`, `wAbsRef`, `stepDirRef`) — zero `useState`
   - `easeInOutCubic` from site.js line 139
   - Fresh-gesture detection verbatim: `now-wT>110 || dir!==wDir || adel>wAbs*1.25+2`
   - 820ms lock, 800ms tween on scrollTop via rAF loop
   - Direction reversal bypasses the lock (same-direction check in `step()`)
   - Keyboard: ArrowDown/Space/PageDown → +1; ArrowUp/PageUp → -1; Home → 0; End → last; input-field guard
   - Touch: >28px swipe triggers step; <28px ignored; preventDefault on touchmove
   - Scroll resync: 90ms debounce, find nearest .deck-slide by offsetTop+offsetHeight/2 midpoint
   - Resize: immediately scrolls scroller to current slide's offsetTop
   - Full cleanup: removes all listeners, cancels rAF, clears resync timeout
   - Returns `{ idxRef }`

2. `objEnter(objWrapRef)` — D-07 entrance animation:
   - Initial: `translateX(20vw)`, opacity 0, transition: none
   - Settled: `translateX(38vw)`, opacity 1, `transform 1s cubic-bezier(.16,1,.3,1), opacity .55s ease`
   - Double-rAF pattern to force browser flush before applying transition

3. `detectDeckMode({ matchesCoarse, innerWidth })` — pure detection utility:
   - Returns `{ showDeck: !isTouchOrSmall }` where `isTouchOrSmall = matchesCoarse || innerWidth < 760`
   - Pure function (no browser globals) makes it directly testable

Updated test stubs:
- `deck-controller.test.ts`: 4 real tests for HD-01 (wheel advances slide), HD-02 (momentum filtered, reversal bypass), HD-03 (keyboard navigation) — all GREEN
- `use-deck-mode.test.ts`: 3 real tests for HD-05 (coarse pointer, small width, desktop wide) — all GREEN

## Verification

- `grep -c "useDeckController" src/components/home-deck/deck-controller.ts` → 2 (definition + usage comment)
- `grep -c "useLenisControl" src/components/providers/lenis-provider.tsx` → 1
- `npx vitest run src/__tests__/home-deck/deck-controller.test.ts src/__tests__/home-deck/use-deck-mode.test.ts` → 7 tests, all PASS
- `npx tsc --noEmit` → no errors in lenis-provider.tsx or deck-controller.ts
- Existing lenis-provider.test.tsx still passes (1/1)

## Deviations from Plan

**1. [Rule 2 - Missing critical functionality] Added third detectDeckMode test**
- **Found during:** Task 2 implementation
- **Issue:** Plan specified 2 detectDeckMode tests (coarse=true, innerWidth=500). A test for the positive case (both false → showDeck=true) was missing — without it, a broken implementation returning false in all cases would pass.
- **Fix:** Added third test: `matchesCoarse: false, innerWidth: 1440 → showDeck: true`
- **Files modified:** `src/__tests__/home-deck/use-deck-mode.test.ts`
- **Commit:** a70c268

**2. [Rule 2 - Missing critical functionality] Added resync timeout cleanup**
- **Found during:** Task 2 implementation review
- **Issue:** The scroll resync `setTimeout` reference was not cleared in the useEffect cleanup. This could cause `onSlideChange` to be called after the component unmounts, triggering a setState on an unmounted component.
- **Fix:** Added `clearTimeout(resyncTimeout)` to the useEffect cleanup return.
- **Files modified:** `src/components/home-deck/deck-controller.ts`
- **Commit:** a70c268

## Known Stubs

None — this plan creates pure logic (no UI rendering). Wave 2 plans will wire deck-controller to the actual homepage layout.

## Threat Flags

None — this plan implements input event handlers only. Threat mitigations T-15-01 (adel<4 guard) and T-15-02 (input-field guard) from the plan's threat register are implemented.

## Self-Check: PASSED

Files created:
- src/components/home-deck/deck-controller.ts: FOUND
- .planning/phases/15-slide-deck-homepage-3d-hero/15-02-SUMMARY.md: (this file)

Files modified:
- src/components/providers/lenis-provider.tsx: verified (useLenisControl export present)
- src/__tests__/home-deck/deck-controller.test.ts: verified (real tests replacing stubs)
- src/__tests__/home-deck/use-deck-mode.test.ts: verified (real tests replacing stubs)

Commits:
- cad6833: feat(15-02): augment LenisProvider with useLenisControl() context
- a70c268: feat(15-02): implement deck-controller hook + turn HD-01/HD-02/HD-03/HD-05 tests GREEN
