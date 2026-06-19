---
sketch: 003
name: guided-line-home
question: "Does a self-drawing guided line + near-black/off-white palette make the homepage feel expansive and 'wandering' while fixing the red-on-red legibility problem?"
winner: null
tags: [home, line, scroll, dark, crimson-accent, legibility, palette-revisit]
---

# Sketch 003: Guided Line Home

## Design Question
Pivot away from the CHOMP slide deck (Phase 15) toward an expansive, wandering homepage built around a **guided drawing line** — a crimson SVG path that self-draws as you scroll and threads the hero name down through each section. Simultaneously fix the **red-on-red legibility** problem: the name goes off-white on near-black, and crimson is demoted to a sparing accent (the line, node dots, link hover) — never the name, never a large fill.

> ⚠️ **Revisits a LOCKED decision.** MANIFEST "Locked Decisions (from 001)" locked the **Crimson Poster** palette (crimson background, crimson display type). This sketch deliberately inverts that (near-black canvas) because the locked palette is the source of the red-on-red pain. If a variant wins, the locked palette + the slide-deck structure both need updating.

## How to View
```
open .planning/sketches/003-guided-line-home/index.html
```
Scroll slowly and watch the line draw + the traveling crimson marker. Switch variants with the top tabs; switch palettes with the bottom-right toolbar (try `nocturne` vs `crimson-line`).

## Variants
- **A: Centered spine** — one mostly-vertical line through node dots at left-center; content to its right; blob fixed far right. Closest to the picked reference preview.
- **B: Meander** — the line bends in S-curves, sections alternate left/right and sit at the bends. The most literally "wandering" feel.
- **C: Left rail + branches** — a thin line pinned to the left margin with short crimson offshoot ticks to each big-list section. Editorial / brutalist.

## What to Look For
- Does the **self-drawing line** read as a guiding thread, or as decoration? Is the traveling marker helpful or distracting?
- **Legibility:** is the off-white MONTY clearly the hero now, with crimson reading as an accent rather than the field?
- **Expansiveness:** does the negative space + section rhythm feel like wandering, or just empty?
- **Blob:** does the dark glossy blob still belong in this calmer layout, and where (right vs center-right)?
- Which line geometry (spine / meander / rail) best fits Monty's content?

## Notes
- Throwaway HTML. The blob is a CSS/SVG fake (the real build keeps the Three.js/R3F blob from Phase 15).
- The line is built from the **real DOM positions** of `.node` anchors, so it genuinely connects sections and re-fits on resize/viewport change.
- Reduced-motion / touch fallback (native scroll, static poster) is a real-build concern, not sketched here.
