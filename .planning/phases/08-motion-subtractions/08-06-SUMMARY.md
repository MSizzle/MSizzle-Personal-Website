---
phase: "08-motion-subtractions"
plan: "06"
subsystem: "events"
tags: ["motion", "subtraction", "delay-prop", "scroll-reveal", "motion-budget", "editorial", "events", "cascade"]
dependency_graph:
  requires:
    - "08-05 (FeaturedUpcoming animate-ping deletion — same file event-cards.tsx; Plan-06 inherits clean v2.0 FeaturedUpcoming)"
    - "08-04 (last src/app/page.tsx plan in Wave 1 — file-conflict serialization)"
  provides:
    - "UpcomingMini and PastEventCard accept only `event` as a prop — `delay` is removed from both signatures site-wide"
    - "FeaturedUpcoming signature cleaned (event + priority only; no delay)"
    - "Event lists on `/` and `/events` reveal together — no accumulator-style cascade-by-index"
    - "D-05 contract satisfied: `rg \"delay=\\{?\\d?\\.\\d+\\s*\\+\\s*i\\s*\\*\"` returns 0 hits in src/"
    - "Unblocks Plan-07 preservation verification (Wave 2)"
  affects:
    - "src/app/page.tsx"
    - "src/app/events/page.tsx"
    - "src/components/events/event-cards.tsx"
tech_stack:
  added: []
  patterns:
    - "Drop-the-prop pattern (D-04): remove `delay` from BOTH consumer JSX AND component signatures — not just one side. TypeScript verifies the removal is complete because any remaining `<UpcomingMini ... delay={...} />` consumer would error 'Property delay does not exist on type'."
    - "ScrollReveal stays untouched (D-12): the component file is a 9-line no-op `<div>` wrapper; we stopped CONSUMERS from passing delay, not the wrapper from accepting it. ScrollReveal's `delay?` prop remains optional in its interface."
    - "Index-arg flattening: dropping the cascade also makes the `.map((event, i) => …)` index unused — removed `, i` from all four destructures to keep the lint clean."
key_files:
  created: []
  modified:
    - "src/app/page.tsx"
    - "src/app/events/page.tsx"
    - "src/components/events/event-cards.tsx"
  deleted: []
decisions:
  - "Dropped `delay` prop entirely from 4 JSX call sites (2 in src/app/page.tsx, 2 in src/app/events/page.tsx) per CONTEXT.md D-04 — did not pass a zeroed `delay={0}` or default fallback"
  - "Dropped `delay` from prop signatures of `UpcomingMini`, `PastEventCard`, and `FeaturedUpcoming` per D-04 — including removing the `delay = 0.15` default on FeaturedUpcoming and the `delay?: number` optional from its type"
  - "Changed internal `<ScrollReveal delay={delay}>` to bare `<ScrollReveal>` in all three event-card component bodies — ScrollReveal's `delay?` prop is optional so no further argument is needed"
  - "Removed unused `, i` index arg from `.map((event, i) => …)` destructures in all 4 call sites — index was only consumed by the deleted accumulator expressions"
  - "Did NOT touch `src/components/animations/scroll-reveal.tsx` per D-12 — the wrapper file is byte-identical to pre-plan state"
  - "Did NOT touch the fixed-delay `ScrollReveal` wrappers in `src/app/events/page.tsx` (`<ScrollReveal delay={0}>`, `delay={0.15}`, `delay={0.2}`, `delay={0.3}` at lines 40, 47, 56, 75) — those are NOT accumulator-style, scoped out per RESEARCH.md Pitfall 3"
  - "Did NOT touch `/blog`, `/projects`, `/links` route files — RESEARCH.md Pitfall 3 confirmed no cascade patterns there"
  - "Did NOT touch `priority = false` prop on FeaturedUpcoming — only `delay` was in scope"
metrics:
  duration: "<2 minutes for the on-disk edits (originally executed in the prior session; this resume committed them)"
  completed_date: "2026-05-21"
  tasks_completed: 1
  files_changed: 3
requirements_completed:
  - MOTION-06
validation_task: "8-06-V"
---

# Phase 08 Plan 06: Flatten Cascading Delays from Event Cards Summary

**One-liner:** Removed the accumulator-style `delay={0.X + i * 0.Y}` JSX prop from the 4 event-card call sites on `/` and `/events`, and dropped the `delay` prop from the `FeaturedUpcoming`, `UpcomingMini`, and `PastEventCard` prop signatures (and from the `<ScrollReveal delay={delay}>` argument inside each component body). The site-wide cascade-pattern audit `rg "delay=\{?\d?\.\d+\s*\+\s*i\s*\*"` now returns 0 hits in `src/`, satisfying CONTEXT.md D-05. Event lists reveal together via the no-op `<ScrollReveal>` wrapper — same-time fade, no cascade-by-index.

## Tasks Completed

| Task | Name | Commit | Files |
|------|------|--------|-------|
| 1 | Drop delay props from 4 call sites and clean 3 component signatures | 0e62122 | src/app/page.tsx, src/app/events/page.tsx, src/components/events/event-cards.tsx |

## What Was Removed

### Call-Site Cleanup (4 JSX call sites)

**`src/app/page.tsx` — "Also Coming Up" block (line ~158):**

```jsx
// BEFORE
{moreUpcoming.slice(0, 4).map((event, i) => (
  <UpcomingMini
    key={event.id}
    event={event}
    delay={0.2 + i * 0.05}
  />
))}

// AFTER
{moreUpcoming.slice(0, 4).map((event) => (
  <UpcomingMini
    key={event.id}
    event={event}
  />
))}
```

**`src/app/page.tsx` — "Past" block (line ~174):**

```jsx
// BEFORE
{recentPast.map((event, i) => (
  <PastEventCard
    key={event.id}
    event={event}
    delay={0.25 + i * 0.03}
  />
))}

// AFTER
{recentPast.map((event) => (
  <PastEventCard
    key={event.id}
    event={event}
  />
))}
```

**`src/app/events/page.tsx` — "Also Coming Up" block (line ~62):**

```jsx
// BEFORE
{moreUpcoming.map((event, i) => (
  <UpcomingMini
    key={event.id}
    event={event}
    delay={0.25 + i * 0.05}
  />
))}

// AFTER
{moreUpcoming.map((event) => (
  <UpcomingMini
    key={event.id}
    event={event}
  />
))}
```

**`src/app/events/page.tsx` — "Past" block (line ~80):**

```jsx
// BEFORE
{past.map((event, i) => (
  <PastEventCard
    key={event.id}
    event={event}
    delay={0.35 + i * 0.03}
  />
))}

// AFTER
{past.map((event) => (
  <PastEventCard
    key={event.id}
    event={event}
  />
))}
```

In all four cases, the unused `, i` index arg was also dropped from the `.map()` destructure (the index was only consumed by the deleted accumulator expression).

### Component Signature Cleanup (3 functions in event-cards.tsx)

**`FeaturedUpcoming`:** removed `delay = 0.15,` from destructure, `delay?: number;` from type, and changed `<ScrollReveal delay={delay}>` → `<ScrollReveal>` in body. Kept `priority = false` + `priority?: boolean;` (out of scope for MOTION-06).

**`UpcomingMini`:** removed `delay,` from destructure, `delay: number;` from type, and changed `<ScrollReveal delay={delay}>` → `<ScrollReveal>`.

**`PastEventCard`:** same pattern as `UpcomingMini` — `delay,` and `delay: number;` removed; internal `<ScrollReveal delay={delay}>` → `<ScrollReveal>`.

Net file change for event-cards.tsx: **-9 lines** (3 destructure slots, 3 type slots, 3 internal `delay={delay}` args).

Net diff totals: **3 files, +7 / -17 lines.**

### Why Drop the Prop Entirely, Not Pass `delay={0}` (D-04)

Per CONTEXT.md D-04: passing a zeroed `delay={0}` would leave the cascade infrastructure in place but neutralized — making it easy to accidentally re-introduce by tweaking a constant later. Removing the prop from both consumer and component signatures means TypeScript itself becomes the regression guard: any future `<UpcomingMini ... delay={...} />` would fail compilation. The contract is enforced by the type system, not by code review.

## What Was Preserved (D-12 + Plan-07 boundary)

The following were explicitly **not touched**:

- **`src/components/animations/scroll-reveal.tsx`** — byte-identical to pre-plan state (D-12 preservation guard). Its `delay?: number` optional prop remains in the interface; we stopped consumers from passing it.
- **Fixed-delay `<ScrollReveal>` wrappers** at `src/app/events/page.tsx` lines 40, 47, 56, 75 (`delay={0}`, `delay={0.15}`, `delay={0.2}`, `delay={0.3}`) — NOT accumulator-style, out of scope per RESEARCH.md Pitfall 3.
- **`src/app/blog/page.tsx`, `src/app/projects/page.tsx`, `src/app/links/page.tsx`** — byte-identical (RESEARCH.md Pitfall 3 verified no cascade in those routes).
- **`src/components/providers/lenis-provider.tsx`, `src/app/template.tsx`** — D-12 preservation; not touched.
- **FeaturedUpcoming `priority` prop** — kept intact; only `delay` was in scope for MOTION-06.
- **`formatLongDate`, `formatShortDate` helpers** in event-cards.tsx — unchanged.
- **Imports** (`Image`, `EventItem`, `ScrollReveal`) in event-cards.tsx — unchanged.

## Verification

Per `08-VALIDATION.md` task `8-06-V`:

- `rg "delay=\{?\d?\.\d+\s*\+\s*i\s*\*" -g '!.planning/**' -g '!.claude/**' -g '!node_modules/**' src/` → **0 hits** ✓ (D-05 contract)
- `rg "<UpcomingMini[^/>]*delay" src/` → **0 hits** ✓
- `rg "<PastEventCard[^/>]*delay" src/` → **0 hits** ✓
- `rg "<FeaturedUpcoming[^/>]*delay" src/` → **0 hits** ✓
- `src/components/events/event-cards.tsx` still exports `UpcomingMini`, `PastEventCard`, `FeaturedUpcoming` (function-name greps return 1 each) ✓
- `src/components/animations/scroll-reveal.tsx` byte-identical to pre-plan state (D-12) ✓
- `npx tsc --noEmit` on the modified files: **clean** ✓ (the actual T-08-06 contract — TypeScript verifies no stale `delay=` consumer survived; only pre-existing `lucide-react` import error in `src/components/about/timeline.tsx` surfaced, unrelated to this plan)
- `npm run build` exit 0: **NOT VERIFIED in this resume sandbox** — see Deviations below

## Deviations from Plan

**Build-gate substitution.** Plan-06 acceptance criteria included `npm run build` exits 0 (CONTEXT.md D-10). The work was originally executed in a prior session that did pass the build gate before the user paused mid-flight to move chats. This resume committed the staged on-disk diff from a sandbox where `npm run build` cannot complete due to environmental issues unrelated to Plan-06 (Turbopack hits ENFILE on the sandbox kernel file table; webpack fallback hits framer-motion ESM resolution failures stemming from a partial node_modules install). Plan-06's actual threat T-08-06 names TypeScript as the contract verifier; `npx tsc --noEmit` on the three modified files reports zero errors related to this plan, which discharges the type-level guarantee that no stale `<UpcomingMini ... delay={...} />` consumer survived the deletion.

Plan-07 (Wave 2 preservation verification) runs `vercel build --prod` as the phase-gate per CONTEXT.md D-11, which will provide the missing build-gate confirmation in Monty's actual environment before the phase closes. The user explicitly approved this substitution at resume time.

## Decisions Honored

CONTEXT.md decisions honored as listed in plan frontmatter:

- **D-01** — MOTION-06 is in the canonical motion-deletion subset (one plan per requirement)
- **D-03** — Events section structure on `/` not modified beyond the prop deletion
- **D-04** — `delay` prop dropped entirely (not zeroed, not defaulted) from both call sites AND component signatures
- **D-05** — Cascade-pattern audit `rg "delay=\{?\d?\.\d+\s*\+\s*i\s*\*"` returns 0 hits site-wide post-edit
- **D-10** — Per-plan build-gate substituted with `tsc --noEmit` due to sandbox-only environmental block; documented above in Deviations; Plan-07's `vercel build --prod` provides the canonical confirmation
- **D-12** — Did not touch ScrollReveal, LenisProvider, or template.tsx — preservation guard intact
- **D-13** — `/newsletter` clickable carousel untouched

## Threat Flags

None. Threat T-08-06 (Tampering — `event-cards.tsx` exported function signatures) was disposition `mitigate`, mitigated by TypeScript: any leftover `<UpcomingMini ... delay={...} />` consumer would fail compilation with "Property 'delay' does not exist on type". `tsc --noEmit` is clean on the three modified files. No new network endpoints, auth paths, file access patterns, or schema changes.

## Known Stubs

None. The flattened (same-time) reveal IS the v2.0 motion-budget final state for these event lists per CONTEXT.md D-03 (absence of cascade IS v2.0 compliance — not a placeholder for future stagger).

## Plan-07 Handoff Note

After this plan, all Wave 1 motion-deletion work is complete:

- `FeaturedUpcoming`, `UpcomingMini`, `PastEventCard` at v2.0 motion budget — clean signatures, no delay prop, ScrollReveal wraps without args ✓
- Cascade-pattern site-wide grep: 0 hits ✓
- Always-on Tailwind animation utility site-wide grep (`animate-(ping|pulse|bounce|spin)`): 0 hits ✓ (Plan-05)
- Carousel components deleted, fallback lists in place ✓ (Plans 03-04)
- RotatingTagline deleted ✓ (Plan-02)
- PhotoCarousel + helper + fs/path imports deleted ✓ (Plan-01)

Plan-07 (Wave 2) takes over for preservation verification: git-diff byte-equality on Lenis/template/ScrollReveal vs `main`, Vitest preservation test run, `vercel build --prod` phase gate (CONTEXT.md D-11), and a human-verify smoke test (`autonomous: false`) for the Lenis + page-load fade.

## Phase 8 Wave 1 Status at Close of Plan-06

- Plan 01 — PhotoCarousel deleted (MOTION-01) ✓
- Plan 02 — RotatingTagline deleted (MOTION-02) ✓
- Plan 03 — WorksCarousel deleted + minimal `<ul>` fallback (MOTION-03) ✓
- Plan 04 — WritingsCarousel deleted + `globals.css` carousel-rule purge (MOTION-04) ✓
- Plan 05 — `animate-ping` removed from FeaturedUpcoming (MOTION-05) ✓
- Plan 06 — UpcomingMini + PastEventCard + FeaturedUpcoming delay-prop deletion (MOTION-06) ✓ — THIS PLAN
- Plan 07 — MOTION-08 preservation verification (Wave 2) — next

Wave 1 (Plans 01-06) is closed. All motion-deletion work shipped. Plan-07 is verification-only.

## Self-Check: PASSED

- `src/app/page.tsx` confirmed modified — 2 accumulator delay props removed, `, i` index args dropped ✓
- `src/app/events/page.tsx` confirmed modified — 2 accumulator delay props removed, `, i` index args dropped ✓
- `src/components/events/event-cards.tsx` confirmed modified — 3 prop signatures cleaned, 3 internal `<ScrollReveal delay={delay}>` → `<ScrollReveal>` ✓
- Commit `0e62122` confirmed present in `git log` ✓
- `rg "delay=\{?\d?\.\d+\s*\+\s*i\s*\*" src/` returns 0 hits ✓ (D-05 contract)
- `rg "<UpcomingMini[^/>]*delay|<PastEventCard[^/>]*delay|<FeaturedUpcoming[^/>]*delay" src/` returns 0 hits ✓
- `rg -c 'function UpcomingMini|function PastEventCard|function FeaturedUpcoming' src/components/events/event-cards.tsx` returns 3 (all three still exported) ✓
- `src/components/animations/scroll-reveal.tsx` untouched (D-12) ✓
- `npx tsc --noEmit` is clean for Plan-06 changes ✓ (only pre-existing unrelated lucide-react resolution error from a sandbox npm-install side-effect remains; not introduced by this plan)
- `npm run build` not verified in this sandbox — covered in Plan-07 by `vercel build --prod` per D-11; user pre-approved substitution
