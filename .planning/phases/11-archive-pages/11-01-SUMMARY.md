---
phase: 11-archive-pages
plan: 01
subsystem: editorial-primitives
tags: [primitive, year-block, sticky, server-component, phase-11, wave-1]
requires:
  - Phase 9 design tokens (text-label, text-ink) — already shipped
provides:
  - <YearBlock> primitive for /writing (Plan 11-03) and /photos (Plan 11-05)
affects:
  - none (additive — no edits to existing files)
tech_stack_added: []
tech_stack_patterns:
  - "Native CSS position: sticky on a CSS Grid child (requires align-self: start)"
key_files_created:
  - src/components/editorial/year-block.tsx
key_files_modified: []
decisions:
  - "Server Component (no 'use client') — pure presentation, no interactivity needed"
  - "Used Phase 9 `text-label` token instead of arbitrary 14px value (D-29)"
  - "Wrapped in `<section>` with editorial padding `px-6 py-12 md:px-40 md:py-20` matching homepage section rhythm"
  - "180px year column / 1fr content column at md+, single column on mobile, `md:gap-20` between"
  - "md:self-start CRITICAL — without it the grid child stretches and sticky becomes a no-op (D-10 REVISED, RESEARCH F4 Pitfall 1)"
metrics:
  duration: "~12 minutes"
  completed_date: "2026-05-21"
  tasks_completed: 1
  files_changed: 1
---

# Phase 11 Plan 01: YearBlock Primitive Summary

**One-liner:** New shared editorial primitive at `src/components/editorial/year-block.tsx` — sticky-left year label + caller-owned children, used by `/writing` and `/photos`.

## Was Built

A single new server-component file: `src/components/editorial/year-block.tsx` (39 lines). Exports a named `YearBlock` function taking `{ year, children }` and rendering a 2-column grid where the left column (180px) holds a tracked-uppercase year label sticky to `top-9` at md+, and the right column holds caller-owned children. On mobile the layout collapses to a single column and the year label becomes a normal heading above the entries.

### JSDoc Summary

> Editorial year-grouped section block. Used on /writing and /photos.
>
> Layout: 2-column grid `[180px | 1fr]` at md+. Left column holds a tracked-uppercase year label that sticks to top-9 (36px) so it stays visible while the user scrolls through that year's entries. Mobile collapses to single column; the year renders as a non-sticky heading above the entries.
>
> Critical implementation detail: the year label includes `md:self-start` because a grid child defaults to `align-self: stretch`, and a stretched element cannot stick. Server Component — pure presentation, no client interactivity. Callers own the dividers between successive YearBlock instances (e.g., a `<Rule />` between blocks).

## Verification Results (11-01-V)

| Gate | Result |
|------|--------|
| `test -f src/components/editorial/year-block.tsx` | PASS — file exists |
| `rg "md:sticky\|position: sticky" src/components/editorial/year-block.tsx` ≥1 hit | PASS — `md:sticky` present in the year-label `<div>` className |
| `rg "self-start" src/components/editorial/year-block.tsx` ≥1 hit | PASS — `md:self-start` present (3 lexical mentions counting JSDoc + class) |
| `rg "md:top-9" src/components/editorial/year-block.tsx` ≥1 hit | PASS — `md:top-9` (36px offset clears editorial header pt-9) |
| `rg "export function YearBlock" src/components/editorial/year-block.tsx` returns 1 | PASS |
| `rg "use client" src/components/editorial/year-block.tsx` returns 0 | PASS — pure server component |
| `rg "text-label" src/components/editorial/year-block.tsx` ≥1 hit | PASS — uses Phase 9 token per D-29 |
| `npm run build` exit 0 (D-30) | PASS — `✓ Compiled successfully in 1764ms` |

## Downstream Consumers Unlocked

- **Plan 11-03 (`/writing`)** can `import { YearBlock } from "@/components/editorial/year-block"` and wrap groups of `<ListRow big>` entries.
- **Plan 11-05 (`/photos`)** can compose `<YearBlock year={2025}>{ /* photo grid */ }</YearBlock>` for the two-year layout (2025 → 2023) per the empirical photo data shipped in Plan 11-02.

## Deviations from Plan

None — plan executed exactly as written.

## Mobile Note

The primitive renders a non-sticky heading on viewports below `md` (Tailwind breakpoint 768px). The `md:sticky`, `md:top-9`, and `md:self-start` tokens are all scoped to the `md:` prefix, so the year label flows naturally above the children on mobile per D-09. This was the intended behavior — sticky behavior on a 360-px-wide phone would visually overlap with the entries.

## Commit

- `b02acdd` — `feat(11-01): add YearBlock primitive with sticky-left year label`

## Self-Check: PASSED

- File `src/components/editorial/year-block.tsx` confirmed present.
- Commit `b02acdd` confirmed via `git log`.
- All 11-01-V gates passed; npm build exits 0.
