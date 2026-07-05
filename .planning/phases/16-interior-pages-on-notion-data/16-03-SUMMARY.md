---
phase: 16-interior-pages-on-notion-data
plan: 03
subsystem: ui
tags: [tailwind, css-variables, pumpkin-amber, editorial-components, token-repaint]

# Dependency graph
requires:
  - phase: 16-interior-pages-on-notion-data
    provides: "Pumpkin Amber @theme token block in globals.css (--color-text, --color-text-muted, --color-border, --color-border-strong)"
provides:
  - "Six repainted editorial shared components using Pumpkin Amber var() CSS references"
  - "Token repaint flows through to all index page consumers (writing, projects, events, links, about)"
affects:
  - 16-04
  - 16-05
  - 16-06
  - 16-07
  - 16-08

# Tech tracking
tech-stack:
  added: []
  patterns:
    - "Pumpkin Amber token pattern: text-[var(--color-text)], text-[var(--color-text-muted)], border-[var(--color-border)], border-[var(--color-border-strong)]"
    - "Type-scale classes (text-label, text-caption, text-meta, text-list-title) left unchanged — they are font-size/weight/leading only, not color"

key-files:
  created: []
  modified:
    - src/components/editorial/list-row.tsx
    - src/components/editorial/year-block.tsx
    - src/components/editorial/section-label.tsx
    - src/components/editorial/all-link.tsx
    - src/components/editorial/rule.tsx
    - src/components/editorial/rule-strong.tsx

key-decisions:
  - "Type-scale classes (text-label, text-caption, text-meta, text-list-title, text-list-title-home) are not color tokens — left unchanged per plan guidance"
  - "border-ink in all-link.tsx maps to border-[var(--color-text)] per the v2→v3 mapping table (underline uses ink color)"
  - "intro-link.tsx discovered to also have border-ink but is out of scope for this plan — deferred"

patterns-established:
  - "v2 token → v3 Pumpkin Amber substitution pattern: text-ink → text-[var(--color-text)], text-muted → text-[var(--color-text-muted)], border-rule → border-[var(--color-border)], border-rule-strong → border-[var(--color-border-strong)], border-ink → border-[var(--color-text)]"

requirements-completed: [PG-01, PG-05]

# Metrics
duration: 10min
completed: 2026-06-19
---

# Phase 16 Plan 03: Editorial Component Token Repaint Summary

**Six shared editorial primitives (ListRow, YearBlock, SectionLabel, AllLink, Rule, RuleStrong) repainted from v2 paper/ink semantic tokens to Pumpkin Amber CSS var() references, unblocking all Wave 2-3 index-page plans.**

## Performance

- **Duration:** ~10 min
- **Started:** 2026-06-19T00:00:00Z
- **Completed:** 2026-06-19
- **Tasks:** 2
- **Files modified:** 6

## Accomplishments

- Removed all v2 color tokens (text-ink, text-muted, border-rule, border-rule-strong, border-ink) from all 6 editorial component files
- Applied Pumpkin Amber var() CSS references: `text-[var(--color-text)]`, `text-[var(--color-text-muted)]`, `border-[var(--color-border)]`, `border-[var(--color-border-strong)]`
- All component structure, props, exports, and JSX logic remain unchanged — pure className substitution
- TypeScript clean (npx tsc --noEmit passes)

## Task Commits

Each task was committed atomically:

1. **Task 1: Repaint list-row, year-block, section-label, all-link** - `7ab6f87` (feat)
2. **Task 2: Repaint rule and rule-strong** - `8447c3f` (feat)

**Plan metadata:** (docs commit to follow)

## Files Created/Modified

- `src/components/editorial/list-row.tsx` - border-rule → border-[var(--color-border)], text-ink → text-[var(--color-text)], text-muted (x2) → text-[var(--color-text-muted)]
- `src/components/editorial/year-block.tsx` - text-ink → text-[var(--color-text)]
- `src/components/editorial/section-label.tsx` - text-ink → text-[var(--color-text)], text-muted → text-[var(--color-text-muted)]
- `src/components/editorial/all-link.tsx` - border-ink → border-[var(--color-text)], text-ink → text-[var(--color-text)]
- `src/components/editorial/rule.tsx` - border-rule → border-[var(--color-border)]
- `src/components/editorial/rule-strong.tsx` - border-rule-strong → border-[var(--color-border-strong)]

## Decisions Made

- Type-scale classes (text-label, text-caption, text-meta, text-list-title, text-list-title-home) are font-size/weight/leading only — not color tokens — left unchanged per plan guidance
- `border-ink` in all-link.tsx bottom-border underline maps to `border-[var(--color-text)]` per the v2→v3 contract table (the underline uses the primary ink color)

## Deviations from Plan

None — plan executed exactly as written.

## Issues Encountered

- **Out-of-scope discovery:** `intro-link.tsx` (not in the plan's 6 files) also contains `border-ink` v2 token. Per scope boundary rules, left untouched and noted as a deferred item for a future plan.

## Deferred Items

- `src/components/editorial/intro-link.tsx` lines 25, 32: still uses `border-ink` (v2 token). Out of scope for this plan. Should be addressed in a future editorial cleanup plan.

## Known Stubs

None — pure token substitution, no data wiring involved.

## Threat Flags

None — pure CSS class string replacement, no new network endpoints, auth paths, or schema changes.

## User Setup Required

None - no external service configuration required.

## Next Phase Readiness

- All 6 editorial primitives now use Pumpkin Amber CSS var() references
- Token repaint flows automatically to all index page consumers (writing, projects, events, links, about)
- Wave 2-3 index-page plans (16-04 through 16-08) are unblocked

## Self-Check: PASSED

- `7ab6f87` confirmed in git log
- `8447c3f` confirmed in git log
- All 6 editorial files verified present and modified
- Zero v2 standalone tokens in the 6 plan files (confirmed via word-boundary grep)
- TypeScript clean

---
*Phase: 16-interior-pages-on-notion-data*
*Completed: 2026-06-19*
