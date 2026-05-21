---
phase: 04-animation-polish
plan: 03
subsystem: ui
tags: [motion, animation, scroll-reveal, project-card, hover-overlay, reduced-motion, mobile-tap]

# Dependency graph
requires:
  - phase: 04-01
    provides: [gsap-lenis-sync, motion-config-reduced-motion, page-transitions-fade-slide]
  - phase: 04-02
    provides: [scroll-reveal-component, parallax-layer-component, homepage-animated]
provides:
  - project-card-hover-reveal-overlay
  - site-wide-scroll-reveal-coverage
  - mobile-tap-fallback-for-project-cards
affects: [all-pages-with-projects-grid]

# Tech tracking
tech-stack:
  added: []
  patterns: [AnimatePresence-overlay-pattern, click-outside-mobile-dismiss, server-component-with-client-child-animation]

key-files:
  created: []
  modified:
    - src/components/projects/project-card.tsx
    - src/app/projects/page.tsx
    - src/app/blog/page.tsx
    - src/app/about/page.tsx
    - src/app/links/page.tsx

key-decisions:
  - "ProjectCard converted to 'use client' — required for useState, useEffect, and Motion AnimatePresence"
  - "Overlay slide direction is y:100% (slide up from bottom) — not fade — per D-08 UI-SPEC"
  - "Title link in card body gets e.stopPropagation() — prevents overlay toggle when clicking through to project page"
  - "Blog page ScrollReveal wraps TagFilter container — TagFilter is a client component already, wrapping its container in a server-friendly ScrollReveal is safe"
  - "About page split into 4 staggered ScrollReveal blocks at 0/0.15/0.30/0.45 delays for smooth cascade"

patterns-established:
  - "AnimatePresence overlay: use y:100% slide-up with shouldReduceMotion falling back to opacity-only at duration:0"
  - "Click-outside dismiss: useRef on card + document mousedown/touchstart in useEffect, cleaned up on unmount"
  - "Server pages + ScrollReveal: import ScrollReveal from client component, use directly in Server Component JSX — no use client needed on page"

requirements-completed: [PORT-02, DSGN-04]

# Metrics
duration: ~8min
completed: 2026-04-02
---

# Phase 04 Plan 03: Project Card Hover-Reveal Overlay & Site-wide ScrollReveal Summary

**Motion AnimatePresence hover-reveal overlay on ProjectCard (slide-up CTA with mobile tap-dismiss) plus ScrollReveal stagger animations on all 4 non-homepage pages (projects, blog, about, links).**

## Performance

- **Duration:** ~8 minutes
- **Started:** 2026-04-02T17:48:00Z
- **Completed:** 2026-04-02T17:56:00Z
- **Tasks:** 2 of 3 (Task 3 is a human-verify checkpoint — awaiting visual verification)
- **Files modified:** 5

## Accomplishments

- ProjectCard upgraded from Server Component to Client Component with AnimatePresence hover-reveal overlay
- Overlay slides up from bottom (y: 100%) with 250ms ease, bg-black/75, "View Project" CTA with 44px touch target
- Mobile tap toggle + tap-outside dismiss via click-outside listener (D-09)
- prefers-reduced-motion: overlay appears instantly (opacity-only, duration 0)
- All 4 non-homepage pages now have staggered ScrollReveal on major content sections
- Pages remain Server Components — only ProjectCard is client-side

## Task Commits

1. **Task 1: Upgrade ProjectCard with hover-reveal overlay** - `24a6427` (feat)
2. **Task 2: Apply ScrollReveal to all non-homepage pages** - `cec3f42` (feat)
3. **Task 3: Visual verification checkpoint** - PENDING (human-verify checkpoint, not executed)

## Files Created/Modified

- `src/components/projects/project-card.tsx` - Added "use client", AnimatePresence overlay with y:100% slide, mobile tap fallback, click-outside dismiss, useReducedMotion support
- `src/app/projects/page.tsx` - Added ScrollReveal import, heading (delay 0) + grid (delay 0.15) wrapped
- `src/app/blog/page.tsx` - Added ScrollReveal import, heading (delay 0) + posts section (delay 0.15) wrapped
- `src/app/about/page.tsx` - Added ScrollReveal import, 4 staggered sections (0 / 0.15 / 0.30 / 0.45)
- `src/app/links/page.tsx` - Added ScrollReveal import, heading (delay 0) + links list (delay 0.15)

## Decisions Made

- ProjectCard converted to `"use client"` — required for useState, useEffect, and Motion AnimatePresence (was Server Component)
- Overlay slide direction is `y: "100%"` (slide up from bottom) per D-08 UI-SPEC
- Title link in card body also gets `e.stopPropagation()` — prevents overlay toggle when user navigates to project detail
- Blog page ScrollReveal wraps TagFilter container safely — TagFilter is already a client component; ScrollReveal wrapping its server-side container is safe
- About page content split across 4 ScrollReveal blocks to allow fine-grained cascade (heading / intro+edu / career / skills)

## Deviations from Plan

None — plan executed exactly as written. The spec provided a complete replacement for project-card.tsx and the scroll-reveal wrapping approach was straightforward.

## Issues Encountered

None.

## Checkpoint Status

**Task 3 (human-verify)** is a blocking checkpoint that was NOT executed per orchestrator instructions. It requires:

1. Start dev server (`npm run dev`) and open http://localhost:3000
2. Verify page transitions between all routes
3. Verify homepage scroll animations (GSAP cinematic hero, parallax)
4. Verify project card hover overlay on /projects (slide-up, "View Project" CTA, tap-dismiss on mobile)
5. Verify site-wide scroll reveals on /blog, /about, /links
6. Verify reduced motion: enable macOS Accessibility > Reduce Motion, all animations suppressed
7. Verify mobile performance: Chrome DevTools 6x CPU throttle, no frames below 30fps

Resume signal: Type "approved" if all animations look correct, or describe issues.

## Known Stubs

None — all animation components are fully wired.

## Next Phase Readiness

- All animation code complete and building successfully
- Awaiting human visual verification (Task 3 checkpoint) before phase can be marked done
- After approval, Phase 4 animation & polish is complete — ready for Phase 5 (Analytics)

---
*Phase: 04-animation-polish*
*Completed: 2026-04-02*

## Self-Check: PASSED

Files exist:
- src/components/projects/project-card.tsx: FOUND
- src/app/projects/page.tsx: FOUND
- src/app/blog/page.tsx: FOUND
- src/app/about/page.tsx: FOUND
- src/app/links/page.tsx: FOUND

Commits exist:
- 24a6427: FOUND (feat(04-03): upgrade ProjectCard)
- cec3f42: FOUND (feat(04-03): apply ScrollReveal)
