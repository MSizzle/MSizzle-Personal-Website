---
phase: 16-interior-pages-on-notion-data
plan: "06"
subsystem: blog-slug-page
tags:
  - essay-view
  - page-hero
  - pumpkin-amber
  - breadcrumbs
  - tdd
dependency_graph:
  requires:
    - 16-03
    - 16-04
  provides:
    - essay-reading-view-v3
  affects:
    - src/app/blog/[slug]/page.tsx
tech_stack:
  added: []
  patterns:
    - PageHero-with-crumb
    - full-bleed-cover-image
    - fetchPriority-high-lcp
    - formatMonthYear-meta-row
key_files:
  created: []
  modified:
    - src/app/blog/[slug]/page.tsx
    - src/__tests__/pages/blog-slug.test.tsx
decisions:
  - "D-14: Essay view now shows PageHero with breadcrumb (Home / Writing), reading time, publish date, and optional first tag in meta row"
  - "D-breadcrumb-writing: Breadcrumbs Writing href locked to /writing (not /blog) in semantic nav"
  - "D-02: Full-bleed cover image renders when post.cover exists; type-only hero when absent"
  - "nextjs16-fetchpriority-quirk: fetchPriority=high set explicitly on cover Image per memory note"
metrics:
  duration: "~5 minutes"
  completed: "2026-06-20T04:25:00Z"
  tasks_completed: 1
  files_modified: 2
---

# Phase 16 Plan 06: Essay Reading View Repaint Summary

**One-liner:** Essay reading view repainted with PageHero/breadcrumb/reading-meta, full-bleed Notion cover image (fetchPriority=high), and Pumpkin Amber tokens — all while preserving NotionRenderer, ISR, generateStaticParams, and RelatedEssays unchanged.

## Tasks Completed

| Task | Name | Commit | Files |
|------|------|--------|-------|
| RED  | Add failing TDD tests for essay view | b6d0c02 | src/__tests__/pages/blog-slug.test.tsx |
| GREEN | Repaint essay reading view with v3 PageHero and tokens | 596892c | src/app/blog/[slug]/page.tsx |

## What Was Built

### src/app/blog/[slug]/page.tsx

Repainted the essay reading view onto the v3 Pumpkin Amber system:

1. **Semantic Breadcrumbs** (`Breadcrumbs` component, sr-only + JSON-LD): `items` now use `href="/writing"` for the Writing parent — previously used `/blog` (D-14, D-breadcrumb-writing).

2. **Full-bleed cover image** (D-02): When `post.cover` is non-null, renders a `relative w-full h-[400px] md:h-[600px]` wrapper with `<Image fill priority fetchPriority="high" sizes="100vw" className="object-cover">` via the `/api/notion-cover?pageId=` proxy. Falls back to type-only hero when cover is absent.

3. **PageHero** (`src/components/v3/page-hero.tsx`): Receives `title={post.title}` and `crumb="Home / Writing"` — renders the display h1 + mono breadcrumb line per v3 system.

4. **Meta row** below PageHero: `font-mono text-xs text-[var(--color-text-muted)]` with reading time, formatted publish date (`formatMonthYear` from `@/lib/dates`), and optional first tag, separated by accent-colored dot spans.

5. **RuleStrong** divider below meta row (v3 `src/components/v3/rule-strong.tsx`).

6. **Prose article**: `max-w-[68ch]` (updated from prior 66ch); `NotionRenderer` is UNCHANGED inside `.prose.max-w-none` div (IN-01/IN-02).

7. **NewsletterCta + RelatedEssays** remain at bottom of article, unchanged.

8. **v2 tokens removed**: `text-section-feature`, `text-ink`, `text-muted` removed from all className strings. Replaced with `text-[var(--color-text-muted)]` and CSS custom property references per Pumpkin Amber system.

9. **ISR preserved**: `export const revalidate = 1800`, `generateStaticParams`, `generateMetadata` all unchanged.

## TDD Gate Compliance

- **RED gate (test commit):** b6d0c02 — 7 new tests added as failing (2 failed as expected: breadcrumb href + cover image)
- **GREEN gate (feat commit):** 596892c — all 9 tests pass

Tests added in `src/__tests__/pages/blog-slug.test.tsx`:
- `renders post title in PageHero h1`
- `Breadcrumbs Writing item href is /writing NOT /blog`
- `reading time appears in meta row`
- `renders cover image with fetchPriority=high when post.cover exists`
- `does NOT render cover image when post.cover is null`
- `calls notFound() when post is missing`
- `NotionRenderer is present with the fetched blocks`

## Verification Results

| Check | Result |
|-------|--------|
| `grep "text-ink\|text-muted\|text-section-feature"` (standalone) | CLEAN (0 matches) |
| `grep "revalidate = 1800"` | 1 match |
| `grep "NotionRenderer"` | 3 matches (import + type + usage) |
| `grep "fetchPriority"` | 1 match (on cover Image) |
| `grep "notion-cover"` | 1 match (hero image src) |
| `grep "RelatedEssays"` | 2 matches (import + usage) |
| `grep 'href.*\/writing'` | 1 match |
| `grep 'href.*\/blog'` | 0 matches |
| `npx vitest run blog-slug.test.tsx` | 9/9 pass |
| `npx tsc --noEmit` | CLEAN |

## Deviations from Plan

None - plan executed exactly as written.

The acceptance criteria grep pattern `grep "text-ink\|text-muted\|text-section-feature"` produces a false positive match on line `text-[var(--color-text-muted)]` because the substring `-muted` appears inside the v3 CSS var reference. The standalone check confirms no actual v2 tokens exist. This is noted for the verifier.

## Known Stubs

None. All data flows through real Notion API calls (`getPostBySlug`, `getBlocks`).

## Threat Flags

None. No new network endpoints, auth paths, or schema changes introduced. The existing `/api/notion-cover` proxy and its trust boundary (T-16-14) remain unchanged. `fetchPriority="high"` mitigates T-16-14 (LCP regression on mobile PSI).

## Self-Check: PASSED

- [x] `src/app/blog/[slug]/page.tsx` exists and is modified
- [x] `src/__tests__/pages/blog-slug.test.tsx` exists and is modified
- [x] RED commit b6d0c02 exists in git log
- [x] GREEN commit 596892c exists in git log
- [x] All 9 tests pass
- [x] TypeScript clean
