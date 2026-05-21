---
phase: 09-design-tokens-editorial-primitives
plan: 09-02
subsystem: editorial-primitives
tags: [primitive, rule, divider, server-component]
requires: [09-01]
provides: [PRIM-01]
affects: [src/components/editorial/]
tech-stack:
  added: []
  patterns: [server-component, token-driven-styling]
key-files:
  created:
    - src/components/editorial/rule.tsx
  modified: []
decisions:
  - D-08: file location src/components/editorial/{kebab-name}.tsx
  - D-09: token-driven, zero arbitrary values
  - D-11: Server Component (no 'use client')
metrics:
  duration: ~1 min
  completed: 2026-05-20
---

# Phase 9 Plan 02: Rule Primitive Summary

1px hairline divider Server Component consuming the `--color-rule` token (#E5E2D9) introduced in Plan 09-01.

## What Shipped

| File | Purpose |
| ---- | ------- |
| `src/components/editorial/rule.tsx` | Decorative `<hr>` with `border-rule` token; `aria-hidden` |

## Implementation Notes

- Named function export `Rule()` (no default export) per D-08.
- Uses `border-0 border-t border-rule` — `border-t` provides the 1px hairline; `border-rule` resolves to the warm-paper hairline color.
- `aria-hidden="true"` because decorative; semantic structure should rely on headings/sections.
- Server Component (no `'use client'`) per D-11. No interactivity needed.

## Verification

- `test -f src/components/editorial/rule.tsx` → exists
- `rg "border-rule" src/components/editorial/rule.tsx` → 1 hit
- `rg "border-\[" src/components/editorial/rule.tsx` → 0 hits (D-09)
- `npm run build` → exit 0

## Deviations from Plan

None — plan executed exactly as written.

## Self-Check: PASSED

- File exists: src/components/editorial/rule.tsx
- feat commit: 469eca8 (backfilled after the initial docs(09-02) commit shipped without staging the source file; corrected post-sweep)
- docs commit: 8f9abfb
- Build: green
