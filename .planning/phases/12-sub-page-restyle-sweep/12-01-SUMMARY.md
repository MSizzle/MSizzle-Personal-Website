---
phase: 12-sub-page-restyle-sweep
plan: "01"
subsystem: docs
tags: [docs, restyle, recipe, design-system, phase-12]
dependency_graph:
  requires: []
  provides: [12-RECIPE.md]
  affects: [12-02, 12-03, 12-04, 12-05, 12-06, 12-07]
tech_stack:
  added: []
  patterns: [markdown-canonical-reference]
key_files:
  created:
    - .planning/phases/12-sub-page-restyle-sweep/12-RECIPE.md
  modified: []
decisions:
  - "D-01 enforced: recipe ships first, all Wave 2 plans blocked until recipe exists"
  - "Subscribe CTA spec uses border-ink/text-ink (not border-footer-fg/text-footer-fg from /writing) because Phase 12 pages are not inside an inverted-ink section"
  - "Breadcrumbs remain sr-only per D-06 + Pitfall 3 clarification"
  - "text-page-title (120px) reserved for archive index pages only; Phase 12 sub-pages use text-section-feature (28px) or text-label (11px)"
metrics:
  duration: "5 minutes"
  completed: "2026-05-21"
  tasks_completed: 1
  tasks_total: 1
  files_created: 1
  files_modified: 0
---

# Phase 12 Plan 01: Restyle Recipe Summary

**One-liner:** Canonical 10-section markdown restyle recipe at `.planning/phases/12-sub-page-restyle-sweep/12-RECIPE.md` documenting v1.0 → v2.0 token mappings, per-route h1 decisions, .prose override pattern, Subscribe CTA spec, /newsletter grid spec, and rg validation-gate templates for all 6 Wave 2 plans.

## What Was Built

Created `.planning/phases/12-sub-page-restyle-sweep/12-RECIPE.md` — the single source of truth for the entire Phase 12 restyle sweep. All six Wave 2 plans (12-02 through 12-07) cite this document and must not derive token decisions from CONTEXT.md or RESEARCH.md directly.

The recipe contains 10 sections:

1. **v1.0 → v2.0 Token Mapping Table** — 16 pattern replacements covering palette tokens, typography, shadows, rounded corners, hover effects, gradient/glass effects
2. **Per-Route h1 Size Decisions** — `/about`, `/projects`, `/projects/[slug]`, `/blog`, `/blog/[slug]`, `/links`, `/prometheus`, `/newsletter` all assigned `text-section-feature` or `text-label` with rationale
3. **.prose Override Pattern** — global globals.css already handles this; no per-route changes needed; manual verify required
4. **Subscribe CTA Button Spec** — exact className string matching `/writing` footer pattern; both `/newsletter` CTAs must match
5. **/newsletter Grid Spec** — 2-col mobile / 3-col desktop, card structure, aspect ratios, fetch-limit bump to 20, NewsletterCarousel deletion protocol
6. **Breadcrumb Rule** — sr-only preserved, no visual styling changes
7. **Photo Treatment** — `saturate-[0.92]` filter on all images
8. **ScrollReveal Preservation** — DOM structure inside wrappers must not change
9. **rg Validation Gate Templates** — negative gates (v1.0 vocabulary gone) + positive gates (v2.0 present) + build gate; ready for Wave 2 plans to copy
10. **Out of Scope** — explicit fence list: Nav, Footer, MainOffset, breadcrumbs component, globals.css, Notion fetchers, Phase 9/11 primitives

## Task Commits

| Task | Name | Commit | Files |
|------|------|--------|-------|
| 1 | Write 12-RECIPE.md — canonical Phase 12 restyle reference | 028f183 | `.planning/phases/12-sub-page-restyle-sweep/12-RECIPE.md` (+218 lines) |

## Deviations from Plan

None — plan executed exactly as written. Docs-only plan; no source files were modified.

**Note:** The Write tool initially wrote the file to the main repo path rather than the worktree path (absolute-path safety issue). This was corrected by copying to the correct worktree path and removing the stray main-repo copy before committing. The main repo file was untracked/unstaged and did not affect the worktree commit.

## Known Stubs

None. This is a documentation plan — no UI components, no data binding, no placeholders.

## Threat Flags

None. This is a docs-only plan with no new network endpoints, auth paths, file access patterns, or schema changes.

## Wave 2 Status

Plans 12-02 through 12-07 are **now unblocked**. They may run in parallel — all Wave 2 route files are disjoint.

| Plan | Route | Complexity | Status |
|------|-------|------------|--------|
| 12-02 | `/about` | Low | Unblocked |
| 12-03 | `/projects` + `/projects/[slug]` | Low-Medium | Unblocked |
| 12-04 | `/blog` + `/blog/[slug]` | Medium | Unblocked |
| 12-05 | `/links` | Low | Unblocked |
| 12-06 | `/prometheus` | Medium | Unblocked |
| 12-07 | `/newsletter` | High | Unblocked |

## Self-Check: PASSED

- [x] `.planning/phases/12-sub-page-restyle-sweep/12-RECIPE.md` exists
- [x] `rg -c 'bg-paper' 12-RECIPE.md` returns >= 1 (returns 3)
- [x] `rg -c 'text-section-feature' 12-RECIPE.md` returns >= 1 (returns 7)
- [x] `rg -c 'grid-cols-2' 12-RECIPE.md` returns >= 1 (returns 1)
- [x] File is 218 lines (above 80-line minimum from must_haves.artifacts)
- [x] Commit 028f183 exists and is not on a protected branch
- [x] No source files were modified
