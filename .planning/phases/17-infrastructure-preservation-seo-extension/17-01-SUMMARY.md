---
phase: 17-infrastructure-preservation-seo-extension
plan: "01"
subsystem: seo
tags: [sitemap, seo, tests, vitest, regression-gate]
dependency_graph:
  requires: []
  provides:
    - sitemap /uses + /watching entries (D-04)
    - automated SEO regression gate (IN-03)
    - umami analytics test verification (IN-04)
  affects:
    - src/app/sitemap.ts
    - src/__tests__/seo/
    - src/__tests__/pages/
tech_stack:
  added: []
  patterns:
    - vitest async server component render pattern
    - vi.mock for Next.js modules (next/image, next/link)
    - direct import of route handler default exports for unit testing
key_files:
  created:
    - src/__tests__/seo/sitemap.test.ts
    - src/__tests__/seo/robots.test.ts
    - src/__tests__/pages/uses.test.tsx
    - src/__tests__/pages/watching.test.tsx
  modified:
    - src/app/sitemap.ts
    - src/__tests__/seo/feed-route.test.ts
decisions:
  - "D-04 applied: /uses and /watching added to staticRoutes at priority 0.6, changeFrequency monthly, mirroring /photos entry"
  - "D-01 honored: no VideoObject or ItemList schema builders added; tests are assertion-only"
  - "D-02 honored: no @vercel/og image added; OG parity confirmed by metadata assertions in uses.test.tsx + watching.test.tsx"
  - "getByText replaced with getAllByText for breadcrumb assertions — both Breadcrumbs and PageHero render the page name text, so getByText throws MultipleElements"
metrics:
  duration: "~15 minutes"
  completed: "2026-06-20"
  tasks_completed: 2
  files_changed: 6
---

# Phase 17 Plan 01: Add /uses + /watching to sitemap + automated SEO regression gate Summary

One-liner: Extended sitemap.ts with /uses and /watching static routes (priority 0.6, monthly), then created a 5-file vitest regression gate proving IN-03 (SEO infra) and IN-04 (Umami) on the v3 branch.

## What Was Built

### Production change

`src/app/sitemap.ts` — two new entries added to `staticRoutes` after the `/photos` entry:

```typescript
{ url: `${SITE_URL}/uses`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.6 },
{ url: `${SITE_URL}/watching`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.6 },
```

The array now has 11 static routes. Both routes appear as `○ /uses` and `○ /watching` in `npm run build` output with 30m revalidate.

### Automated regression gate (IN-03)

| File | Tests | Status |
|------|-------|--------|
| `src/__tests__/seo/sitemap.test.ts` (new) | 3 | green |
| `src/__tests__/seo/robots.test.ts` (new) | 2 | green |
| `src/__tests__/seo/feed-route.test.ts` (extended) | 2 | green |
| `src/__tests__/pages/uses.test.tsx` (new) | 5 | green |
| `src/__tests__/pages/watching.test.tsx` (new) | 5 | green |
| `src/__tests__/components/umami-analytics.test.tsx` (unchanged, IN-04) | 3 | green |

## Verification Results

All checks passed:

1. `npx vitest run src/__tests__/seo/sitemap.test.ts` — 3 tests pass
2. `npx vitest run src/__tests__/seo/robots.test.ts` — 2 tests pass
3. `npx vitest run src/__tests__/seo/feed-route.test.ts` — 2 tests pass (original + channel title)
4. `npx vitest run src/__tests__/pages/uses.test.tsx` — 5 tests pass
5. `npx vitest run src/__tests__/pages/watching.test.tsx` — 5 tests pass
6. `npx vitest run src/__tests__/components/umami-analytics.test.tsx` — 3 tests pass (unmodified)
7. `npx vitest run` — **0 failing tests** (136 passed, 19 todo, 4 skipped test files)
8. `npm run build` — **exit code 0** (TypeScript clean, all 24 routes generated)
9. `grep -n "/uses\|/watching" src/app/sitemap.ts` — exactly **2 matches**

## Task Commits

| Task | Name | Commit |
|------|------|--------|
| 1 | Add /uses and /watching to sitemap + regression test suite | 8a93430 |

## Deviations from Plan

### Auto-fixed Issues

**1. [Rule 1 - Bug] getByText("Uses"/"Watching") throws MultipleElements**
- **Found during:** Task 1 Step E/F (first test run)
- **Issue:** `screen.getByText("Uses")` throws because both the mocked Breadcrumbs component and the mocked PageHero component render the text "Uses" — Breadcrumbs via its `items` span, PageHero via its `title` h1. Testing Library's `getByText` requires exactly one match.
- **Fix:** Replaced `screen.getByText("Uses")` and `screen.getByText("Watching")` with `screen.getAllByText(...).length).toBeGreaterThan(0)` in the breadcrumb render tests. Semantics preserved — tests still assert the text is present in the DOM.
- **Files modified:** `src/__tests__/pages/uses.test.tsx`, `src/__tests__/pages/watching.test.tsx`
- **Commit:** 8a93430

**2. [Rule 3 - Blocking] Worktree base was not at Phase 17 base commit**
- **Found during:** Initial execution
- **Issue:** Worktree HEAD was at `93498f0` (v2.0/main state, predating Phase 16) rather than `8a8f239` (Phase 17 base which includes Phase 16's /uses and /watching pages). Running `git merge-base HEAD 8a8f239` returned a different commit.
- **Fix:** Executed `git reset --hard 8a8f239369211bfde19a146ae3d603693bfd5b41` per the worktree-branch-check protocol, then re-applied the sitemap edit. The reset was correct per the prompt's `<worktree_branch_check>` spec.
- **Impact:** None — sitemap edit was cleanly re-applied; all Phase 16 pages (/uses, /watching) became available in the worktree as expected.

## Known Stubs

None introduced by this plan. The `/uses` and `/watching` pages were created in Phase 16. Their `USES_DATA` Hardware items contain `TODO:` placeholder details (noted in Phase 16 summary) — these pre-exist and are not regression in this plan.

## Threat Surface Scan

No new network endpoints, auth paths, file access patterns, or schema changes introduced. Test files are dev-only. Sitemap entries add routes to the public-crawlable index — this is the intended behavior. See Plan threat model for T-17-01 through T-17-SC.

## Self-Check: PASSED

Created files exist:
- src/__tests__/seo/sitemap.test.ts — FOUND
- src/__tests__/seo/robots.test.ts — FOUND
- src/__tests__/pages/uses.test.tsx — FOUND
- src/__tests__/pages/watching.test.tsx — FOUND

Modified files:
- src/app/sitemap.ts — contains /uses and /watching entries (grep confirmed 2 matches)
- src/__tests__/seo/feed-route.test.ts — contains channel title assertion

Commit exists: 8a93430 — CONFIRMED
