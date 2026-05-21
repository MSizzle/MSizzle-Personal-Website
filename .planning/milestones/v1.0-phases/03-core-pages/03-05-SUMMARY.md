---
phase: 03-core-pages
plan: 05
subsystem: about-links-pages
tags: [about-page, links-page, json-ld, social-hub, prose-narrative]
dependency_graph:
  requires: [03-01]
  provides: [about-page, links-page]
  affects: [03-06]
tech_stack:
  added: []
  patterns: [prose-narrative, json-ld-structured-data, vertical-card-list, inline-svg-brand-icons]
key_files:
  created:
    - src/app/about/page.tsx
    - src/app/links/page.tsx
  modified: []
decisions:
  - "Used inline SVG brand icons for Twitter/X, LinkedIn, GitHub in Links page — lucide-react v4 removed brand icons (same pattern established in Plan 01 Footer)"
  - "Newsletter card in Links page links to /blog route (not dead #newsletter anchor) — where newsletter CTA form will live"
metrics:
  duration_seconds: 586
  completed_date: "2026-04-02"
  tasks_completed: 2
  tasks_total: 2
  files_created: 2
  files_modified: 0
---

# Phase 03 Plan 05: About Page and Links Page Summary

**One-liner:** Hardcoded prose About page with Georgetown/NYC/investing narrative and JSON-LD Person schema, plus vertical card-based Links page (Linktree replacement) with 5 social links including newsletter routing to /blog.

## Tasks Completed

| Task | Name | Commit | Key Files |
|------|------|--------|-----------|
| 1 | Create About page with prose narrative and JSON-LD | 72c6d6b | src/app/about/page.tsx |
| 2 | Create Links page with vertical social card list | d5aca08 | src/app/links/page.tsx |

## What Was Built

**About page** (`src/app/about/page.tsx`):
- Server component with metadata (`title: 'About — Monty Singer'`)
- Person JSON-LD structured data with `alumniOf: Georgetown University`, sameAs social links, jobTitle, description
- 4-section prose narrative inside `prose prose-neutral dark:prose-invert` typography wrapper:
  - Intro paragraph: investor/builder/student in NYC
  - Education: Georgetown University, analytical thinking
  - Career: investing in NYC, builder mindset
  - Skills & Interests: tech/finance intersection, reading, exploring NYC
- Responsive layout: `max-w-3xl px-6 pb-24 pt-32`
- h1: "About Me" with `text-3xl font-semibold tracking-tight sm:text-5xl`

**Links page** (`src/app/links/page.tsx`):
- Server component with metadata (`title: 'Links — Monty Singer'`)
- 5 vertical link cards in mobile-first layout (`max-w-md`):
  1. Email — `mailto:monty@msizzle.com`
  2. Twitter / X — `https://twitter.com/msizzle`
  3. LinkedIn — `https://linkedin.com/in/montysinger`
  4. GitHub — `https://github.com/montysinger`
  5. Subscribe to Newsletter — `/blog` (routes to blog page where CTA form lives)
- Card design per UI-SPEC: `min-h-16 rounded-xl border bg-secondary px-4`
- Hover: `hover:border-[var(--accent)]/30 hover:bg-[var(--accent)]/5 transition-colors duration-150`
- WCAG accessibility: `aria-label` on each icon, `aria-hidden="true"` on ArrowUpRight decorative indicator
- External links: `target="_blank" rel="noopener noreferrer"` — internal `/blog` link omits these

## Deviations from Plan

### Auto-fixed Issues

**1. [Rule 1 - Bug] lucide-react v4 removed brand icons — same fix as Plan 01**
- **Found during:** Task 2 implementation
- **Issue:** LINKS array in plan spec references `Twitter`, `Linkedin`, `Github` icon components from lucide-react. Plan 01 already discovered these were removed in v4. Used inline SVGs (same approach as footer.tsx).
- **Fix:** Defined `TwitterIcon`, `LinkedinIcon`, `GithubIcon` as local inline SVG components. Kept `Mail` and `Newspaper` from lucide-react (generic icons still present).
- **Files modified:** `src/app/links/page.tsx`
- **Commit:** d5aca08

## Known Stubs

None — both pages are fully wired with hardcoded content. No Notion dependency per D-13.

## Self-Check: PASSED

Files verified:
- FOUND: src/app/about/page.tsx
- FOUND: src/app/links/page.tsx

Commits verified:
- 72c6d6b: feat(03-05): create About page with prose narrative and JSON-LD
- d5aca08: feat(03-05): create Links page with vertical social card list
