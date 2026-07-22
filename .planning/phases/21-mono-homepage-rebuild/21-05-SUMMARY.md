---
phase: 21-mono-homepage-rebuild
plan: 05
subsystem: ui
tags: [nextjs, react, tailwind-v4, homepage, integration, motion-audit]

# Dependency graph
requires:
  - phase: 21-mono-homepage-rebuild
    plan: 01
    provides: Hero (type-only Swiss), Things I Love header restyle
  - phase: 21-mono-homepage-rebuild
    plan: 02
    provides: SectionBuilding (Swiss numbered index), .a-row CSS family
  - phase: 21-mono-homepage-rebuild
    plan: 03
    provides: SectionWriting (terminal log), .e-term/.e-post CSS family
  - phase: 21-mono-homepage-rebuild
    plan: 04
    provides: photo.tsx/photo-marquee.tsx with all ambient motion removed
provides:
  - Rebuilt explorative-homepage.tsx orchestrator: Hero -> Building -> Writing
    -> Things I Love on one continuous #ffffff ground, zero band-dark
  - page.tsx fetches getPublishedPosts() defensively and forwards posts
    alongside the three existing data arrays
  - Deletion of the entire pre-rebuild dark-band promotional surface:
    section-work.tsx, section-newsletter.tsx, monty-monthly-carousel.tsx,
    rail-box.tsx (and their dead CSS) — HP-05 subscribe-CTA removal
  - motion-audit.test.tsx: new mechanical MS-01/MS-02 gate rendering the
    real, unmocked homepage tree
affects: [21-06]

# Tech tracking
tech-stack:
  added: []
  patterns:
    - "Test-only window.matchMedia/IntersectionObserver polyfills scoped to a
      single real-tree-render test file (motion-audit.test.tsx), rather than
      a global setup.ts change, since this is the first test in the suite to
      mount a real (unmocked) ScrollReveals"

key-files:
  created:
    - src/__tests__/home/motion-audit.test.tsx
  modified:
    - src/app/page.tsx
    - src/components/home/explorative-homepage.tsx
    - src/app/globals.css
    - src/__tests__/home/explorative-homepage.test.tsx
  deleted:
    - src/components/home/section-work.tsx
    - src/components/home/section-newsletter.tsx
    - src/components/home/monty-monthly-carousel.tsx
    - src/components/home/rail-box.tsx
    - src/__tests__/home/section-work.test.tsx

key-decisions:
  - "Reworded explorative-homepage.tsx's doc comment from 'zero band-dark
    anywhere' to 'no dark-ground class anywhere' so the file's own
    documentation doesn't trip the mechanical grep-count acceptance
    criterion it's describing the absence of."
  - "Added local, test-file-scoped window.matchMedia and IntersectionObserver
    polyfills in motion-audit.test.tsx: this is the first test to render the
    real (unmocked) ScrollReveals island, and jsdom implements neither API.
    Scoped to this one file rather than global setup.ts since no other test
    needs it yet."

requirements-completed: [HP-02, HP-03, HP-04, HP-05]

# Metrics
duration: ~20min
completed: 2026-07-21
---

# Phase 21 Plan 05: Integration - Wire Bands + Delete Retired Components Summary

**Rebuilt the homepage orchestrator (Hero -> Building -> Writing -> Loves, one continuous #ffffff ground, zero band-dark) by wiring together every component from Plans 21-01 through 21-04, deleted the four components this phase retires, and added a new mechanical motion-audit test proving the real rendered tree is free of every MS-01/MS-02 motion class.**

## Performance

- **Duration:** ~20 min
- **Tasks:** 3 completed
- **Files modified:** 4, created 1, deleted 5

## Accomplishments

- `page.tsx`: added `getPublishedPosts()` as a fourth defensive fetch
  (`try {} catch {} -> []`, identical convention to the other three) and
  forwards `posts` as a new prop on `<ExplorativeHomepage>`.
- `explorative-homepage.tsx`: fully rebuilt. New band order — `StickyNav`,
  `ScrollReveals`, `Hero`, `SectionBuilding`, `SectionWriting`, then a
  `<section className="band" id="loves">` wrapping `SectionLoves` (the one
  element on the page that still needs an orchestrator-level wrapper, since
  it doesn't self-wrap like Building/Writing do). Zero `band-dark`
  anywhere; `id="loves"` preserved verbatim for the site-wide footer's
  `/#loves` fragment link.
- Deleted `section-work.tsx`, `section-newsletter.tsx`,
  `monty-monthly-carousel.tsx`, `rail-box.tsx`, and their dedicated test
  file `section-work.test.tsx` (HP-05 — retires the last promotional
  subscribe-CTA surface along with the dark-band structure it lived in).
- Pruned `globals.css` of every rule whose last consumer was one of the
  four deleted components: the `.band-dark` mechanism, `.eyebrow`,
  `section.beat`/`.beat-grid`/`.beat h2`, the `.rail-box` family,
  `.prometheus-shot .photo`, `.work-grid`, the entire `.mm-*` Monty
  Monthly carousel block (including `.band-dark .mm-card`), `.slide`/
  `.shadowed`, and the now-dead `.hero`/`.beat-grid`/`.work-grid`/
  `.prometheus-shot .photo` lines inside the 860px responsive override
  block (280 lines removed total).
- `explorative-homepage.test.tsx` fully rewritten: kept the StickyNav/
  ScrollReveals mount assertions, replaced the inverse `band-dark`-presence
  assertions with a whole-tree absence assertion
  (`querySelectorAll('[class*="band-dark"]').length === 0`), added
  presence assertions for `#loves`/`#building`/`#writing`, and added the
  HP-05 `queryByText(/subscribe/i)` absence assertion.
- New `motion-audit.test.tsx`: renders the real, fully unmocked
  `<ExplorativeHomepage />` tree (exercising `SectionLoves`'s real
  `PhotoMarquee` fallback -> real `Photo` components, since no `loves`
  items are passed) and asserts zero
  `.kenburns`/`.breathe`/`.slide`/`.shadowed`/`.hero-ticker`/`.statustag`
  classes anywhere in it.

## Task Commits

Each task was committed atomically:

1. **Task 1: Wire page.tsx + rebuild explorative-homepage.tsx (HP-04)** - `ef9933d` (feat)
2. **Task 2: Delete retired components + their dead CSS (HP-05)** - `1b1ea04` (feat)
3. **Task 3: Rewrite explorative-homepage.test.tsx + add motion-audit.test.tsx** - `f1823ab` (test)

## Files Created/Modified

- `src/app/page.tsx` - New `getPublishedPosts()` defensive fetch; forwards `posts` prop
- `src/components/home/explorative-homepage.tsx` - Fully rebuilt orchestrator: Hero -> Building -> Writing -> Loves, one ground
- `src/app/globals.css` - 280 lines of dead CSS removed (band-dark mechanism, eyebrow, beat/beat-grid, rail-box, work-grid, mm-*, slide/shadowed, dead responsive lines)
- `src/__tests__/home/explorative-homepage.test.tsx` - Fully rewritten to assert post-rebuild band structure
- `src/__tests__/home/motion-audit.test.tsx` - New: mechanical MS-01/MS-02 gate on the real rendered tree
- `src/components/home/section-work.tsx` - Deleted (retired promotional Work band)
- `src/components/home/section-newsletter.tsx` - Deleted (retired subscribe CTA)
- `src/components/home/monty-monthly-carousel.tsx` - Deleted (retired carousel)
- `src/components/home/rail-box.tsx` - Deleted (retired boxed-chip index pattern)
- `src/__tests__/home/section-work.test.tsx` - Deleted alongside its source file

## Decisions Made

- Reworded a doc comment in `explorative-homepage.tsx` from literally
  containing the string "band-dark" (describing its absence) to "dark-ground
  class" instead, so the file's own documentation prose doesn't trip the
  plan's own mechanical `grep -c "band-dark"` acceptance criterion.
- `motion-audit.test.tsx` needed local `window.matchMedia` and
  `IntersectionObserver` polyfills: it's the first test in the suite to
  mount the real, unmocked `ScrollReveals` island (every other homepage
  test mocks it), and jsdom implements neither browser API. Scoped the
  polyfills to this one test file (in a `beforeAll`) rather than editing the
  shared `setup.ts`, since no other test currently needs them and the plan
  didn't ask for a suite-wide environment change.

## Deviations from Plan

### Auto-fixed Issues

**1. [Rule 3 - Blocking issue] motion-audit.test.tsx crashed on mount: window.matchMedia is not a function**
- **Found during:** Task 3
- **Issue:** Rendering the real, unmocked `ExplorativeHomepage` tree (as the
  plan's `<behavior>` explicitly requires for this test) mounts the real
  `ScrollReveals` island, which calls `window.matchMedia(...)` in a
  `useEffect` to check `prefers-reduced-motion`. jsdom does not implement
  `matchMedia`, so the test crashed before any assertion ran.
- **Fix:** Added a minimal `window.matchMedia` polyfill (static
  `matches: false`, no-op listener methods) in a `beforeAll` scoped to this
  test file only.
- **Files modified:** `src/__tests__/home/motion-audit.test.tsx`
- **Commit:** `f1823ab`

**2. [Rule 3 - Blocking issue] motion-audit.test.tsx crashed on mount: IntersectionObserver is not defined**
- **Found during:** Task 3
- **Issue:** After fixing the `matchMedia` crash, the same real
  `ScrollReveals` effect immediately hit `new IntersectionObserver(...)`,
  which jsdom also does not implement.
- **Fix:** Added a minimal `IntersectionObserver` stub class (no-op
  `observe`/`unobserve`/`disconnect`) alongside the `matchMedia` polyfill in
  the same `beforeAll`.
- **Files modified:** `src/__tests__/home/motion-audit.test.tsx`
- **Commit:** `f1823ab`

Both fixes are test-environment-only (they never touch application code) and
were necessary to satisfy the plan's own explicit instruction not to mock
`ScrollReveals` (it isn't in the plan's do-not-mock list, but the plan's
"real, UNMOCKED children" framing for this test implies the whole tree,
which includes the two fixed-island mounts).

## Issues Encountered

None blocking beyond the two Rule 3 fixes above.

## User Setup Required

None - no external service configuration required.

## Next Phase Readiness

- `npx vitest run` = 191 passed, 16 todo, 1 failed — the same pre-existing
  `src/__tests__/pages/projects.test.tsx:188` failure noted in every prior
  Phase 21 plan summary and STATE.md, unrelated to this plan. No new
  regressions.
- `npx vitest run src/__tests__/home/explorative-homepage.test.tsx
  src/__tests__/home/motion-audit.test.tsx` = 8/8 passed.
- `npx next build` completes clean; `/` still prerenders as static content
  (30m revalidate, 1y expire, unchanged).
- HP-02, HP-03, HP-04, and HP-05 are all now provably true at the assembled-
  page level (not just per-component): the homepage renders one continuous
  `#ffffff` ground end to end, a visitor can browse Building and Writing
  without meeting any subscribe CTA, and the footer's `/#loves` link still
  resolves.
- No blockers for Plan 21-06 (motion retuning / final polish pass), the last
  plan in this phase.

---
*Phase: 21-mono-homepage-rebuild*
*Completed: 2026-07-21*

## Self-Check: PASSED

All created/modified files exist on disk; all four retired files (plus their
dedicated test) confirmed deleted; all three task commit hashes (ef9933d,
1b1ea04, f1823ab) verified present in git log.
