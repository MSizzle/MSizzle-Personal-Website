---
phase: 19-project-cards-covers-redesign
plan: "03"
subsystem: og-images
tags: [og-images, branding, fonts, tdd]
dependency_graph:
  requires: []
  provides: [og-fonts/hanken-grotesk-800.woff, og-fonts/jetbrains-mono-400.woff, root-og-title-card, blog-og-title-card, project-og-title-card]
  affects: [src/app/opengraph-image.tsx, src/app/blog/[slug]/opengraph-image.tsx, src/app/projects/[slug]/opengraph-image.tsx]
tech_stack:
  added: []
  patterns: [satori-node-runtime-fonts, readFileSync-module-scope-og, tdd-module-export-assertions]
key_files:
  created:
    - src/app/og-fonts/hanken-grotesk-800.woff
    - src/app/og-fonts/jetbrains-mono-400.woff
  modified:
    - src/app/opengraph-image.tsx
    - src/app/blog/[slug]/opengraph-image.tsx
    - src/app/projects/[slug]/opengraph-image.tsx
    - src/__tests__/pages/og-image.test.tsx
decisions:
  - "Remove runtime = 'edge' from slug OG routes so readFileSync works (Node runtime fully supports ImageResponse in Next 16)"
  - "Font files committed as static assets via one-time jsdelivr download, not npm packages"
  - "Module-scope readFileSync for both font files so each OG route statically prerenders"
  - "Horizontal ellipsis (not hyphens) for title truncation at 90 chars; description at 140 chars"
metrics:
  duration_minutes: 12
  tasks_completed: 2
  files_changed: 6
  completed_date: "2026-07-06"
---

# Phase 19 Plan 03: OG Images as Vermilion/Ink/Paper Title-Cards Summary

**One-liner:** All three OG routes rebuilt as paper/ink/vermilion typographic title-cards with Hanken 800 + JetBrains Mono font data embedded via committed WOFF assets and Node runtime.

## What Was Built

Retired the off-brand navy `#1a1a2e` scheme and gradient OG images. Rebuilt all three `opengraph-image.tsx` routes as static typographic title-cards matching the site's brutalist identity:

- **Root OG** (`/opengraph-image`): Paper `#faf9f7` field, white title block "Monty Singer" in Hanken 800 with a `16px 16px 0 #171717` hard ink offset shadow, vermilion `#e5411f` kicker chip "MONTYSINGER.COM", mono tagline below.
- **Blog OG** (`/blog/[slug]/opengraph-image`): ESSAY kicker chip, dynamic title truncated to 90 chars, ink offset shadow `14px 14px 0 #171717`, date in footer, montysinger.com mark.
- **Project OG** (`/projects/[slug]/opengraph-image`): PROJECT kicker chip, same title-card layout, description below title (truncated to 140 chars), montysinger.com mark.
- **Font assets**: Hanken Grotesk 800 (17500 bytes) and JetBrains Mono 400 (27496 bytes) downloaded from jsdelivr and committed as static repo files. No new npm dependency.
- **Tests**: Replaced 3 `it.todo` stubs with real module-export assertions; all 3 pass.

## Tasks Completed

| Task | Name | Commit | Files |
|------|------|--------|-------|
| 1 | Font assets + root OG title-card | 6f367a8 | og-fonts/ (2 new), opengraph-image.tsx, og-photo.jpg (deleted) |
| 2 (RED) | Failing OG tests | d4157ec | src/__tests__/pages/og-image.test.tsx |
| 2 (GREEN) | Blog + project slug OG routes | 3a7e529 | blog/[slug]/opengraph-image.tsx, projects/[slug]/opengraph-image.tsx |

## Verification

- `npx vitest run src/__tests__/pages/og-image.test.tsx` exits 0: 3/3 pass
- `grep -rE 'linear-gradient|1a1a2e|0a0a0a' src/app/*opengraph*` returns nothing
- No errors from `npx tsc --noEmit` in OG route files
- No new test failures (3 pre-existing failures in explorative-homepage/section-building unchanged)
- Both font files confirmed WOFF by `file` command, each >15000 bytes
- `og-photo.jpg` deleted, zero remaining references in `src/`

## Deviations from Plan

### Auto-fixed Issues

**1. [Rule 2 - Quality] Removed em dashes from file comments**
- **Found during:** Task 1 file creation
- **Issue:** Comments in the file header used em dashes (`--`), which would cause a file-wide grep to flag the file despite no em dashes in string literals
- **Fix:** Replaced em dashes in comments with semicolons and hyphens
- **Files modified:** src/app/opengraph-image.tsx
- **Commit:** 6f367a8

None of the substantive deviations. Plan executed as specified.

## TDD Gate Compliance

- RED gate: `test(19-03)` commit d4157ec -- 2 of 3 tests failing as expected
- GREEN gate: `feat(19-03)` commit 3a7e529 -- all 3 tests passing
- REFACTOR gate: not needed (code clean on first pass)

## Known Stubs

None. Both slug routes fetch real Notion data with try/catch fallbacks to 'Writing' / 'Project'.

## Threat Flags

No new threat surface beyond what the plan's threat model covers. Supply chain risk T-19-06 mitigated: fonts downloaded from official @fontsource paths on jsdelivr, size-checked (>15000 bytes), filetype-confirmed as WOFF, then committed as static repo assets.

## Self-Check: PASSED

- src/app/og-fonts/hanken-grotesk-800.woff: FOUND
- src/app/og-fonts/jetbrains-mono-400.woff: FOUND
- src/app/opengraph-image.tsx: FOUND
- src/app/blog/[slug]/opengraph-image.tsx: FOUND
- src/app/projects/[slug]/opengraph-image.tsx: FOUND
- Commit 6f367a8: FOUND
- Commit d4157ec: FOUND
- Commit 3a7e529: FOUND
