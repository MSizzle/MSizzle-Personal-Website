---
sketch: 001
name: dark-kinetic-home
question: "What does the dark, kinetic homepage feel like?"
winner: "D"
tags: [home, layout, motion, dark, hero]
---

# Sketch 001: Dark Kinetic Home

## Design Question
The aesthetic is converged (dark, brutalist-kinetic, maximalist motion, Lusion energy).
This sketch tests three *expressions* of that direction for the homepage — the page that
sets the structure, palette, and motion language for the entire site.

## How to View
```
open .planning/sketches/001-dark-kinetic-home/index.html
```
Move your mouse (cursor-reactive gradient mesh), scroll (reveals), hover the buttons
(magnetic) and list rows. Switch variants with the tabs up top.

## Variants
- **A: Liquid Hero** — Lusion-style. Giant floating gradient name, cursor-reactive mesh, cinematic
  full-bleed sections that reveal on scroll. Most "premium gallery." Roomy, atmospheric.
- **B: Brutal Grid** — Exposed grid rules, oversized uppercase type, mono labels, an index-numbered
  list with hover-invert rows, and a marquee ticker. Loudest, most "designed by a builder."
- **C: Kinetic Type** — Typography is the whole UI. Name scrambles in, roles rotate, content is a
  list of huge headlines that light up on hover. Minimal chrome, words lead.
- **D: Synthesis ★ WINNER** — A's cinematic full-bleed layout + B's brutalist uppercase
  typography (grotesk display, mono labels, outline word, index numbers, marquee). Motion is
  **autonomous, not reactive**: gradient orbs drift on their own paths, the name breathes on a loop,
  the marquee runs continuously. No cursor-following mesh, no magnetic buttons, hover is color-only.

  Refined across rounds from feedback:
  - **Hero = type left, autonomous 3D object right** (spinning cube + ring — CSS placeholder for the
    real Three.js / React-Three-Fiber object the production build would use, Lusion-style).
  - **Homepage is full-screen "slides"** (scroll-snap). Slide 1 hero → Slide 2 a B-style brutalist
    **Index** of clickable links (rows invert to white-on-black on hover, arrow appears) → Prometheus → newsletter.
  - Autonomous-only motion confirmed ("elements should move on their own, not respond to me").

## What to Look For
- Which hero makes you feel something in the first 2 seconds?
- Does the motion read as "alive" or "busy"? (maximalist was the brief — push or pull back?)
- Which structure best fits real content (essays + works + Prometheus + newsletter)?
- Palette: is the orange/violet/cyan electric accent right, or too much?
- You can cherry-pick — e.g. "A's hero + B's marquee + C's big list."

## Notes / Tradeoffs
- These fake the Lusion feel with CSS (gradient mesh, grain, lerped cursor). The real build would
  use motion/react + Lenis (already in the stack); true WebGL is possible but fights the perf budget
  (LCP/PSI gates). Decide how far to push once a direction wins.
