---
phase: quick-260713-lex
plan: 01
subsystem: seo
tags: [rss, substack, html-entities, homepage, monty-monthly]

# Dependency graph
requires:
  - phase: none
    provides: none
provides:
  - decodeHtmlEntities exported pure function in src/lib/rss/substack.ts
  - extractDescription now decodes HTML entities before whitespace-collapse
affects: [homepage, monty-monthly-carousel]

# Tech tracking
tech-stack:
  added: []
  patterns: [decode-then-collapse pipeline for tag-stripped RSS text]

key-files:
  created: []
  modified:
    - src/lib/rss/substack.ts
    - src/__tests__/seo/rss-parser.test.ts

key-decisions:
  - "Numeric entities (hex then decimal) decode before named entities so a decoded literal '&' character from a numeric entity can never be re-matched by the named-entity regex"

patterns-established:
  - "decodeHtmlEntities: three-stage .replace() chain (hex numeric -> decimal numeric -> named-entity lookup with space fallback), applied to already tag-stripped text only"

requirements-completed: [QUICK-260713-lex]

# Metrics
duration: 12min
completed: 2026-07-13
---

# Quick Task 260713-lex: Fix Monty Monthly excerpt raw HTML entities Summary

**Added `decodeHtmlEntities` to `src/lib/rss/substack.ts`, wired into `extractDescription`, so Substack smart quotes/em dashes/apostrophes render as real punctuation instead of leaking as literal `&#8217;`-style markup or collapsing into stray spaces.**

## Performance

- **Duration:** 12 min
- **Started:** 2026-07-13T15:29:00Z
- **Completed:** 2026-07-13T15:34:00Z
- **Tasks:** 1 (TDD: RED + GREEN)
- **Files modified:** 2

## Accomplishments
- `decodeHtmlEntities(str)` exported: decodes 13 named entities (amp, lt, gt, quot, apos, nbsp, hellip, mdash, ndash, rsquo, lsquo, rdquo, ldquo), decimal numeric entities (`&#8217;`), and hex numeric entities (`&#x2019;`, case-insensitive), falling back to a space for unrecognized named entities
- `extractDescription` now decodes entities on the tag-stripped string before the whitespace-collapse step, preserving decoded punctuation
- 21 new unit tests covering every named entity, numeric decimal/hex cases (including uppercase `X` and uppercase hex digits), unknown-entity fallback, mixed input, and plain-text passthrough

## Task Commits

Each task was committed atomically (TDD RED/GREEN):

1. **Task 1 RED: add failing tests for decodeHtmlEntities** - `687fe02` (test)
2. **Task 1 GREEN: implement decodeHtmlEntities, wire into extractDescription, fix pre-existing toEqual bug** - `ad69b0d` (feat)

_No REFACTOR commit needed — implementation was already minimal._

## Files Created/Modified
- `src/lib/rss/substack.ts` - Added exported `decodeHtmlEntities` + `NAMED_ENTITIES` map; `extractDescription` now pipes tag-stripped HTML through it before whitespace collapse
- `src/__tests__/seo/rss-parser.test.ts` - Added `describe('decodeHtmlEntities', ...)` block (21 tests); fixed pre-existing `toEqual` assertion missing the `description` field

## Decisions Made
- Decode order is hex numeric -> decimal numeric -> named entities, so a numeric entity that decodes to a literal `&` character can never be re-matched and mangled by the subsequent named-entity regex pass (numeric entities never produce the literal `&#` sequence, so no double-decoding risk either).

## Deviations from Plan

### Auto-fixed Issues

**1. [Rule 1 - Bug] Fixed pre-existing broken assertion in `fetchMontyMonthlyIssues > maps parser items...` test**
- **Found during:** Task 1 (running full `rss-parser.test.ts` after GREEN implementation)
- **Issue:** Commit `0571efd` (immediately prior, unrelated to this task) added a `description` field to `MontyMonthlyIssue` and wired `extractDescription` into `fetchMontyMonthlyIssues`, but never updated the `toEqual` assertion in the existing "maps parser items" test — the mock item has no `content:encoded`, so `description` resolves to `''`, and the returned object's extra `description: ''` key caused `toEqual` to fail against the assertion that omitted it entirely.
- **Fix:** Added `description: ''` to the expected object in the test.
- **Files modified:** `src/__tests__/seo/rss-parser.test.ts`
- **Verification:** `npx vitest run src/__tests__/seo/rss-parser.test.ts` — all 23 tests pass.
- **Committed in:** `ad69b0d` (Task 1 GREEN commit)

---

**Total deviations:** 1 auto-fixed (1 bug fix)
**Impact on plan:** Necessary to satisfy the plan's success criterion "`npx vitest run [rss-parser.test.ts]` passes with zero failures" — the failure was directly in the touched file and blocked plan completion. No scope creep beyond the touched test file.

## Issues Encountered
- Full-suite `npx vitest run` shows one unrelated pre-existing failure in `src/__tests__/pages/projects.test.tsx` (Phase 19 title-card feature, `image is non-null` case) — out of scope per the task's constraint list (touches neither `src/lib/rss/substack.ts` nor `rss-parser.test.ts`); left untouched.
- Mid-task, a `git stash -u` was run in error and immediately reverted the in-progress edit to `src/lib/rss/substack.ts`. Recovered immediately via `git stash pop` (same session, same worktree, stash was on top of the stack) before any other commit landed. No data loss; documented here per process transparency.

## User Setup Required

None - no external service configuration required.

## Next Phase Readiness
- Monty Monthly carousel excerpts on the homepage will now render real punctuation for entity-bearing Substack content on next ISR revalidation / deploy.
- No blockers.

---
*Phase: quick-260713-lex*
*Completed: 2026-07-13*

## Self-Check: PASSED

- FOUND: src/lib/rss/substack.ts
- FOUND: src/__tests__/seo/rss-parser.test.ts
- FOUND: .planning/quick/260713-lex-fix-monty-monthly-excerpt-showing-raw-ht/260713-lex-SUMMARY.md
- FOUND: commit 687fe02 (test, RED)
- FOUND: commit ad69b0d (feat, GREEN)
- FOUND: decodeHtmlEntities export in src/lib/rss/substack.ts
