---
phase: 11-archive-pages
plan: 02
subsystem: data-and-helpers
tags: [data-module, date-helper, photos, archive, phase-11, wave-1]
requires:
  - macOS file metadata (kMDItemContentCreationDate) — read during Phase 11 research
provides:
  - PHOTOS_BY_YEAR data + groupPhotosByYear() for Plan 11-05
  - formatDayNumeral() helper for Plan 11-04 giant numerals
affects:
  - none beyond the new exports (additive; no consumers yet)
tech_stack_added: []
tech_stack_patterns:
  - "Empirical metadata over guesswork — year values from macOS `mdls` not invented"
  - "UTC date accessors for Notion date-only strings to avoid timezone drift"
key_files_created:
  - src/lib/photos.ts
key_files_modified:
  - src/lib/dates.ts
decisions:
  - "PHOTOS_BY_YEAR holds 6 entries with empirical years (3×2023 + 3×2025) — NO 2024 photos (D-11 REVISED via RESEARCH F1)"
  - "groupPhotosByYear() returns Map sorted descending so /photos iterates newest-year-first (D-12)"
  - "formatDayNumeral uses getUTCDate() not getDate() so date-only Notion strings don't shift by ±1 day across timezones (D-17 + RESEARCH § Open Questions §3)"
  - "Null guard `if (!iso) return ''` matches the existing formatMonthYear / formatMonthDay shape — defensive even though queries filter by date (RESEARCH § Pitfall 2)"
  - "Pure data + helpers — no `'use client'`, no side effects, importable from Server Components"
metrics:
  duration: "~10 minutes"
  completed_date: "2026-05-21"
  tasks_completed: 2
  files_changed: 2
---

# Phase 11 Plan 02: Photos Data + formatDayNumeral Summary

**One-liner:** New `src/lib/photos.ts` data module + new `formatDayNumeral` helper in `src/lib/dates.ts` — the foundational data layer Plans 11-04 and 11-05 consume.

## Was Built

### File 1: `src/lib/photos.ts` (NEW, 82 lines)

Pure data + helper module. Exports:

1. **`ArchivePhoto` type** — `{ filename: string; year: number; alt: string; caption?: string }`
2. **`PHOTOS_BY_YEAR: ArchivePhoto[]`** — 6 entries with empirically derived years (per macOS `mdls kMDItemContentCreationDate` from Phase 11 research):

   | Filename | Year | Caption |
   |----------|------|---------|
   | `000092530012.jpeg` | **2025** | "Film, 2025" |
   | `IMG_2129.jpeg` | **2025** | "iPhone, Nov 2025" |
   | `Patricof09.jpg` | **2025** | "Feb 2025" |
   | `IMG_1075.JPG` | **2023** | "Dec 2023" |
   | `20230928 MSB_0114.jpg` | **2023** | "Sep 2023" |
   | `IMG_0028.jpeg` | **2023** | "Jul 2023" |

   Distribution: **3 × 2023 + 3 × 2025 = 6 photos total. ZERO 2024 photos.**

3. **`groupPhotosByYear(): Map<number, ArchivePhoto[]>`** — iterates `PHOTOS_BY_YEAR`, bucketizes by year, returns a Map sorted descending by year. Iteration order will be `[2025, [...3 photos]] → [2023, [...3 photos]]` per D-12.

### File 2: `src/lib/dates.ts` (MODIFIED — added 1 new helper)

Appended `formatDayNumeral(iso: string | null): string` to the existing file. Returns `""` for null input, otherwise `new Date(iso).getUTCDate().toString()`. Used by Plan 11-04's `<UpcomingRow>` to render the signature 84px (featured) / 56px (non-featured) day numerals on `/events`.

The existing `formatMonthYear` and `formatMonthDay` exports are unchanged.

## Year Mapping Confidence

Year assignments come from macOS `mdls -name kMDItemContentCreationDate` run during Phase 11 research, verified against per-file content (the `20230928` prefix on `MSB_0114.jpg` is also a sanity-check confirming the 2023-09-28 date). Plan 11-05 can render the two-year layout without ambiguity. No year mapping is uncertain.

## Verification Results (11-02-V)

| Gate | Result |
|------|--------|
| `test -f src/lib/photos.ts` | PASS |
| `rg "PHOTOS_BY_YEAR" src/lib/photos.ts` ≥1 hit | PASS (2 hits — declaration + comment) |
| `rg "groupPhotosByYear" src/lib/photos.ts` ≥1 hit | PASS (2 hits — JSDoc + signature) |
| `rg "export type ArchivePhoto" src/lib/photos.ts` returns 1 | PASS |
| `rg -c "year: 2023" src/lib/photos.ts` returns 3 | PASS |
| `rg -c "year: 2025" src/lib/photos.ts` returns 3 | PASS |
| `rg -c "year: 2024" src/lib/photos.ts` returns 0 | PASS (no 2024 photos) |
| All 6 filenames present verbatim (case-sensitive) | PASS — `000092530012.jpeg`, `20230928 MSB_0114.jpg`, `IMG_0028.jpeg`, `IMG_1075.JPG`, `IMG_2129.jpeg`, `Patricof09.jpg` all found |
| `rg "use client" src/lib/photos.ts` returns 0 | PASS |
| `rg "export function formatDayNumeral" src/lib/dates.ts` returns 1 | PASS |
| `rg "getUTCDate" src/lib/dates.ts` returns 1 | PASS |
| `rg "if \(!iso\) return" src/lib/dates.ts` returns 3 | PASS (2 existing + 1 new) |
| `rg "export function formatMonthYear" src/lib/dates.ts` returns 1 | PASS (no regression) |
| `rg "export function formatMonthDay" src/lib/dates.ts` returns 1 | PASS (no regression) |
| `npm run build` exit 0 (D-30) | PASS — `✓ Compiled successfully in 2.1s` |

## Downstream Consumers Unlocked

- **Plan 11-04 (`/events`)** — `import { formatDayNumeral, formatMonthYear } from "@/lib/dates"` for the giant-day-numeral signature visual (D-18).
- **Plan 11-05 (`/photos`)** — `import { PHOTOS_BY_YEAR, groupPhotosByYear } from "@/lib/photos"` to render two `<YearBlock>` groups (2025 first, then 2023), each with 3 photo plates.

## Deviations from Plan

None — plan executed exactly as written. Plan, RESEARCH, and CONTEXT all agreed on the empirical year mapping; no uncertainty surfaced.

## Implementation Notes for Plan 11-05

- The filename `20230928 MSB_0114.jpg` contains a SPACE — Plan 11-05 will need to URL-encode `%20` (or rely on `next/image` to handle the path string correctly) when building `src` props.
- `IMG_1075.JPG` uses uppercase `.JPG` — Vercel's static-asset serving is case-sensitive, so the casing is preserved verbatim in the data module.
- `groupPhotosByYear()` returns a Map; iterate with `for (const [year, photos] of groups) { … }` or `Array.from(groups.entries()).map(…)`.

## Commit

- `b2e196c` — `feat(11-02): add photos data module + formatDayNumeral helper`

## Self-Check: PASSED

- Files `src/lib/photos.ts` (created) and `src/lib/dates.ts` (modified) confirmed present.
- Commit `b2e196c` confirmed via `git log`.
- All 11-02-V gates passed; npm build exits 0.
