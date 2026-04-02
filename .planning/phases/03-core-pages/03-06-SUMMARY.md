---
phase: 03-core-pages
plan: 06
subsystem: seo-og-images
tags: [og-images, sitemap, robots, seo, edge-runtime]
dependency_graph:
  requires: [03-03, 03-04]
  provides: [og-images, sitemap, robots-txt]
  affects: []
tech_stack:
  added: []
  patterns: [next-og-edge-runtime, next-sitemap-native, next-robots-native]
key_files:
  created:
    - src/app/opengraph-image.tsx
    - src/app/blog/[slug]/opengraph-image.tsx
    - src/app/projects/[slug]/opengraph-image.tsx
    - src/app/sitemap.ts
    - src/app/robots.ts
  modified: []
decisions:
  - "Used next/og ImageResponse with edge runtime — no @vercel/og package needed (built into Next.js)"
  - "Blog OG image shows title AND date per locked decision D-14"
  - "Sitemap try/catch around Notion calls — sitemap still serves with just static routes when Notion is unavailable"
  - "NEXT_PUBLIC_SITE_URL env var with msizzle.com fallback — works in all environments"
metrics:
  duration_seconds: 376
  completed_date: "2026-04-02"
  tasks_completed: 2
  tasks_total: 2
  files_created: 5
  files_modified: 0
---

# Phase 03 Plan 06: OG Images, Sitemap, and robots.txt Summary

**One-liner:** Dynamic OG images using Next.js edge runtime at all route segments, XML sitemap with 5 static routes plus dynamic Notion slugs, and robots.txt — all SEO/social essentials in place.

## Tasks Completed

| Task | Name | Commit | Key Files |
|------|------|--------|-----------|
| 1 | Create OG image files for all route segments | a1dd386 | src/app/opengraph-image.tsx, src/app/blog/[slug]/opengraph-image.tsx, src/app/projects/[slug]/opengraph-image.tsx |
| 2 | Create sitemap.ts and robots.ts | 939d912 | src/app/sitemap.ts, src/app/robots.ts |

## What Was Built

**Default OG image** (`src/app/opengraph-image.tsx`):
- Edge runtime, 1200x630px, dark gradient background `linear-gradient(135deg, #0a0a0a 0%, #1a1a2e 100%)`
- Shows "msizzle.com" label, "Monty Singer" title, and tagline
- Bottom-left layout (column, items start, justify end), 60px padding
- Inline styles only — no className (Satori requirement)

**Blog post OG image** (`src/app/blog/[slug]/opengraph-image.tsx`):
- Edge runtime, same visual design
- Fetches post title AND date from Notion via `getPostBySlug` (D-14 requirement)
- Date formatted as "Month DD, YYYY" via `toLocaleDateString`
- try/catch fallback to "Writing" generic title when Notion unavailable

**Projects OG image** (`src/app/projects/[slug]/opengraph-image.tsx`):
- Edge runtime, same visual design
- Fetches project title and description from Notion via `getProjectBySlug`
- try/catch fallback to "Project" generic title when Notion unavailable

**Sitemap** (`src/app/sitemap.ts`):
- 5 static routes: `/` (priority 1.0), `/about` (0.8), `/projects` (0.9), `/blog` (0.9), `/links` (0.5)
- Dynamic blog post slugs from Notion (priority 0.7, changeFrequency monthly)
- Dynamic project slugs from Notion (priority 0.7, changeFrequency monthly)
- try/catch around each Notion call — sitemap degrades gracefully when API unavailable
- `NEXT_PUBLIC_SITE_URL` env var with `https://msizzle.com` fallback

**robots.txt** (`src/app/robots.ts`):
- `userAgent: '*'` — allows all crawlers
- `allow: '/'` — allows all paths
- `sitemap` reference to `/sitemap.xml`

## Deviations from Plan

None — plan executed exactly as written. All files match plan specification. Build verified clean.

## Known Stubs

None — all files are fully functional. OG images fetch live data from Notion with graceful fallbacks. Sitemap includes all routes.

## Self-Check: PASSED

Files verified:
- FOUND: src/app/opengraph-image.tsx
- FOUND: src/app/blog/[slug]/opengraph-image.tsx
- FOUND: src/app/projects/[slug]/opengraph-image.tsx
- FOUND: src/app/sitemap.ts
- FOUND: src/app/robots.ts

Commits verified:
- a1dd386: feat(03-06): create OG images for root, blog/[slug], and projects/[slug]
- 939d912: feat(03-06): add sitemap.ts with all routes and robots.ts

Build routes confirmed:
- /opengraph-image (Dynamic)
- /blog/-/opengraph-image (Dynamic)
- /projects/-/opengraph-image (Dynamic)
- /sitemap.xml (Static)
- /robots.txt (Static)
