---
phase: 20-mono-token-foundation
plan: 02
subsystem: ui
tags: [css, tailwind-v4, design-tokens, mono, accent-removal]

# Dependency graph
requires:
  - phase: 20-mono-token-foundation
    provides: "20-01's @theme inline mono token block (--color-invert, --color-text-inverse, --color-text, --color-border-strong, --color-text-dim) and unified :focus-visible ring"
provides:
  - "Zero var(--accent)/var(--color-accent) references anywhere in src/app/globals.css"
  - "Three-tier D-09 hover language (block invert / inline underline reveal / display-stroke fill) applied to every remaining call site in globals.css"
affects: [20-03, 20-04, 20-05]

# Tech tracking
tech-stack:
  added: []
  patterns:
    - "Static (non-hover) solid decorative fills use var(--color-invert) (permanent black); static borders/underlines/box-shadows use var(--color-text) (auto-inverts inside .band-dark); inline text at rest/hover never changes color, only gains an underline reveal (D-09 Tier 2)"

key-files:
  created: []
  modified:
    - src/app/globals.css

key-decisions:
  - "D-09 Tier 1: .pb-btn:hover reclassified from a plain text-color hover to a full block invert (background/color/border-color all flip), matching the plan's rationale that .pb-btn already has button chrome (border + box-shadow) unlike a bare inline link"
  - "Plan gap fix: .eyebrow (color) and .eyebrow::before (background) used var(--accent) but were not named in either task's explicit line list. Converted per established convention (static fill -> var(--color-invert), plain label text -> var(--color-text)) to satisfy the plan's own zero-accent acceptance criteria (Rule 1)"
  - "Paired var(--color-bg) sites on the four fills this plan newly inverted (.nav-cell hover label, .pb-play triangle notch, .pb-open, .pb-close) repointed to var(--color-text-inverse) per the plan's explicit paired-fix list, so they stay correct if a future phase revalues --color-bg"

requirements-completed: [MO-02, MO-03]

# Metrics
duration: ~20min
completed: 2026-07-21
---

# Phase 20 Plan 02: Mono Token Foundation - Accent Call-Site Conversion Summary

**Converted all ~36 remaining `var(--accent)`/`var(--color-accent)` call sites in `globals.css` to the three-tier D-09 mono hover language (block invert / inline underline reveal / display-stroke fill), closing out MO-03 for the shared stylesheet layer.**

## Performance

- **Duration:** ~20 min
- **Completed:** 2026-07-21T10:06:00Z
- **Tasks:** 2 (both executed as planned, plus one plan-gap fix)
- **Files modified:** 1 (`src/app/globals.css`)

## Accomplishments

- Every Tier 1 block-surface fill (`.marker`/`h1.sig .hw`, `.statustag .dot`, `.hero-band`, `.mm-sub`, `.mm-btn:hover`, `.mm-dots span.on`, `.nav-cell::before`, `.stickynav .cta`, `.avail .dot`, `.pb-play > span`, `.pb-note`, `.pb-btn:hover`/`.pb-btn--go`) now uses `var(--color-invert)`; every accent-colored `box-shadow` now uses `var(--color-text)`.
- Four `color: var(--color-bg)` sites paired with the fills this plan inverted were repointed to `var(--color-text-inverse)` (`.nav-cell` hover label, `.pb-play` triangle notch, `.pb-open`, `.pb-close`) per the plan's explicit dark-mode-seam guidance.
- Every Tier 2 inline-text site retinted to ink tokens with no hover color change (`.prose a`/`blockquote`, `.photo .icon`, `.rail-box .num`, `.mm-issue`/`.mm-read`/`.mm-sub .btn`, `.hero-ticker` tick-link/tick-sep, `.inline`, `.selective b`); `.wayin a:hover` and `.inline:hover` color-change rules deleted since their permanent `border-bottom` already provides the reveal; `.foot-col a:hover` gained a `text-decoration: underline` reveal in place of its former color change.
- The one Tier 3 site (`.sig-out` outline stroke) now uses `var(--color-invert)`.
- Fixed a plan gap: `.eyebrow`/`.eyebrow::before` used `var(--accent)` but weren't in either task's explicit line list — converted to close the loop on the plan's own "zero var(--accent) in globals.css" acceptance criterion.
- `grep -c "var(--accent)\|var(--color-accent)" src/app/globals.css` returns `0`. Combined with 20-01, `globals.css` is fully accent-free.
- `npm run build` passes clean; full vitest suite shows only the one documented pre-existing failure (`projects.test.tsx:188`, unrelated to this work).

## Task Commits

Each task was committed atomically:

1. **Task 1: Convert Tier 1 (block-surface) accent fills and shadows** - `036cf2c` (feat)
2. **Task 2: Convert Tier 2 (inline text) and Tier 3 (oversized display) accent references** - `77df68c` (feat)

_No plan-metadata commit yet — orchestrator handles STATE.md/ROADMAP.md centrally after wave merge, per the phase's established pattern from 20-01._

## Files Created/Modified

- `src/app/globals.css` - All Tier 1/2/3 `var(--accent)`/`var(--color-accent)` call sites converted to mono tokens (D-09); paired `var(--color-bg)` sites repointed to `var(--color-text-inverse)`; `.eyebrow` plan gap closed

## Decisions Made

- Followed the plan's explicit per-line conversion lists for both tasks exactly, including the `.pb-btn:hover` Tier 1 reclassification and the four paired dark-mode-seam token fixes.
- For the `.eyebrow` plan gap, applied the same convention the plan itself established elsewhere: a static (non-hover) solid fill converts to `var(--color-invert)` (matching `.marker`, `.statustag .dot`, `.avail .dot` — all also static, non-hover fills converted this way in Task 1), while a plain label's text color converts to `var(--color-text)` (matching `.selective b`, `.photo .icon` in Task 2). This keeps `.eyebrow` consistent with both established patterns rather than inventing a third convention.
- Left `.pb-btn--stop:hover { color: var(--color-bg); }` and other pre-existing `var(--color-bg)`-paired-with-`var(--color-text)` sites (`.rail-box .lbl`, `.statustag`, `.avail`, `.pb-tag`) untouched — these pair with backgrounds that were already `var(--color-text)` before this plan (not accent-converted), so they're outside the paired-fix scope the plan defined.

## Deviations from Plan

### Auto-fixed Issues

**1. [Rule 1 - Bug] `.eyebrow`/`.eyebrow::before` accent references missing from plan's task lists**

- **Found during:** Task 1 verification (running the Task 1 acceptance-criteria grep after completing all explicitly-listed sites)
- **Issue:** `src/app/globals.css` lines 238 (`.eyebrow { color: var(--accent); }`) and 247 (`.eyebrow::before { background: var(--accent); }`) reference `var(--accent)` but neither task's explicit per-line conversion list (nor PATTERNS.md's Part 3 tier classification, despite Part 1 documenting them at old line numbers 239/248) named them for conversion. Left unfixed, the plan's own stated acceptance criteria ("zero `var(--accent)`/`var(--color-accent)` references remain in globals.css") and verification step would fail.
- **Fix:** Converted `.eyebrow` color to `var(--color-text)` (matches the Tier 2 plain-label-text convention used elsewhere in Task 2, e.g. `.selective b`) and `.eyebrow::before` background to `var(--color-invert)` (matches the Tier 1 static-solid-fill convention used elsewhere in Task 1, e.g. `.marker`, `.statustag .dot`).
- **Files modified:** `src/app/globals.css`
- **Verification:** `grep -c "var(--accent)\|var(--color-accent)" src/app/globals.css` returns `0` after the fix; `npm run build` passes.
- **Committed in:** `036cf2c` (Task 1 commit, since `.eyebrow::before` is a Tier 1 static fill; `.eyebrow`'s Tier 2 color fix landed in the same commit for locality since both selectors sit together in the source)

---

**Total deviations:** 1 auto-fixed (1 bug — plan coverage gap, not a code defect)
**Impact on plan:** Closes the loop on the plan's own stated success criteria. No scope creep — the fix is a like-for-like token substitution using conventions the plan itself established for near-identical sites.

## Issues Encountered

None. Both tasks' acceptance criteria (grep checks for fills/borders/shadows, invert-token count, `.pb-note` background, deleted hover rules, underline reveal on `.foot-col a:hover`, `.sig-out` stroke) all passed on first verification after the eyebrow gap was closed.

## User Setup Required

None - no external service configuration required.

## Next Phase Readiness

- `src/app/globals.css` is now fully accent-free; `grep -rn "var(--accent)\|var(--color-accent)" src/app/globals.css` returns zero hits.
- The three-tier D-09 hover language (block invert / inline underline / display-stroke fill) is established and consistently applied across all ~36 sites converted in this plan plus the 5 sites already fixed in 20-01 — Plans 20-03/20-04 can follow this same tier classification when converting the 17 component/route files under `src/` that still reference `accent` in their Tailwind class names (out of scope for this plan, which was globals.css-only).
- `npm run build` and the vitest suite (182 passed, 1 known pre-existing failure at `projects.test.tsx:188`, unrelated) both confirm no regressions from this plan's token substitutions.

## Self-Check: PASSED

- FOUND: src/app/globals.css
- FOUND: 036cf2c (Task 1 commit)
- FOUND: 77df68c (Task 2 commit)

---
*Phase: 20-mono-token-foundation*
*Completed: 2026-07-21*
