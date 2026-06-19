---
phase: 15
plan: 01
subsystem: globals-css / test-scaffolds / public-assets
tags: [palette-swap, css-tokens, test-scaffolds, webp-placeholder, crimson-line]
dependency_graph:
  requires: []
  provides:
    - globals.css Crimson Line palette tokens (near-black / off-white / crimson accent)
    - public/hero-blob-poster.webp 1x1 placeholder (no FallbackPoster 404)
    - src/__tests__/home/ five test scaffold files with correct mock patterns
    - src/components/home/ stub components (Vite import-analysis resolution)
  affects:
    - every v3 component using text-text, bg-bg, border-border, .sig, .sig-out classes
    - FallbackPoster image rendering path (no 404)
    - Plans 15-02 through 15-05 (inherit mock patterns from scaffolds)
tech_stack:
  added: []
  patterns:
    - Crimson Line @theme inline tokens in Tailwind v4 CSS-first config
    - sharp Node.js API for valid WebP binary generation
    - vi.mock factory pattern with stub components to satisfy Vite import-analysis
    - vi.todo placeholder pattern for tests that reference not-yet-created components
key_files:
  created:
    - public/hero-blob-poster.webp
    - src/__tests__/home/hero-blob.test.tsx
    - src/__tests__/home/canvas-loader.test.tsx
    - src/__tests__/home/explorative-homepage.test.tsx
    - src/__tests__/home/section-building.test.tsx
    - src/__tests__/home/fallback-poster.test.tsx
    - src/components/home/hero-blob.tsx (stub)
    - src/components/home/canvas-loader.tsx (stub)
    - src/components/home/fallback-poster.tsx (stub)
    - src/components/home/explorative-homepage.tsx (stub)
    - src/components/home/section-building.tsx (stub)
  modified:
    - src/app/globals.css
decisions:
  - "Crimson Line palette: near-black #0a0a0a bg, off-white #f5f5f0 text, crimson #e23838 accent — corrects the crimson-on-crimson legibility failure of Crimson Poster"
  - "Removed entire Phase 15 Deck Styles block (123 lines) — superseded by explorative scroll layout"
  - "Created stub component files in src/components/home/ to satisfy Vite's vite:import-analysis static resolution (vi.mock alone is not sufficient when the real file does not exist)"
  - ":root sig vars updated to off-white fill + crimson-deep shadow (was crimson fill + near-black shadow)"
metrics:
  duration: "7m"
  completed: "2026-06-19T17:15:22Z"
  tasks_completed: 3
  tasks_total: 3
  files_created: 11
  files_modified: 1
---

# Phase 15 Plan 01: Wave 0 Blockers — Palette Swap, WebP Placeholder, Test Scaffolds Summary

**One-liner:** Crimson Line palette swap in globals.css (near-black #0a0a0a / off-white #f5f5f0 / crimson #e23838), valid 44-byte WebP placeholder, and five Vitest test scaffolds with correct CSM + matchMedia mock patterns.

## Tasks Completed

| Task | Name | Commit | Files |
|------|------|--------|-------|
| 1 | Swap globals.css palette to Crimson Line + strip deck styles | 4165e18 | src/app/globals.css |
| 2 | Create 1x1 dark WebP placeholder for hero-blob-poster.webp | 9a6756a | public/hero-blob-poster.webp |
| 3 | Create test scaffolds for all five home/ test files | 50bb06c | 10 files (5 tests + 5 stubs) |

## Decisions Made

1. **Palette swap timing:** Wave 0 must land before any new components are built, because every component with `text-text`, `bg-bg`, `border-border`, `.sig`, or `.sig-out` will render with wrong contrast until the tokens flip.

2. **stub component files created alongside test scaffolds:** Vite's `vite:import-analysis` plugin resolves dynamic import paths at transform time, even when wrapped in `vi.mock()`. Minimal stub files in `src/components/home/` are required so the test scaffolds compile. Plans 15-02 through 15-05 will replace these stubs with real implementations.

3. **sig vars updated:** `--sig` now points to `var(--color-text)` (off-white) instead of `var(--color-bg, #d93c1e)` (crimson). This ensures the signature treatment renders off-white fill on the near-black canvas, which is the correct Crimson Line aesthetic.

4. **Deck CSS block removed:** The 123-line Phase 15 Deck Styles block (`.deck-scroller`, `.deck-slide`, `.deck-slide--footer`, `.deck-foot`, `.deck-dots`, `.deck-dot`, etc.) was removed entirely. The explorative scroll layout does not use fixed-stage deck classes.

## Deviations from Plan

### Auto-fixed Issues

**1. [Rule 1 - Bug] Stub component files required alongside test scaffolds**
- **Found during:** Task 3
- **Issue:** Vite's `vite:import-analysis` plugin statically resolves all dynamic import paths at transform time. Even with `vi.mock('@/components/home/hero-blob', () => ({ ... }))`, if the real file does not exist, Vite throws "Failed to resolve import" and the test suite exits 1 rather than 0.
- **Fix:** Created five minimal stub `.tsx` files in `src/components/home/` that export the expected named exports (e.g., `HeroBlob`, `CanvasLoader`). Each stub has a comment indicating it will be replaced in the corresponding plan.
- **Files modified:** 5 new files in `src/components/home/`
- **Commit:** 50bb06c

## Verification Results

| Check | Command | Result |
|-------|---------|--------|
| CSS palette | `--color-bg: #0a0a0a` present in globals.css | PASS (count=1) |
| Deck CSS absent | `deck-slide` count in globals.css | PASS (count=0) |
| WebP placeholder | `ls -la public/hero-blob-poster.webp` | PASS (44 bytes, valid RIFF/WEBP) |
| Test suite | `npx vitest run src/__tests__/home/` | PASS (5 passed, 12 todo, exit 0) |
| Build check | `npx next build` | PASS (all routes built successfully) |

## Known Stubs

The following stub files exist as minimal placeholders to be replaced by real implementations:

| File | Plan | Stub Pattern |
|------|------|--------------|
| `src/components/home/hero-blob.tsx` | Plan 15-02 Task 1 | `export function HeroBlob() { return null; }` |
| `src/components/home/canvas-loader.tsx` | Plan 15-02 Task 1 | `export function CanvasLoader() { return null; }` |
| `src/components/home/explorative-homepage.tsx` | Plan 15-02 Task 3 | `export function ExplorativeHomepage() { return null; }` |
| `src/components/home/section-building.tsx` | Plan 15-03 Task 1 | `export function SectionBuilding() { return null; }` |
| `src/components/home/fallback-poster.tsx` | Plan 15-04 Task 1 | `export function FallbackPoster() { return null; }` |

These stubs do NOT affect the plan's goal (palette swap + placeholder + test scaffolds). They are intentional placeholders that enable the test scaffolds to compile. Each later plan replaces the relevant stub with the real implementation.

## Threat Surface Scan

No new network endpoints, auth paths, file access patterns, or schema changes introduced. The only new public asset (`public/hero-blob-poster.webp`) is a static file served via Next.js's existing static file serving path — same trust boundary as all existing files in `public/`.

## Self-Check: PASSED

| Item | Status |
|------|--------|
| src/app/globals.css | FOUND |
| public/hero-blob-poster.webp | FOUND |
| src/__tests__/home/hero-blob.test.tsx | FOUND |
| src/__tests__/home/canvas-loader.test.tsx | FOUND |
| src/__tests__/home/explorative-homepage.test.tsx | FOUND |
| src/__tests__/home/section-building.test.tsx | FOUND |
| src/__tests__/home/fallback-poster.test.tsx | FOUND |
| Commit 4165e18 (globals.css palette) | FOUND |
| Commit 9a6756a (WebP placeholder) | FOUND |
| Commit 50bb06c (test scaffolds) | FOUND |
