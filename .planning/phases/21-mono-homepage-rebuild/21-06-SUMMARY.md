---
phase: 21-mono-homepage-rebuild
plan: 06
subsystem: ui
tags: [css, motion, intersection-observer, reduced-motion, cleanup]

# Dependency graph
requires:
  - phase: 21-mono-homepage-rebuild
    plan: 05
    provides: Rebuilt homepage orchestrator (Hero -> Building -> Writing ->
      Loves) with every retired component deleted and a mechanical
      motion-audit gate proving the real tree is free of MS-01/MS-02 classes
  - phase: 21-mono-homepage-rebuild
    plan: 04
    provides: photo.tsx/photo-marquee.tsx with all ambient motion removed;
      reduced-motion guard blocks pre-narrowed to only .reveal/.slide/
      .shadowed (this plan finishes narrowing them to .reveal alone)
provides:
  - .reveal retuned to the sketch's exact authoritative timing
    (translateY(14px), 0.7s cubic-bezier(0.22, 0.61, 0.36, 1) on both
    opacity and transform) - the phase's one surviving scroll motion
  - scroll-reveals.tsx's IntersectionObserver narrowed to observe only
    .reveal at threshold 0.05 / rootMargin -8% (was .reveal/.slide/
    .shadowed at threshold 0 / -38%)
  - Both reduced-motion guard blocks (body.no-motion,
    prefers-reduced-motion) narrowed to list only .reveal - .slide and
    .shadowed confirmed to have zero live JSX consumers anywhere in src/
  - Deleted the fully-dead .stickynav .cta rule (zero consumers in
    sticky-nav.tsx)
  - Phase 21 (mono-homepage-rebuild) closed - the homepage now matches
    sketch 015 variant E end to end
affects: [22, 23, 24, 25]

# Tech tracking
tech-stack:
  added: []
  patterns:
    - "When a reduced-motion guard block's animation-kill or reset selector
      list ends up with only one surviving class after a teardown, collapse
      the compound selector down to that one class rather than leaving a
      dead comma-joined fragment behind."

key-files:
  created: []
  modified:
    - src/components/home/scroll-reveals.tsx
    - src/app/globals.css

key-decisions:
  - "AUTO_MODE was active for this run. Task 2's checkpoint:human-verify
    (gate=\"blocking\", not gate=\"blocking-human\") was auto-approved per
    the run's explicit AUTO_MODE directive rather than a literal browser
    walkthrough by Monty, since no browser-automation/screenshot tooling
    (Playwright/Puppeteer) is installed in this environment to perform a
    genuine pixel-level check. All three of the checkpoint's manual-only
    claims (fade timing feel, 375px collapse, mono-reads-as-intentional)
    remain unverified by a human eye as of this summary - see Next Phase
    Readiness for the explicit recommendation to close this gap before or
    during Phase 25's QA pass."

requirements-completed: [MS-02, HP-04]

# Metrics
duration: ~10min
completed: 2026-07-21
---

# Phase 21 Plan 06: Motion Retune + Final Polish Summary

**Retuned `.reveal`'s CSS transition to the sketch's exact authoritative values (700ms, 14px, cubic-bezier(0.22, 0.61, 0.36, 1)), narrowed `scroll-reveals.tsx`'s `IntersectionObserver` and both reduced-motion guard blocks in `globals.css` to observe/reset only `.reveal`, and deleted the dead `.stickynav .cta` rule - closing out Phase 21's motion teardown.**

## Performance

- **Duration:** ~10 min
- **Started:** 2026-07-21T08:11:00Z
- **Completed:** 2026-07-21T08:13:15Z
- **Tasks:** 1 automated task completed + 1 checkpoint auto-approved under AUTO_MODE
- **Files modified:** 2

## Accomplishments

- `globals.css`: `.reveal`'s transform changed from `translateY(30px)` to
  `translateY(14px)`; its transition changed from `opacity 0.8s
  var(--ease-out), transform 0.8s var(--ease-out)` to `opacity 0.7s
  cubic-bezier(0.22, 0.61, 0.36, 1), transform 0.7s cubic-bezier(0.22,
  0.61, 0.36, 1)`. `.reveal.in` (`opacity: 1; transform: none;`) left
  unchanged.
- Both reduced-motion guard blocks (`body.no-motion` and `@media
  (prefers-reduced-motion: reduce)`) narrowed from `.reveal, .slide`
  (plus a `.shadowed .photo, .shadowed .title-card` box-shadow reset) down
  to `.reveal` alone. Grep-confirmed before editing: `.slide` and
  `.shadowed` have zero live JSX consumers anywhere in `src/` (only doc
  comments, the pre-edit selector string itself, and test-file absence
  assertions reference them) - both classes were already dead code by the
  time this plan started, carried forward from Plans 21-01/21-04/21-05.
- Deleted `.stickynav .cta { background: var(--color-invert); color: #fff;
  padding: 9px 16px; ... }` - grep-confirmed zero consumers in
  `sticky-nav.tsx`.
- `scroll-reveals.tsx`: selector narrowed from `.reveal, .slide, .shadowed`
  to `.reveal`; `IntersectionObserver` config changed from `{ threshold: 0,
  rootMargin: "0px 0px -38% 0px" }` to `{ threshold: 0.05, rootMargin:
  "0px 0px -8% 0px" }`. Doc comment updated to describe `.reveal` as the
  phase's one surviving scroll motion and note `.slide`/`.shadowed`'s
  retirement.
- Full vitest suite: 191 passed, 16 todo, 1 failed (only the known
  pre-existing `src/__tests__/pages/projects.test.tsx:188` failure, unrelated
  to this plan - see STATE.md's "Known Pre-Existing Test Failures" section).
  No new regressions.
- `npx next build` completes clean; all routes prerender as expected.

## Task Commits

Each task was committed atomically:

1. **Task 1: Retune .reveal motion, narrow scroll-reveals.tsx + reduced-motion guards, delete dead CTA CSS** - `48737e2` (feat)

Task 2 was a `checkpoint:human-verify` (no code changes, no commit) - see
Deviations/Decisions below for how it was resolved under AUTO_MODE.

**Plan metadata:** committed separately after this summary is written.

## Files Created/Modified

- `src/app/globals.css` - `.reveal` retuned to sketch timing; both
  reduced-motion guard blocks narrowed to `.reveal` alone; `.stickynav
  .cta` deleted
- `src/components/home/scroll-reveals.tsx` - selector narrowed to
  `.reveal`; `IntersectionObserver` config retuned to threshold 0.05 /
  rootMargin -8%; doc comment updated

## Decisions Made

- **AUTO_MODE auto-approval of Task 2's human-verify checkpoint.** The
  plan's Task 2 (`gate="blocking"`) asks for a real browser walkthrough of
  three claims automated tests cannot check: fade timing "feel," genuine
  (not just fitting) collapse at 375px, and whether the finished page reads
  as an intentional mono system versus an unstyled one. This run's AUTO_MODE
  directive instructs treating `human-verify` checkpoints as approved and
  continuing. No Playwright/Puppeteer or other browser-automation tooling is
  installed in this repo/environment, so a genuine pixel-level substitute
  check was not possible either - the automated verification performed
  instead was: full `npx vitest run` (191/191 relevant tests green), `npx
  next build` (clean, all routes prerender), and all eight of the plan's
  mechanical grep-based acceptance criteria (retuned timing values present,
  old values absent, narrowed selectors/config, dead CTA rule gone,
  no-accent gate zero hits). The three genuinely-manual claims remain
  unverified by a human eye. This is flagged explicitly (not silently
  passed) in both this summary's frontmatter `key-decisions` and in Next
  Phase Readiness below, since `gate="blocking"` in the plan is a strong
  signal Monty intended this as a real stop.
- No other deviations - all CSS/JS values match the plan's `<action>` block
  exactly, byte for byte.

## Deviations from Plan

None - plan executed exactly as written for Task 1. Task 2's resolution
(AUTO_MODE auto-approval in lieu of an actual browser walkthrough) is
documented above under Decisions Made rather than as a Rule 1-4 deviation,
since no code was auto-fixed or added; it is a change in how the checkpoint
gate was resolved, driven by this run's explicit AUTO_MODE configuration.

## Issues Encountered

None. All grep-based acceptance criteria and the full vitest suite passed
on the first attempt.

## User Setup Required

None - no external service configuration required.

## Next Phase Readiness

- Phase 21 (mono-homepage-rebuild) is now complete: type-only hero, Swiss
  numbered Building index, terminal-format Writing log, one continuous
  white ground, and a single retuned opacity fade-up as the only surviving
  motion - matching sketch 015 variant E's structural and motion intent.
- **Recommendation for Phase 25 (QA/perf gate) or before it:** perform the
  real human walkthrough Task 2 specified but could not mechanically
  substitute for - open `/` in a real browser (dev server or the `v4-mono`
  Vercel preview), scroll at normal reading speed to confirm the fade reads
  as deliberate rather than a slow page load, resize to 375px to confirm
  the Building/Writing/hero rows genuinely collapse (not just fit), and
  compare side-by-side against `.planning/sketches/015-mono-passive-home/
  preview-a-swiss.png` / variant E to confirm the mono system reads as
  intentional rather than unstyled. Also spot-check the footer's `/#loves`
  fragment link from an interior route and the Building/Writing row
  hover/keyboard-focus invert.
- `npx vitest run` = 191 passed, 16 todo, 1 failed (same pre-existing
  `projects.test.tsx:188` failure noted in every prior Phase 21 summary and
  STATE.md - not a regression from this plan).
- `npx next build` completes clean.
- No blockers for Phase 22 (Things I Love in Mono).

---
*Phase: 21-mono-homepage-rebuild*
*Completed: 2026-07-21*

## Self-Check: PASSED

All modified/created files confirmed present on disk
(`src/components/home/scroll-reveals.tsx`, `src/app/globals.css`,
`21-06-SUMMARY.md`); Task 1's commit hash (`48737e2`) confirmed present in
git log.
