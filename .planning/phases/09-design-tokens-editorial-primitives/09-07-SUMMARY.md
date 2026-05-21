---
phase: 09-design-tokens-editorial-primitives
plan: 09-07
subsystem: editorial-primitives
tags: [primitive, intro-link, inline-link, server-component]
requires: [09-01]
provides: [PRIM-06]
affects: [src/components/editorial/]
tech-stack:
  added: []
  patterns: [server-component, token-driven-styling]
key-files:
  created:
    - src/components/editorial/intro-link.tsx
  modified: []
decisions:
  - D-08: file location src/components/editorial/{kebab-name}.tsx
  - D-09: token-driven, zero arbitrary values
  - D-11: Server Component (no 'use client')
  - No hover color shift (handoff §Interactions & Behavior)
metrics:
  duration: ~1 min
  completed: 2026-05-20
---

# Phase 9 Plan 07: IntroLink Primitive Summary

Inline editorial link with a 1px ink bottom-border. Used inside paragraph copy (intro lede, body prose) where the link should inherit the surrounding text color/size and only mark itself with the underline.

## What Shipped

| File | Purpose |
| ---- | ------- |
| `src/components/editorial/intro-link.tsx` | `<Link>` with `border-b border-ink` only |

## Implementation Notes

- Inherits font-size, line-height, color from the parent paragraph — no `text-*` utilities applied.
- Just `border-b border-ink` for the visual signal.
- Per handoff §"Interactions & Behavior": NO hover color shift. (No `hover:` classes added.)
- Trade-off: links inside non-ink color contexts will keep an ink-colored underline. Acceptable because IntroLink is intended for body copy on the warm-paper bg.

## Verification

- File exists: src/components/editorial/intro-link.tsx
- Zero arbitrary values
- No `hover:` classes (verified)
- `npm run build` → exit 0

## Deviations from Plan

None — plan executed exactly as written.

## Self-Check: PASSED
