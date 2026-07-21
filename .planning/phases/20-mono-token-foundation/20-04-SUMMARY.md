---
phase: 20-mono-token-foundation
plan: 04
subsystem: ui
tags: [css, tailwind-v4, design-tokens, mono, accent-removal, layout, routes]

# Dependency graph
requires:
  - phase: 20-mono-token-foundation
    provides: "20-01's @theme inline mono token block (--color-invert, --color-text-dim, --color-text-muted, --color-border-strong) and unified :focus-visible ring"
provides:
  - "Zero accent references in the site-wide footer, about/timeline.tsx, and the four interior routes named in D-02's call-site list (contact, writing, blog/[slug], building/[slug])"
affects: [20-05]

# Tech tracking
tech-stack:
  added: []
  patterns:
    - "Nav-link groups with no permanent underline reveal via hover:underline hover:underline-offset-4 instead of a hover color change (D-09 Tier 2, footer-specific application)"
    - "Links that already carry a permanent underline drop the hover color state entirely rather than defining a mono hover color (D-09 Tier 2, resolves PATTERNS.md's flagged ambiguity for building/[slug])"

key-files:
  created: []
  modified:
    - src/components/layout/site-footer.tsx
    - src/components/about/timeline.tsx
    - src/app/contact/page.tsx
    - src/app/writing/page.tsx
    - src/app/blog/[slug]/page.tsx
    - src/app/building/[slug]/page.tsx

key-decisions:
  - "contact/page.tsx doc-comment reworded to 'no hue anywhere' instead of the plan's literal instruction ('zero accent') because the plan's own action text conflicted with its own acceptance criteria (grep for the word 'accent' returning 0 hits) — see Deviations"
  - "timeline.tsx (confirmed zero importers via grep before editing) repointed its two nonexistent tokens (--accent-warm, --gold) and its --accent references to real mono tokens rather than inventing new ones, since it is dead code"
  - "building/[slug]/page.tsx external-link hover color dropped entirely (not replaced with a mono hover color) since the link already carries a permanent underline at rest, per D-09 Tier 2"

requirements-completed: [MO-02, MO-03]

# Metrics
duration: ~10min
completed: 2026-07-21
---

# Phase 20 Plan 04: Mono Token Foundation - Footer, Timeline & Interior Routes Summary

**Converted the site-wide footer's offset rule and nav-link hovers, the dead-code about/timeline.tsx icon-dot map, and four interior routes (contact, writing, blog/[slug], building/[slug]) to the mono token system, closing out the last named group of accent-referencing files under `src/` outside globals.css/v3/OG.**

## Performance

- **Duration:** ~10 min
- **Completed:** 2026-07-21T10:35:00Z
- **Tasks:** 2 (both executed as planned, with one plan-inconsistency fix)
- **Files modified:** 6

## Accomplishments

- `site-footer.tsx`: the offset rule (`h-2` bar) now reads `bg-[var(--color-invert)]` (D-11); both Explore and Elsewhere nav-link groups reveal on hover via `hover:underline hover:underline-offset-4` instead of an accent color change.
- `timeline.tsx` (confirmed dead code — zero importers anywhere in `src/`): its icon-dot map's two nonexistent tokens (`--accent-warm`, `--gold`) and all `--accent` references now resolve to real mono tokens (`--color-invert`, `--color-text-dim`, `--color-border-strong`), so the component would render sensibly if ever wired up again. A one-line comment now flags it as unused.
- `contact/page.tsx`: doc-comment updated to describe the mono brand rule (worded to avoid the literal substring "accent" — see Deviations).
- `writing/page.tsx`: the static Monty Monthly section subheading converted to `text-text-dim` (Tier 2, no hover state).
- `blog/[slug]/page.tsx`: both metadata separator dots converted to `text-[var(--color-text-muted)]`.
- `building/[slug]/page.tsx`: the external project link's hover color removed entirely (link already carries a permanent underline; per D-09 Tier 2, an already-underlined link should not also change color on hover) — resolves the ambiguity PATTERNS.md flagged for this call site.
- `grep -rn "accent" <all 6 files>` returns 0 hits. `npm run build` passes clean. `npx vitest run`: 182 passed, 1 pre-existing failure (`projects.test.tsx:188`, confirmed unrelated per known_context), 16 todo.

## Task Commits

Each task was committed atomically:

1. **Task 1: Convert site-footer.tsx (D-11) and timeline.tsx** - `8fa4c9b` (feat)
2. **Task 2: Convert contact, writing, blog/[slug], and building/[slug] routes** - `d5ce2ad` (feat)

_Plan-metadata commit follows below per the sequential-executor protocol._

## Files Created/Modified

- `src/components/layout/site-footer.tsx` - offset rule -> `--color-invert`; both nav-link groups -> underline-reveal hover
- `src/components/about/timeline.tsx` - icon-dot color map repointed to real mono tokens; unused-component comment added
- `src/app/contact/page.tsx` - doc-comment reworded (mono brand rule, no literal "accent" substring)
- `src/app/writing/page.tsx` - Monty Monthly subheading -> `text-text-dim`
- `src/app/blog/[slug]/page.tsx` - metadata separator dots -> `text-[var(--color-text-muted)]`
- `src/app/building/[slug]/page.tsx` - external-link hover color dropped (permanent underline already present)

## Decisions Made

- Followed the plan's explicit per-line conversion instructions for all six files, including the D-11 footer offset-rule conversion, the timeline.tsx dead-code token repointing, and the building/[slug] Tier 2 ambiguity resolution (drop hover color, keep permanent underline).
- For `contact/page.tsx`, deviated from the plan's literal instructed text (see Deviations below) to satisfy the plan's own acceptance criteria.

## Deviations from Plan

### Auto-fixed Issues

**1. [Rule 1 - Bug] Plan's instructed doc-comment text for contact/page.tsx conflicted with its own acceptance criteria**

- **Found during:** Task 2 (Convert contact, writing, blog/[slug], and building/[slug] routes), verification step
- **Issue:** The plan's `<action>` block instructs replacing the doc-comment with `Brand rules: pure black/white, zero accent, no gradients, no em dashes.` — but the same task's `<acceptance_criteria>` and the plan's overall `<verification>` both require `grep -n "accent" src/app/contact/page.tsx ...` to return 0 hits. Following the action text literally would leave the substring "accent" in the file (in "zero accent"), failing the plan's own acceptance criteria and the phase's stated goal of a zero-hits grep for D-03/20-05.
- **Fix:** Reworded the doc-comment to `Brand rules: pure black/white, no hue anywhere, no gradients, no em dashes.` — preserves the intended meaning (no color accents anywhere) without using the literal word "accent".
- **Files modified:** `src/app/contact/page.tsx`
- **Verification:** `grep -n "accent" src/app/contact/page.tsx` returns 0 hits; `npm run build` passes.
- **Committed in:** `d5ce2ad` (Task 2 commit)

---

**Total deviations:** 1 auto-fixed (1 bug — plan's own action text conflicted with its acceptance criteria, not a code defect)
**Impact on plan:** Closes the loop on the plan's own stated acceptance criteria and the phase's zero-hits-grep goal. No scope creep — a one-line comment reword preserving the exact same intent.

## Issues Encountered

None beyond the contact/page.tsx doc-comment wording conflict documented above. All other acceptance criteria (footer's `--color-invert` offset rule, 2x `hover:underline` hits, timeline.tsx's zero `gold`/`accent-warm` hits, all four routes' zero `accent` hits, building/[slug]'s zero `hover:text-[var(--accent-hover)]` hits) passed on first verification.

## User Setup Required

None - no external service configuration required.

## Next Phase Readiness

- All six files this plan owned are accent-free; combined with 20-01/20-02 (globals.css) and 20-03 (v3 shared components), the ~17 known `accent`-referencing files under `src/` are fully converted except the OG-image routes and the spec doc, both explicitly out of scope for this phase (Phase 23 per PROJECT.md).
- 20-05's D-03 zero-hits grep across `src/` should now find nothing outside `opengraph-image.tsx` routes and non-code spec documents.
- `npm run build` and the vitest suite (182 passed, 1 known pre-existing failure at `projects.test.tsx:188`, unrelated) both confirm no regressions from this plan's conversions.

## Self-Check: PASSED

- FOUND: src/components/layout/site-footer.tsx
- FOUND: src/components/about/timeline.tsx
- FOUND: src/app/contact/page.tsx
- FOUND: src/app/writing/page.tsx
- FOUND: src/app/blog/[slug]/page.tsx
- FOUND: src/app/building/[slug]/page.tsx
- FOUND: 8fa4c9b (Task 1 commit)
- FOUND: d5ce2ad (Task 2 commit)

---
*Phase: 20-mono-token-foundation*
*Completed: 2026-07-21*
