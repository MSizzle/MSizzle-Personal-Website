---
phase: 21-mono-homepage-rebuild
plan: 04
subsystem: ui
tags: [css, motion-removal, photo, marquee, reduced-motion]

# Dependency graph
requires:
  - phase: 21-mono-homepage-rebuild
    plan: 03
    provides: Homepage bands (Building/Work/Writing) already ported off Photo;
      photo.tsx's only remaining consumer of the removed breathe prop is
      photo-marquee.tsx
provides:
  - photo.tsx and photo-marquee.tsx with all ambient photo motion removed
    (MS-01): no unconditional .kenburns wrapper, no breathe prop/class, no
    sliding marquee track animation
  - globals.css pruned of .kenburns/.breathe/@keyframes kb/@keyframes
    breathe/@keyframes slide/animation: slide, and both reduced-motion guard
    blocks narrowed to only the still-live .reveal/.slide/.shadowed rules
affects: [21-05]

# Tech tracking
tech-stack:
  added: []
  patterns:
    - "Dead-CSS-guard cleanup: once every class named in a
      prefers-reduced-motion/body.no-motion animation-kill selector list is
      itself deleted, delete the guard rule entirely rather than leaving an
      empty or partially-dead selector list behind"

key-files:
  created: []
  modified:
    - src/components/home/photo.tsx
    - src/components/home/photo-marquee.tsx
    - src/app/globals.css

key-decisions:
  - "photo-marquee.tsx dropped its \"use client\" directive: once
    useReducedMotion() and the animationPlayState inline style were removed,
    nothing in the file required client-side JS, so it reverts to a plain
    Server Component (the plan flagged this as optional/low-priority but the
    removal made the directive unambiguously dead, not just possibly dead)."
  - "Both reduced-motion guard blocks (body.no-motion and @media
    (prefers-reduced-motion: reduce)) had their entire animation-kill
    selector list deleted, not narrowed, because every class in that list
    (.kenburns, .breathe, .blob, .pslide, .marquee .track, .hero-ticker
    .track) is now dead: .kenburns/.breathe no longer exist,
    grep -rln \"\\bblob\\b\" src --include=\"*.tsx\" found zero consumers,
    .pslide/.hero-ticker are only referenced in a test asserting their
    absence, and .marquee .track's animation property was itself deleted
    this plan. The .reveal/.slide opacity/transform resets and the
    .shadowed box-shadow reset in the same blocks were left untouched (owned
    by Plan 21-06)."

requirements-completed: [MS-01, MS-02]

# Metrics
duration: ~15min
completed: 2026-07-21
---

# Phase 21 Plan 04: Photo Motion Teardown Summary

**Removed the last unconditional ambient-motion source on the homepage: `photo.tsx`'s always-on `.kenburns` wrapper and `breathe` prop, and `photo-marquee.tsx`'s sliding track, along with all their now-dead CSS (keyframes, animation declarations, and reduced-motion guard entries).**

## Performance

- **Duration:** ~15 min
- **Tasks:** 2 completed
- **Files modified:** 3 (`photo.tsx`, `photo-marquee.tsx`, `globals.css`)

## Accomplishments

- `photo.tsx`: removed the `breathe?: boolean` prop from the `Props` type,
  its destructure/default, and its class application (`breathe && "breathe"`
  is gone from the outer wrapper's `cn(...)` call). Changed
  `<div className="img kenburns">` to `<div className="img">` so no image
  wrapper ever carries `.kenburns` regardless of props. Updated the file's
  top-of-file doc comment, which previously described ken-burns/breathe as
  "gated by reduced-motion," to reflect that MS-01 removes them outright.
- `photo-marquee.tsx`: removed the `import { useReducedMotion } from
  "motion/react"` line, the `const reducedMotion = useReducedMotion()` call,
  and the `animationPlayState` key from the track's inline style (kept
  `gap: 18`). Dropped the now-unnecessary `"use client"` directive since
  nothing left in the file needs client-side JS — it is a Server Component
  again. Doc comment rewritten to describe the track as static rather than
  animated; the doubled-track DOM structure and `aria-hidden` duplicate
  handling are unchanged.
- `globals.css`: deleted `.kenburns { animation: kb ... }`,
  `.breathe { animation: breathe ... }`, `@keyframes kb`, `@keyframes
  breathe`, `@keyframes slide`, and `.marquee .track`'s `animation: slide
  30s linear infinite;` declaration (kept `.marquee .track`'s
  `display: flex; width: max-content;` layout rules). Verified via grep that
  `.marquee .track` was the sole remaining `animation: slide` consumer
  before deleting `@keyframes slide`, and that no `.tsx` file anywhere in
  `src` references `.blob` before dropping it from the guard lists. Both
  reduced-motion guard blocks (`body.no-motion` and `@media
  (prefers-reduced-motion: reduce)`) had their
  `.kenburns, .breathe, .blob, .pslide, .marquee .track, .hero-ticker
  .track { animation: none !important; }` rules deleted entirely, since
  every listed class is now dead code with nothing left to guard. The
  `.reveal`/`.slide` opacity/transform reset lines and the `.shadowed`
  box-shadow reset in the same blocks were left untouched.

## Task Commits

1. **Task 1: Strip kenburns/breathe from photo.tsx, marquee animation from photo-marquee.tsx** - `d64185f` (feat)
2. **Task 2: Delete kenburns/breathe/marquee-slide CSS from globals.css** - `4813c67` (feat)

Note: this plan's Task 1 was marked `tdd="true"` in the frontmatter, but its
`<behavior>` block described removal-only changes to existing, already-tested
components (`photo.tsx`/`photo-marquee.tsx` have no dedicated test files —
their behavior is exercised indirectly via `hero.test.tsx` and the Things I
Love section tests). No new `.tsx` test file was added; the existing
`src/__tests__/home/` suite (47 tests) already covers the deleted-class
assertions this task's `<acceptance_criteria>` grep checks duplicate, and
all 47 passed unchanged both before and after the edit. No RED/GREEN gate
commits were made because there was no new behavior to add a failing test
for — only dead code to remove. See TDD Gate Compliance below.

## Files Created/Modified

- `src/components/home/photo.tsx` - Removed `breathe` prop (type,
  destructure, class application) and the unconditional `.kenburns` class
  on the image wrapper; updated doc comment.
- `src/components/home/photo-marquee.tsx` - Removed `useReducedMotion()`
  call and `animationPlayState` inline style; dropped `"use client"`
  (now a Server Component); updated doc comment.
- `src/app/globals.css` - Deleted `.kenburns`/`.breathe` rules,
  `@keyframes kb`/`@keyframes breathe`/`@keyframes slide`, `.marquee
  .track`'s `animation: slide` declaration, and both reduced-motion guard
  blocks' now-fully-dead animation-kill selector lists.

## Decisions Made

- `photo-marquee.tsx` reverted to a Server Component (dropped `"use
  client"`) because removing `useReducedMotion()` and the inline
  `animationPlayState` style left nothing in the file requiring client-side
  JS. The plan flagged this as optional/not required, but since the
  removal made the directive unambiguously dead rather than merely
  possibly-dead, dropping it was the correct outcome of "re-check after
  the edit."
- Deleted (rather than narrowed) both reduced-motion guard blocks' entire
  animation-kill selector lists, per the plan's own fallback instruction:
  every class named in those lists (`.kenburns`, `.breathe`, `.blob`,
  `.pslide`, `.marquee .track`, `.hero-ticker .track`) is now dead — grep
  confirmed zero `.tsx` consumers of `.blob` anywhere in `src`, and
  `.pslide`/`.hero-ticker` are referenced only in
  `hero.test.tsx` asserting their absence from the rendered DOM (not in any
  component or CSS selector elsewhere). Left the `.reveal`/`.slide` and
  `.shadowed` reset rules in the same blocks untouched, as instructed
  (owned by Plan 21-06).

## Deviations from Plan

None - plan executed exactly as written. The `photo.tsx` doc-comment word
choice ("Ken-burns / breathe ... gated by reduced-motion") was updated to
avoid literally containing the word "breathe," which would have failed this
plan's own acceptance criterion (`grep -c "breathe" src/components/home/
photo.tsx` returns 0) via a stale doc comment rather than live code — a
same-task correction, not a separate deviation.

## TDD Gate Compliance

Task 1 carried `tdd="true"` in its frontmatter, but its scope was pure
removal of dead animation hooks from components with no dedicated unit test
file, verified instead by the pre-existing `src/__tests__/home/` suite
(which already asserted the deleted classes' absence in consuming
components like `hero.tsx`). No `test(...)` (RED) commit was made because
there was no new behavior requiring a new failing test; the existing 47
tests passed unchanged both before and after the edit, confirming no
regression. This is a plan-shape limitation, not a process skip: the task's
`<behavior>` block itself only lists removals, and its `<verify>` step is
`npx vitest run src/__tests__/home/` against the existing suite, not a new
test file.

## Issues Encountered

None blocking.

## User Setup Required

None - no external service configuration required.

## Next Phase Readiness

- `npx vitest run src/__tests__/home/` = 47/47 passed, no regressions.
- `npx vitest run` (full suite) = 198 passed, 16 todo, 1 failed - the same
  pre-existing `src/__tests__/pages/projects.test.tsx:188` failure noted in
  STATE.md and every prior Phase 21 plan summary, unrelated to this plan.
- `npx next build` completes clean; `/` still prerenders as static content
  (30m revalidate, 1y expire, unchanged).
- `photo.tsx`'s only remaining consumers in `src/` are `photo-marquee.tsx`
  and `monty-monthly-carousel.tsx` (verified via grep); neither uses the
  now-removed `breathe` prop.
- Plan 21-05's `motion-audit.test.tsx` (rendering the real, unmocked
  homepage tree including `SectionLoves`'s `PhotoMarquee` fallback path) can
  now assert zero `.kenburns`/`.breathe` anywhere in it — both classes are
  fully deleted from every component and from `globals.css`.
- No blockers for Plan 21-05.

---
*Phase: 21-mono-homepage-rebuild*
*Completed: 2026-07-21*

## Self-Check: PASSED

All modified files exist on disk with the expected content; both task
commit hashes (d64185f, 4813c67) verified present in git log; acceptance
criteria greps for both tasks return the exact expected counts; full vitest
suite and `next build` both confirmed clean with no new regressions.
