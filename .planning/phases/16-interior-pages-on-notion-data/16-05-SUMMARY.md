---
phase: 16-interior-pages-on-notion-data
plan: 05
subsystem: ui
tags: [next.js, react, tailwind, youtube, server-component, isr]

# Dependency graph
requires:
  - phase: 16-01
    provides: USES_DATA from src/lib/uses.ts and WATCHING_ITEMS from src/lib/watching.ts; img.youtube.com remotePattern in next.config.ts
  - phase: 16-02
    provides: v3 component primitives (PageHero, UsesList, VideoCard, Breadcrumbs)

provides:
  - /uses page: Server Component with UsesList (4 groups: AI & Development, Productivity, Communication, Hardware with TODO placeholders)
  - /watching page: Server Component with YouTube VideoCard grid (6 placeholder entries, thumbnails from img.youtube.com CDN)
  - VideoCard patched: thumbnail prop (Next.js Image), target prop, rel prop forwarded to Link element
  - Both pages: Breadcrumbs (semantic nav + JSON-LD), PageHero, revalidate=1800, metadata

affects: [17-infra-preservation-seo, 18-qa-perf-gate]

# Tech tracking
tech-stack:
  added: []
  patterns:
    - Server Component page with hardcoded data module (no Notion fetch); mirrors /photos pattern
    - VideoCard extended with optional thumbnail/target/rel for external YouTube links
    - YouTube CDN thumbnail pattern: img.youtube.com/vi/{id}/hqdefault.jpg

key-files:
  created:
    - src/app/uses/page.tsx
    - src/app/watching/page.tsx
  modified:
    - src/components/v3/video-card.tsx
    - src/__tests__/components/video-card.test.tsx

key-decisions:
  - "VideoCard keeps CSS play-triangle as fallback when no thumbnail prop; Image only renders when thumbnail provided"
  - "Used container.querySelector('a') in test instead of screen.getAllByRole to avoid cross-test accumulation in jsdom"
  - "Both pages wrap Breadcrumbs + content in fragment; px-6 md:px-40 on wrapper div (not per-section)"

patterns-established:
  - "External link pattern: VideoCard target='_blank' rel='noopener noreferrer' (T-16-09 tabnapping mitigation)"
  - "YouTube thumbnail URL: https://img.youtube.com/vi/{id}/hqdefault.jpg via Next.js Image (width=480 height=360)"

requirements-completed: [PG-02, PG-03, PG-05]

# Metrics
duration: 25min
completed: 2026-06-20
---

# Phase 16 Plan 05: /uses and /watching Pages Summary

**Static /uses and /watching pages wired to hardcoded data modules; VideoCard extended with YouTube thumbnail + target/rel forwarding for tabnapping mitigation (D-09/T-16-09)**

## Performance

- **Duration:** ~25 min
- **Started:** 2026-06-20T00:07:00Z
- **Completed:** 2026-06-20T00:12:00Z
- **Tasks:** 2
- **Files modified:** 4

## Accomplishments

- Created `/uses` page: Server Component rendering PageHero + UsesList with all 4 groups (AI & Development, Productivity, Communication, Hardware with TODO placeholders), Breadcrumbs, metadata, revalidate=1800
- Created `/watching` page: Server Component rendering PageHero + VideoCard grid (auto-fill minmax 320px, gap 22px) from WATCHING_ITEMS; each card gets YouTube CDN thumbnail and opens in new tab with noopener noreferrer
- Patched VideoCard with optional `thumbnail`, `target`, and `rel` props; thumbnail replaces CSS play-triangle with Next.js Image; play-triangle preserved as fallback; both props forwarded to Link
- Updated video-card tests: added next/image vi.mock, implemented it.todo for target/rel assertion (9 tests passing, 4 todo)

## Task Commits

1. **Task 1: Create /uses page** - `fb82402` (feat)
2. **Task 2: Patch VideoCard + create /watching page** - `223a20c` (feat)

**Plan metadata:** (pending docs commit)

## Files Created/Modified

- `src/app/uses/page.tsx` - /uses Server Component; imports USES_DATA; PageHero + Breadcrumbs + UsesList + RuleStrong dividers; revalidate=1800 + metadata
- `src/app/watching/page.tsx` - /watching Server Component; imports WATCHING_ITEMS; PageHero + Breadcrumbs + VideoCard grid; YouTube CDN thumbnails; target+rel for all links; revalidate=1800 + metadata
- `src/components/v3/video-card.tsx` - Extended Props with thumbnail?, target?, rel?; conditional Image vs play-triangle render; target/rel forwarded to Link
- `src/__tests__/components/video-card.test.tsx` - Added next/image vi.mock; implemented target/rel test using container.querySelector

## Decisions Made

- **VideoCard thumbnail as conditional:** Keep CSS play-triangle fallback so existing VideoCard usages (without thumbnail) are unchanged. Only renders Image when `thumbnail` prop is provided.
- **Test fix (Rule 1 - Bug):** `screen.getAllByRole("link")` accumulates elements across tests in the same jsdom environment without cleanup between tests. Switched to `container.querySelector("a")` from the render result for the target/rel test -- this is reliable regardless of other test renders.
- **Page wrapper pattern:** Both pages use a `<div className="px-6 md:px-40">` wrapper around hero + content rather than per-section padding, keeping the structure clean.

## Deviations from Plan

### Auto-fixed Issues

**1. [Rule 1 - Bug] video-card test: screen.getAllByRole accumulates across tests**
- **Found during:** Task 2 (video-card.test.tsx target/rel assertion)
- **Issue:** `screen.getAllByRole("link")` returns links from ALL prior renders in the same jsdom environment. The test was getting elements from earlier test renders, not the specific VideoCard being tested.
- **Fix:** Changed `screen.getAllByRole("link")` to `container.querySelector("a")` using the render result's container, which is scoped to the current render only.
- **Files modified:** src/__tests__/components/video-card.test.tsx
- **Verification:** Test passes reliably; all 9 tests green
- **Committed in:** 223a20c (Task 2 commit)

**2. [Rule 2 - Missing Critical] Added next/image vi.mock to video-card test**
- **Found during:** Task 2 (VideoCard now imports next/image after patch)
- **Issue:** Test file had no mock for `next/image`. Without mocking, the Image component would fail in jsdom (no browser image loading).
- **Fix:** Added `vi.mock("next/image", ...)` returning a plain `<img>` element with forwarded props.
- **Files modified:** src/__tests__/components/video-card.test.tsx
- **Verification:** All tests pass with mock in place
- **Committed in:** 223a20c (Task 2 commit)

---

**Total deviations:** 2 auto-fixed (1 bug, 1 missing critical)
**Impact on plan:** Both fixes required for tests to pass correctly. No scope creep.

## Issues Encountered

None beyond the auto-fixed test issues above.

## User Setup Required

None - no external service configuration required. YouTube remotePattern was already added to next.config.ts in Plan 01.

## Known Stubs

The following stubs exist intentionally as placeholders for Monty to fill before v3 launch:

| Stub | File | Reason |
|------|------|--------|
| Hardware items: "TODO: [Monty to fill in]" | src/lib/uses.ts (lines 50-52) | Hardware specs unknown at build time; tracked in D-06 |
| Watching items: channel "TODO: [Monty to fill in]" | src/lib/watching.ts (lines 25-57) | Real YouTube content TBD; video IDs also placeholder |

These stubs do NOT prevent the plan's goal from being achieved -- pages render correctly with placeholder data. Content swap is a pre-launch task for Monty.

## Threat Flags

None. The YouTube external link tabnapping threat (T-16-09) was mitigated as required: all VideoCard anchors on /watching have `target="_blank" rel="noopener noreferrer"`.

## Next Phase Readiness

- /uses and /watching routes are live as Server Components with ISR 30min
- Both need to be added to sitemap, JSON-LD, and Umami tracking (Phase 17)
- VideoCard thumbnail prop is ready for real YouTube video IDs when Monty fills in watching.ts
- No blockers for subsequent plans in Phase 16

## Self-Check: PASSED

- [x] src/app/uses/page.tsx exists
- [x] src/app/watching/page.tsx exists
- [x] src/components/v3/video-card.tsx patched with thumbnail/target/rel
- [x] Commits fb82402 and 223a20c exist in git log
- [x] npx vitest: 9 passed, 4 todo
- [x] npx tsc --noEmit: clean

---
*Phase: 16-interior-pages-on-notion-data*
*Completed: 2026-06-20*
