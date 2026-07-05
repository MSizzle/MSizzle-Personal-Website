---
sketch: 008
name: alive-photo-home
question: "With variant C chosen, how alive can the homepage feel through bigger photos + non-mouse motion?"
winner: null
tags: [home, photography, motion, scroll, parallax, ambient, non-mouse, ink-cobalt]
---

# Sketch 008: Alive Photo Homepage

## Design Question
007 landed on C (photos woven through). Feedback: make the photos **bigger** and the
page feel **more alive** — through layout and motion, **without leaning on the mouse**.
So all motion here is scroll-triggered or ambient (runs on its own). No cursor-follow,
no magnetic hover. This matches the project's locked motion rule.

Three variants = a spectrum of "how much motion," same content + Ink & Cobalt palette.

## How to View
open .planning/sketches/008-alive-photo-home/index.html

Tabs switch variants. Toolbar (bottom-right): phone/tablet/full width, and a
**motion on/off** toggle so you can feel each one with and without animation.
(`prefers-reduced-motion` is also honored automatically.)

## Variants
- **1 · Editorial reveal (calm-alive)** — big full-width photos; everything fades/rises
  in as it enters view; headline words stagger up on load; photos hold a slow ken-burns
  drift; a cobalt spine draws itself down the page as you scroll. Premium, unhurried.
- **2 · Cinematic parallax + pinned work** — hero portrait parallaxes slower than the
  page; the Work section **pins** and the big image crossfades between projects as you
  scroll through it (captions + dots advance); Loves photos parallax at different speeds.
  All driven by scroll position.
- **3 · Kinetic ambient (liveliest)** — alive even when still: the portrait "breathes,"
  a cobalt glow drifts behind the hero, a type ticker runs, and Things-I-Love is an
  **infinite photo marquee** sliding sideways forever. Boldest, most energetic.

## What to Look For
- Which level of motion feels like *you* — restrained, cinematic, or kinetic?
- Photos are much larger now — too much, or right?
- Toggle motion **off**: does the layout still hold as a static page? (it must)
- Phone width: does the pinned scroll (V2) / marquee (V3) still behave?
- Is the cobalt accent doing enough, or should motion carry more of the "alive"?

## Notes
- Motion primitives are labeled in CSS: reveal, ken-burns, self-drawing line, word
  stagger, breathe, drifting blob, marquee — mix-and-match for the real build.
- Real build maps cleanly: IntersectionObserver reveals + CSS keyframes cover 1 & 3;
  V2's parallax/pin is the one that would want Lenis/GSAP ScrollTrigger and a perf check.
- Placeholders are duotone blocks; swap real photos to judge final density.
