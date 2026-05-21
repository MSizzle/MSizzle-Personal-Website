---
phase: 12-sub-page-restyle-sweep
plan: "05"
subsystem: ui/links
tags: [restyle, design-system, phase-12, links, typography]
dependency_graph:
  requires: [12-01]
  provides: [RESTYLE-04]
  affects: [src/app/links/page.tsx]
tech_stack:
  added: []
  patterns: [v2.0-token-swap, text-label, text-body-lead, text-ink, text-muted]
key_files:
  created: []
  modified:
    - src/app/links/page.tsx
decisions:
  - "/links h1 uses text-label uppercase text-muted (functional utility page — label style, not monumental)"
  - "Link list anchors use text-body-lead text-ink (22px consistent) replacing inconsistent text-3xl mobile / sm:text-lg desktop"
  - "Newsletter LINKS entry corrected from /blog to /newsletter — /blog is writing archive, /newsletter is Monty Monthly page"
metrics:
  duration: "4 minutes"
  completed: "2026-05-21"
  tasks_completed: 1
  tasks_total: 1
  files_created: 0
  files_modified: 1
---

# Phase 12 Plan 05: Restyle /links Summary

**One-liner:** Three-change v2.0 restyle of `src/app/links/page.tsx` — h1 token swap to text-label, link anchors to text-body-lead text-ink at consistent 22px, and Newsletter href corrected from /blog to /newsletter.

## What Was Built

Applied RESTYLE-04 to `src/app/links/page.tsx` per the 12-RECIPE.md canonical contract. This is the simplest Wave 2 route — one file, three targeted changes:

**Change 1 — h1 className (line 33):**
- From: `className="text-sm font-normal uppercase tracking-widest"`
- To: `className="text-label uppercase text-muted"`
- Recipe §2: /links uses `text-label uppercase text-muted` (functional utility page)

**Change 2 — Link anchor className (line 51):**
- From: `className="text-3xl underline transition-opacity hover:opacity-60 sm:text-lg"`
- To: `className="text-body-lead text-ink underline transition-opacity hover:opacity-60"`
- v1.0 had inconsistent sizing: 30px mobile / 18px desktop. v2.0 text-body-lead is 22px at all breakpoints.

**Change 3 — LINKS array Newsletter href (line 24):**
- From: `{ href: '/blog', label: 'Newsletter' }`
- To: `{ href: '/newsletter', label: 'Newsletter' }`
- /blog is the writing archive. /newsletter is the Monty Monthly page. Stale data corrected.

Preserved intact: Breadcrumbs, ScrollReveal, `isHttp`/`isMailto` logic, `opensNewTab`, `data-umami-event` attributes, `target="_blank"`, `rel="noopener noreferrer"`, page layout, metadata.

## Task Commits

| Task | Name | Commit | Files |
|------|------|--------|-------|
| 1 | Restyle /links — h1 token, link text size, Newsletter href fix | 7759650 | `src/app/links/page.tsx` (3 changes) |

## rg Gate Results

**Negative gates (all 0 — v1.0 vocabulary gone):**
- `rounded-(?!full)`: 0
- `shadow-`: 0
- `var(--bg)|var(--border)|var(--accent)|var(--foreground)`: 0
- `text-3xl`: 0
- `text-sm font-normal uppercase tracking-widest`: 0
- `href: '/blog', label: 'Newsletter'`: 0
- `bg-gradient-|backdrop-blur-|hover:scale-|group-hover:scale-`: 0

**Positive gates (all >= 1 — v2.0 vocabulary present):**
- `text-label`: 1
- `text-body-lead`: 1
- `text-ink`: 1
- `text-muted`: 1
- `href: '/newsletter'`: 1

**Build gate:** `npm run build` exited 0. `/links` route listed as static prerender.

## Deviations from Plan

None — plan executed exactly as written. Three changes applied, all gates pass, build green.

## Known Stubs

None. The /links page has no Notion API calls and no dynamic data — all content is hardcoded in the LINKS constant. No UI placeholders or data stubs exist.

## Threat Flags

None. This is a styling-only change with no new network endpoints, auth paths, file access patterns, or schema changes. The existing `rel="noopener noreferrer"` on external links (T-12-05-01) is preserved.

## Self-Check: PASSED

- [x] `src/app/links/page.tsx` exists and contains v2.0 tokens
- [x] `rg -c 'text-label' src/app/links/page.tsx` = 1
- [x] `rg -c 'text-body-lead' src/app/links/page.tsx` = 1
- [x] `rg -c "href: '/newsletter'" src/app/links/page.tsx` = 1
- [x] `rg -c 'text-3xl' src/app/links/page.tsx` = 0
- [x] `npm run build` exits 0 — /links static prerendered
- [x] Commit 7759650 exists on worktree-agent-a99c23a165ad667b3
- [x] No files deleted unexpectedly
- [x] RESTYLE-04 requirement met
