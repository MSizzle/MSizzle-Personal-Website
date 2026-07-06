---
phase: 260706-lm3-replace-cringy-proud-copy-on-homepage-wi
plan: 01
type: execute
completed_date: "2026-07-06"
subsystem: homepage
tags: [copy, quick-task]
---

# Quick Task 260706-lm3: Replace Cringy Proud-Copy Summary

**One-liner:** Replaced self-congratulatory "proud" phrasing with neutral, confident past-projects language on the homepage hero and work section.

## Execution

| Task | Status | Commit | Files |
|------|--------|--------|-------|
| Task 1: Replace proud-copy for plainer past-projects language | complete | de9ffb7 | src/components/home/section-work.tsx, src/components/home/hero.tsx |

## Changes Made

### src/components/home/section-work.tsx (line 53)
- **Before:** `<h2 className="reveal">Some of the work I am proudest of.</h2>`
- **After:** `<h2 className="reveal">Past projects.</h2>`
- **Rationale:** Simpler, more direct headline. Removes self-congratulatory tone.

### src/components/home/hero.tsx (line 35)
- **Before:** `and the work I am proud to put my name on.`
- **After:** `and the projects I have shipped.`
- **Rationale:** Shifts from subjective pride to objective accomplishment. "Shipped" conveys completion and confidence.

## Verification

- **Text presence:** Both new strings confirmed with grep
- **Em dashes:** No em dashes present (site-wide rule verified)
- **Tests:** `npx vitest run src/__tests__/home/section-work.test.tsx` — 9 passed
- **Structure:** No JSX structure, className, or surrounding code modified

## Deviations from Plan

None. Plan executed exactly as written.

## Known Stubs

None.

## Threat Flags

None. Copy-only edits to server-rendered components; no new attack surface.

## Self-Check: PASSED

- **Files created:** None
- **Files modified:** ✓ src/components/home/section-work.tsx (verified)
- **Files modified:** ✓ src/components/home/hero.tsx (verified)
- **Commit:** ✓ de9ffb7 (verified in git log)
- **Tests:** ✓ All 9 tests pass
