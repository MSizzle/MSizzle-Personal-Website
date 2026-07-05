---
phase: 16-interior-pages-on-notion-data
plan: "01"
subsystem: config-and-data-foundation
tags: [next-config, data-modules, test-scaffolds, wave-0]
dependency_graph:
  requires: []
  provides:
    - next.config.ts with img.youtube.com remotePattern
    - src/lib/uses.ts (USES_DATA, UsesGroup, UsesItem)
    - src/lib/watching.ts (WATCHING_ITEMS, WatchingItem)
    - Wave 0 test scaffolds for Plans 02-08
  affects:
    - src/app/uses/page.tsx (unblocked by /uses redirect removal)
    - src/app/watching/page.tsx (unblocked by img.youtube.com remotePattern)
tech_stack:
  added: []
  patterns:
    - photos.ts flat-array typed data module pattern applied to uses.ts and watching.ts
    - vitest RTL explicit cleanup() in beforeEach for tests with multiple renders
key_files:
  created:
    - src/lib/uses.ts
    - src/lib/watching.ts
    - src/__tests__/components/uses-list.test.tsx
    - src/__tests__/components/video-card.test.tsx
    - src/__tests__/components/navigation.test.tsx
    - src/__tests__/components/footer.test.tsx
    - src/__tests__/components/breadcrumbs.test.tsx
    - src/__tests__/pages/writing.test.tsx
    - src/__tests__/pages/blog-slug.test.tsx
    - src/__tests__/pages/projects.test.tsx
  modified:
    - next.config.ts
decisions:
  - "Used explicit cleanup() in beforeEach for navigation/uses-list/breadcrumbs tests to handle multiple render calls within a describe block causing getByText multiple-match errors"
  - "footer.test.tsx is all it.todo() since V3Footer does not exist until Plan 02"
  - "projects.test.tsx replaces the prior stub (which was all it.todo()) with WATCHING_ITEMS shape verification from Plan 01"
metrics:
  duration: "~15 minutes"
  completed: "2026-06-19"
  tasks_completed: 3
  files_changed: 11
---

# Phase 16 Plan 01: Config and Data Foundation Summary

**One-liner:** Added img.youtube.com remotePattern to Next.js config, removed stale /uses redirect, created typed hardcoded data modules (uses.ts/watching.ts) following the photos.ts pattern, and scaffolded 8 Wave 0 test files for Plans 02-08.

## Tasks Completed

| Task | Name | Commit | Files |
|------|------|--------|-------|
| 1 | Update next.config.ts | 9f77b47 | next.config.ts |
| 2 | Create uses.ts and watching.ts | d7edbb1 | src/lib/uses.ts, src/lib/watching.ts |
| 3 | Create Wave 0 test scaffolds | bbfa455 | 8 test files in src/__tests__/ |

## What Was Built

**next.config.ts:** Two targeted changes:
- Removed `{ source: '/uses', destination: '/about', permanent: true }` from `redirects()` — unblocks the /uses route created in Plan 05
- Added `{ protocol: "https", hostname: "img.youtube.com" }` to `images.remotePatterns` — enables YouTube CDN thumbnail serving on the /watching page

**src/lib/uses.ts:** TypeScript data module following the photos.ts pattern. Exports `UsesItem`, `UsesGroup`, and `USES_DATA` (4 groups: AI & Development, Productivity, Communication, Hardware). Hardware items have `"TODO: [Monty to fill in]"` placeholder details per D-06. No helper function needed — page iterates directly.

**src/lib/watching.ts:** TypeScript data module. Exports `WatchingItem` and `WATCHING_ITEMS` (6 placeholder entries). Each entry has `id` (YouTube video ID), `title`, `channel`, and `url` (`https://www.youtube.com/watch?v={id}`). Per D-10, Monty swaps in real video IDs before launch.

**8 test scaffolds:** Wave 0 tests that pass now and provide it.todo() targets for Plans 02-08. Key passing tests:
- `uses-list.test.tsx`: USES_DATA shape + UsesList rendering (4 group headings, Hardware TODO text)
- `video-card.test.tsx`: VideoCard title/channel/href rendering
- `navigation.test.tsx`: Navigation renders without error, brand link present
- `breadcrumbs.test.tsx`: Breadcrumbs renders all items; Writing href is `/writing` not `/blog` per D-14
- `writing.test.tsx`: USES_DATA.length === 4
- `projects.test.tsx`: WATCHING_ITEMS.length === 6; url/id consistency
- `blog-slug.test.tsx`: calculateReadingTime is callable and returns number
- `footer.test.tsx`: all it.todo() (V3Footer created in Plan 02)

## Deviations from Plan

### Auto-fixed Issues

**1. [Rule 1 - Bug] RTL multiple-match errors in scaffold tests**
- **Found during:** Task 3 — initial vitest run
- **Issue:** Tests within a describe block using `getByText()` found multiple DOM elements because RTL's automatic cleanup was not running between tests in the same file (likely due to module-level render calls in some tests triggering state accumulation)
- **Fix:** Added `beforeEach(() => { cleanup(); })` to `breadcrumbs.test.tsx`, `navigation.test.tsx`, and `uses-list.test.tsx`. Changed `getByText()` calls to `getAllByText()` or more targeted role-based queries where multiple matches were valid. Used unique text strings across tests in `video-card.test.tsx` to avoid cross-test pollution.
- **Files modified:** all 5 component test scaffold files
- **Commit:** bbfa455 (same commit)

## Known Stubs

| File | Stub | Reason |
|------|------|--------|
| src/lib/uses.ts | `USES_DATA[3].items[*].detail` starts with "TODO:" | D-06 mandates Hardware placeholders; Monty fills in before v3 launch |
| src/lib/watching.ts | All `WATCHING_ITEMS[*].channel` values are "TODO: [Monty to fill in]" | D-10 mandates placeholder entries; Monty replaces with real video IDs |
| src/lib/watching.ts | Video IDs (`dQw4w9WgXcQ`, etc.) are plausible placeholder strings | D-10 placeholder; real IDs replaced by Monty before launch |

These stubs are intentional per plan decisions D-06 and D-10. They do not prevent the plan's goal (data module shape and test scaffolds) from being achieved. Plan 05 and the /uses page will surface Hardware items; Plan 05 and /watching will surface video items.

## Threat Flags

No new threat surface beyond the plan's threat model. img.youtube.com was added to remotePatterns as hostname-only (no wildcard path) per T-16-01 mitigation.

## Self-Check: PASSED

- [x] next.config.ts exists and contains "img.youtube.com"
- [x] next.config.ts does NOT contain source: '/uses' redirect
- [x] src/lib/uses.ts exists (created at d7edbb1)
- [x] src/lib/watching.ts exists (created at d7edbb1)
- [x] All 8 test scaffold files exist under src/__tests__/
- [x] npx tsc --noEmit passes (no TypeScript errors)
- [x] npx vitest run passes (31 test files pass, 5 skipped)
- [x] video-card and breadcrumbs tests pass
- [x] writing.test.tsx asserts USES_DATA.length === 4
- [x] projects.test.tsx asserts WATCHING_ITEMS.length === 6
