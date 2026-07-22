---
gsd_state_version: 1.0
milestone: v4.0
milestone_name: Mono Restyle
status: All 6 plans executed. All 3 human UAT items judged PASS by Monty on 2026-07-22
stopped_at: Phase 22 context gathered
last_updated: "2026-07-22T03:45:48.674Z"
last_activity: 2026-07-22
progress:
  total_phases: 6
  completed_phases: 2
  total_plans: 11
  completed_plans: 11
  percent: 33
---

# Project State

## Project Reference

See: .planning/PROJECT.md (updated 2026-07-20)

**Core value:** A personal site that feels alive and memorable, *and* legible — not another template blog.
**Current focus:** Phase 22 (Things I Love in Mono)

## Current Position

Phase: 21 (mono-homepage-rebuild) — COMPLETE
Plan: 6 of 6 (all 6 plans executed and summarized)
Status: All 6 plans executed. All 3 human UAT items judged PASS by Monty on 2026-07-22
against `npm run dev`. `21-HUMAN-UAT.md` is complete. Phase 21 is CLOSED.
Last activity: 2026-07-22 - Completed quick task 260722-wov: Homepage nav reveal, writing split, contact hover, hero copy

Progress: [███░░░░░░░] 33% (2/6 v4.0 phases complete)

## v4.0 Phase Status

| Phase | Status | Started | Completed |
|-------|--------|---------|-----------|
| 20 — Mono Token Foundation | complete | 2026-07-21 | 2026-07-21 |
| 21 — Mono Homepage Rebuild | complete | 2026-07-21 | 2026-07-21 |
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

Next action: `/gsd-plan-phase 22` (Things I Love in Mono). Phase 21 verification is closed,
so nothing blocks it.

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

- **Phase 21 (mono-homepage-rebuild) closed 2026-07-21, 6/6 plans.** Homepage rebuilt to sketch 015
  variant E: type-only hero, Swiss numbered Building index (`.a-row` family), terminal-format
  Writing log (`.e-term`/`.e-post` family), one continuous `#ffffff` ground (every dark-band
  component and the last subscribe-CTA surface deleted — HP-05), and motion stripped to a single
  retuned `.reveal` opacity fade-up (700ms, 14px, `cubic-bezier(0.22, 0.61, 0.36, 1)`, threshold
  0.05, rootMargin -8%) — every other ambient motion source (ken-burns, breathe, marquee slide,
  pulsing status dot, band-dark slam) removed. `npx vitest run` = 191 passed, 16 todo, 1 failed
  (the pre-existing `projects.test.tsx:188` failure, unrelated). `npx next build` clean.

- **Quick task 260722-wov (2026-07-22) intentionally amends Phase 21's closed MS-02 requirement**
  by reintroducing a second ambient motion source: the StickyNav wave-curl reveal (a `perspective`
  + `rotateX` hinge-fold with a back-ease overshoot, gated by `prefers-reduced-motion` exactly like
  the surviving `.reveal` fade). MS-02's own subject -- the homepage's single `.reveal`
  opacity-fade-up -- remains completely unchanged; this is an addition of a second, separate,
  Monty-approved motion source, not a reversal of the fade-up work itself.

- **Plan 21-06's Task 2 human-verify checkpoint was auto-approved under AUTO_MODE, not by a real
  browser walkthrough.** No Playwright/Puppeteer or other browser-automation tooling is installed
  in this repo, so the three genuinely manual-only claims from `21-VALIDATION.md` — fade timing
  reads as deliberate (not slow-loading), the Building/Writing/hero rows genuinely collapse (not
  just fit) at 375px, and the finished page reads as an intentional mono system versus unstyled —
  remained unverified by a human eye at execution time. **Gap closed 2026-07-22:** Monty walked all
  three checks against `npm run dev` on localhost:3000 and judged each a pass. `21-HUMAN-UAT.md` is
  now `status: complete`, 3/3 passed. No Phase 25 carryforward needed for these items.

### Open Risks

- **DM-02 is the hardest requirement in the milestone.** The site uses inversion (black block on
  white) as its entire emphasis/hover language, so on a dark ground a "black block" hover has
  nothing to invert against. Phase 24 must resolve this by design, not defer it.

- **Sketch 015's own stated main risk:** does mono read as *cooler* or as *unfinished*? Vermilion
  was doing real structural work; watch whether hairlines and mono labels carry that load.
  **Resolved 2026-07-22:** Monty judged the built homepage as reading intentional, not unfinished.
  Re-check per-page as Phases 22-24 extend mono past the homepage.

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

### Quick Tasks Completed

| # | Description | Date | Commit | Directory |
|---|-------------|------|--------|-----------|
| 260722-wov | Homepage nav reveal, writing split, contact hover, hero copy | 2026-07-22 | c4ba222 | [260722-wov-homepage-nav-reveal-writing-split-contac](./quick/260722-wov-homepage-nav-reveal-writing-split-contac/) |

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

- **Post-execution design revisions (2026-07-21, same session as execution).** Monty reviewed the
  built page in a browser and directed several changes; all are committed and pushed on `v4-mono`
  (`c73d34a`, `e0762dd`, `33cf7fe`, `72c455c`, `4ac3ca7`). Real bugs found and fixed, each verified
  by measurement in a live browser rather than by inspection:

  - **`.wrap` used the `padding` shorthand**, zeroing top/bottom padding on every element
    co-classed with it. The hero's `py-32` and `.a-sec`'s 128px both computed to **0px** — the whole
    page had no vertical rhythm. It was also declared twice, the later copy overriding `.a-sec`.
    Now `padding-inline`, single definition. `--space-32` was never defined anywhere; replaced with
    explicit fluid values. **Any future co-classed utility must not use the padding shorthand.**

  - **Row hover-invert never worked.** `.a-row::before`/`.e-post::before` used `z-index: -1` but the
    rows established no stacking context, so the black fill painted behind the opaque
    `.min-h-screen` background. Fixed with `isolation: isolate`.

  - **Pinboard cards crossed into the footer** (measured 5 of 24, up to 40px). Cause was a
    same-session fix: moving `.pinboard-field` below the toolbar shrank it 88px while `layoutFor`
    still positioned against full board height. Board now sizes as toolbar + field + tilt slack
    (`TOOLS_H`/`TILT_SLACK` in `pinboard.tsx` must stay in sync with `--pb-tools-h`/`--pb-tilt-slack`
    in `globals.css`). Re-measured 0 of 24.

  - **Mobile could pan sideways**: `overflow-x: hidden` was on `body` but not `html` (the root is the
    scroll container). Set on both, plus `overscroll-behavior-x: none`.

  - Layout/copy: static `EditorialHeader` suppressed on `/` only so the first screen is type alone
    (StickyNav still slides down past the hero); StickyNav is now desktop-only; Building index capped
    at 3 rows with an "all projects" link; Writing rows 35px→67px; 256px between Writing and Loves.
    New H1 "Blessed are those who create order from chaos." and new subtitle.

  - **Hero brand marks in drop-boxes.** "Building Prometheus" / "Monty Monthly" sit in hard-cornered
    boxes; hover or `:focus-within` releases the mark, which links out. Reduced-motion disables the
    reveal outright. Assets: `public/logos/prometheus-orb.svg` (vector; the old 71px
    `logos/prometheus.png` is cropped on its right edge) and `public/logos/monty-monthly.png`
    (vendored from the Substack feed, not hotlinked).

- **COLOR CARVE-OUT (approved by Monty 2026-07-21):** the two hero brand marks render in real brand
  colors — a deliberate exception to the v4 zero-accent lock. The Prometheus orb is the only hue on
  the homepage. Recorded in ROADMAP.md under Phase 23 so the "neutralize every hue" sweep does not
  strip them. Logos are not photography, so Phase 23 criterion 4 does not apply either.

- **Reading time is now real, and the suite is fully green.** Blog posts use actual Notion page
  blocks via `getReadingTimes()` (bounded to the 5 posts the log can show); Monty Monthly issues use
  the full body in the feed's `content:encoded`. Both fall back to the old description estimate on
  failure. Live values 5/4/4/2/5 min (was a uniform "1 min"). Separately, the long-standing
  `projects.test.tsx:188` failure was **not** a bad test — Phase 19 decided projects never use cover
  images as card faces, but `/building/page.tsx` still passed `coverSrc`. Removing it turned
  `/building` card faces into typographic title-cards as intended. `npx vitest run` = **198 passed,
  0 failed**; `npx next build` exit 0.

- **Turbopack HMR was unreliable all session.** Edits to client components and inline styles
  repeatedly failed to reach the browser, once surfacing as a hydration mismatch (server 836px vs
  stale client 720px). `rm -rf .next/dev && npm run dev` was needed ~4 times. If a change appears not
  to apply, restart the dev server before debugging the code.

## Session Continuity

Last session: 2026-07-22T03:45:48.662Z
Stopped at: Phase 22 context gathered
and pushed. Phases 22-25 (pinboard, site sweep + OG, dark mode, QA/perf/alias) are still open,
so production now serves a mono homepage against not-yet-swept inner pages.
Resume file: .planning/phases/22-things-i-love-in-mono/22-CONTEXT.md

---

*State initialized: 2026-03-31*
*v1.0 closed: 2026-04-16 (GO per Phase 6) · bookkeeping reconciled 2026-05-20*
*v2.0 shipped: 2026-05-21 (GO per Phase 13)*
*v3.0 closed: 2026-07-20 (Phase 18 at 4/7, remainder folded into v4.0)*
*v4.0 roadmap drafted: 2026-07-20*
