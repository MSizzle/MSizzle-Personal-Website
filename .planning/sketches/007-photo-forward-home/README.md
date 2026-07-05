---
sketch: 007
name: photo-forward-home
question: "How much should photography drive the homepage, and where do photos land?"
winner: "C"
tags: [home, photography, hero, editorial, ink-cobalt, portrait]
---

# Sketch 007: Photo-forward Homepage

## Design Question
The current homepage (`explorative-homepage.tsx`) is entirely type-driven — "Create
Order from Chaos" set huge, then text sections. It reads plain. How far should
photography drive the page, and where does imagery actually land?

Same content and Ink & Cobalt palette across all three so the only variable is
**how much the photos lead**. All photos are labeled placeholder blocks — captions
say what image goes there so you can source/shoot later.

## How to View
open .planning/sketches/007-photo-forward-home/index.html

Use the tab bar (top) to switch variants and the toolbar (bottom-right) to preview
phone / tablet / full widths.

## Variants
- **A: Image-led hero** — one full-bleed portrait fills the first screen, duotone
  ink+cobalt wash keeps the white type legible; "Create Order from Chaos" sits
  bottom-left. Boldest and most magazine-cover. Lives or dies on one strong photo.
- **B: Split portrait + type** — hero splits in two: the headline copy on the left,
  a tall 4:5 editorial portrait on the right. Balanced and credible; type still leads
  but a real face grounds it immediately.
- **C: Photos woven through** — keeps the type hero (with a small round headshot
  accent) and seeds imagery into every section below: a wide Prometheus shot under
  Building, a real cover grid for Work, a photo strip for Things I Love. Least
  disruptive to what's shipped, most photos overall.

## What to Look For
- Which hero makes you feel "this is a person" fastest?
- Does the full-bleed (A) feel bold or risky given the photo you'd actually have?
- In C, do the section photos add life or clutter?
- Does the cobalt accent still read against photography, or fight it?
- How does each hold up at phone width (toolbar → phone)?

## Notes
- Palette: `themes/ink-cobalt.css` (mirrors the real `globals.css` v3 tokens).
- Placeholder blocks are duotone/hatched on purpose — swap for real photos to judge final feel.
- Content matches the live arc: Building → Work → Things I Love → Writing/Newsletter → Footer.
