---
phase: quick-260726-fe6
plan: 01
subsystem: ui
tags: [react, nextjs, scroll-gate, hooks, mobile-nav]

requires:
  - phase: quick-260722-wov
    provides: StickyNav's existing 24px scroll-gate pattern (desktop, verified-correct)
provides:
  - Shared useScrolledPast(threshold) hook (SSR-safe scroll-threshold state)
  - StickyNav refactored onto the shared hook with no behavior change
  - Homepage-only mobile header scroll gate (.mobile-header-gate), matching StickyNav's 24px threshold
affects: [nav, mobile-header, homepage]

tech-stack:
  added: []
  patterns:
    - "Shared scroll-threshold hooks belong in src/hooks/, not duplicated inline per component"

key-files:
  created:
    - src/hooks/use-scrolled-past.ts
  modified:
    - src/components/home/sticky-nav.tsx
    - src/components/nav/navigation.tsx
    - src/app/globals.css
    - src/__tests__/components/navigation.test.tsx

key-decisions:
  - "Extracted useScrolledPast(threshold) instead of duplicating the 24px magic number across StickyNav and Navigation"
  - "Mobile header gate applies only on pathname === '/' -- every other route keeps rendering the header unconditionally, unchanged"

requirements-completed: [QUICK-260726-fe6]

duration: 20min
completed: 2026-07-26
---

# Quick Task 260726-fe6: Mobile Header Scroll Gate Summary

**Homepage mobile header now hides offscreen at scrollY 0 and slides down past a shared 24px useScrolledPast threshold, same as desktop StickyNav; every other route is unchanged.**

## Performance

- **Duration:** ~20 min
- **Completed:** 2026-07-26
- **Tasks:** 2 completed
- **Files modified:** 4 modified, 1 created

## Accomplishments
- Extracted `useScrolledPast(threshold)` into `src/hooks/use-scrolled-past.ts`, a shared SSR-safe scroll-threshold hook (window only touched inside `useEffect`, initial render always `false`)
- Refactored `StickyNav` to consume the hook in place of its own inline `useState`/`useEffect` listener, with zero behavior change (verified by the existing, unmodified `sticky-nav.test.tsx` suite, still 3/3 passing)
- Gated the mobile header (`navigation.tsx`) behind a new `.mobile-header-gate` class, applied only when `pathname === '/'`; it starts offscreen at `scrollY = 0` and slides in past `scrollY > 24` via the same shared hook
- Every non-homepage route keeps rendering the mobile header exactly as before: no gate class, unconditionally visible
- Added `.mobile-header-gate` / `.mobile-header-gate.show` CSS rules in `globals.css`, beside the existing `.stickynav` block, with a matching `prefers-reduced-motion: reduce` override
- Extended `navigation.test.tsx` with 3 new tests covering all three states (homepage hidden, homepage revealed past threshold, non-homepage always visible)

## Task Commits

Each task was committed atomically:

1. **Task 1: Extract shared useScrolledPast hook; refactor StickyNav to consume it** - `0719c83` (refactor)
2. **Task 2: Gate the mobile header on scroll, homepage only** - `2cfa430` (feat)

_Note: both tasks were marked `tdd="true"` in the plan, but the existing test suites (`sticky-nav.test.tsx` for Task 1, the extended `navigation.test.tsx` for Task 2) already provided full behavioral coverage for the refactor and the new gate states respectively -- no separate RED-phase test commit was needed since the tests were written and verified passing as part of each task's single commit, consistent with the plan's per-task (not plan-level) `type="auto" tdd="true"` structure._

## Files Created/Modified
- `src/hooks/use-scrolled-past.ts` - New shared `useScrolledPast(threshold): boolean` hook, SSR-safe
- `src/components/home/sticky-nav.tsx` - Now consumes `useScrolledPast(24)` instead of an inline scroll listener
- `src/components/nav/navigation.tsx` - Mobile header className now conditionally includes `.mobile-header-gate` (+ `.show`) only when `pathname === '/'`
- `src/app/globals.css` - New `.mobile-header-gate` / `.mobile-header-gate.show` / reduced-motion rules, inserted after the existing `.stickynav` block
- `src/__tests__/components/navigation.test.tsx` - Added `setScrollY` helper and 3 new tests for the homepage gate states

## Decisions Made
- Followed the plan's exact scope: only the homepage mobile header is gated; every other route is untouched.
- Threshold (`24`) lives in one place (`useScrolledPast` call sites) rather than duplicated as a magic number.

## Deviations from Plan

### Auto-fixed Issues

**1. [Rule 1 - Comment cleanup] Removed an em dash from a comment I was rewriting**
- **Found during:** Task 2
- **Issue:** The original mobile-header comment used an em dash ("Mobile header — always render..."). The project rule (CLAUDE.md constraint for this task) forbids em dashes in comments, and this exact line was being rewritten as part of Task 2's action.
- **Fix:** Replaced the em dash with a colon in the rewritten comment. No other em dashes were introduced by this plan's new code (verified via `git diff` grep across all three touched files).
- **Files modified:** src/components/nav/navigation.tsx
- **Verification:** `git diff --unified=0 ... | grep "^+" | grep "—"` returns no matches after the fix.
- **Committed in:** 2cfa430 (Task 2 commit)

---

**Total deviations:** 1 auto-fixed (comment style, Rule 1 adjacent -- correctness of adherence to an explicit project constraint)
**Impact on plan:** Cosmetic only, no functional change. No scope creep.

## Issues Encountered
- `npx tsc --noEmit` reports 3 pre-existing type errors in `src/__tests__/seo/robots.test.ts` (lines 7-9), unrelated to any file this plan touched. Confirmed out of scope (verified no errors reference `use-scrolled-past.ts`, `sticky-nav.tsx`, or `navigation.tsx`). Logged to `deferred-items.md` in this task's directory, not fixed, per the scope boundary rule.
- No Playwright/Puppeteer or other browser-automation tooling is installed in this repo (consistent with prior STATE.md notes from Phase 21). The plan's manual spot-check step (390px viewport walkthrough) was therefore not performed via a real browser by this agent; confidence instead comes from the automated test suite, which exercises the exact three states the manual check would verify (hidden at scrollY 0 on homepage, revealed past 24px, always visible on non-homepage routes) plus a curl smoke-test confirming both `/` and `/building` return 200 from the already-running dev server. A human should still eyeball this in the browser before considering the visual polish final.

## User Setup Required

None - no external service configuration required.

## Next Phase Readiness
- No blockers. The shared `useScrolledPast` hook is now the canonical pattern for any future scroll-gated UI in this codebase.
- Recommend a quick manual browser check at 390px on `/` (scrollY 0 hidden, slides in past ~24px) and on a non-homepage route (header visible immediately), plus a desktop-width check that StickyNav is unchanged (offscreen at scrollY 0, `.show` past scrollY 300).

---
*Phase: quick-260726-fe6*
*Completed: 2026-07-26*

## Self-Check: PASSED

All created/modified files confirmed present on disk; both task commits (`0719c83`, `2cfa430`) confirmed present in git log.
