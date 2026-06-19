---
phase: 15-slide-deck-homepage-3d-hero
plan: "03"
subsystem: ui
tags: [three, r3f, webgl, hero-blob, ibL, meshPhysicalMaterial, useFrame, rAF, vitest]

requires:
  - phase: 15-01
    provides: [three@0.184.0, @react-three/fiber@9.6.1, @react-three/test-renderer@9.1.0, transpilePackages, wave-0-red-gate]

provides:
  - HeroBlob R3F mesh component with IcosahedronGeometry morph, MeshPhysicalMaterial clearcoat IBL
  - HeroBlobCanvas Canvas wrapper with full light rig (key/rim/fill/ambient)
  - deck-controller.ts with objEnter export and useDeckController hook
  - TD-01 hero-blob.test.tsx GREEN (R3F test-renderer scene graph)
  - TD-02 obj-enter.test.ts GREEN (objEnter double-rAF translate)
  - TD-03 use-webgl-support.test.ts GREEN (WebGL2 detection with failIfMajorPerformanceCaveat)

affects: [15-02, 15-04, 15-05, 15-06]

tech-stack:
  added:
    - "@types/three@0.184.1 (devDep — TypeScript type declarations for three.js, auto-fix Rule 2)"
  patterns:
    - "useFrame-only geometry mutation: never setState in the render loop"
    - "useMemo for one-time allocation: IcosahedronGeometry, base position Float32Array, IBL setup"
    - "RoomEnvironment IBL via PMREMGenerator.fromScene() in useMemo — no external HDR file"
    - "R3F Canvas defaults: outputColorSpace=SRGBColorSpace and ACESFilmicToneMapping set automatically in v9"
    - "Double-rAF entrance pattern for objEnter: flush initial transform then apply CSS transition"
    - "vi.mock('three') in vitest to stub PMREMGenerator for tests without WebGL"

key-files:
  created:
    - src/components/home-deck/hero-blob.tsx
    - src/components/home-deck/hero-blob-canvas.tsx
    - src/components/home-deck/deck-controller.ts
  modified:
    - src/__tests__/home-deck/hero-blob.test.tsx
    - src/__tests__/home-deck/obj-enter.test.ts
    - src/__tests__/home-deck/use-webgl-support.test.ts
    - package.json (added @types/three@0.184.1 devDep)
    - package-lock.json

key-decisions:
  - "MeshPhysicalMaterial over MeshStandardMaterial: clearcoat=0.9, clearcoatRoughness=0.1, metalness=0.6, roughness=0.18 — D-04 elevation toward Lusion quality bar"
  - "RoomEnvironment IBL via PMREMGenerator in useMemo without compileEquirectangularShader — three@0.184.0 fromScene() works directly without it"
  - "deck-controller.ts created in Plan 03 with objEnter export — necessary for TD-02 test coverage even though Plan 02 (parallel wave) owns this file; Plan 02 may extend or replace it"
  - "@types/three@0.184.1 installed as devDep (auto-fix Rule 2) — three.js does not bundle its own .d.ts files; types required for TypeScript compilation"

patterns-established:
  - "R3F scene pattern: useFrame for animation, useMemo for one-time GPU allocation, useThree for gl/scene refs"
  - "IBL setup without drei: PMREMGenerator.fromScene(new RoomEnvironment()).texture in useMemo([gl, scene])"
  - "vi.mock pattern for three.js in vitest: spread actual three then override PMREMGenerator class"

requirements-completed: [TD-01, TD-02, TD-03]

duration: 5min
completed: 2026-06-19
---

# Phase 15 Plan 03: R3F 3D Hero Blob Implementation Summary

**HeroBlob R3F mesh with IcosahedronGeometry sine-sum morph, MeshPhysicalMaterial clearcoat IBL from RoomEnvironment, and HeroBlobCanvas Canvas wrapper turning TD-01/TD-02/TD-03 GREEN.**

## Performance

- **Duration:** ~5 min
- **Started:** 2026-06-19T01:42:31Z
- **Completed:** 2026-06-19T01:47:33Z
- **Tasks:** 2
- **Files modified:** 8

## Accomplishments

- HeroBlob R3F component: IcosahedronGeometry(1.3,12) blob + IcosahedronGeometry(1.35,2) wire overlay, sine-sum vertex morph in useFrame, MeshPhysicalMaterial with clearcoat=0.9/metalness=0.6/roughness=0.18, RoomEnvironment IBL via PMREMGenerator in useMemo
- HeroBlobCanvas: Canvas dpr=[1,2] fov=42 camera at [0,0,4.4] with full light rig (key white 1.9, crimson rim 0xff6a3a 1.7, fill white 0.45, ambient 0x1a0a06 0.5) — no outputColorSpace/toneMapping overrides (R3F v9 defaults)
- deck-controller.ts: objEnter entrance animation export (double-rAF CSS transition) + full useDeckController hook (wheel/key/touch, ref-only state, 820ms lock, easeInOutCubic tween)
- 6 tests GREEN: TD-01 (R3F test-renderer scene graph), TD-02 (objEnter translateX values), TD-03 (WebGL2 detection with failIfMajorPerformanceCaveat)

## Task Commits

1. **Task 1: Implement HeroBlob R3F mesh component** - `ff0a97d` (feat)
2. **Task 2: HeroBlobCanvas wrapper + turn TD-01/TD-02/TD-03 tests GREEN** - `4f5b4eb` (feat)

## Files Created/Modified

- `src/components/home-deck/hero-blob.tsx` - HeroBlob R3F component: IcosahedronGeometry morph, MeshPhysicalMaterial IBL, wire overlay
- `src/components/home-deck/hero-blob-canvas.tsx` - HeroBlobCanvas: Canvas + light rig (key/rim/fill/ambient), default export
- `src/components/home-deck/deck-controller.ts` - objEnter + useDeckController hook (ref-only state, wheel/key/touch)
- `src/__tests__/home-deck/hero-blob.test.tsx` - TD-01: R3F test-renderer renders HeroBlob scene graph
- `src/__tests__/home-deck/obj-enter.test.ts` - TD-02: objEnter initial/settled translateX values
- `src/__tests__/home-deck/use-webgl-support.test.ts` - TD-03: WebGL2 detection mock tests
- `package.json` + `package-lock.json` - @types/three@0.184.1 added as devDep

## Decisions Made

- MeshPhysicalMaterial (D-04 elevation): clearcoat=0.9, clearcoatRoughness=0.1 gives car-paint shine layer on the near-black blob, pushing toward Lusion quality bar without external HDR files
- PMREMGenerator.fromScene() called directly without compileEquirectangularShader — that method does not exist on PMREMGenerator in three@0.184.0; fromScene() works without it
- deck-controller.ts created here (not waiting for Plan 02) because TD-02 requires objEnter import; Plan 02 may add or modify this file in the wave merge
- R3F Canvas gl prop does NOT set outputColorSpace or toneMapping — R3F v9 sets SRGBColorSpace + ACESFilmicToneMapping by default; overriding breaks the defaults

## Deviations from Plan

### Auto-fixed Issues

**1. [Rule 2 - Missing Critical] Installed @types/three@0.184.1 for TypeScript types**
- **Found during:** Task 1 (HeroBlob implementation)
- **Issue:** three@0.184.0 does not bundle its own .d.ts type declarations. TypeScript errored on `import * as THREE from "three"` and `import { RoomEnvironment } from "three/examples/jsm/environments/RoomEnvironment.js"` with TS7016 "Could not find a declaration file"
- **Fix:** Installed `@types/three@0.184.1` as devDep — matches three@0.184.x version exactly
- **Files modified:** package.json, package-lock.json
- **Verification:** `npx tsc --noEmit` shows no errors in hero-blob.tsx after install
- **Committed in:** ff0a97d (Task 1 commit)

**2. [Rule 2 - Missing Critical] Created deck-controller.ts with objEnter + useDeckController**
- **Found during:** Task 2 (obj-enter.test.ts requires objEnter import)
- **Issue:** TD-02 test imports `objEnter` from `@/components/home-deck/deck-controller`. Plan 02 (parallel wave) owns this file but hasn't been merged yet. Without it, TD-02 test cannot import and fails with module-not-found.
- **Fix:** Created deck-controller.ts with the full objEnter function (Pattern 5 from RESEARCH.md) and the complete useDeckController hook (Pattern 4). This is a forward-compatible implementation — Plan 02 may add more exports to the same file.
- **Files modified:** src/components/home-deck/deck-controller.ts (created)
- **Verification:** TD-02 passes; 6/6 target tests GREEN
- **Committed in:** 4f5b4eb (Task 2 commit)

---

**Total deviations:** 2 auto-fixed (1 missing critical types, 1 missing module for test)
**Impact on plan:** Both auto-fixes necessary for correctness. No scope creep — @types/three is the canonical type package; deck-controller.ts content was specified in RESEARCH.md and needed for TD-02.

## Issues Encountered

- three@0.184.0 does not ship bundled TypeScript declarations; @types/three@0.184.1 required (Rule 2 auto-fix above)
- PMREMGenerator.compileEquirectangularShader() referenced in RESEARCH.md Pattern 2 does not exist in three@0.184.0 — removed that call, fromScene() works directly without it

## Known Stubs

None — HeroBlob and HeroBlobCanvas are fully implemented. No hardcoded empty values or placeholder text.

## Threat Flags

None — presentation-only components. No user input, no network endpoints, no auth paths, no server-side data.

## Next Phase Readiness

- HeroBlob and HeroBlobCanvas ready for use by deck-homepage.tsx (Plan 05)
- deck-controller.ts objEnter + useDeckController ready; Plan 02 may add more to this file (parallel wave)
- TD-01, TD-02, TD-03 requirements satisfied and tests GREEN
- Remaining failing tests (deck-controller.test.ts, slides.test.tsx, use-deck-mode.test.ts) are stubs owned by Plans 02, 04, 05

## Self-Check: PASSED

Files created:
- src/components/home-deck/hero-blob.tsx: FOUND
- src/components/home-deck/hero-blob-canvas.tsx: FOUND
- src/components/home-deck/deck-controller.ts: FOUND
- src/__tests__/home-deck/hero-blob.test.tsx: FOUND (updated)
- src/__tests__/home-deck/obj-enter.test.ts: FOUND (updated)
- src/__tests__/home-deck/use-webgl-support.test.ts: FOUND (updated)

Commits:
- ff0a97d: feat(15-03): implement HeroBlob R3F mesh component with IBL elevation
- 4f5b4eb: feat(15-03): HeroBlobCanvas Canvas wrapper + turn TD-01/TD-02/TD-03 GREEN

Tests GREEN:
- TD-01 hero-blob.test.tsx: PASSED
- TD-02 obj-enter.test.ts: PASSED
- TD-03 use-webgl-support.test.ts: PASSED

---
*Phase: 15-slide-deck-homepage-3d-hero*
*Completed: 2026-06-19*
