---
gsd_state_version: 1.0
milestone: v3.0
milestone_name: Dark Brutalist Rebuild
status: executing
stopped_at: Phase 17.2 UI-SPEC approved
last_updated: "2026-07-06T06:46:07.915Z"
last_activity: 2026-07-06 -- Completed quick task 260706-lm3: replaced proud copy with past-projects phrasing
progress:
  total_phases: 10
  completed_phases: 8
  total_plans: 48
  completed_plans: 43
  percent: 80
---

# Project State

## Project Reference

See: .planning/PROJECT.md (updated 2026-06-18)

**Core value:** A personal site that feels alive and memorable, *and* legible — not another template blog.
**Current focus:** Phase 19 — project-cards-covers-redesign

## Current Position

Phase: 19 (project-cards-covers-redesign) — EXECUTING
Plan: 1 of 3
Status: Executing Phase 19
Last activity: 2026-07-06 -- Completed quick task 260706-lm3: replaced proud copy with past-projects phrasing

Direction: locked photo-forward restyle from sketch 010 (`.planning/sketches/010-structured-bands-carousel/`) — Hanken Grotesk 800 + Vermilion `#e5411f` marker hero, alternating light/dark bands, hard corners, rail boxes, slide-in photos, Monty Monthly carousel, sticky Subscribe nav, credibility strip, rich footer. Supersedes the 17.1 text-forward skin; preserves who→what→engage velvet-rope IA. Motion scroll/ambient-only (IO + CSS + scroll-snap), no WebGL/Lenis. See memory `v3-homepage-photo-forward-lock` + `17.4-CONTEXT.md`. Phase 18 (QA/perf/alias) parked until this lands.

Prior focus (parked): Phase 18 v3.0 ship gate — 4 of 7 plans done (18-01/02/03/05); 18-04/06/07 remain, re-run after 17.4.

## v3.0 Phase Status

| Phase | Status | Started | Completed |
|-------|--------|---------|-----------|
| 14 — Branch & Crimson Poster Foundation | complete | 2026-06-18 | 2026-06-18 |
| 15 — WebGL Explorative Homepage (deck superseded) | re-planning | 2026-06-18 | — |
| 16 — Interior Pages on Notion Data | not_started | — | — |
| 17 — Infrastructure Preservation & SEO Extension | not_started | — | — |
| 18 — v3.0 QA, Perf Gate & Alias Swap | not_started | — | — |

v1.0 (Phases 1-7) and v2.0 (Phases 8-13) shipped — see `milestones/v1.0-ROADMAP.md` and `milestones/v2.0-ROADMAP.md`.

## Active Work

v3.0 presentation-layer rebuild on the existing Next.js 16 / React 19 / Tailwind v4 / Notion stack — infra preserved.

**Phase 15 pivot (2026-06-18):** The Slide-Deck Homepage (CHOMP wheel deck + Crimson Poster palette) was built (15-01..15-05 committed on `v3`) and paused at the 15-06 human checkpoint, then **superseded**. Red-on-red hurt legibility and the discrete deck didn't match the desired "wandering" feel. New direction — an expansive **WebGL explorative scroll-story** (near-black/off-white/crimson-accent; 3D hero, fluid line, themed beats; Lusion-grade) — validated via sketches 003–005 (`.planning/sketches/`) and de-risked by perf spike 001 (`.planning/spikes/`, GO-WITH-CUTS). Phase 15 was re-scoped in place (keeps the homepage slot; avoids renumbering 16–18); deck plan artifacts archived under `.planning/phases/15-slide-deck-homepage-3d-hero/superseded-deck/`. Reusable carry-forward: HeroBlob, HeroBlobCanvas, FallbackPoster, WebGL2 detection, section content, v3 tokens. Experimental spike code on throwaway branch `spike/webgl-perf` (unmerged). See memory homepage-webgl-direction + nextjs16-dynamic-ssr-false.

Phase 15 context captured 2026-06-19 (`15-CONTEXT.md`): v1 = WebGL hero (procedural stand-in) + scroll-cue + section beats + fallback poster; fluid line = v2; YouTube zoom-through = v3; real GLB models swap in later; assets = parallel/non-blocking. v1-area decisions are recommended defaults (REC) to confirm at plan time.

Next action: `/gsd-plan-phase 15` to decompose the WebGL homepage v1 into plans (reads `15-CONTEXT.md`, sketches 003–005, spike 001). Parallel: kick off the asset workstream (voxel-Monty + horse GLB).

## Accumulated Context

### Roadmap Evolution

- Phase 17.1 inserted after Phase 17: Homepage Rebuild — personal-brand arc, current aesthetic, replaces WebGL blob
- Phase 17.2 inserted after Phase 17: Site Information Architecture — nav/cuts/folds/merges for new scope
- Phase 17.3 inserted after Phase 17: Portfolio — proud-of past work on projects pipeline
- Phase 17.4 inserted after Phase 17.3 (2026-07-04): Photo-Forward Homepage Restyle — sketch-010 lock (Hanken 800 + Vermilion) supersedes the 17.1 text-forward skin; Phase 18 now depends on 17.4
- Phase 19 added (2026-07-06): Project Cards & Covers Redesign — typographic title-card covers, card titles/deks, offset-shadow grids, reading time on /writing, on-brand OG images. From the 2026-07-05 live-site audit; supersedes 17.3's /portfolio surface (route deleted + redirected in quick 260706-gbu)

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

- 2026-07-06 — Redesign Things I Love section as treasure-hunt collage (YouTube videos, books, discoverable collage background; sketch pass first). `.planning/todos/pending/2026-07-06-things-i-love-treasure-hunt-collage.md`

### Blockers/Concerns

None yet. Highest-risk item to watch: the 3D hero object's effect on LCP/PSI (Phase 15 lazy-load + fallback strategy; gated in Phase 18).

### Quick Tasks Completed

| # | Description | Date | Commit | Directory |
|---|-------------|------|--------|-----------|
| 260620-q14 | Repaint /photos page to v3 Pumpkin Amber system | 2026-06-20 | 5101b5e | [260620-q14-repaint-photos-page-to-v3-pumpkin-amber-](./quick/260620-q14-repaint-photos-page-to-v3-pumpkin-amber-/) |
| 260706-gbu | Site-wide polish pass: 10 quick fixes from live-site audit (titles, TODO leak, email, nav parity, /portfolio redirect, dead code, fake fallback, survey) | 2026-07-06 | d95933d | [260706-gbu-site-wide-polish-pass-quick-fixes-from-l](./quick/260706-gbu-site-wide-polish-pass-quick-fixes-from-l/) |
| 260706-hai | Remove em dashes from all user-visible copy (9 strings across about, projects, uses, photos) | 2026-07-06 | a832ddd | [260706-hai-remove-em-dashes-from-all-user-visible-s](./quick/260706-hai-remove-em-dashes-from-all-user-visible-s/) |
| 260706-lm3 | Replace cringy proud copy on homepage with plainer past-projects copy | 2026-07-06 | de9ffb7 | [260706-lm3-replace-cringy-proud-copy-on-homepage-wi](./quick/260706-lm3-replace-cringy-proud-copy-on-homepage-wi/) |
| 260706-fast | Hero subtitle rewritten to user-dictated copy; loves heading shortened to "Things I love outside of work." | 2026-07-06 | e126174 | (inline /gsd-fast, no directory) |
| 260706-fast2 | Sticky nav restyled to match editorial header (paper field, "Monty Singer" wordmark, muted links; Subscribe CTA kept) | 2026-07-06 | 341c2d9 | (inline /gsd-fast, no directory) |

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

Last session: 2026-07-03T03:38:11.126Z
Stopped at: Phase 17.2 UI-SPEC approved
Resume file: None

---

*State initialized: 2026-03-31*
*v1.0 closed: 2026-04-16 (GO per Phase 6) · bookkeeping reconciled 2026-05-20*
*v2.0 shipped: 2026-05-21 (GO per Phase 13)*
*v3.0 roadmap drafted: 2026-06-18*
</content>
