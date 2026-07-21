---
phase: 20-mono-token-foundation
plan: 03
subsystem: ui
tags: [css, tailwind-v4, design-tokens, mono, accent-removal, components]

# Dependency graph
requires:
  - phase: 20-mono-token-foundation
    provides: "20-01's @theme inline mono token block (--color-invert, --color-text-inverse, --color-text-dim, --color-border-strong) and unified :focus-visible ring"
provides:
  - "Zero accent references anywhere in the 9 src/components/v3/ shared component files"
  - "button.tsx's invert prop (renamed from accent) as the canonical mono-fill button API for future call sites"
affects: [20-04, 21, 22, 23]

# Tech tracking
tech-stack:
  added: []
  patterns:
    - "Component-level neutral placeholder fill: bg-[rgba(0,0,0,0.08)] replaces bg-surface wherever bg-surface meant 'dark panel awaiting content' (matches 20-01's globals.css .pb-media fix)"
    - "Component-level subtle hover tint for whole-block hover feedback that isn't a full D-09 Tier 1 invert: bg-[rgba(0,0,0,0.04)] approximates the deleted --color-bg-2 (#f0f1f3) value"

key-files:
  created: []
  modified:
    - src/components/v3/button.tsx
    - src/components/v3/video-card.tsx
    - src/components/v3/newsletter-carousel.tsx
    - src/components/v3/big-list.tsx
    - src/components/v3/marquee.tsx
    - src/components/v3/page-hero.tsx
    - src/components/v3/section-label.tsx
    - src/components/v3/card.tsx
    - src/components/v3/uses-list.tsx

key-decisions:
  - "button.tsx's accent prop renamed to invert with zero call-site breakage (confirmed unused site-wide via grep before renaming, per the plan's explicit threat-model mitigation T-20-04)"
  - "video-card.tsx hover edge repointed to var(--color-text-inverse) rather than --color-bg, per the plan's dark-mode-seam naming convention established in 20-01/20-02"
  - "Two out-of-plan bg-bg-2 sites (newsletter-carousel.tsx:54, card.tsx:129/137) found broken by 20-01's D-06 token deletion; fixed as Rule 1 bugs within the files already being converted rather than deferred"

requirements-completed: [MO-02, MO-03]

# Metrics
duration: ~25min
completed: 2026-07-21
---

# Phase 20 Plan 03: Mono Token Foundation - v3 Shared Component Conversion Summary

**Converted all `accent` references across the nine `src/components/v3/` shared-layer components to the D-09 three-tier mono hover language (block invert / inline ink / display-stroke fill), and fixed two silently-broken `bg-bg-2` sites left dangling by 20-01's token deletion.**

## Performance

- **Duration:** ~25 min
- **Completed:** 2026-07-21T03:16:49Z
- **Tasks:** 3 (all executed as planned, plus 2 in-scope bug fixes)
- **Files modified:** 9 (`src/components/v3/*.tsx`)

## Accomplishments

- **Tier 1 (block surface):** `button.tsx`'s filled variant prop renamed `accent` → `invert` (zero call sites existed, confirmed via `grep -rn "from .*v3/button\|<Button" src/` before renaming); its classes now read `bg-invert border-invert text-text-inverse hover:bg-transparent hover:text-invert`. `video-card.tsx`'s placeholder thumb fill changed from `bg-surface` (now white per D-08, would have silently gone from dark to white) to a neutral `bg-[rgba(0,0,0,0.08)]`, with `group-hover:bg-accent` → `group-hover:bg-invert`, `border-l-accent` → `border-l-invert`, and the hover play-triangle edge → `border-l-[color:var(--color-text-inverse)]`. `newsletter-carousel.tsx`'s placeholder fill got the same `bg-surface` → neutral-fill treatment, with `border-accent` → `border-invert`.
- **Tier 3 (oversized display):** `big-list.tsx`'s outline-stroke hover fill (`hover:text-accent`, `-webkit-text-stroke-color:var(--accent)`, `group-hover:text-accent` on the tag) all converted to `var(--color-invert)` / `text-invert`. `marquee.tsx`'s "hot" variant stroke color converted to `var(--color-invert)`. `page-hero.tsx` had only a doc-comment reference to update; its actual stroke color lives in `.sig-out` in `globals.css`, already converted in 20-01/20-02.
- **Tier 2 (inline text):** `section-label.tsx`, `card.tsx` (kicker), and `uses-list.tsx` (group heading) all converted their static mono label `text-accent` to `text-text-dim`.
- `grep -rn "accent" src/components/v3/*.tsx` returns 0 hits across all nine files.
- `npm run build` passes clean. Full vitest suite: 182 passed, 1 pre-existing failure (`projects.test.tsx:188`, confirmed unrelated per known_context), 16 todo.

## Task Commits

1. **Task 1: Convert Tier 1 (block-surface) components** - `4140b28` (feat)
2. **Task 2: Convert Tier 3 (oversized display) components** - `4ec5163` (feat)
3. **Task 3: Convert Tier 2 (inline text) components** - `4205230` (feat)

_No plan-metadata commit yet — this commit follows below per the sequential-executor protocol._

## Files Created/Modified

- `src/components/v3/button.tsx` - `accent` prop renamed to `invert`; filled-variant classes converted to mono invert tokens; doc comment updated
- `src/components/v3/video-card.tsx` - placeholder fill converted to neutral rgba fill; hover fill/border/edge converted to invert tokens
- `src/components/v3/newsletter-carousel.tsx` - placeholder fill and border converted to invert tokens; `bg-bg-2` fix (see Deviations)
- `src/components/v3/big-list.tsx` - hover text/stroke/tag fill converted to invert tokens; doc comments updated
- `src/components/v3/marquee.tsx` - hot-variant stroke color converted to invert token; doc comment updated
- `src/components/v3/page-hero.tsx` - doc comment updated only, no functional change
- `src/components/v3/section-label.tsx` - static label color converted to text-dim; doc comment updated
- `src/components/v3/card.tsx` - kicker label color converted to text-dim; `bg-bg-2` fix (see Deviations)
- `src/components/v3/uses-list.tsx` - group heading color converted to text-dim

## Decisions Made

- Followed the plan's explicit per-line conversion instructions for all nine files exactly, including the button.tsx prop rename (verified zero call sites before renaming, satisfying the plan's threat-model mitigation T-20-04) and the video-card.tsx dark-mode-seam edge-color fix (`--color-text-inverse` instead of `--color-bg`, matching 20-01/20-02's established naming convention).
- For the two `bg-bg-2` regressions found (see Deviations), chose file-local, minimal, non-redesign fixes rather than escalating to Rule 4: `newsletter-carousel.tsx`'s static card fill simply drops the now-nonfunctional `bg-bg-2` in favor of `bg-bg` (white) since the card's existing `border border-border` already carries the edge, consistent with D-06's explicit guidance ("where a band boundary is still needed, use a border hairline, never a fill"). `card.tsx`'s whole-card *hover* fill needed to keep some interactive feedback (removing it entirely would be a silent behavior regression), so it was given a neutral `rgba(0,0,0,0.04)` tint approximating the deleted `--color-bg-2` (`#f0f1f3`) value, distinct from and lighter than the placeholder-fill convention (`rgba(0,0,0,0.08)`) so it doesn't read as a stronger UI state than intended.

## Deviations from Plan

### Auto-fixed Issues

**1. [Rule 1 - Bug] `newsletter-carousel.tsx:54` and `card.tsx:129/137` referenced `bg-bg-2`, a token deleted in 20-01 (D-06)**

- **Found during:** Task 1 read-first pass on `newsletter-carousel.tsx` (grep for `bg-bg-2`/`bg-2` usage across `src/` before editing)
- **Issue:** 20-01 deleted `--color-bg-2` entirely per D-06 ("Phase 21 success criterion 4 requires one continuous white ground... an alternate band token has no legitimate consumer"). Tailwind v4 utility deletion is a silent no-op, not a build error — `bg-bg-2` and `hover:bg-bg-2` compile fine but emit zero CSS. `newsletter-carousel.tsx`'s static card background and `card.tsx`'s whole-card hover fill were both quietly rendering with no fill at all, an undetected regression from 20-01 that neither 20-01 nor 20-02 (both `globals.css`-only) could have caught, since these are component files in this plan's scope.
- **Fix:** `newsletter-carousel.tsx`: replaced `bg-bg-2` with `bg-bg` (the card's existing `border border-border` already carries the visual edge, matching D-06's stated pattern of relying on hairline borders instead of fills for band boundaries). `card.tsx`: replaced `hover:bg-bg-2` with `hover:bg-[rgba(0,0,0,0.04)]`, a neutral tint approximating the deleted token's original `#f0f1f3` value, preserving the whole-card hover feedback without inventing a new named token (out of scope for a component-conversion plan) or silently dropping the interaction entirely.
- **Files modified:** `src/components/v3/newsletter-carousel.tsx`, `src/components/v3/card.tsx`
- **Verification:** `grep -n "bg-bg-2" src/components/v3/*.tsx` returns 0 hits; `npm run build` passes; `npx vitest run src/__tests__/components/card.test.tsx src/__tests__/pages/writing.test.tsx` (newsletter-carousel's only consumer) both pass with no assertion changes needed.
- **Committed in:** `4140b28` (newsletter-carousel.tsx, Task 1 commit) and `4205230` (card.tsx, Task 3 commit)

---

**Total deviations:** 1 auto-fixed (1 bug — regression inherited from 20-01's token deletion, not a code defect introduced by this plan)
**Impact on plan:** Closes a silent visual regression that would otherwise have shipped unnoticed (no build error, no immediately-obvious test failure) alongside this plan's accent conversion. No scope creep beyond the two files already in this plan's declared `files_modified` list.

## Issues Encountered

None beyond the `bg-bg-2` regression documented above. Both consumer checks (button.tsx's zero call sites; video-card/newsletter-carousel/uses-list/card's existing tests) passed without needing test updates.

## User Setup Required

None - no external service configuration required.

## Next Phase Readiness

- All nine `src/components/v3/` shared-layer files are accent-free; `button.tsx`'s `invert` prop is available for any future call site needing the filled-variant button.
- Phase 20-04 (layout/route files) and the Phase 23 interior-route sweep can now treat `src/components/v3/` as a visual audit rather than a second conversion pass, per this phase's stated purpose.
- `npm run build` and the vitest suite (182 passed, 1 known pre-existing failure at `projects.test.tsx:188`, unrelated) both confirm no regressions from this plan's conversions.

## Self-Check: PASSED

- FOUND: src/components/v3/button.tsx
- FOUND: src/components/v3/video-card.tsx
- FOUND: src/components/v3/newsletter-carousel.tsx
- FOUND: src/components/v3/big-list.tsx
- FOUND: src/components/v3/marquee.tsx
- FOUND: src/components/v3/page-hero.tsx
- FOUND: src/components/v3/section-label.tsx
- FOUND: src/components/v3/card.tsx
- FOUND: src/components/v3/uses-list.tsx
- FOUND: 4140b28 (Task 1 commit)
- FOUND: 4ec5163 (Task 2 commit)
- FOUND: 4205230 (Task 3 commit)

---
*Phase: 20-mono-token-foundation*
*Completed: 2026-07-21*
