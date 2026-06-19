---
phase: 15
slug: slide-deck-homepage-3d-hero
status: ready-for-manual-verification
nyquist_compliant: true
wave_0_complete: true
created: 2026-06-18
---

# Phase 15 — Validation Strategy

> Per-phase validation contract for feedback sampling during execution.

---

## Test Infrastructure

| Property | Value |
|----------|-------|
| **Framework** | Vitest 4.1.x + @testing-library/react 16.3.x (existing) |
| **Config file** | `vitest.config.ts` (project root, present) |
| **Quick run command** | `npx vitest run src/__tests__/home-deck/` |
| **Full suite command** | `npx vitest run` |
| **Estimated runtime** | ~15 seconds (quick), ~30s (full) |

Wave 0 must install `@react-three/test-renderer@9.1.0` (peer of `@react-three/fiber@9.x`) so `HeroBlob` can be unit-tested without a WebGL context. `vitest.config.ts` + `src/__tests__/setup.ts` already exist; no framework install needed.

---

## Sampling Rate

- **After every task commit:** Run `npx vitest run src/__tests__/home-deck/`
- **After every plan wave:** Run `npx vitest run`
- **Before `/gsd-verify-work`:** Full suite must be green
- **Max feedback latency:** 30 seconds

---

## Per-Task Verification Map

| Req ID | Behavior | Test Type | Automated Command | File Exists | Status |
|--------|----------|-----------|-------------------|-------------|--------|
| HD-01 | One wheel gesture advances exactly one slide | unit | `npx vitest run src/__tests__/home-deck/deck-controller.test.ts` | ❌ W0 | ✅ green |
| HD-02 | Fresh-gesture detection filters decaying momentum; direction reversal bypasses the 820ms lock | unit | `npx vitest run src/__tests__/home-deck/deck-controller.test.ts` | ❌ W0 | ✅ green |
| HD-03 | Keyboard (ArrowDown/Up, Space, PageUp/Down, Home/End) advances slides | unit | `npx vitest run src/__tests__/home-deck/deck-controller.test.ts` | ❌ W0 | ✅ green |
| HD-04 | Slide 2 brutalist big-type index renders 3 links (Works / Writing / Prometheus) | unit | `npx vitest run src/__tests__/home-deck/slides.test.tsx` | ❌ W0 | ✅ green |
| HD-05 | Touch/small-screen detection returns true on `pointer: coarse` → native-scroll mode | unit | `npx vitest run src/__tests__/home-deck/use-deck-mode.test.ts` | ❌ W0 | ✅ green |
| TD-01 | `HeroBlob` renders without crash via R3F test renderer (scene graph builds) | unit | `npx vitest run src/__tests__/home-deck/hero-blob.test.tsx` | ❌ W0 | ✅ green |
| TD-02 | `objEnter` produces correct initial + settled transform values per slide change | unit | `npx vitest run src/__tests__/home-deck/obj-enter.test.ts` | ❌ W0 | ✅ green |
| TD-03 | WebGL2 support detection correctly identifies context availability (poster fallback path) | unit | `npx vitest run src/__tests__/home-deck/use-webgl-support.test.ts` | ❌ W0 | ✅ green |

*Status: ⬜ pending · ✅ green · ❌ red · ⚠️ flaky*

**Testing notes (from RESEARCH.md §Validation Architecture):**
- The deck controller is pure logic (refs + DOM manipulation) — test with jsdom and fake DOM elements; no R3F needed for controller tests.
- For `HeroBlob`, use `@react-three/test-renderer` — renders the scene graph without a WebGL context (jsdom provides none).
- HD-05 touch detection: mock `window.matchMedia` in setup (`src/__tests__/setup.ts` already imports `@testing-library/jest-dom/vitest`).
- TD-03 WebGL detection: mock `document.createElement` to return a canvas with a spy on `getContext` (check `webgl2`).

---

## Wave 0 Requirements

- [ ] `npm i -D @react-three/test-renderer@9.1.0` — R3F scene-graph test renderer (no framework install otherwise; vitest already present)
- [ ] `src/__tests__/home-deck/deck-controller.test.ts` — stubs for HD-01, HD-02, HD-03
- [ ] `src/__tests__/home-deck/slides.test.tsx` — stub for HD-04
- [ ] `src/__tests__/home-deck/use-deck-mode.test.ts` — stub for HD-05
- [ ] `src/__tests__/home-deck/hero-blob.test.tsx` — stub for TD-01 (depends on test-renderer install)
- [ ] `src/__tests__/home-deck/obj-enter.test.ts` — stub for TD-02
- [ ] `src/__tests__/home-deck/use-webgl-support.test.ts` — stub for TD-03

---

## Manual-Only Verifications

| Behavior | Requirement | Why Manual | Test Instructions |
|----------|-------------|------------|-------------------|
| Object material/lighting matches the elevated "Lusion bar" look (glossy near-black + clean crimson rim) | TD-01 / D-04 | Subjective visual fidelity; no automatable assertion for "looks hero-grade" | Run `npm run dev`, open `/`, visually compare blob material/lighting/depth against lusion.co reference and the Phase 14 quality bar |
| Per-slide `objEnter` entrance reads as fly-in-from-left → settle-right at ~1s | TD-02 / D-07 | Animation timing/feel is perceptual; unit test covers values not perceived motion | Advance through all 5 slides on desktop; confirm the object replays its entrance each change without jank |
| One-gesture-one-slide *feel* (momentum ignored, reversal not blocked) | HD-01 / HD-02 | Trackpad momentum behavior depends on real input device; jsdom can't emulate decaying deltas faithfully | On a real trackpad, flick once → exactly one slide; immediately reverse → moves without waiting out the lock |
| LCP not regressed by the 3D canvas (off the LCP path) | TD-03 / DQ-03 | Requires real browser perf measurement | Lighthouse/DevTools Performance on `/`; confirm LCP element is text/poster, not the WebGL canvas; canvas chunk loads after first paint |
| Reduced-motion + no-WebGL fallback shows poster + native scroll | HD-05 / DS-05 / D-08 / D-09 | Requires toggling OS/browser reduced-motion and disabling WebGL | Enable `prefers-reduced-motion`; confirm native vertical scroll + poster image, no wheel controller |

---

## Validation Sign-Off

- [ ] All tasks have automated verify or Wave 0 dependencies
- [ ] Sampling continuity: no 3 consecutive tasks without automated verify
- [ ] Wave 0 covers all MISSING references (test-renderer install + 6 test files)
- [ ] No watch-mode flags (use `vitest run`, not `vitest`)
- [ ] Feedback latency < 30s
- [ ] `nyquist_compliant: true` set in frontmatter (set by planner once every req maps to a verify)

**Approval:** pending
