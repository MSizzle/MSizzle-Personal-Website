---
phase: 09-design-tokens-editorial-primitives
plan: 09-05
subsystem: editorial-primitives
tags: [primitive, list-row, link-row, server-component, variant]
requires: [09-01]
provides: [PRIM-04]
affects: [src/components/editorial/]
tech-stack:
  added: []
  patterns: [server-component, token-driven-styling, variant-prop]
key-files:
  created:
    - src/components/editorial/list-row.tsx
  modified: []
decisions:
  - D-08: file location src/components/editorial/{kebab-name}.tsx
  - D-09: token-driven, zero arbitrary values
  - D-10: big variant (instead of default size — explicit prop)
  - D-11: Server Component (no 'use client')
  - cn helper imported from @/utils/cn (project convention, not @/lib/utils)
metrics:
  duration: ~2 min
  completed: 2026-05-20
---

# Phase 9 Plan 05: ListRow Primitive Summary

Editorial link row Server Component with a `big` variant. Used across the home page, projects index, blog index, and event lists. The `big` toggle scales both row padding (py-5 → py-7) and title size (text-list-title-home 20px → text-list-title 28px) in one prop.

## What Shipped

| File | Purpose |
| ---- | ------- |
| `src/components/editorial/list-row.tsx` | `<Link>` row with title / extra / meta slots, `big` variant |

## Implementation Notes

- Built on Next.js `<Link>` so the entire row is a single tap target.
- `border-t border-rule` provides the hairline divider above each row; `first:border-t-0` removes the leading border so a leading `<RuleStrong>` (PRIM-02) doesn't double.
- `flex items-baseline justify-between gap-6`: title-content (flex-1) on the left, optional meta slot (shrink-0) on the right, baseline-aligned.
- `extra` slot renders below title in `text-caption` muted (e.g., role/blurb).
- `meta` slot renders right-aligned in `text-meta` uppercase muted (e.g., dates, tracked tags).
- `cn` imported from `@/utils/cn` (verified location in this codebase — NOT `@/lib/utils`).

## Verification

- File exists: src/components/editorial/list-row.tsx
- `rg 'from "@/utils/cn"'` → 1 hit
- Zero arbitrary values (border-[, text-[N, tracking-[, leading-[)
- `npm run build` → exit 0

## Deviations from Plan

None — plan executed exactly as written.

## Self-Check: PASSED
