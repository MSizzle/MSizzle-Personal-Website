# Phase 14: Branch & Crimson Poster Foundation - Context

**Gathered:** 2026-06-18
**Status:** Ready for planning

<domain>
## Phase Boundary

Stand up the `v3` working branch on its own Vercel preview (production untouched) and build the
"Crimson Poster" design foundation: the Tailwind v4 `@theme` tokens, the fonts, and the brutalist
primitive components that every later phase composes. This phase delivers the base system and a
primitives showcase, NOT any real pages, the slide deck, or the 3D object (those are Phases 15-16).

</domain>

<decisions>
## Implementation Decisions

All four foundation gray areas were resolved to the recommended defaults (user: "these are all done").

### Branch & swap baseline
- **D-01:** Create the `v3` branch from the **current branch** (`claude/phase-8-resume`). Verified `main`
  is an ancestor of it, so it carries the live-equivalent editorial code PLUS all v3 planning + sketches.
- **D-02:** v3 deploys to its **own Vercel preview**; production (`montysinger.com`) stays on the current
  live deployment untouched through the whole milestone.
- **D-03:** At parity + QA GO (Phase 18), promote v3 to the **production alias** (the swap). Verify the
  alias points where expected immediately after `vercel deploy --prod`. NEVER use `--prebuilt --prod`
  (see [[vercel-prod-deploy-gotchas]]). The Phase 14 plan should confirm the current prod alias target
  before/at branch creation so the swap target is unambiguous later.

### Token strategy
- **D-04:** REPLACE the warm-paper `@theme inline` block in `src/app/globals.css` with a single fixed
  "Crimson Poster" theme. Canvas `#d93c1e`, black accent `#0a0503`, near-black supporting text `#120604`.
  No gradients anywhere.
- **D-05:** Drop the v2 light/dark mode entirely (remove `next-themes` usage / the dual `@theme` blocks).
  v3 is one aesthetic, no toggle. Remove the v1 compatibility aliases as part of the swap.
- **D-06:** The signature display treatment (display type filled in the SAME crimson as the canvas, lifted
  by a hard black drop shadow; outline variant = black stroke) should be expressed as reusable token(s) /
  a utility so every heading gets it consistently. Reference values: `--sig: var(--color-bg)`,
  `--sig-shadow: 0.055em 0.055em 0 #0a0503`.

### Primitives approach
- **D-07:** Build a FRESH v3 component set ported from the prototype's `assets/site.css` (clickable list
  rows with hover-invert, big-type list, buttons incl. accent, marquee, rules/rule-strong, section labels,
  page-title hero, cards, video cards). Keep the old `src/components/editorial/*` and `home-v2/*`
  primitives in place until interior pages migrate in Phase 16, then delete them.
- **D-08:** Deliver a primitives showcase route/page in this phase so the system can be reviewed in
  isolation before pages are built.

### Fonts
- **D-09:** Swap Inter for **Space Grotesk** (display) + **JetBrains Mono** (labels) via `next/font/google`
  as CSS variables (`--font-display`, `--font-mono`). Drop Inter. Use next/font (not the prototype's
  `@import`) for performance.

### Claude's Discretion
- Exact token naming, file organization, and how the primitives showcase is routed are left to the planner.
- Whether to keep `next-themes` installed (unused) or remove the dependency.
</decisions>

<canonical_refs>
## Canonical References

**Downstream agents MUST read these before planning or implementing.**

### Design spec (the reference implementation — port from this)
- `.planning/sketches/002-full-site-model/assets/site.css` — every component's exact styling (rows, big-list, buttons, marquee, rules, labels, page-hero, cards, videos) and the signature shadow treatment.
- `.planning/sketches/002-full-site-model/assets/site.js` — nav/footer injection, reveals, deck controller, blob (Phase 15), object entrance.
- `.planning/sketches/themes/default.css` — the locked "Crimson Poster" token values (colors, type scale, spacing, `--sig` / `--sig-shadow`).
- `.planning/sketches/MANIFEST.md` — locked design decisions and rationale across sketches 001-002.
- `.planning/sketches/002-full-site-model/README.md` — page map + the CHOMP-derived deck mechanic notes.

### Existing code to replace / align with
- `src/app/globals.css` — current Tailwind v4 `@theme inline` warm-paper tokens + type scale (the block being replaced).
- `src/app/layout.tsx` — current Inter `next/font` wiring (to be swapped for Space Grotesk + JetBrains Mono).
- `src/components/editorial/*`, `src/components/home-v2/*` — v2 primitives (kept until Phase 16, then removed).

### Milestone-level
- `.planning/REQUIREMENTS.md` — requirements DS-01..DS-05 + DQ-01 are this phase's scope.
- `.planning/PROJECT.md` — milestone goal, scope boundary (presentation-only), copy rules.
</canonical_refs>

<code_context>
## Existing Code Insights

### Reusable Assets
- Tailwind v4 `@theme inline` pattern is already established in `globals.css` — the crimson tokens slot into the same mechanism (just new values + the `--sig`/`--sig-shadow` additions).
- The type-scale-as-`--text-*`-tokens pattern (with `--line-height` / `--letter-spacing` / `--font-weight` sub-properties) is already in use — reuse it for the Space Grotesk display scale.
- `next/font/google` wiring in `layout.tsx` is the template for swapping the font families.
- Existing editorial primitives are a structural reference (component shape, props) even though the styling is replaced.

### Established Patterns
- Single global stylesheet + Tailwind utilities; components are small presentational `.tsx` files under `src/components/`.
- Provider hierarchy ThemeProvider > LenisProvider > MotionProvider (light/dark removal touches ThemeProvider).

### Integration Points
- `globals.css` `@theme` block and `layout.tsx` font wiring are the two foundation touch-points.
- Removing light/dark touches `ThemeProvider` / `next-themes` and any `dark:` usages.
</code_context>

<specifics>
## Specific Ideas

- **User priority flag:** "The more important things are the graphics." The visual/graphical fidelity is
  the highest-value concern for this milestone — primarily the Phase 15 3D hero object (form, material,
  motion) and the overall poster feel. Phase 14 should make the signature type treatment and palette
  pixel-faithful to the prototype so the graphics-heavy phases build on an accurate base. Carry this flag
  into Phase 15 discussion/planning.
- The prototype is the source of truth for exact look; match it rather than reinventing.
</specifics>

<deferred>
## Deferred Ideas

- Real YouTube thumbnails / oEmbed for `/watching` (prototype uses placeholders) — deferred to a future iteration per REQUIREMENTS.md.
- Per-slide bespoke motion on interior pages — out of scope for v3 (interiors stay calm).
- The 3D object, slide deck, and page content are explicitly later phases (15-16), not this one.
</deferred>

---

*Phase: 14-branch-crimson-poster-foundation*
*Context gathered: 2026-06-18*
