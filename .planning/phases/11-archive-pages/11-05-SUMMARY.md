---
phase: 11-archive-pages
plan: 05
subsystem: archive-routes
tags: [route, photos, archive, year-block, server-component, phase-11, wave-3]
requires:
  - src/components/editorial/year-block.tsx (Plan 11-01)
  - src/lib/photos.ts + groupPhotosByYear() (Plan 11-02)
  - src/components/home-v2/editorial-header.tsx (Plan 11-03)
  - src/components/nav/navigation.tsx pathname gate extending to /photos (Plan 11-03)
provides:
  - /photos route (ARCH-03)
  - Homepage AllLink href="/photos" now resolves (D-06 unblock)
  - Homepage PERSONAL "Photo Archive" card now resolves (D-06 unblock)
affects:
  - src/app/photos/page.tsx (NEW)
tech_stack_added: []
tech_stack_patterns:
  - "groupPhotosByYear() Map iteration with [...entries()] spread for stable year-descending order"
  - "encodeURIComponent().replace(/%2F/g, '/') pattern for filenames with spaces (mirrors src/app/page.tsx line 23)"
  - "Fragment wrapping pattern — avoids unnecessary DOM nesting at route root"
  - "aspect-square next/image plates with saturate-[0.92] + figcaption below (D-23 captions-below treatment)"
key_files_created:
  - src/app/photos/page.tsx
key_files_modified: []
decisions:
  - "No active prop on EditorialHeader — handoff Assumption A4: no nav link bolded on /photos (all 5 links muted equally)"
  - "revalidate=1800 (30m ISR) matches /, /writing, /events for consistency; harmless for hardcoded data module"
  - "Atmosphere photo right column hidden at mobile (hidden md:block) per RESEARCH Pitfall 6 — page title stays above fold on small viewports"
  - "RuleStrong placed between YearBlock groups (not after last group) matching /writing year-block separator pattern"
  - "D-31 vercel build --prod deferred to Vercel preview deploy on branch push (Phase 8/9/10 precedent)"
metrics:
  duration: "~15 minutes"
  completed_date: "2026-05-21"
  tasks_completed: 1
  files_changed: 1
---

# Phase 11 Plan 05: /photos Editorial Archive — ARCH-03 Summary

**One-liner:** New `src/app/photos/page.tsx` Server Component — editorial title block + two YearBlock groups (2025: 3 plates, 2023: 3 plates) with saturate(0.92) + captions below, unblocking the homepage AllLink and PERSONAL card to /photos.

## What Was Built

### File: `src/app/photos/page.tsx` (NEW, 114 lines)

A pure Server Component (no `use client`) implementing ARCH-03 — the `/photos` editorial archive page. Key sections:

**Module-level exports:**
- `export const revalidate = 1800` — 30-minute ISR, matches /, /writing, /events cadence
- `export const metadata: Metadata` — title "Photographs | Monty Singer", description "A film-led survey of years in motion.", canonical `/photos`, OpenGraph

**Page structure (per D-22):**
1. `<EditorialHeader />` — shared 5-link nav, no active prop (all links muted on /photos per Assumption A4)
2. Title block section `px-6 pt-40 pb-24 md:px-40 md:pt-[160px] md:pb-[100px]`:
   - Left: label `── The Archive · 04` + h1 `Photographs.` (text-page-title, D-14 trailing period) + blurb
   - Right: `hidden md:block` atmosphere photo — `/MSizzle-website-photos/20230928%20MSB_0114.jpg` — 360x480, fill, `saturate-[0.92]` (PHOTOS[1] per D-22)
3. `<RuleStrong />` after title block
4. Year-grouped section `px-6 md:px-40`: two `<YearBlock>` instances from `groupPhotosByYear()`:
   - **2025** (rendered first — newest): `000092530012.jpeg`, `IMG_2129.jpeg`, `Patricof09.jpg`
   - **2023** (rendered second): `IMG_1075.JPG`, `20230928 MSB_0114.jpg`, `IMG_0028.jpeg`
   - `<RuleStrong />` between the two groups (omitted after last group)

**Photo plate treatment (D-23):**
- `aspect-square` grid cells (3-col lg, 2-col sm, 1-col mobile)
- `object-cover saturate-[0.92]` — matches Phase 10 homepage HOME_PHOTOS treatment
- `figcaption` BELOW the image — NOT mix-blend-difference overlay (homepage-only per D-23)
- `encodeURIComponent(photo.filename).replace(/%2F/g, "/")` — handles space in `20230928 MSB_0114.jpg` → `%20`

## Year Distribution Rendered

| YearBlock | Photos | Filenames |
|-----------|--------|-----------|
| 2025 (first) | 3 | `000092530012.jpeg`, `IMG_2129.jpeg`, `Patricof09.jpg` |
| 2023 (second) | 3 | `IMG_1075.JPG`, `20230928 MSB_0114.jpg`, `IMG_0028.jpeg` |

Totals: 6 photos, 2 YearBlock instances — exactly matches D-11 REVISED + D-24.

## Verification Results (11-05-V)

| Gate | Result |
|------|--------|
| `test -f src/app/photos/page.tsx` | PASS |
| `grep -E "Photographs\." src/app/photos/page.tsx` ≥1 hit | PASS — h1 `Photographs.` (D-14 trailing period) |
| `grep -E "PHOTOS_BY_YEAR\|groupPhotosByYear" src/app/photos/page.tsx` ≥1 hit | PASS — `import { groupPhotosByYear }` + JSDoc + call site |
| `grep -E "YearBlock" src/app/photos/page.tsx` ≥1 hit | PASS — import + JSDoc + `<YearBlock year={year}>` |
| `grep -E "saturate" src/app/photos/page.tsx` ≥1 hit | PASS — 2 hits (title photo + grid plates) |
| `grep -E "aspect-square" src/app/photos/page.tsx` ≥1 hit | PASS — plate container className |
| `grep -E "EditorialHeader" src/app/photos/page.tsx` ≥1 hit | PASS — import + `<EditorialHeader />` |
| `grep -E "20230928" src/app/photos/page.tsx` ≥1 hit | PASS — atmosphere photo src URL |
| `grep -E "text-page-title" src/app/photos/page.tsx` ≥1 hit | PASS — h1 className |
| `grep -E "encodeURIComponent" src/app/photos/page.tsx` ≥1 hit | PASS — filename URL-encoding |
| `! grep -E "mix-blend-difference" src/app/photos/page.tsx` | PASS — 0 hits (D-23 prohibited) |
| `! grep -E "use client" src/app/photos/page.tsx` | PASS — 0 hits (Server Component) |
| `grep -E '"/photos"' src/app/page.tsx` ≥1 hit | PASS — 3 hits; homepage untouched per D-06 |
| `npm run build` exit 0 (D-30) | PASS — ✓ Compiled successfully in 2.1s |
| `/photos` in routes manifest | PASS — `○ /photos  30m  1y` |

## D-06 Unblock Confirmation

After this plan ships:
- Homepage Photographs section `<AllLink href="/photos">Photo Archive →</AllLink>` — previously 404, now navigates to the new /photos route
- Homepage PERSONAL card `{ title: "Photo Archive", href: "/photos" }` — previously 404, now navigates successfully

No code change was required on `src/app/page.tsx` — the links already existed (D-06 explicitly states this).

## Chrome Gate Verification

The v1.0 chrome gate extended by Plan 11-03 (D-26) suppresses `<Navigation>`, `<Footer>`, and `<MainOffset>` on `/photos`. This plan creates no new gate logic — it correctly relies on Plan 11-03's pathname array: `['/', '/writing', '/events', '/photos']`. Verified: /photos does NOT render v1.0 nav/footer.

## Build Gate Results (D-30 + D-31)

- **D-30 (per-plan):** `npm run build` exits 0. `/photos` appears in routes manifest as `○ /photos  30m  1y`.
- **D-31 (phase gate):** `vercel build --prod` deferred to Vercel preview deploy on branch push — Phase 8/9/10 precedent. OPERATOR ACTION: push branch and verify Vercel preview build is green.

## Deviations from Plan

None — plan executed exactly as written. All acceptance criteria satisfied on first attempt.

## Threat Surface Scan

No new security-relevant surfaces introduced beyond what the plan's threat model captured:
- T-11-05-02 (filename injection): mitigated by `encodeURIComponent` on compile-time constants
- No network fetches, no user input, no env-var reads
- next/image serves photos from /public — already publicly reachable

No additional threat flags.

## Commit

- `28b2085` — `feat(11-05): add /photos editorial archive route — ARCH-03`

## Self-Check: PASSED

- File `src/app/photos/page.tsx` confirmed present (114 lines)
- Commit `28b2085` confirmed via `git log`
- All 11-05-V grep gates passed
- `npm run build` exits 0; `/photos` in routes manifest
- No unexpected file deletions in commit
