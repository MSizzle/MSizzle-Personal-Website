---
gsd_state_version: 1.0
milestone: v2.0
milestone_name: Editorial Redesign
current_phase: 9
status: executing
last_updated: "2026-05-21T05:33:29.042Z"
last_activity: 2026-05-21
progress:
  total_phases: 6
  completed_phases: 1
  total_plans: 16
  completed_plans: 13
  percent: 17
---

# Project State

**Current Milestone:** v2.0 Editorial Redesign (Phases 8-13)
**Current Phase:** 9
**Last Updated:** 2026-05-20

## Phase Status

| Phase | Status | Started | Completed |
|-------|--------|---------|-----------|
| 8 — Motion Subtractions | code_complete (HUMAN-UAT pending) | 2026-05-21 | 2026-05-21 |
| 9 — Design Tokens & Editorial Primitives | in_progress | 2026-05-21 | — |
| 10 — Editorial Homepage | not_started | — | — |
| 11 — Archive Pages | not_started | — | — |
| 12 — Sub-page Restyle Sweep | not_started | — | — |
| 13 — v2.0 QA & GO/NO-GO | not_started | — | — |

v1.0 Phase Status (archived, see `milestones/v1.0-ROADMAP.md`):

| Phase | Status | Started | Completed |
|-------|--------|---------|-----------|
| 1 — Foundation | complete | 2026-03-31 | 2026-03-31 |
| 2 — Notion CMS Integration | complete | 2026-03-31 | 2026-03-31 |
| 3 — Core Pages | complete | 2026-04-02 | 2026-04-02 |
| 4 — Animation & Polish | complete | 2026-04-02 | 2026-04-03 |
| 5 — Analytics | complete | 2026-04-03 | 2026-04-03 |
| 6 — Pre-Launch QA | complete | 2026-04-16 | 2026-04-16 |
| 7 — SEO Overhaul | complete | 2026-04-14 | 2026-04-16 |

## Active Work

v2.0 ROADMAP.md drafted 2026-05-20. 46 requirements mapped across 6 phases (Phase 8 Motion Subtractions → Phase 13 v2.0 QA & GO/NO-GO). Phase 8 selected as the first v2.0 phase per the "delete noise first to unblock visual work" strategy carried forward from the design-handoff motion budget.

Next action: `/gsd:plan-phase 8` to decompose Motion Subtractions into plans.

## Accumulated Context

### v2.0 Roadmap Decisions

- **Phase ordering:** Motion deletions (Phase 8) ship before design tokens (Phase 9) because deletions are reversible and unblock visual work without coupling to new tokens. Manifesto stagger (MOTION-07) was *split off* from the rest of MOTION and assigned to Phase 10 since the manifesto element it animates only exists once HOME-V2-02 is built.
- **Phase 10 is the largest single phase by requirement count (13)** — homepage is the centerpiece and benefits from being shipped as one coherent unit rather than split across phases. Plan-phase decomposition will determine plan count.
- **Phase 12 (Restyle Sweep) is highly parallelizable** — 6 sub-page restyles can ship as 6 plans, but a "restyle recipe" plan should land first to prevent palette-token drift across routes.
- **Phase 13 QA defaults to the GO/NO-GO doc format** per v1.0 retrospective lesson: per-plan SUMMARYs were inconsistent in v1.0 Phase 6; the GO/NO-GO doc was the artifact that mattered. Future QA phases follow the same pattern.
- **PSI is authoritative for mobile, not local Lighthouse** (QA-V2-03) — carried from v1.0 D-04 finding that local Lighthouse mobile variance was ±15 points.
- **`vercel build --prod` is the production-readiness gate** (QA-V2-01) — carried from v1.0 Phase 6 plan 06-01.

### v1.0 Carryforward (still active context)

- Next.js 16.2.1 used instead of 15.2.x (works fine)
- Provider hierarchy: ThemeProvider > LenisProvider > MotionProvider
- Image proxy route chosen over build-time download for Notion images
- notion.dataSources.query (v5 API) used — databases.query deprecated in v5
- Direct block rendering instead of markdown conversion for richer output
- ISR revalidation at 30 minutes
- GSAP ticker drives Lenis — prevents animation desyncs with ScrollTrigger
- MotionConfig reducedMotion='user' applied at provider level — all m.* components inherit a11y behavior
- Production domain is montysinger.com (Namecheap registrar/DNS), NOT msizzle.com
- Umami deployed as separate Vercel project at https://analytics.montysinger.com (Neon Postgres, custom subdomain via Namecheap CNAME)
- D-14 blocking gate applies to client chunks and to literal secret VALUES only — process.env reads in server Edge functions are INFO, not LEAK

### v1.0 Quick Tasks (post-launch)

| # | Description | Date | Commit | Directory |
|---|-------------|------|--------|-----------|
| 260409-js5 | Restyle visit-survey from modal to chat widget | 2026-04-09 | 9fd193c | [260409-js5-restyle-visit-survey-from-modal-to-chat-](./quick/260409-js5-restyle-visit-survey-from-modal-to-chat-/) |
| 260409-lle | Add Notion-powered events feature with /events page | 2026-04-09 | 7207e6a | [260409-lle-add-notion-powered-events-feature-with-e](./quick/260409-lle-add-notion-powered-events-feature-with-e/) |

## Known Issues

- Notion env vars (NOTION_TOKEN, NOTION_DATABASE_ID) — set in production, still useful to verify locally for dev
- Planning artifacts in `.planning/phases/` reference msizzle.com in places — should be swept to montysinger.com in a future docs cleanup (Phase 07 handled all src/ code; planning docs intentionally left alone for historical fidelity)

## v1.0 Deferred Items (closed)

Bookkeeping drift from v1.0, acknowledged at milestone close 2026-05-20. All are either superseded by v2.0 redesign or already-shipped work missing only paperwork closure. Retained here for traceability.

| Category | Item | Status | Disposition |
|----------|------|--------|-------------|
| quick_task | 260409-js5-restyle-visit-survey-from-modal-to-chat- | missing | Completed (commit 9fd193c) — dir lacks SUMMARY.md but work shipped |
| quick_task | 260409-lle-add-notion-powered-events-feature-with-e | missing | Completed (commit 7207e6a) — dir lacks SUMMARY.md but work shipped |
| quick_task | 260417-2h5-move-carousel-above-hero-text-stretch-fu | missing | Empty stub directory — superseded by works-carousel rewrite (31f0589); safe to delete |
| quick_task | 260417-3fn-shrink-works-logos-remove-boxes-make-log | missing | Empty stub directory — superseded by works-carousel rewrite (31f0589); safe to delete |
| uat_gap | Phase 04 04-HUMAN-UAT.md (6 pending scenarios) | partial | Superseded — Phase 04 animations are explicitly *deleted* in v2.0 (MOTION-01..06) |
| uat_gap | Phase 06 06-UAT.md (0 pending scenarios) | partial | False positive — UAT shipped (4a36aab "28-requirement UAT — 0 failures") |
| verification_gap | Phase 04 04-VERIFICATION.md | human_needed | Superseded — verifies animations being deleted in v2.0 |

---

*State initialized: 2026-03-31*
*v1.0 closed: 2026-04-16 (GO per Phase 6) · bookkeeping reconciled 2026-05-20*
*v2.0 roadmap drafted: 2026-05-20*

## Current Position

Phase: 9 (Design Tokens & Editorial Primitives) — EXECUTING
Plan: 7 of 9
Status: Ready to execute

  1. `npx vercel build --prod` exits 0 (D-11 phase gate)
  2. Manual Lenis + 200-300ms page-load-fade smoke test in Chrome (Plan-07 Task 2 — autonomous: false by plan design)

Last activity: 2026-05-21

## Operator Next Steps

- **First, on Mac:** clear the two HUMAN-UAT items per `.planning/phases/08-motion-subtractions/08-HUMAN-UAT.md` (vercel build + Lenis/fade smoke). Update the "## Resolution" section with PASS/FAIL.
- **If both PASS:** Run `gsd-sdk query phase.complete 08` again (or just `/gsd:phase-complete 08`) — phase.complete should clear the warning and finalize REQUIREMENTS.md status table.
- **Then:** `/gsd:discuss-phase 9` to start Design Tokens & Editorial Primitives (CONTEXT.md already exists per pre-phase docs check — discuss-phase will re-validate decisions before plan-phase auto-advances).
- **If HUMAN-UAT FAILs:** gap closure — `/gsd:plan-phase 8 --gaps` will read 08-VERIFICATION.md and create fix plans for the regression.
