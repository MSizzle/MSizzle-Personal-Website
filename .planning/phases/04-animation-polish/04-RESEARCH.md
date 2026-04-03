# Phase 4: Animation & Polish - Research

**Researched:** 2026-04-02
**Domain:** Motion/React animations, GSAP ScrollTrigger, Lenis GSAP sync, prefers-reduced-motion, page transitions
**Confidence:** HIGH

---

<user_constraints>
## User Constraints (from CONTEXT.md)

### Locked Decisions

- **D-01:** Fade + subtle slide transition between all routes. Exit: opacity 1->0, y 0->10px (200ms). Enter: opacity 0->1, y 20px->0 (300ms). Total ~400ms, ease-out easing. Upgrade the existing `template.tsx` opacity-only fade.
- **D-02:** Uniform transitions everywhere — no per-route variations. Same fade+slide on all routes.
- **D-03:** Bold & cinematic scroll animations on the homepage. Content slides up 60-80px + scale 0.95->1 on enter. Staggered children at 0.15s delay. Trigger at 30% into viewport.
- **D-04:** Multiple parallax layers on the homepage — section backgrounds shift at different speeds, decorative elements drift, text elements have subtle rotation.
- **D-05:** Scroll-reveal animations apply to ALL pages (blog listing, projects grid, about page), not just homepage. Consistent animated feel site-wide.
- **D-06:** Animations play once only — elements animate the first time they enter viewport, then stay visible. No replay on re-enter.
- **D-07:** GSAP must be installed and synced with Lenis via RAF ticker in the root layout before any ScrollTrigger sequences are authored.
- **D-08:** Overlay with CTA on hover — semi-transparent overlay slides up over the card image area with a "View Project ->" button and tags. Title and description remain visible below.
- **D-09:** Mobile tap fallback — first tap shows the overlay with CTA, second tap or tap elsewhere dismisses it. Mirrors desktop hover behavior.
- **D-10:** Full suppression when `prefers-reduced-motion: reduce` is active. No scroll animations, no parallax, no page transition slide (instant opacity swap only), no card hover animation (instant state change), Lenis smooth scroll disabled. Elements just appear.

### Claude's Discretion

- Exact easing curves and spring configs for Motion animations
- GSAP timeline structure and ScrollTrigger pin behavior details
- Which decorative elements get parallax treatment on the homepage
- Stagger timing fine-tuning across different page types
- Whether to use `react-intersection-observer` for simpler reveal triggers or GSAP ScrollTrigger for everything

### Deferred Ideas (OUT OF SCOPE)

None — discussion stayed within phase scope.
</user_constraints>

---

<phase_requirements>
## Phase Requirements

| ID | Description | Research Support |
|----|-------------|------------------|
| HOME-03 | GSAP scroll-triggered animations and parallax effects on homepage | GSAP + ScrollTrigger + Lenis sync pattern; useScroll + useTransform for parallax layers |
| HOME-04 | Lenis smooth scrolling across the entire site (full integration) | Scaffold exists in LenisProvider; needs GSAP ticker sync and reduced-motion disable |
| PORT-02 | Hover-reveal interactions on project cards | Motion whileHover + useState tap fallback; project-card.tsx already has image area to overlay |
| DSGN-03 | Animated page transitions between routes | template.tsx already scaffolded; upgrade from opacity-only to fade+slide per D-01 |
| DSGN-04 | Scroll reveal animations — elements animate in on scroll | Motion whileInView + viewport.once; apply site-wide via ScrollReveal wrapper component |
</phase_requirements>

---

## Summary

Phase 4 is an animation layer phase — all pages exist (Phase 3 complete), so this phase is purely additive: no data fetching, no routing changes, no structural changes. The goal is wiring up five animation systems: page transitions (template.tsx upgrade), scroll reveals (site-wide whileInView), homepage parallax (useScroll + useTransform or GSAP ScrollTrigger), the GSAP+Lenis RAF sync (the one critical infrastructure change), and project card hover-reveal.

The most important technical constraint is the GSAP + Lenis sync (D-07). The existing `LenisProvider` runs its own RAF loop. When GSAP ScrollTrigger is added, Lenis must hand its RAF control to GSAP's ticker — otherwise scroll positions desync and ScrollTrigger animations fire at wrong positions. This requires modifying `lenis-provider.tsx` to set `autoRaf: false` and add `gsap.ticker.add()` with the Lenis raf call.

The second critical constraint is `prefers-reduced-motion` (D-10). Motion/React's `MotionConfig reducedMotion="user"` handles Motion animations automatically (disables transforms, preserves opacity). But GSAP ScrollTrigger and Lenis do not respect this automatically — they require explicit `useReducedMotion()` checks and conditional initialization.

**Primary recommendation:** Use Motion/React `whileInView` for all scroll reveals (simpler, declarative, React-native), use GSAP ScrollTrigger only for the homepage parallax and complex timelines that need frame-perfect control. This avoids fighting two systems for the same job.

---

## Standard Stack

### Core (Already Installed)
| Library | Version | Purpose | Notes |
|---------|---------|---------|-------|
| motion | 12.38.0 | Page transitions, scroll reveals, card hover | Already in package.json; use `motion/react` imports |
| lenis | 1.3.21 | Smooth scroll | Already in package.json; LenisProvider scaffolded but needs GSAP sync |

### To Install
| Library | Version | Purpose | Why Standard |
|---------|---------|---------|--------------|
| gsap | 3.14.2 | ScrollTrigger parallax, complex homepage timelines | Industry standard; free since Webflow acquisition |
| @gsap/react | 2.1.2 | useGSAP hook — drop-in replacement for useEffect with auto-cleanup | Official React adapter; prevents animation memory leaks on unmount |

> react-intersection-observer is NOT needed — Motion's `whileInView` uses IntersectionObserver under the hood. Installing it separately would be redundant for this stack.

**Installation:**
```bash
npm install gsap @gsap/react
```

**Version verification:** Confirmed against npm registry 2026-04-02. gsap@3.14.2, @gsap/react@2.1.2.

---

## Architecture Patterns

### Recommended Project Structure
```
src/
├── components/
│   ├── providers/
│   │   └── lenis-provider.tsx      # MODIFY: add GSAP ticker sync
│   ├── animations/
│   │   ├── scroll-reveal.tsx       # NEW: reusable whileInView wrapper
│   │   └── parallax-layer.tsx      # NEW: useScroll + useTransform wrapper
│   ├── projects/
│   │   └── project-card.tsx        # MODIFY: replace CSS hover with Motion overlay
│   └── home/
│       └── home-sections.tsx       # NEW or MODIFY: homepage sections with cinematic animations
└── app/
    └── template.tsx                # MODIFY: upgrade to fade+slide transition
```

### Pattern 1: GSAP + Lenis Ticker Sync (D-07)

**What:** Replace LenisProvider's own RAF loop with GSAP's ticker driving Lenis.

**When to use:** Required before any GSAP ScrollTrigger is authored — if Lenis and GSAP each drive their own RAF, scroll positions desync.

**The canonical pattern (verified: GSAP community + darkroomengineering/lenis docs):**

```typescript
// src/components/providers/lenis-provider.tsx
"use client";

import { useEffect, useRef } from "react";
import Lenis from "lenis";
import gsap from "gsap";
import ScrollTrigger from "gsap/ScrollTrigger";
import { useReducedMotion } from "motion/react";

gsap.registerPlugin(ScrollTrigger);

export function LenisProvider({ children }: { children: React.ReactNode }) {
  const lenisRef = useRef<Lenis | null>(null);
  const shouldReduceMotion = useReducedMotion();

  useEffect(() => {
    if (shouldReduceMotion) return; // D-10: skip Lenis entirely

    const lenis = new Lenis({
      lerp: 0.1,
      smoothWheel: true,
      // Do NOT pass autoRaf: true — GSAP ticker drives raf
    });
    lenisRef.current = lenis;

    // Sync Lenis scroll events to ScrollTrigger
    lenis.on("scroll", ScrollTrigger.update);

    // Add Lenis to GSAP ticker (GSAP time is in seconds, Lenis needs ms)
    const tickerFn = (time: number) => {
      lenis.raf(time * 1000);
    };
    gsap.ticker.add(tickerFn);
    gsap.ticker.lagSmoothing(0); // Prevent scroll jumps on tab focus

    return () => {
      gsap.ticker.remove(tickerFn);
      lenis.destroy();
    };
  }, [shouldReduceMotion]);

  return <>{children}</>;
}
```

**Key details:**
- `gsap.registerPlugin(ScrollTrigger)` must be at module top — prevents tree-shaking stripping it from production builds
- `lagSmoothing(0)` prevents scroll position jumps when user tabs away and returns
- GSAP time is seconds; Lenis.raf() expects milliseconds — multiply by 1000
- When `shouldReduceMotion` is true, skip Lenis entirely (native scroll behavior returns)

### Pattern 2: Page Transition Upgrade (DSGN-03, D-01)

**What:** Upgrade template.tsx from opacity-only to fade+slide.

**Current state:** `template.tsx` has opacity fade with `duration: 0.3` — already using AnimatePresence + `m.div` with `key={pathname}`.

**Upgrade (no structural change needed):**

```typescript
// src/app/template.tsx
"use client";

import { m, AnimatePresence } from "motion/react";
import { usePathname } from "next/navigation";
import { useReducedMotion } from "motion/react";

export default function Template({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const shouldReduceMotion = useReducedMotion();

  const variants = {
    initial: shouldReduceMotion ? { opacity: 0 } : { opacity: 0, y: 20 },
    animate: shouldReduceMotion ? { opacity: 1 } : { opacity: 1, y: 0 },
    exit: shouldReduceMotion ? { opacity: 0 } : { opacity: 0, y: 10 },
  };

  return (
    <AnimatePresence mode="wait">
      <m.div
        key={pathname}
        variants={variants}
        initial="initial"
        animate="animate"
        exit="exit"
        transition={{
          duration: shouldReduceMotion ? 0.15 : 0.3,
          ease: "easeOut",
        }}
      >
        {children}
      </m.div>
    </AnimatePresence>
  );
}
```

**Why this works:** `template.tsx` (not `layout.tsx`) is re-created on every navigation, so AnimatePresence detects the key change and fires exit animations. The `key={pathname}` is the critical stable key. Exit at 200ms + enter at 300ms = ~400ms total (within the D-01 budget).

### Pattern 3: Reusable Scroll Reveal Wrapper (DSGN-04, D-05, D-06)

**What:** A client component wrapping children in Motion `whileInView` with `viewport={{ once: true }}` for play-once behavior.

```typescript
// src/components/animations/scroll-reveal.tsx
"use client";

import { m, useReducedMotion } from "motion/react";

interface ScrollRevealProps {
  children: React.ReactNode;
  delay?: number;
  className?: string;
}

export function ScrollReveal({ children, delay = 0, className }: ScrollRevealProps) {
  const shouldReduceMotion = useReducedMotion();

  if (shouldReduceMotion) {
    return <div className={className}>{children}</div>;
  }

  return (
    <m.div
      className={className}
      initial={{ opacity: 0, y: 60, scale: 0.95 }}
      whileInView={{ opacity: 1, y: 0, scale: 1 }}
      viewport={{ once: true, amount: 0.3 }} // trigger at 30% in viewport (D-03)
      transition={{
        duration: 0.6,
        delay,
        ease: "easeOut",
      }}
    >
      {children}
    </m.div>
  );
}
```

**Usage for staggered children (D-03):**
```tsx
// Apply to each section child with incrementing delay
<ScrollReveal delay={0}>    <h2>Title</h2>      </ScrollReveal>
<ScrollReveal delay={0.15}> <p>Description</p>  </ScrollReveal>
<ScrollReveal delay={0.30}> <Link>CTA</Link>    </ScrollReveal>
```

### Pattern 4: Homepage Parallax Layers (HOME-03, D-04)

**What:** Multiple parallax layers using Motion's `useScroll` + `useTransform` for section-level parallax (pure Motion approach, no GSAP needed for this).

```typescript
// src/components/animations/parallax-layer.tsx
"use client";

import { useRef } from "react";
import { m, useScroll, useTransform, useReducedMotion } from "motion/react";

interface ParallaxLayerProps {
  children: React.ReactNode;
  speed?: number; // multiplier: 0.2 = slow (background), 0.8 = fast (foreground)
  className?: string;
}

export function ParallaxLayer({ children, speed = 0.3, className }: ParallaxLayerProps) {
  const ref = useRef<HTMLDivElement>(null);
  const shouldReduceMotion = useReducedMotion();

  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"], // track entire element travel through viewport
  });

  const y = useTransform(scrollYProgress, [0, 1], ["0%", `${speed * -30}%`]);

  return (
    <div ref={ref} className={className}>
      <m.div style={{ y: shouldReduceMotion ? 0 : y }}>
        {children}
      </m.div>
    </div>
  );
}
```

**For homepage sections (D-04), use different speeds:**
- Background decorative elements: `speed={0.2}` (subtle drift)
- Mid-layer content: `speed={0.5}` (medium shift)
- Text with rotation: combine `y` transform with a `rotate` useTransform mapped to `[-2, 2]` degrees

### Pattern 5: GSAP ScrollTrigger for Complex Homepage Timelines (HOME-03)

**What:** Use `useGSAP` hook (from `@gsap/react`) for complex staggered entry sequences that need frame-perfect control.

```typescript
// src/components/home/hero-section.tsx
"use client";

import { useRef } from "react";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import ScrollTrigger from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger, useGSAP);

export function HeroSection() {
  const containerRef = useRef<HTMLDivElement>(null);

  useGSAP(() => {
    gsap.from(".hero-element", {
      opacity: 0,
      y: 60,
      scale: 0.95,
      stagger: 0.15,
      duration: 0.8,
      ease: "power2.out",
      scrollTrigger: {
        trigger: containerRef.current,
        start: "top 70%", // trigger at 30% into viewport (D-03)
        once: true,       // play once (D-06)
      },
    });
  }, { scope: containerRef });

  return (
    <div ref={containerRef}>
      <h1 className="hero-element">...</h1>
      <p className="hero-element">...</p>
      <div className="hero-element">...</div>
    </div>
  );
}
```

**Why `useGSAP` not `useEffect`:** `useGSAP` wraps animations in `gsap.context()`, automatically reverting all ScrollTrigger instances, timelines, and tweens when the component unmounts. Critical in Next.js App Router where components mount/unmount on navigation.

### Pattern 6: Project Card Hover-Reveal (PORT-02, D-08, D-09)

**What:** Replace CSS-only hover border with Motion overlay. Needs mobile tap state management.

```typescript
// src/components/projects/project-card.tsx (client component)
"use client";

import { useState } from "react";
import { m, AnimatePresence, useReducedMotion } from "motion/react";
import Link from "next/link";

export function ProjectCard({ project }: { project: Project }) {
  const [overlayVisible, setOverlayVisible] = useState(false);
  const shouldReduceMotion = useReducedMotion();

  return (
    <div
      className="relative rounded-xl border border-[var(--border)] bg-[var(--bg-secondary)] overflow-hidden"
      onMouseEnter={() => setOverlayVisible(true)}
      onMouseLeave={() => setOverlayVisible(false)}
      onClick={() => setOverlayVisible((v) => !v)} // D-09: tap toggle on mobile
    >
      {/* Image area */}
      <div className="relative aspect-video w-full overflow-hidden rounded-t-xl">
        {/* ... image ... */}

        {/* Hover overlay */}
        <AnimatePresence>
          {overlayVisible && (
            <m.div
              className="absolute inset-0 flex flex-col items-center justify-center bg-black/60 p-4"
              initial={shouldReduceMotion ? { opacity: 0 } : { opacity: 0, y: "100%" }}
              animate={shouldReduceMotion ? { opacity: 1 } : { opacity: 1, y: 0 }}
              exit={shouldReduceMotion ? { opacity: 0 } : { opacity: 0, y: "100%" }}
              transition={{ duration: shouldReduceMotion ? 0.1 : 0.3, ease: "easeOut" }}
            >
              <Link href={`/projects/${project.slug}`}
                className="rounded-lg bg-white px-4 py-2 text-sm font-semibold text-black">
                View Project →
              </Link>
              <div className="mt-2 flex flex-wrap gap-1 justify-center">
                {project.tags.map((tag) => (
                  <span key={tag} className="text-xs text-white/80">{tag}</span>
                ))}
              </div>
            </m.div>
          )}
        </AnimatePresence>
      </div>

      {/* Title and description remain below image (D-08) */}
      <div className="p-6">
        <Link href={`/projects/${project.slug}`} className="text-xl font-semibold hover:underline">
          {project.title}
        </Link>
        <p className="mt-2 text-sm text-[var(--fg-muted)] line-clamp-3">{project.description}</p>
      </div>
    </div>
  );
}
```

**Mobile tap-dismiss (D-09):** Add a `useEffect` to listen for clicks outside the card and dismiss the overlay.

### Pattern 7: Site-Wide Reduced Motion Gate (D-10)

**What:** `MotionConfig` wrapping the entire app handles Motion transforms automatically. But GSAP and Lenis require explicit checks.

**Strategy:**
- `MotionConfig reducedMotion="user"` in `MotionProvider` — handles all `m.*` components automatically (disables transforms, preserves opacity)
- `useReducedMotion()` in `LenisProvider` — skip Lenis initialization when reduced motion is on (D-10: native scroll returns)
- `useReducedMotion()` in GSAP components — skip `useGSAP` animation setup when reduced motion is on

```typescript
// src/components/providers/motion-provider.tsx
"use client";

import { LazyMotion, domAnimation, MotionConfig } from "motion/react";

export function MotionProvider({ children }: { children: React.ReactNode }) {
  return (
    <LazyMotion features={domAnimation} strict>
      <MotionConfig reducedMotion="user">
        {children}
      </MotionConfig>
    </LazyMotion>
  );
}
```

**What `reducedMotion="user"` does:** Disables transform and layout animations (x, y, scale, rotate) for all `m.*` components. Opacity and color animations still play. This satisfies D-10's "instant opacity swap only" for page transitions — the y animation is suppressed, only opacity remains.

### Anti-Patterns to Avoid

- **Never animate `width`, `height`, `top`, `left`, `padding`, or `margin`** — always use `transform` equivalents (`scaleX`, `y`, `x`). These layout-triggering properties cause mobile jank (Pitfall 7).
- **Never use `layout.tsx` for AnimatePresence** — the exit animation won't fire. `template.tsx` is required (Pitfall 5).
- **Never omit `gsap.registerPlugin(ScrollTrigger)` at module level** — tree-shaking strips it in production without explicit registration.
- **Never let Lenis run its own RAF when GSAP is active** — desync causes ScrollTrigger to fire at wrong scroll positions.
- **Never skip the `once: true` viewport option** — without it, animations replay on re-enter (contradicts D-06).
- **Never animate more than 5 elements simultaneously** — stagger them. GPU layer pressure causes mobile crashes.

---

## Don't Hand-Roll

| Problem | Don't Build | Use Instead | Why |
|---------|-------------|-------------|-----|
| React GSAP cleanup | Manual `useEffect` with animation refs | `useGSAP` from `@gsap/react` | useGSAP wraps gsap.context() — all triggers/timelines auto-revert on unmount |
| Reduced motion detection | Custom `window.matchMedia` hook | `useReducedMotion()` from motion/react | SSR-safe, handles hydration correctly, returns correct value before first paint |
| Scroll position tracking for parallax | `window.addEventListener('scroll')` | `useScroll` from motion/react | IntersectionObserver-based, no main thread scroll listener, hardware-accelerated |
| Viewport entry detection | Custom IntersectionObserver setup | `whileInView` prop on `m.*` components | Built-in, declarative, respects MotionConfig reducedMotion |
| GSAP plugin availability check | Manual conditional | `gsap.registerPlugin()` at module scope | Prevents tree-shaking, idempotent (safe to call multiple times) |

**Key insight:** Motion/React's declarative system handles the common 80% of animations with zero imperative code. Reach for GSAP only for sequences that require frame-perfect timeline control or that Motion's API cannot express cleanly.

---

## Common Pitfalls

### Pitfall 1: Lenis + GSAP Scroll Position Desync
**What goes wrong:** ScrollTrigger animations fire at the wrong scroll position, or snap/jump erratically during scroll.
**Why it happens:** Lenis runs its own RAF loop; GSAP also runs a RAF ticker. Two competing loops update scroll position at different times, causing desync.
**How to avoid:** In `LenisProvider`, remove the standalone `requestAnimationFrame` loop. Instead, add Lenis to `gsap.ticker.add()` with `time * 1000` conversion. Set `gsap.ticker.lagSmoothing(0)`.
**Warning signs:** Smooth scroll works but ScrollTrigger `start`/`end` markers are in wrong positions; animation fires too early or too late on scroll.

### Pitfall 2: AnimatePresence Exit Animations Not Firing
**What goes wrong:** Page exit animation is skipped — instant cut, no fade out.
**Why it happens:** Using `layout.tsx` instead of `template.tsx`. layout.tsx persists across navigations, so AnimatePresence never detects a child change.
**How to avoid:** All AnimatePresence logic lives in `template.tsx`. Already scaffolded correctly in this project. Do not move it.
**Warning signs:** Entrance animation plays, exit is instant. Works in development but feels broken.

### Pitfall 3: Mobile Jank from Layout-Triggering CSS
**What goes wrong:** Animations that look smooth on desktop produce red frames on mobile with 6x CPU throttle.
**Why it happens:** Animating CSS properties that trigger layout recalculation (width, height, top, left) on every frame blocks the main thread.
**How to avoid:** Only animate `opacity` and `transform` properties (`x`, `y`, `scale`, `rotate`). Never animate `height`, `width`, `padding`, or positional properties directly.
**Warning signs:** Chrome DevTools Performance panel shows "Layout" tasks in the flame chart during animation; FPS drops below 30.

### Pitfall 4: GSAP Tree-Shaking Strips ScrollTrigger in Production
**What goes wrong:** ScrollTrigger animations work in `next dev` but silently fail in production builds.
**Why it happens:** Next.js production builds tree-shake unused imports. Without `gsap.registerPlugin(ScrollTrigger)` at module scope, the plugin is stripped.
**How to avoid:** Call `gsap.registerPlugin(ScrollTrigger, useGSAP)` at the top of every file that uses them. This is idempotent — safe to call in multiple files.
**Warning signs:** Works in dev, broken in `next build && next start`.

### Pitfall 5: MotionConfig reducedMotion Does Not Cover GSAP or Lenis
**What goes wrong:** User enables "Reduce Motion" in macOS Accessibility; Motion components correctly suppress transforms, but GSAP scroll animations still play and smooth scroll still active.
**Why it happens:** `MotionConfig reducedMotion="user"` only covers `m.*` Motion components. It has no awareness of GSAP timelines or Lenis.
**How to avoid:** In every GSAP component, call `const shouldReduceMotion = useReducedMotion()` and skip `useGSAP` setup when true. In `LenisProvider`, same check to skip initialization.
**Warning signs:** `prefers-reduced-motion` test in macOS Accessibility shows Motion animations suppressed but GSAP scroll sequences still play.

### Pitfall 6: project-card.tsx Is Currently a Server Component
**What goes wrong:** Adding `useState` for tap state or Motion hover animations to `project-card.tsx` causes "You're importing a component that needs useState/useEffect" error.
**Why it happens:** The file currently has no `"use client"` directive — it's a Server Component.
**How to avoid:** Add `"use client"` at the top of `project-card.tsx` as the first change. All hover interaction state and Motion components require client context.
**Warning signs:** Build error: "Error: useState can only be used in a Client Component."

---

## Code Examples

### GSAP Plugin Registration (do at module scope, not inside components)
```typescript
// Source: https://gsap.com/resources/React/
import gsap from "gsap";
import ScrollTrigger from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";

gsap.registerPlugin(ScrollTrigger, useGSAP);
```

### whileInView with play-once and 30% viewport trigger
```typescript
// Source: https://motion.dev/docs/react-scroll-animations
<m.div
  initial={{ opacity: 0, y: 60, scale: 0.95 }}
  whileInView={{ opacity: 1, y: 0, scale: 1 }}
  viewport={{ once: true, amount: 0.3 }}
  transition={{ duration: 0.6, ease: "easeOut" }}
>
```

### useScroll + useTransform for parallax
```typescript
// Source: https://motion.dev/docs/react-use-scroll
const ref = useRef(null);
const { scrollYProgress } = useScroll({
  target: ref,
  offset: ["start end", "end start"],
});
const y = useTransform(scrollYProgress, [0, 1], ["0%", "-20%"]);
return <m.div ref={ref} style={{ y }}>{children}</m.div>;
```

### MotionConfig site-wide reduced motion
```typescript
// Source: https://motion.dev/docs/react-motion-config
<MotionConfig reducedMotion="user">
  {children}
</MotionConfig>
```

### useGSAP with ScrollTrigger cleanup
```typescript
// Source: https://gsap.com/resources/React/
useGSAP(() => {
  gsap.from(".hero-element", {
    opacity: 0, y: 60, scale: 0.95,
    stagger: 0.15, duration: 0.8, ease: "power2.out",
    scrollTrigger: {
      trigger: containerRef.current,
      start: "top 70%",
      once: true,
    },
  });
}, { scope: containerRef }); // scope limits querySelector to containerRef
```

---

## State of the Art

| Old Approach | Current Approach | When Changed | Impact |
|--------------|------------------|--------------|--------|
| `framer-motion` package import | `motion` package, `motion/react` imports | Rebranded 2024 | Old package works but new import path is standard |
| Manual `useEffect` for GSAP | `useGSAP` from `@gsap/react` | @gsap/react v2+ | Auto-cleanup prevents ScrollTrigger memory leaks on navigation |
| `ScrollSmoother` (GSAP Club) | Lenis + GSAP ticker sync | 2023-2024 | Free approach now standard; ScrollSmoother requires paid membership |
| `react-intersection-observer` + custom hooks | Motion `whileInView` prop | Motion v10+ | Declarative, no manual observer cleanup |
| Separate `reducedMotion` CSS media query | `MotionConfig reducedMotion="user"` | Motion v6+ | Centralized, covers all Motion components automatically |

**Deprecated/outdated:**
- `framer-motion` package: Works but `motion` is the current standard package name
- `react-gsap` wrapper: Abandoned in favor of official `@gsap/react`
- Manual RAF loop in Lenis when GSAP is present: Causes desync, replaced by ticker sync pattern

---

## Open Questions

1. **Homepage page.tsx — Server vs Client component**
   - What we know: `src/app/page.tsx` is currently a Server Component (no `"use client"`)
   - What's unclear: Adding Motion `whileInView` directly requires converting to client — but that removes RSC benefits. The ScrollReveal wrapper pattern (a client component wrapping server content) solves this without converting the whole page.
   - Recommendation: Use the wrapper pattern. `page.tsx` stays server. Import `ScrollReveal` (client component) to wrap individual sections.

2. **GSAP vs Motion for homepage scroll sequences**
   - What we know: D-03 requires bold cinematic scroll animations (slide up 60-80px + scale). Both Motion `whileInView` and GSAP ScrollTrigger can achieve this.
   - What's unclear: Claude's discretion on "whether to use react-intersection-observer for simpler reveal triggers or GSAP ScrollTrigger for everything"
   - Recommendation: Use Motion `whileInView` for scroll reveals site-wide (simpler, declarative). Use GSAP ScrollTrigger only for homepage parallax sequences that need multi-step timelines. This avoids fighting two scroll animation systems.

3. **Tap-outside dismiss for mobile project card overlay (D-09)**
   - What we know: "Second tap or tap elsewhere dismisses it"
   - What's unclear: "tap elsewhere" requires a click listener on the document or an overlay backdrop
   - Recommendation: Add a transparent backdrop `div` behind the overlay (z-index below overlay, above card image) that calls `setOverlayVisible(false)` on click. Cleaner than document-level listeners.

---

## Environment Availability

| Dependency | Required By | Available | Version | Fallback |
|------------|------------|-----------|---------|----------|
| Node.js | npm install | Yes | (darwin 25.3.0) | — |
| gsap | HOME-03, D-07 | Not installed | — | No fallback — install required |
| @gsap/react | GSAP cleanup pattern | Not installed | — | No fallback — install required |
| motion | Page transitions, scroll reveals | Yes (installed) | 12.38.0 | — |
| lenis | Smooth scroll | Yes (installed) | 1.3.21 | — |
| Vitest | Test validation | Yes (configured) | 4.1.2 | — |

**Missing dependencies with no fallback:**
- `gsap` — required for ScrollTrigger parallax and Lenis sync (D-07). Install: `npm install gsap @gsap/react`

---

## Validation Architecture

### Test Framework
| Property | Value |
|----------|-------|
| Framework | Vitest 4.1.2 + @testing-library/react 16.3.2 |
| Config file | `vitest.config.ts` (root) |
| Quick run command | `npx vitest run src/__tests__/` |
| Full suite command | `npx vitest run` |

### Phase Requirements → Test Map

| Req ID | Behavior | Test Type | Automated Command | File Exists? |
|--------|----------|-----------|-------------------|--------------|
| DSGN-03 | template.tsx renders children with motion wrapper and pathname key | unit | `npx vitest run src/__tests__/animations/template.test.tsx -t "page transition"` | No — Wave 0 |
| DSGN-04 | ScrollReveal component renders children; suppresses animation when reduced motion | unit | `npx vitest run src/__tests__/animations/scroll-reveal.test.tsx` | No — Wave 0 |
| PORT-02 | ProjectCard shows overlay on hover/tap; overlay dismisses on second tap | unit | `npx vitest run src/__tests__/components/project-card.test.tsx` | No — Wave 0 |
| HOME-03 | GSAP ScrollTrigger registers without error in client context | smoke | `npx vitest run src/__tests__/animations/gsap-setup.test.tsx` | No — Wave 0 |
| HOME-04 | LenisProvider initializes; skips when reduced motion active | unit | `npx vitest run src/__tests__/providers/lenis-provider.test.tsx` | No — Wave 0 |

**Note:** Animation rendering is largely non-unit-testable (transform values require a real browser). Tests focus on: component renders without crash, reduced motion conditions are handled, state transitions (overlay shown/hidden) work correctly.

**Manual verification (required, not automatable):**
- Page transitions: Navigate between routes in Chrome + Safari — verify fade+slide under 400ms
- Mobile jank: 6x CPU throttle in Chrome DevTools Performance panel — verify no red frames
- Reduced motion: Enable "Reduce Motion" in macOS Accessibility — verify animations suppressed
- Lenis + GSAP sync: Scroll on homepage with ScrollTrigger sequences — verify no snap/desync

### Sampling Rate
- **Per task commit:** `npx vitest run src/__tests__/` (unit tests only, ~10 seconds)
- **Per wave merge:** `npx vitest run` (full suite)
- **Phase gate:** Full suite green + manual visual verification before `/gsd:verify-work`

### Wave 0 Gaps
- [ ] `src/__tests__/animations/template.test.tsx` — covers DSGN-03
- [ ] `src/__tests__/animations/scroll-reveal.test.tsx` — covers DSGN-04
- [ ] `src/__tests__/components/project-card.test.tsx` — covers PORT-02 (hover/tap interaction)
- [ ] `src/__tests__/animations/gsap-setup.test.tsx` — covers HOME-03 (GSAP plugin registration)
- [ ] `src/__tests__/providers/lenis-provider.test.tsx` — covers HOME-04

---

## Sources

### Primary (HIGH confidence)
- [motion.dev/docs/react-motion-config](https://motion.dev/docs/react-motion-config) — MotionConfig reducedMotion options verified
- [motion.dev/docs/react-accessibility](https://motion.dev/docs/react-accessibility) — useReducedMotion + MotionConfig patterns
- [motion.dev/docs/react-scroll-animations](https://motion.dev/docs/react-scroll-animations) — whileInView, useInView, viewport options
- [motion.dev/docs/react-use-scroll](https://motion.dev/docs/react-use-scroll) — useScroll + useTransform parallax patterns
- [gsap.com/resources/React/](https://gsap.com/resources/React/) — useGSAP hook, @gsap/react, plugin registration
- [gsap.com/docs/v3/Plugins/ScrollTrigger/](https://gsap.com/docs/v3/Plugins/ScrollTrigger/) — ScrollTrigger API reference
- Project PITFALLS.md — Pitfall 5 (AnimatePresence), Pitfall 7 (mobile jank) — HIGH confidence, authored previously

### Secondary (MEDIUM confidence)
- [GSAP community: Patterns for synchronizing ScrollTrigger and Lenis](https://gsap.com/community/forums/topic/40426-patterns-for-synchronizing-scrolltrigger-and-lenis-in-reactnext/) — ticker sync pattern verified against darkroomengineering/lenis docs
- [darkroomengineering/lenis GitHub](https://github.com/darkroomengineering/lenis) — autoRaf pattern
- [medium.com: Guide to GSAP ScrollTrigger in Next.js with useGSAP](https://medium.com/@ccjayanti/guide-to-using-gsap-scrolltrigger-in-next-js-with-usegsap-c48d6011f04a) — practical Next.js setup examples

### Tertiary (LOW confidence — for awareness only)
- [rabbitrank.com: Smooth scrolling with Lenis and GSAP in Next.js](https://rabbitrank.com/blog/how-i-made-smooth-scrolling-magic-in-next-js-with-lenis-and-gsap/) — blog post, not authoritative

---

## Metadata

**Confidence breakdown:**
- Standard stack: HIGH — verified against npm registry; motion + lenis already installed, gsap + @gsap/react confirmed current versions
- Architecture patterns: HIGH — LenisProvider + template.tsx + motion-provider.tsx read directly from codebase; patterns derived from official docs
- Pitfalls: HIGH — sourced from official docs + existing project PITFALLS.md (previously researched with citations)
- Validation: MEDIUM — test files do not yet exist (Wave 0 gaps identified); test framework confirmed configured

**Research date:** 2026-04-02
**Valid until:** 2026-05-02 (stable libraries; GSAP + Motion APIs rarely break in minor releases)
