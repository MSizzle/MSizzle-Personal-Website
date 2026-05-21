---
phase: 04-animation-polish
verified: 2026-04-02T20:35:00Z
status: human_needed
score: 12/12 automated must-haves verified
human_verification:
  - test: "Page transitions between all routes (Home -> Projects -> Blog -> About -> Links)"
    expected: "Fade+slide exit (~200ms), then fade+slide enter (~300ms). Total ~400ms with mode=wait. No flicker. Works in both Chrome and Safari."
    why_human: "AnimatePresence behavior requires browser rendering — cannot verify timing and visual smoothness programmatically."
  - test: "Homepage scroll animations — GSAP cinematic hero stagger entry"
    expected: "Profile photo, h1, tagline, CTA buttons stagger in at 0.15s intervals (opacity 0+y60+scale0.95 to final state) when hero is 30% in viewport. Plays once only."
    why_human: "GSAP ScrollTrigger requires a real browser scroll context — jsdom does not scroll."
  - test: "Homepage parallax — background layers shift at different speeds"
    expected: "Hero section drifts at speed=0.2, About at 0.5, Projects at 0.3. Writing heading rotates -2 to +2 degrees. Effect is subtle, not jarring."
    why_human: "useScroll+useTransform parallax requires real scroll position in a real viewport."
  - test: "Project card hover overlay on /projects"
    expected: "Desktop: hover over card image triggers black/75 overlay sliding up from bottom with 'View Project' CTA. Mouse leave dismisses with reverse slide (~250ms). Mobile: first tap shows overlay, second tap or tap-outside dismisses."
    why_human: "Hover state and overlay animation require real browser interaction — cannot simulate in unit tests."
  - test: "Reduced motion suppression — enable macOS Accessibility > Reduce Motion"
    expected: "Page transitions: opacity-only (no y-axis slide), 150ms. Homepage: no parallax, no scroll animations, content static. Project cards: overlay appears/disappears instantly (duration 0, no slide). Lenis disabled, native scroll active."
    why_human: "prefers-reduced-motion media query only activates in a real browser environment with accessibility setting enabled."
  - test: "Mobile performance — Chrome DevTools 6x CPU throttle at 375px viewport"
    expected: "Scrolling through homepage with animations active produces no frames below 30fps in Performance panel."
    why_human: "Frame rate measurement requires real rendering pipeline — cannot assess in static analysis."
---

# Phase 04: Animation & Polish Verification Report

**Phase Goal:** Layer on all animations so the site feels "alive and memorable" — the core design value proposition.
**Verified:** 2026-04-02T20:35:00Z
**Status:** HUMAN_NEEDED — all automated checks pass, 6 items require visual/browser verification
**Re-verification:** No — initial verification

---

## Goal Achievement

### Observable Truths

| # | Truth | Status | Evidence |
|---|-------|--------|----------|
| 1 | GSAP and @gsap/react are installed and importable | VERIFIED | `node -e "require('gsap'); require('@gsap/react')"` exits 0; package.json has `gsap@^3.14.2` and `@gsap/react@^2.1.2` |
| 2 | Lenis smooth scroll is synced to GSAP ticker (no standalone RAF loop) | VERIFIED | `lenis-provider.tsx` has `gsap.ticker.add(tickerFn)` + `lenis.raf(time * 1000)`. `requestAnimationFrame` grep returns 0. |
| 3 | Page transitions use fade+slide (opacity + y-axis) not opacity-only | VERIFIED | `template.tsx` has `y: 20` (enter) and `y: 10` (exit) in variants object |
| 4 | prefers-reduced-motion suppresses y-axis transforms in page transitions | VERIFIED | `shouldReduceMotion ? { opacity: 0 } : { opacity: 0, y: 20 }` pattern in `template.tsx` |
| 5 | prefers-reduced-motion disables Lenis entirely (native scroll returns) | VERIFIED | `lenis-provider.tsx`: `if (shouldReduceMotion) return;` inside useEffect before Lenis instantiation |
| 6 | MotionConfig reducedMotion='user' wraps all Motion components site-wide | VERIFIED | `motion-provider.tsx` wraps children in `<MotionConfig reducedMotion="user">` |
| 7 | Homepage sections animate in on scroll with slide-up + scale effect | VERIFIED | `scroll-reveal.tsx`: `initial={{ opacity: 0, y: 60, scale: 0.95 }}`, `whileInView={{ opacity: 1, y: 0, scale: 1 }}` |
| 8 | Homepage has parallax layers at different speeds on section backgrounds | VERIFIED | `page.tsx` has `ParallaxLayer speed={0.2}` (hero), `speed={0.5}` (about), `speed={0.3}` (projects), `speed={0.5} rotate={[-2, 2]}` (writing heading) |
| 9 | Scroll animations trigger at 30% viewport entry | VERIFIED | `scroll-reveal.tsx`: `viewport={{ once: true, amount: 0.3 }}` |
| 10 | Animations play once only — no replay on re-enter | VERIFIED | `scroll-reveal.tsx`: `viewport={{ once: true, ... }}` |
| 11 | prefers-reduced-motion renders homepage sections statically with no transforms | VERIFIED | `scroll-reveal.tsx`: `if (shouldReduceMotion) return <div ...>{children}</div>` — no motion wrapper |
| 12 | Project cards show overlay with 'View Project' CTA on desktop hover | VERIFIED | `project-card.tsx`: `AnimatePresence` + `m.div` overlay with `onMouseEnter/Leave` toggling `overlayVisible` state; overlay contains `View Project &rarr;` |
| 13 | Project cards show overlay on first mobile tap, dismiss on second tap or tap-outside | VERIFIED | `project-card.tsx`: `onClick={() => setOverlayVisible(v => !v)}` + `useEffect` adding `mousedown`/`touchstart` listeners for click-outside dismiss |
| 14 | Blog listing, projects grid, about page, and links page all have scroll-reveal animations | VERIFIED | All 4 pages import `ScrollReveal` from `@/components/animations/scroll-reveal`; counts: projects=7, blog=7, about=9, links=5 |
| 15 | Scroll reveals on non-homepage pages trigger at 30% viewport, play once | VERIFIED | Same `ScrollReveal` component used (inherits `viewport={{ once: true, amount: 0.3 }}`) |
| 16 | prefers-reduced-motion shows overlay instantly (no slide), scroll reveals render static | VERIFIED | `project-card.tsx`: `duration: shouldReduceMotion ? 0 : 0.25`; `scroll-reveal.tsx`: plain `<div>` returned when reduced motion active |

**Score:** 16/16 truths verified (automated)

---

## Required Artifacts

### Plan 01 Artifacts

| Artifact | Expected | Status | Details |
|----------|----------|--------|---------|
| `package.json` | gsap + @gsap/react deps | VERIFIED | `gsap@^3.14.2`, `@gsap/react@^2.1.2` present in dependencies |
| `src/components/providers/lenis-provider.tsx` | GSAP ticker sync, ScrollTrigger, reduced-motion gate | VERIFIED | `gsap.ticker.add`, `ScrollTrigger.update` sync, `if (shouldReduceMotion) return` |
| `src/components/providers/motion-provider.tsx` | MotionConfig reducedMotion='user' | VERIFIED | `<MotionConfig reducedMotion="user">` wraps LazyMotion |
| `src/app/template.tsx` | Fade+slide page transition | VERIFIED | `useReducedMotion`, `y: 20`/`y: 10` variants, `mode="wait"` |

### Plan 02 Artifacts

| Artifact | Expected | Status | Details |
|----------|----------|--------|---------|
| `src/components/animations/scroll-reveal.tsx` | Reusable whileInView scroll-reveal | VERIFIED | `whileInView`, `viewport={{ once: true, amount: 0.3 }}`, reduced-motion gate |
| `src/components/animations/parallax-layer.tsx` | useScroll+useTransform parallax | VERIFIED | `useScroll`, `useTransform`, speed prop, rotate prop, reduced-motion gate |
| `src/components/home/hero-cinematic.tsx` | GSAP cinematic hero | VERIFIED | `useGSAP`, `ScrollTrigger`, stagger 0.15, `start: "top 70%"`, `once: true` |
| `src/app/page.tsx` | Homepage with animation wrappers | VERIFIED | 4 `hero-element` children, 4 `ParallaxLayer` instances, 9 `ScrollReveal` instances, JSON-LD preserved, no `"use client"` |

### Plan 03 Artifacts

| Artifact | Expected | Status | Details |
|----------|----------|--------|---------|
| `src/components/projects/project-card.tsx` | Hover-reveal overlay with CTA | VERIFIED | `"use client"`, `AnimatePresence`, `y: "100%"` slide, `bg-black/75`, "View Project", `min-h-[44px]`, mobile tap logic |
| `src/app/projects/page.tsx` | ScrollReveal wrappers, no use client | VERIFIED | 7 ScrollReveal uses, no `"use client"` |
| `src/app/blog/page.tsx` | ScrollReveal wrappers, no use client | VERIFIED | 7 ScrollReveal uses, no `"use client"` |
| `src/app/about/page.tsx` | ScrollReveal wrappers, no use client | VERIFIED | 9 ScrollReveal uses, no `"use client"` |
| `src/app/links/page.tsx` | ScrollReveal wrappers, no use client | VERIFIED | 5 ScrollReveal uses, no `"use client"` |

---

## Key Link Verification

### Plan 01 Key Links

| From | To | Via | Status | Details |
|------|----|-----|--------|---------|
| `lenis-provider.tsx` | gsap | `gsap.ticker.add` with `time * 1000` | WIRED | Pattern present at line 31 |
| `template.tsx` | `motion/react` | `useReducedMotion` conditional variants | WIRED | `useReducedMotion` imported and used in variants logic |

### Plan 02 Key Links

| From | To | Via | Status | Details |
|------|----|-----|--------|---------|
| `page.tsx` | `scroll-reveal.tsx` | `import ScrollReveal` | WIRED | Line 2: `import { ScrollReveal } from "@/components/animations/scroll-reveal"` |
| `page.tsx` | `parallax-layer.tsx` | `import ParallaxLayer` | WIRED | Line 3: `import { ParallaxLayer } from "@/components/animations/parallax-layer"` |
| `scroll-reveal.tsx` | `motion/react` | `m.div whileInView with viewport.once` | WIRED | `viewport={{ once: true, amount: 0.3 }}` at line 23 |

### Plan 03 Key Links

| From | To | Via | Status | Details |
|------|----|-----|--------|---------|
| `project-card.tsx` | `motion/react` | `AnimatePresence + m.div` for overlay slide | WIRED | `AnimatePresence` wraps overlay `m.div` at line 55-88 |
| `projects/page.tsx` | `scroll-reveal.tsx` | `import ScrollReveal` | WIRED | `from.*animations/scroll-reveal` pattern confirmed |

---

## Data-Flow Trace (Level 4)

Animation components do not render dynamic data from an API or database — they render children passed as props. No Level 4 data-flow trace is applicable. The `ProjectCard` renders project data passed as a prop from its parent page, which is wired to Notion CMS (verified in Phase 3, out of scope here).

---

## Behavioral Spot-Checks

| Behavior | Command | Result | Status |
|----------|---------|--------|--------|
| GSAP modules importable | `node -e "require('gsap'); require('@gsap/react'); console.log('OK')"` | `GSAP OK` | PASS |
| ScrollTrigger importable | `node -e "const ST = require('gsap/ScrollTrigger').default; console.log(typeof ST)"` | `function` | PASS |
| @gsap/react useGSAP importable | `node -e "const { useGSAP } = require('@gsap/react'); console.log(typeof useGSAP)"` | `function` | PASS |
| All 5 test files pass | `npx vitest run [all 5 test files]` | `5 passed (5), Tests 10 passed (10)` | PASS |
| Next.js build succeeds | `npx next build` | Exit 0, all routes prerendered cleanly | PASS |
| standalone RAF removed | `grep -c "requestAnimationFrame" lenis-provider.tsx` | `0` | PASS |

---

## Requirements Coverage

| Requirement | Source Plan | Description | Status | Evidence |
|-------------|------------|-------------|--------|----------|
| HOME-03 | 04-01, 04-02 | GSAP scroll-triggered animations and parallax effects | SATISFIED | GSAP installed, `hero-cinematic.tsx` uses `useGSAP` with ScrollTrigger stagger; `parallax-layer.tsx` wired to homepage |
| HOME-04 | 04-01 | Lenis smooth scrolling across the entire site | SATISFIED | `lenis-provider.tsx` uses GSAP ticker sync, no standalone RAF; mounted in layout |
| PORT-02 | 04-01, 04-03 | Hover-reveal interactions on project cards | SATISFIED | `project-card.tsx` has `AnimatePresence` overlay with `onMouseEnter/Leave`, mobile tap toggle, click-outside dismiss |
| DSGN-03 | 04-01 | Animated page transitions between routes | SATISFIED | `template.tsx` uses `AnimatePresence mode="wait"` + fade+slide variants; reduced-motion fallback active |
| DSGN-04 | 04-02, 04-03 | Scroll reveal animations (elements animate in on scroll) | SATISFIED | `scroll-reveal.tsx` with `whileInView` + play-once; wired to homepage (9 uses), projects (7), blog (7), about (9), links (5) |

No orphaned requirements — all 5 requirement IDs appear in plan frontmatter and are covered by verified artifacts.

---

## Anti-Patterns Found

| File | Line | Pattern | Severity | Impact |
|------|------|---------|----------|--------|
| `src/app/page.tsx` | 33 | `{/* Profile photo placeholder */}` — comment only, `div` with bg color where real image will go | Info | Hero circle is a placeholder div, not a real profile photo. Not a stub in the animation sense — the animation wraps it correctly. Photo swap is a content concern, not an animation concern. |

No blockers or warnings found. The profile photo placeholder is cosmetic and pre-dates this phase.

---

## Human Verification Required

### 1. Page Transition Quality

**Test:** Navigate between Home, Projects, Blog, About, and Links pages by clicking nav links.
**Expected:** Each transition shows a fade-out+slide-down exit (~200ms), followed by a fade-in+slide-up enter (~300ms). Total ~400ms. Should feel snappy, not sluggish. Test in Chrome and Safari.
**Why human:** AnimatePresence timing and visual smoothness require real browser rendering.

### 2. Homepage GSAP Cinematic Hero Entry

**Test:** Open http://localhost:3000 and scroll until the hero is ~30% in viewport (or if it starts in view, hard-refresh and observe).
**Expected:** Profile photo circle, "Hey, I'm Monty." heading, tagline paragraph, and CTA buttons stagger in at 0.15s intervals with `opacity 0 + y 60px + scale 0.95` to final state. Should feel cinematic. Plays once only — scroll away and back, elements stay visible.
**Why human:** GSAP ScrollTrigger requires real browser scroll context.

### 3. Homepage Parallax Depth Layers

**Test:** Scroll slowly through the entire homepage.
**Expected:** Hero section content drifts upward at speed=0.2, About section at speed=0.5 (faster drift), Projects at speed=0.3. Writing section heading rotates subtly from -2 to +2 degrees while scrolling. Parallax feels like depth, not jank.
**Why human:** `useScroll`+`useTransform` parallax requires real scroll position in viewport.

### 4. Project Card Hover-Reveal Overlay (Desktop + Mobile)

**Test:** Visit /projects. Hover over a project card image on desktop. On mobile (or DevTools 375px), tap a card.
**Expected:**
- Desktop: dark `bg-black/75` overlay slides up from bottom (y: 100% → 0) in 250ms. Shows "View Project →" CTA in accent color with 44px touch target and tags. Mouse-leave reverses slide.
- Mobile: first tap shows overlay, second tap on card or tap elsewhere dismisses it.
**Why human:** Hover state, slide animation, and touch interaction require real browser interaction.

### 5. Reduced Motion Suppression (All Systems)

**Test:** Enable macOS System Settings > Accessibility > Display > Reduce Motion. Reload http://localhost:3000.
**Expected:**
- Page transitions: instant opacity change only, no y-axis movement, 150ms
- Homepage: no parallax drift, no scroll reveal animations, all content immediately visible
- Project cards: overlay appears/disappears instantly on hover (duration: 0, no slide)
- Scroll: native scroll behavior (no Lenis momentum)
**Why human:** `prefers-reduced-motion` media query only activates with system accessibility setting in a real browser.

### 6. Mobile Animation Performance

**Test:** Chrome DevTools > More tools > Performance. Set CPU throttle to 6x slowdown. Switch to 375px viewport (iPhone SE). Record while scrolling through the homepage.
**Expected:** No frames drop below 30fps. Animations should stay on the GPU-composited path (opacity + transform only). No layout thrash.
**Why human:** Frame rate measurement requires real rendering pipeline.

---

## Build Verification

```
Next.js build: EXIT 0
Routes prerendered:
  / (Static)
  /about (Static)
  /blog (Static, ISR 30m)
  /blog/[slug] (SSG)
  /projects (Static, ISR 30m)
  /projects/[slug] (SSG)
  /links (Static)
  All OG image routes (Dynamic)
```

---

## Gaps Summary

No gaps found. All 16 automated observable truths verified. All 13 artifacts exist, are substantive, and are wired. All key links confirmed. All 5 requirement IDs satisfied. Build succeeds. 10/10 tests pass.

The only open items are 6 human verification checkpoints for visual quality, timing feel, and accessibility behavior — all of which require a real browser and cannot be assessed programmatically. These are expected for an animation phase.

---

_Verified: 2026-04-02T20:35:00Z_
_Verifier: Claude (gsd-verifier)_
