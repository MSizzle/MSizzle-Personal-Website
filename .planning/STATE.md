---
gsd_state_version: 1.0
milestone: v3.0
milestone_name: Dark Brutalist Rebuild
status: executing
stopped_at: Phase 14 context gathered
last_updated: "2026-06-19T00:00:08.389Z"
last_activity: 2026-06-18
progress:
  total_phases: 5
  completed_phases: 0
  total_plans: 4
  completed_plans: 2
  percent: 0
---

# Project State

## Project Reference

See: .planning/PROJECT.md (updated 2026-06-18)

**Core value:** A personal site that feels alive and memorable, *and* legible — not another template blog.
**Current focus:** Phase 14 — branch-crimson-poster-foundation

## Current Position

Phase: 14 (branch-crimson-poster-foundation) — EXECUTING
Plan: 3 of 4
Status: Ready to execute
Last activity: 2026-06-18

Progress: [█████░░░░░] 50%

## v3.0 Phase Status

| Phase | Status | Started | Completed |
|-------|--------|---------|-----------|
| 14 — Branch & Crimson Poster Foundation | not_started | — | — |
| 15 — Slide-Deck Homepage & 3D Hero | not_started | — | — |
| 16 — Interior Pages on Notion Data | not_started | — | — |
| 17 — Infrastructure Preservation & SEO Extension | not_started | — | — |
| 18 — v3.0 QA, Perf Gate & Alias Swap | not_started | — | — |

v1.0 (Phases 1-7) and v2.0 (Phases 8-13) shipped — see `milestones/v1.0-ROADMAP.md` and `milestones/v2.0-ROADMAP.md`.

## Active Work

v3.0 ROADMAP.md drafted 2026-06-18. 21 requirements (DS/HD/TD/PG/IN/DQ) mapped across 5 phases (14-18), continuing numbering from v2.0's Phase 13. This is a presentation-layer rebuild on the existing Next.js 16 / React 19 / Tailwind v4 / Notion stack — infrastructure preserved, not rebuilt. Design fully specified by the committed prototype at `.planning/sketches/002-full-site-model/` (reference assets: `assets/site.css`, `assets/site.js`); deck controller ported from CHOMP `components/Slideshow.tsx`.

Next action: `/gsd-plan-phase 14` to decompose Branch & Crimson Poster Foundation into plans.

## Accumulated Context

### v3.0 Roadmap Decisions

- **Foundation lands before pages.** Phase 14 (branch + Crimson Poster `@theme` tokens + brutalist primitives) ships first because it unblocks every page. The branch setup itself (DQ-01) lives here, not in a separate "ops" phase.
- **Homepage + 3D object ship as one phase (15).** The slide-deck homepage and the lazy R3F 3D hero are the centerpiece and the highest-risk work; the deck controller depends on the object's per-slide entrance, so they ship together rather than split. The object is lazy-loaded off the LCP path with a no-WebGL / reduced-motion fallback to protect the perf budget.
- **Interior pages are a vertical slice (16)** wired directly to the EXISTING Notion loaders (IN-01/IN-02 verified here as content flows through), including the two new pages /uses and /watching.
- **SEO extension + infra-preservation verification (17)** is its own checkpoint after pages exist, since `/uses` and `/watching` must be added to sitemap/feed/JSON-LD and Umami must be confirmed on every new route.
- **QA + perf gate + alias swap (18)** follows the v2.0 Phase 13 pattern: GO/NO-GO doc is the authoritative artifact, PSI mobile is authoritative for perf, `vercel build --prod` is the readiness gate, and the production alias is promoted at parity. Never `--prebuilt --prod`; watch for alias drift post-promotion.
- **Granularity: standard (5 phases).** Derived from the natural build order (foundation → centerpiece → pages → infra/SEO → ship), not padded.

### v2.0 Roadmap Decisions (carried context)

- Phase ordering: deletions before tokens (reversible, unblocks visual work).
- GO/NO-GO doc is the authoritative QA artifact (v1.0 retro lesson).
- PSI authoritative for mobile, not local Lighthouse (±15pt local variance).
- `vercel build --prod` is the production-readiness gate.

### v1.0 Carryforward (still active context)

- Next.js 16.2.1; provider hierarchy ThemeProvider > LenisProvider > MotionProvider
- Image proxy route over build-time download for Notion images
- notion.dataSources.query (v5 API); databases.query deprecated in v5
- Direct block rendering instead of markdown conversion
- ISR revalidation at 30 minutes
- GSAP ticker drives Lenis — prevents ScrollTrigger desync
- MotionConfig reducedMotion='user' at provider level
- Production domain montysinger.com (Namecheap registrar/DNS), NOT msizzle.com
- Umami at https://analytics.montysinger.com (Neon Postgres, Namecheap CNAME)
- Site copy rules: no em dashes, no location, "Georgetown University" only, sole professional identity Founder of Prometheus
- nextjs16: Image priority does not auto-emit fetchPriority — set fetchPriority="high" explicitly for LCP
- Vercel prod deploy: never `--prebuilt --prod`; watch alias drift after `vercel deploy --prod`

### Pending Todos

None tracked for v3.0 yet.

### Blockers/Concerns

None yet. Highest-risk item to watch: the 3D hero object's effect on LCP/PSI (Phase 15 lazy-load + fallback strategy; gated in Phase 18).

## Deferred Items

Items acknowledged and deferred at v2.0 milestone close on 2026-05-21:

| Category | Item | Status |
|----------|------|--------|
| uat | 08/08-HUMAN-UAT.md | pending_human |
| uat | 09/09-HUMAN-UAT.md | pending_human |
| uat | 10/10-HUMAN-UAT.md | pending_human |
| verification | 08/08-VERIFICATION.md | human_needed |
| verification | 09/09-VERIFICATION.md | human_needed |
| verification | 10/10-VERIFICATION.md | human_needed |
| quick_task | 260409-js5-restyle-visit-survey-from-modal-to-chat- | missing |
| quick_task | 260409-lle-add-notion-powered-events-feature-with-e | missing |
| quick_task | 260417-2h5-move-carousel-above-hero-text-stretch-fu | missing |
| quick_task | 260417-3fn-shrink-works-logos-remove-boxes-make-log | missing |

Close-out rationale: v2.0 shipped via Phase 13 GO sign-off. These items predate Phase 13 and were non-blocking per operator decision. Carried forward as tech debt.

## Session Continuity

Last session: 2026-06-19T00:00:08.383Z
Stopped at: Phase 14 context gathered
Resume file: None

---

*State initialized: 2026-03-31*
*v1.0 closed: 2026-04-16 (GO per Phase 6) · bookkeeping reconciled 2026-05-20*
*v2.0 shipped: 2026-05-21 (GO per Phase 13)*
*v3.0 roadmap drafted: 2026-06-18*
</content>
