---
gsd_state_version: 1.0
milestone: v2.0
milestone_name: Editorial Redesign
status: planning
last_updated: "2026-05-21T02:31:45.067Z"
last_activity: 2026-05-21
progress:
  total_phases: 0
  completed_phases: 0
  total_plans: 0
  completed_plans: 0
  percent: 0
---

# Project State

**Current Phase:** 06 (closed)
**Last Updated:** 2026-05-20

## Phase Status

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

All 7 phases complete. v1.0 GO approved 2026-04-16 per `06-GO-NO-GO.md` (signed off by user after full QA walkthrough — visual fixes session covered nav, breadcrumbs, project images, newsletter carousel, subscribe CTA, Prometheus link; mobile PSI 77 accepted as non-blocking caveat for personal site). Site live at https://montysinger.com. Ready for `/gsd:complete-milestone` (archive v1.0) and `/gsd:new-milestone` (kick off v2.0 Editorial Redesign — see `.planning/research/editorial-redesign-handoff/` once imported).

## Accumulated Context

### Decisions

- Next.js 16.2.1 used instead of 15.2.x (works fine)
- Provider hierarchy: ThemeProvider > LenisProvider > MotionProvider
- Image proxy route chosen over build-time download for Notion images
- notion.dataSources.query (v5 API) used — databases.query deprecated in v5
- Direct block rendering instead of markdown conversion for richer output
- ISR revalidation at 30 minutes
- [Phase 03]: Used inline SVGs for brand social icons (X, LinkedIn, GitHub) — lucide-react v4 removed brand icons
- [Phase 03]: Added Notion API env var guards to blog pages — build now succeeds without NOTION_TOKEN set
- [Phase 03]: estimateReadingTime used on listing from description — no extra API calls per D-09
- [Phase 03]: calculateReadingTime used on detail from already-fetched blocks — zero extra API calls
- [Phase 03, Plan 06]: Used next/og ImageResponse built into Next.js — no @vercel/og package needed
- [Phase 03, Plan 06]: Blog OG image shows title AND date per locked decision D-14
- [Phase 03, Plan 06]: Sitemap try/catch around Notion calls — degrades gracefully without API access
- [Phase 04]: GSAP ticker drives Lenis — prevents animation desyncs with ScrollTrigger
- [Phase 04]: MotionConfig reducedMotion='user' applied at provider level — all m.* components inherit a11y behavior
- [Phase 04-animation-polish]: Writing section heading uses ParallaxLayer nested inside ScrollReveal — rotation [-2,2] continues post-reveal
- [Phase 04-animation-polish]: Contact section ScrollReveal only — avoids scroll-end parallax jank
- [Phase 04-animation-polish]: ProjectCard converted to use client for AnimatePresence overlay — useState, useEffect, and Motion AnimatePresence require client context
- [Phase 04-animation-polish]: Blog/About/Links/Projects pages remain Server Components with ScrollReveal client child — no use client needed on page files
- [Phase 05-analytics]: vi.doMock used after vi.resetModules() for per-test env var isolation in analytics tests
- [Phase 05-analytics]: data-umami-event declarative click tracking on footer, project-card, and links page outbound links
- [Phase 05-analytics]: Umami deployed as separate Vercel project (fork of umami-software/umami) backed by Neon Postgres, now reachable at https://analytics.montysinger.com (custom subdomain D-04 completed 2026-04-10 via Namecheap CNAME → cname.vercel-dns.com); legacy *.vercel.app alias preserved
- [Phase 05-analytics]: Production domain is montysinger.com (Namecheap registrar/DNS), NOT msizzle.com — earlier planning docs were incorrect
- [Phase 06]: Plan 06-01 classified broader-sweep NOTION_TOKEN variable-name hits as INFO (not LEAK) since they are process.env reads in server Edge functions; D-14 blocking gate applies to client chunks and to literal secret VALUES only
- [Phase 06]: All 6 plans shipped (06-01..06-06); GO/NO-GO verdict GO 2026-04-16; v1.0 approved for launch; PSI mobile 77 (home) accepted as non-blocking caveat for a personal site — optimization continues post-launch; DSGN-02 mobile responsive + dark-mode FOUC visually confirmed during user QA walkthrough session

### Roadmap Evolution

- Phase 7 added: SEO Overhaul

### Quick Tasks Completed

| # | Description | Date | Commit | Directory |
|---|-------------|------|--------|-----------|
| 260409-js5 | Restyle visit-survey from modal to chat widget | 2026-04-09 | 9fd193c | [260409-js5-restyle-visit-survey-from-modal-to-chat-](./quick/260409-js5-restyle-visit-survey-from-modal-to-chat-/) |
| 260409-lle | Add Notion-powered events feature with /events page | 2026-04-09 | 7207e6a | [260409-lle-add-notion-powered-events-feature-with-e](./quick/260409-lle-add-notion-powered-events-feature-with-e/) |

## Known Issues

- Notion env vars (NOTION_TOKEN, NOTION_DATABASE_ID) — set in production, still useful to verify locally for dev
- Planning artifacts in `.planning/phases/` reference msizzle.com in places — should be swept to montysinger.com in a future docs cleanup (Phase 07 handled all src/ code; planning docs intentionally left alone for historical fidelity)
- STATE.md was bookkeeping-stale until 2026-05-20: Phase 6 had been shipped 2026-04-16 (per `06-GO-NO-GO.md` final GO) but the Phase Status table still read `planned`. Reconciled when prepping v2.0 milestone kickoff.

## Deferred Items

Items acknowledged and deferred at v1.0 milestone close on 2026-05-20. All are bookkeeping drift, not real outstanding work — surfaced by `gsd-sdk query audit-open` during `/gsd:complete-milestone`.

| Category | Item | Status | Disposition |
|----------|------|--------|-------------|
| quick_task | 260409-js5-restyle-visit-survey-from-modal-to-chat- | missing | Completed (commit 9fd193c) — quick task dir lacks SUMMARY.md but work shipped |
| quick_task | 260409-lle-add-notion-powered-events-feature-with-e | missing | Completed (commit 7207e6a) — quick task dir lacks SUMMARY.md but work shipped |
| quick_task | 260417-2h5-move-carousel-above-hero-text-stretch-fu | missing | Empty stub directory — work either rolled into later carousel commits (31f0589) or abandoned; safe to delete |
| quick_task | 260417-3fn-shrink-works-logos-remove-boxes-make-log | missing | Empty stub directory — likely superseded by works-carousel rewrite (31f0589); safe to delete |
| uat_gap | Phase 04 04-HUMAN-UAT.md (6 pending scenarios) | partial | Superseded — Phase 04 animations are being explicitly *deleted* in v2.0 Editorial Redesign per the redesign handoff motion budget |
| uat_gap | Phase 06 06-UAT.md (0 pending scenarios) | partial | False positive — UAT shipped (4a36aab "28-requirement UAT — 0 failures, 1 human-needed"); status marker stale |
| verification_gap | Phase 04 04-VERIFICATION.md | human_needed | Superseded — verifies animations that are being deleted in v2.0 |

---

*State initialized: 2026-03-31*
*v1.0 closed: 2026-04-16 (GO per Phase 6) · bookkeeping reconciled 2026-05-20*

## Current Position

Phase: Not started (defining requirements)
Plan: —
Status: Defining requirements
Last activity: 2026-05-21 — Milestone v2.0 started

## Operator Next Steps

- Start the next milestone with /gsd-new-milestone
