---
phase: 12-sub-page-restyle-sweep
plan: "03"
subsystem: projects
tags: [restyle, projects, design-system, phase-12, v2.0]
dependency_graph:
  requires: [12-01]
  provides: [RESTYLE-02]
  affects: []
tech_stack:
  added: []
  patterns: [v2.0-token-mapping, text-label, text-section-feature, border-rule, text-muted]
key_files:
  created: []
  modified:
    - src/app/projects/page.tsx
    - src/components/projects/project-card.tsx
    - src/app/projects/[slug]/page.tsx
decisions:
  - "/projects index h1 uses text-label (functional label style) per recipe §2 — list page, not archive index"
  - "/projects/[slug] h1 uses text-section-feature (28px) per recipe §2 — project detail deserves visual weight"
  - "Empty-state opacity-75 → text-muted (Rule 2: recipe §1 prefer explicit token over opacity hack)"
metrics:
  duration: "10 minutes"
  completed: "2026-05-21"
  tasks_completed: 1
  tasks_total: 1
  files_created: 0
  files_modified: 3
---

# Phase 12 Plan 03: Restyle /projects Summary

**One-liner:** v1.0 → v2.0 token sweep for `/projects` index, `ProjectCard`, and `/projects/[slug]` — replacing border-[var(--border)] with border-rule, h1 classes with text-label/text-section-feature, opacity hacks with text-muted, and removing rounded-lg from the hero image wrapper.

## What Was Built

Applied four targeted edits across three files per the 12-RECIPE.md token mapping (RESTYLE-02):

**`src/app/projects/page.tsx`**
- h1: `text-sm font-normal uppercase tracking-widest` → `text-label uppercase text-muted`
- Empty-state p: `opacity-75` → `text-muted` (Rule 2 auto-fix: recipe §1 prefers explicit token)

**`src/components/projects/project-card.tsx`**
- Link className: `border-[var(--border)]` → `border-rule` (hairline divider)
- Description p: `opacity-75` → `text-muted`
- `hover:opacity-60` preserved — already v2.0 compliant

**`src/app/projects/[slug]/page.tsx`**
- Hero wrapper: `rounded-lg bg-[var(--muted)]` → `bg-muted` (removed rounded corners + fixed CSS-var alias)
- h1: `text-2xl font-normal tracking-tight sm:text-3xl` → `text-section-feature text-ink`
- Description p: `opacity-80` → `text-muted`
- Tag spans: `opacity-75` → `text-muted`
- `hover:opacity-60` on external link preserved — v2.0 compliant
- Prose block `className="prose mt-12 max-w-none"` left unchanged (global .prose override handles ink color)
- Breadcrumbs (sr-only), OG image path, revalidate, metadata, generateStaticParams — all untouched

## Task Commits

| Task | Name | Commit | Files |
|------|------|--------|-------|
| 1a | Restyle /projects index and ProjectCard | b524b00 | `src/app/projects/page.tsx`, `src/components/projects/project-card.tsx` |
| 1b | Restyle /projects/[slug] detail page | 7cabbf7 | `src/app/projects/[slug]/page.tsx` |

## rg Gate Results

**Negative gates (expect 0 — v1.0 vocabulary gone):**
- `rounded-(?!full)` in all three files: 0 — PASS
- `shadow-` in all three files: 0 — PASS
- `var(--bg)|var(--border)|var(--accent)|var(--muted)` in all three files: 0 — PASS

**Positive gates (expect >= 1 — v2.0 vocabulary present):**
- `border-rule` in project-card.tsx: 1 — PASS
- `text-section-feature` in slug page: 1 — PASS
- `text-label` in projects page: 1 — PASS
- `bg-paper|text-ink|text-muted|border-rule` in slug page: 3 — PASS

**Build gate:** `npm run build` — exit 0 — PASS

## Deviations from Plan

### Auto-fixed Issues

**1. [Rule 2 - Missing critical] Fixed empty-state opacity hack in projects/page.tsx**
- **Found during:** Task 1, Edit A
- **Issue:** `<p className="mt-8 opacity-75">Projects coming soon.</p>` uses opacity hack instead of text-muted token; recipe §1 explicitly maps `opacity-75 on body/description text` → `text-muted`
- **Fix:** Changed to `className="mt-8 text-muted"`
- **Files modified:** `src/app/projects/page.tsx`
- **Commit:** b524b00

## Known Stubs

None. All three files are fully wired — no hardcoded empty values or placeholder text in v2.0 output.

## Threat Flags

None. This is a styling-only change with no new network endpoints, auth paths, file access patterns, or schema changes. Existing `rel="noopener noreferrer"` on external project link preserved unchanged.

## Self-Check: PASSED

- [x] `src/app/projects/page.tsx` exists and contains `text-label`
- [x] `src/components/projects/project-card.tsx` exists and contains `border-rule`
- [x] `src/app/projects/[slug]/page.tsx` exists and contains `text-section-feature`
- [x] Commit b524b00 exists on worktree-agent-acaf94a66cbbe6526
- [x] Commit 7cabbf7 exists on worktree-agent-acaf94a66cbbe6526
- [x] No modifications to STATE.md or ROADMAP.md
- [x] No files outside the three listed were touched
- [x] npm run build exits 0
