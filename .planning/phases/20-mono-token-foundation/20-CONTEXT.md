# Phase 20: Mono Token Foundation - Context

**Gathered:** 2026-07-20
**Status:** Ready for planning
**Source:** discuss-phase `--auto` (all gray areas auto-resolved to the recommended option)

<domain>
## Phase Boundary

This phase replaces the v3 "Ink & Vermilion" token system in `src/app/globals.css` with a
pure black-and-white token system, removes every hardcoded color survival in that file,
converts every `accent` reference under `src/` to the new tokens, and establishes inversion
(black block on white) as the site's emphasis and interaction language. The work happens on a
branch with a live Vercel preview so it is reviewable before it touches production.

**In scope:** `src/app/globals.css` token block and rules, the ~17 files under `src/` that
reference `accent`, the branch, and the preview deployment.

**Out of scope:** the homepage rebuild (Phase 21), the pinboard's `SWATCHES` array and note
panel in `pinboard.tsx` (Phase 22), interior route sweep / Notion inline colors / OG images
(Phase 23), dark mode (Phase 24), perf and QA gates (Phase 25).

</domain>

<decisions>
## Implementation Decisions

### Accent token fate and blast radius

- **D-01:** Delete `--accent`, `--accent-hover`, `--accent-deep`, `--color-accent`,
  `--color-accent-hover`, and `--color-accent-deep` from the `@theme inline` block in
  `src/app/globals.css` outright. Do not alias them to black. MO-02 requires that no accent
  color exists anywhere in the token layer, and a black-aliased `--accent` leaves a live
  re-hue vector plus dead `bg-accent` / `text-accent` classnames for Phases 21-25 to trip on.

- **D-02:** Convert every `accent` reference under `src/` to the new tokens **in this phase**,
  not in Phase 23. Deleting the `--color-accent*` aliases makes Tailwind v4 emit nothing for
  `text-accent` / `bg-accent` / `border-accent` — a *silent* no-op, not a build error. Leaving
  the call sites would produce unstyled elements with no compiler signal. Known call sites:
  `src/components/v3/button.tsx`, `big-list.tsx`, `section-label.tsx`, `marquee.tsx`,
  `video-card.tsx`, `card.tsx`, `uses-list.tsx`, `page-hero.tsx`, `newsletter-carousel.tsx`,
  `src/components/layout/site-footer.tsx`, `src/components/about/timeline.tsx`,
  `src/app/contact/page.tsx`, `src/app/writing/page.tsx`, `src/app/blog/[slug]/page.tsx`,
  `src/app/building/[slug]/page.tsx`.

  This supersedes the ROADMAP.md Phase 20 sequencing note ("the 17 files ... mostly follow the
  tokens for free"). That is only true if the token *names* survive, and D-01 deletes them.

- **D-03:** After the conversion, `grep -rn "accent\|e5411f\|c8381a\|a52d13\|f4ecdd\|faf9f7" src/`
  returns zero hits outside `src/app/montysinger-v2-spec.md` (a historical spec document, not
  shipped code) and the three `opengraph-image.tsx` routes (explicitly Phase 23).

### Hardcoded survivals in globals.css

- **D-04:** Fix all six hardcoded survivals, not the four named in ROADMAP.md. The scout found
  two the roadmap missed:

  | Line | Current | Becomes |
  |------|---------|---------|
  | `globals.css:122` | `--hero-bg: #f4ecdd` | `#ffffff` (or the token is deleted if the hero band dies in Phase 21 — keep the token, set it white) |
  | `globals.css:618` | `background: #e5411f` | `var(--color-invert)` (black block, white text already set on the next line) |
  | `globals.css:673` | `.emoji-badge--cream { background: #f4ecdd }` | `rgba(0,0,0,0.08)` |
  | `globals.css:674` | `.emoji-badge--vermilion { background: var(--accent) }` | rename to `.emoji-badge--invert`, `background: var(--color-invert)` |
  | `globals.css:1289` | `outline: 3px solid var(--accent)` | `outline: 2px solid var(--color-invert)`, offset 2px (see D-08) |
  | `globals.css:1293` | `.pb-frame--cream { background: #f4ecdd }` | `#ffffff` with the border carrying the edge |
  | `globals.css:1295` | `.pb-media { background: #a49e93 }` | `rgba(0,0,0,0.08)` |

  Also audit `.emoji-badge--ink { background: #17171a }` and `.emoji-badge--gray { background: #dbe2ee }`
  (`globals.css:672`, `:675`) — `#dbe2ee` is a blue-tinted grey and violates MO-01.

### Grey ladder and surface tokens

- **D-05:** Adopt `.planning/sketches/themes/mono.css` as the source of truth for token values,
  translated into the `@theme inline` block's `--color-*` naming so Tailwind v4 emits utilities:

  ```
  --color-bg:              #ffffff
  --color-surface:         #ffffff
  --color-invert:          #000000    /* the black-block ground */
  --color-border:          rgba(0,0,0,0.14)
  --color-border-strong:   rgba(0,0,0,0.32)
  --color-text:            #000000
  --color-text-dim:        rgba(0,0,0,0.66)
  --color-text-muted:      rgba(0,0,0,0.60)   /* see D-07 — NOT mono.css's 0.46 */
  --color-text-inverse:    #ffffff
  --color-text-inverse-dim:rgba(255,255,255,0.66)
  --color-border-inverse:  rgba(255,255,255,0.20)
  ```

- **D-06:** Delete `--color-bg-2` (`#f0f1f3`, the alternate section band). Phase 21 success
  criterion 4 requires one continuous white ground with no light/dark band slam, so an alternate
  band token has no legitimate consumer. Where a band boundary is still needed, use a
  `--color-border` hairline rule, never a fill.

- **D-07:** Override `mono.css`'s `--color-text-muted: rgba(0,0,0,0.46)` to `rgba(0,0,0,0.60)`.
  0.46 black on white renders `#8A8A8A`, a 3.45:1 contrast ratio, which fails WCAG AA for body
  text. 0.60 renders `#666666` at 5.74:1 and preserves the A11y 18-02 fix shipped in Phase 18.
  `--color-text-dim` at 0.66 (`#575757`, ~7:1) is safe as-is. The sketch was judged by eye, not
  measured; this is the one place the shipped site must not follow it.

- **D-08:** `--color-surface` changes from `#17171a` (near-black) to `#ffffff`. The near-black
  dark-panel role is taken over by `--color-invert: #000000`. Any component currently using
  `bg-surface` to mean "dark panel" must be converted to `bg-invert` + `text-inverse`, not left
  pointing at the renamed token.

### Inversion as the emphasis language

- **D-09:** Three-tier hover rule, applied consistently across every converted call site:

  1. **Block surfaces** (index rows, buttons, cards, tags): hover inverts the entire surface —
     `background: var(--color-invert)`, `color: var(--color-text-inverse)`, border goes black.
     Transition 120ms on `background-color` and `color` only.
  2. **Inline text links** (footer nav, prose links, breadcrumbs): hover reveals a 1px
     `currentColor` underline. No color change, no weight change, no block.
  3. **Oversized display type** (`big-list.tsx` outline items using `-webkit-text-stroke`):
     hover fills the stroke to solid black — stroke becomes fill. Replaces the
     `hover:text-accent` + `-webkit-text-stroke-color: var(--accent)` pair.

- **D-10:** `:focus-visible` is `outline: 2px solid var(--color-invert)` with `outline-offset: 2px`,
  site-wide, replacing the accent outline at `globals.css:1289`. Focus must never rely on the
  hover inversion, because an inverted block and a focus ring on the same element would both be
  black and become indistinguishable.

- **D-11:** `site-footer.tsx:37` — the `h-2 bg-[var(--accent)]` vermilion rule becomes
  `h-2 bg-[var(--color-invert)]`. It stays a solid offset shape (per the site-wide no-gradients
  rule); only the hue dies.

### Branch and preview

- **D-12:** One long-lived branch, `v4-mono`, carries Phases 20 through 25 to a single alias
  swap at Phase 25. Do not merge each phase to `main` separately — Phases 20-22 individually
  would put a half-converted site on production. Repo is currently on `main`.

- **D-13:** The branch is created by the orchestrator before any executor runs, and worktrees are
  disabled for phases on this branch. Executors that create their own branch mid-phase commit to
  the wrong ref.

- **D-14:** The Vercel preview is the automatic branch preview from pushing `v4-mono` — no manual
  deploy command in this phase. Never use `vercel deploy --prebuilt --prod` on this project. The
  production alias swap is Phase 25 (DQ-04) and is explicitly out of scope here.

- **D-15:** DQ-01 is satisfied when the preview URL renders the mono system while
  `montysinger.com` still serves v3 unchanged — both verified in the same session.

### Claude's Discretion

- Exact ordering and grouping of the ~17 file conversions across plans and waves.
- Whether `--hero-bg` survives as a white-valued token or is deleted, given Phase 21 may remove
  its only consumer. Either satisfies MO-01/MO-02.
- Whether the emoji-badge modifier classes are renamed or collapsed, as long as no hue remains.
- Transition timing values beyond the 120ms in D-09, provided reduced-motion is respected.

</decisions>

<canonical_refs>
## Canonical References

**Downstream agents MUST read these before planning or implementing.**

### Locked design
- `.planning/sketches/015-mono-passive-home/README.md` — variant E is the locked v4 design;
  the "Palette-only deltas from production" section names the real build decisions
- `.planning/sketches/themes/mono.css` — the mono token values adopted by D-05; deliberately
  defines no `--color-accent` so anything secretly needing one visibly breaks
- `.planning/sketches/015-mono-passive-home/index.html` — the built variants, including E

### Requirements and scope
- `.planning/REQUIREMENTS.md` §MO-01, MO-02, MO-03, MO-05, DQ-01 — the five requirements this
  phase must satisfy
- `.planning/ROADMAP.md` §"Phase 20: Mono Token Foundation" — success criteria and the
  sequencing note (partially superseded by D-02)

### Code under change
- `src/app/globals.css` lines 3-49 — the `@theme inline` token block being replaced
- `src/app/globals.css` lines 122, 618, 672-675, 1289, 1293, 1295 — the hardcoded survivals

### Project rules
- `CLAUDE.md` — stack constraints; Tailwind v4 CSS-first config, no `tailwind.config.js`
- No gradients anywhere; depth comes from hard offset solid shapes
- No em dashes in user-visible copy

</canonical_refs>

<code_context>
## Existing Code Insights

### Reusable Assets
- `.planning/sketches/themes/mono.css`: a complete, already-authored mono token set. This phase
  is a translation of that file into Tailwind v4 `@theme inline` naming, not a fresh design.
- The v3 token architecture is sound — the palette is genuinely token-driven, so the structural
  work is renaming and revaluing, not rearchitecting.

### Established Patterns
- Tailwind v4 CSS-first config: tokens live in `@theme inline` in `globals.css`; there is no
  `tailwind.config.js`. A token must be in the `--color-*` namespace for Tailwind to emit
  utilities for it — this is why the v3 file carries both `--accent` and `--color-accent`
  (documented inline as code review finding WR-01).
- Hard corners (radius 0) and Hanken Grotesk 800 display type are v3 survivors and must be
  intact after the retheme (MO-05).

### Integration Points
- 17 files under `src/` reference `accent`; `globals.css` alone has 59 hits.
- `src/components/v3/` is the shared component layer — converting `button.tsx`, `big-list.tsx`,
  and `section-label.tsx` propagates to every route at once, which is why the interior-route
  sweep in Phase 23 is a *visual* audit rather than a second conversion pass.
- `src/components/home/pinboard.tsx` is deliberately untouched here. Its CSS lives in
  `globals.css` (`.pb-*` rules, in scope) but its `SWATCHES` array and note panel are Phase 22.

</code_context>

<specifics>
## Specific Ideas

- Monty's brief, 2026-07-20: pure black and white, zero accent. No orange, no clay, no cream.
- The sketch's own stated main risk: "Does mono actually feel cooler, or just unfinished?
  Vermilion was doing real structural work. Watch whether the hairline rules and mono labels
  carry that load, or whether the page reads as a stylesheet that failed to load." The hairline
  value (`rgba(0,0,0,0.14)`) and the border-strong step (`0.32`) are what carry that load — they
  are load-bearing, not decoration.
- Card categories are told apart by shape and border weight, never by hue.

</specifics>

<deferred>
## Deferred Ideas

- **Pinboard `SWATCHES` greyscale + black note panel** — `pinboard.tsx` JS-level color. Phase 22
  (TL-02). Only the `.pb-*` CSS in `globals.css` is touched here.
- **OG image routes** — the three `opengraph-image.tsx` files hardcode `#e5411f`. Phase 23
  (MO-04 / SW-02).
- **Notion inline text colors** — amber/orange/blue/gray authored in posts. Phase 23 (MO-04).
- **Homepage rebuild** — type-only hero, Swiss numbered Building index, terminal writing log.
  Phase 21.
- **Dark mode inversion tension** — on a black ground, an emphasis language built on "invert to a
  black block" has nothing to invert against. Flagged in ROADMAP.md as the hardest requirement in
  the milestone. Phase 24 (DM-02) must resolve it by explicit design decision. Phase 20 should
  name the inversion tokens (`--color-invert`, `--color-text-inverse`) so Phase 24 has a seam to
  work with, but must not attempt to solve it.
- **Retiring non-content photography** — hero portraits, Prometheus screenshot, photo-marquee
  fallback. Phase 23 (SW-03).

</deferred>

---

*Phase: 20-mono-token-foundation*
*Context gathered: 2026-07-20 via discuss-phase --auto*
