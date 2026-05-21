---
phase: "08-motion-subtractions"
plan: "03"
subsystem: "homepage"
tags: ["motion", "subtraction", "deletion", "motion-budget", "editorial", "works"]
dependency_graph:
  requires:
    - "08-02 (RotatingTagline deletion — same file: src/app/page.tsx)"
  provides:
    - "Homepage Works section without WorksCarousel — minimal `<ul>` Link list fallback in place"
    - "Project type field names (`id` / `slug` / `title`) documented for Plan-04 (Writings) reuse"
    - "Unblocks Phase 10 HOME-V2-06 (editorial `ListRow` primitive replaces the minimal fallback)"
  affects:
    - "src/app/page.tsx"
    - "src/components/home/works-carousel.tsx"
tech_stack:
  added: []
  patterns:
    - "Minimal-list fallback (deletion + minimal replacement) — non-empty route between Phase 8 and Phase 10"
    - "Identifier-anchored edits (resilient to line-number drift from Plans 01–02)"
    - "Replacement typography matches existing 'Past' / 'Also Coming Up' subheader pattern: `text-xs uppercase tracking-widest`"
key_files:
  created: []
  modified:
    - "src/app/page.tsx"
  deleted:
    - "src/components/home/works-carousel.tsx"
decisions:
  - "Used Project type fields `id`, `slug`, `title` (NOT `name` — plan text said `name` but notion-projects.ts exports `title`) — documented for Plan-04 (Posts→Writings) which will reuse same pattern"
  - "Replacement Link uses `text-xs uppercase tracking-widest underline` matching the existing 'Past' / 'Also Coming Up' subheader typography in the Events section"
  - "Dropped `referenceCount={posts.length}` prop with WorksCarousel deletion — fallback list never needed it (D-02: deletion is total)"
  - "Kept `<Link href=\"/projects\">Works &#8600;</Link>` section header verbatim (untouched)"
  - "Kept the existing `projects.length === 0` → 'Projects coming soon.' branch (D-02 + CONTEXT.md fallback copy)"
metrics:
  duration: "<1 minute"
  completed_date: "2026-05-21"
  tasks_completed: 1
  files_changed: 2
requirements_completed:
  - MOTION-03
validation_task: "8-03-V"
---

# Phase 08 Plan 03: Delete WorksCarousel Summary

**One-liner:** Removed the hover-triggered infinite-loop Works carousel — deleted `src/components/home/works-carousel.tsx`, its import in `src/app/page.tsx`, and the `<WorksCarousel projects={projects} referenceCount={posts.length} />` JSX block — replaced with a minimal `<ul>` list rendering the first 3 projects as plain Next/Link rows (third MOTION subtraction toward the v2.0 editorial motion budget).

## Tasks Completed

| Task | Name | Commit | Files |
|------|------|--------|-------|
| 1 | Delete WorksCarousel component file and replace homepage call site with minimal fallback list | 1670fc9 | src/app/page.tsx (modified), src/components/home/works-carousel.tsx (deleted) |

## What Was Removed

### Component File

`src/components/home/works-carousel.tsx` — Deleted. Was a 66-line `'use client'` component that doubled the projects array and applied an `animate-scroll-hover` CSS animation to a `flex w-max` strip with dynamic duration based on the writings count. Violated v2.0 motion budget ("zero auto-scrollers" + "no hover-triggered loops" per editorial-redesign-handoff §"Motion Budget — strict") and CONTEXT.md D-02.

### Homepage Call Site

`src/app/page.tsx` modifications:

1. **Removed import line** (was line 6 post-Plan-02): `import { WorksCarousel } from "@/components/home/works-carousel";`
2. **Replaced JSX block** in the Works section (post-Plan-02 lines ~103–109):
   - Old: `<div className="mt-6"><WorksCarousel projects={projects} referenceCount={posts.length} /></div>`
   - New: `<ul className="mt-6 space-y-3">{projects.slice(0, 3).map((project) => (<li key={project.id}><Link href={\`/projects/${project.slug}\`} className="text-xs uppercase tracking-widest underline transition-opacity hover:opacity-60">{project.title}</Link></li>))}</ul>`
3. **Preserved**: `<Link href="/projects" ...>Works &#8600;</Link>` section header (unchanged), and the `projects.length === 0` → `<p className="mt-4 opacity-75">Projects coming soon.</p>` fallback branch (unchanged).
4. **Dropped**: `referenceCount={posts.length}` prop — only the WorksCarousel consumed it; fallback list doesn't need it.

Net: page.tsx grew by ~6 lines (1 import removed, JSX swapped 3 lines for 9 lines). The section now renders a stacked, semantically `<ul>`-wrapped list (or "Projects coming soon." if empty).

### Project Type Field Names (for Plan-04 handoff)

**Important for downstream Plan-04 (Writings carousel removal):** `src/lib/notion-projects.ts` exports the `Project` interface with these fields used by the fallback markup:

| Field | Type | Used as |
|-------|------|---------|
| `id` | `string` | React list `key={project.id}` |
| `slug` | `string` | href path: `/projects/${project.slug}` |
| `title` | `string` | Link text |

**NOTE:** The plan text (08-03-PLAN.md) suggested using `project.name` — that was wrong. The actual exported field is `title`. Plan-04 should similarly inspect `src/lib/notion.ts` (which exports `BlogPost` for `getPublishedPosts()`) to confirm its title and slug fields before writing the Writings fallback — do NOT assume `name`/`title` parity across modules.

### Preservation Confirmed (CONTEXT.md D-12)

The following were explicitly **not touched** (owned by other plans / Phase 10):

- `src/components/animations/scroll-reveal.tsx` (D-12 preserved)
- `src/components/providers/lenis-provider.tsx` (D-12 preserved)
- `src/app/template.tsx` (D-12 preserved)
- `WritingsCarousel` import + call site (Plan 04 removes)
- Event-cards block (Plans 05/06)
- Hero `<h1>`, intro paragraph, and `mt-8` action-link `<div>`
- Section header `<Link href="/projects">Works &#8600;</Link>`
- Empty-state copy: `<p className="mt-4 opacity-75">Projects coming soon.</p>`

## Verification

Per `08-VALIDATION.md` task `8-03-V`:

- `rg "WorksCarousel|works-carousel" -g '!.claude/**' -g '!node_modules/**' -g '!.next/**' -g '!.planning/**' .` → **0 hits** (rg exit 1) ✓
- `ls src/components/home/works-carousel.tsx` → "No such file or directory" ✓
- `rg 'Works &#8600;' src/app/page.tsx` → **1 hit** (section header preserved) ✓
- `npm run build` → **exits 0** (Next.js 16.2.1 Turbopack, compiled in 3.6s, 40 static pages generated, no deletion-related warnings) ✓
- `git diff --diff-filter=D --name-only HEAD~1 HEAD` → only `src/components/home/works-carousel.tsx` (no accidental deletions) ✓

## Deviations from Plan

**1. [Documentation correction — non-blocking]** Plan text used `project.name` in the example replacement JSX. The actual `Project` interface in `src/lib/notion-projects.ts` exports `title` (not `name`). Used the correct field name (`title`) in the replacement. The plan's `<read_first>` instruction anticipated this case — "read `src/lib/notion-projects.ts` once to determine the exact field names" — and applied the substitution as instructed.

No other deviations. Plan-03 executed in a single commit per D-13.

## Decisions Honored

CONTEXT.md decisions honored as listed in plan frontmatter:

- **D-01** — MOTION-03 is part of the canonical motion-deletion subset
- **D-02** — Deletion is total + minimal replacement; no transitional carousel placeholder; the empty-state copy branch is the intentional v2.0 minimum until Phase 10 HOME-V2-06
- **D-09** — Plan ships as standalone commit (no batching with other MOTION subtractions)
- **D-10** — `npm run build` exit 0 is the per-plan gate (verified green)
- **D-12** — Did not touch ScrollReveal, LenisProvider, or template.tsx
- **D-13** — Component file + import + JSX block all removed in same commit (no dead-code drift between commits)

## Threat Flags

None. Pure deletion + minimal-fallback replacement. Threat T-08-03 (Tampering — `<Link href={...project.slug}>` interpolation) accepted per plan — the new `<Link href={\`/projects/${project.slug}\`}>` matches the exact href shape the deleted WorksCarousel already used; no expansion of trust boundary, no new injection point introduced. v1.0 Phase 6 D-14 scan already covered this code path.

## Known Stubs

None. The first-3-projects `<ul>` is the intended v2.0 minimum-state for this slot until Phase 10 HOME-V2-06 introduces the editorial `ListRow` primitive. The empty-state copy ("Projects coming soon.") is intentional fallback copy, not a stub. The plan explicitly scopes the fallback as the Phase-8→Phase-10 bridge state.

## Self-Check: PASSED

- `src/components/home/works-carousel.tsx` confirmed absent (deleted, verified via `ls`) ✓
- `src/app/page.tsx` confirmed modified (no `WorksCarousel` or `works-carousel` references via rg) ✓
- Commit `1670fc9` confirmed present in `git log` ✓
- `npm run build` exits 0 ✓
- Section header `Works &#8600;` confirmed present in src/app/page.tsx ✓
- Replacement `<ul>` markup uses Project type fields verified against `src/lib/notion-projects.ts` (`id`, `slug`, `title`) ✓
