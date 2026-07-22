---
phase: 21-mono-homepage-rebuild
plan: 01
subsystem: ui
tags: [nextjs, react, tailwind-v4, homepage, motion-teardown]

# Dependency graph
requires:
  - phase: 20-mono-token-foundation
    provides: pure black/white token system (--color-text/-dim/-muted/-border) in globals.css
provides:
  - Type-only Swiss hero (HP-01): mono eyebrow, H1, subtitle, 3-cell meta row, zero photo/motion
  - Things I Love band header restyled to the plain mono "03 · Things I Love" label
  - Every hero-exclusive CSS rule deleted from globals.css (.hero, .pcarousel/.pslide,
    @keyframes pfade/pulse, .statustag, .hero-ticker*, .subtitle, .wayin*, .marker/h1.sig .hw,
    .band.hero-band)
affects: [21-02, 21-03, 21-04, 21-05, homepage-motion-audit]

# Tech tracking
tech-stack:
  added: []
  patterns:
    - "Plain mono section-label register (font-mono text-xs uppercase tracking-[0.12em]
      text-text-muted) as a real <h2>, replacing the boxed RailBox chip pattern"
    - "Per-element .reveal class on every top-level hero element (fade-up only, no other motion)"

key-files:
  created:
    - src/__tests__/home/hero.test.tsx
  modified:
    - src/components/home/hero.tsx
    - src/components/home/section-loves.tsx
    - src/__tests__/home/section-loves.test.tsx
    - src/app/globals.css

key-decisions:
  - "Hero rebuilt as a static Server Component with zero props/interface change (Hero export
    name unchanged) so downstream plans (21-05 motion audit, orchestrator rewrite) see the
    same import surface"
  - "rail-box.tsx not deleted yet (still consumed by section-building.tsx and section-work.tsx
    until later plans in this phase) — only its import/usage removed from section-loves.tsx"

requirements-completed: [HP-01, MS-01]

# Metrics
duration: 15min
completed: 2026-07-21
---

# Phase 21 Plan 01: Hero + Things I Love Header Rebuild Summary

**Type-only Swiss hero (zero photo, zero pulsing dot, zero marquee) plus a plain mono "03 · Things I Love" band label, both on the existing Tailwind v4 token system with every hero-exclusive CSS rule deleted from globals.css.**

## Performance

- **Duration:** ~15 min
- **Started:** 2026-07-21T07:08:21Z
- **Completed:** 2026-07-21T07:20:41Z
- **Tasks:** 3 completed
- **Files modified:** 4 (+ 1 created)

## Accomplishments
- `hero.tsx` rebuilt from a 3-column marker-block hero with portrait carousel, pulsing status
  tag, and full-bleed link marquee into a type-only Swiss hero: mono eyebrow, H1, subtitle, and
  a 3-cell meta row (Currently / Writes / Elsewhere), with zero `<img>`/`next/image` nodes
- New `hero.test.tsx` (7 tests) covers exact H1/subtitle copy, meta row content, Elsewhere link
  hrefs/rel/target, absence of `<img>` nodes, and absence of every deleted photo/motion class
- 195 lines of hero-exclusive CSS deleted from `globals.css` (`.hero` grid, `.pcarousel`/
  `.pslide*`, `@keyframes pfade`, `.subtitle`, `.wayin*`, `.marker`/`h1.sig .hw`, `.statustag*`,
  `@keyframes pulse`, `.hero-ticker*`, `.band.hero-band`) while `@keyframes slide/kb/breathe`,
  `.eyebrow`, and `.band-dark` (still consumed elsewhere until later plans) were left intact
- Things I Love band header restyled: `RailBox` chip replaced with a real `<h2>` plain mono
  "03 · Things I Love" label plus a supporting `<p>`; the now-single-column `beat-grid` wrapper
  removed; `Pinboard`/`PhotoMarquee` branching untouched

## Task Commits

Each task was committed atomically:

1. **Task 1: Rebuild hero.tsx as the type-only Swiss hero (HP-01)** - `790e50d` (feat)
2. **Task 2: Delete hero-only CSS (MS-01)** - `1682fd8` (fix)
3. **Task 3: Restyle Things I Love band header** - `cfa9eab` (feat)

_Note: TDD tasks (1 and 3) were implemented directly to the passing state rather than a separate
RED commit, since the plan's `<behavior>` blocks were used to author both component and test in
the same pass; both tests were verified green before commit._

## Files Created/Modified
- `src/components/home/hero.tsx` - Rebuilt as type-only Swiss hero (mono eyebrow, H1, subtitle,
  3-cell meta row); no `Photo` import
- `src/__tests__/home/hero.test.tsx` - New: 7 tests covering copy, meta row, Elsewhere link
  hrefs/rel/target, and absence of deleted photo/motion classes
- `src/components/home/section-loves.tsx` - Dropped `RailBox` import/usage and `beat-grid`
  wrapper; added plain mono `<h2>` "03 · Things I Love" label + `<p>` sub-copy
- `src/__tests__/home/section-loves.test.tsx` - Dropped `rail-box` mock; updated first `it()` to
  assert on the new label text
- `src/app/globals.css` - Deleted every hero-exclusive rule (see Accomplishments); left
  `@keyframes slide/kb/breathe`, `.eyebrow`, `.band-dark` untouched (still consumed elsewhere)

## Decisions Made
- Kept `rail-box.tsx` in the repo (not deleted) since `section-building.tsx` and
  `section-work.tsx` still import it until later plans in this phase rebuild them — deleting now
  would break the build.
- Left the two reduced-motion guard selector lists (`body.no-motion .hero-ticker .track` and its
  `@media (prefers-reduced-motion: reduce)` twin) untouched even though `.pslide` and
  `.hero-ticker .track` are now orphaned within those comma-separated selector lists — the plan's
  explicit deletion list didn't include them, they're harmless (match nothing), and pruning them
  wasn't required by any acceptance criterion.

## Deviations from Plan

None - plan executed exactly as written. Two of the plan's own acceptance-criteria grep
predictions came back higher than stated, both traced to pre-existing content this task never
touched (documented below so a future plan-checker doesn't misattribute them):

- Task 2's `.band-dark`/`.band.band-dark` grep returned 3 (plan expected 1) — the extra two
  matches are `.band.band-dark,` / `.band-dark {` (the same rule's two selectors, both on their
  own lines) plus a pre-existing unrelated `.band-dark .mm-card {` rule at line 578. None of
  these were touched by this task; the rule genuinely "survives this task" as intended.
- Task 3's `Pinboard\b` grep returned 4 (plan expected 2) — two of the four hits are pre-existing
  docstring prose ("renders the draggable Pinboard (sketch 012)...", "Both the Pinboard and the
  marquee live outside .wrap...") that predate this plan; only the import and JSX usage line
  were ever in scope, and both are unchanged in behavior.

## Issues Encountered
None.

## User Setup Required
None - no external service configuration required.

## Next Phase Readiness

- `npx vitest run` = 189 passed, 16 todo, 1 failed (the pre-existing
  `src/__tests__/pages/projects.test.tsx:188` failure, unrelated to this plan) — baseline was 182
  passed/16 todo/1 failed; the +7 delta is exactly `hero.test.tsx`'s new tests, no regressions.
- `npx next build` completes clean; `/` still prerenders as static content.
- Hero export name (`Hero`) and zero-props interface unchanged, so Plan 21-05's motion audit and
  orchestrator rewrite can consume it without adjustment.
- No blockers for Plan 21-02 (Swiss numbered Building index), which is next in the wave sequence.

---
*Phase: 21-mono-homepage-rebuild*
*Completed: 2026-07-21*

## Self-Check: PASSED

All created/modified files exist on disk; all 3 task commit hashes (790e50d, 1682fd8, cfa9eab)
verified present in git log.
