# Phase 15 (WebGL Explorative Homepage) — Discussion Log

**Date:** 2026-06-19 (re-scope discussion; supersedes the deck-era log archived in `superseded-deck/`)

## Context
Phase 15 re-scoped from the CHOMP slide deck to a WebGL explorative homepage after the user reviewed sketches 003–005 and the perf spike (001). Most direction was already validated in those artifacts; this discussion focused on the v1 slice and a few open build choices.

## Areas selected to discuss
User selected all four offered gray areas: v1 slice/scope, hero object for v1, fluid line timing+approach, homepage content+structure. Plus the asset-handling question.

## Outcomes
- **Assets:** user picked **Parallel, non-blocking** — source models as a separate workstream; v1 ships on the procedural stand-in (→ D-15).
- The four selected areas were **not deep-dived turn-by-turn** — user said "prepare to clear" mid-discussion. Claude captured **recommended defaults** for all four (D-05..D-14, marked **(REC)** in CONTEXT.md) so the phase is plan-ready; these are to be confirmed/adjusted at plan time.

## Key recommended decisions (see CONTEXT.md for full)
- v1 = hero (procedural stand-in) + scroll-cue + section beats + fallback poster; fluid line = v2; YouTube zoom-through = v3; real models swap in later.
- Hero = reuse `HeroBlob` on a simple podium, GPU-morph, scroll-cue in v1.
- Fluid line deferred to v2, SVG-overlay first.
- Content static/curated in v1 (Notion wiring is Phase 16); minimal header/nav + footer beat.

## Deferred
Fluid line (v2), Watching/YouTube zoom-through (v3), real GLB models, cyan hologram variant.
