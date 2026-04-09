---
phase: quick
plan: 260409-js5
subsystem: visit-survey
tags: [animation, analytics, ui, motion]
key-files:
  modified:
    - src/components/visit-survey.tsx
decisions:
  - Used motion directly (not m.*) since VisitSurvey renders outside LazyMotion in layout.tsx
  - 4-state machine (hidden/bubble/open/thankyou) for clean state transitions
  - Widget positioned bottom-16 right-6 to stay clear of Prometheus watermark at bottom-3 right-3
  - ease typed as const to satisfy motion/react TypeScript constraints
metrics:
  completed: "2026-04-09"
  tasks_completed: 1
  tasks_total: 2
---

# Phase quick Plan 260409-js5: Restyle Visit Survey from Modal to Chat Widget Summary

**One-liner:** Bottom-right chat widget with pixel-art Monty avatar replacing full-screen modal survey, using motion/react AnimatePresence with 4-state machine.

## What Was Built

Rewrote `src/components/visit-survey.tsx` entirely from a full-screen modal overlay to a bottom-right chat widget (Intercom/Drift style).

**New behavior:**
- After 30 seconds, a circular chat bubble slides in from below (spring animation)
- 600ms later, the bubble auto-opens into a chat window
- Chat window shows Monty's pixel-art avatar (cropped to face) + "Thanks for checking out my site!" message
- 6 quick-reply pill buttons with identical `data-umami-event="visit-reason"` tracking
- Clicking any option shows "Awesome, welcome! Enjoy exploring." then auto-closes after 2s
- X close button in header dismisses immediately
- Both close paths set `sessionStorage.visit-survey-done` to prevent reappearance
- `useReducedMotion()` disables all animations when user prefers reduced motion

## Deviations from Plan

**1. [Rule 1 - Bug] Fixed TypeScript type error on motion transition ease**
- **Found during:** Build verification
- **Issue:** `ease: 'easeOut'` typed as `string` was not assignable to `Easing | Easing[] | undefined`
- **Fix:** Added `as const` to ease values in windowMotion and messageMotion objects
- **Files modified:** src/components/visit-survey.tsx
- **Commit:** 9fd193c (included in same commit)

## Commits

| Task | Name | Commit | Files |
|------|------|--------|-------|
| 1 | Rewrite visit-survey.tsx as chat widget | 9fd193c | src/components/visit-survey.tsx |
| 2 | Human verify checkpoint | — | pending |

## Known Stubs

None — all data is wired (OPTIONS array, sessionStorage logic, Umami attributes all present).

## Threat Flags

None — pure client-side UI component, no new network endpoints or auth paths.

## Self-Check: PASSED

- src/components/visit-survey.tsx: FOUND
- Commit 9fd193c: FOUND
- `npx next build` completed without errors
