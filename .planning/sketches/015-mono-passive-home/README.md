---
sketch: 015
name: mono-passive-home
question: "What does a pure black-and-white, type-only, motionless homepage feel like, and which structural register reads as 'cool and passive' rather than 'promotional'?"
winner: "E"
tags: [homepage, palette, typography, mono, v4, pinboard, terminal]
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
- **E: Synthesis ★ WINNER** — Monty picked A, then asked for two changes: keep Things I Love,
  and make the writing list a terminal-format blog. So E is A's Swiss shell throughout, with
  the writing section switched to B's terminal register and the 012/013 pinboard carried over.

## Chosen Direction (E)

Monty's call, 2026-07-20: **"I like A. I want to keep the my favorite things thing. I also
think the writings should be like just a blog terminal format."**

E resolves that as three registers doing three jobs on one page:

| Band | Register | Why |
|------|----------|-----|
| Hero + 01 Building | Swiss editorial (A) | Sets the calm, gallery-label tone. Numbered rows, hover inverts to a black block. |
| 02 Writing | Terminal (B) | The only mono-type surface on the page, so the blog reads as a **log** rather than a pitch: `~/writing`, dates left, read time right. |
| 03 Things I Love | Pinboard (012/013) | Kept intact. Scatter, drag, Shuffle, and Draw-a-card riffle-then-flip. |

**The mono translation of the pinboard.** The 012/013 board leaned on Vermilion: the card back
was Vermilion and the drop shadow was Vermilion-adjacent. With no accent, the drawn card now
flips to a **solid black back**, and category is encoded by fill weight in the card's media
area rather than by hue: Book = solid black, Film = light grey, Record = 45-degree hatch,
Hobby = empty white.

### Revision 2 (2026-07-20, Monty)

Three changes after viewing E:

1. **Writing box removed.** The 2px frame around the terminal block read as a widget bolted
   onto the page. The terminal register is now carried by the mono type and the header rule
   alone, sitting directly on the paper like every other band.
2. **Media kept.** The fill-weight treatments stay. This closes the open question above: the
   four fills read as categories, not noise, so the pure-type fallback is off the table.
3. **Pinboard organized by type.** First attempt was wrong: it replaced the board with a
   permanent four-column grid. Corrected in revision 3.

### Revision 3 (2026-07-20, Monty: "the pinboard should be very similar to the current website's")

Revision 2 invented a new board instead of matching what ships. Rebuilt against
`src/components/home/pinboard.tsx` so the sketch now mirrors production:

- **One loose scatter field**, cards started across **three horizontal lines** with seeded
  wobble (the shipped `layoutFor` behaviour), not a column grid.
- **Click a card and a note slides UP over it** — the shipped reveal, with a close button and
  an `Open ↗` link. Replaces the card-flip I had invented. This note panel is the surface that
  used to be Vermilion; it is black now.
- **Per-type card kinds**, as shipped: Book/Movie render as covers with the title over the
  artwork, YouTube as a thumbnail with a play badge, Thing as a note card, Place as a polaroid
  with a caption. Types match the real Notion select (Book, Movie, YouTube, Thing, Place).
- **Organize by topic is a button, not a layout.** The shipped board already has one; it gathers
  the scatter into tidy topic rows in Notion select-option order with a heading per row. That is
  what "organize by type" meant. Toggles back to scatter.
- **Under 760px** it degrades to a tappable stack and the toolbar hides, as shipped.

**Palette-only deltas from production**, which are the real decisions to carry into the build:
the shipped `SWATCHES` array is colored (`#8f9e86`, `#7c93a6`, `#b9805f`…) and becomes greyscale;
`.pb-frame--cream` loses its cream fill; the note panel goes from Vermilion to black. Card kinds
are told apart by shape and border weight rather than by hue.

Two small deliberate calls inside E:
- The riffle un-dims the first card immediately. Waiting for the first interval tick left the
  whole board blank for 110ms, which read as a flash rather than a shuffle.
- Card scatter uses a seeded pseudo-random function, not `Math.random()`, so the board looks
  scattered but lands identically on every reload. Easier to judge a layout that holds still.

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
