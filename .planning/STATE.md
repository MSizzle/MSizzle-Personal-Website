---
gsd_state_version: 1.0
milestone: v3.0
milestone_name: Dark Brutalist Rebuild
status: executing
stopped_at: Phase 16 UI-SPEC approved
last_updated: "2026-06-20T04:13:29.916Z"
last_activity: 2026-06-20
progress:
  total_phases: 5
  completed_phases: 2
  total_plans: 18
  completed_plans: 14
  percent: 40
---

# Project State

## Project Reference

See: .planning/PROJECT.md (updated 2026-06-18)

**Core value:** A personal site that feels alive and memorable, *and* legible — not another template blog.
**Current focus:** Phase 16 — interior-pages-on-notion-data

## Current Position

Phase: 16 (interior-pages-on-notion-data) — EXECUTING
Plan: 6 of 9
Status: Ready to execute
Last activity: 2026-06-20

Direction: validated via sketches 003–005 + perf spike 001 (GO-WITH-CUTS). Build cuts: desktop-WebGL / mobile-poster, defer canvas past LCP, GPU vertex-shader morph.

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

Last session: 2026-06-20T04:13:29.911Z
Stopped at: Phase 16 UI-SPEC approved
Resume file: None

---

*State initialized: 2026-03-31*
*v1.0 closed: 2026-04-16 (GO per Phase 6) · bookkeeping reconciled 2026-05-20*
*v2.0 shipped: 2026-05-21 (GO per Phase 13)*
*v3.0 roadmap drafted: 2026-06-18*
</content>
