---
sketch: 004
name: explorative-scroll-story
question: "Does the explorative scroll-story flow (rotating pixel-avatar on a podium → fluid interweaving line → 3D horse → YouTube zoom-through into the newsletter) feel cinematic and 'wandering' enough to be the homepage spine?"
winner: null
tags: [home, scroll-story, 3d, hologram, fluid-line, youtube, zoom-transition, prototype, palette-revisit]
---

# Sketch 004: Explorative Scroll Story

## Design Question
A narrative prototype of the full "explorative, cool" homepage Monty described — does the beat-by-beat scroll story hold together as a single wander? It strings the set-pieces into one flow rather than comparing layouts.

## The Beats
1. **Hero** — "MONTY SINGER" + short bio, with a rotating **pixel-avatar on a podium** (360° hologram).
2. **Scroll cue** — as you scroll, the hologram **scales down + drifts** and the line spills out, pulling you down.
3. **Fluid line** — the thread becomes a flowing, animated wave that gets more expressive (higher amplitude) the further you go, interweaving past sections.
4. **Building** — big-list (Projects / Writing / Doing).
5. **3D horse** — a "just rad" moment with a rotating horse.
6. **Writing** — notes & essays.
7. **Watching (YouTube)** — videos scroll **sideways** (scroll-pinned), then the last tile **zooms to fill the screen and we "scroll into" it**, and the **newsletter emerges from inside** the zoom.
8. **Footer** — links, end of the wander.

## How to View
```
open .planning/sketches/004-explorative-scroll-story/index.html
```
Scroll **slowly**. The Watching section is a tall pinned runway — keep scrolling through the sideways gallery to trigger the zoom-through. Toolbar (bottom-right): swap theme, and toggle the zoom ending style.

## What's real vs faked
- **Faked for feel (CSS transforms / placeholders):** the pixel-avatar (emoji placeholder spinning via `rotateY`), the 3D horse (emoji placeholder). Real build → **Three.js / GLTF models**.
- **Actually engineered:** the scroll-cue hero transform, the animated **fluid line**, and the **YouTube horizontal-scroll → zoom-through → reveal** transition (the novel mechanic).

## What to Look For
- Does the **hero → scroll-cue → line** handoff feel inviting, or gimmicky?
- Is the **fluid line** an asset or noise? Right amount of motion?
- Does the **YouTube zoom-through** land — does it feel like you travel *into* the video and something new comes out? Tile-zoom vs button-zoom (toolbar toggle) — which reads better?
- Pacing: too much happening, or genuinely explorative?
- Where does the **3D horse** belong narratively (standalone "rad" beat vs tied to a section)?

## Open Questions / Decisions Needed
- **Assets:** is there a real pixelated avatar of Monty + a horse model, or do we source/commission them?
- **Hologram tint:** kept on-palette (off-white scanlines + crimson glow). A cool cyan hologram would pop more but breaks "crimson is the only accent" — worth a variant?
- **Perf/mobile:** multiple 3D models + scroll-jacking is heavy; needs a reduced-motion + touch fallback (native scroll, static frames). Not sketched here.
- Builds on the near-black / off-white / crimson-accent palette from `themes/crimson-line.css` (still revisiting the LOCKED "Crimson Poster" palette — see MANIFEST "Pending Revisits").
