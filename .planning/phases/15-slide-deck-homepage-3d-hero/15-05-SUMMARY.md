---
phase: 15-slide-deck-homepage-3d-hero
plan: "05"
subsystem: homepage-deck-integration
tags: [deck, homepage, 3d-hero, lenis, integration, client-component]
dependency_graph:
  requires: [15-02, 15-03, 15-04]
  provides: [DeckHomepage, ConditionalFooter, deck-css]
  affects: [src/app/page.tsx, src/app/layout.tsx, src/app/globals.css]
tech_stack:
  added: []
  patterns: [dynamic-import-ssr-false, lenis-stop-start, usePathname-client-boundary]
key_files:
  created:
    - src/components/home-deck/deck-homepage.tsx
    - src/components/layout/conditional-footer.tsx
  modified:
    - src/app/page.tsx
    - src/app/layout.tsx
    - src/app/globals.css
decisions:
  - "DeckHomepage uses -mt-16 md:mt-0 to counteract MainOffset's unconditional pt-16 padding without adding a new layout component"
  - "goToSlide implemented via scrollerRef.current.scrollTop imperative set (progress dot nav; deck controller manages animations)"
  - "ConditionalFooter as thin client wrapper is the chosen footer-suppression approach (vs route group)"
metrics:
  duration: "~8 minutes"
  completed: "2026-06-19T01:59:00Z"
  tasks_completed: 2
  tasks_total: 2
  files_changed: 5
---

# Phase 15 Plan 05: Deck Integration — Homepage Wiring Summary

**One-liner:** Full slide-deck homepage integration wiring DeckHomepage orchestrator, static page.tsx, and ConditionalFooter InkFooter suppression.

## What Was Built

### Task 1: DeckHomepage orchestrator + deck CSS (commit 9d8dd62)

Created `src/components/home-deck/deck-homepage.tsx` as a `"use client"` orchestrator that:

- Dynamically imports `HeroBlobCanvas` with `ssr: false` inside the "use client" boundary (Next.js 15 constraint — avoids build-time error)
- Detects touch/small-screen on mount: `window.matchMedia("(pointer: coarse)").matches || window.innerWidth < 760`
- Detects WebGL2 on mount with `failIfMajorPerformanceCaveat: true` (blocks software renderers)
- Derives `showDeck = !isTouchOrSmall && !prefersReduced` (D-09 dual gate)
- Derives `showCanvas = showDeck && webglOk`
- Calls `lenis?.stop()` on deck mount; `lenis?.start()` on unmount via `useLenisControl()`
- Wires `useDeckController` to `scrollerRef` with `slideCount: 5`
- Calls `objEnter(objWrapRef)` on initial mount and in `onSlideChange` callback
- Renders progress dots (5 buttons, active dot highlighted by `activeIdx`)
- Native-scroll fallback layout when `showDeck=false` (all 5 slides as flow elements + FallbackPoster)

Applied `-mt-16 md:mt-0` to the deck wrapper to counteract `MainOffset`'s `pt-16 md:pt-0` padding — the fixed `#scroller` ignores it, but the deck wrapper div itself would otherwise be indented.

Appended `/* Phase 15 — Deck Styles */` to `src/app/globals.css`:
- `#scroller/.deck-scroller`: `position:fixed; height:100dvh; overflow-y:scroll; z-index:20; scrollbar-width:none`
- `#objstage`: `position:fixed; right:0; width:45vw; height:100dvh; z-index:10; pointer-events:none`
- `.objwrap`: `position:absolute; will-change:transform; transform:translateX(38vw)`
- `.deck-slide`: `height:100dvh; flex-shrink:0; display:flex; padding:0 8vw`
- `.deck-slide--footer`: `height:auto; min-height:100dvh; justify-content:flex-end; padding-top:12vh`
- `.deck-dots`: `position:fixed; right:1.5rem; top:50%; transform:translateY(-50%); z-index:30`
- `.deck-dot/.deck-dot--active`: dot sizing, border-radius, opacity transitions
- `#atmosphere`: `position:fixed; width:100%; height:100dvh; z-index:0; background:var(--color-bg)`
- Native-scroll overrides: `deck-homepage--native` removes atmosphere, resets slide heights

### Task 2: Replace page.tsx + suppress InkFooter in layout.tsx (commit a3e8269)

**Replaced `src/app/page.tsx`:** Removed all Notion data fetches (`getPublishedPosts`, `getFeaturedProjects`, `getUpcomingEvents`). New file is a thin static Server Component:
- Imports `DeckHomepage`, `JsonLd`, `buildPersonSchema`
- `export const revalidate = false` (D-10: static copy, no ISR)
- Returns `<JsonLd data={buildPersonSchema()} /><DeckHomepage />`

**Created `src/components/layout/conditional-footer.tsx`:** `"use client"` wrapper using `usePathname()` to suppress `InkFooter` when `pathname === "/"`. Homepage deck uses `SlideFooter` as slide 5 — rendering `InkFooter` would create a double footer.

**Updated `src/app/layout.tsx`:** Replaced `import { InkFooter }` with `import { ConditionalFooter }` and `<InkFooter />` with `<ConditionalFooter />`.

## Verification Results

- `npx tsc --noEmit`: exits 0 (no TypeScript errors)
- `npx vitest run src/__tests__/home-deck/`: 15/15 tests GREEN (6 test files)
- `npx vitest run` (full suite): 44/44 tests pass, 19 test files pass, 5 pre-existing skipped
- `grep -c "getPublishedPosts\|getFeaturedProjects" src/app/page.tsx`: returns 0
- `grep -c "DeckHomepage" src/app/page.tsx`: returns 1+ (import + usage)
- `grep -c "ConditionalFooter" src/app/layout.tsx`: returns 2 (import + render)
- `grep -c "revalidate = false" src/app/page.tsx`: returns 1

## Deviations from Plan

None — plan executed exactly as written.

The `goToSlide` implementation for progress dot clicks uses `scrollerRef.current.scrollTop` direct assignment (plan's suggested fallback approach) since `useDeckController` does not expose a `goTo` function in its return signature — only `{ idxRef }`. The dot click sets `idxRef.current` directly then calls `onSlideChange` to update state, matching the plan's fallback guidance.

## Known Stubs

- `FallbackPoster` renders `/public/hero-blob-poster.webp` which does not yet exist (produced in Plan 06 as a human checkpoint — screenshot of the rendered 3D blob). Image 404s gracefully in dev; FallbackPoster itself is complete and wired.

## Threat Flags

No new threat surface introduced beyond what is documented in the plan's threat model. `ConditionalFooter` reads `usePathname()` which is a Next.js internal routing value — not user-controlled. Page.tsx replacement reduces server-side data exposure (no Notion fetches on homepage).

## Self-Check: PASSED

All created files exist on disk. Both task commits verified in git log.

| File | Status |
|------|--------|
| src/components/home-deck/deck-homepage.tsx | FOUND |
| src/components/layout/conditional-footer.tsx | FOUND |
| src/app/page.tsx | FOUND |
| src/app/layout.tsx | FOUND |
| src/app/globals.css | FOUND |
| .planning/phases/15-slide-deck-homepage-3d-hero/15-05-SUMMARY.md | FOUND |

| Commit | Status |
|--------|--------|
| 9d8dd62 (DeckHomepage + deck CSS) | FOUND |
| a3e8269 (page.tsx + ConditionalFooter) | FOUND |
