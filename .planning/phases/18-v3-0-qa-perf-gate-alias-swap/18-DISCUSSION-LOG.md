# Phase 18 Discussion Log

**Mode:** `--auto` (fully autonomous, single pass)
**Date:** 2026-06-20

This phase was discussed in auto mode — Claude selected the recommended option for every
gray area without interactive prompts. Decisions are grounded in the v1.0/v2.0 QA pattern
(Phases 6 + 13), the v3 WebGL perf spike (spike 001, GO-WITH-CUTS), and operational memory.
The human visual checkpoint deferred from Phase 16 (`16-09-SUMMARY.md`) was folded in.

## Gray areas auto-selected

`[--auto] Selected all gray areas: Build environment, Lighthouse methodology, PSI floor,
WebGL LCP/3D verification, Visual QA scope, Secret scan, GO-doc artifacts, Promotion
mechanism, Milestone-close timing, Theme/FOUC, Test-infra scope.`

## Auto-resolved decisions

| Area | Question | Selected (recommended default) |
|------|----------|-------------------------------|
| Build environment | Where to run the readiness build + perf measurements? | `vercel build --prod` locally on `v3` + v3 preview URL for Lighthouse/PSI (D-01) |
| Lighthouse | Desktop or mobile gate; how many runs? | Desktop preset, median-of-3, preview URL; no local mobile gate (D-02) |
| PSI floor | What mobile-perf bar must v3 clear? | Parity-or-better vs current prod: target ≥ 82, hard floor ≥ 77 (D-03) |
| WebGL LCP | How to confirm the 3D hero doesn't regress LCP? | Assert text/poster LCP, mobile-poster path, deferred canvas, fetchPriority=high per spike 001 (D-04) |
| Visual QA scope | Which routes at 375px? | Homepage + interior + `/uses` + `/watching`; fold Phase 16 deferred 4-item checklist (D-05) |
| Secret scan | How to verify no client-bundle leak? | Reuse D-14 dual-tree grep (`secret_`, `NOTION_TOKEN`) (D-06) |
| GO artifacts | What output format? | Per-plan SUMMARY.md + consolidated `18-GO-NO-GO.md` (D-07) |
| Promotion | How to promote v3 to production? | `vercel deploy --prod` (never `--prebuilt --prod`) + mandatory alias-drift check + curl verify; branch→prod path flagged for research (D-08) |
| Milestone close | When to run complete-milestone? | Immediately at GO sign-off (D-09) |
| Theme/FOUC | How to handle dark mode? | Record single-mode ship if no dark v3 palette; else incognito FOUC check (D-10) |
| Test infra | Is vitest a gate? | Out of scope; build gate is the readiness gate (D-11) |

## Scope creep redirected → Deferred Ideas

- Real GLB model swap-in (voxel-Monty + horse)
- Homepage v2 (fluid line) / v3 (YouTube zoom-through)
- v2.0 carried tech debt (08/09/10 HUMAN-UAT + VERIFICATION + missing quick tasks)
- Dark / multi-mode v3 palette
- vitest infrastructure restoration

## Claude's discretion (handed to research/plan)

- **D-08 branch→production path** — the one genuinely open research item: direct
  `vercel deploy --prod` from `v3` vs. merge `v3 → main` vs. promote-preview-to-alias.
- Exact Lighthouse route list — finalized by planner against what shipped in Phases 15–16.
- Confirm spike-001 perf cuts are present in the shipped hero component (concrete D-04 assertions).
