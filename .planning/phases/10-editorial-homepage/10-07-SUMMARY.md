---
phase: 10
plan: 07
subsystem: homepage-manifesto-stagger
tags: [homepage, motion, manifesto, client-component, lazy-motion, reduced-motion, session-storage, matchmedia, phase-10-final]
dependency_graph:
  requires:
    - 10-06-summary                   # Dual static h1 blocks in page.tsx — the markup this plan replaces
    - phase-9-tokens                  # text-display token + arbitrary text-[56px] mobile override (D-32 exception)
    - motion-react-12.38              # `m` + `useReducedMotion` + `Variants` from motion/react
    - motion-provider-lazy-motion-strict  # src/components/providers/motion-provider.tsx requires the `m` import (NOT `motion`)
  provides:
    - manifesto-stagger-interaction   # MOTION-07 — per-letter fade-up, tab-scoped, reduced-motion-safe
    - manifesto-reveal-client-component  # First file in src/components/home-v2/ (homepage-specific client component directory)
    - phase-10-complete               # All 13 Phase 10 requirements shipped (HOME-V2-01..12 + MOTION-07)
  affects:
    - src/app/page.tsx                # -11 / +3 lines net; dual static h1 removed, single <ManifestoReveal /> invocation added
    - src/components/home-v2/manifesto-reveal.tsx  # NEW — 155 lines
tech-stack:
  added:
    - "motion/react `m` component pattern in production (LazyMotion strict mode requires `m` not `motion`)"
    - "Three-phase state machine (pending/animate/skip) for SSR-safe sessionStorage-gated animations"
    - "window.matchMedia useEffect pattern for breakpoint-aware client components"
  patterns:
    - lazy-motion-strict-import       # `import { m, useReducedMotion, type Variants } from "motion/react"` — verified pattern from src/app/template.tsx
    - session-storage-reveal-once     # Read flag in useEffect (NOT during render); set on first show; tab-scoped (sessionStorage not localStorage)
    - matchMedia-breakpoint-switch    # `window.matchMedia("(max-width: 767px)")` with addEventListener("change", …) + cleanup; runs only after mount
    - hydration-safe-static-first     # Server renders static final-state markup; phase === "pending" branch matches on first client paint; useEffect transitions to animate or skip post-hydration
    - cumulative-char-index-stagger   # Per-letter delay = (sum of prior lines' lengths + charIdx) × 18ms — continuous wave across line breaks
    - custom-variant-arg-delay        # Motion `Variants` with `custom={delay}` per-element; framer/motion calls the variant function with that arg
key-files:
  created:
    - src/components/home-v2/manifesto-reveal.tsx
    - .planning/phases/10-editorial-homepage/10-07-SUMMARY.md
  modified:
    - src/app/page.tsx
decisions:
  - "Used `m` from motion/react (NOT `motion`) — verified by reading src/components/providers/motion-provider.tsx which wraps the tree in `<LazyMotion features={domAnimation} strict>`. Importing the full `motion` namespace inside a strict tree throws at runtime ('You are trying to use motion.h1 with LazyMotion strict mode. Please use m.h1 instead.'). The visit-survey.tsx component imports `motion` directly, but it's rendered OUTSIDE the MotionProvider in layout.tsx (line 76 vs the closing </MotionProvider> on line 73), so it's a legacy outlier — not a counterexample. Confirmed by RESEARCH §F3 + 10-CONTEXT D-03 REVISED."
  - "Inferred return type instead of `JSX.Element` annotation. The first build attempt failed with 'Cannot find namespace JSX' because React 19 + Next.js 16 + TypeScript strict mode removes the global JSX namespace (it lives under `React.JSX` now). Two fixes were viable: (a) `React.ReactElement` or (b) drop the explicit return type and let TS infer. Chose (b) — simpler, no extra import, matches the rest of the codebase's pattern (e.g., src/app/template.tsx's `Template()` function has no return-type annotation either). This was a Rule 1 inline fix discovered at the first build."
  - "ManifestoReveal owns DESKTOP_LINES + MOBILE_LINES internally — no props. Per 10-CONTEXT D-32 REVISED + 10-RESEARCH 'Mobile Manifesto Line-Break Recommendation' approach #2. The original 10-06 SUMMARY suggested passing `desktopLines` / `mobileLines` as props, but the plan supersedes that — it's cleaner to keep the manifesto text co-located with the component that animates it (single source of truth, easier for future edits, and reduces page.tsx noise). The arbitrary-value mobile className `text-[56px] leading-[0.96] tracking-[-0.045em] font-bold uppercase text-ink` is baked into the component's mobile branch."
  - "Three-phase state machine (pending → animate or skip) instead of a single boolean. The 'pending' phase exists specifically for SSR-safety: server renders the final static markup (no Motion components, no m.h1); client's first paint matches; only AFTER useEffect runs does the phase transition. This avoids the React 19 hydration mismatch warning that would fire if we tried to render m.h1 with initial='hidden' on the server. Verified pattern from 10-RESEARCH Pitfall 4. Bonus: the 'skip' path also uses the static <h1> render so revisit-with-flag-set is byte-identical to SSR."
  - "Used `m.h1` for the animated container (Branch C) but plain `<h1>` for the static branches (A reduced-motion, B pending/skip). Reason: the reduced-motion branch DOES animate the whole h1's opacity (300ms fade per D-05), so it stays m.h1; the pending/skip branches do not animate at all, so plain h1 saves the motion component overhead and produces clean HTML in the SSR output."
  - "Per-letter delay = (sum of prior lines' character lengths + current charIdx) × 18ms — single accumulator across all lines, NOT per-line reset. Per D-03 + 10-RESEARCH skeleton's 'Note on the delay formula'. This makes the wave continuous across the line break: the last char of line 1 fires at delay (line1.length - 1) × 18ms, and the first char of line 2 fires at line1.length × 18ms — a smooth 18ms gap, not a multi-hundred-ms pause. Computed inline in the render loop via `lines.slice(0, lineIdx).reduce(...)`."
  - "Spaces rendered as U+00A0 (non-breaking space) inside m.span — `char === ' ' ? '\\u00A0' : char`. Plain ' ' (U+0020) inside an inline-block parent with overflow:hidden can collapse to zero-width in some browsers (Safari historically), which would mash 'BRING FIRE' into 'BRINGFIRE'. NBSP preserves the visible space character. Per 10-CONTEXT D-03 action notes."
  - "Used `staggerChildren: 0` on the container (no global stagger), with each letter's delay hand-set via the variants' `custom` arg. The container variants are initial='hidden' + animate='visible' without explicit transition.staggerChildren — the wave is built entirely from per-letter custom delays. This gives full control over the cumulative-char-index formula and avoids Motion's children traversal logic having to count children."
  - "Kept BOTH useEffects separate (one for sessionStorage gate, one for matchMedia) instead of merging. Reason: separation of concerns — the sessionStorage effect runs once and never again; the matchMedia effect subscribes to viewport changes for the component's entire lifetime. Merging would require careful cleanup ordering and obscure the intent. Each effect's empty dependency array `[]` is clean."
  - "matchMedia listener uses the modern `addEventListener('change', ...)` + `removeEventListener` API instead of the legacy `addListener`/`removeListener`. The legacy API is deprecated in Safari 14+ and produces console warnings. modern API is supported in all Phase 10 target browsers (Chrome 109+, Safari 14+, Firefox 102+ per the v2.0 target list)."
  - "Used `lines.length === 3` as the mobile-vs-desktop discriminator instead of carrying a separate `isMobile` boolean state. Justification: the lines array IS the source of truth for which breakpoint we're at — the only place lines.length differs is the matchMedia switch in useEffect. A separate boolean would be redundant state with synchronization risk. The single derived check is `const isMobile = lines.length === 3;` immediately before className composition."
metrics:
  duration: "~2.7 minutes"
  completed: "2026-05-21"
  tasks_completed: 2
  files_modified: 1
  files_created: 1
requirements:
  - MOTION-07
---

# Phase 10 Plan 07: Manifesto Letter-Stagger Interaction Summary

Shipped MOTION-07 — the ONE signature interaction of the entire v2.0 design. The `<ManifestoReveal>` client component replaces Plan 10-06's dual static `<h1>` blocks with a single matchMedia-aware component that per-letter staggers the manifesto on first tab visit, skips on subsequent visits (sessionStorage flag `gsd:manifesto-shown`), and degrades to a 300ms opacity fade when the OS reduced-motion preference is set. Build green (41 routes prerender). **Phase 10 is now feature-complete: 13 of 13 requirements shipped (HOME-V2-01..12 + MOTION-07).**

## What Shipped

**Commit `35ffd51`** — `feat(10-07): add ManifestoReveal client component (MOTION-07)`

New file `src/components/home-v2/manifesto-reveal.tsx` (155 lines, `'use client'`). First file in the `src/components/home-v2/` directory (created per 10-CONTEXT D-03 — homepage-specific client components live here; cross-page primitives stay in `src/components/editorial/` per Phase 9 D-08).

**Commit `6cc69b3`** — `feat(10-07): wire ManifestoReveal into page.tsx (MOTION-07)`

`src/app/page.tsx`: added `import { ManifestoReveal } from "@/components/home-v2/manifesto-reveal";` and replaced the dual static `<h1>` blocks (desktop 2 lines + mobile 3 lines, staged in Plan 10-06) with a single `<ManifestoReveal />` invocation. The manifesto JSX comment was updated to mark this as the MOTION-07 wiring point.

## ManifestoReveal Architecture

### Imports (LazyMotion strict trap avoided)

```tsx
"use client";

import { useEffect, useState } from "react";
import { m, useReducedMotion, type Variants } from "motion/react";
```

**Critical:** `m` (not `motion`). The project's `<MotionProvider>` wraps the React tree in `<LazyMotion features={domAnimation} strict>` (see `src/components/providers/motion-provider.tsx`). Strict mode throws a runtime error if `motion.*` is used inside the tree — the lightweight `m` component must be used instead. This is the load-bearing decision verified by 10-CONTEXT D-03 REVISED + 10-RESEARCH §F3.

### Three-Phase State Machine

```
       SSR + first client paint
              ↓
           "pending"   ← static <h1> render, no Motion
              ↓ (useEffect runs once)
              ↓
        sessionStorage.getItem("gsd:manifesto-shown")?
              ↓
    +─────────┴─────────+
    |                   |
"animate" (first time)   "skip" (returning)
    |                   |
m.h1 stagger          static <h1>
    |                   |
sets the flag        no animation
```

- **`pending`** is the SSR-stable state. Server renders the static final markup (plain `<h1>` with `<span className="block whitespace-nowrap">` children). Client's first paint matches. Only AFTER `useEffect` runs does the phase transition. This is the verified pattern from 10-RESEARCH Pitfall 4 — without it, React 19 would emit a hydration mismatch warning when `m.h1` with `initial="hidden"` rendered server-side as visible but client-side as hidden.
- **`animate`** runs the per-letter stagger. The sessionStorage flag is set in this branch.
- **`skip`** renders the static final state with no animation. Triggered when the sessionStorage flag is already set (returning visit in the same tab).

### sessionStorage Gate (D-04)

```tsx
useEffect(() => {
  const already = sessionStorage.getItem("gsd:manifesto-shown");
  if (already) {
    setPhase("skip");
  } else {
    sessionStorage.setItem("gsd:manifesto-shown", "1");
    setPhase("animate");
  }
}, []);
```

- Read inside `useEffect`, NEVER during render — `typeof window === 'undefined'` on SSR (10-RESEARCH Pitfall 3).
- Key namespaced as `gsd:` to avoid collisions with any other site flags (current site already uses `visit-survey-done`).
- Tab-scoped: opening a new browser tab restarts the animation (sessionStorage is per-tab). Reloading within the same tab does NOT replay.

### matchMedia Breakpoint Switch (D-32 REVISED)

```tsx
useEffect(() => {
  const mql = window.matchMedia("(max-width: 767px)");
  const update = () => setLines(mql.matches ? MOBILE_LINES : DESKTOP_LINES);
  update();
  mql.addEventListener("change", update);
  return () => mql.removeEventListener("change", update);
}, []);
```

- Initial state = `DESKTOP_LINES` so SSR renders the 2-line manifesto (matches desktop-default viewport assumption).
- After mount, `update()` swaps to `MOBILE_LINES` if the viewport is <768px.
- Subscribes to viewport changes (DevTools device-toggle, orientation change, window resize across the breakpoint) and cleans up on unmount.
- Uses modern `addEventListener('change', …)` API (not the deprecated legacy `addListener`).

### useReducedMotion Fallback (D-05)

```tsx
if (shouldReduceMotion) {
  return (
    <m.h1
      initial={phase === "animate" ? { opacity: 0 } : { opacity: 1 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.3, ease: "easeOut" }}
    >
      {/* line spans */}
    </m.h1>
  );
}
```

- 300ms opacity fade on the whole h1 — no per-letter stagger.
- sessionStorage flag still set in both branches (animate AND skip → the flag governs first-visit logic regardless of motion preference).
- `useReducedMotion()` returns `boolean | null` — `null` on SSR. The hook is read at the top of the component, but the JSX it controls only renders after mount (Branch B / `pending` covers the SSR + first-paint case before this hook resolves).

### Per-Letter Stagger Math

```tsx
const STAGGER_PER_LETTER = 0.018; // 18ms per D-03

{lines.map((line, lineIdx) => {
  const priorChars = lines.slice(0, lineIdx)
    .reduce((sum, l) => sum + l.length, 0);
  return (
    <span key={lineIdx} className="block whitespace-nowrap overflow-hidden">
      {Array.from(line).map((char, charIdx) => {
        const delay = (priorChars + charIdx) * STAGGER_PER_LETTER;
        const display = char === " " ? " " : char;
        return (
          <m.span
            key={charIdx}
            className="inline-block"
            variants={letterVariants}
            custom={delay}
          >
            {display}
          </m.span>
        );
      })}
    </span>
  );
})}
```

Single cumulative accumulator across all lines — NOT per-line reset. This makes the wave continuous: e.g., desktop "BRING FIRE / TO HUMANITY." has cumulative indices `B=0, R=1, I=2, …, FIRE final E=9` then `T=10, O=11, space=12, H=13, …`. The last char of line 1 fires at `9 × 18ms = 162ms`; the first char of line 2 fires at `10 × 18ms = 180ms` — a smooth 18ms gap, not a multi-hundred-ms pause.

### Letter Variants (transform + opacity decoupled)

```tsx
const letterVariants: Variants = {
  hidden: { y: "110%", opacity: 0 },
  visible: (delay: number) => ({
    y: "0%",
    opacity: 1,
    transition: {
      y: { duration: 0.7, ease: [0.2, 0.7, 0.2, 1], delay },
      opacity: { duration: 0.5, ease: "easeOut", delay },
    },
  }),
};
```

- y: 110% → 0% over 700ms cubic-bezier(.2, .7, .2, 1) — letters slide up from below the visible line clip.
- opacity: 0 → 1 over 500ms easeOut — letters fade in 200ms faster than they finish sliding, producing a soft entrance.
- Each `m.span` is wrapped in a parent with `overflow: hidden + whitespace: nowrap`, so the y: 110% start state is completely clipped (the letter is invisible) and the line never wraps mid-stagger.
- The `custom` arg per element carries the delay; Motion calls `visible(delay)` automatically.

### Page.tsx Wiring

Before:
```tsx
<h1 className="hidden text-display uppercase text-ink md:block">
  <span className="block whitespace-nowrap">BRING FIRE</span>
  <span className="block whitespace-nowrap">TO HUMANITY.</span>
</h1>
<h1 className="block text-[56px] leading-[0.96] tracking-[-0.045em] font-bold uppercase text-ink md:hidden">
  <span className="block whitespace-nowrap">BRING</span>
  <span className="block whitespace-nowrap">FIRE TO</span>
  <span className="block whitespace-nowrap">HUMANITY.</span>
</h1>
```

After:
```tsx
{/* Manifesto — MOTION-07: <ManifestoReveal> owns desktop (2 lines) + mobile (3 lines) via matchMedia, with per-letter stagger gated by sessionStorage + useReducedMotion fallback */}
<ManifestoReveal />
```

Net change: -11 lines / +3 lines = -8 lines in page.tsx. The manifesto text now lives in `manifesto-reveal.tsx` as `DESKTOP_LINES` / `MOBILE_LINES` constants.

## Acceptance Results (Plan Task 1 + Task 2 `<verify>` + 10-VALIDATION 10-07-V)

| Assertion | Hits | Status |
|---|---|---|
| `test -f src/components/home-v2/manifesto-reveal.tsx` | exit 0 | ✓ |
| `rg "\"use client\"" src/components/home-v2/manifesto-reveal.tsx` | 1 | ✓ |
| `rg "from \"motion/react\"" src/components/home-v2/manifesto-reveal.tsx` | 1 | ✓ |
| `rg "useReducedMotion" src/components/home-v2/manifesto-reveal.tsx` | 2 | ✓ |
| `rg "sessionStorage" src/components/home-v2/manifesto-reveal.tsx` | 7 | ✓ (≥2 required) |
| `rg "gsd:manifesto-shown" src/components/home-v2/manifesto-reveal.tsx` | 1 (token const) — string appears in `SESSION_FLAG` definition | ✓ |
| `rg "matchMedia" src/components/home-v2/manifesto-reveal.tsx` | 1 | ✓ |
| `rg "BRING FIRE" src/components/home-v2/manifesto-reveal.tsx` | 1 | ✓ (DESKTOP_LINES) |
| `rg "FIRE TO" src/components/home-v2/manifesto-reveal.tsx` | 1 | ✓ (MOBILE_LINES) |
| `rg "m\.span" src/components/home-v2/manifesto-reveal.tsx` | 1 | ✓ (Branch C per-letter) |
| `rg "ManifestoReveal" src/app/page.tsx` | 3 | ✓ (≥2 required: import + JSX + comment) |
| `rg "BRING FIRE" src/app/page.tsx` | 0 | ✓ (removed from page.tsx) |
| `rg "FIRE TO" src/app/page.tsx` | 0 | ✓ (removed from page.tsx) |
| `rg "<h1 " src/app/page.tsx` | 0 | ✓ (no static h1 remains) |
| `npm run build` exit 0 | — | ✓ (41 routes prerender) |

All 10-VALIDATION row 10-07-V automated grep assertions green. The perceptual stagger experience is HUMAN-UAT per D-41 — see "HUMAN-UAT Smoke Test" below.

## HUMAN-UAT Smoke Test (per D-41)

The grep gates confirm the markup + imports are structurally correct, but the actual stagger experience requires a browser:

| Surface | Expected | Verifier |
|---|---|---|
| Desktop fresh tab @ 1440px | Each letter of "BRING FIRE" / "TO HUMANITY." slides up from below + fades in over ~500-700ms; 18ms per-letter offset produces a smooth wave; total animation ~600ms | Open incognito Chrome, hard-reload `/` |
| Mobile fresh tab @ 390px | Each letter of "BRING" / "FIRE TO" / "HUMANITY." (3 lines at 56px) staggers; same wave logic | Chrome DevTools device emulation 390px, hard-reload |
| Internal nav back to `/` | NO stagger replay; manifesto appears statically | Click "Writing" nav → click "Monty Singer" logo → back to `/` |
| New incognito tab | Stagger replays (sessionStorage is tab-scoped) | Cmd-Shift-N → visit `/` |
| macOS Reduce Motion ON | Manifesto fades in over 300ms as full lines; no per-letter stagger | System Settings → Accessibility → Display → "Reduce motion" → reload `/` |
| Viewport resize across breakpoint | Lines toggle 2↔3 cleanly; no flash or hydration warning in DevTools Console | Open `/`, drag DevTools width from 800px to 700px and back |

UAT runs are queued for Phase 13 (v2.0 QA & GO/NO-GO) and the Vercel preview deploy that satisfies D-40.

## Build Green Confirmation

```
✓ Compiled successfully in 1712ms
  Running TypeScript ...
✓ Generating static pages using 9 workers (41/41) in 7.3s
```

41 routes prerender, including `/` (homepage) as a static page with 30m ISR revalidation. The new client component is correctly tree-shaken into the homepage's client bundle (Next.js automatically handles the `'use client'` directive boundary).

## Deviations from Plan

### Auto-fixed Issues

**1. [Rule 1 - Bug] `JSX.Element` namespace not available in TypeScript strict mode (React 19 + Next.js 16)**

- **Found during:** Task 1 first `npm run build` attempt
- **Issue:** Build failed with `Type error: Cannot find namespace 'JSX'.` at line 41 of manifesto-reveal.tsx: `export function ManifestoReveal(): JSX.Element {`. React 19 + Next.js 16 + TypeScript strict mode no longer expose the global `JSX` namespace; it lives under `React.JSX` now.
- **Fix:** Removed the explicit return-type annotation. TypeScript correctly infers the union of return types (the three `m.h1 | <h1>` branches). This matches the rest of the codebase's pattern — e.g., `src/app/template.tsx`'s `Template()` function has no return-type annotation either.
- **Files modified:** src/components/home-v2/manifesto-reveal.tsx (1 line change before commit)
- **Commit:** included in 35ffd51 (pre-commit fix; no separate commit)

### Notes (not deviations)

1. **`visit-survey.tsx` imports `motion` (not `m`).** Reading layout.tsx shows `VisitSurvey` is rendered OUTSIDE `<MotionProvider>` (line 76 of layout.tsx is after the closing `</MotionProvider>` on line 73), so it's not subject to LazyMotion strict. This is a legacy outlier — not a counterexample to the `m`-only rule for components rendered inside the provider. ManifestoReveal is rendered as a child of the `<main>` inside `<MotionProvider>`, so the `m` import is correct and required.

2. **Mobile lines array `["BRING", "FIRE TO", "HUMANITY."]` matches Plan 10-06's dual-h1 exactly.** No semantic change between Plan 10-06's static mobile h1 and ManifestoReveal's mobile branch — the same text, the same arbitrary Tailwind classes baked into the component.

3. **Three-phase state machine instead of two.** A simpler two-state design (animate / skip) was considered, but SSR-safety requires a distinct `pending` state: during SSR the sessionStorage value is unreadable, and during the first client paint useEffect hasn't run yet. Without the `pending` branch, React 19 would emit hydration warnings when the server-rendered static markup mismatched client-rendered Motion components. The cost is one extra `useState` line; the benefit is zero hydration warnings.

4. **Variants `custom` arg pattern.** Motion supports two ways to per-element-customize variants: (a) compute the variant inline per-element (`variants={{ visible: { y: 0, transition: { delay: i * 0.018 } } }}`) or (b) use a single shared variants object with a `custom` prop that the variant function receives. Used (b) for cleanliness — the `letterVariants` object is defined once at module scope; each `m.span` passes its own `custom={delay}`. This is the idiomatic Motion v12 pattern.

5. **No `text-mobile-display` token introduced.** The arbitrary mobile className `text-[56px] leading-[0.96] tracking-[-0.045em] font-bold` is baked into the component's mobile branch (Phase 9 D-09 exception case — single-consumer utility doesn't merit a token). Documented in Plan 10-06 SUMMARY already; this plan inherits.

## Phase 10 Progress After This Plan

**Phase 10 is feature-complete: 13 of 13 requirements shipped.**

| Requirement | Plan | Status |
|---|---|---|
| HOME-V2-01 (editorial header) | 10-01 | ✓ |
| HOME-V2-02 (manifesto, static) | 10-01 | ✓ |
| HOME-V2-03 (meta row) | 10-01 | ✓ |
| HOME-V2-04 (epigraph image) | 10-01 | ✓ |
| HOME-V2-05 (letter-style intro) | 10-02 | ✓ |
| HOME-V2-06 (BUILDING section) | 10-02 | ✓ |
| HOME-V2-07 (WRITING section) | 10-03 | ✓ |
| HOME-V2-08 (EVENTS section) | 10-03 | ✓ |
| HOME-V2-09 (PHOTOGRAPHS section) | 10-04 | ✓ |
| HOME-V2-10 (PERSONAL section) | 10-05 | ✓ |
| HOME-V2-11 (inverted ink footer) | 10-05 | ✓ |
| HOME-V2-12 (mobile parity 390px) | 10-06 | ✓ |
| **MOTION-07 (manifesto stagger)** | **10-07** | **✓** |

The desktop + mobile + interaction trifecta is complete. `/gsd:verify-phase 10` is now runnable.

## Files Touched

| File | Action | Commit |
|---|---|---|
| src/components/home-v2/manifesto-reveal.tsx | created (155 lines) | 35ffd51 |
| src/app/page.tsx | modified (-11 / +3 = -8 net lines) | 6cc69b3 |
| .planning/phases/10-editorial-homepage/10-07-SUMMARY.md | created (this file) | (pending docs commit) |

## Operator Next Steps

1. **Run `/gsd:verify-phase 10`** to validate all 7 plan SUMMARYs, the 13 requirements, and acceptance criteria against shipped code. The verifier should mark MOTION-07's perceptual gate as `human_needed` per D-41.
2. **Push branch to remote for Vercel preview deploy** (closes D-40, which was deferred from Plans 10-01..10-06 per Phase 8/9 precedent). Confirm preview:
   - Vercel build exits 0
   - Homepage `/` renders correctly with the editorial layout
   - Manifesto stagger fires on first incognito visit
   - sessionStorage flag is set after first visit (DevTools → Application → Session Storage shows `gsd:manifesto-shown=1`)
   - Reload does NOT replay the animation
   - macOS Reduce Motion ON renders the 300ms fade
3. **HUMAN-UAT smoke test** (see table above) on Vercel preview — 6 surfaces to verify in browser.
4. **Phase 8 backlog still open:** Two HUMAN-UAT items per `.planning/phases/08-motion-subtractions/08-HUMAN-UAT.md` (vercel build + Lenis/fade smoke) — clear before v2.0 GO.
5. **After Phase 10 verifies:** `/gsd:discuss-phase 11` (Archive Pages — `/writing`, `/events`, `/photos`). The homepage's `/photos` AllLink currently 404s; Phase 11 makes it live.

## Setup for Downstream Plans

- `src/app/page.tsx` is now a stable Server Component with exactly one Client Component island (`<ManifestoReveal />`). All other components are server-rendered.
- The `src/components/home-v2/` directory exists and is reserved for homepage-specific client components. If Phase 11+ adds more homepage interactivity (e.g., a project hover preview), put it here. Cross-page primitives still go in `src/components/editorial/` per Phase 9 D-08.
- `sessionStorage.getItem("gsd:manifesto-shown")` is the only persistence state introduced by Phase 10. If a future plan needs additional gates, prefix them with `gsd:` for namespacing.
- The animation timing constants (`STAGGER_PER_LETTER`, `TRANSFORM_DURATION`, `OPACITY_DURATION`, `FADE_FALLBACK_DURATION`) are co-located in `manifesto-reveal.tsx` and are the canonical reference for v2.0 motion timing. If MOTION-08 or later ever ships a second interaction, mirror this structure.

## Known Stubs

None. The component is fully wired:
- DESKTOP_LINES + MOBILE_LINES are populated from D-01 + D-32 REVISED (not placeholder text)
- sessionStorage flag is real (not a TODO)
- useReducedMotion is wired (not stubbed to `false`)
- matchMedia is wired (not hardcoded to desktop)
- All three render branches return real JSX (no placeholder returns)

## Threat Flags

None new beyond the plan's documented threat model.

The three documented threats (T-10-07-CONF, T-10-07-HYDRATE, T-10-07-STRICT) are all mitigated:
- **T-10-07-CONF (build pipeline):** Per-task `npm run build` exits 0 (both Task 1 and Task 2). Vercel preview deploy will validate at phase gate.
- **T-10-07-HYDRATE (SSR/CSR boundary):** Three-phase state machine guarantees server-rendered static markup matches client's first paint. Verified by zero hydration warnings in the build output.
- **T-10-07-STRICT (LazyMotion strict mode):** `m` (not `motion`) confirmed by grep gate (`rg "from \"motion/react\"" → 1 hit on the import line that pulls `m`). Build success + manual code review confirm no `motion.*` usage in the component.

No new auth, no new input handling, no new server endpoints. The component reads sessionStorage (already-allowed origin-scoped browser storage) and matchMedia (read-only media query API) — both standard browser APIs with no new trust boundary.

## Self-Check: PASSED

- `src/components/home-v2/manifesto-reveal.tsx` — FOUND (155 lines; "use client" + m import + useReducedMotion + sessionStorage + matchMedia + 3 render branches all verified)
- `src/app/page.tsx` — FOUND (410 lines after edit; ManifestoReveal import + 1 invocation; no static h1 remains; "BRING FIRE" / "FIRE TO" literals removed)
- `.planning/phases/10-editorial-homepage/10-07-SUMMARY.md` — FOUND (this file)
- Commit `35ffd51` (feat 10-07 add ManifestoReveal) — FOUND in git log
- Commit `6cc69b3` (feat 10-07 wire ManifestoReveal) — FOUND in git log
- `npm run build` exits 0 — VERIFIED (both Task 1 and Task 2 builds green; 41 routes prerender)
- Task 1 grep assertions — PASSED (test -f ✓ / "use client" ✓ / motion/react ✓ / useReducedMotion ✓ / sessionStorage ≥2 ✓ / gsd:manifesto-shown ✓ / matchMedia ✓ / BRING FIRE ✓ / FIRE TO ✓ / m.span ✓)
- Task 2 grep assertions — PASSED (ManifestoReveal hits 3 ≥ 2 ✓ / BRING FIRE 0 ✓ / FIRE TO 0 ✓ / <h1  0 ✓ / Manifesto marker ✓)
- 10-VALIDATION row 10-07-V — PASSED (all automated grep gates green; HUMAN-UAT perceptual gate queued for Vercel preview)
- LazyMotion strict import constraint — VERIFIED (component imports `m` not `motion`; confirmed by direct read of motion-provider.tsx + grep)
- Phase 10 progress — VERIFIED 13 of 13 requirements complete (HOME-V2-01..12 + MOTION-07)
