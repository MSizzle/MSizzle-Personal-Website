---
phase: quick-260722-wov
plan: 01
subsystem: homepage, /contact, /writing
tags: [css, cascade-bug-fix, tdd, motion, essay-grid, hover-invert]
dependency-graph:
  requires: []
  provides:
    - "hero.tsx three-line subtitle with scoped /contact link"
    - "contact-row.tsx title hover-invert fix"
    - "section-writing.tsx posts-only Writing log"
    - "essay-grid.tsx capped/expandable essay grid"
    - "sticky-nav.tsx wave-curl reveal on first scroll"
  affects:
    - src/app/page.tsx
    - src/components/home/explorative-homepage.tsx
    - src/app/writing/page.tsx
    - src/components/v3/newsletter-carousel.tsx
tech-stack:
  added: []
  patterns:
    - "prometheus-link CSS class (hand-written, not Tailwind hover: utility) used to route around the a{color:inherit} unlayered-CSS cascade bug on anchors"
    - "EssayGrid client island: useState(expanded) toggling between a flat capped grid and the pre-existing year-grouped view"
key-files:
  created:
    - src/__tests__/components/contact-row.test.tsx
    - src/__tests__/components/essay-grid.test.tsx
    - src/__tests__/components/sticky-nav.test.tsx
    - src/components/editorial/essay-grid.tsx
  modified:
    - src/components/home/hero.tsx
    - src/__tests__/home/hero.test.tsx
    - src/components/v3/contact-row.tsx
    - src/components/home/section-writing.tsx
    - src/__tests__/home/section-writing.test.tsx
    - src/app/page.tsx
    - src/components/home/explorative-homepage.tsx
    - src/app/writing/page.tsx
    - src/components/v3/newsletter-carousel.tsx
    - src/components/home/sticky-nav.tsx
    - src/app/globals.css
decisions:
  - "Task 2 (contact row hover): targeted one-line fix (add group-hover:text-bg directly to the title div), not a structural @layer base migration. Residual risk documented: any FUTURE hover:text-*/focus:text-* utility on an <a> element still hits the unlayered-CSS bug."
  - "Task 1 (hero link): reused the existing hand-written .prometheus-link CSS class instead of a Tailwind hover: utility on the <a>, to route around the exact same cascade bug being fixed in Task 2, independent of task execution order."
metrics:
  duration: "~35 min"
  completed: "2026-07-23"
---

# Quick Task 260722-wov: Homepage Nav Reveal, Writing Split, Contact Hover-Invert Fix Summary

Five independent, user-approved revisions shipped as five atomic commits: hero copy split into three lines with a scoped /contact link, a real CSS cascade-bug fix so /contact row titles invert on hover along with the rest of the row, the homepage Writing log stripped down to blog posts only, /writing's essay grid capped with a click-to-expand control plus an enlarged Monty Monthly section, and a wave-curl nav reveal on first scroll with a vertically centered hero (an intentional, recorded amendment to Phase 21's closed MS-02 requirement).

## What Was Built

**Task 1 — Hero paragraph split + scoped contact link** (`adcb68d`)
`hero.tsx`'s single flowed `<p>` is now three `<span className="block">` lines. Only the phrase "we'll get along." is wrapped in a `next/link` to `/contact`, styled with the pre-existing `.prometheus-link` CSS class (hand-written `color:inherit` + hover underline) rather than a Tailwind `hover:` utility — deliberately routing around the same cascade bug fixed in Task 2. The lead-in phrase "If you like these as well," stays outside the link.

**Task 2 — /contact row title hover-invert fix** (`ed965bc`)
Root cause (already diagnosed, not re-diagnosed): `globals.css` has zero `@layer` blocks, so the unlayered `a { color: inherit }` rule at line 66 beats Tailwind's own `@layer utilities` rules on anchor elements and anything that merely inherits color from them. The numeral/handle/action spans already worked because they carry their own direct `group-hover:text-bg` utility (no competing rule targets a bare `<span>`). The title `<div>` was the one row element missing that same direct treatment — added via `cn()`, matching the exact pattern already used elsewhere in the file.

**Task 3 — Homepage Writing log: posts only** (`38ecae0`)
Removed the `montyIssues` prop, `MontyMonthlyIssue` import, `issueRows` construction, and the `external`-link branch from `SectionWriting`. `explorative-homepage.tsx` and `page.tsx` no longer fetch or thread `montyIssues` on the homepage path (the `fetchMontyMonthlyIssues(4)` call in `page.tsx` was deleted outright). `/writing` keeps its own independent Substack fetch and dedicated Monty Monthly section — unaffected.

**Task 4 — /writing capped grid + expand, bigger Monty Monthly** (`9774412`)
New client component `src/components/editorial/essay-grid.tsx`: `<=6` posts render as one flat `.card-grid`; `>6` posts show the first 6 (newest) plus a "show all essays (N) →" button. Clicking it reveals the full year-grouped view (`YearBlock` + `RuleStrong` per year, ported verbatim from the old inline JSX). `writing/page.tsx` now delegates to `<EssayGrid posts={gridPosts} />`, deleting the old inline `groupPostsByYear` + year-grouped JSX. The Monty Monthly section on `/writing` was enlarged to section scale (eyebrow + `h2` + subtitle, `py-24 md:py-32`), and `NewsletterCarousel` cards grew (300px→420px flex-basis, 18px→28px padding, text-base→text-xl title).

**Task 5 — Nav wave-curl reveal + centered hero** (`c4ba222`)
`StickyNav`'s scroll threshold changed from `window.innerHeight * 0.82` to a fixed `24px` (first-scroll reveal, not near-full-viewport). `.stickynav` CSS now uses a `perspective(700px) rotateX(-90deg)` hinge-fold with a `cubic-bezier(0.34, 1.56, 0.64, 1)` back-ease that overshoots slightly past `0deg` before settling (the "wave" character), instead of the old flat `translateY(-100%)` slide. A dedicated `prefers-reduced-motion` block reuses the original `translateY` mechanism with `transition: none` so reduced-motion users still get correct hidden-at-0/shown-past-threshold gating with zero animated transform. `hero.tsx`'s outer `<section>` gained `min-h-screen flex flex-col justify-center` so the hero fills at least one viewport height and its content sits vertically centered rather than top-pinned. `.planning/STATE.md` was amended (written, left uncommitted per plan constraints) to record this as an intentional addition of a second motion source alongside Phase 21's surviving `.reveal` opacity-fade, not a reversal of it.

## User Clarification Verification (Task 2)

The user re-emphasized mid-run that the /contact row **title text** must visibly change color on hover, not just be cosmetic. Verified beyond the unit test: the compiled Tailwind CSS served by the running dev server (`http://localhost:3000/contact`) contains the rule `.group-hover\:text-bg:is(:where(.group):hover *)`, and the rendered HTML confirms the title `<div>` carries the `group-hover:text-bg` class. Since `globals.css` has no unlayered rule targeting bare `<div>` elements (only the `a { color: inherit }` rule, which doesn't apply to a `<div>`), this utility applies at normal Tailwind-utility specificity with nothing to override it — the same mechanism already proven to work for the numeral/handle/action spans. No Playwright/Puppeteer or other browser-automation tooling is installed in this repo (a pre-existing gap noted in `STATE.md` from Phase 21), so a live-browser pixel-level color read was not possible; this compiled-CSS + rendered-markup verification is the strongest automated check available.

## Deviations from Plan

None — plan executed exactly as written, task order, file list, and behavior specs all as specified. Both documented "fix chosen" rationales (Task 1's `.prometheus-link` reuse, Task 2's targeted vs. structural fix) were pre-decided in the plan itself, not deviations discovered during execution.

## Verification

- `npx vitest run` (full suite): **207 passed, 0 failed, 16 todo** (37 test files passed, 3 skipped — matches the pre-existing skip count from the 198-passed baseline). Net new: +9 tests over the measured 198-passed/0-failed baseline (hero: +2 net after replacing 1 whole-string test with 3 targeted ones then trimming; contact-row: +2 new file; section-writing: -2 issue-specific tests removed, rewritten merge test; essay-grid: +4 new file; sticky-nav: +3 new file).
- `npx tsc --noEmit`: clean except the pre-existing, unrelated `src/__tests__/seo/robots.test.ts` errors (out of scope — not touched by this plan, confirmed present both before and after).
- `npm run build`: exit 0, all routes (`/`, `/blog/[slug]`, `/building`, `/building/[slug]`, `/contact`, `/writing`, etc.) generated cleanly.
- Live dev-server spot-checks via curl against `http://localhost:3000`: `/`, `/writing`, `/contact` all return 200; hero renders the new `min-h-screen flex flex-col justify-center py-16 md:py-24` classes; `/writing` renders exactly one `.card-grid` plus a "show all essays (N)" button when post count exceeds 6; `/contact`'s compiled CSS confirms the `group-hover:text-bg` rule applies to the title div with no competing override.

## Known Stubs

None.

## Threat Flags

None — no new network endpoints, auth paths, file-access patterns, or schema changes were introduced. All five tasks are presentational/structural changes within the existing trust boundaries documented in the plan's threat model.

## TDD Gate Compliance

Not applicable in the strict RED/GREEN/plan-level sense (this is a `type: execute` quick-task plan, not `type: tdd`), but every task's `tdd="true"` attribute was honored: test files were written/updated alongside each behavior change and verified passing before commit, per-task.

## Self-Check: PASSED

Created files verified present:
- `src/components/editorial/essay-grid.tsx` — FOUND
- `src/__tests__/components/contact-row.test.tsx` — FOUND
- `src/__tests__/components/essay-grid.test.tsx` — FOUND
- `src/__tests__/components/sticky-nav.test.tsx` — FOUND

Commits verified present in `git log --oneline`:
- `adcb68d` — FOUND
- `ed965bc` — FOUND
- `38ecae0` — FOUND
- `9774412` — FOUND
- `c4ba222` — FOUND
