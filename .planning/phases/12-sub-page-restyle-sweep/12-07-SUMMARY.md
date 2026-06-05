---
phase: 12-sub-page-restyle-sweep
plan: "07"
subsystem: newsletter
tags: [restyle, newsletter, design-system, phase-12, layout-redesign, carousel-removal]
dependency_graph:
  requires: [12-01]
  provides: [RESTYLE-06, D-NEWSLETTER-REDESIGN]
  affects: []
tech_stack:
  added: []
  patterns: [server-rendered-grid, editorial-full-width, v2.0-flat-chrome, no-client-components]
key_files:
  created: []
  modified:
    - src/app/newsletter/page.tsx
  deleted:
    - src/components/newsletter/newsletter-carousel.tsx
decisions:
  - "NewsletterCarousel deleted (not tombstoned) — rg confirmed 0 consumers outside newsletter/page.tsx"
  - "Issue gallery placed outside the 66ch reading column at page level, matching Phase 11 editorial full-width pattern"
  - "fetchMontyMonthlyIssues bumped from 10 to 20 per RESTYLE-06 spec"
  - "Image imported directly in page.tsx since carousel (which previously owned the import) was deleted"
  - "Subscribe CTA uses border-ink/text-ink (not footer-fg variants) — page is not in inverted-ink section"
  - "Aspect ratio: 4/5 mobile / 16/9 desktop per recipe §5 spec"
metrics:
  duration: "12 minutes"
  completed: "2026-05-21"
  tasks_completed: 2
  tasks_total: 2
  files_created: 0
  files_modified: 1
  files_deleted: 1
---

# Phase 12 Plan 07: Newsletter Restyle + Grid Redesign Summary

Server-rendered 2-col/3-col issue grid replacing horizontal carousel on /newsletter; full v2.0 palette restyle + RESTYLE-06 + D-NEWSLETTER-REDESIGN satisfied.

## What Was Built

Rebuilt `src/app/newsletter/page.tsx` from 74 lines to 100 lines. Replaced the `<NewsletterCarousel>` client component (horizontal scroll + arrow buttons) with a server-rendered responsive grid that shows all issues at once at full editorial page width. Deleted `newsletter-carousel.tsx` entirely.

## Structural Changes

### Layout
- **Before:** Single `<article className="mx-auto max-w-[66ch]">` containing intro + carousel (all inside 66ch column)
- **After:** Two-zone layout:
  1. Intro column: `<div className="mx-auto max-w-[66ch] px-6 pt-8 pb-8 md:px-0">` — h1 + prose + Subscribe CTA
  2. Issue gallery: `<section className="px-6 pb-16 md:px-40">` — full editorial width, outside the reading column

### Typography
- h1: `text-section-feature text-ink uppercase` (was `text-2xl font-normal tracking-tight sm:text-3xl`)
- Section label: `text-label uppercase text-muted` (was `text-sm font-normal uppercase tracking-widest`)
- Issue title: `text-list-title text-ink` (was `text-base font-normal leading-snug`)
- Issue date: `text-meta uppercase text-muted` (was `text-sm opacity-75`)

### Subscribe CTA
- Before: `rounded-lg border border-[var(--accent)] bg-[var(--accent)] px-6 py-3 text-base font-normal text-white no-underline shadow-md transition-all hover:shadow-lg hover:brightness-110`
- After: `mt-6 inline-block border border-ink px-7 py-3 text-label uppercase text-ink transition-opacity hover:opacity-80 no-underline`

### Issue Grid
- Grid: `grid grid-cols-2 md:grid-cols-3 gap-4 md:gap-6`
- Card: `group block bg-paper border border-rule no-underline` (flat, no rounded, no shadow)
- Thumbnail: `relative aspect-[4/5] md:aspect-[16/9] overflow-hidden bg-muted` with `saturate-[0.92]` (D-07)
- No-thumbnail fallback: `aspect-[4/5] md:aspect-[16/9] bg-muted` (aria-hidden)
- `rel="noopener noreferrer"` on all outbound links (T-12-07-01 mitigation)

### Fetch Limit
- `fetchMontyMonthlyIssues(20)` — bumped from 10

## Task 1: Safety Check

```
rg "NewsletterCarousel" src/
```

Result: 3 hits total:
- `src/app/newsletter/page.tsx:3` — import line
- `src/app/newsletter/page.tsx:52` — JSX usage
- `src/components/newsletter/newsletter-carousel.tsx:7` — export declaration

No other file imports `NewsletterCarousel`. Safe to delete.

## Task 2: rg Gate Results

### Negative gates (all returned 0 — v1.0 vocabulary is gone)
- `rounded-` (PCRE2): **0** — no rounded corners
- `shadow-`: **0** — no shadows
- `var(--bg)|var(--border)|var(--accent)|var(--foreground)`: **0** — no CSS var aliases
- `NewsletterCarousel` in page: **0** — import removed

### Positive gates (all returned >= 1 — v2.0 vocabulary present)
- `grid-cols-2`: **1**
- `md:grid-cols-3`: **1**
- `text-list-title`: **1**
- `text-meta`: **1**
- `border-rule`: **1**
- `border border-ink`: **1**
- `fetchMontyMonthlyIssues(20)`: **1**
- `bg-paper|text-ink|text-muted|border-rule`: **7**

### Carousel deletion
- `rg 'NewsletterCarousel' src/`: **0 hits** — file deleted, no remaining consumers

## Build Result

`npm run build` exits **0**. `/newsletter` appears in the route table as a static route with `revalidate=1d`.

## Todo Moved

`.planning/todos/pending/2026-05-21-newsletter-page-issues-prominence-redesign.md` moved to `.planning/todos/completed/`.

## Deviations from Plan

None — plan executed exactly as written.

## Threat Surface Scan

No new network endpoints, auth paths, or schema changes introduced. All outbound links already carry `rel="noopener noreferrer"` (T-12-07-01 mitigated). Issue links come from author-controlled Substack RSS (T-12-07-02 accepted). React auto-escapes `{issue.title}` (T-12-07-04 accepted).

## Known Stubs

None — newsletter page renders live data from `fetchMontyMonthlyIssues(20)` via Substack RSS.

## Self-Check

- [x] `src/app/newsletter/page.tsx` exists and contains `grid-cols-2`
- [x] `src/components/newsletter/newsletter-carousel.tsx` deleted
- [x] Commit `da1ef7e` exists
- [x] Build exits 0
