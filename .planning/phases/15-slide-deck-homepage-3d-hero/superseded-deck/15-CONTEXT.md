# Phase 15: Slide-Deck Homepage & 3D Hero - Context

**Gathered:** 2026-06-18
**Status:** Ready for planning

<domain>
## Phase Boundary

Rebuild the prototype homepage (`.planning/sketches/002-full-site-model/index.html`) as a real
Next.js full-page wheel-driven slide deck (CHOMP controller) plus a lazy-loaded, morphing R3F 3D
hero object, on top of the Phase 14 "Crimson Poster" tokens and v3 primitives. Delivers HD-01..05
(the deck + nav/fallback) and TD-01..03 (the 3D object). Interior pages, Notion-sourced content,
and the new /uses + /watching pages are Phase 16 — NOT this phase. The homepage slide copy is
static editorial content, not Notion.

</domain>

<decisions>
## Implementation Decisions

### 3D rendering stack
- **D-01:** Build the hero object with **React-Three-Fiber** — install `@react-three/fiber` +
  `three` (newest stable; note the prototype uses three r128 with the deprecated `sRGBEncoding` /
  `outputEncoding` API — use the current `outputColorSpace` / `SRGBColorSpace` equivalents). Rebuild
  the blob as a declarative R3F component and run the per-frame geometry morph in a `useFrame` loop.
  Satisfies TD-01.
- **D-02:** Do NOT add `@react-three/drei` unless a specific helper is actually needed. Start
  minimal (fiber + three); add drei only if it earns its bundle weight.
- **D-03:** Port the prototype's blob behavior (`site.js` `initBlob`) as the functional reference:
  IcosahedronGeometry base, sine-sum vertex displacement morph, slow autonomous rotation, key/rim/
  fill/ambient light rig, `MeshStandardMaterial` near-black + crimson rim light, `pixelRatio` capped
  at 2, ACES tone mapping. Use these as the starting point, not a verbatim copy (see D-04).

### 3D object fidelity & art direction
- **D-04:** **Elevate material & lighting** beyond the prototype while keeping the blob silhouette
  and morph. Graphics are the #1 priority for this milestone (carried from Phase 14). Target a
  hero-grade look: glossier near-black material, a stronger/cleaner crimson rim, refined lighting and
  tone mapping. Keep the form (morphing blob) and the autonomous motion — elevate the *quality*, not
  the shape.
- **D-05:** **Lusion (lusion.co) is the aspirational quality bar** for material/lighting/depth/
  cinematic feel — but **motion stays autonomous**. NO cursor-follow, magnetic, or pointer-driven
  deformation. This upholds the locked sketch-001 motion rule ("things move on their own; hover =
  color only") and the perf/reduced-motion budget. Chase Lusion's *look*, not its *interactivity*.

### Deck behavior (locked by prototype — implementation notes)
- **D-06:** Port the CHOMP deck controller from `site.js` `deckInit` faithfully: one gesture = one
  slide; fresh-gesture detection (pause >110ms OR direction change OR `adel > wAbs*1.25+2`
  re-acceleration); 820ms lock over an 800ms easeInOutCubic tween; direction reversals bypass the
  lock; static atmosphere/object behind a scrolling `#scroller`; keyboard (arrows/space/PageUp-Down/
  Home/End), touch swipe (>28px threshold), and right-side progress dots; scrollbar-drag re-sync.
  This is a "use client" controller.
- **D-07:** On every slide change the object replays its entrance: spawn in the right portion, fly in
  from the left, settle right (the prototype's `objEnter`, ~1s cubic-bezier transform on the object
  wrapper). Contained entrance, not a full-screen traverse.

### Fallback & accessibility
- **D-08:** The no-WebGL / reduced-motion static fallback for the object is a **pre-rendered poster
  image** (PNG/WebP still render of the elevated blob) shown in the object's slot. Closest to the
  real look, zero runtime GPU/JS cost, keeps the composition intact. The planner decides how the
  poster is produced (one-time render/screenshot committed as a static asset).
- **D-09:** Under `prefers-reduced-motion` on desktop, the homepage **falls back to native vertical
  scroll** — the same path as mobile/touch (HD-05): no wheel controller, no tween, no object fly-in,
  poster fallback shown. Simplest and most accessible; content reads as a normal page. (So the
  native-scroll fallback is triggered by BOTH small/touch screens AND reduced-motion.)

### Content
- **D-10:** Homepage slide copy is **static, matched to the prototype** — 5 slides: (1) hero
  (oversized filled+outline name, sub-roles, CTAs, scroll cue), (2) brutalist big-type index
  ("What I'm Building / Writing / Doing" → Works / Writing / Prometheus, HD-04), (3) Prometheus,
  (4) Monty Monthly newsletter, (5) footer-as-last-slide. Hardcoded JSX using Phase 14 v3 primitives,
  not Notion-sourced.

### Claude's Discretion
- Lazy-load mechanics for the object so it stays off the LCP path (TD-03 / DQ-03): e.g. `next/dynamic`
  with `ssr:false`, mounting after first paint / idle / when the canvas slot is ready. Planner chooses
  the exact trigger; the constraint is "must not regress LCP."
- File organization (where the deck controller, object component, slide sections, and poster asset
  live), hook vs. component boundaries, and how WebGL support / reduced-motion / touch are detected.
- Exact elevated material/light parameter values (D-04) — tune to taste against the Lusion bar.
- Whether to reuse any Phase 14 motion/provider plumbing (Lenis/Motion) or keep the deck controller
  self-contained (note: Lenis smooth-scroll likely conflicts with the deck's own scroll control on
  the homepage — planner should reconcile).

</decisions>

<canonical_refs>
## Canonical References

**Downstream agents MUST read these before planning or implementing.**

### Prototype — source of truth (port from these)
- `.planning/sketches/002-full-site-model/index.html` — the homepage markup: 5-slide structure,
  `#objstage`/`.objwrap`/`#webgl` object stage, `#scroller`, hero/index/Prometheus/newsletter/footer
  slides.
- `.planning/sketches/002-full-site-model/assets/site.js` — `initBlob()` (the 3D blob: geometry,
  morph, lights, material) and `deckInit()` (the CHOMP wheel-deck controller + `objEnter` entrance).
  The functional spec for D-01..D-07.
- `.planning/sketches/002-full-site-model/assets/site.css` — object stage / `.objwrap` / deck-slide /
  deck-dots / hero-grid / home-name / big-list styling.
- `.planning/sketches/002-full-site-model/README.md` §"Home Slide Deck (CHOMP-style)" — the deck
  mechanic notes and CHOMP provenance.
- `.planning/sketches/themes/default.css` — Crimson Poster token values (kept; Phase 14 already
  ported these into `globals.css`).
- `.planning/sketches/MANIFEST.md` — locked design decisions (palette, autonomous-motion rule,
  Lusion as primary reference).

### Phase 14 foundation (build on these — already shipped)
- `src/components/v3/*` — the v3 primitives to compose the slides (`big-list.tsx`, `button.tsx`,
  `page-hero.tsx`, `section-label.tsx`, `marquee.tsx`, `reveal.tsx`, `rule.tsx`, etc.).
- `src/app/globals.css` — the Crimson Poster `@theme` tokens, type scale, `--sig` / `--sig-shadow`.
- `src/app/layout.tsx` — Space Grotesk + JetBrains Mono `next/font` wiring; provider hierarchy.
- `src/app/v3-specimen/page.tsx` — how the v3 primitives are currently exercised/showcased.
- `.planning/phases/14-branch-crimson-poster-foundation/14-CONTEXT.md` — token/primitive decisions
  and the "graphics are the priority" flag carried into this phase.

### External reference
- https://lusion.co/ — aspirational bar for the 3D object's material/lighting/depth quality
  (look only; NOT its cursor-reactive interactivity — see D-05).

### Milestone-level
- `.planning/REQUIREMENTS.md` — HD-01..HD-05, TD-01..TD-03 (this phase), plus DS-05 (reduced-motion)
  and DQ-03 (mobile perf / no LCP regression) constraints that bound it.
- `.planning/ROADMAP.md` §"Phase 15" — goal + success criteria.

</canonical_refs>

<code_context>
## Existing Code Insights

### Reusable Assets
- Phase 14 shipped the full v3 primitive set under `src/components/v3/` — the slides should be
  composed from these (`big-list` for slide 2's index, `button`, `section-label`, `reveal`, etc.)
  rather than re-styling from scratch.
- Crimson Poster tokens, type scale, and the signature display treatment (`--sig` / `--sig-shadow`)
  are already live in `globals.css` — the hero name and big-type index inherit them.
- `next/font` display/mono families are wired in `layout.tsx`.

### Established Patterns
- Single global stylesheet + Tailwind v4 utilities; small presentational `.tsx` components under
  `src/components/`.
- Provider hierarchy ThemeProvider > LenisProvider > MotionProvider. **Watch-out:** the LenisProvider
  smooth-scroll will likely fight the deck's own `#scroller` scroll control on the homepage — the
  homepage deck needs to own scroll (disable/scope Lenis for `/`).
- `three` / `@react-three/fiber` are NOT yet installed — this phase adds the first WebGL dependency.

### Integration Points
- The homepage route is `src/app/page.tsx` (currently the v2 editorial home) — this phase replaces
  it with the deck. Keep production untouched (still on the `v3` preview branch per Phase 14 D-02).
- The object is mounted only on the homepage and must be code-split so it never loads on other routes
  or on the LCP path.

</code_context>

<specifics>
## Specific Ideas

- **Graphics are the #1 priority** (carried from Phase 14): the 3D hero object's form, material, and
  motion are the highest-value deliverable. Spend the fidelity budget here.
- **Lusion (lusion.co)** is the user's stated love and the quality bar — premium, glossy, cinematic,
  deep. Match that *look* with autonomous motion only (no cursor reactivity — D-05).
- Match the prototype as the source of truth for the deck mechanic and slide layout; elevate only the
  object's material/lighting.

</specifics>

<deferred>
## Deferred Ideas

- Cursor-reactive / pointer-driven 3D interactivity (full Lusion-style) — explicitly rejected for v3
  to preserve the locked autonomous-motion rule; could be revisited in a future milestone.
- Bespoke per-slide motion on interior pages — out of scope (interiors stay calm for v3).
- New /uses and /watching pages, and all interior pages on Notion data — Phase 16.
- Real YouTube thumbnails/oEmbed for /watching — future iteration.

</deferred>

---

*Phase: 15-slide-deck-homepage-3d-hero*
*Context gathered: 2026-06-18*
</content>
</invoke>
