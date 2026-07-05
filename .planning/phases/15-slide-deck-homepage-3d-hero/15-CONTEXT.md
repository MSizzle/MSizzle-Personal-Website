# Phase 15: WebGL Explorative Homepage - Context

**Gathered:** 2026-06-19
**Status:** Ready for planning

<domain>
## Phase Boundary

Deliver the homepage as an expansive, Lusion-grade WebGL "explorative scroll-story" — a real-time 3D hero, themed section beats you wander down, with a progressive path toward a fluid interweaving line and a YouTube zoom-through. Replaces the superseded slide deck. Presentation-layer only; all existing infra (Notion pipeline, SEO, analytics, image proxy, RSS) stays untouched. Interior-page Notion wiring is Phase 16, not here.

</domain>

<decisions>
## Implementation Decisions

> Locked items come from sketches 003–005, perf spike 001, and the user's discuss picks. Items marked **(REC)** are my recommended defaults captured because the user stepped away mid-discussion to clear context — confirm or adjust at plan time; they are sensible defaults, not hard locks.

### Locked direction (from discovery — do NOT re-litigate)
- **D-01:** Palette = near-black `#0a0a0a` canvas, off-white `#f5f5f0` name, crimson `#e23838` as a sparing accent only (line/rim/hover). NO red-on-red. Theme reference: `.planning/sketches/themes/crimson-line.css`.
- **D-02:** Real WebGL hero (three + R3F + @react-three/postprocessing): PBR/clearcoat, RoomEnvironment IBL, crimson rim light, bloom (+ optional grain/vignette, trimmed).
- **D-03:** Perf cuts (spike 001, non-negotiable): desktop-only WebGL; canvas `dynamic({ssr:false})` inside a `"use client"` loader (Next 16 requirement); mount canvas AFTER LCP (idle/IntersectionObserver); LCP = SSR'd text/poster, never the canvas; GPU vertex-shader morph (no per-frame JS `computeVertexNormals`); trim/lazy postprocessing.
- **D-04:** Mobile / pointer:coarse / small-screen / reduced-motion / no-WebGL2 → static poster `public/hero-blob-poster.webp` (no canvas). Reuse `FallbackPoster` + WebGL2 detection.

### v1 slice / scope  (REC — the incremental build order)
- **D-05 (REC):** Ship **hero-first, incrementally**, not all at once:
  - **v1 (this build):** WebGL hero (procedural stand-in) + scroll-cue + the expansive section beats (real homepage content) + the mobile/fallback poster path. This is a complete, shippable homepage.
  - **v2:** the fluid interweaving line.
  - **v3:** the "Watching"/YouTube gallery + zoom-through transition.
  - **swap-in:** real voxel-Monty + horse GLB models replace the procedural object whenever the asset workstream delivers (pipeline built to receive them).
- **D-06 (REC):** "Wandering" feel in v1 comes from generous negative space + expansive scroll + the live hero; the line and zoom-through are progressive enhancements, not v1 blockers.

### Hero object for v1  (REC)
- **D-07 (REC):** Reuse the existing `HeroBlob` morphing blob as the procedural stand-in (migrated to GPU vertex-shader displacement per D-03).
- **D-08 (REC):** Frame it on a simple **podium** now (cheap; sells the "figure on a podium" composition for when voxel-Monty arrives).
- **D-09 (REC):** Include the **scroll-cue** in v1 (object scales / camera dollies on scroll via Lenis).

### Fluid line: when + how  (REC)
- **D-10 (REC):** **Defer the fluid line to v2** (keep v1 focused on hero + content + perf).
- **D-11 (REC):** Start v2 with an **SVG-overlay** line (light, proven in sketch 003); only escalate to an in-canvas WebGL shader line if it needs to feel richer.

### Homepage content + structure  (REC)
- **D-12 (REC):** Section beats: **Building** (big-list → /projects, /writing, prometheus.today), **Writing** (recent essays), **Newsletter**, **Footer** as the final beat. "Watching" gallery lands with v3.
- **D-13 (REC):** Homepage content is **static/curated** in v1 (as the deck did); Notion-wiring of pages is Phase 16. Homepage may pull from Notion later if desired.
- **D-14 (REC):** Include a **minimal, lightweight header/nav** to interior pages; footer present as the closing scroll beat. (The deck suppressed the shared `InkFooter` on `/`; revisit whether the homepage gets its own footer-beat vs the shared footer.)

### Assets (voxel-Monty + horse) — LOCKED by user pick
- **D-15:** **Parallel, non-blocking.** Start sourcing/generating the GLB models as a separate workstream now; v1 ships on the procedural stand-in and swaps real models in when ready. Never block v1 on assets.

### Claude's Discretion
- Exact component structure, R3F scene graph, postprocessing pass selection/tuning, scroll-cue easing, and how `useLenisControl` integrates — planner/executor decide within D-01..D-15.
</decisions>

<canonical_refs>
## Canonical References

**Downstream agents MUST read these before planning or implementing.**

### Design direction (validated)
- `.planning/sketches/MANIFEST.md` — "Validated Direction (2026-06-18)" section + sketch verdicts.
- `.planning/sketches/005-webgl-hero-fidelity/` — the approved fidelity ceiling (real WebGL recipe).
- `.planning/sketches/004-explorative-scroll-story/` — the full explorative flow (hero podium → line → horse → YouTube zoom-through).
- `.planning/sketches/003-guided-line-home/` — the guided-line concept + `themes/crimson-line.css` palette.

### Feasibility / perf (non-negotiable constraints)
- `.planning/spikes/001-webgl-homepage-perf/README.md` — GO-WITH-CUTS verdict + measured numbers.
- `.planning/spikes/CONVENTIONS.md` — Next 16 dynamic ssr:false rule, desktop-only WebGL, GPU morph, measurement methods.
- `.planning/spikes/MANIFEST.md` — Requirements (non-negotiable build constraints).

### Reusable code (from the superseded deck — carry forward)
- `src/components/home-deck/hero-blob.tsx`, `hero-blob-canvas.tsx`, `fallback-poster.tsx` — reuse.
- `src/components/home-deck/deck-homepage.tsx` — WebGL2 detection (`failIfMajorPerformanceCaveat`) + the `(pointer:coarse)||innerWidth<760` gate to reuse.
- `.planning/phases/15-slide-deck-homepage-3d-hero/superseded-deck/` — full deck attempt (reference only).

### Memory
- `homepage-webgl-direction`, `nextjs16-dynamic-ssr-false`, `nextjs16-fetchpriority-quirk` (LCP fetchPriority).

</canonical_refs>

<code_context>
## Reusable Assets & Patterns
- **R3F primitives exist** (Phase 15 deck): `HeroBlob` (displaced PBR/clearcoat blob + RoomEnvironment IBL + crimson rim), `HeroBlobCanvas` (Canvas + light rig), `FallbackPoster`.
- **Deps already installed:** `three@0.184`, `@react-three/fiber@9.6`, `lenis@1.3`. NEW dep needed: `@react-three/postprocessing` (+ `postprocessing`).
- **Stack reality:** Next.js 16.2.1 (Turbopack), React 19, Tailwind v4 — NOT 15.x as CLAUDE.md states.
- **Still missing:** `public/hero-blob-poster.webp` (mobile + fallback hero) — must be produced during the build (capture from the v1 hero).
- **Experimental spike code:** throwaway branch `spike/webgl-perf` (a working /spike-webgl route with postprocessing + Lenis + fallback) — reference for the real implementation; unmerged.
</code_context>

<deferred>
## Deferred Ideas (future builds / phases)
- Fluid interweaving line (v2).
- "Watching"/YouTube gallery + zoom-through transition (v3) — note `/watching` page is itself Phase 16.
- Real voxel-Monty + horse GLB models (swap-in when asset workstream delivers).
- Cyan/cool hologram tint variant (rejected for now to keep crimson the only accent).
</deferred>
