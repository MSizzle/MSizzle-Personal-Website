---
phase: 03-core-pages
plan: 02
subsystem: homepage
tags: [homepage, hero, scroll-narrative, json-ld, seo]
dependency_graph:
  requires: [03-01]
  provides: [homepage-complete]
  affects: [03-03, 03-04, 03-05, 03-06]
tech_stack:
  added: []
  patterns: [scroll-narrative-layout, json-ld-structured-data, design-token-usage]
key_files:
  created: []
  modified:
    - src/app/page.tsx
decisions:
  - "Hero section uses pt-24 (96px top padding) to offset fixed navigation per UI-SPEC spacing contract"
  - "JSON-LD Person structured data embedded directly in page for SEO per D-17/SOC-04"
  - "Profile photo rendered as styled div placeholder — real photo to be swapped when available"
  - "Sections use border-[var(--border)] token for dividers instead of hard-coded neutral colors from old placeholder"
metrics:
  duration_seconds: 96
  completed_date: "2026-04-02"
  tasks_completed: 1
  tasks_total: 1
  files_created: 0
  files_modified: 1
---

# Phase 03 Plan 02: Homepage — Hero + Scroll Narrative Sections Summary

**One-liner:** Complete homepage replacing placeholder — hero with profile photo placeholder, "Hey, I'm Monty." h1, tagline, two CTAs, four full-viewport narrative sections (About, Projects, Writing, Connect), and JSON-LD Person structured data.

## Tasks Completed

| Task | Name | Commit | Key Files |
|------|------|--------|-----------|
| 1 | Build complete homepage with hero and scroll narrative sections | cf1b591 | src/app/page.tsx |

## What Was Built

**Homepage** (`src/app/page.tsx`):
- Replaced scroll-test placeholder with production-ready layout
- **Hero section** (`min-h-screen`): circular profile photo placeholder (styled div), h1 "Hey, I'm Monty." at `text-6xl sm:text-7xl font-semibold tracking-tight`, tagline in `text-[var(--fg-muted)]`, two CTA buttons: primary "View My Work" (accent background, links to /projects), secondary "Read My Writing" (muted text, links to /blog)
- **About Snapshot** (`min-h-screen`): h2, descriptive body copy, "More about me →" link to /about
- **Featured Work** (`min-h-screen`): h2, project teaser body, "See all projects →" link to /projects
- **Writing Teaser** (`min-h-screen`): h2, writing teaser body, "Read the blog →" link to /blog
- **Contact CTA** (`min-h-screen`): h2, invite copy, "Say hello →" mailto link
- **JSON-LD structured data**: `schema.org/Person` with name, url, sameAs (Twitter, LinkedIn, GitHub), jobTitle, description
- All section dividers use `border-[var(--border)]` design token
- All muted text uses `text-[var(--fg-muted)]` design token
- No ThemeToggle import (navigation handles it via layout.tsx)
- No `<header>` tag (Navigation is in root layout)

## Deviations from Plan

None — plan executed exactly as written.

## Known Stubs

- Profile photo is a styled `<div>` placeholder (`h-32 w-32 rounded-full bg-[var(--bg-secondary)] border border-[var(--border)]`). Real photo to be wired when asset is available. This does not prevent the plan goal from being achieved — the hero section is complete and functional.

## Self-Check: PASSED

Files verified:
- FOUND: src/app/page.tsx (122 insertions, contains all required content)

Commits verified:
- cf1b591: feat(03-02): build complete homepage with hero and scroll narrative sections

Acceptance criteria (all 12 pass):
- PASS: `Hey, I` present in page.tsx
- PASS: `View My Work` present
- PASS: `Read My Writing` present
- PASS: `href="/projects"` present
- PASS: `href="/blog"` present
- PASS: `href="/about"` present
- PASS: `min-h-screen` appears 5 times (hero + 4 sections)
- PASS: `application/ld+json` present
- PASS: `schema.org` present
- PASS: `Monty Singer` present
- PASS: No `ThemeToggle` import
- PASS: No `<header` tag
- PASS: `npx next build` exits 0
