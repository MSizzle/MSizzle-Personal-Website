---
phase: 04-animation-polish
plan: 01
subsystem: animation-infrastructure
tags: [gsap, lenis, motion, reduced-motion, page-transitions, testing]
dependency_graph:
  requires: []
  provides: [gsap-lenis-sync, motion-config-reduced-motion, page-transitions-fade-slide, wave0-test-scaffolds]
  affects: [all-subsequent-animation-plans]
tech_stack:
  added: [gsap@3.14.2, "@gsap/react@2.1.2"]
  patterns: [gsap-ticker-sync, useReducedMotion-gate, motion-variants-pattern]
key_files:
  created:
    - src/__tests__/animations/template.test.tsx
    - src/__tests__/animations/scroll-reveal.test.tsx
    - src/__tests__/animations/gsap-setup.test.tsx
    - src/__tests__/components/project-card.test.tsx
    - src/__tests__/providers/lenis-provider.test.tsx
  modified:
    - package.json
    - package-lock.json
    - src/components/providers/lenis-provider.tsx
    - src/components/providers/motion-provider.tsx
    - src/app/template.tsx
decisions:
  - "GSAP ticker drives Lenis (no standalone RAF loop) — prevents animation desyncs with ScrollTrigger"
  - "MotionConfig reducedMotion='user' applied at provider level — all m.* components inherit a11y behavior"
  - "Page transitions use variants object pattern — cleaner conditional logic for reduced-motion support"
  - "Lenis mock uses class constructor pattern (not vi.fn factory) — required for 'new Lenis()' calls"
metrics:
  duration: "~10 minutes"
  completed_date: "2026-04-03"
  tasks_completed: 3
  tasks_total: 3
  files_changed: 10
requirements_satisfied: [HOME-04, DSGN-03]
---

# Phase 04 Plan 01: Animation Infrastructure Setup Summary

**One-liner:** GSAP+Lenis ticker sync with ScrollTrigger registration, MotionConfig reducedMotion site-wide, fade+slide page transitions with prefers-reduced-motion fallback, and Wave 0 test scaffolds for all 5 phase requirements.

## What Was Built

### Task 1: GSAP Install + Provider Upgrades
- Installed `gsap@3.14.2` and `@gsap/react@2.1.2`
- Rewrote `LenisProvider` to replace standalone `requestAnimationFrame` loop with `gsap.ticker.add()` — GSAP drives Lenis at the correct tick rate
- Added `ScrollTrigger.update` sync on `lenis.on("scroll", ...)` — scroll position flows to GSAP ScrollTrigger
- Added `gsap.ticker.lagSmoothing(0)` — prevents scroll jumps when tab loses and regains focus
- Added `useReducedMotion()` gate — when `prefers-reduced-motion: reduce` is active, Lenis is skipped entirely and native scroll is restored
- Added `MotionConfig reducedMotion="user"` to `MotionProvider` — all `m.*` components across the site automatically suppress transforms when user prefers reduced motion

### Task 2: Page Transition Upgrade
- Replaced opacity-only fade with fade+slide variants
- Enter: `opacity: 0, y: 20` → `opacity: 1, y: 0` at 300ms ease-out
- Exit: `opacity: 1, y: 0` → `opacity: 0, y: 10` at 300ms ease-out
- Reduced motion: `y` suppressed, opacity-only at 150ms
- Refactored to `variants` object pattern for clean conditional logic

### Task 3: Wave 0 Test Scaffolds
Created test files covering all 5 phase requirements:
- `gsap-setup.test.tsx` — HOME-03: verifies gsap, ScrollTrigger, useGSAP are importable (**passes**)
- `lenis-provider.test.tsx` — HOME-04: verifies LenisProvider renders children with mocked GSAP ticker (**passes**)
- `template.test.tsx` — DSGN-03: verifies page transition renders children in motion wrapper (**passes**)
- `scroll-reveal.test.tsx` — DSGN-04: stub tests for ScrollReveal component (will pass once component created in 04-02)
- `project-card.test.tsx` — PORT-02: stub tests for ProjectCard hover-reveal (will pass once component upgraded in 04-03)

## Deviations from Plan

### Auto-fixed Issues

**1. [Rule 1 - Bug] Lenis mock used arrow function factory instead of class constructor**
- **Found during:** Task 3, first test run
- **Issue:** `vi.fn().mockImplementation(() => ({ ... }))` creates a factory function, not a constructor. `new Lenis()` threw `TypeError: () => ({...}) is not a constructor`
- **Fix:** Changed to `class MockLenis { on = vi.fn(); raf = vi.fn(); destroy = vi.fn(); }` with `default: MockLenis` export
- **Files modified:** `src/__tests__/providers/lenis-provider.test.tsx`
- **Commit:** `0b36805`

**2. [Rule 1 - Bug] Template test used `getByTestId` with multiple elements in DOM**
- **Found during:** Task 3, first test run
- **Issue:** Two `render()` calls in the same test suite left both motion divs in the jsdom DOM; `getByTestId` throws when multiple elements match
- **Fix:** Changed to `getAllByTestId` and asserted `length > 0`
- **Files modified:** `src/__tests__/animations/template.test.tsx`
- **Commit:** `0b36805`

## Commits

| Task | Commit | Description |
|------|--------|-------------|
| 1 | `dfe62f8` | feat(04-01): install GSAP, wire GSAP ticker sync, add MotionConfig reducedMotion |
| 2 | `144f93f` | feat(04-01): upgrade page transitions to fade+slide with reduced-motion support |
| 3 | `0b36805` | test(04-01): add Wave 0 test scaffolds for all phase requirements |

## Known Stubs

- `scroll-reveal.test.tsx` — imports `@/components/animations/scroll-reveal` which doesn't exist yet. Tests will fail until 04-02 creates the ScrollReveal component.
- `project-card.test.tsx` — imports `@/components/projects/project-card` which may not have the hover-reveal overlay yet. Tests will fail until 04-03 upgrades the ProjectCard.

These are intentional Wave 0 stubs — they establish the test contract before implementation.

## Test Results

```
3 test files passed (gsap-setup, lenis-provider, template)
2 test files are Wave 0 stubs (scroll-reveal, project-card) — expected to fail until components created
```
