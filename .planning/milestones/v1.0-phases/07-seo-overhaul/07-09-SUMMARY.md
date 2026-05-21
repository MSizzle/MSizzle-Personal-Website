---
phase: 07-seo-overhaul
plan: 09
subsystem: seo
tags: [projects, metadata, breadcrumbs]

requires:
  - phase: 07-seo-overhaul
    provides: Breadcrumbs (Plan 01), canonical helper (Plan 01)
provides:
  - buildProjectMetadata helper returning D-compliant Metadata for any Project
  - Per-project Metadata + Breadcrumbs wired into /projects/[slug]
  - Projects index Metadata pipe-separator title + Breadcrumbs
affects: []

tech-stack:
  added: []
  patterns:
    - "Per-domain Metadata builder mirrors src/lib/seo/blog-metadata.ts (Plan 08): truncate + canonical + OG/Twitter blocks"

key-files:
  created:
    - src/lib/seo/project-metadata.ts
  modified:
    - src/app/projects/page.tsx
    - src/app/projects/[slug]/page.tsx

key-decisions:
  - "Project OG block omits 'images' when project.image is null (Notion cover absent), avoiding empty-string OG image URLs."
  - "D-35 'Built with' line intentionally NOT enforced — PRD §6 says omit rather than guess; this plan does not scrape package.json."

requirements-completed: []

duration: ~3min
completed: 2026-04-15
---

# Phase 07 Plan 09: Project SEO Wave Summary

**buildProjectMetadata helper for D-compliant per-project metadata, Breadcrumbs on the Works index and every project detail.**

## Accomplishments

- Shipped `src/lib/seo/project-metadata.ts` with `buildProjectMetadata(project)` returning Metadata with pipe title, 155-char truncated description, canonical, OG `type: 'website'` (with optional `images` array when `project.image` is set), Twitter card.
- Wired `src/app/projects/page.tsx`:
  - Metadata flipped to pipe form `'Works | Monty Singer'` with 150-160 char description, canonical, OG.
  - Imported and rendered `<Breadcrumbs items={[Home, Works]}>` above the container, padding shifted from `pt-24` to `pt-8`.
- Wired `src/app/projects/[slug]/page.tsx`:
  - `generateMetadata` now returns `buildProjectMetadata(project)` (no more em-dash fallback).
  - Article wrapped in fragment with `<Breadcrumbs items={[Home, Works, project.title]}>` above and padding shifted from `pt-24` to `pt-8`.

## Verification

- Acceptance grep suite passes:
  - projects/page.tsx contains `Works | Monty Singer` and `Breadcrumbs`; no `— Monty Singer`.
  - projects/[slug]/page.tsx contains `buildProjectMetadata` and `Breadcrumbs`; no `— Monty Singer`.

## Decisions Made

- **Conditional `images` in OG block.** Spreads `...(project.image ? { images: [{url: project.image}] } : {})` rather than always including. Avoids passing empty/null URL when a Notion cover is missing.
- **No "Built with" line.** D-35 explicitly says omit rather than guess. Notion's data layer doesn't expose tech stack today, and scraping package.json is brittle.

## Self-Check: PASSED

- All 3 task acceptance criteria satisfied.
- No `— Monty Singer` regression.
- Both index and detail pages have Breadcrumbs above their main content.
