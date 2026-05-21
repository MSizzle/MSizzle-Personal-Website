---
phase: 09-design-tokens-editorial-primitives
plan: 09-08
subsystem: editorial-primitives
tags: [primitive, footer-col, footer, server-component]
requires: [09-01]
provides: [PRIM-07]
affects: [src/components/editorial/]
tech-stack:
  added: []
  patterns: [server-component, token-driven-styling, inverted-surface]
key-files:
  created:
    - src/components/editorial/footer-col.tsx
  modified: []
decisions:
  - D-08: file location src/components/editorial/{kebab-name}.tsx
  - D-09: token-driven, zero arbitrary values
  - D-11: Server Component (no 'use client')
  - Tailwind v4 /N opacity modifier (hover:text-footer-fg/70) is standard syntax, not arbitrary
metrics:
  duration: ~2 min
  completed: 2026-05-20
---

# Phase 9 Plan 08: FooterCol Primitive Summary

Inverted-surface footer column Server Component. Renders a tracked uppercase title and a list of links (with optional sub-descriptions). Designed to sit inside the ink-toned footer shell that Phase 10 will build.

## What Shipped

| File | Purpose |
| ---- | ------- |
| `src/components/editorial/footer-col.tsx` | Column with title + link list (each with optional sub) |

## Implementation Notes

- Uses inverted color tokens introduced in Plan 09-01:
  - `text-footer-fg` → paper-on-ink for link labels
  - `text-footer-mute` → muted warm gray for title + sub-descriptions
- `text-label` utility for title (tracked uppercase 11px).
- `text-caption` (13px) for the optional `sub` line below each link.
- `hover:text-footer-fg/70` uses Tailwind v4's standard `/{opacity}` modifier — not an arbitrary value, fully token-driven.
- Layout: `flex flex-col gap-4` for title+list separation; nested `flex flex-col gap-3` for link spacing.
- `<ul>`/`<li>` semantics so the footer reads correctly to screen readers.

## Verification

- File exists: src/components/editorial/footer-col.tsx
- Zero arbitrary values
- No `'use client'`
- `npm run build` → exit 0

## Deviations from Plan

None — plan executed exactly as written.

## Self-Check: PASSED
