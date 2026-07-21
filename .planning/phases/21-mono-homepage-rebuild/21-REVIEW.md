---
phase: 21-mono-homepage-rebuild
reviewed: 2026-07-21T08:27:13Z
depth: standard
files_reviewed: 16
files_reviewed_list:
  - src/app/globals.css
  - src/app/page.tsx
  - src/components/home/explorative-homepage.tsx
  - src/components/home/hero.tsx
  - src/components/home/photo-marquee.tsx
  - src/components/home/photo.tsx
  - src/components/home/scroll-reveals.tsx
  - src/components/home/section-building.tsx
  - src/components/home/section-loves.tsx
  - src/components/home/section-writing.tsx
  - src/__tests__/home/explorative-homepage.test.tsx
  - src/__tests__/home/hero.test.tsx
  - src/__tests__/home/motion-audit.test.tsx
  - src/__tests__/home/section-building.test.tsx
  - src/__tests__/home/section-loves.test.tsx
  - src/__tests__/home/section-writing.test.tsx
findings:
  critical: 1
  warning: 2
  info: 4
  total: 7
status: issues_found
---

# Phase 21: Code Review Report

**Reviewed:** 2026-07-21T08:27:13Z
**Depth:** standard
**Files Reviewed:** 16
**Status:** issues_found

## Summary

Phase 21 tears down the photo-forward/dark-band homepage and replaces it with a type-only hero,
a Swiss numbered index (Building), a terminal-style Writing log, and a static (non-animated)
Things I Love marquee fallback. The component-level rewrite is clean: React text children are
used everywhere for Notion-sourced strings (no `dangerouslySetInnerHTML`), external links
consistently carry `rel="noopener noreferrer"`, internal navigation ids (`#building`, `#writing`,
`#loves`) are still produced by exactly one element each and match the footer's `/#loves` link
and `StickyNav`'s route links, and the `.a-row`/`.e-post` full-row hover/focus-invert CSS
mechanism is internally consistent (relies on `color` inheritance for `.ttl`/title spans, which is
correct, not missing).

I ran the actual test suite and `tsc --noEmit` rather than trusting the plan summaries, and found
one real, reproducible defect the summaries don't mention: **a stale `@ts-expect-error` directive
in `motion-audit.test.tsx` fails TypeScript's own compiler** (`TS2578: Unused '@ts-expect-error'
directive`), which will fail `next build`'s type-check step (test files are included by
`tsconfig.json`'s `include` glob) and any `tsc --noEmit` CI gate. I verified removing the comment
clears the error, then restored the file (review is read-only).

All 40 tests in `src/__tests__/home/` pass. The one failing test in the full suite
(`src/__tests__/pages/projects.test.tsx:188`) is the pre-existing, unrelated failure called out in
the task context — confirmed not touched by this phase's diff.

## Critical Issues

### CR-01: Stale `@ts-expect-error` directive fails the TypeScript compiler

**File:** `src/__tests__/home/motion-audit.test.tsx:37`
**Issue:** Line 37 carries `// @ts-expect-error -- minimal test-only stub, not a full IO implementation` directly above `window.IntersectionObserver = window.IntersectionObserver || class { ... }`. That assignment does not actually produce a type error under this project's `tsconfig.json` (`lib: ["dom", ...]`, `strict: true`), so TypeScript flags the suppression comment itself as `TS2578: Unused '@ts-expect-error' directive`.

Reproduced directly:
```
$ npx tsc --noEmit
src/__tests__/home/motion-audit.test.tsx(37,5): error TS2578: Unused '@ts-expect-error' directive.
```
Because `tsconfig.json`'s `include` glob (`**/*.ts`, `**/*.tsx`) covers test files and there is no `next.config.*` `typescript.ignoreBuildErrors` escape hatch, this fails `next build`'s type-check phase, not just a standalone `tsc` run — it will break CI/production builds, not merely emit a lint warning. This is new in this phase (the file is new, added in Plan 21-05) — confirmed via `git diff 790e50d^..HEAD -- src/__tests__/home/motion-audit.test.tsx`.
**Fix:** Delete the now-unnecessary directive comment (verified this alone clears the error):
```diff
-    // @ts-expect-error -- minimal test-only stub, not a full IO implementation
     window.IntersectionObserver =
       window.IntersectionObserver ||
       class {
         observe() {}
         unobserve() {}
         disconnect() {}
       };
```

## Warnings

### WR-01: `page.tsx` swallows all four Notion/RSS fetch failures with zero observability

**File:** `src/app/page.tsx:29-42`
**Issue:** All four data fetches (`getFeaturedProjects`, `fetchMontyMonthlyIssues`, `getLovesData`, `getPublishedPosts`) are wrapped in `try { ... } catch {}` with fully empty catch blocks — no `console.error`, no error reporting, nothing. If any of these silently starts failing in production (bad Notion token, DB schema drift, RSS feed down), the homepage will render an empty section forever with zero signal that anything is wrong; the failure mode is indistinguishable from "there's just no content yet." This matches the pre-existing site-wide convention (`building/page.tsx`, `writing/page.tsx` do the same), so it isn't a regression introduced by this phase, but it is a real robustness gap being replicated into a fourth call site here (`getPublishedPosts`).
**Fix:** At minimum, log the error so it surfaces in Vercel function logs:
```ts
try {
  posts = await getPublishedPosts();
} catch (err) {
  console.error("[home] getPublishedPosts failed:", err);
}
```

### WR-02: Stale doc comments reference CSS classes retired earlier in this same phase

**File:** `src/components/home/explorative-homepage.tsx:24`
**Issue:** The orchestrator's top-of-file doc comment still reads `ScrollReveals: headless IO island toggling .in on .reveal/.slide/.shadowed.` — but Plan 21-06 (within this same phase) retired `.slide` and `.shadowed` entirely, and `scroll-reveals.tsx`'s own doc comment was correctly updated to say so (`` `.slide` and `.shadowed` were retired in Plan 21-06 ``). The orchestrator's comment was never updated to match, so a future reader following this comment will look for `.slide`/`.shadowed` consumers that no longer exist.
**Fix:**
```diff
- *   ScrollReveals: headless IO island toggling .in on .reveal/.slide/.shadowed.
+ *   ScrollReveals: headless IO island toggling .in on .reveal.
```

## Info

### IN-01: `.a-sec` references an undefined CSS custom property

**File:** `src/app/globals.css:641`
**Issue:** `.a-sec { padding: var(--space-32, 128px) 0 0; }` references `--space-32`, which is never declared anywhere in `globals.css` (no `@theme` token, no `:root` declaration — confirmed via `grep -n "space-32\|--space-"`). The `128px` fallback always applies, so behavior is correct, but the variable reference is dead weight that reads as if a token exists when it doesn't.
**Fix:** Either declare `--space-32: 128px;` alongside the other design tokens in `:root`, or simplify to a plain `padding: 128px 0 0;` since the fallback is the only value ever used.

### IN-02: `.reveal`'s stagger hook (`--d`) is never set by any component

**File:** `src/app/globals.css:819`
**Issue:** `.reveal { transition-delay: var(--d, 0s); }` implies a per-element stagger mechanism, but no component in the reviewed set (`hero.tsx`, `section-building.tsx`, `section-writing.tsx`, `photo-marquee.tsx`) ever sets a `--d` inline style, so every `.reveal` element always fades in simultaneously at `0s` delay. This predates Phase 21 and isn't a regression, but since this phase touched `.reveal`'s timing directly (Plan 21-06 "retune .reveal motion"), it was a natural point to either wire staggering or drop the unused hook.
**Fix:** Either wire `style={{ "--d": `${i * 0.05}s` }}` on row maps in `section-building.tsx`/`section-writing.tsx` for a staggered reveal, or drop `var(--d, 0s)` down to a flat `0s` if staggering isn't wanted.

### IN-03: Dead CSS reference to a deleted keyframe (`.avail .dot` → `@keyframes pulse`)

**File:** `src/app/globals.css:598`
**Issue:** `.avail .dot { animation: pulse 2s ease-in-out infinite; }` references `@keyframes pulse`, which this phase's Plan 21-01 deleted outright (it existed only for the now-removed `.statustag .dot`). `.avail` itself has no consumer anywhere in `src/` (confirmed via `grep -rln "\bavail\b" src --include="*.tsx"` returning nothing), so there's no visible regression today, but the animation reference is now permanently broken (unknown animation name, silently no-ops) should `.avail` ever be revived.
**Fix:** Either delete the now-fully-dead `.avail`/`.avail .dot` block, or re-add a minimal `@keyframes pulse` if `.avail` is intended to be used again.

### IN-04: Notion-derived "year" status can render the literal string `"NaN"`

**File:** `src/components/home/section-building.tsx:39-40`
**Issue:** `status: project.tags?.[0] || String(new Date(project.lastEdited).getUTCFullYear())` has no validation on `project.lastEdited`. If a Notion page ever has a missing/malformed `last_edited_time` (schema drift, API change), `new Date(...).getUTCFullYear()` returns `NaN`, and the row silently displays the literal text `"NaN"` in the status column instead of falling back to something safer. Low likelihood in practice (Notion's API reliably supplies `last_edited_time`), but there's no guard.
**Fix:**
```ts
const year = new Date(project.lastEdited).getUTCFullYear();
status: project.tags?.[0] || (Number.isNaN(year) ? "" : String(year)),
```

---

_Reviewed: 2026-07-21T08:27:13Z_
_Reviewer: Claude (gsd-code-reviewer)_
_Depth: standard_
