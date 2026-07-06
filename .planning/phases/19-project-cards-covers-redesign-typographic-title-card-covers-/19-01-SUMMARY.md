---
phase: 19-project-cards-covers-redesign
plan: "01"
subsystem: components/cards
tags: [title-card, card-cover, css, tdd, sc-1]
dependency_graph:
  requires: []
  provides:
    - TitleCard component (src/components/v3/title-card.tsx)
    - CardCover client component (src/components/v3/card-cover.tsx)
    - Extended Card component (src/components/v3/card.tsx)
    - .title-card / .card-grid / .shadowed .title-card CSS (src/app/globals.css)
  affects:
    - src/app/writing/page.tsx (Card consumer, gains readingTime + titleCardField)
    - src/app/projects/page.tsx (Card consumer, gains titleCardField)
    - src/components/home/section-work.tsx (Plan 02 will wire .card-grid + TitleCard here)
tech_stack:
  added: []
  patterns:
    - TDD RED/GREEN for both tasks
    - Server component (TitleCard) + "use client" wrapper (CardCover) pattern
    - Fallback ReactNode passed as prop to keep Card server-renderable
key_files:
  created:
    - src/components/v3/title-card.tsx
    - src/components/v3/card-cover.tsx
    - src/__tests__/components/title-card.test.tsx
  modified:
    - src/components/v3/card.tsx
    - src/app/globals.css
    - src/__tests__/components/card.test.tsx
decisions:
  - "CardCover receives pre-built fallback ReactNode prop (not a component reference) so Card remains a server component and TitleCard is only imported once at the Card level"
  - "textBlock restructured so title and kicker do not repeat below the title-card face (they live on the face itself); text block only renders if blurb or readingTime exists in the no-cover case"
  - "One null remains in card.tsx for the textBlock ternary (no blurb, no readingTime) -- this is expected and not the coverSlot null the plan targeted for removal"
metrics:
  duration_minutes: 8
  completed_date: "2026-07-06"
  tasks_completed: 2
  tasks_total: 2
  files_created: 3
  files_modified: 3
---

# Phase 19 Plan 01: Typographic Title-Card Covers Summary

**One-liner:** TitleCard (Hanken 800 + vermilion kicker chip, paper/ink field) + CardCover (client onError swap) + Card integration with readingTime and deterministic titleCardField; 19 component tests pass, .card-grid and .shadowed .title-card CSS ready for Plan 02.

## Tasks Completed

| Task | Name | Commit | Files |
|------|------|--------|-------|
| 1 | TitleCard component, authored CSS, 6 tests | 89af63f | title-card.tsx, globals.css, title-card.test.tsx |
| 2 | CardCover fallback, Card integration, 13 tests | 6fffc9b | card-cover.tsx, card.tsx, card.test.tsx |

## What Was Built

### TitleCard (src/components/v3/title-card.tsx)
Server component (no "use client"). Props: `title`, `kicker?`, `dek?`, `field?` ("paper" | "ink", defaults paper), `aspectRatio?`, `className?`. Renders a self-colored div with the `.title-card` class; `field="ink"` adds `.title-card--ink`. Kicker renders as a `<span className="title-card-kicker">` with vermilion chip styling (from .marker DNA). Title renders in `.title-card-title` (Hanken 800, -webkit-line-clamp 3). Dek in `.title-card-dek` (clamp 2). No img, no next/image, no gradients.

### CardCover (src/components/v3/card-cover.tsx)
"use client" component. Props: `src`, `alt`, `sizes?`, `fallback: ReactNode`. Uses `useState(false)` for `failed` flag. On `onError`, sets `failed=true` and renders `<>{fallback}</>` in place of the cover image. One-way swap prevents any retry loop (T-19-02 accepted). The div wrapper preserves the 4:3 aspect-ratio slot.

### Card (src/components/v3/card.tsx)
Extended Props with `readingTime?: number` and `titleCardField?: "paper" | "ink"`. Imports TitleCard and CardCover. The fallback face is pre-built once (`titleCardFace`) and passed to CardCover, keeping Card server-renderable. CoverSlot: `CardCover` with `TitleCard` fallback when `coverSrc` exists; `TitleCard` directly when absent. Text block restructured: kicker+title live on the TitleCard face (no-cover case), text block only renders blurb+readingTime when at least one exists. "N min read" pattern with no punctuation.

### globals.css additions
New section `/* Phase 19: typographic title-card + offset-shadow card grid */` placed after `.work-grid`:
- `.title-card`: self-colored (not inverted by .band-dark), flex column, 14px gap, clamp padding, border-radius 0
- `.title-card--ink`: #17171a background, #faf9f7 text
- `.title-card-kicker`: mono 11px, #e5411f chip, 5px 9px padding
- `.title-card-title`: Hanken 800, -0.02em tracking, clamp(1.3rem, 2.4vw, 1.9rem), -webkit-line-clamp 3
- `.title-card-dek`: 0.85rem, opacity 0.72, -webkit-line-clamp 2
- `.card-grid`: auto-fill minmax(280px,1fr), clamp gap, 2px 18px 22px 2px padding for shadow room
- `.card-grid > a, .card-grid > div`: 8px 8px 0 var(--color-text) offset shadow, transition
- `.card-grid > a:hover`: 8px 8px 0 var(--color-accent) (vermilion hover)

Four `.shadowed` selectors extended to include `.title-card` for section-work animation compatibility (Plan 02).

### Tests
- 6 title-card tests: renders title, kicker+class, dek present/absent, title-card class + ink modifier, aspectRatio style, no img
- 13 card tests: 9 existing preserved + 4 new (no-cover title-card face, ink field, readingTime, error swap)
- Full suite: 126 pass + 3 pre-existing failures (explorative-homepage.test.tsx + section-building.test.tsx, documented in MEMORY.md, not caused by this plan)

## Deviations from Plan

### Minor Plan Inaccuracy (documented, not a bug)
**grep -c 'shadowed .title-card' acceptance criteria expects 4, actual is 3**

The plan's acceptance check `grep -c 'shadowed .title-card'` uses POSIX BRE where `.` matches any character but the pattern still requires a literal space after "shadowed". The selector `.shadowed.in .title-card` has `.shadowed.in` (no space after "shadowed"), so it produces count=3 not 4.

The correct check is `grep -c '\.shadowed.*title-card'` which returns 4 -- all four shadow selectors were properly updated. This is a documentation error in the plan acceptance criteria, not an implementation gap.

**Verification:** `grep -c '\.shadowed.*title-card' src/app/globals.css` = 4 (confirmed)

### grep false positives in title-card.tsx "use client" / next/image checks
The JSDoc comment on line 45 says `no "use client"` and `no next/image` -- these strings appear in the comment text. `grep -c '"use client"'` and `grep -c 'next/image'` both return 1 from the comment. The file has no actual "use client" directive and no next/image import. Tests confirm the component is server-renderable.

## Known Stubs

None. All props wire to real output. TitleCard face is visible and functional. readingTime renders "N min read" when provided.

## Threat Flags

No new security-relevant surface introduced. TitleCard renders Notion-sourced strings via JSX text interpolation only (no dangerouslySetInnerHTML). CardCover onError sets a boolean once, no retry loop.

## Self-Check

Files exist:
- src/components/v3/title-card.tsx: YES
- src/components/v3/card-cover.tsx: YES
- src/__tests__/components/title-card.test.tsx: YES

Commits exist:
- 89af63f (Task 1): YES
- 6fffc9b (Task 2): YES

Test result: 19 component tests pass, no new suite failures.
