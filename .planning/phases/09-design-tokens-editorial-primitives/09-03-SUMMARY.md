---
phase: 09-design-tokens-editorial-primitives
plan: 09-03
subsystem: editorial-primitives
tags: [primitive, rule-strong, divider, server-component]
requires: [09-01]
provides: [PRIM-02]
affects: [src/components/editorial/]
tech-stack:
  added: []
  patterns: [server-component, token-driven-styling]
key-files:
  created:
    - src/components/editorial/rule-strong.tsx
  modified: []
decisions:
  - D-08: file location src/components/editorial/{kebab-name}.tsx
  - D-09: token-driven, zero arbitrary values
  - D-11: Server Component (no 'use client')
metrics:
  duration: ~1 min
  completed: 2026-05-20
---

# Phase 9 Plan 03: RuleStrong Primitive Summary

1px bold ink-toned section divider Server Component consuming `--color-rule-strong` (#1A1A18). Used for major section boundaries where the hairline `Rule` (PRIM-01) is too subtle.

## What Shipped

| File | Purpose |
| ---- | ------- |
| `src/components/editorial/rule-strong.tsx` | Decorative `<hr>` with `border-rule-strong` token; `aria-hidden` |

## Implementation Notes

- Identical structure to `Rule` but swaps `border-rule` → `border-rule-strong`.
- Pairs with `ListRow` (PRIM-04): each ListRow has `first:border-t-0` so a leading `<RuleStrong>` above the list provides the bold opener without doubling.

## Verification

- File exists: src/components/editorial/rule-strong.tsx
- `rg "border-rule-strong"` → 1 hit
- `rg "border-\["` → 0 hits (D-09)
- `npm run build` → exit 0

## Deviations from Plan

None — plan executed exactly as written.

## Self-Check: PASSED
