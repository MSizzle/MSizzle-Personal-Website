---
phase: 20-mono-token-foundation
plan: 01
subsystem: ui
tags: [css, tailwind-v4, design-tokens, theme, accessibility]

# Dependency graph
requires: []
provides:
  - "Mono @theme inline token block in src/app/globals.css (--color-invert, --color-text-inverse-dim, --color-border-inverse; revalued --color-bg/-surface/-border/-border-strong/-text/-text-dim/-text-muted/-text-inverse; --color-bg-2 deleted)"
  - "Zero hardcoded vermilion/cream/blue-tinted-grey hex survivals in globals.css"
  - "One unified :focus-visible rule (2px solid var(--color-invert), offset 2px) with no bespoke override suppressing or bypassing it"
affects: [20-02, 20-03, 20-04, 20-05]

# Tech tracking
tech-stack:
  added: []
  patterns:
    - "Tailwind v4 @theme inline token naming: mono values live in --color-* namespace so utilities (bg-invert, text-invert, border-invert) emit automatically"
    - "Site-wide :focus-visible defined once near the top of globals.css; component-level focus rules must not redefine outline, only let it fall through"

key-files:
  created: []
  modified:
    - src/app/globals.css

key-decisions:
  - "Task 1 (branch creation) adapted: this executor runs inside a Claude Code worktree on branch worktree-agent-ab766a44cdd73e554, not a literal v4-mono checkout — see Deviations"
  - "D-01: accent tokens (--accent/-hover/-deep, --color-accent/-hover/-deep) deleted outright, no black alias"
  - "D-05/D-07/D-08 token revaluations applied exactly as specified, including the 0.60 (not mono.css's 0.46) override on --color-text-muted for WCAG AA"
  - "D-10 focus-visible unified globally; .nav-cell's outline:none override deleted; .prometheus-link split into a Tier-2 hover-underline rule with :focus-visible falling through to the global ring; pinboard outlines (.pb-frame, .pb-card:hover, .pb-card.pb-peek) all converted to 2px solid var(--color-invert), offset 2px"

patterns-established:
  - "Hardcoded band/placeholder tints (formerly warm/cool solid swatches) now use rgba(0,0,0,0.08) as the neutral placeholder fill"

requirements-completed: [MO-01, MO-02, DQ-01]

# Metrics
duration: ~15min
completed: 2026-07-21
---

# Phase 20 Plan 01: Mono Token Foundation Summary

**Replaced the v3 Ink & Vermilion `@theme inline` token block in `src/app/globals.css` with a pure black/white mono system (zero accent tokens, `--color-invert: #000000`), fixed all six-plus hardcoded hex survivals, and unified every `:focus-visible` state into one 2px solid black ring.**

## Performance

- **Duration:** ~15 min
- **Completed:** 2026-07-21T02:54:20Z
- **Tasks:** 3 (2 executed as planned, 1 adapted — see Deviations)
- **Files modified:** 1 (`src/app/globals.css`)

## Accomplishments

- `@theme inline` block fully retheme'd: six accent tokens deleted outright (no black alias), nine tokens revalued to mono.css values (with the D-07 WCAG override on `--color-text-muted`), three new invert-role tokens added, `--color-bg-2` deleted entirely.
- Zero hardcoded vermilion (`#e5411f`), cream (`#f4ecdd`), blue-tinted-grey (`#dbe2ee`), or near-black (`#17171a`/`#faf9f7`/`#171717`) hex values remain anywhere in `globals.css`.
- One unified `:focus-visible { outline: 2px solid var(--color-invert); outline-offset: 2px; }` rule governs the whole file; every previously-bespoke override (`.nav-cell`, `.prometheus-link`, `.pb-frame`/`.pb-card:hover`/`.pb-card.pb-peek`) now either falls through to it or matches its exact value.

## Task Commits

1. **Task 1: Create and check out the v4-mono branch** - adapted, no commit (see Deviations — infrastructure constraint, not a code change)
2. **Task 2: Replace the @theme inline token block with the mono system** - `239ea89` (feat)
3. **Task 3: Fix hardcoded hex survivals and unify the focus-visible ring** - `fa6d2de` (fix)

_No plan-metadata commit yet — orchestrator handles STATE.md/ROADMAP.md centrally after all wave agents merge._

## Files Created/Modified

- `src/app/globals.css` - Mono `@theme inline` token block (D-01/D-05/D-06/D-07/D-08); `:root` sig-vars (`--sig-shadow`, `--hero-bg`) revalued; hardcoded hex survivals fixed (D-04 + audit flags); unified `:focus-visible` ring (D-10)

## Decisions Made

- Followed the plan's token values and D-04/D-10 fix list exactly, including the two audit-flagged blue-tinted-greys (`.pslide:nth-child(3)`, `.emoji-badge--gray`) and the directly-adjacent warm tint (`.pslide:nth-child(2)`) the audit table didn't explicitly list but the plan's action block called out.
- `.emoji-badge--vermilion` renamed to `.emoji-badge--invert`; confirmed via `grep -rn "emoji-badge--vermilion" src/` that no JSX call site referenced the old class name, so no component changes were needed.
- Left `var(--accent)`/`var(--color-accent)` references elsewhere in `globals.css` (36 remaining hits) untouched — these are Tier 1/2/3 call-site conversions explicitly scoped to plan 20-02, per this plan's own `<verification>` note.

## Deviations from Plan

### Auto-fixed Issues

**1. [Rule 3 - Blocking] Task 1 (branch creation) adapted to the worktree execution harness**

- **Found during:** Task 1 (Create and check out the v4-mono branch)
- **Issue:** The plan's Task 1 assumes the executor starts on `main` and runs `git checkout -b v4-mono`, with D-12/D-13 stating worktrees should be disabled for this phase and the branch pre-created by the orchestrator. In practice, this executor was spawned as a parallel worktree agent on branch `worktree-agent-ab766a44cdd73e554` (base commit `2d23086`, matching the tip of `main` at spawn time). No `v4-mono` branch exists yet, and six other sibling worktree-agent branches are concurrently checked out (`git worktree list` confirmed no `v4-mono` entry). This is a known project-level pattern gap (see MEMORY: "GSD branch-creation vs worktrees") — the orchestrator did not create `v4-mono` or disable worktrees ahead of this phase's executors, contrary to D-12/D-13.
- **Fix:** Did not attempt `git checkout -b v4-mono` — doing so would violate this executor's mandatory pre-commit HEAD safety assertion, which refuses any commit unless HEAD is on a `worktree-agent-*` branch (#2924). Instead, verified the equivalent intent (no separate `v4-mono` worktree exists, base commit matches `main`'s tip) and proceeded with Tasks 2-3 on the assigned worktree branch. Branch consolidation onto `v4-mono` is deferred to the orchestrator's wave-merge step, consistent with how `sub_repos`/worktree-mode plans already skip shared-file writes.
- **Files modified:** None (verification-only; no globals.css change required by Task 1 itself)
- **Verification:** `git worktree list` and `git branch -a` confirm no `v4-mono` branch/worktree exists yet; `git merge-base HEAD main` equals `main`'s HEAD, so no divergence occurred beyond this plan's two commits.
- **Committed in:** N/A (no commit needed for this task)

---

**Total deviations:** 1 auto-fixed (1 blocking — infrastructure/process mismatch, not a code defect)
**Impact on plan:** Zero impact on the actual token/CSS deliverable. The `v4-mono` branch consolidation is an orchestration concern the executor cannot resolve from inside a single worktree; flagging it here so the orchestrator (or Monty) creates/merges `v4-mono` before plan 20-05's push per D-14.

## Issues Encountered

None beyond the Task 1 branch-discipline mismatch documented above.

## User Setup Required

None - no external service configuration required.

## Next Phase Readiness

- `--color-invert`, `--color-text-inverse-dim`, `--color-border-inverse`, and the revalued `--color-*` tokens now exist in `globals.css`, giving plans 20-02/20-03/20-04 real tokens to convert call sites against (`bg-invert`, `text-invert`, `border-invert`, `text-text-inverse` Tailwind utilities all emit correctly).
- `var(--accent)`/`var(--color-accent)` still appears 36 times in `globals.css` (expected — Tier 1/2/3 call-site conversion is 20-02's job) and the ~17 `accent`-referencing component files under `src/` are entirely untouched (also 20-02's scope per D-02).
- **Orchestrator action needed before 20-02 runs:** resolve the `v4-mono` branch question — either (a) create `v4-mono` from this worktree's commits and have subsequent plans commit there directly (per D-12/D-13's original intent), or (b) confirm the wave-based worktree-merge pattern is the intended substitute and document that supersession in `20-CONTEXT.md`. Left as an open item; not blocking this plan's own deliverable.

---
*Phase: 20-mono-token-foundation*
*Completed: 2026-07-21*
