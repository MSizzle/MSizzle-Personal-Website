---
phase: 16-interior-pages-on-notion-data
plan: 04
subsystem: ui
tags: [nextjs, react, tailwind, notion, card-grid, photo-grid, page-hero, tdd]

requires:
  - phase: 16-01
    provides: Notion data loaders (getPublishedPosts, getPublishedProjects, ISR 1800)
  - phase: 16-03
    provides: Repainted editorial components (YearBlock, RuleStrong, Rule) with Pumpkin Amber tokens

provides:
  - Extended Card component with optional coverSrc/coverAlt props (backward compatible)
  - Writing index (/writing) rebuilt as photo grid of Cards grouped by year with PageHero
  - Works index (/projects) rebuilt as photo grid of Cards grouped by year with PageHero
  - Cover image integration via /api/notion-cover proxy for both index pages

affects:
  - 16-05
  - 17-infra-seo
  - 18-qa-perf-gate

tech-stack:
  added: []
  patterns:
    - "Photo grid of Cards pattern: YearBlock year header above auto-fill minmax(260px) CSS grid of Card components"
    - "Cover image via notion-cover proxy: coverSrc={post.cover ? /api/notion-cover?pageId={id} : undefined} -- existence signal gates the prop"
    - "TDD for async Server Components: vi.mock the data loader, call the async page function, render result as element"

key-files:
  created:
    - src/__tests__/components/card.test.tsx
  modified:
    - src/components/v3/card.tsx
    - src/app/writing/page.tsx
    - src/app/projects/page.tsx
    - src/__tests__/pages/writing.test.tsx
    - src/__tests__/pages/projects.test.tsx

key-decisions:
  - "D-01 satisfied: Card hover is color-only (bg-bg-2 on hover, 150ms transition-colors) -- no marquees or autonomous animation"
  - "D-02 satisfied: Cover image via /api/notion-cover proxy for both index pages; graceful fallback when cover is null"
  - "D-03 satisfied: Both index pages use photo grid of Cards (minmax 260px auto-fill) -- ListRow removed from both files"
  - "D-04 satisfied: Year-grouping preserved as YearBlock section headers above each year's card grid"
  - "Grep check false positive accepted: plan acceptance criteria grep for text-muted also matches the correct v3 form text-[var(--color-text-muted)]; bare v2 class text-muted is absent"

patterns-established:
  - "Card with cover: coverSrc renders Image above padded text block with aspect-[4/3]; absent coverSrc renders text-only (backward compatible)"
  - "Notion cover image existence signal: use post.cover or project.image to gate coverSrc prop; proxy URL always uses page ID"
  - "YearBlock wraps children: pass card grid div as children inside YearBlock; no sibling-only pattern needed"

requirements-completed:
  - PG-01
  - PG-04
  - IN-01
  - IN-02

duration: ~8min
completed: 2026-06-20
---

# Phase 16 Plan 04: Photo Grid Index Pages Summary

**Writing and Works indexes rebuilt from ListRow lists to photo grids of Cards using the /api/notion-cover proxy, with PageHero replacing the atmosphere-photo title block -- 25 tests pass, 6 commits, 0 TypeScript errors**

## Performance

- **Duration:** ~8 min
- **Started:** 2026-06-20T00:00:00Z
- **Completed:** 2026-06-20T04:04:29Z
- **Tasks:** 3 (each with TDD RED + GREEN cycles = 6 commits)
- **Files modified:** 5 (3 source + 2 test files updated; 1 test file created)

## Accomplishments

- Extended Card component with optional `coverSrc`/`coverAlt` props; cover image bleeds to card edges above the padded text block in 4:3 aspect ratio; fully backward compatible
- Rebuilt /writing page: ListRow list replaced with photo grid of Cards, PageHero replaces atmosphere-photo two-column header, year-grouped YearBlock sections retained, ISR 1800 preserved, empty state "No essays yet. Check back soon." added
- Rebuilt /projects page: same structural pattern as /writing, PageHero with title "Building", project.image used as existence signal for cover proxy, hrefs point to /projects/[slug], empty state "No projects yet. Check back soon."
- 25 tests pass across 3 test files; TypeScript clean throughout

## Task Commits

Each task followed TDD RED then GREEN:

1. **Task 1 RED: card.test.tsx failing tests** - `2833ba2` (test)
2. **Task 1 GREEN: card.tsx coverSrc extension** - `24b445b` (feat)
3. **Task 2 RED: writing.test.tsx failing tests** - `603c9c9` (test)
4. **Task 2 GREEN: writing/page.tsx photo grid rebuild** - `f5dacfa` (feat)
5. **Task 3 RED: projects.test.tsx failing tests** - `515daf1` (test)
6. **Task 3 GREEN: projects/page.tsx photo grid rebuild** - `3622e97` (feat)

## Files Created/Modified

- `src/components/v3/card.tsx` - Extended with coverSrc/coverAlt props; Image above text block; backward compatible
- `src/app/writing/page.tsx` - Full rebuild: PageHero + YearBlock + Card grid + cover proxy + empty state; Image/IntroLink/ListRow removed
- `src/app/projects/page.tsx` - Full rebuild: PageHero + YearBlock + Card grid + cover proxy + empty state; Image/IntroLink/ListRow removed
- `src/__tests__/components/card.test.tsx` - Created: 9 tests covering coverSrc, href, alt, backward compat
- `src/__tests__/pages/writing.test.tsx` - Updated: 8 tests (retained Plan 01 USES_DATA + added 5 Plan 04 integration tests)
- `src/__tests__/pages/projects.test.tsx` - Updated: 8 tests (retained Plan 01 WATCHING_ITEMS + added 5 Plan 04 integration tests)

## Decisions Made

- **Cover image existence signal:** `post.cover` (for writing) and `project.image` (for projects) gate the `coverSrc` prop; the proxy URL always uses the page ID regardless of the field value, per plan specification
- **YearBlock wraps children:** YearBlock accepts children, so the card grid div is passed as a child inside YearBlock rather than rendered as a sibling after a standalone year heading
- **RuleStrong between year sections:** Used RuleStrong (not Rule) between year sections inside the content div, removing the intermediate `Rule` used in the old ListRow layout
- **No em dashes in copy:** The /projects page subtitle uses " -- " (double hyphen) per CLAUDE.md site copy rules

## Deviations from Plan

### Minor Plan Notes

**1. Grep check false positive (informational only -- no code change needed)**
- **Context:** Plan acceptance criteria specify `grep "text-ink\|text-muted\|bg-rule-strong\|border-rule" ... returns no output`
- **Issue:** The correct v3 replacement form `text-[var(--color-text-muted)]` contains "text-muted" as a substring, so the grep would match it
- **Assessment:** The bare v2 class `text-muted` (without `var()` wrapper) is NOT present in any of the three modified files. The grep pattern does not use word boundaries, creating a false positive when the correct CSS variable form is used. This is a plan flaw in the grep check, not a code issue.
- **Resolution:** No code change needed. v3 inline CSS variable syntax is correct per the token mapping in the plan.

None - plan executed exactly as written (all tasks, behaviors, and acceptance criteria met).

## Issues Encountered

None -- TDD approach caught integration points cleanly. The async Server Component test pattern (mock data loader, call async page function, render result) worked correctly with vitest + testing-library/react.

## Known Stubs

None -- cover images are conditionally rendered based on real Notion data (post.cover / project.image existence signal). No hardcoded empty values or placeholder text in the data path.

## Threat Surface Scan

No new network endpoints or auth paths introduced. Both pages use existing data loaders and the existing /api/notion-cover proxy. Defensive try/catch retained in both pages (T-16-07 mitigated).

## User Setup Required

None -- no external service configuration required.

## TDD Gate Compliance

All three tasks used TDD RED/GREEN cycles:
- RED commits: 2833ba2, 603c9c9, 515daf1 (test)
- GREEN commits: 24b445b, f5dacfa, 3622e97 (feat)
- REFACTOR: not needed (code was clean from GREEN)

## Next Phase Readiness

- Card component is photo-grid-ready for any future index page
- Writing and Works indexes are visually complete per D-01 through D-04
- Cover image integration pattern established for /uses and /watching pages (if those use the same proxy)
- Phase 16 Plan 05+ can proceed with remaining interior page work

---
*Phase: 16-interior-pages-on-notion-data*
*Completed: 2026-06-20*
