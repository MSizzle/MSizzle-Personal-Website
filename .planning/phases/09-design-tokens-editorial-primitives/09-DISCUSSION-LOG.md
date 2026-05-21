# Phase 9: Design Tokens & Editorial Primitives - Discussion Log

> **Audit trail only.** Do not use as input to planning, research, or execution agents.
> Decisions are captured in CONTEXT.md — this log preserves the alternatives considered.

**Date:** 2026-05-21
**Phase:** 9-design-tokens-editorial-primitives
**Mode:** `--auto` — no interactive prompts; Claude auto-selected the recommended option for every gray area.
**User instruction (standing from Phase 8):** "use the claude design hand off as context" → `.planning/research/editorial-redesign-handoff/README.md` was loaded and woven into every decision.
**Areas discussed:** Token replacement strategy, Dark mode disposition, Type-scale authoring approach, Primitive location convention, Specimen page persistence, Plan slicing, Inter @ 124px disposition

---

## Token Replacement Strategy (TOKEN-01)

| Option | Description | Selected |
|--------|-------------|----------|
| Replace `@theme` block entirely, no aliases | New tokens only; existing site breaks until Phase 12 catches all consumers | |
| Replace block contents + add v1.0 names as compat aliases | New tokens primary; old `--bg`/`--fg`/etc. resolve to new tokens; Phase 12 removes aliases | ✓ |
| Keep old block, add new alongside | Two parallel token systems — guaranteed drift | |

**User's choice:** Replace + alias bridge (auto-selected — recommended)
**Notes:** Phase 8 left the site running on v1.0 token names. Hard-cutting them mid-milestone breaks every page until Phase 12 finishes. The alias bridge keeps the site renderable through Phase 9–11 with the new palette applied; Phase 12 removes the bridge as part of the sub-page restyle sweep.

---

## Dark Mode Disposition

| Option | Description | Selected |
|--------|-------------|----------|
| Preserve dark mode | Keep `.dark` block, ThemeProvider, theme-toggle; add dark-mode editorial palette variants | |
| Keep wiring inert | Remove `.dark` palette but leave next-themes + toggle UI; toggle becomes no-op | |
| Drop entirely | Remove `.dark` block, ThemeProvider, theme-toggle UI; keep next-themes package installed for future use | ✓ |

**User's choice:** Drop entirely (auto-selected — recommended)
**Notes:** Handoff is light-only and has no documented dark-mode palette. Inert wiring leaves dead UI in the nav. Phase 13's QA-V2-05 allows "explicit drop decision recorded" — this CONTEXT.md is that record.

---

## Type-Scale Authoring Approach (TOKEN-02)

| Option | Description | Selected |
|--------|-------------|----------|
| Tailwind v4 `@utility` directives | One block per scale role (text-display, text-page-title, etc.) | |
| Tailwind v4 `@theme` typography extensions (`--text-{name}` + `--text-{name}--line-height`) | Idiomatic v4; bundles size + line-height + tracking + weight per role | ✓ |
| Arbitrary classes everywhere | `text-[124px] leading-[0.96] tracking-[-0.045em]` per consumer | |

**User's choice:** `@theme` typography extensions (auto-selected — recommended)
**Notes:** v4 native pattern. Consumers write `text-display` and get the whole bundle. Single source of truth. Arbitrary classes are explicitly forbidden by CLAUDE.md stack discipline.

---

## Primitive Location Convention

| Option | Description | Selected |
|--------|-------------|----------|
| `src/components/editorial/` (cross-page) | New directory; all 7 primitives | ✓ |
| `src/app/_components/` (App Router co-located) | Co-located with first consumer (Phase 10 homepage) | |
| Mixed (some cross-page, some co-located) | Rule + SectionLabel + ListRow cross-page; IntroLink + FooterCol co-located | |

**User's choice:** `src/components/editorial/` (auto-selected — recommended)
**Notes:** Handoff §"Components Catalog" explicitly names these 7 as "clear cross-page candidates." Phase 10 + 11 + 12 all consume them.

---

## Specimen Page Persistence (SC1)

| Option | Description | Selected |
|--------|-------------|----------|
| `/_specimen` permanent route, noindex | Permanent dev resource; useful for QA in Phases 10–13 + post-ship | ✓ |
| `/dev/specimen` permanent route | Same purpose, different URL convention | |
| Temporary specimen at `/_specimen` | Delete at phase end after verification | |
| Unit-test-only (no rendered route) | Snapshot tests of token CSS output | |

**User's choice:** Permanent `/_specimen` (auto-selected — recommended)
**Notes:** Specimen is cheaper to keep than to rebuild. Phase 13 QA can use it to visually re-verify tokens after restyle sweep. `_` prefix excludes from sitemap by convention; explicit `noindex` meta as belt-and-suspenders.

---

## Plan Slicing

| Option | Description | Selected |
|--------|-------------|----------|
| 10 plans, one per REQ | TOKEN-01, TOKEN-02, TOKEN-03 each own a plan; 7 primitives each own a plan | |
| 9 plans (recommended) | 1 plan bundles TOKEN-01+02+03 (all edit globals.css); 7 primitive plans; 1 specimen plan | ✓ |
| 3 plans | Tokens, primitives (all 7 bundled), specimen | |
| 2 plans | Tokens + specimen as one; primitives as one | |

**User's choice:** 9 plans (auto-selected — recommended)
**Notes:** Token plans all touch the same file (`globals.css` + `layout.tsx`) — bundling avoids merge conflicts. Each primitive is its own file → parallel-safe → one plan each. Specimen depends on tokens + primitives existing → Wave 2. TOKEN-03 (Inter weight verification) folds into the tokens plan as a verification step (not a separate plan).

---

## Inter @ 124px Disposition (TOKEN-03)

| Option | Description | Selected |
|--------|-------------|----------|
| Trust the handoff — Inter at spec values | Apply Helvetica Neue's letter-spacing -0.045em + line-height 0.96 to Inter | ✓ |
| Switch to Helvetica Neue at runtime | Add Helvetica Neue to font stack via `next/font/local` | |
| Tune Inter values to compensate | Tighten letter-spacing further (e.g., -0.05em) to make Inter feel like HN | |

**User's choice:** Trust handoff (auto-selected — recommended)
**Notes:** REQUIREMENTS.md TOKEN-03 locks this: "Helvetica Neue spec values applied to Inter; no font swap." Phase 10 manifesto QA surfaces any rendering issues. Phase 9 just verifies Inter weights 400/700 are loaded (already true at context-gather time).

---

## Claude's Discretion

- Exact JSDoc comments inside each primitive — minimal per CLAUDE.md no-comments default
- Exact `cn(...)` helper import path — verify existing project pattern, do NOT add new deps
- Specimen page section ordering — palette → type scale → primitives
- Whether to add a `_dev` index linking to `_specimen` — skip (overkill)

## Deferred Ideas

- Dark-mode editorial palette variant — future milestone
- Storybook integration — future tooling milestone
- Animated specimen page — defer; static is enough; respects v2.0 motion budget
- Token contrast accessibility audit — Phase 13 QA can flag; design decision belongs to handoff author
- CSS Custom Properties polyfill — modern browsers cover all CSS used; defer indefinitely
