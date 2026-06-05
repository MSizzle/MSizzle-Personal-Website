---
phase: 12-sub-page-restyle-sweep
plan: "06"
subsystem: frontend
tags: [restyle, typography, design-system, prometheus, phase-12]
dependency_graph:
  requires: [12-01]
  provides: [RESTYLE-05]
  affects: [src/app/prometheus/page.tsx]
tech_stack:
  added: []
  patterns: [v2.0-token-swap, text-section-feature, text-label, text-muted, text-ink]
key_files:
  created: []
  modified:
    - src/app/prometheus/page.tsx
decisions:
  - "/prometheus h1 uses text-section-feature text-ink (28px bold) per RECIPE §2 per-route table"
  - "Subtitle uses text-label uppercase text-muted replacing opacity-75 hack per RECIPE §1"
  - "Prose block, JsonLd, FAQS array, and external links left unchanged — zero scope creep"
metrics:
  duration: "1 minute 6 seconds"
  completed: "2026-05-21"
  tasks_completed: 1
  tasks_total: 1
  files_created: 0
  files_modified: 1
---

# Phase 12 Plan 06: Restyle /prometheus Summary

**One-liner:** v2.0 token swap on `/prometheus` — h1 to `text-section-feature text-ink` (28px bold) and subtitle to `text-label uppercase text-muted` (11px tracked), satisfying RESTYLE-05.

## What Was Built

Applied two targeted className edits to `src/app/prometheus/page.tsx`:

1. **h1 className change (line 49):**
   - From: `className="text-2xl font-normal tracking-tight sm:text-3xl"`
   - To: `className="text-section-feature text-ink"`

2. **Subtitle p className change (line 50):**
   - From: `className="mt-2 text-sm uppercase tracking-widest opacity-75"`
   - To: `className="mt-2 text-label uppercase text-muted"`

All other content preserved unchanged: article wrapper, Breadcrumbs (sr-only), JsonLd, FAQS const, `prose mt-8 max-w-none` block, external links (prometheus.today, mailto), and metadata.

## Task Commits

| Task | Name | Commit | Files |
|------|------|--------|-------|
| 1 | Restyle /prometheus — h1 and subtitle token swap | 1a45b4e | `src/app/prometheus/page.tsx` (2 lines changed) |

## rg Gate Results

**Negative gates (all returned 0 — v1.0 vocabulary gone):**
- `rounded-(?!full)`: 0
- `shadow-`: 0
- `var(--bg)|var(--border)|var(--accent)|var(--foreground)`: 0
- `text-2xl font-normal tracking-tight`: 0
- `text-sm uppercase tracking-widest`: 0

**Positive gates (all returned >= 1 — v2.0 vocabulary present):**
- `text-section-feature`: 1
- `text-label`: 1
- `text-muted`: 1
- `text-ink`: 1
- `bg-paper|text-ink|text-muted|border-rule`: 2

**Build gate:** `npm run build` exits 0. `/prometheus` rendered as static page. `✓ Compiled successfully in 1774ms`.

## Deviations from Plan

None — plan executed exactly as written. Two targeted className changes, zero scope creep.

## Known Stubs

None. The page is fully hardcoded static content — no API calls, no Notion fetches, no placeholders.

## Threat Flags

None. No new network endpoints, auth paths, file access patterns, or schema changes. The existing `rel="noopener noreferrer"` on prometheus.today link was preserved (T-12-06-01 accepted). JsonLd FAQ schema is unchanged (T-12-06-02 accepted).

## Self-Check: PASSED

- [x] `src/app/prometheus/page.tsx` exists and has both v2.0 tokens
- [x] `rg -c 'text-section-feature' src/app/prometheus/page.tsx` = 1
- [x] `rg -c 'text-label' src/app/prometheus/page.tsx` = 1
- [x] `rg -c 'text-muted' src/app/prometheus/page.tsx` = 1
- [x] `rg -c 'text-ink' src/app/prometheus/page.tsx` = 1
- [x] `rg -c 'text-2xl font-normal tracking-tight' src/app/prometheus/page.tsx` = 0
- [x] `rg -c 'text-sm uppercase tracking-widest' src/app/prometheus/page.tsx` = 0
- [x] Commit 1a45b4e exists on worktree-agent-a9f53f5caaaccefe3 branch
- [x] No files deleted
- [x] `npm run build` exits 0
- [x] RESTYLE-05 requirement met
