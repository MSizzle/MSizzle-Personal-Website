---
phase: 04-animation-polish
plan: 02
subsystem: scroll-animations
tags: [scroll-reveal, parallax, gsap, motion, hero-cinematic, homepage]
dependency_graph:
  requires: [04-01]
  provides: [scroll-reveal-component, parallax-layer-component, hero-cinematic-component, homepage-animated]
  affects: [homepage, all-pages-with-ScrollReveal]
tech_stack:
  added: []
  patterns: [whileInView-play-once, useScroll-useTransform-parallax, gsap-scrolltrigger-stagger, useReducedMotion-gate]
key_files:
  created:
    - src/components/animations/scroll-reveal.tsx
    - src/components/animations/parallax-layer.tsx
    - src/components/home/hero-cinematic.tsx
  modified:
    - src/app/page.tsx
decisions:
  - "Writing section heading uses ParallaxLayer nested inside ScrollReveal — scroll reveal triggers entry, then parallax drives ongoing rotation [-2,2] degrees as user scrolls"
  - "Contact section has ScrollReveal only (no ParallaxLayer) — avoids scroll-end parallax jank when section is at bottom of page"
  - "ParallaxLayer wraps section container in hero (not HeroCinematic inner) — allows parallax to affect entire section background while GSAP handles stagger of individual hero-element children"
metrics:
  duration: "~2 minutes"
  completed_date: "2026-04-02"
  tasks_completed: 2
  tasks_total: 2
  files_changed: 4
requirements_satisfied: [HOME-03, DSGN-04]
---

# Phase 04 Plan 02: Scroll Animations & Homepage Polish Summary

**One-liner:** ScrollReveal (whileInView play-once) and ParallaxLayer (useScroll+useTransform multi-speed) components applied to all 5 homepage sections with GSAP cinematic staggered hero entry.

## What Was Built

### Task 1: ScrollReveal and ParallaxLayer Components

**`src/components/animations/scroll-reveal.tsx`**
- Client component using `m.div` from `motion/react`
- Initial state: `opacity: 0`, `y: 60px`, `scale: 0.95`
- Animated state: `opacity: 1`, `y: 0`, `scale: 1`
- Trigger: 30% of element inside viewport (`viewport={{ once: true, amount: 0.3 }}`)
- Duration: 600ms, easing: easeOut
- Stagger support via `delay` prop (0.15s increments)
- Reduced motion: renders plain `<div>` with no motion wrapper

**`src/components/animations/parallax-layer.tsx`**
- Client component using `useScroll` + `useTransform` from `motion/react`
- `speed` prop controls y-axis drift: `y = speed * -30%` over full scroll range
- `rotate` prop: optional `[start, end]` degrees mapped to scrollYProgress
- Uses target ref with `["start end", "end start"]` offset for element-relative scroll tracking
- Reduced motion: renders static `<div>` with ref, no parallax applied

### Task 2: Homepage Animations Applied

**`src/components/home/hero-cinematic.tsx`**
- Client component using `useGSAP` from `@gsap/react`
- GSAP ScrollTrigger staggered entry: `.hero-element` children animate at 0.15s intervals
- Duration: 0.8s, easing: power2.out
- ScrollTrigger start: `"top 70%"` (= 30% into viewport), `once: true`
- Registers `ScrollTrigger` and `useGSAP` at module scope
- Reduced motion: `useReducedMotion()` check inside `useGSAP` — skips GSAP initialization

**`src/app/page.tsx`** (Server Component — no `"use client"` added)
- Hero: `ParallaxLayer speed={0.2}` wrapping `HeroCinematic`, 4 `hero-element` children
- About: `ParallaxLayer speed={0.5}` + 3 staggered `ScrollReveal` (delays: 0, 0.15, 0.3)
- Projects: `ParallaxLayer speed={0.3}` + 3 staggered `ScrollReveal`
- Writing: `ScrollReveal` + `ParallaxLayer speed={0.5} rotate={[-2, 2]}` on heading + 2 more `ScrollReveal`
- Contact: 3 staggered `ScrollReveal` only (no parallax)
- JSON-LD script tag preserved
- All 5 sections and existing content preserved

## Deviations from Plan

None — plan executed exactly as written.

## Commits

| Task | Commit | Description |
|------|--------|-------------|
| 1 | `2cf945b` | feat(04-02): create ScrollReveal and ParallaxLayer animation components |
| 2 | `0b1f9d8` | feat(04-02): apply scroll reveals, parallax layers, and GSAP cinematic entry to homepage |

## Test Results

```
scroll-reveal.test.tsx: 2 tests PASSED
project-card.test.tsx: 1 test FAILED (pre-existing Wave 0 stub — expected until 04-03)
All other tests: PASSED
Next.js build: SUCCESS
```

## Known Stubs

None — all animation components are fully wired. The project-card.test.tsx failure is a pre-existing Wave 0 stub from Plan 01, not introduced by this plan.

## Self-Check: PASSED
