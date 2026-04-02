---
phase: 03-core-pages
plan: 04
subsystem: blog-enhancements
tags: [blog, tag-filter, reading-time, newsletter-cta, client-side-filtering]
dependency_graph:
  requires: [03-01]
  provides: [tag-filter, reading-time-utils, newsletter-cta]
  affects: [03-06]
tech_stack:
  added: []
  patterns: [client-component-within-server-page, estimate-from-metadata, exact-from-fetched-blocks]
key_files:
  created:
    - src/utils/reading-time.ts
    - src/components/blog/tag-filter.tsx
    - src/components/blog/newsletter-cta.tsx
  modified:
    - src/app/blog/page.tsx
    - src/app/blog/[slug]/page.tsx
decisions:
  - "estimateReadingTime used on listing page from description field — no extra API calls per D-09"
  - "calculateReadingTime used on detail page from blocks already fetched for rendering — zero extra API calls"
  - "TagFilter wrapped in Suspense on server component listing page for client component boundary"
  - "Newsletter CTA is a placeholder form — logs to console, no real service wired per plan scope"
metrics:
  duration_seconds: 1060
  completed_date: "2026-04-02"
  tasks_completed: 2
  tasks_total: 2
  files_created: 3
  files_modified: 2
---

# Phase 03 Plan 04: Blog Enhancements — Tag Filter, Reading Time, Newsletter CTA Summary

**One-liner:** Client-side tag filter with pill UI, reading time estimates on listing (from description, no extra API calls) and exact reading time on detail (from already-fetched blocks), plus placeholder newsletter CTA per D-09.

## Tasks Completed

| Task | Name | Commit | Key Files |
|------|------|--------|-----------|
| 1 | Create reading time utilities and tag filter component | 9271e5c | src/utils/reading-time.ts, src/components/blog/tag-filter.tsx |
| 2 | Create newsletter CTA and enhance blog pages | fac618c | src/components/blog/newsletter-cta.tsx, src/app/blog/page.tsx, src/app/blog/[slug]/page.tsx |

## What Was Built

**Reading time utility** (`src/utils/reading-time.ts`):
- `calculateReadingTime(blocks)` — exact reading time from Notion blocks, uses all rich-text block types
- `estimateReadingTime(text)` — lightweight estimate from any text string (e.g. description)
- Both use 200 WPM with `Math.max(1, Math.ceil(words / 200))`, minimum 1 min read

**Tag filter component** (`src/components/blog/tag-filter.tsx`):
- Client component (`'use client'`) for instant filtering without page reload
- "All" pill clears active filter, tag pills toggle the active filter
- Active pill: `bg-[var(--accent)] text-white`; inactive: `bg-neutral-100 dark:bg-neutral-800`
- `overflow-x-auto` pill row for mobile scrollability per DSGN-02
- Reading time displayed per post with dot separator (`{N} min read`)
- Empty filtered state: `No posts tagged "{tag}".` per copywriting contract

**Newsletter CTA** (`src/components/blog/newsletter-cta.tsx`):
- Client component with `email` and `status` state
- Three states: idle (form), success ("You're in. Talk soon."), error
- Form: email input + "Get Posts by Email" button with accent background
- Placeholder implementation — logs to console, no real service wired

**Blog listing page** (`src/app/blog/page.tsx`):
- Stays server component; computes `readingTimes` from descriptions (no extra API calls)
- Passes posts and readingTimes to `<TagFilter>` wrapped in `<Suspense>`
- Empty state check preserved above TagFilter

**Blog detail page** (`src/app/blog/[slug]/page.tsx`):
- `calculateReadingTime(blocks)` called on already-fetched blocks (zero extra API calls)
- Reading time displayed in header with dot separator after date
- `<NewsletterCta />` rendered after prose content block

## Deviations from Plan

None — plan executed exactly as written.

## Known Stubs

- Newsletter CTA form: logs to console only. Intentional — no real email service wired in Phase 3 per plan scope. Future plan will integrate a real newsletter service.

## Self-Check: PASSED

Files verified:
- FOUND: src/utils/reading-time.ts
- FOUND: src/components/blog/tag-filter.tsx
- FOUND: src/components/blog/newsletter-cta.tsx
- FOUND: src/app/blog/page.tsx
- FOUND: src/app/blog/[slug]/page.tsx

Commits verified:
- 9271e5c: feat(03-04): add reading time utilities and tag filter component
- fac618c: feat(03-04): add newsletter CTA, tag filter integration, reading time to blog pages
