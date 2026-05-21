---
phase: "08-motion-subtractions"
plan: "04"
subsystem: "homepage"
tags: ["motion", "subtraction", "deletion", "motion-budget", "editorial", "writings", "css-cleanup"]
dependency_graph:
  requires:
    - "08-03 (WorksCarousel deletion — same file: src/app/page.tsx; established Post-style fallback pattern)"
  provides:
    - "Homepage Writings section without WritingsCarousel — minimal `<ul>` Link list fallback"
    - "`src/app/globals.css` carousel-free — no `@keyframes scroll-left` or `animate-scroll-*` rules survive"
    - "Phase 9 (Design Tokens & Editorial Primitives) can introduce the warm-paper palette on a clean slate"
    - "Unblocks Phase 10 HOME-V2-06 (editorial `ListRow` primitive replaces the minimal fallback)"
  affects:
    - "src/app/page.tsx"
    - "src/components/home/writings-carousel.tsx"
    - "src/app/globals.css"
tech_stack:
  added: []
  patterns:
    - "Minimal-list fallback (deletion + minimal replacement) — same pattern as Plan-03 (Works) for visual symmetry across the two adjacent sections"
    - "BlogPost type field reuse — `id` / `slug` / `title` confirmed against `src/lib/notion.ts` (parity with Project type from Plan-03)"
    - "Bounded CSS deletion using `.prose code` (above) and `.section-inverted` (below) as identifier anchors — resilient to line-number drift"
key_files:
  created: []
  modified:
    - "src/app/page.tsx"
    - "src/app/globals.css"
  deleted:
    - "src/components/home/writings-carousel.tsx"
decisions:
  - "Used BlogPost type fields `id`, `slug`, `title` (confirmed against src/lib/notion.ts:39-50; parity with Project type from Plan-03 — both have those three fields with identical shapes)"
  - "Replacement Link uses `text-xs uppercase tracking-widest underline transition-opacity hover:opacity-60` — matches Plan-03 (Works) fallback exactly for cross-section visual consistency"
  - "Kept `<Link href=\"/blog\">Writings &#8600;</Link>` section header verbatim (untouched)"
  - "Kept the `posts.length === 0` → `<p>More posts coming soon.</p>` branch (D-02 + CONTEXT.md fallback copy)"
  - "Bounded the CSS deletion at the `.prose code` rule (above) and `.section-inverted` rule (below) — both preserved exactly; deletion removed 30 lines from globals.css (lines 88-116 + the trailing blank)"
  - "Combined component deletion + CSS purge in a single commit per CONTEXT.md D-13 (no dead-code drift between commits — once the last consumer (`writings-carousel.tsx`) is gone, the orphan CSS must also be gone in the same atomic unit)"
metrics:
  duration: "<2 minutes"
  completed_date: "2026-05-21"
  tasks_completed: 1
  files_changed: 3
requirements_completed:
  - MOTION-04
validation_task: "8-04-V"
---

# Phase 08 Plan 04: Delete WritingsCarousel + Purge Orphan scroll-left CSS Summary

**One-liner:** Removed the hover-triggered Writings carousel and purged the now-orphaned CSS animation rules — deleted `src/components/home/writings-carousel.tsx`, its import and JSX block in `src/app/page.tsx`, AND the `@keyframes scroll-left` + `.animate-scroll-left` + `.animate-scroll-hover` + scoped `prefers-reduced-motion` rules from `src/app/globals.css` (lines 88–116). Replaced the JSX with a minimal `<ul>` rendering the first 3 posts as plain Next/Link rows. Closes the v1.0 carousel-stack era — no carousel animation rule survives in the codebase.

## Tasks Completed

| Task | Name | Commit | Files |
|------|------|--------|-------|
| 1 | Delete WritingsCarousel + replace homepage call site + purge orphan CSS keyframes | 7486a68 | src/app/page.tsx (modified), src/app/globals.css (modified), src/components/home/writings-carousel.tsx (deleted) |

## What Was Removed

### Component File

`src/components/home/writings-carousel.tsx` — Deleted. Was a 57-line `'use client'` component that doubled the posts array for seamless infinite-loop appearance, wrapped them in a `flex w-max animate-scroll-hover gap-5` strip inside a `group relative overflow-hidden` container, and used `:group hover` to switch the CSS animation between `paused` and `running` states. Violated the v2.0 motion budget ("zero auto-scrollers" + "no hover-triggered loops" per editorial-redesign-handoff §"Motion Budget — strict") and CONTEXT.md D-02. Last consumer of `.animate-scroll-hover` in the codebase.

### Homepage Call Site

`src/app/page.tsx` modifications:

1. **Removed import line:** `import { WritingsCarousel } from "@/components/home/writings-carousel";` (was line 5 post-Plan-03).
2. **Replaced JSX block** in the Writings section:
   - Old:
     ```jsx
     {posts.length > 0 ? (
       <div className="mt-6">
         <WritingsCarousel posts={posts} />
       </div>
     ) : (
       <p className="mt-4 opacity-75">More posts coming soon.</p>
     )}
     ```
   - New:
     ```jsx
     {posts.length > 0 ? (
       <ul className="mt-6 space-y-3">
         {posts.slice(0, 3).map((post) => (
           <li key={post.id}>
             <Link
               href={`/blog/${post.slug}`}
               className="text-xs uppercase tracking-widest underline transition-opacity hover:opacity-60"
             >
               {post.title}
             </Link>
           </li>
         ))}
       </ul>
     ) : (
       <p className="mt-4 opacity-75">More posts coming soon.</p>
     )}
     ```
3. **Preserved**: `<Link href="/blog" ...>Writings &#8600;</Link>` section header (unchanged), and the `posts.length === 0` → `<p className="mt-4 opacity-75">More posts coming soon.</p>` fallback branch (unchanged).

Net: page.tsx grew by ~9 lines (1 import removed, JSX swapped 3 lines for 12 lines). The section now renders a stacked, semantically `<ul>`-wrapped list (or "More posts coming soon." if empty). Markup is visually symmetric with the Works section directly below it (Plan-03 used the identical pattern), establishing a consistent minimal-list rhythm for the two Phase-8→Phase-10 bridge sections.

### CSS Cleanup (D-08 + RESEARCH.md F3)

`src/app/globals.css` lines 88–116 removed (29 lines + trailing blank). Specifically:

- `@keyframes scroll-left { from { transform: translateX(0); } to { transform: translateX(-50%); } }`
- `.animate-scroll-left { animation: scroll-left 40s linear infinite; }`
- `/* Hover-activated scroll — stationary until the outer .group is hovered */`
- `.animate-scroll-hover { animation: scroll-left 80s linear infinite; animation-play-state: paused; }`
- `.group:hover .animate-scroll-hover { animation-play-state: running; }`
- `@media (prefers-reduced-motion: reduce) { .animate-scroll-left, .animate-scroll-hover { animation: none; } }`

Per RESEARCH.md F3 + Pitfall 5: the three consumers of these rules were `photo-carousel.tsx` (deleted Plan-01), `works-carousel.tsx` (deleted Plan-03), and `writings-carousel.tsx` (deleted this plan). Once the last consumer disappeared, the rules became provably dead code — yet they continued emitting `animation: scroll-left ... infinite` declarations into every page's CSS bundle. CONTEXT.md D-13 demanded their removal in the same atomic commit as the last consumer's deletion. Done.

**Important Phase 9 handoff note:** After this plan, `src/app/globals.css` contains no carousel animation rules. Phase 9 can introduce the warm-paper palette on a clean slate.

### BlogPost Type Field Names (parity with Project)

`src/lib/notion.ts` exports the `BlogPost` interface with the same three-field shape Plan-03 documented for `Project`:

| Field | Type | Used as |
|-------|------|---------|
| `id` | `string` | React list `key={post.id}` |
| `slug` | `string` | href path: `/blog/${post.slug}` |
| `title` | `string` | Link text |

Plan-03's handoff note explicitly warned against assuming field-name parity across notion modules ("do NOT assume `name`/`title` parity"). Verified directly — both modules happen to use `id`/`slug`/`title`. If a future plan reuses this pattern for events, sponsors, or any other Notion-sourced collection, **re-read its TypeScript interface first** — parity is not guaranteed by convention.

### Preservation Confirmed (CONTEXT.md D-12)

The following were explicitly **not touched** (owned by other plans / Phase 10):

- `src/components/animations/scroll-reveal.tsx` (D-12 preserved)
- `src/components/providers/lenis-provider.tsx` (D-12 preserved)
- `src/app/template.tsx` (D-12 preserved)
- `src/app/page.tsx` Hero section (`<h1>`, intro paragraph, action-link `<div>`)
- `src/app/page.tsx` Works section (Plan-03 already shipped its minimal fallback)
- `src/app/page.tsx` Events section (Plans 05/06 owned)
- `src/app/globals.css` `:root`, `.dark`, body, link, `.prose`, `.prose h2`, `.prose h3`, `.prose code`, `@theme inline`, and `.section-inverted` (+`.dark .section-inverted`) blocks all preserved exactly

## Verification

Per `08-VALIDATION.md` task `8-04-V`:

- `rg "WritingsCarousel|writings-carousel|@keyframes scroll-left|animate-scroll-left|animate-scroll-hover" -g '!.claude/**' -g '!node_modules/**' -g '!.next/**' -g '!.planning/**' .` → **0 hits** (rg exit 1) ✓
- `rg "scroll-left|animate-scroll-" src/` → **0 hits** (entire src/ tree free of carousel CSS references) ✓
- `ls src/components/home/writings-carousel.tsx` → "No such file or directory" ✓
- `rg 'Writings &#8600;' src/app/page.tsx` → **1 hit** (section header preserved) ✓
- `rg '\.section-inverted' src/app/globals.css` → **2 hits** (`.section-inverted` + `.dark .section-inverted` — deletion bounded correctly) ✓
- `rg '@import "tailwindcss"' src/app/globals.css` → **1 hit** (base stylesheet structure intact) ✓
- `npm run build` → **exits 0** (Next.js 16.2.1 Turbopack, compiled in 1.7s, 40 static pages generated, no deletion-related warnings) ✓
- `git diff --diff-filter=D --name-only HEAD~1 HEAD` → only `src/components/home/writings-carousel.tsx` (no accidental deletions) ✓

## Deviations from Plan

None. Plan-04 executed exactly as written, in a single commit per CONTEXT.md D-13. The BlogPost field names matched the plan's example replacement pattern verbatim (`id`/`slug`/`title`), so no Plan-03-style field-name correction was needed — but the field names were nonetheless re-verified against `src/lib/notion.ts:39-50` before writing the replacement (per Plan-03's explicit handoff note).

## Decisions Honored

CONTEXT.md decisions honored as listed in plan frontmatter:

- **D-01** — MOTION-04 is part of the canonical motion-deletion subset
- **D-02** — Deletion is total + minimal replacement; the empty-state copy branch is the intentional v2.0 minimum until Phase 10 HOME-V2-06
- **D-08** — Orphan CSS keyframe + utility classes deleted in the same commit as the last consumer (no dead-code lingering)
- **D-09** — Plan ships as standalone commit (no batching with other MOTION subtractions)
- **D-10** — `npm run build` exit 0 is the per-plan gate (verified green)
- **D-12** — Did not touch ScrollReveal, LenisProvider, or template.tsx
- **D-13** — Component file + import + JSX block + CSS purge all removed in same commit (no dead-code drift between commits — this is the strictest application of D-13 in Phase 8 since the CSS purge had been provably dead since Plan-03 but lived a 1-plan grace period for atomic-with-last-consumer pairing)

## Threat Flags

None. Pure deletion + minimal-fallback replacement. Threat T-08-04 (Tampering — `<Link href={...post.slug}>` interpolation + CSS rule removal) accepted per plan — the new `<Link href={\`/blog/${post.slug}\`}>` matches the exact href shape the deleted WritingsCarousel already used; CSS deletion is pure subtraction (one fewer animation rule loaded into the bundle, strictly reducing surface). v1.0 Phase 6 D-14 scan already covered the slug-interpolation code path.

## Known Stubs

None. The first-3-posts `<ul>` is the intended v2.0 minimum-state for this slot until Phase 10 HOME-V2-06 introduces the editorial `ListRow` primitive. The empty-state copy ("More posts coming soon.") is intentional fallback copy, not a stub. The plan explicitly scopes the fallback as the Phase-8→Phase-10 bridge state.

## Phase 9 Handoff Note

**After this plan, `src/app/globals.css` contains no carousel animation rules. Phase 9 can introduce the warm-paper palette on a clean slate.**

Specifically, the globals.css file now contains only:
- `@import "tailwindcss";`
- `@theme inline { ... }` (font + color tokens)
- `:root { ... }` and `.dark { ... }` (current monochrome palette)
- `html`, `body`, `a` base styles
- `.prose` / `.prose h2` / `.prose h3` / `.prose code` editorial typography overrides
- `.section-inverted` / `.dark .section-inverted` inverted color band

Phase 9 will replace the monochrome `:root` + `.dark` variables with the warm-paper palette tokens, and may rewrite `.section-inverted` to reference them. No carousel motion code stands in the way of that work — the entire CSS file is editorial-typography + color-tokens only.

## Phase 8 Wave 1 Closure

Plan 04 is the LAST plan in Phase 8 Wave 1 to touch `src/app/page.tsx`. After this commit, the homepage Writings + Works sections both render minimal `<ul>` Link-row fallbacks (identical visual treatment, ready for Phase 10's editorial `ListRow` upgrade). The Events section remains untouched — that's Plans 05 / 06 territory.

v1.0 carousel-stack inventory at close of Plan-04:
- `src/components/home/photo-carousel.tsx` — DELETED (Plan-01)
- `src/components/home/works-carousel.tsx` — DELETED (Plan-03)
- `src/components/home/writings-carousel.tsx` — DELETED (Plan-04)
- `src/app/globals.css` `@keyframes scroll-left` + utilities — DELETED (Plan-04)

Zero v1.0 carousel artifacts survive in the codebase.

## Self-Check: PASSED

- `src/components/home/writings-carousel.tsx` confirmed absent (deleted, verified via `ls`) ✓
- `src/app/page.tsx` confirmed modified (no `WritingsCarousel` or `writings-carousel` references via rg) ✓
- `src/app/globals.css` confirmed modified (no `scroll-left` / `animate-scroll-` references via rg) ✓
- Commit `7486a68` confirmed present in `git log` ✓
- `npm run build` exits 0 (verified twice — pipe-capture and standalone) ✓
- Section header `Writings &#8600;` confirmed present in `src/app/page.tsx` ✓
- `.section-inverted` + `.dark .section-inverted` confirmed present in `src/app/globals.css` (deletion bounded correctly) ✓
- `@import "tailwindcss"` confirmed present at top of `src/app/globals.css` (base structure intact) ✓
- Replacement `<ul>` markup uses BlogPost type fields verified against `src/lib/notion.ts:39-50` (`id`, `slug`, `title`) ✓
- `git diff --diff-filter=D --name-only HEAD~1 HEAD` returned only the one intended file (no accidental deletions) ✓
