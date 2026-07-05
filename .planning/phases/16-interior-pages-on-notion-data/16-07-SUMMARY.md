---
phase: 16-interior-pages-on-notion-data
plan: "07"
subsystem: ui
tags: [next.js, react, tailwind, notion, image, breadcrumbs, page-hero, v3-tokens]

# Dependency graph
requires:
  - phase: 16-03
    provides: Pumpkin Amber token system, PageHero component, v3 CSS vars
  - phase: 16-04
    provides: projects index page rebuilt with Card grid (establishes /projects route pattern)

provides:
  - /projects/[slug] repainted with full-bleed Notion cover hero (fetchPriority=high), PageHero, Breadcrumbs (Building -> /projects)
  - Project interface extended with cover field (alias for image, feeds D-02 full-bleed)
  - Defensive generateStaticParams (env guard + try/catch)

affects:
  - phase 17 (SEO extension: /projects/[slug] now has canonical breadcrumb structure)
  - phase 18 (QA: project detail cover image is LCP candidate, fetchPriority set)

# Tech tracking
tech-stack:
  added: []
  patterns:
    - "Project detail uses project.cover (not project.image directly) for full-bleed hero guard"
    - "TDD RED commit before GREEN implementation for plan 07"
    - "Project interface cover field is alias of image — both hold Notion page cover URL"

key-files:
  created: []
  modified:
    - src/app/projects/[slug]/page.tsx
    - src/lib/notion-projects.ts
    - src/__tests__/pages/projects.test.tsx
    - src/__tests__/components/project-card.test.tsx

key-decisions:
  - "Use project.cover as the conditional guard for full-bleed hero (plan spec); added cover field to Project interface as alias for image to satisfy TypeScript and match plan's naming"
  - "Defensive generateStaticParams: added NOTION_TOKEN + NOTION_PROJECTS_DATABASE_ID env guard and try/catch (aligns with blog slug pattern, prevents build failure when Notion env absent)"
  - "ExternalUrl link text changed from 'View on GitHub' to 'View Project' to be project-agnostic"

patterns-established:
  - "Pattern: project.cover && <Image fetchPriority=high sizes=100vw> for full-bleed cover (D-02)"
  - "Pattern: Breadcrumbs Building item href=/projects (not /building)"

requirements-completed: [PG-01, PG-04, IN-01, IN-02]

# Metrics
duration: 15min
completed: 2026-06-20
---

# Phase 16 Plan 07: Project Detail Page Repaint Summary

**Project detail /projects/[slug] repainted with full-bleed Notion cover hero (fetchPriority=high, D-02), PageHero, Building breadcrumb linking to /projects, and Pumpkin Amber v3 tokens throughout**

## Performance

- **Duration:** ~15 min
- **Started:** 2026-06-20T00:28:00Z
- **Completed:** 2026-06-20T00:33:00Z
- **Tasks:** 1 (TDD: RED + GREEN)
- **Files modified:** 4

## Accomplishments
- Repainted /projects/[slug] with full-bleed cover Image using `fetchPriority="high"` when `project.cover` exists (D-02, nextjs16-fetchpriority-quirk memory)
- Breadcrumbs: Home / Building / [Title] with Building href="/projects" (PG-04)
- PageHero renders project title and description using Pumpkin Amber CSS vars
- externalUrl anchor: `rel="noopener noreferrer" target="_blank"` (T-16-15)
- All v2 tokens (text-ink, text-muted, text-section-feature) removed
- generateStaticParams hardened with env guard + try/catch (matches blog slug pattern)
- Added `cover` field to Project interface as typed alias for `image` (D-02 naming contract)
- 14 tests passing (6 new Plan 07 tests + 8 pre-existing), full suite clean (33 files, 120 tests)

## Task Commits

TDD execution with RED/GREEN gate:

1. **RED — test(16-07)** - `f69aa3a` (failing tests for project detail repaint)
2. **GREEN — feat(16-07)** - `c0d0feb` (page repaint + Project interface cover field + mock fixes)

## Files Created/Modified
- `src/app/projects/[slug]/page.tsx` - Full repaint: Image import, PageHero, cover hero, Breadcrumbs, v3 tokens, defensive generateStaticParams
- `src/lib/notion-projects.ts` - Added `cover: string | null` field to Project interface (alias for image, same Notion page cover URL)
- `src/__tests__/pages/projects.test.tsx` - Added Plan 07 describe block (6 tests for detail page); extended mocks; added cover field to existing index page fixtures
- `src/__tests__/components/project-card.test.tsx` - Added cover field to mock Project object (tsc compliance)

## Decisions Made
- Used `project.cover` (not `project.image`) as the full-bleed guard, matching plan spec. Added `cover` to the Project interface as an alias — same data, clearer semantic intent.
- Changed externalUrl link text from "View on GitHub" to "View Project" — more accurate for non-GitHub projects.
- Kept tags rendered below the PageHero (outside article) with `text-[var(--color-text-muted)]` rather than moving into PageHero chips — matches the plan's layout spec.

## Deviations from Plan

### Auto-fixed Issues

**1. [Rule 1 - Bug] Project interface missing `cover` field — TypeScript error**
- **Found during:** Task 1 (implementation)
- **Issue:** `project.cover` referenced in page.tsx but `Project` interface had no `cover` field; only `image` (which is the same data, extracted from `page.cover` in Notion API). `npx tsc --noEmit` errored: TS2339 Property 'cover' does not exist on type 'Project'
- **Fix:** Added `cover: string | null` to Project interface; populated in `extractProjectProperties` as `cover: image` (alias). Also added `cover` field to all affected test fixtures to maintain tsc compliance.
- **Files modified:** src/lib/notion-projects.ts, src/__tests__/pages/projects.test.tsx, src/__tests__/components/project-card.test.tsx
- **Verification:** `npx tsc --noEmit` clean; all 14 tests pass
- **Committed in:** c0d0feb (GREEN implementation commit)

---

**Total deviations:** 1 auto-fixed (Rule 1 - TypeScript error / missing interface field)
**Impact on plan:** Auto-fix necessary for correctness. The `cover` field makes the Project type contract explicit and matches the plan's naming. No scope creep.

## Issues Encountered
- None beyond the TypeScript deviation above.

## Known Stubs
None — no hardcoded placeholder data. Project content comes from Notion via ISR.

## Threat Flags
None — T-16-15 (externalUrl noopener noreferrer) and T-16-17 (fetchPriority LCP) were both implemented as specified.

## Next Phase Readiness
- /projects/[slug] detail page is complete with v3 styling
- Project cover image is LCP candidate with fetchPriority="high" set (Phase 18 PSI gate will verify)
- Phase 17 (SEO extension) can now include /projects/[slug] in sitemap/JSON-LD — breadcrumb structure is canonical

## Self-Check: PASSED
- src/app/projects/[slug]/page.tsx: modified (confirmed)
- src/lib/notion-projects.ts: cover field present (confirmed)
- RED commit f69aa3a: exists in git log
- GREEN commit c0d0feb: exists in git log
- All 14 project tests pass
- TypeScript clean (0 errors)

---
*Phase: 16-interior-pages-on-notion-data*
*Completed: 2026-06-20*
