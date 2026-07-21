---
phase: 21-mono-homepage-rebuild
plan: 03
subsystem: ui
tags: [nextjs, react, tailwind-v4, homepage, terminal-list, notion, rss]

# Dependency graph
requires:
  - phase: 21-mono-homepage-rebuild
    plan: 02
    provides: .a-row full-row hover/focus-invert CSS mechanism, reused
      identically for .e-post rows
provides:
  - Terminal-format Writing log renderer for the Writing band (HP-03):
    merges real Notion blog posts + real Monty Monthly RSS issues into one
    newest-first list, capped at 5 rows, no frame
  - .e-term/.e-post CSS family in globals.css (mono type, header
    border-bottom rule, full-row invert, 760px read-time column hide)
  - First call site anywhere in the repo for `estimateReadingTime()`
affects: [21-05]

# Tech tracking
tech-stack:
  added: []
  patterns:
    - "Cross-source merge-sort-cap pattern: map two differently-shaped data
      sources (BlogPost[], MontyMonthlyIssue[]) into one normalized Row[]
      shape, concatenate, sort by parsed date descending, slice(0, N) -
      reusable for any future homepage band that combines Notion + RSS data"
    - "Reused the .a-row full-row ::before invert mechanism verbatim for a
      second row type (.e-post), proving the pattern generalizes across
      different grid-column layouts (Swiss index vs terminal log)"

key-files:
  created:
    - src/components/home/section-writing.tsx
    - src/__tests__/home/section-writing.test.tsx
  modified:
    - src/app/globals.css

key-decisions:
  - "Merged both 760px responsive overrides (.a-row from Plan 21-02 and the
    new .e-post rules) into a single @media (max-width: 760px) block rather
    than opening a second one, per the plan's own read_first instruction to
    append into the existing block Plan 21-02 created."
  - "Wrote .e-post .rd { display: none; } as a single-line rule (deviating
    from this file's otherwise multi-line CSS convention) specifically to
    match the plan's own acceptance-criteria grep pattern
    \"\\.e-post \\.rd { display: none\" which requires the brace and
    declaration on the same line."

requirements-completed: [HP-03]

# Metrics
duration: ~15min
completed: 2026-07-21
---

# Phase 21 Plan 03: Terminal Writing List Summary

**Terminal-format `~/writing` log merging real Notion blog posts + real Monty Monthly RSS issues into one newest-first, 5-row-capped list, on new `.e-term`/`.e-post` CSS reusing Plan 21-02's full-row invert mechanism.**

## Performance

- **Duration:** ~15 min
- **Tasks:** 2 completed
- **Files modified:** 3 (1 created new component, 1 created new test, 1 modified CSS)

## Accomplishments

- New `.e-term`/`.e-post` CSS family in `globals.css`: mono terminal type
  (`--font-mono`, 1.85 line-height), a `.hd` header carrying the sole
  visible rule (`border-bottom`, no box anywhere else), a 104px/1fr/92px
  grid for date/title/read-time, the identical full-row `::before` invert
  overlay pattern as `.a-row` (150ms opacity ease, touch-guarded via
  `@media (hover: hover)`, scoped `:focus-visible` `outline-color:
  currentColor` override), and a 760px responsive collapse to 84px/1fr with
  the read-time column hidden.
- `section-writing.tsx` built as `SectionWriting({ posts = [], montyIssues =
  [] })`, a Server Component with zero client directives: filters out posts
  with a falsy `date`, maps both `BlogPost[]` and `MontyMonthlyIssue[]` into
  a normalized `Row[]` shape (date/title/readTime/href/external), sorts the
  concatenated array by parsed date descending, and caps at 5. Read time
  comes from `estimateReadingTime()` (first call site in the repo) applied
  to each item's `description` -- not the heavier per-post
  `calculateReadingTime(getBlocks(...))` pattern `/writing`'s own page uses.
  Dates render `YYYY-MM` via a small `formatYYYYMM()` helper. Blog rows
  link internally to `/blog/{slug}`; Monty Monthly rows open externally with
  `target="_blank" rel="noopener noreferrer"` (T-21-05). Exactly one `all
  posts →` link to `/writing` renders after the row list.
- `section-writing.test.tsx` (new, 9 tests): header + empty-state text,
  cross-source merge/sort/cap (4 posts + 3 issues interleaved, asserts the 5
  most recent in correct order regardless of source), falsy-date filtering
  (never renders "Invalid Date"), `YYYY-MM` date format, `estimateReadingTime`
  wiring (`"{n} min"` with a 250-word fixture asserting `2 min`), internal
  vs external link target/rel, single `all posts →` link, and absence of any
  frame/box wrapper class.

## Task Commits

Each task was committed atomically, following the RED/GREEN TDD gate for Task 2:

1. **Task 1: Add the .e-term terminal CSS family to globals.css** - `06a9478` (feat)
2. **Task 2 RED: failing test for merged terminal Writing list** - `b2e7234` (test)
2. **Task 2 GREEN: build section-writing.tsx** - `352e2bf` (feat)

## Files Created/Modified

- `src/app/globals.css` - New `.e-term`/`.e-post` rule family (84 lines)
  appended immediately after the `.a-row` family Plan 21-02 added; the
  pre-existing 760px `.a-row` override block was merged with the new
  `.e-post` 760px rules into one block rather than duplicated.
- `src/components/home/section-writing.tsx` - New Server Component: merges
  `BlogPost[]` + `MontyMonthlyIssue[]`, sorts/caps/formats, renders `.e-post`
  rows inside `.e-term`.
- `src/__tests__/home/section-writing.test.tsx` - New test suite, 9 tests
  covering every `<behavior>` item in the plan.

## Decisions Made

- Merged the new `.e-post` 760px responsive rules into the existing
  `@media (max-width: 760px)` block from Plan 21-02 (containing `.a-row`
  overrides) rather than opening a second block, per the plan's
  `read_first` instruction. This required removing the standalone `.a-row`
  760px block that existed before this plan and re-adding its rules inside
  the merged block, so the CSS carries the same behavior with one shared
  breakpoint block instead of two.
- Wrote `.e-post .rd { display: none; }` as a single-line rule (the only
  single-line declaration in an otherwise multi-line-per-rule file) so it
  matches the plan's acceptance-criteria grep pattern exactly, which
  expects the brace and declaration on one line.

## Deviations from Plan

### Auto-fixed Issues

**1. [Rule 1 - Bug] First CSS edit accidentally duplicated the `.a-row` 760px block**
- **Found during:** Task 1
- **Issue:** My first `Edit` call replaced the single existing `@media
  (max-width: 760px) { .a-row {...} }` block with a new block containing
  both `.a-row` and `.e-post` rules, but a leftover copy of the original
  `.a-row`-only block remained above it, producing two `@media (max-width:
  760px)` blocks both containing `.a-row` rules.
- **Fix:** Removed the original standalone `.a-row` 760px block, keeping
  only the merged block (both `.a-row` and `.e-post` rules together) as the
  plan's `read_first` step specified.
- **Files modified:** `src/app/globals.css`
- **Commit:** `06a9478` (folded into the same commit before it was made;
  no separate commit needed since the duplication was caught before
  committing)

### Acceptance-criteria note (not a deviation, precedent from 21-02)

Task 2's acceptance criterion `grep -c "\.e-post {" src/app/globals.css`
returns 1 predicted, actual is 2 -- same arithmetic gap as Plan 21-02's
`.a-row {` note: the base rule plus one 760px responsive override reusing
the same selector. No code change made in response; both occurrences are
required by the plan's own `<interfaces>` spec.

## Issues Encountered

None blocking.

## User Setup Required

None - no external service configuration required.

## Next Phase Readiness

- `npx vitest run src/__tests__/home/section-writing.test.tsx` = 9/9 passed.
- `npx vitest run src/__tests__/home/` = 47/47 passed (all homepage
  component tests, no regressions).
- `npx vitest run` (full suite) = 198 passed, 16 todo, 1 failed -- the same
  pre-existing `src/__tests__/pages/projects.test.tsx:188` failure noted in
  Plans 21-01/21-02's summaries and STATE.md, unrelated to this plan. No new
  failures introduced.
- `npx next build` completes clean; `/` still prerenders as static content
  (30m revalidate, 1y expire, unchanged).
- `SectionWriting`'s `posts`/`montyIssues` props both default to `[]`, so
  it can be dropped into `explorative-homepage.tsx` with zero props today
  (renders the empty-state) until Plan 21-05 wires
  `getPublishedPosts()`/`fetchMontyMonthlyIssues()` through the orchestrator
  and deletes `section-newsletter.tsx`.
- `.e-term`/`.e-post` CSS is complete and matches the sketch reference
  exactly; no further CSS work needed for the Writing band.
- No blockers for Plan 21-04.

---
*Phase: 21-mono-homepage-rebuild*
*Completed: 2026-07-21*

## Self-Check: PASSED

All created/modified files exist on disk; all three task commit hashes
(06a9478, b2e7234, 352e2bf) verified present in git log.
