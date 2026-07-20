# Phase 20: Mono Token Foundation - Discussion Log

> **Audit trail only.** Do not use as input to planning, research, or execution agents.
> Decisions are captured in CONTEXT.md — this log preserves the alternatives considered.

**Date:** 2026-07-20
**Phase:** 20-mono-token-foundation
**Areas discussed:** Accent token fate & blast radius, Inversion hover language, Grey ladder & surface tokens, Branch & preview mechanics
**Mode:** `--auto` — all gray areas auto-selected, recommended option chosen for each without prompting

---

## Accent token fate & blast radius

| Option | Description | Selected |
|--------|-------------|----------|
| Delete tokens + convert all call sites now | Remove `--accent*` / `--color-accent*` from the token layer and convert the ~17 `src/` files in this phase. Satisfies MO-02 literally. | ✓ |
| Alias to black, defer conversion | Point `--accent` at `#000000`, leave `text-accent` classnames alive, clean up in Phase 23. Cheap (1 file), but leaves a re-hue vector. | |
| Delete tokens, defer conversion to Phase 23 | Token layer clean immediately, but Tailwind silently emits nothing for `text-accent`, leaving unstyled elements with no compiler signal until Phase 23. | |

**Choice:** Delete tokens and convert all call sites in this phase (recommended default).
**Notes:** The deciding factor is that Tailwind v4 fails *silently* here, not loudly. Deleting `--color-accent` makes `text-accent` produce no CSS at all rather than a build error, so deferring the conversion would ship invisibly broken styling. This supersedes the ROADMAP.md Phase 20 sequencing note claiming the 17 files "follow the tokens for free" — true only if the token names survive, which D-01 rejects.

---

## Inversion hover language

| Option | Description | Selected |
|--------|-------------|----------|
| Three-tier rule (block / underline / stroke-fill) | Block surfaces invert wholesale; inline links reveal a 1px underline; oversized outline type fills its stroke. Each surface type gets the treatment that suits it. | ✓ |
| Universal block inversion | Every interactive element inverts to a black block, including inline text links. Simplest rule. | |
| Weight / opacity shift only | No inversion on hover, just a type-weight or opacity change. Quietest option. | |

**Choice:** Three-tier rule (recommended default).
**Notes:** Universal block inversion was rejected because inline footer and prose links inverting to black blocks reads as a glitch at scroll speed — a risk the sketch itself flags ("One may read as a glitch at speed"). Weight-only was rejected as too weak to replace what Vermilion was doing structurally. Focus-visible was split out as its own decision (D-10) because a black focus ring on an already-inverted black block would be invisible.

---

## Grey ladder & surface tokens

| Option | Description | Selected |
|--------|-------------|----------|
| Adopt mono.css, override muted for WCAG | Take the sketch theme's values as source of truth, but keep `--color-text-muted` at 0.60 instead of 0.46. Drop `--color-bg-2`. | ✓ |
| Adopt mono.css verbatim | Use 0.46 muted as sketched. Visually lighter, matches the sketch exactly. | |
| Keep v3 ladder, swap hues only | Retain 0.72 / 0.60 dim/muted and `--color-bg-2`, just remove the hue. Least churn. | |

**Choice:** Adopt mono.css with the muted override (recommended default).
**Notes:** `rgba(0,0,0,0.46)` renders `#8A8A8A` — 3.45:1 against white, which fails WCAG AA for body text. Phase 18 already fixed this exact class of bug (A11y 18-02) by moving muted to 0.60 (`#666666`, 5.74:1). The sketch was judged by eye rather than measured, so this is the one place the build must deviate from it. `--color-bg-2` was dropped because Phase 21 explicitly requires one continuous ground, leaving the alternate-band token with no legitimate consumer.

---

## Branch & preview mechanics

| Option | Description | Selected |
|--------|-------------|----------|
| One `v4-mono` branch for Phases 20-25 | Single long-lived branch, one preview URL, one alias swap at Phase 25. | ✓ |
| Merge each phase to main separately | Ship incrementally. | |
| Branch per phase, stacked | Isolated review per phase, more merge overhead. | |

**Choice:** One `v4-mono` branch (recommended default).
**Notes:** Merging per phase would put a half-converted site on production between Phases 20 and 23 — mono tokens live but the homepage, pinboard, and OG images still v3. DQ-01 requires the restyle be reviewable on a preview *before* it replaces production, and DQ-04 puts the alias swap at Phase 25, so a single branch is the only shape that satisfies both. Two operational hazards were recorded as decisions rather than left implicit: the orchestrator must create the branch and disable worktrees before executors run (D-13), and `vercel deploy --prebuilt --prod` must never be used on this project (D-14).

---

## Claude's Discretion

- Ordering and grouping of the ~17 file conversions across plans and waves
- Whether `--hero-bg` survives as a white-valued token or is deleted outright
- Whether emoji-badge modifier classes are renamed or collapsed
- Transition timing beyond the 120ms baseline, provided reduced-motion is respected

## Deferred Ideas

- Pinboard `SWATCHES` greyscale and black note panel — Phase 22 (TL-02)
- OG image routes hardcoding `#e5411f` — Phase 23 (SW-02)
- Notion inline text colors — Phase 23 (MO-04)
- Homepage rebuild to sketch 015 variant E — Phase 21
- Dark mode inversion tension (nothing to invert against on a black ground) — Phase 24 (DM-02)
- Retiring non-content photography — Phase 23 (SW-03)

## Scout Findings Worth Flagging

Two hardcoded survivals exist that ROADMAP.md's Phase 20 list does not name:

- `globals.css:1289` — `outline: 3px solid var(--accent)` (focus ring)
- `globals.css:1295` — `.pb-media { background: #a49e93 }` (warm grey)

Plus two suspect emoji-badge fills: `--ink` at `#17171a` (near-black, not true black) and `--gray` at `#dbe2ee` (blue-tinted). All four are folded into D-04.
