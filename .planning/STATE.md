---
gsd_state_version: 1.0
milestone: v4.0
milestone_name: Mono Restyle
status: executing
stopped_at: Completed 21-01-PLAN.md
last_updated: "2026-07-21T07:24:23.958Z"
last_activity: 2026-07-21
progress:
  total_phases: 6
  completed_phases: 1
  total_plans: 11
  completed_plans: 6
  percent: 17
---

# Project State

## Project Reference

See: .planning/PROJECT.md (updated 2026-07-20)

**Core value:** A personal site that feels alive and memorable, *and* legible — not another template blog.
**Current focus:** Phase 21 — mono-homepage-rebuild

## Current Position

Phase: 21 (mono-homepage-rebuild) — EXECUTING
Plan: 2 of 6
Status: Ready to execute
Last activity: 2026-07-21

Progress: [██████░░░░] 55%

## v4.0 Phase Status

| Phase | Status | Started | Completed |
|-------|--------|---------|-----------|
| 20 — Mono Token Foundation | complete | 2026-07-21 | 2026-07-21 |
| 21 — Mono Homepage Rebuild | not_started | — | — |
| 22 — Things I Love in Mono | not_started | — | — |
| 23 — Site Sweep & Mono OG | not_started | — | — |
| 24 — True Inversion Dark Mode | not_started | — | — |
| 25 — v4.0 QA, Perf Gate & Alias Swap | not_started | — | — |

v1.0 (Phases 1-7), v2.0 (Phases 8-13), and v3.0 (Phases 14-19) are closed — see `milestones/v1.0-ROADMAP.md`, `milestones/v2.0-ROADMAP.md`, and the Completed Phases table in `ROADMAP.md`.

## Active Work

v4.0 is a **restyle of a live, working site**, not new feature work. Design is fully locked by
`.planning/sketches/015-mono-passive-home/` variant E. No exploration phases.

Trigger: the shipped photo-forward homepage read as a founder pitch ("I'm not in photos smiling,
this is just a bit about me") and the Vermilion/clay palette was rejected outright. The lock:
pure black/white with **zero accent**, type-only hero, motion stripped to a single slow fade,
terminal-format writing list, Things I Love pinboard kept but recolored.

Next action: `/gsd-plan-phase 20` to decompose the mono token foundation.

## Accumulated Context

### v4.0 Roadmap Decisions

- **Tokens land first (Phase 20).** The palette is entirely token-driven in `src/app/globals.css`
  (lines 8-32), so the retheme is cheap and most of the 17 `accent`-referencing files under `src/`
  follow for free. Everything else in the milestone builds on the mono system existing.

- **Known hardcoded survivals are scheduled explicitly**, because a token edit will not catch them:
  `globals.css:618` (`#e5411f`), `globals.css:122` (`--hero-bg` cream `#f4ecdd`),
  `globals.css:673` (`.emoji-badge--cream`), `globals.css:1293` (`.pb-frame--cream`) — all Phase 20;
  the three `opengraph-image.tsx` routes (root, `blog/[slug]`, `building/[slug]`) — Phase 23.

- **The branch + preview (DQ-01) lives in Phase 20**, not a separate ops phase — same pattern as
  v3.0's Phase 14.

- **Homepage and pinboard are separate phases (21, 22).** TL-01 is a *preservation* requirement:
  `src/components/home/pinboard.tsx` (749 lines) must keep its behaviour exactly, palette only.
  Splitting it out keeps the homepage rebuild from accidentally rewriting it.

- **Dark mode is its own phase (24) and comes late.** It is genuinely new scope — `next-themes` is
  NOT a current dependency and there is no theme toggle anywhere in `src/`. It is sequenced after
  the mono system exists because inversion needs something to invert.

- **Ship phase (25) carries v3.0 Phase 18's remainder.** That QA was never run against a design
  about to be replaced, so DQ-01..DQ-05 re-run it against v4.0.

- **Granularity: standard (6 phases).** Derived from the natural order — tokens → homepage →
  pinboard → sweep → dark mode → ship.

- **Phase 20 closed 2026-07-21 with Monty's DQ-01/D-15 approval.** The `v4-mono` branch preview
  renders the pure mono token system while `montysinger.com` still serves v3 unchanged, verified
  in the same session. `v4-mono` is pushed to origin and is the base branch for Phases 21-25.

- **Phase 20's full-repo D-03 audit (20-05) found 9 additional MO-01 hue survivals** beyond the
  named vermilion/cream hex list — `.band-dark` local token overrides, `.photo`/`.photo.dark`
  placeholder fills, `.hero-ticker`, `.hero-band--ink`, `.band-dark .mm-card`, and three pinboard
  media/text sites — all using different near-black/off-white byte values than
  `e5411f`/`c8381a`/`a52d13`/`f4ecdd`/`faf9f7`. Fixed to pure mono tokens in commit `a414faa`. Any
  future accent/color audit should sweep for *any* non-pure hex/rgba, not just a fixed named list.

- **SCOPE BOUNDARY for Phase 21 (recorded per Monty's request):** the `v4-mono` preview's page
  LAYOUT (hero photo carousel, marquee, pulsing status dot, alternating band structure) still
  matches v3 exactly — this is expected, not a Phase 20 defect. Phase 20 was scoped to the color
  token system only and was explicitly forbidden from touching `src/components/home/`. Sketch 015
  variant E is a layout direction (type-only hero, Swiss numbered Building index, terminal writing
  log, one continuous ground, motion stripped to one slow fade) that Phase 21 has not yet built.
  Monty's first reaction to the preview ("this is not the E version I had previously approved")
  was accurate about the layout and is not a Phase 20 regression — his approval was for the
  color-token deliverable Phase 20 actually promised (MO-01/02/03/05, DQ-01).

### Open Risks

- **DM-02 is the hardest requirement in the milestone.** The site uses inversion (black block on
  white) as its entire emphasis/hover language, so on a dark ground a "black block" hover has
  nothing to invert against. Phase 24 must resolve this by design, not defer it.

- **Sketch 015's own stated main risk:** does mono read as *cooler* or as *unfinished*? Vermilion
  was doing real structural work; watch whether hairlines and mono labels carry that load.

### Known Pre-Existing Test Failures (NOT v4.0 regressions)

**Corrected 2026-07-21 (20-05):** this section previously claimed three vitest failures
(`section-building` HD-04, `explorative-homepage` TD-03/HD-05). Those do not exist in the current
suite. The only actual pre-existing failure is
`src/__tests__/pages/projects.test.tsx:188` ("renders a title-card face instead of a cover image
when project.image is non-null (Phase 19)"), verified failing on `main` before Phase 20 began.
Confirmed unchanged across every Phase 20 plan (20-01 through 20-05): `npx vitest run` = 182
passed, 16 todo, 1 failed (this one). Do not attribute it to v4.0 work.

**Note for whoever plans Phase 21:** `ROADMAP.md`'s Phase 21 sequencing note (line 76) still
repeats the old three-failure claim this section just corrected. That line was intentionally left
untouched by 20-05 (only Phase 20's own plan-progress row was updated) and should be fixed when
Phase 21 is planned.

### v1.0-v3.0 Carryforward (still active context)

- Next.js 16 App Router / React 19 / Tailwind v4 / Notion `@notionhq/client` v5
- Notion pipeline, image proxy routes, SEO surface, and Umami analytics are **untouched** by v4.0
- Image proxy route over build-time download for Notion images; ISR revalidation at 30 minutes
- `notion.dataSources.query` (v5 API); `databases.query` deprecated in v5
- nextjs16: `dynamic({ssr:false})` must live in a `"use client"` loader or the build fails
- nextjs16: Image `priority` does not auto-emit `fetchPriority` — set `fetchPriority="high"` for LCP
- Production domain montysinger.com (Namecheap registrar/DNS)
- Umami at https://analytics.montysinger.com (Neon Postgres, Namecheap CNAME)
- Vercel prod deploy: **never `--prebuilt --prod`**; watch alias drift after `vercel deploy --prod`
- PSI mobile is authoritative for perf, not local Lighthouse (±15pt local variance)
- GO/NO-GO doc is the authoritative QA artifact (v1.0 retro lesson)
- Site copy rules: no em dashes, no location, "Georgetown University" only, sole professional
  identity is Founder of Prometheus

- Surviving from v3 design: Hanken Grotesk 800 display, hard corners (radius 0), no-gradients rule
- Current nav: Prometheus (external) / Building / Writing / Contact; `/about` deleted, `/uses`
  unlinked; Contact is the `/contact` route

### Roadmap Evolution

- Phases 17.1-17.4 inserted during v3.0 (homepage rebuild, IA, portfolio, photo-forward restyle)
- Phase 19 added 2026-07-06: Project Cards & Covers Redesign
- v3.0 closed 2026-07-20 with Phase 18 at 4/7; its QA remainder folded into v4.0 Phase 25
- v4.0 roadmap created 2026-07-20: Phases 20-25, 27 requirements, 100% coverage

### Blockers/Concerns

None blocking. Highest-risk item: DM-02 (inversion language on a dark ground) in Phase 24.

## Deferred Items

Carried from the v2.0 close on 2026-05-21 (tech debt, non-blocking):

| Category | Item | Status |
|----------|------|--------|
| uat | 08/08-HUMAN-UAT.md | pending_human |
| uat | 09/09-HUMAN-UAT.md | pending_human |
| uat | 10/10-HUMAN-UAT.md | pending_human |
| verification | 08/08-VERIFICATION.md | human_needed |
| verification | 09/09-VERIFICATION.md | human_needed |
| verification | 10/10-VERIFICATION.md | human_needed |

Deferred from v4.0 requirements (Future Requirements):

- Real photography direction for the pinboard cards (currently Notion page covers + YouTube thumbs)
- A real reading-time value from Notion for the terminal writing block, not a computed estimate

## Session Continuity

Last session: 2026-07-21T07:24:15.804Z
Stopped at: Completed 21-01-PLAN.md
Resume file: None

---

*State initialized: 2026-03-31*
*v1.0 closed: 2026-04-16 (GO per Phase 6) · bookkeeping reconciled 2026-05-20*
*v2.0 shipped: 2026-05-21 (GO per Phase 13)*
*v3.0 closed: 2026-07-20 (Phase 18 at 4/7, remainder folded into v4.0)*
*v4.0 roadmap drafted: 2026-07-20*
