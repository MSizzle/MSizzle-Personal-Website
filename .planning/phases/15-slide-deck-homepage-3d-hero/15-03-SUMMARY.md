---
phase: 15
plan: 03
subsystem: home/canvas-loader + home/explorative-homepage + app/page
tags: [webgl-gate, after-lcp, dynamic-import, device-detection, ssr-false]
dependency_graph:
  requires:
    - 15-01 (palette tokens, stub components, test scaffolds)
    - 15-02 (hero-blob-canvas.tsx default export — dynamic import target)
  provides:
    - canvas-loader.tsx: after-LCP dynamic canvas mount with requestIdleCallback + Safari fallback
    - explorative-homepage.tsx: WebGL2 + touch/small + reduced-motion gate orchestrator
    - page.tsx wired to ExplorativeHomepage (not DeckHomepage)
  affects:
    - Plans 15-04 (section-writing/newsletter/footer stubs left for real implementation)
    - Plans 15-05 (scroll-driven animation layer builds on explorative-homepage layout)
tech_stack:
  added: []
  patterns:
    - '"use client" + dynamic({ssr:false}) isolation: canvas-loader owns the dynamic import, explorative-homepage owns the gate'
    - "requestIdleCallback({ timeout: 3000 }) for after-LCP deferral; setTimeout(200) as Safari fallback"
    - "WebGL2 failIfMajorPerformanceCaveat:true — prevents software renderer / reduces GPU fingerprint surface (T-15-08)"
    - "Object.defineProperty(window, matchMedia) in jsdom tests — vi.spyOn fails on undefined window.matchMedia"
    - "cleanup() from @testing-library/react in afterEach to prevent DOM bleed between tests"
key_files:
  created:
    - src/components/home/canvas-loader.tsx
    - src/components/home/section-writing.tsx (stub for Plan 15-04)
    - src/components/home/section-newsletter.tsx (stub for Plan 15-04)
    - src/components/home/section-footer.tsx (stub for Plan 15-04)
  modified:
    - src/components/home/explorative-homepage.tsx (stub → real implementation)
    - src/app/page.tsx (DeckHomepage → ExplorativeHomepage import swap)
    - src/__tests__/home/canvas-loader.test.tsx (vi.todo → 2 real assertions)
    - src/__tests__/home/explorative-homepage.test.tsx (vi.todo → 2 real assertions)
decisions:
  - "canvas-loader.tsx owns dynamic({ssr:false}) — Next 16 hard-fails if dynamic() is called from a Server Component; isolating it in a 'use client' file is the correct boundary (D-03)"
  - "requestIdleCallback({ timeout:3000 }) defers canvas mount until main thread is idle post-LCP; Safari falls back to setTimeout(200) — both keep canvas from competing with LCP text paint (T-15-09)"
  - "lenis.stop/start explicitly excluded from explorative-homepage.tsx — the explorative layout uses Lenis as the primary scroll controller; stopping it would break smooth scroll site-wide (T-15-10, Pitfall 4)"
  - "Object.defineProperty(window.matchMedia) used instead of vi.spyOn in gate tests — jsdom does not define window.matchMedia so vi.spyOn throws 'can only spy on a function'"
  - "cleanup() added to afterEach in explorative-homepage tests — prevents DOM accumulation causing 'Multiple elements found' errors when tests share module cache"
  - "Three stub files (section-writing/newsletter/footer) created to satisfy TypeScript forward-references from explorative-homepage.tsx; will be replaced in Plan 15-04"
metrics:
  duration: "4m"
  completed: "2026-06-19T20:54:00Z"
  tasks_completed: 2
  tasks_total: 2
  files_created: 4
  files_modified: 4
---

# Phase 15 Plan 03: Homepage Orchestration Layer — Canvas Loader + Gate + Page.tsx Summary

**One-liner:** after-LCP canvas loader via requestIdleCallback+setTimeout Safari fallback, WebGL2+touch+reduced-motion gate orchestrator with no lenis.stop, and page.tsx import swap from DeckHomepage to ExplorativeHomepage.

## Tasks Completed

| Task | Name | Commit | Files |
|------|------|--------|-------|
| 1 | Create canvas-loader.tsx (after-LCP dynamic mount) | 4733972 | src/components/home/canvas-loader.tsx, src/__tests__/home/canvas-loader.test.tsx |
| 2 | Create explorative-homepage.tsx (gate orchestrator) + swap page.tsx import | 22b8a2a | src/components/home/explorative-homepage.tsx, src/app/page.tsx, src/__tests__/home/explorative-homepage.test.tsx, 3 stub section files |

## Decisions Made

1. **canvas-loader isolation:** The `dynamic({ssr:false})` call must live in a `"use client"` file. Isolating it in `canvas-loader.tsx` keeps `explorative-homepage.tsx` clean (gate logic only). This matches the architectural boundary in D-03 and the PATTERNS.md pattern.

2. **requestIdleCallback timing:** Confirmed via the RESEARCH.md Pattern 3 rationale — canvas should mount after LCP + first user interaction window, not at hydration. The `{ timeout: 3000 }` ensures mobile Safari always mounts within 3s even if idle callback is never fired.

3. **lenis.stop omission:** Explicitly excluded per T-15-10. The deck homepage stopped Lenis to prevent interference with deck wheel capture. The explorative layout IS the scroll — Lenis must never be stopped here.

4. **jsdom matchMedia fix:** `vi.spyOn(window, "matchMedia")` throws "can only spy on a function" because jsdom doesn't define `window.matchMedia`. Fixed with `Object.defineProperty(window, "matchMedia", { writable: true, configurable: true, value: fn })`.

5. **cleanup() in afterEach:** Without cleanup, vitest module cache kept the same component mounted across tests, causing "Multiple elements found" errors when both tests rendered the same `data-testid`. `cleanup()` from `@testing-library/react` unmounts between tests.

6. **Section stubs:** `section-writing.tsx`, `section-newsletter.tsx`, `section-footer.tsx` created as minimal stubs so `explorative-homepage.tsx` compiles. These will be replaced by real implementations in Plan 15-04.

## Deviations from Plan

### Auto-fixed Issues

**1. [Rule 1 - Bug] lenis.stop in doc comment triggered grep-c gate failure**
- **Found during:** Task 2 verification
- **Issue:** The JSDoc comment on `explorative-homepage.tsx` originally contained `lenis.stop()` as a textual reference. The plan's verification step checks `grep -c 'lenis.stop'` must return 0. The comment text caused a false positive.
- **Fix:** Rewrote the comment to say "Does NOT stop or start Lenis" without referencing the method name directly.
- **Files modified:** `src/components/home/explorative-homepage.tsx`
- **Commit:** 22b8a2a (included in Task 2 commit)

**2. [Rule 2 - Missing critical functionality] jsdom matchMedia undefined broke gate tests**
- **Found during:** Task 2 test run
- **Issue:** `vi.spyOn(window, "matchMedia")` throws in jsdom environment because `window.matchMedia` is not defined (jsdom stub is absent). This is a critical test correctness issue.
- **Fix:** Replaced `vi.spyOn` with `Object.defineProperty(window, "matchMedia", { writable: true, configurable: true, value: mockFn })` + corresponding cleanup in `afterEach`.
- **Files modified:** `src/__tests__/home/explorative-homepage.test.tsx`
- **Commit:** 22b8a2a

**3. [Rule 1 - Bug] DOM bleed between tests caused "Multiple elements found" error**
- **Found during:** Task 2 test run — second test failed because first test's DOM nodes persisted
- **Issue:** Vitest caches module imports across tests in the same file. Without `cleanup()`, the previous render's DOM is still present when the next test renders, causing duplicate `data-testid` errors.
- **Fix:** Added `import { cleanup } from "@testing-library/react"` and called `cleanup()` in `afterEach`.
- **Files modified:** `src/__tests__/home/explorative-homepage.test.tsx`
- **Commit:** 22b8a2a

## Verification Results

| Check | Command | Result |
|-------|---------|--------|
| canvas-loader first line | head -1 canvas-loader.tsx | PASS — "use client" |
| explorative-homepage first line | head -1 explorative-homepage.tsx | PASS — "use client" |
| dynamic call in canvas-loader | grep 'dynamic(' | PASS — present with ssr:false |
| requestIdleCallback | grep 'requestIdleCallback' | PASS — count > 0 |
| setTimeout Safari fallback | grep 'setTimeout' | PASS — present |
| lenis.stop absent | grep -c 'lenis.stop' | PASS — count=0 |
| useLenisControl absent | grep -c 'useLenisControl' | PASS — count=0 |
| failIfMajorPerformanceCaveat | grep in explorative-homepage | PASS — present |
| showCanvas flag | grep 'showCanvas' | PASS — derived flag + conditional render |
| h1 LCP element | grep '<h1' | PASS — present in hero section |
| ExplorativeHomepage in page.tsx | grep 'ExplorativeHomepage' | PASS |
| DeckHomepage absent from page.tsx | grep 'DeckHomepage' | PASS — not found |
| TD-02 tests | npx vitest run canvas-loader.test.tsx | PASS — 2 passed, exit 0 |
| TD-03 + HD-05 tests | npx vitest run explorative-homepage.test.tsx | PASS — 2 passed, exit 0 |
| Full home/ suite | npx vitest run src/__tests__/home/ | PASS — 7 passed, 5 todo, exit 0 |
| TypeScript | npx tsc --noEmit | PASS — exit 0, no errors |
| Build | npx next build | PASS — all routes built, exit 0 |

## Known Stubs

The following stubs from this plan will be replaced in Plan 15-04:

| File | Plan | Stub Pattern |
|------|------|--------------|
| `src/components/home/section-writing.tsx` | Plan 15-04 | `export function SectionWriting() { return null; }` |
| `src/components/home/section-newsletter.tsx` | Plan 15-04 | `export function SectionNewsletter() { return null; }` |
| `src/components/home/section-footer.tsx` | Plan 15-04 | `export function SectionFooter() { return null; }` |
| `src/components/home/fallback-poster.tsx` | Plan 15-04 | `export function FallbackPoster() { return null; }` (from Plan 15-01) |

These stubs do NOT prevent this plan's goal (wiring the gate/orchestration layer). The homepage renders the full architectural chain: `page.tsx → ExplorativeHomepage → (CanvasLoader | FallbackPoster)`. The section components and FallbackPoster stubs return null, which is correct until Plan 15-04 provides real implementations.

## Threat Surface Scan

No new network endpoints, auth paths, file access patterns, or schema changes introduced.

The threat model mitigations confirmed implemented:
- **T-15-08** (WebGL fingerprinting): `failIfMajorPerformanceCaveat: true` present in gate code — prevents software renderer.
- **T-15-09** (Canvas vs LCP DoS): `requestIdleCallback({ timeout: 3000 })` defers mount until after LCP paint.
- **T-15-10** (lenis.stop breakage): `lenis.stop` is absent from `explorative-homepage.tsx` (grep -c returns 0).

## Self-Check: PASSED

| Item | Status |
|------|--------|
| src/components/home/canvas-loader.tsx | FOUND |
| src/components/home/explorative-homepage.tsx | FOUND |
| src/app/page.tsx | FOUND |
| src/__tests__/home/canvas-loader.test.tsx | FOUND |
| src/__tests__/home/explorative-homepage.test.tsx | FOUND |
| src/components/home/section-writing.tsx | FOUND |
| src/components/home/section-newsletter.tsx | FOUND |
| src/components/home/section-footer.tsx | FOUND |
| Commit 4733972 (canvas-loader) | FOUND |
| Commit 22b8a2a (explorative-homepage + page.tsx) | FOUND |
| canvas-loader.tsx "use client" first line | PASS |
| canvas-loader.tsx contains dynamic({ssr:false}) | PASS |
| canvas-loader.tsx contains requestIdleCallback | PASS |
| canvas-loader.tsx contains setTimeout | PASS |
| explorative-homepage.tsx "use client" first line | PASS |
| explorative-homepage.tsx contains failIfMajorPerformanceCaveat | PASS |
| explorative-homepage.tsx contains showCanvas | PASS |
| explorative-homepage.tsx does NOT contain lenis.stop | PASS |
| page.tsx contains ExplorativeHomepage | PASS |
| page.tsx does NOT contain DeckHomepage | PASS |
| TD-02 tests passing | PASS |
| TD-03 + HD-05 tests passing | PASS |
| TypeScript clean | PASS |
| npx next build exits 0 | PASS |
