---
phase: 15
slug: slide-deck-homepage-3d-hero
status: draft
nyquist_compliant: true
wave_0_complete: false
created: 2026-06-19
---

# Phase 15 — Validation Strategy

> Per-phase validation contract for feedback sampling during execution.

---

## Test Infrastructure

| Property | Value |
|----------|-------|
| **Framework** | Vitest 4.x + @react-three/test-renderer 9.1.0 + @testing-library/react 16.3 |
| **Config file** | `vitest.config.ts` (exists) |
| **Quick run command** | `npx vitest run --reporter=verbose src/__tests__/home/` |
| **Full suite command** | `npx vitest run` |
| **Estimated runtime** | ~15 seconds (home/ suite); ~60 seconds (full suite) |

---

## Sampling Rate

- **After every task commit:** Run `npx vitest run src/__tests__/home/`
- **After every plan wave:** Run `npx vitest run`
- **Before `/gsd-verify-work`:** Full suite must be green
- **Max feedback latency:** ~15 seconds (home/ quick run)

---

## Per-Task Verification Map

| Task ID | Plan | Wave | Requirement | Test Type | Automated Command | File Exists | Status |
|---------|------|------|-------------|-----------|-------------------|-------------|--------|
| 15-01-01 | 01 | 1 | TD-01..TD-03, HD-04..HD-05 | grep + build | `grep -c '--color-bg:.*#0a0a0a' src/app/globals.css` | ✅ | ⬜ pending |
| 15-01-02 | 01 | 1 | TD-03 | file check | `ls -la public/hero-blob-poster.webp` | ❌ W0 | ⬜ pending |
| 15-01-03 | 01 | 1 | TD-01..TD-03, HD-04..HD-05 | unit scaffold | `npx vitest run src/__tests__/home/` | ❌ W0 | ⬜ pending |
| 15-02-T0 | 02 | 2 | TD-01..TD-02 | checkpoint | Human verify npm registry legitimacy | ✅ (human) | ⬜ pending |
| 15-02-T1 | 02 | 2 | TD-01 | unit | `npx vitest run src/__tests__/home/hero-blob.test.tsx` | ❌ W0 | ⬜ pending |
| 15-02-T2 | 02 | 2 | TD-01..TD-02 | tsc | `npx tsc --noEmit 2>&1 \| grep -E "home/hero-(blob-canvas\|podium)"` | ✅ | ⬜ pending |
| 15-03-T1 | 03 | 2 | TD-02 | unit | `npx vitest run src/__tests__/home/canvas-loader.test.tsx` | ❌ W0 | ⬜ pending |
| 15-03-T2 | 03 | 2 | TD-02..TD-03, HD-05 | unit | `npx vitest run src/__tests__/home/explorative-homepage.test.tsx` | ❌ W0 | ⬜ pending |
| 15-04-T1 | 04 | 3 | TD-03, HD-05 | unit | `npx vitest run src/__tests__/home/fallback-poster.test.tsx` | ❌ W0 | ⬜ pending |
| 15-04-T2 | 04 | 3 | HD-04 | unit | `npx vitest run src/__tests__/home/section-building.test.tsx` | ❌ W0 | ⬜ pending |
| 15-04-T3 | 04 | 3 | HD-04, HD-05, TD-03 | unit + build | `npx vitest run src/__tests__/home/ && npx next build` | ❌ W0 | ⬜ pending |
| 15-05-T1 | 05 | 4 | TD-01..TD-02, D-09, D-15 | unit + grep | `npx vitest run src/__tests__/home/ 2>&1 \| tail -10` | ✅ | ⬜ pending |
| 15-05-T2 | 05 | 4 | TD-03 | file check | `ls -la public/hero-blob-poster.webp \| awk '{print $5}'` | ✅ (after T2) | ⬜ pending |
| 15-05-T3 | 05 | 4 | TD-01..TD-03, HD-04..HD-05 | checkpoint | Human visual + vercel build | ✅ (human) | ⬜ pending |

*Status: ⬜ pending · ✅ green · ❌ red · ⚠️ flaky*

---

## Wave 0 Requirements

Wave 0 = Plan 15-01 Task 3. These test scaffolds must exist before Wave 2 implementation begins.

- [ ] `src/__tests__/home/hero-blob.test.tsx` — TD-01 scaffold (CSM mock, R3F test renderer pattern)
- [ ] `src/__tests__/home/canvas-loader.test.tsx` — TD-02 scaffold (fake timers, dynamic import mock)
- [ ] `src/__tests__/home/explorative-homepage.test.tsx` — TD-03 + HD-05 scaffold (matchMedia mock, gate conditions)
- [ ] `src/__tests__/home/section-building.test.tsx` — HD-04 scaffold (BigList render stub)
- [ ] `src/__tests__/home/fallback-poster.test.tsx` — TD-03 / HD-05 scaffold (FallbackPoster renders Image)
- [ ] Placeholder `public/hero-blob-poster.webp` (1x1 dark WebP) — unblocks FallbackPoster from 404 during test runs

Note: `fallback-poster.test.tsx` is the Wave 0 scaffold needed to satisfy Nyquist continuity for Plan 15-04 Task 1 (B2 fix). It must be added to Plan 15-01 Task 3's file list.

---

## Manual-Only Verifications

| Behavior | Requirement | Why Manual | Test Instructions |
|----------|-------------|------------|-------------------|
| Desktop bloom fidelity — crimson rim produces visible glow around blob | TD-01 | WebGL rendering cannot be automated in Vitest/JSDOM | Open http://localhost:3000 on desktop, observe blob rim glow (should be visible within 1s of canvas mount) |
| Vercel preview mobile PSI | DQ-03 | Requires live Vercel URL + external PSI tool | After vercel preview deploy, run PageSpeed Insights on the preview URL; mobile score should be parity-or-better vs current; LCP element must be h1 or poster Image, not canvas |
| 15-05 visual checkpoint (palette, WebGL, mobile fallback, scroll beats, no double footer) | All Phase 15 reqs | Composite visual + functional check requiring human perception | See 15-05-PLAN.md Task 3 how-to-verify — five numbered checks |

---

## Validation Sign-Off

- [ ] All tasks have `<automated>` verify or Wave 0 dependencies
- [x] Sampling continuity: no 3 consecutive tasks without automated verify
- [ ] Wave 0 covers all MISSING references (wave_0_complete: false until Plan 15-01 runs)
- [x] No watch-mode flags
- [x] Feedback latency < 15s (home/ quick run)
- [x] `nyquist_compliant: true` set in frontmatter — strategy is fully specified

**Approval:** pending — wave_0_complete will flip to true after Plan 15-01 execution
