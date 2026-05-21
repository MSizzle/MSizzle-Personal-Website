# Phase 8: Motion Subtractions - Discussion Log

> **Audit trail only.** Do not use as input to planning, research, or execution agents.
> Decisions are captured in CONTEXT.md — this log preserves the alternatives considered.

**Date:** 2026-05-20
**Phase:** 8-motion-subtractions
**Mode:** `--auto` — no interactive prompts; Claude auto-selected the recommended option for every gray area.
**User instruction:** "use the claude design hand off as context" → `.planning/research/editorial-redesign-handoff/README.md` was loaded and woven into every decision.
**Areas discussed:** Deletion sequencing, Hero/section interim state, Cascade flattening, Always-on animation sweep, Test cleanup, Build verification gate

---

## Deletion Sequencing

| Option | Description | Selected |
|--------|-------------|----------|
| Atomic — one plan per MOTION-XX requirement | Each plan deletes one component + sweeps imports + verifies build | ✓ |
| One bulk-deletion plan | Single plan removes all 4 carousels + animate-ping + cascades + verifies once | |
| Phase-as-one-plan (no subdivision) | Treat the whole phase as a single execution unit | |

**User's choice:** Atomic (auto-selected — recommended)
**Notes:** Maps 1:1 to requirements, isolates blast radius (one carousel breaking the build doesn't block the others), and matches the ROADMAP risk callout that each deletion needs its own `rg` sweep.

---

## Hero & Section Interim State

| Option | Description | Selected |
|--------|-------------|----------|
| Delete JSX call sites entirely | Remove carousel + tagline blocks; keep hero copy and section headers; add minimal text-list fallback for Writings + Works so sections aren't empty | ✓ |
| Leave placeholder comment markers | `{/* Phase 10 manifesto here */}` to signal intent without rendering | |
| Stub a temporary minimal hero | New temporary hero component to delete in Phase 10 | |

**User's choice:** Delete JSX entirely (auto-selected — recommended)
**Notes:** The handoff's "subtraction not addition" framing rules out temporary stubs. Placeholder comments don't render. Minimal text fallback for Writings/Works keeps the route useful between Phase 8 and Phase 10 without introducing throwaway components.

---

## Cascade Flattening (MOTION-06)

| Option | Description | Selected |
|--------|-------------|----------|
| Drop the `delay` prop entirely | Remove from call sites AND from component prop signature | ✓ |
| Force delay=0 at call sites | Keep the prop on the component, pass 0 from `app/page.tsx` | |
| Force delay=0 inside the component, ignore the prop | Component swallows the value | |

**User's choice:** Drop the prop entirely (auto-selected — recommended)
**Notes:** Dead surface area (`delay` prop with no use) signals intent rot. Cleaner signature for Phase 10. The underlying `ScrollReveal` keeps its single-item fade; if it requires a delay, the wrapper passes 0 internally.

---

## Always-On Animation Sweep (MOTION-05)

| Option | Description | Selected |
|--------|-------------|----------|
| Only `animate-ping` (literal requirement reading) | Remove the one known occurrence; no broader grep | |
| Sweep all four `animate-(ping|pulse|bounce|spin)` | Insurance against drift; grep at plan time | ✓ |
| Full keyframe audit + custom `@keyframes` cleanup | Walk tailwind config + globals.css for any loop | |

**User's choice:** Sweep all four (auto-selected — recommended)
**Notes:** Today only `animate-ping` is in use, but the motion-budget contract is site-wide so the sweep is the contract, not the verified-today set. The keyframe-audit option was rejected as Phase 9 work (token-level animation budget decisions belong with the design-token phase).

---

## Test Cleanup

| Option | Description | Selected |
|--------|-------------|----------|
| Delete companion test files when component is deleted | ✓ | ✓ |
| Keep tests; let them fail-fast as a signal | | |
| Skip if no tests reference the components | | |

**User's choice:** Delete companion tests (auto-selected — recommended)
**Notes:** Verified at context-gather time: no test in `src/__tests__/` references the 4 deleted carousels. This is effectively a no-op today; the rule exists for future planners and for any test that surfaces during execution.

---

## Build Verification Gate

| Option | Description | Selected |
|--------|-------------|----------|
| Per-plan `npm run build` before commit | Catches import sweep misses early | |
| Single phase-final `vercel build --prod` | Match Phase 13's gate | |
| Both | Per-plan local build + phase-final production build | ✓ |

**User's choice:** Both (auto-selected — recommended)
**Notes:** v1.0 retrospective lesson #2 (production-build-as-truth) makes the per-plan gate non-negotiable. The phase-final production build matches Phase 13's discipline and catches anything the per-plan gate's `next build` misses (chunk-splitting differences, env edge cases).

---

## Claude's Discretion

- Exact filename of the per-plan PLAN.md files — follow the v1.0 milestones convention.
- Whether to delete `getCarouselPhotos()` helper in the same commit as the `PhotoCarousel` deletion (recommended yes, since it has no other caller — confirm via `rg`).
- Exact fallback markup for the Writings + Works sections — minimal stacked links, no new component, replaced by Phase 10 anyway.

## Deferred Ideas

- Custom `@keyframes` defined in `globals.css` or `tailwind.config` (if found during the MOTION-05 sweep) — defer cleanup to Phase 9.
- Cascade delays on `/blog`, `/projects`, `/links` if found outside the events page — flatten in this phase if cheap, else defer to Phase 12.
- Dark-mode editorial palette — Phase 13 / future requirement.
- Manifesto letter-stagger interaction (MOTION-07) — Phase 10.
