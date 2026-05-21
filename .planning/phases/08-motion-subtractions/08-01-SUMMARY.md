---
phase: "08-motion-subtractions"
plan: "01"
subsystem: "homepage"
tags: ["motion", "subtraction", "deletion", "motion-budget", "editorial"]
dependency_graph:
  requires: []
  provides:
    - "Homepage entry without PhotoCarousel import, JSX, or helper"
    - "Unblocks subsequent MOTION subtraction plans (08-02..08-06)"
  affects:
    - "src/app/page.tsx"
    - "src/components/home/photo-carousel.tsx"
tech_stack:
  added: []
  patterns:
    - "Pure subtraction — no replacement code, no placeholder, no stub"
    - "Helper + orphaned imports removed in same commit as call site (avoids dead-code drift)"
key_files:
  created: []
  modified:
    - "src/app/page.tsx"
  deleted:
    - "src/components/home/photo-carousel.tsx"
decisions:
  - "Deleted helper getCarouselPhotos() in same commit as component (verified zero other callers via rg before deletion)"
  - "Removed orphaned fs + path imports in same commit — both existed only to feed getCarouselPhotos (verified with rg)"
  - "No placeholder, comment marker, or stub left where PhotoCarousel was — Phase 10 HOME-V2-04 will introduce the replacement hero photo on a clean slate"
metrics:
  duration: "2 minutes"
  completed_date: "2026-05-21"
  tasks_completed: 1
  files_changed: 2
requirements_completed:
  - MOTION-01
validation_task: "8-01-V"
---

# Phase 08 Plan 01: Delete PhotoCarousel Summary

**One-liner:** Removed the auto-scrolling photo strip (`PhotoCarousel`), its call site in `src/app/page.tsx`, the `getCarouselPhotos()` filesystem helper, and the now-orphaned `fs`/`path` imports — the first MOTION subtraction toward the v2.0 editorial motion budget.

## Tasks Completed

| Task | Name | Commit | Files |
|------|------|--------|-------|
| 1 | Delete PhotoCarousel component file and homepage call site | ced6df2 | src/app/page.tsx (modified), src/components/home/photo-carousel.tsx (deleted) |

## What Was Removed

### Component File

`src/components/home/photo-carousel.tsx` — Deleted. Was a 36-line `'use client'` component that duplicated the photo array and applied an `animate-scroll-left` CSS animation to a `flex w-max` strip. Violated v2.0 motion budget ("zero auto-scrollers" per editorial-redesign-handoff §"Motion Budget — strict") and CONTEXT.md D-02 ("deletion is total — no transitional placeholder").

### Homepage Call Site

`src/app/page.tsx` reduced from **207 lines to 181 lines**. Removed in a single commit:

1. **Line 1:** `import fs from "fs";` (orphaned after helper removal)
2. **Line 2:** `import path from "path";` (orphaned after helper removal)
3. **Line 7:** `import { PhotoCarousel } from "@/components/home/photo-carousel";`
4. **Lines 19–30:** `function getCarouselPhotos(): string[]` server-side helper (read `/public/MSizzle-website-photos/` via `fs.readdirSync`)
5. **Line 53:** `const carouselPhotos = getCarouselPhotos();`
6. **Lines 59–64:** Conditional `<section>` wrapper with `<PhotoCarousel photos={carouselPhotos} />`

No placeholder, comment marker, or transitional element left behind — the `JsonLd` element now sits directly above the hero `<section>`.

### Preservation Confirmed (CONTEXT.md D-12)

The following were explicitly **not touched** (owned by other plans / Phase 10):

- `src/components/animations/scroll-reveal.tsx` (D-12 preserved)
- `src/components/providers/lenis-provider.tsx` (D-12 preserved)
- `src/app/template.tsx` (D-12 preserved)
- `RotatingTagline` import (Plan 02 removes)
- `WorksCarousel` import (Plan 03 removes)
- `WritingsCarousel` import (Plan 04 removes)
- Event-cards block (Plans 05/06)

## Verification

Per `08-VALIDATION.md` task `8-01-V`:

- `rg "PhotoCarousel|photo-carousel|getCarouselPhotos" -g '!.claude/**' -g '!node_modules/**' -g '!.next/**' -g '!.planning/**' .` → **0 hits** ✓
- `rg "\b(fs|path)\." src/app/page.tsx` → **0 hits** ✓
- First 20 lines of `src/app/page.tsx` contain no `import fs`, `import path`, or `from "@/components/home/photo-carousel"` ✓
- `ls src/components/home/photo-carousel.tsx` → "No such file or directory" ✓
- `npm run build` → **exits 0** ✓ (Next.js 16.2.1 Turbopack, 40 static pages generated, no warnings related to deletion)

## Deviations from Plan

None — plan executed exactly as written. The plan's verified-state interface block correctly described `src/app/page.tsx` lines 1–17, 19–30, 53, and 59–64; all deletions matched without surprise.

## Decisions Honored

CONTEXT.md decisions honored as listed in plan frontmatter:

- **D-01** — MOTION-01 is part of the canonical motion-deletion subset
- **D-02** — Deletion is total; no transitional placeholder for the carousel slot
- **D-09** — Plan ships as standalone commit (no batching with other MOTION subtractions)
- **D-10** — `npm run build` exit 0 is the per-plan gate (verified green)
- **D-12** — Did not touch ScrollReveal, LenisProvider, or template.tsx
- **D-13** — Helper + orphaned imports cleaned in same commit (no dead-code drift)

## Threat Flags

None. Pure deletion, no new attack surface, no new network/file/auth paths.

## Known Stubs

None. Phase 10 (HOME-V2-04) will introduce the replacement hero photo on a clean slate — leaving the slot empty here is the intentional, planned state until then.

## Self-Check: PASSED

- `src/components/home/photo-carousel.tsx` confirmed absent (deleted)
- `src/app/page.tsx` confirmed modified (181 lines, no PhotoCarousel/fs/path/getCarouselPhotos references)
- Commit `ced6df2` confirmed present in `git log`
- `npm run build` exits 0
