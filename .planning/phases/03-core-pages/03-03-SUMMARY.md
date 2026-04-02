---
phase: 03-core-pages
plan: 03
subsystem: projects-portfolio
tags: [projects, portfolio, notion, ISR, card-grid, case-study]
dependency_graph:
  requires: [03-01]
  provides: [projects-data-layer, projects-listing-page, projects-case-study-page, project-card-component]
  affects: [03-05, 03-06]
tech_stack:
  added: []
  patterns: [notion-data-layer, ISR-30min, generateStaticParams, generateMetadata, card-grid]
key_files:
  created:
    - src/lib/notion-projects.ts
    - src/components/projects/project-card.tsx
    - src/app/projects/page.tsx
    - src/app/projects/[slug]/page.tsx
  modified:
    - src/app/blog/page.tsx
    - src/app/blog/[slug]/page.tsx
decisions:
  - "Project card external link text is 'Check out more information' per user request — overrides UI-SPEC 'View Project' copy"
  - "Added env var guards + try-catch to notion-projects.ts functions — build succeeds without NOTION_PROJECTS_DATABASE_ID set"
  - "getFeaturedProjects hard-limits to 3 results via page_size and post-query slice"
metrics:
  duration_seconds: 1120
  completed_date: "2026-04-02"
  tasks_completed: 2
  tasks_total: 2
  files_created: 4
  files_modified: 2
---

# Phase 03 Plan 03: Projects Pages Summary

**One-liner:** Notion-backed projects data layer with getPublishedProjects/getProjectBySlug/getFeaturedProjects, responsive card grid at /projects, and case study detail pages at /projects/[slug] using NotionRenderer.

## Tasks Completed

| Task | Name | Commit | Key Files |
|------|------|--------|-----------|
| 1 | Create projects Notion data layer and ProjectCard component | c1261c7 | src/lib/notion-projects.ts, src/components/projects/project-card.tsx |
| 2 | Create projects listing and case study pages | 6999675 | src/app/projects/page.tsx, src/app/projects/[slug]/page.tsx |

## What Was Built

**Projects data layer** (`src/lib/notion-projects.ts`):
- Same pLimit(2) + withRetry pattern as notion.ts — rate-limit safe
- Uses dataSources.query (v5 API) — compatible with @notionhq/client v5
- `Project` interface: id, slug, title, description, image, externalUrl, tags, featured, published, lastEdited
- `getPublishedProjects()` — paginated query, filter Published=true, sort by Date descending
- `getProjectBySlug(slug)` — exact slug + Published filter, page_size 1
- `getFeaturedProjects()` — Published + Featured filter, limited to 3
- Env var guard on all exports — returns [] or null when env vars absent (build-safe)

**ProjectCard component** (`src/components/projects/project-card.tsx`):
- Server component (no "use client")
- Aspect-video thumbnail with object-cover, or placeholder div if no image
- Title links to /projects/[slug] for case study navigation
- Description with line-clamp-3
- Tag pills in neutral-100/neutral-800 style
- "Check out more information" external link with ExternalLink icon (lucide-react) — accent color
- Hover: hover:border-[var(--accent)]/50 transition-colors duration-200

**Projects listing page** (`src/app/projects/page.tsx`):
- ISR revalidate = 1800 (30 minutes)
- Metadata: "Projects — Monty Singer"
- Responsive grid: sm:grid-cols-2 lg:grid-cols-3, gap-8
- Empty state: "Projects coming soon." heading + "Case studies and build logs being added." body
- max-w-5xl layout consistent with UI-SPEC

**Project case study page** (`src/app/projects/[slug]/page.tsx`):
- ISR revalidate = 1800
- generateStaticParams: fetches all published projects, returns slug array
- generateMetadata: title, description, openGraph title+description
- notFound() guard when project not found by slug
- Header: h1, description, tag pills, "Visit project →" external link
- Content: prose prose-neutral dark:prose-invert + NotionRenderer for full Notion block rendering

## Deviations from Plan

### Auto-fixed Issues

**1. [Rule 2 - Missing Error Handling] Blog pages crash at build with invalid NOTION_TOKEN**
- **Found during:** Task 2 build verification
- **Issue:** `generateStaticParams()` in `/blog/[slug]/page.tsx` called `getPublishedPosts()` without try-catch. When `NOTION_TOKEN` is set but invalid (401 response), the error propagated and crashed the build. Same issue in `/blog/page.tsx`.
- **Fix:** Added try-catch returning `[]` in `blog/[slug]/page.tsx generateStaticParams`. Added typed `BlogPost[]` with try-catch in `blog/page.tsx`. These are pre-existing issues not caused by this plan's changes.
- **Files modified:** `src/app/blog/[slug]/page.tsx`, `src/app/blog/page.tsx`
- **Commit:** 6999675

**2. [Design deviation] Project card link text**
- **Not a bug** — User explicitly requested "Check out more information" instead of UI-SPEC's "View Project". Applied as directed.
- Plan text already reflected this; code matches plan.

## Known Stubs

None — all components are fully wired. Data will show when NOTION_PROJECTS_DATABASE_ID is set and Projects database is created in Notion.

## Self-Check: PASSED

Files verified:
- FOUND: src/lib/notion-projects.ts
- FOUND: src/components/projects/project-card.tsx
- FOUND: src/app/projects/page.tsx
- FOUND: src/app/projects/[slug]/page.tsx

Commits verified:
- c1261c7: feat(03-03): create projects Notion data layer and ProjectCard component
- 6999675: feat(03-03): create projects listing and case study pages, fix blog page error handling

Build: npx next build exits 0 — routes /projects (○ static) and /projects/[slug] (● SSG) both present.
