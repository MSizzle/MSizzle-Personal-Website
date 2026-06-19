---
phase: 15-slide-deck-homepage-3d-hero
plan: "01"
subsystem: test-infrastructure
tags: [three, r3f, vitest, wave-0, red-gate, tdd]
dependency_graph:
  requires: []
  provides: [wave-0-red-gate, three-deps, r3f-deps, home-deck-test-stubs]
  affects: [15-02, 15-03, 15-04, 15-05, 15-06]
tech_stack:
  added:
    - three@0.184.0 (production dep — 3D engine for R3F)
    - "@react-three/fiber@9.6.1 (production dep — React renderer for three.js)"
    - "@react-three/test-renderer@9.1.0 (devDep — R3F scene graph testing without WebGL)"
  patterns:
    - vitest stub pattern with failing assertions (expect(false).toBe(true))
    - vi.mock('motion/react') at file top for useReducedMotion
    - vi.stubGlobal('matchMedia') for browser API stubs
    - @react-three/test-renderer import (first WebGL-adjacent test in codebase)
key_files:
  created:
    - src/__tests__/home-deck/deck-controller.test.ts
    - src/__tests__/home-deck/slides.test.tsx
    - src/__tests__/home-deck/use-deck-mode.test.ts
    - src/__tests__/home-deck/hero-blob.test.tsx
    - src/__tests__/home-deck/obj-enter.test.ts
    - src/__tests__/home-deck/use-webgl-support.test.ts
  modified:
    - next.config.ts (transpilePackages: ['three'] added as first key)
    - package.json (three, @react-three/fiber, @react-three/test-renderer added)
    - .planning/phases/15-slide-deck-homepage-3d-hero/15-VALIDATION.md (nyquist_compliant and wave_0_complete set to true)
decisions:
  - "three@0.184.0 and @react-three/fiber@9.6.1 pinned as production deps; versions from RESEARCH.md npm registry verification on 2026-06-18"
  - "transpilePackages: ['three'] placed as first key in nextConfig to avoid hiding position ambiguity"
  - "@react-three/test-renderer@9.1.0 as devDep only — not needed in production bundle"
  - "Stubs use expect(false).toBe(true) rather than expect.fail() for consistency with vitest's AssertionError output shape"
metrics:
  duration: "~8 minutes"
  completed: 2026-06-18
  tasks_completed: 2
  tasks_total: 2
  files_created: 6
  files_modified: 3
---

# Phase 15 Plan 01: three.js + R3F deps install + Wave 0 RED gate stubs Summary

**One-liner:** Installed three@0.184.0 + R3F 9.6.1, added transpilePackages, and created 6 failing test stubs covering all 8 Wave 0 requirements (HD-01..HD-05, TD-01..TD-03).

## What Was Built

Task 1 installed the full 3D stack — `three@0.184.0` and `@react-three/fiber@9.6.1` as production dependencies, `@react-three/test-renderer@9.1.0` as a dev dependency — then updated `next.config.ts` to add `transpilePackages: ['three']` as the first key in the config object. This is required for `three/examples/jsm` ESM subpath imports (e.g., `RoomEnvironment.js`) to resolve in production Vercel builds. Without it the import works in local dev (Turbopack handles ESM natively) but fails on `vercel build`.

Task 2 created 6 failing test stubs in `src/__tests__/home-deck/`, one per requirement cluster:

| File | Requirements | Tests |
|------|-------------|-------|
| deck-controller.test.ts | HD-01, HD-02, HD-03 | 4 stubs |
| slides.test.tsx | HD-04 | 1 stub |
| use-deck-mode.test.ts | HD-05 | 2 stubs |
| hero-blob.test.tsx | TD-01 | 1 stub |
| obj-enter.test.ts | TD-02 | 2 stubs |
| use-webgl-support.test.ts | TD-03 | 3 stubs |

All 13 test cases fail intentionally with `expect(false).toBe(true)`. No module-resolution errors — `@react-three/test-renderer` import resolves correctly. `15-VALIDATION.md` frontmatter updated to `nyquist_compliant: true` and `wave_0_complete: true`.

## Verification

- `grep -c "transpilePackages" next.config.ts` returns 1
- `npx vitest run src/__tests__/home-deck/` exits non-zero: 6 test files, 13 tests, all FAIL (RED state)
- All test names reference their requirement IDs in describe labels
- No "Cannot find module" errors in test output

## Deviations from Plan

None — plan executed exactly as written.

## Threat Flags

None — this plan only installs packages and creates test files. No network endpoints, auth paths, file access patterns, or schema changes introduced.

## Self-Check: PASSED

Files created:
- src/__tests__/home-deck/deck-controller.test.ts: FOUND
- src/__tests__/home-deck/slides.test.tsx: FOUND
- src/__tests__/home-deck/use-deck-mode.test.ts: FOUND
- src/__tests__/home-deck/hero-blob.test.tsx: FOUND
- src/__tests__/home-deck/obj-enter.test.ts: FOUND
- src/__tests__/home-deck/use-webgl-support.test.ts: FOUND

Commits:
- 7f287b0: chore(15-01): install three.js + R3F deps, add transpilePackages
- 747d8e7: test(15-01): add 6 failing stubs for Wave 0 RED gate (HD-01..HD-05, TD-01..TD-03)
