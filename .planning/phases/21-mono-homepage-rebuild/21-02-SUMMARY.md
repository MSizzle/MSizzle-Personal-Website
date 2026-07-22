---
phase: 21-mono-homepage-rebuild
plan: 02
subsystem: ui
tags: [nextjs, react, tailwind-v4, homepage, swiss-index, notion]

# Dependency graph
requires:
  - phase: 21-mono-homepage-rebuild
    plan: 01
    provides: pure mono token system consumed by the new .a-row CSS family
provides:
  - Swiss numbered index row renderer for the Building band (HP-02):
    zero-padded 3-digit rows, full-row hover/focus invert
  - .a-row/.a-sec CSS family in globals.css (grid layout, invert mechanism,
    scoped focus-ring override, 760px responsive collapse) — the reference
    implementation Plan 21-03 reuses for Writing terminal rows
  - section-building.tsx absorbs section-work.tsx's Notion Featured Projects
    data role via a `projects: Project[]` prop
affects: [21-03, 21-05]

# Tech tracking
tech-stack:
  added: []
  patterns:
    - "Full-row hover/focus inversion via an absolute ::before pseudo-element
      (inset: 0 -20px bleed) + text color transition, 150ms opacity ease,
      gated behind @media (hover: hover) for touch, with a scoped
      outline-color: currentColor override on :focus-visible so the ring
      survives on top of the inverted black background"
    - "Row-array composition pattern: hardcoded row 0 + projects.map(...)
      spread into one Row[] list, rendered with a single .map — reusable
      for any future homepage index band"

key-files:
  created: []
  modified:
    - src/components/home/section-building.tsx
    - src/__tests__/home/section-building.test.tsx
    - src/app/globals.css

key-decisions:
  - "Implemented the .a-row CSS family verbatim per the plan's <interfaces>
    block, including the 760px responsive override block that reintroduces
    a second '.a-row {' selector line by design (base rule + breakpoint
    override) — see Deviations for the resulting grep-count mismatch
    against the plan's own acceptance criteria."
  - "New @media (max-width: 760px) block for .a-row (not appended to either
    pre-existing 760px block, which are both pinboard-specific) keeps this
    phase's CSS additions grouped together immediately before the MOTION
    SYSTEM comment, as the plan's <action> suggested."

requirements-completed: [HP-02, MS-02]

# Metrics
duration: ~10min
completed: 2026-07-21
---

# Phase 21 Plan 02: Building Index Rebuild Summary

**Swiss numbered index for the Building band: zero-padded 3-digit rows (Prometheus + real Notion Featured Projects) with full-row hover/focus inversion as the site's only hover language, on new `.a-row` CSS.**

## Performance

- **Duration:** ~10 min
- **Tasks:** 2 completed
- **Files modified:** 3

## Accomplishments
- New `.a-sec`/`.a-row` CSS family in `globals.css`: 64px/1fr/200px/90px grid
  (numeral/title/description/status), hairline top-rule per row plus a
  closing bottom-rule on the last row, full-row `::before` invert overlay
  (150ms opacity ease), touch-guarded `:hover` via `@media (hover: hover)`,
  identical `:focus-visible` inversion for keyboard users, a scoped
  `outline-color: currentColor` override so the D-10 global focus ring stays
  visible once the row inverts to black, and a 760px responsive collapse to
  a `40px 1fr` grid with description/status stacking into column 2
- `section-building.tsx` fully rebuilt as `SectionBuilding({ projects = [] })`:
  row 001 is always the hardcoded Prometheus row (external link,
  `rel="noopener noreferrer"`); rows 002+ map one-to-one from the `projects`
  prop in array order, using `project.tags[0]` or the UTC year of
  `project.lastEdited` as the status column and `/building/{slug}` as the
  href. No `RailBox`, `Photo`, "This site" placeholder, or
  `shadowed`/`slide`/`beat-grid`/`prometheus-shot` classes survive.
- `section-building.test.tsx` fully rewritten (6 tests): zero-projects
  single-row case, N-projects → N+1-rows case (one project with a tag, one
  without to exercise the year fallback), zero-padded numeral format,
  absence of the "This site" row, absence of every retired
  photo/motion class, and every row wrapped in `a.a-row`.

## Task Commits

Each task was committed atomically:

1. **Task 1: Add the .a-row Swiss index CSS family to globals.css** - `50ba4f3` (feat)
2. **Task 2: Rebuild section-building.tsx as the Swiss numbered index (HP-02)** - `c645d45` (feat)

## Files Created/Modified
- `src/app/globals.css` - New `.a-sec`/`.a-row` rule family (94 lines) added
  immediately before the "MOTION SYSTEM" comment block
- `src/components/home/section-building.tsx` - Rebuilt: `Project[]`-typed
  `projects` prop, Row[] composition (Prometheus + Notion rows), `.a-row`
  markup, no legacy imports
- `src/__tests__/home/section-building.test.tsx` - Fully rewritten: 6 tests
  covering every `<behavior>` item in the plan

## Decisions Made
- Implemented the CSS "verbatim" per the plan's `<interfaces>` block exactly
  as specified, including the responsive override reusing the `.a-row {`
  selector a second time inside the `@media (max-width: 760px)` block — see
  Deviations below for the resulting grep-count note.
- Placed the new `@media (max-width: 760px)` block for `.a-row` as its own
  block (not appended into either of the two pre-existing 760px blocks,
  which are both pinboard-specific and unrelated to the Building index),
  keeping this phase's new CSS self-contained and grouped together as the
  plan's `<action>` suggested ("Phase 21: homepage rebuild" grouping).

## Deviations from Plan

### Auto-fixed Issues

None - no bugs, missing functionality, or blocking issues encountered.

### Acceptance-criteria math note (not a deviation, documented per 21-01 precedent)

Task 1's acceptance criteria stated `grep -c "\.a-row {" src/app/globals.css`
should return 1. The actual result is 2, because the plan's own
`<interfaces>` block explicitly specifies a second `.a-row { grid-template-
columns: 40px 1fr; }` rule inside the 760px responsive override — the same
pattern the plan's own text described as "verbatim." This is the plan's own
acceptance-criteria prediction undercounting a rule the plan itself
requires; the CSS was implemented exactly as `<interfaces>` specified (base
`.a-row` rule + one responsive override selector reusing the class name),
which is the correct, load-bearing implementation. No code change was made
in response to this — the criterion's arithmetic, not the implementation,
is what's off. All other acceptance criteria for both tasks passed exactly
as stated (`.a-row::before` = 1, `.a-row:focus-visible` ≥ 2 -- actual 6 from
the invert-trigger rule, the outline-color override, and the two
`.a-row:hover, .a-row:hover .num, ...` text-color rule combinators being
matched per grep's line-based counting, `outline-color: currentColor` = 1,
`@media (hover: hover)` = 1).

## Issues Encountered
None.

## User Setup Required
None - no external service configuration required.

## Next Phase Readiness

- `npx vitest run src/__tests__/home/section-building.test.tsx` = 6/6 passed.
- `npx vitest run src/__tests__/home/` = 38/38 passed (all homepage
  component tests, no regressions).
- `npx vitest run` (full suite) = 189 passed, 16 todo, 1 failed — the same
  pre-existing `src/__tests__/pages/projects.test.tsx:188` failure noted in
  Plan 21-01's summary and STATE.md, unrelated to this plan. No new
  failures introduced.
- `npx next build` completes clean; `/` still prerenders as static content
  (30m revalidate, 1y expire, unchanged).
- `SectionBuilding`'s new `projects` prop defaults to `[]`, so the current
  orchestrator (`explorative-homepage.tsx`) still imports it with zero props
  and renders correctly (row 001 alone) until Plan 21-05 wires the real
  `projects` array through and deletes `section-work.tsx`.
- `.a-row` CSS family is ready for Plan 21-03 to reuse identically for
  Writing terminal rows (`.e-post`), including the same `outline-color:
  currentColor` scoped-override pattern.
- No blockers for Plan 21-03 (Writing terminal list, HP-03).

---
*Phase: 21-mono-homepage-rebuild*
*Completed: 2026-07-21*

## Self-Check: PASSED

All created/modified files exist on disk; both task commit hashes (50ba4f3, c645d45)
verified present in git log.
