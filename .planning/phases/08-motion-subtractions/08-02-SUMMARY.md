---
phase: "08-motion-subtractions"
plan: "02"
subsystem: "homepage"
tags: ["motion", "subtraction", "deletion", "motion-budget", "editorial", "tagline"]
dependency_graph:
  requires:
    - "08-01 (PhotoCarousel deletion — same file: src/app/page.tsx)"
  provides:
    - "Homepage Hero without RotatingTagline import or JSX block"
    - "Unblocks Phase 10 HOME-V2-05 (replacement static intro paragraph in same slot)"
  affects:
    - "src/app/page.tsx"
    - "src/components/home/rotating-tagline.tsx"
tech_stack:
  added: []
  patterns:
    - "Pure subtraction — no replacement markup, no placeholder, no stub"
    - "Identifier-anchored edits (resilient to line-number drift from prior plans)"
key_files:
  created: []
  modified:
    - "src/app/page.tsx"
  deleted:
    - "src/components/home/rotating-tagline.tsx"
decisions:
  - "Removed wrapping `<div className=\"mt-4\">` along with `<RotatingTagline />` — D-02 (deletion is total, no transitional slot)"
  - "Hero copy + Prometheus/About/Contact link block left untouched — Phase 10 replaces hero on a clean slate"
  - "No comment marker or placeholder left where component sat"
metrics:
  duration: "<1 minute"
  completed_date: "2026-05-21"
  tasks_completed: 1
  files_changed: 2
requirements_completed:
  - MOTION-02
validation_task: "8-02-V"
---

# Phase 08 Plan 02: Delete RotatingTagline Summary

**One-liner:** Removed the looping 3.5s `setInterval`-driven RotatingTagline — deleted `src/components/home/rotating-tagline.tsx`, the import in `src/app/page.tsx`, and the wrapping `<div className="mt-4"><RotatingTagline /></div>` JSX block — the second MOTION subtraction toward the v2.0 editorial motion budget.

## Tasks Completed

| Task | Name | Commit | Files |
|------|------|--------|-------|
| 1 | Delete RotatingTagline component file and homepage call site | 31ae6b9 | src/app/page.tsx (modified), src/components/home/rotating-tagline.tsx (deleted) |

## What Was Removed

### Component File

`src/components/home/rotating-tagline.tsx` — Deleted. Was a 41-line `'use client'` component that rotated through 5 hardcoded taglines on a 3.5s `setInterval` with translate-y + opacity transitions. Violated v2.0 motion budget ("zero looping animations" per editorial-redesign-handoff §"Motion Budget — strict") and CONTEXT.md D-02 ("deletion is total — no transitional placeholder").

### Homepage Call Site

`src/app/page.tsx` modifications:

1. **Removed import line** (was line 7 post-Plan-01): `import { RotatingTagline } from "@/components/home/rotating-tagline";`
2. **Removed JSX block** (was lines 51–53 post-Plan-01):
   ```jsx
   <div className="mt-4">
     <RotatingTagline />
   </div>
   ```

Net: page.tsx shrank by 4 lines (1 import + 3 JSX). The Hero structure now flows directly: `<h1>` → intro `<p>` → `<div className="mt-8 flex items-center gap-6">` (Prometheus / More About Me / Get in Touch).

No placeholder, comment marker, or transitional element left behind.

### Preservation Confirmed (CONTEXT.md D-12)

The following were explicitly **not touched** (owned by other plans / Phase 10):

- `src/components/animations/scroll-reveal.tsx` (D-12 preserved)
- `src/components/providers/lenis-provider.tsx` (D-12 preserved)
- `src/app/template.tsx` (D-12 preserved)
- `WritingsCarousel` import (Plan 04 removes)
- `WorksCarousel` import (Plan 03 removes)
- Event-cards block (Plans 05/06)
- Hero `<h1>`, intro paragraph, and `mt-8` action-link `<div>`

## Verification

Per `08-VALIDATION.md` task `8-02-V`:

- `rg "RotatingTagline|rotating-tagline" -g '!.claude/**' -g '!node_modules/**' -g '!.next/**' -g '!.planning/**' .` → **0 hits** (rg exit 1)
- `ls src/components/home/rotating-tagline.tsx` → "No such file or directory" (exit 1)
- Hero structure intact in `src/app/page.tsx`: `<h1>Monty Singer</h1>` present, intro `<p>` present, `<div className="mt-8 flex items-center gap-6">` present
- `npm run build` → **exits 0** (Next.js 16.2.1 Turbopack, compiled in 2.1s, 40 static pages generated, no deletion-related warnings)
- `git diff --diff-filter=D --name-only HEAD~1 HEAD` → only `src/components/home/rotating-tagline.tsx` (no accidental deletions)

## Deviations from Plan

None — plan executed exactly as written. The identifier-anchored edits in 08-02-PLAN.md correctly accounted for the post-Plan-01 line shift (import was at line 7, JSX block at lines 51–53). Both Edit operations matched without ambiguity.

## Decisions Honored

CONTEXT.md decisions honored as listed in plan frontmatter:

- **D-01** — MOTION-02 is part of the canonical motion-deletion subset
- **D-02** — Deletion is total; the entire `<div className="mt-4">…</div>` wrapper was removed, not just `<RotatingTagline />` (no empty wrapping div left as a slot)
- **D-10** — `npm run build` exit 0 is the per-plan gate (verified green)
- **D-12** — Did not touch ScrollReveal, LenisProvider, or template.tsx
- **D-13** — Component file + import + JSX block all removed in same commit (no dead-code drift between commits)

## Threat Flags

None. Pure deletion, no new attack surface, no new network/file/auth paths. Threat T-08-02 (Tampering — Hero section structural regression) mitigated by `npm run build` exit 0.

## Known Stubs

None. Phase 10 (HOME-V2-05) will introduce the replacement static letter-style intro paragraph in this slot — leaving the slot empty here is the intentional, planned state until then.

## Self-Check: PASSED

- `src/components/home/rotating-tagline.tsx` confirmed absent (deleted, verified via `ls`)
- `src/app/page.tsx` confirmed modified (no `RotatingTagline` or `rotating-tagline` references via rg)
- Commit `31ae6b9` confirmed present in `git log`
- `npm run build` exits 0
- Hero anchors (`<h1>Monty Singer</h1>` and `<div className="mt-8 flex items-center gap-6">`) confirmed present in src/app/page.tsx
