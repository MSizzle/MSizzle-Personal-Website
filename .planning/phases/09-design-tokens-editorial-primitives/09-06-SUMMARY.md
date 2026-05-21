---
phase: 09-design-tokens-editorial-primitives
plan: 09-06
subsystem: editorial-primitives
tags: [primitive, all-link, link, server-component]
requires: [09-01]
provides: [PRIM-05]
affects: [src/components/editorial/]
tech-stack:
  added: []
  patterns: [server-component, token-driven-styling]
key-files:
  created:
    - src/components/editorial/all-link.tsx
  modified: []
decisions:
  - D-08: file location src/components/editorial/{kebab-name}.tsx
  - D-09: token-driven, pb-1 chosen over arbitrary pb-[3px] (accepts ~1px variance vs handoff)
  - D-11: Server Component (no 'use client')
metrics:
  duration: ~1 min
  completed: 2026-05-20
---

# Phase 9 Plan 06: AllLink Primitive Summary

"View all" style tracked-uppercase link with a 1px ink underline. Used at the foot of editorial sections (e.g., "ALL PROJECTS →").

## What Shipped

| File | Purpose |
| ---- | ------- |
| `src/components/editorial/all-link.tsx` | `<Link>` with tracked uppercase + ink border-bottom |

## Implementation Notes

- `text-label` utility (11px / 0.2em tracking / weight 700) for the typography.
- `border-b border-ink` provides the 1px ink underline.
- `pb-1` (4px) chosen instead of arbitrary `pb-[3px]` — preserves D-09 (zero arbitrary values). The ~1px variance is acceptable per RESEARCH notes.
- `inline-block` so the underline width tracks the text width, not the parent container.
- No hover state per handoff §"Interactions & Behavior" — links don't color-shift on hover.

## Verification

- File exists: src/components/editorial/all-link.tsx
- Zero arbitrary values
- `npm run build` → exit 0

## Deviations from Plan

None — plan executed exactly as written. The `pb-1` vs `pb-[3px]` choice is documented in the plan itself as the locked decision.

## Self-Check: PASSED
