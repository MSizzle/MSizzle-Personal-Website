---
phase: 08-motion-subtractions
verified: 2026-05-21T04:15:00Z
status: human_needed
score: 3/5 must-haves verified (2 deferred to human; 0 failed)
overrides_applied: 0
re_verification:
  previous_status: null
  previous_score: null
  note: "Initial verification"
human_verification:
  - test: "vercel build --prod (D-11 phase gate)"
    expected: "exit 0; Build Completed success line"
    why_human: "Sandbox node_modules corrupted (Turbopack ENFILE + webpack framer-motion ESM + vercel-installer pre-build re-corruption of Next.js). User pre-approved deferral at session resume. Tracked in 08-HUMAN-UAT.md Item 1."
  - test: "Manual Lenis smooth scroll + 200-300ms page-load fade smoke test on dev server"
    expected: "Lenis-smoothed scroll on /; fade fires on / → /about and back; no deleted-component artifacts visible; clean DevTools console"
    why_human: "Plan-07 Task 2 is type=checkpoint:human-verify gate=blocking — perceptual verification an executor cannot observe. Tracked in 08-HUMAN-UAT.md Item 2."
---

# Phase 8: Motion Subtractions — Verification Report

**Phase Goal:** Strip v1.0's competing animation loops and cascading reveals so the canvas is clean for editorial work — without breaking pages that currently import the deleted components.
**Verified:** 2026-05-21T04:15:00Z
**Status:** human_needed
**Re-verification:** No — initial verification.

## Goal Achievement

### Observable Truths (ROADMAP Success Criteria)

| #   | Truth                                                                                                                          | Status            | Evidence |
| --- | ------------------------------------------------------------------------------------------------------------------------------ | ----------------- | -------- |
| 1   | Homepage shows no auto-scrolling photo carousel, no rotating tagline, no hover-triggered works/writings carousels             | VERIFIED          | `grep -rE "PhotoCarousel\|RotatingTagline\|WorksCarousel\|WritingsCarousel" src/` → 0 hits. All 4 component files absent from `src/components/home/`. `src/app/page.tsx` has clean imports (no carousel imports). |
| 2   | Featured event card on `/events` and homepage render with no `animate-ping` pulsing indicator                                 | VERIFIED          | `grep -rE "animate-(ping\|pulse\|bounce\|spin)" src/` → 0 hits. `event-cards.tsx:50-51` shows static `<span>` red dot — outer `animate-ping` wrapper removed (preserves "Upcoming" heading at line 53). |
| 3   | Event lists and blog card lists fade in together (or with simple per-item fade) — no visible cascading delay                  | VERIFIED          | `grep -rE 'delay=\{?[0-9]?\.?[0-9]+\s*\+\s*i\s*\*' src/` → 0 hits. `UpcomingMini`/`PastEventCard` no longer accept `delay` prop. Remaining `delay=` instances on `/events` (lines 40, 47, 56, 74) are fixed per-section ScrollReveal wrappers around H1/H2 headings — NOT per-item cascades. |
| 4   | `vercel build --prod` exits 0 after deletions — no dead imports, no missing module errors                                     | PENDING_HUMAN    | Deferred to 08-HUMAN-UAT.md Item 1. Sandbox node_modules is environmentally corrupted; not caused by Phase 8 changes. Documented in 08-07-SUMMARY.md "Deviations from Plan". User pre-approved this deferral. |
| 5   | Lenis smooth scroll and the 200-300ms page-load fade still work on every existing route                                       | VERIFIED (static) + PENDING_HUMAN (perceptual) | **Static portion VERIFIED:** `git diff origin/main -- src/components/providers/lenis-provider.tsx src/app/template.tsx src/components/animations/scroll-reveal.tsx` is empty (all 3 files byte-identical to baseline). `LenisProvider` still wired in `src/app/layout.tsx:4,69-75`. `template.tsx` retains full AnimatePresence fade (300ms duration, motion/react). **Perceptual portion deferred** to 08-HUMAN-UAT.md Item 2 (blocking checkpoint, autonomous: false). |

**Score:** 3/5 fully verified, 1 partial-with-human-followup (#5), 1 fully-pending-human (#4). No FAILED truths.

### Required Artifacts (Deletions)

| Artifact                                                | Expected               | Status   | Details |
| ------------------------------------------------------- | ---------------------- | -------- | ------- |
| `src/components/home/photo-carousel.tsx`                | DELETED                | VERIFIED | File absent. |
| `src/components/home/rotating-tagline.tsx`              | DELETED                | VERIFIED | File absent. |
| `src/components/home/works-carousel.tsx`                | DELETED                | VERIFIED | File absent. |
| `src/components/home/writings-carousel.tsx`             | DELETED                | VERIFIED | File absent. |
| `src/app/page.tsx`                                      | No carousel imports/JSX, no `getCarouselPhotos`, no fs/path imports | VERIFIED | grep confirms zero references to any deleted symbol; imports clean (lines 1-11). |
| `src/components/events/event-cards.tsx`                 | No `animate-ping`; no `delay` prop on UpcomingMini/PastEventCard signatures | VERIFIED | Static dot at lines 50-51; signatures take only `event` (+ `priority` on Featured). |
| `src/app/events/page.tsx`                               | No `delay=` on per-item event-card renders | VERIFIED | UpcomingMini/PastEventCard map calls (lines 62-67, 80-85) pass only `event` + `key`. |
| `src/app/globals.css`                                   | No `@keyframes scroll-left`, no `animate-scroll-*` utilities | VERIFIED | grep returns 0 hits. |

### Preserved Artifacts (MOTION-08)

| Artifact                                                | Expected               | Status   | Details |
| ------------------------------------------------------- | ---------------------- | -------- | ------- |
| `src/components/providers/lenis-provider.tsx`           | Byte-identical to origin/main | VERIFIED | `git diff origin/main -- <file>` empty. |
| `src/app/template.tsx`                                  | Byte-identical to origin/main | VERIFIED | Empty diff. AnimatePresence + motion/react fade intact. |
| `src/components/animations/scroll-reveal.tsx`           | Byte-identical to origin/main | VERIFIED | Empty diff. Primitive preserved as Phase 9/10/11 building block. |

### Key Link Verification

| From                           | To                              | Via                                    | Status |
| ------------------------------ | ------------------------------- | -------------------------------------- | ------ |
| `src/app/layout.tsx`           | `lenis-provider.tsx`           | Import + JSX mount (lines 4, 69-75)    | WIRED  |
| `src/app/layout.tsx`           | `template.tsx`                  | Next.js convention (Template wraps children automatically) | WIRED  |
| `src/app/page.tsx`             | `event-cards.tsx`              | Import (lines 5-9) + JSX renders       | WIRED  |
| `src/app/events/page.tsx`      | `event-cards.tsx`              | Import (lines 5-9) + JSX renders       | WIRED  |

### Requirements Coverage

| Requirement | Plan + Summary | Status     | Evidence |
| ----------- | -------------- | ---------- | -------- |
| MOTION-01   | 08-01 (PLAN+SUMMARY) | SATISFIED | `photo-carousel.tsx` deleted; `getCarouselPhotos` + fs/path imports purged from page.tsx. |
| MOTION-02   | 08-02 (PLAN+SUMMARY) | SATISFIED | `rotating-tagline.tsx` deleted; Hero JSX block removed. |
| MOTION-03   | 08-03 (PLAN+SUMMARY) | SATISFIED | `works-carousel.tsx` deleted; minimal `<Link>` list fallback in place. |
| MOTION-04   | 08-04 (PLAN+SUMMARY) | SATISFIED | `writings-carousel.tsx` deleted; `globals.css` scroll-left keyframe + animate-scroll-* utilities purged. |
| MOTION-05   | 08-05 (PLAN+SUMMARY) | SATISFIED | `animate-ping` wrapper removed from FeaturedUpcoming; four-class sweep returns 0. |
| MOTION-06   | 08-06 (PLAN+SUMMARY) | SATISFIED | `delay` prop deleted from 3 signatures + 4 call sites; cascade-pattern grep returns 0. |
| MOTION-08   | 08-07 (PLAN+SUMMARY) | SATISFIED (static) + PENDING_HUMAN (perceptual smoke) | git-diff byte-equality confirmed for all 3 preserved files; perceptual verification queued in 08-HUMAN-UAT.md. |

All 7 requirement IDs declared in ROADMAP Phase 8 have plan + summary pairs (08-01 through 08-07). No orphaned requirements.

### Anti-Patterns Found

| File                                      | Pattern                   | Severity | Impact |
| ----------------------------------------- | ------------------------- | -------- | ------ |
| (none)                                    | TBD/FIXME/XXX/HACK         | —        | Zero debt markers introduced in modified files. |
| (none)                                    | placeholder/coming soon    | —        | Existing fallback copy ("More posts coming soon." etc.) is intentional D-02 design, not stub. |
| (none)                                    | empty returns / hollow JSX | —        | No suspicious empty bodies in modified files. |

### Behavioral Spot-Checks

| Behavior                                              | Command                                                | Result      | Status |
| ----------------------------------------------------- | ------------------------------------------------------ | ----------- | ------ |
| No deleted-carousel component names anywhere in src/  | `grep -rE "PhotoCarousel\|RotatingTagline\|WorksCarousel\|WritingsCarousel" src/` | 0 hits      | PASS |
| No always-on Tailwind animate utility classes in src/ | `grep -rE "animate-(ping\|pulse\|bounce\|spin)" src/`  | 0 hits      | PASS |
| No cascade-by-index delay pattern in src/             | `grep -rE 'delay=\{?[0-9]?\.?[0-9]+\s*\+\s*i\s*\*' src/` | 0 hits    | PASS |
| Preserved files byte-identical to origin/main         | `git diff origin/main -- <3 files>`                    | empty diff  | PASS |
| Phase commits exist for each plan                     | `git log --oneline origin/main..HEAD`                  | 14 phase commits, 1 per plan-code + 1 per plan-docs (07 is docs-only) | PASS |
| `vercel build --prod` exits 0                         | `npx vercel build --prod`                              | (deferred)  | SKIP — see 08-HUMAN-UAT.md Item 1 |

### Probe Execution

No `scripts/*/tests/probe-*.sh` exist in this project and Phase 8 PLAN/SUMMARY files do not declare probe-based verification. Step 7c not applicable.

### Human Verification Required

#### 1. vercel build --prod (D-11 phase gate)

**Test:** Run `npx vercel build --prod` from Monty's Mac at the project root.
**Expected:** Exit 0 with "Build Completed" success line.
**Why human:** Sandbox node_modules is environmentally corrupted (Turbopack ENFILE, webpack framer-motion ESM, vercel-installer Next.js corruption). User pre-approved deferral at session resume.
**Tracked in:** 08-HUMAN-UAT.md Item 1.

#### 2. Lenis smooth scroll + page-load fade smoke test

**Test:** Follow the 9-step script in 08-HUMAN-UAT.md Item 2 (`npm run dev`, visit /, scroll, navigate / → /about → /, confirm fade timing and absence of deleted-component artifacts, check DevTools console).
**Expected:** Scroll feels smoothed (not OS-default snappy); ~200-300ms fade fires on each route change; no PhotoCarousel/RotatingTagline/animate-ping artifacts; clean console.
**Why human:** Plan-07 Task 2 is `type=checkpoint:human-verify gate=blocking` — perceptual verification only a human in a real browser can perform.
**Tracked in:** 08-HUMAN-UAT.md Item 2.

### Gaps Summary

**No code-level gaps.** Every code-side success criterion (#1, #2, #3, and the static preservation portion of #5) is independently verifiable via grep + git-diff and passes. All 7 plan-summary pairs exist with consistent frontmatter. All 7 requirement IDs are covered.

**Two genuinely pending human acceptance items** — neither caused by an implementation defect, both explicitly deferred to 08-HUMAN-UAT.md with user pre-approval at session resume. These are NOT regressions and NOT gaps in the executor's work; they are environmental (vercel build cannot run in this sandbox) and perceptual (no automated check can observe browser-rendered scroll smoothness or fade timing).

**Recommended next step:** Monty runs both items from his Mac per the script in 08-HUMAN-UAT.md, records resolution at the bottom of that file, then runs `gsd-sdk query phase.complete 08` (or `/gsd:phase-complete 08`) to formally close the phase.

---

_Verified: 2026-05-21T04:15:00Z_
_Verifier: Claude (gsd-verifier)_
_Canonical human-verify queue: `.planning/phases/08-motion-subtractions/08-HUMAN-UAT.md`_
