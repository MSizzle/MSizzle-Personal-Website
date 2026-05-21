---
gsd_state_version: 1.0
milestone: v2.0
milestone_name: Editorial Redesign
current_phase: 11
status: executing
last_updated: "2026-05-21T14:32:14.631Z"
last_activity: 2026-05-21 -- Phase 11 planning complete
progress:
  total_phases: 6
  completed_phases: 3
  total_plans: 28
  completed_plans: 23
  percent: 50
---

# Project State

**Current Milestone:** v2.0 Editorial Redesign (Phases 8-13)
**Current Phase:** 11
**Last Updated:** 2026-05-21

## Phase Status

| Phase | Status | Started | Completed |
|-------|--------|---------|-----------|
| 8 — Motion Subtractions | code_complete (HUMAN-UAT pending) | 2026-05-21 | 2026-05-21 |
| 9 — Design Tokens & Editorial Primitives | code_complete (ready for verification) | 2026-05-21 | 2026-05-21 |
| 10 — Editorial Homepage | code_complete (ready for verification) | 2026-05-21 | 2026-05-21 |
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

Phase: 10 (Editorial Homepage) — EXECUTING
Plan: Not started
Status: Ready to execute

All Phase 9 plans (09-01 through 09-09) shipped:

- Tokens: paper/ink/muted/faint/rule/rule-strong/footer-* palette + 12 type-scale utilities (09-01)
- Primitives: Rule, RuleStrong, SectionLabel, ListRow, AllLink, IntroLink, FooterCol (09-02..09-08)
- Integration: /specimen route + triple-defense discoverability + local build gate (09-09)

Phase 10 progress (7 of 7 plans shipped — Phase 10 feature-complete):

- 10-01 shipped (commits ccd2ae6 + a43c67f): v1.0 chrome gated to non-home routes via pathname check in Navigation, Footer, and new MainOffset client component. New v2.0 page.tsx scaffold ships HOME-V2-01..04 + section slot placeholders.
- 10-02 shipped (commits 7f2ca22 + d3138cc): Letter-style intro paragraph (HOME-V2-05) with 3 IntroLink components + BUILDING section (HOME-V2-06) with Prometheus + Selected Works rows using canonical D-13 section pattern. First Phase 9 primitives consumed in production: IntroLink, RuleStrong, Rule, SectionLabel, AllLink.
- 10-03 shipped (6d095e9 + 8af72d2 + d202f45): WRITING section (HOME-V2-07) renders 3 latest essays as ListRow big. EVENTS section (HOME-V2-08) renders featured event in 3-col grid (date/content/RSVP) + 2 secondary ListRows. New src/lib/dates.ts helper (formatMonthYear, formatMonthDay).
- 10-04 shipped (45f6ceb + 27706db): PHOTOGRAPHS section (HOME-V2-09) — 12-col asymmetric grid + 6 plates + mix-blend-difference captions + AllLink to /photos. HOME_PHOTOS module constant. Phase 9 D-09 exception documented for `text-[10px]` + `tracking-[0.2em]` caption overlay.
- 10-05 shipped (ab005f6 + 4a22cc5): PERSONAL section (HOME-V2-10) — 3-card grid (Photo Archive / Links & Elsewhere / About) with top ink rule + AllLink Enter → CTAs. Inverted ink footer (HOME-V2-11) — 4-col grid (colophon + Studio/Library/About FooterCols) + bottom row with copyright and 4 social links. FooterCol primitive now consumed in production. Desktop homepage feature-complete (11 of 13 requirements).
- 10-06 shipped (2f5fe73 + 0d9f100): Mobile parity sweep (HOME-V2-12) — 3-line mobile manifesto at 56px / 2-col photographs grid / footer column dividers / 44px tap targets on header nav + footer socials. Dual static h1 staged for Plan 10-07 collapse. 12 of 13 requirements complete.
- **10-07 shipped (35ffd51 + 6cc69b3): Manifesto letter-stagger interaction (MOTION-07).** New `src/components/home-v2/manifesto-reveal.tsx` (155 lines, `'use client'`). Imports `m` from motion/react (LazyMotion strict trap avoided). Three-phase state machine (pending → animate or skip) for SSR-safe sessionStorage gating. sessionStorage key `gsd:manifesto-shown` tab-scoped. useReducedMotion fallback = 300ms opacity fade. matchMedia switches between DESKTOP_LINES (2 lines) and MOBILE_LINES (3 lines) internally — no props. `src/app/page.tsx` collapses Plan 10-06's dual static h1 into a single `<ManifestoReveal />` invocation. **All 13 Phase 10 requirements shipped (HOME-V2-01..12 + MOTION-07).**

D-40 (`vercel build --prod`) deferred to Vercel preview deploy on next branch push (Phase 8 precedent).

Last activity: 2026-05-21 -- Phase 11 planning complete

## Operator Next Steps

- **Phase 10 verification:** Run `/gsd:verify-phase 10` to validate all 7 plan SUMMARYs, the 13 requirements (HOME-V2-01..12 + MOTION-07), and acceptance criteria against shipped code. MOTION-07's perceptual stagger gate is HUMAN-UAT per D-41.
- **Phase 9 verification (still open):** Run `/gsd:verify-phase 9` if not already complete.
- **D-40 closure (Phase 10):** Push the current branch to remote. Confirm Vercel preview deploy:
  - Vercel build exits 0
  - Homepage `/` renders editorial layout (header + manifesto + meta + epigraph + 5 sections + footer)
  - Manifesto stagger fires on first incognito visit
  - sessionStorage flag `gsd:manifesto-shown=1` is set after first visit (DevTools → Application → Session Storage)
  - Reload does NOT replay the animation
  - macOS Reduce Motion ON renders the 300ms fade instead
- **HUMAN-UAT smoke test (Phase 10):** 6 surfaces to verify in browser per 10-07-SUMMARY.md (desktop fresh tab @ 1440 / mobile fresh tab @ 390 / internal nav back / new incognito tab / macOS Reduce Motion / viewport resize across breakpoint).
- **Phase 8 backlog (still open):** Clear the two HUMAN-UAT items per `.planning/phases/08-motion-subtractions/08-HUMAN-UAT.md` (vercel build + Lenis/fade smoke) before closing v2.0.
- **After Phase 10 verifies:** `/gsd:discuss-phase 11` (Archive Pages — `/writing`, `/events`, `/photos`). The homepage's `/photos` AllLink currently 404s; Phase 11 makes it live.
