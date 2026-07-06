---
phase: 19-project-cards-covers-redesign
plan: "02"
subsystem: components/pages
tags: [title-card, card-grid, reading-time, tdd, sc-2, sc-3, sc-4]
dependency_graph:
  requires:
    - 19-01 (TitleCard component, card.tsx extensions, .card-grid CSS)
  provides:
    - section-work.tsx wired to TitleCard (homepage Work grid)
    - writing/page.tsx with reading time, deks, card-grid
    - projects/page.tsx always-title-card with card-grid
  affects:
    - homepage "Some of the work I am proudest of" grid (no more cropped logos)
    - /projects index (all cards are title-cards, no cover faces)
    - /writing index (real covers kept; title-card fallback; reading time per post)
tech_stack:
  added: []
  patterns:
    - TDD RED/GREEN for all 3 tasks
    - kickerFor() with tag + UTC year and middle-dot separator
    - Per-post Promise.all + .catch() fan-out for reading time (graceful degradation)
    - deterministic field alternation: i % 2 === 0 ? paper : ink
key_files:
  created: []
  modified:
    - src/components/home/section-work.tsx
    - src/app/writing/page.tsx
    - src/app/projects/page.tsx
    - src/__tests__/home/section-work.test.tsx
    - src/__tests__/pages/writing.test.tsx
    - src/__tests__/pages/projects.test.tsx
decisions:
  - "Homepage Work grid uses TitleCard faces (not Photo); cover images permanently retired as card faces per Phase 19 SC-2"
  - "kickerFor() builds kicker from tag + UTC year with middle-dot separator; falls back to 0N index for placeholders"
  - "Per-post getBlocks fan-out uses .catch(() => undefined) to degrade gracefully; one Notion failure never breaks the /writing render (T-19-04)"
  - "projects/page.tsx passes no coverSrc/coverAlt to Card; every card uses Card's automatic TitleCard fallback (always-title-card per CONTEXT)"
  - "essays in writing/page.tsx keep real Notion covers when present; title-card is only the fallback"
metrics:
  duration_minutes: 7
  completed_date: "2026-07-06"
  tasks_completed: 3
  tasks_total: 3
  files_created: 0
  files_modified: 6
---

# Phase 19 Plan 02: Wire TitleCard into Homepage, Writing, Projects Summary

**One-liner:** section-work.tsx swaps Photo for TitleCard (paper/ink by index, kickerFor tag+year), writing/page.tsx gains per-post reading time via getBlocks fan-out + graceful .catch, projects/page.tsx retires all cover props; both index pages adopt .card-grid offset-shadow treatment; 36 tests pass across all 3 files.

## Tasks Completed

| Task | Name | Commit | Files |
|------|------|--------|-------|
| 1 RED | Failing tests for homepage Work grid TitleCard faces | 0a6926b | section-work.test.tsx |
| 1 GREEN | Homepage Work grid renders TitleCard faces with titles and deks | 3aa97c0 | section-work.tsx, section-work.test.tsx |
| 2 RED | Failing tests for writing page reading time and card-grid | 56ab87d | writing.test.tsx |
| 2 GREEN | Writing page gets reading time, deks, and offset-shadow card-grid | 5d3babd | writing/page.tsx |
| 3 RED | Rewrite cover-face test and add title-card grid tests for projects | 9185030 | projects.test.tsx |
| 3 GREEN | Projects page always-title-card faces with offset-shadow grid | d485325 | projects/page.tsx |

## What Was Built

### section-work.tsx (homepage Work grid)
- Removed `Photo` import; added `TitleCard` from "@/components/v3/title-card"
- Replaced `captionFor()` with `kickerFor(project, index)`: returns `[tag, year].filter(Boolean).join(" · ")` with middle-dot (not em dash), falling back to `0${index + 1}` when empty or no project
- Each cell renders `<TitleCard aspectRatio="3/2.2" field={i % 2 === 0 ? "paper" : "ink"} title={project?.title ?? "Selected work"} kicker={kickerFor(project, i)} dek={project?.description || undefined} />`
- No cover/src passed; placeholder TitleCards maintain 2x2 grid shape
- All 9 tests pass (5 existing + 4 new): titles visible, dek visible, no notion-cover imgs, 4 title-card elements without projects

### writing/page.tsx
- Added `getBlocks` to existing notion import; added `calculateReadingTime` from "@/utils/reading-time"
- Per-post reading time fan-out: `Promise.all(posts.map(...getBlocks(post.id).then(calculateReadingTime).catch(() => undefined)))` stored in a Map
- Card map callback gains index `i`; passes `readingTime={readingTimes.get(post.id)}`, `kicker={post.tags?.[0] ?? "Essay"}`, `titleCardField={i % 2 === 0 ? "paper" : "ink"}`
- Grid container className changed from inline minmax+gap-px string to `card-grid`
- Essays keep real Notion covers (coverSrc/coverAlt preserved); title-card is the fallback
- All 11 tests pass (8 existing + 3 new): reading time from blocks, graceful degradation, card-grid class

### projects/page.tsx
- Card map callback gains index `i`; `coverSrc` and `coverAlt` props removed entirely
- Kicker: `project.tags?.[0] ?? "Project"`; `titleCardField={i % 2 === 0 ? "paper" : "ink"}`
- Grid container className changed to `card-grid`
- project.image remains in data layer for the detail page
- All 16 tests pass (13 existing + 3 new): rewritten cover-face test, card-grid class, ink alternation

### Overall test results
- 36 tests pass across all 3 modified test files
- Full suite: 138 passing + 3 pre-existing failures (explorative-homepage.test.tsx x2, section-building.test.tsx x1) documented in MEMORY.md, not caused by this plan

## Deviations from Plan

None. Plan executed exactly as written. All acceptance criteria satisfied:
- `grep -c 'notion-cover' src/components/home/section-work.tsx` = 0
- `grep -c 'notion-cover' src/app/projects/page.tsx` = 0 (writing keeps essay cover line)
- `grep -c 'coverSrc' src/app/projects/page.tsx` = 0
- `grep -c 'gap-px' src/app/writing/page.tsx` = 0
- `grep -c 'gap-px' src/app/projects/page.tsx` = 0
- `grep -c 'estimateReadingTime' src/app/writing/page.tsx` = 0
- All field alternation uses `i % 2 === 0 ? "paper" : "ink"`
- No em dashes in any string literals added to any file

## Known Stubs

None. All data flows are wired:
- TitleCard receives real title/kicker/dek from project data
- Reading time computed from actual Notion block content
- Field alternation is deterministic by list index

## Threat Flags

No new security-relevant surface introduced. Threat mitigations from plan's threat register applied:

| Threat ID | Status |
|-----------|--------|
| T-19-03 (XSS) | Mitigated: JSX text interpolation only; no dangerouslySetInnerHTML in any touched file |
| T-19-04 (DoS fan-out) | Mitigated: per-post .catch(() => undefined) in reading time fan-out; ISR revalidate=1800 unchanged |

## TDD Gate Compliance

All 3 tasks followed RED/GREEN cycle:
1. `test(19-02)` RED commit exists before each `feat(19-02)` GREEN commit
2. RED commits had confirming failing tests (3, 2, and 3 failures respectively)
3. GREEN commits passed all tests including the newly added ones

## Self-Check: PASSED

Files exist:
- src/components/home/section-work.tsx: YES
- src/app/writing/page.tsx: YES
- src/app/projects/page.tsx: YES
- .planning/phases/19-project-cards-covers-redesign-typographic-title-card-covers-/19-02-SUMMARY.md: YES

Commits exist:
- 0a6926b (RED task 1): YES
- 3aa97c0 (GREEN task 1): YES
- 56ab87d (RED task 2): YES
- 5d3babd (GREEN task 2): YES
- 9185030 (RED task 3): YES
- d485325 (GREEN task 3): YES

Test results: 36 tests pass across all 3 modified test files; 3 pre-existing failures unaffected.
