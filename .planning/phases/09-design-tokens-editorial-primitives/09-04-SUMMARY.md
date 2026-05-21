---
phase: 09-design-tokens-editorial-primitives
plan: 09-04
subsystem: editorial-primitives
tags: [primitive, section-label, heading, server-component]
requires: [09-01]
provides: [PRIM-03]
affects: [src/components/editorial/]
tech-stack:
  added: []
  patterns: [server-component, token-driven-styling]
key-files:
  created:
    - src/components/editorial/section-label.tsx
  modified: []
decisions:
  - D-08: file location src/components/editorial/{kebab-name}.tsx
  - D-09: token-driven, zero arbitrary values
  - D-11: Server Component (no 'use client')
metrics:
  duration: ~1 min
  completed: 2026-05-20
---

# Phase 9 Plan 04: SectionLabel Primitive Summary

Tracked-uppercase section heading with optional right-aligned numeral. Consumes `text-label` utility (11px / 0.2em tracking / weight 700) from Plan 09-01.

## What Shipped

| File | Purpose |
| ---- | ------- |
| `src/components/editorial/section-label.tsx` | `<div>` flex baseline-aligned label + optional numeral |

## Implementation Notes

- Props: `children` (label content) and optional `numeral` (e.g., `"01 — Studio"`).
- `flex items-baseline justify-between` aligns label and numeral on the typographic baseline, with the numeral pushed to the right edge.
- `text-label` utility bundles the size/tracking/weight per D-09 (no arbitrary values).
- Numeral renders only when supplied (`{numeral && ...}`), keeping the simple case clean.

## Verification

- File exists: src/components/editorial/section-label.tsx
- `rg "text-label"` → 1 hit
- Zero arbitrary values
- `npm run build` → exit 0

## Deviations from Plan

None — plan executed exactly as written.

## Self-Check: PASSED
