---
sketch: 010
name: structured-bands-carousel
question: "Can the photo-forward home read as structured and professional — alternating bands, hard boxes, serious type, a writing carousel?"
winner: "★ locked — full-page spec"
tags: [home, photography, editorial, bands, dark-light, hard-corners, hanken, vermilion, carousel, sticky-nav, footer]
---

# Sketch 010: Structured Bands + Carousel  ★ WINNER / SPEC

The consolidated homepage direction. Built up across rounds 007→011; this file is the
reference for the real build.

## How to View
open .planning/sketches/010-structured-bands-carousel/index.html

Bottom-right toolbar: color swatches, type + weight, viewport, motion on/off.

## Locked Decisions
- **Structure:** full-page, single column of **alternating light/dark bands** —
  hero (light) → credibility strip (light) → Building (dark) → Work (light) →
  Things I Love (dark) → Writing (light) → footer (dark).
- **Hero:** big two-line headline, "**Create Order**" in a **solid vermilion marker
  block** hugging the glyphs, "from Chaos" in ink. Large portrait column (44% width).
  Black **status tag** ("Currently — building Prometheus"). A full-bleed **black
  marquee strip** of section links pinned to the base of the hero viewport.
- **Type:** **Hanken Grotesk 800** for display (serious, substantial, not thin/playful).
  Body + labels Hanken. (Switcher keeps Archivo Exp / Familjen / Archivo for reference.)
- **Accent:** **Vermilion `#e5411f`** (chosen over cobalt for contrast/warmth). Used on
  the marker block, links, index numbers, CTAs, photo hatch.
- **Corners:** hard (radius 0) everywhere — photos, cards, buttons, boxes.
- **Structure devices:** section **rail boxes** (index number + label in an
  auto-inverting high-contrast box), the marker block, black status/avail tags.
- **Photos:** large; scroll-triggered **slide-in from the side** (alternating L/R),
  settling with an **even black drop-shadow** (not the earlier angled frame). Ken-burns
  drift + hero portrait "breathes."
- **Writing:** a horizontal **Monty Monthly carousel** (issue cards + a subscribe card;
  arrows + dots + scroll-snap). Newsletter = link-out to Substack, no on-site email capture.
- **Professional layer:** sticky mini-nav w/ persistent Subscribe CTA (appears past hero),
  "as seen in" **credibility strip** (placeholder logos), multi-column **footer**
  (colophon / navigate / elsewhere) + "Available for select work" tag.
- **Motion:** scroll-triggered + ambient only — **no cursor dependence**;
  `prefers-reduced-motion` honored; motion on/off toggle proves the static layout holds.

## Open / Deferred
- Real **photography** (portrait + product + candids) replaces the labeled placeholders.
- Real **logos** for the credibility strip (or cut it).
- Optional next levers discussed, not applied: exposed grid lines, unified photo grading,
  project metadata rows, case-study depth, headline UPPERCASE variant.
- Perf note for the real build: reveals/ken-burns/marquee are cheap (IO + CSS). The
  carousel is native scroll-snap. Nothing here needs the heavy WebGL/Lenis stack.
