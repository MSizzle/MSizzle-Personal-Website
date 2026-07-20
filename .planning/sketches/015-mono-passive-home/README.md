---
sketch: 015
name: mono-passive-home
question: "What does a pure black-and-white, type-only, motionless homepage feel like, and which structural register reads as 'cool and passive' rather than 'promotional'?"
winner: null
tags: [homepage, palette, typography, mono, v4]
---

# Sketch 015: Mono Passive Home

## Design Question

The shipped homepage (sketch 010, phase 17.4) is loud-founder: a solid Vermilion marker
block reading "Create Order from Chaos", a 44%-width rotating portrait carousel, a pulsing
status dot, a scrolling link marquee, and alternating light/dark bands. Monty's read:
too much "look at me."

The v4 brief, locked 2026-07-20:

- **Palette:** pure black and white, **zero accent**. No orange, no clay, no cream.
- **Hero:** no photos at all. Type only. Photos survive deeper in the page.
- **Motion:** cut the marquee, the pulsing dot, the ken-burns, the slide-ins, and the
  light/dark band slam. Keep only a slow opacity fade on scroll.
- **Core action:** read and browse. Subscribe demoted to a quiet footer line.

That settles the *rules* but not the *register*. Four registers can all obey those rules
and feel completely different. This sketch builds all four so the difference is felt, not
argued.

## How to View

```
open .planning/sketches/015-mono-passive-home/index.html
```

## Variants

- **A: Swiss editorial index** — rigid grid, numbered rows (001, 002, 003), tracked-out mono
  labels, generous whitespace. Hover inverts the whole row to a black block. Reads like a
  gallery wall label or an art-book colophon.
- **B: Terminal readout** — mono throughout, `status` / `writes` / `before` key-value lines,
  bracketed section headers, a blinking cursor. Cold and technical, a machine printing facts
  rather than a person selling.
- **C: Oversized type, near-empty page** — one enormous sentence per near-full screen, black on
  white, almost nothing else. Confidence through restraint at magazine-cover scale.
- **D: Dense archive listing** — no hero at all. The page opens straight into a compact,
  scannable index of everything, like a filesystem or a library catalogue.

## What to Look For

1. **Does mono actually feel cooler, or just unfinished?** Vermilion was doing real
   structural work. Watch whether the hairline rules and mono labels carry that load, or
   whether the page reads as a stylesheet that failed to load. This is the sketch's main risk.
2. **Passive vs cold.** A and C still say something about Monty. B and D make you dig for it.
   Which side of "just a bit about me" lands, and which tips into unwelcoming?
3. **Inversion as the hover language.** Every variant uses black-block inversion instead of an
   accent color. Compare A's full-row invert against D's tight-row invert. One may read as a
   glitch at speed.
4. **Whether losing the hero (D) is freeing or disorienting.** D has no "who am I" moment.
5. **Scale of the fade.** All motion is one slow opacity fade-up. Check it is still perceptible
   without feeling like a page that is loading slowly.
6. **Mobile.** Resize to 375 with the toolbar. A's four-column rows and D's dense grid both
   collapse; verify they collapse gracefully rather than merely fitting.

## Notes

- Theme lives at `../themes/mono.css`. It deliberately defines **no `--color-accent`** so any
  variant that secretly needs one will visibly break.
- The toolbar theme switcher can load the old hued themes (`ember`, `ink-cobalt`, `halogen`)
  over these layouts. Useful as a control: if a layout only works with a hue reintroduced,
  it is not really a mono design.
- Fonts match what already ships via `next/font`: Hanken Grotesk + JetBrains Mono. Hanken
  Grotesk 800 survives the v4 change; only the accent and the photo-forward hero are dead.
- Variant B's terminal cursor is **static, not blinking**. A perpetual blink is the same
  attention-grab as the pulsing status dot the v4 lock cut, so it was removed on principle.
  If B wins and the cursor feels dead without it, that is a deliberate revisit.
- `preview-a-swiss.png` is a full-page capture of variant A. B, C and D have no captures:
  the screenshot backend wedged mid-session. They were instead verified structurally in the
  DOM (no horizontal overflow, no zero-height links, no `--color-accent` defined in any
  variant). Open the file in a browser to actually judge them.
- Content is real where known (Prometheus, Monty Monthly, CULTIVATE, the three essay titles
  from the repo root). Item counts are marked `placeholder count` and Monty's location is
  omitted rather than guessed.
