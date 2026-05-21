# Handoff: montysinger.com Redesign — v1 (Editorial Minimal)

## Overview

A homepage and sub-pages redesign for **montysinger.com**, a personal site for Monty Singer (founder of Prometheus, writer, builder). The current site is over-animated and visually noisy: auto-scrolling photo carousels, rotating taglines, hover-triggered scrollers, three independent animation loops on the homepage at once.

The redesign is the opposite. It is a **subtraction**, not an addition. Vanschneider-inspired editorial spine, but more minimal: one typeface family, two weights, monochrome warm-paper palette, one signature interaction on the homepage, no carousels, no auto-scrollers, generous whitespace.

The brief in one sentence: *"a calling card from someone who builds polished software but doesn't need to prove it with motion."*

---

## About the Design Files

The files in this bundle are **design references created in HTML/JSX**. They are prototypes that show the intended look and behavior — they are not production code to copy line-for-line.

The task is to **recreate these designs in the existing montysinger.com codebase**, using its established patterns and libraries. Match the visual fidelity (typography, spacing, hierarchy, color, hover behavior, motion budget) — but write the code in the project's idiomatic Next.js + Tailwind + Motion style. Don't drag in `<script type="text/babel">` or inline-style React from the references.

Two stylistically different directions were explored in conversation; **v1 (this bundle) is the locked direction.** v2 has been discarded.

---

## Fidelity

**High-fidelity.** Pixel-perfect mockups with final colors, typography, spacing, content, photo placement, and interactions. The developer should match these mocks tightly. The single permitted area of judgment is the motion implementation (the references use raw `setTimeout` + CSS transitions; you may swap to Motion / GSAP, but keep the *budget* described below).

---

## Stack Context (target codebase)

Per the original brief, the live site is built on:

- Next.js 15 App Router
- React 19
- Tailwind v4
- Motion (`motion/react`)
- GSAP
- Lenis smooth scroll (already wired)
- Content sourced from Notion via `notion-to-md`

All of these are already installed and configured. No new dependencies should be needed.

---

## Design Tokens

### Color (warm-paper monochrome — no accent color)

| Token            | Hex       | Role                                            |
| ---              | ---       | ---                                             |
| `paper`          | `#F4F2EC` | Page background; warm off-white                 |
| `ink`            | `#0E0E0C` | Body text & primary type; near-black, warm tint |
| `muted`          | `#9A9690` | Metadata, captions, secondary nav, blurbs       |
| `faint`          | `#C7C3BA` | Tertiary text (rare)                            |
| `rule`           | `#E5E2D9` | Hairline horizontal dividers (1px)              |
| `rule-strong`    | `#1A1A18` | Bold horizontal section dividers (1px)          |
| `footer-bg`      | `#0E0E0C` | Footer inverts to Ink                           |
| `footer-fg`      | `#F4F2EC` | Footer text on Ink                              |
| `footer-mute`    | `#7A7770` | Footer secondary text (warm gray on Ink)        |
| `footer-rule`    | `rgba(244,242,236,0.18)` | Hairline divider on Ink            |

Suggested Tailwind v4 tokens:

```css
@theme {
  --color-paper: #F4F2EC;
  --color-ink: #0E0E0C;
  --color-muted: #9A9690;
  --color-faint: #C7C3BA;
  --color-rule: #E5E2D9;
  --color-rule-strong: #1A1A18;
  --color-footer-mute: #7A7770;
}
```

### Typography

**One family, two weights.** Helvetica Neue → Helvetica → Arial → sans-serif. Regular (400) and Bold (700). No italics. No condensed.

| Role                | Size  | Weight | Tracking   | Notes                                         |
| ---                 | ---   | ---    | ---        | ---                                           |
| Display · manifesto | 124px | 700    | -0.045em   | Uppercase, line-height 0.96, **white-space: nowrap per line** |
| H1 · page titles    | 120px | 700    | -0.045em   | Uppercase, line-height 0.95 (`Writing.`, `Events.`) |
| Feature · big titles | 44px  | 700    | -0.03em    | Building rows (`Prometheus`, `Selected Works`) |
| H2 · event titles   | 36px  | 700    | -0.02em    | Featured event headline                       |
| Section feature     | 28px  | 700    | -0.025em   | Sub-feature event titles, sticky display      |
| List title          | 28px  | 400    | -0.01em    | Big essay rows in archive                     |
| List title (home)   | 20px  | 400    | -0.005em   | Essay rows in homepage Writing section        |
| Body lead           | 22px  | 400    | -0.005em   | Letter-style intro paragraph                  |
| Body                | 16-18px | 400  | normal     | Page intros, event blurbs                     |
| Caption / blurb     | 13-15px | 400  | normal     | Event sub-text, list `extra` lines (muted)    |
| Nav / UI            | 13px  | 400    | 0.02em     | Header nav links                              |
| Label (tracked)     | 11px  | 700    | 0.18em–0.22em | Uppercase section labels (`Building`, `Studio`) |
| Meta (tracked)      | 11px  | 400    | 0.14em–0.18em | Dates, tags ("MAY 2026")                  |

Line-height baseline: 1.45 for body, 1.55 for lead paragraphs, 1.5 for blurbs.

### Spacing

The system breathes. Standard gaps:

- Page outer padding: **160px** left/right on 1440 desktop (i.e. content column is 1120px wide). 28px on 390 mobile.
- Section vertical rhythm: **120–160px** between major section blocks (rule + 120px above + 64px below label).
- List row padding: **20px** top/bottom (small), **28px** (big rows).
- Headers/footers: 36px top, generous bottom (80–96px before content / after content).

### Border / Shape

- Rounded corners: essentially **none** (radius 0 or 2px on form inputs only). This is a sharp, editorial system.
- Borders: 1px hairlines only.
- Shadows: none. Depth comes from typography and whitespace.

### Motion Budget — strict

The whole point of this redesign is to *remove* motion. Implement the budget exactly.

- **Zero looping animations.**
- **Zero auto-scrollers, zero carousels.**
- **One signature interaction**: a letter-stagger fade-up on the hero manifesto. Fires **once** on first paint. Per-letter delay ~18ms, transform `translateY(110%) → 0`, opacity `0 → 1`, duration 500–700ms, easing `cubic-bezier(.2, .7, .2, 1)`. Implement with Motion's `stagger` or a CSS keyframe; do not run it on subsequent route returns (persist a session flag, or only run on initial mount of `/`).
- **Page-load fade**: 200–300ms opacity fade on body. Acceptable.
- **Hover**: links may shift underline thickness/opacity over ~120ms. No hover-triggered scrollers, no hover carousels.
- **Smooth scroll**: Lenis stays as-is.

---

## Pages

There are four pages in this bundle. The homepage is the centerpiece; sub-pages exist to show how the system extends.

### 1. Homepage — Desktop (1440 reference width)

`src/home-desktop.jsx` is the canonical reference. Top to bottom:

1. **Header** (`padding: 36px 160px 0`) — name on left (15px, 700, letter-spacing -0.01em), nav on right (5 links: Building · Writing · Events · About · Links; 13px, 400, gap 32px). Baseline-aligned.

2. **Hero manifesto** (`padding: 180px 160px 140px`) — three lines, uppercase, 124px, weight 700, letter-spacing -0.045em, line-height 0.96. The default lines:
   ```
   I BUILD
   MACHINES THAT
   THINK CAREFULLY.
   ```
   Each line must be `white-space: nowrap` so the per-letter `inline-block` animation doesn't wrap a word mid-letter. Below the manifesto, 56px down, a meta row: 32px hairline + " EST. 2026 · WASHINGTON, D.C." in 11px, 0.22em tracked uppercase muted.

   **Alternates** (also in `src/manifesto-card.jsx`):
   - *"MAKE FEWER THINGS. / MAKE THEM MEAN MORE."*
   - *"SOFTWARE IS A WAY / OF READING THE WORLD."*

3. **Epigraph image** (`padding: 0 160px 140px`) — a single full-width letterbox photo (1120 × 540) using `PHOTOS[0]` (`000092530012.jpeg`). `object-fit: cover`. Below the image, a `<figcaption>` row in mono-uppercase 11px muted: `Plate I — A year in motion · 2025–26` on left, `Photographed on film` on right.

4. **Bold horizontal rule** (1px `rule-strong`).

5. **Letter-style intro paragraph** (`padding: 64px 160px 120px` after the label) — `max-width: 720px`, 22px body, line-height 1.55. First-person voice with three inline links (Prometheus, Monty Monthly, essays). Style underlined inline links with a 1px ink border-bottom, no color shift.

   > "I'm Monty — a builder and a writer. I run **Prometheus**, a studio that designs custom AI pipelines for businesses that have outgrown off-the-shelf tools. Outside the studio I publish **Monty Monthly**, a newsletter of long-form **essays** on philosophy, technology, and the texture of an attentive life. Most of what I make is an attempt to slow something down enough to see it clearly."

6. **Bold rule** + **BUILDING section** — uppercase label `Building` (11px, 700, 0.18em tracked, ink) with right-aligned `01 — Studio` muted. 72px below label, two `<BuildingRow>` entries (a 3-column grid: `180px tag | 1fr title | 1fr blurb`). Each row 36px vertical padding, hairline divider between, no divider after last.
   - **Prometheus** — tag `Active · AI Studio`; blurb describes the recent work (orthodontic + hospitality clients); link `prometheus.today →`.
   - **Selected Works** — tag `Archive · 8 projects`; blurb lists the project names (Gene-Own, MAHealth Scanner, Goaltender, Insider Tracking, CRM Bot, +3 more); link `View all works →`.

7. **Bold rule** + **WRITING section** — label `Writing / 02 — Library`. Then three `<ListRow big>` entries with title + 13px muted `extra` blurb + 11px tracked date on the right.
   - "The Pursuit of Happier-ness" — May 2026 — *On chasing a moving target, and learning to like the chase.*
   - "Defiant Optimism" — Apr 2026 — *An argument for hope as a working stance, not a feeling.*
   - "Demystifying Merlin: Learning to See Your Own Future" — Mar 2026 — *A field guide to long-term thinking for short attention spans.*

   Below: `All writing →` link styled with a 1px ink bottom-border (11px tracked uppercase, 700).

8. **Bold rule** + **EVENTS section** — label `Events / 03 — Calendar`. Featured upcoming event is a 3-column grid (`180px date | 1fr content | auto CTA`). Date column: `NEXT · JUN 12` in 11px tracked ink + below in muted: `7:00 PM EST / Washington, D.C.`. Content: 36px title + 16px muted blurb (max 540px). CTA: `RSVP →` in 11px tracked with 1px ink bottom-border. Then two `<ListRow>` entries for the secondary events. Then `All events →`.

   Featured event copy: **AI for Small Biz, Vol. II** — "A working evening for owner-operators. Bring one stuck workflow; we'll automate it together. A practical sequel to 'Stealing Fire from the Gods.'"

9. **Bold rule** + **PHOTOGRAPHS section** — label `Photographs / 04 — Archive`. A 12-column CSS grid, `grid-auto-rows: 180px`, `gap: 12px`, with 6 photo plates in this asymmetric layout (col span / row span):
   ```
   Plate A:  span 7 / span 3    (large anchor, top-left)
   Plate B:  span 5 / span 2    (top-right)
   Plate C:  span 3 / span 1
   Plate D:  span 2 / span 1
   Plate E:  span 5 / span 2    (bottom-left)
   Plate F:  span 7 / span 2    (bottom-right)
   ```
   Each plate has the photo (`object-fit: cover`, `filter: saturate(0.92)`), with a small `No. NN` caption overlay at `position: absolute; left:14; bottom:12` in 10px 0.2em tracked uppercase bold white, **mix-blend-mode: difference** (so it stays legible over any image).

   Below the grid: `Photo Archive →` link.

10. **Bold rule** + **PERSONAL section** — label `Personal / 05 — Person`. A 3-column grid of cards (no images), each with a top 1px ink border, 20px bold title, 14px muted description, and a tracked `Enter →` CTA. Cards: **Photo Archive**, **Links & Elsewhere**, **About**.

11. **Footer** (`background: ink`, `color: paper`, `padding: 80px 160px 56px`) — 4-column grid:
    - Col 1: tracked uppercase `MONTY SINGER` (footer-mute), then "**A calling card, not a billboard.**" in 28px bold, max-width 320, two lines.
    - Cols 2–4: three footer columns titled **Studio**, **Library**, **Person**.
      - Studio: Prometheus / Selected Works / Process Notes
      - Library: Monty Monthly / Essays / Reading List
      - Person: About / Photo Archive / Contact
    - Bottom row (96px below, with 1px `footer-rule` border-top, 28px below that): "© 2026 Monty Singer · Washington, D.C." on left, social row on right (Twitter / GitHub / LinkedIn / Email).

### 2. Homepage — Mobile (390 reference width)

`src/home-mobile.jsx`. Same sections in same order, single-column, smaller scale:

- Manifesto: 56px, 4 lines (`I build / machines / that think / carefully.` — mixed case here, since the wrap pattern works better tonally than uppercase at this size). EST line follows.
- Epigraph photo: 380px tall, full content width.
- Section labels: 10px, 0.22em tracked, with right-aligned numeral.
- Building / Writing / Events / Personal rendered as small list rows (16px title, 10px tracked meta on right, 1px hairline between).
- Photographs: 2×2 grid of square photos (8 to 12px gap).
- Footer inverts to ink with paper text. Each footer column gets its own `border-bottom: rgba(244,242,236,0.18)` divider on mobile.

### 3. /writing — Index

`src/writing-index.jsx`. 1440 desktop.

- Header (same as homepage but `Writing` link is bolded ink, others muted).
- Title block (`padding: 160px 160px 100px`): 2-column grid (`1fr | 360px`). Left: tracked label `── The Library · 02`, then 120px `Writing.` (note the period — every page title ends in one), then 18px muted description paragraph with `Monty Monthly` inline link. Right: 360 × 480 atmosphere photo using `PHOTOS[5]` (`Patricof09.jpg`), object-fit cover.
- Bold rule.
- Three `<YearBlock>` groups (2026, 2025, 2024), each a 2-column grid `180px | 1fr` with the year as a sticky 14px tracked label on the left and big essay list rows on the right. Years separated by hairline rule.
- Hairline rule between year blocks, bold rule before the footer.
- Footer is a 64px-padding ink block with a tracked uppercase "── END OF ARCHIVE", a 32px serif-feeling Helvetica line "Receive new essays the morning they're published.", an email subscribe input + button styled in 11px tracked, and a copyright row.

Essay content for 2026 includes the same three as homepage plus *"Are We Capable of Change?"* and *"Choosing Faith"*. 2025 archive: *"Practical Philosophy: How to Play Win-Win and Avoid Lose-Lose"*, *"Standing on Sediment: Timing the Typewriter"*, *"Earning Magic"*, *"AI is Nibbling the World"*. 2024: *"Algorithmic Content"*, *"Discipline, Determination, and Dog Names"*, *"Staring Into the Void"*. (Real titles from current site — they'll come from Notion in production.)

### 4. /events — Index

`src/events-index.jsx`. 1440 desktop.

- Header (Events bolded).
- Title block matching `/writing` (`── The Calendar · 03`, big `Events.`, blurb, 360×480 atmosphere photo using `PHOTOS[3]`).
- Bold rule.
- **Upcoming** section — label `Upcoming / 03 — Upcoming`. Three `<UpcomingRow>` entries in a 3-column grid (`160px date | 1fr content | 200px right CTA`). The date column has the **month + year tracked** above a **giant 84px (or 56px for non-featured) bold day numeral** below — that's the signature visual of this page. CTA on right: seat count above and the `Reserve a seat →` / `RSVP →` link.
- Bold rule.
- **Past** section — label `Past / 03 — Past`. Tight 4-column grid rows (`120px date | 1fr title | 1fr blurb | 100px status`), 20px row padding, hairlines between, much denser than Upcoming.

---

## Components Catalog

Reusable building blocks across pages. Each maps to a function in `src/shared.jsx` or the page file.

| Component         | Where                | Purpose                                  |
| ---               | ---                  | ---                                      |
| `Rule`            | shared               | 1px hairline horizontal divider          |
| `Rule strong`     | shared               | 1px bold horizontal section divider      |
| `SectionLabel`    | shared               | 11px tracked uppercase section heading with optional right-aligned numeral |
| `ListRow`         | shared               | A linked row: title + optional `extra` blurb + right-aligned tracked meta. Has `big` variant for archive pages. |
| `AllLink`         | shared               | "All writing →" style tracked-uppercase link with 1px ink bottom border |
| `IntroLink`       | home-desktop         | Inline link in the letter-style intro (1px ink bottom border, no color shift) |
| `BuildingRow`     | home-desktop         | 3-column row for Building section (tag / title / blurb+link) |
| `Plate`           | home-desktop         | Image plate in the Photographs grid (image + mix-blend caption) |
| `FooterCol`       | home-desktop         | A column of footer links: small tracked title + list of links with grey sub-line |
| `YearBlock`       | writing-index        | 2-col group with sticky year label on the left |
| `UpcomingRow`     | events-index         | The big date-numeral upcoming-event row |
| `MobileSection`   | home-mobile          | Mobile section with label/numeral + children |
| `MobileRow`       | home-mobile          | Mobile list row (title + tracked meta) |
| `MobileAll`       | home-mobile          | Mobile tracked-uppercase "All X →" link |
| `MobileFooterCol` | home-mobile          | Mobile footer column with bottom hairline divider |

In Next.js you'll probably want these as `app/_components/...` co-located with their page, or hoisted to `components/editorial/...` if they're truly cross-page. `Rule`, `SectionLabel`, `ListRow`, `AllLink`, `IntroLink`, `FooterCol` are clear cross-page candidates.

---

## Interactions & Behavior

### Manifesto reveal (the only signature interaction)

- Trigger: first paint on the homepage. Mark complete in a sessionStorage flag so it doesn't replay on client-side route returns.
- Implementation: split each line into spans, each character an `inline-block` with `transform: translateY(110%); opacity: 0`. After 200ms, set `revealed=true` to apply per-letter staggered transitions.
- Per-letter delay: `(lineIndex * lineLength + charIndex) * 18ms`.
- Transition: `transform 700ms cubic-bezier(.2, .7, .2, 1)` and `opacity 500ms ease`.
- The wrapping container of each line must have `overflow: hidden` (so the letters slide up from "below" the visible line) and `white-space: nowrap` (so individual letters never wrap to a new line).
- Recommended Motion implementation: `motion.span` per character inside `<motion.div initial="hidden" animate="visible">` with `staggerChildren: 0.018`.

### Hover

- Links across the site: 120ms ease underline state. Inline-letter links (`IntroLink`, `SerifLink` equivalents) shift border-bottom from `muted` to `ink` on hover.
- `BuildingRow`, `ListRow`, `UpcomingRow`: no row-level color change on hover. The whole row is a `<Link>`; the *content* doesn't reflow. If you want a small affordance, fade in a chevron or shift the row's right-arrow 4px on hover — keep it under 120ms.
- Plates in the Photographs grid: filter shift `saturate(0.92) → 1` on hover, 200ms.

### Scroll

- Lenis stays. No scroll-triggered animations, no parallax. Bold rules and section labels are enough rhythm; the page doesn't need motion to feel structured.

### Page transitions

- Subtle 200–300ms opacity fade on route change. Nothing fancier.

### Mobile

- No carousels. No hover. Tap targets ≥ 44px (the `MobileRow` padding gives this). Sticky elements: none.

---

## Content

All content on the live site is sourced from Notion via `notion-to-md`. The mocks fill these slots with the **real titles and event names from the live montysinger.com** so the developer sees them in context. In production, render from the existing Notion data sources — **don't hardcode**.

Notion-sourced content the developer must wire up:

- **Essays** (homepage Writing + /writing index) — title, slug, publish date, blurb/excerpt.
- **Projects** (Building section "Selected Works" + linked /projects page) — title, slug, one-line description.
- **Events** (homepage Events + /events Upcoming + Past) — title, date, time, location, blurb, seats remaining (if tracked), RSVP URL.
- **Photos** (homepage epigraph + Photographs grid + /photos page) — URL, alt, optional caption.

Static content (in code, no Notion needed):

- The manifesto string (lock to one of the three candidates; default is **"I BUILD / MACHINES THAT / THINK CAREFULLY."**).
- The letter-style intro paragraph.
- Section labels ("Building", "Writing", "Events", etc.).
- Footer column titles ("Studio", "Library", "Person") and the colophon line.
- Nav links.

---

## Assets

The 6 photographs used in the mocks are hot-linked from the existing site:

```
https://montysinger.com/MSizzle-website-photos/000092530012.jpeg     ← PHOTOS[0], epigraph
https://montysinger.com/MSizzle-website-photos/20230928%20MSB_0114.jpg ← PHOTOS[1]
https://montysinger.com/MSizzle-website-photos/IMG_0028.jpeg         ← PHOTOS[2]
https://montysinger.com/MSizzle-website-photos/IMG_1075.JPG          ← PHOTOS[3], events hero
https://montysinger.com/MSizzle-website-photos/IMG_2129.jpeg         ← PHOTOS[4]
https://montysinger.com/MSizzle-website-photos/Patricof09.jpg        ← PHOTOS[5], writing hero
```

In production these come from `/public/MSizzle-website-photos/` already. Use the existing `next/image` pipeline with `priority` on the epigraph image only (above the fold) and lazy load the rest.

No icons used. No SVGs needed (the meta-row hairline at 32×1 is just a `<span>` with a background). No logo asset beyond the wordmark `Monty Singer` in 15px Helvetica Neue Bold.

---

## Implementation Notes for the Developer

- **Tailwind v4**: define the color tokens above in `@theme`, then drive everything off `bg-paper`, `text-ink`, `text-muted`, `border-rule`, etc. Avoid arbitrary values once tokens cover a use case.
- **Typography classes**: Tailwind's default scale doesn't get to 124px — you'll want a custom utility (`text-display` → `font-size: 124px; line-height: 0.96; letter-spacing: -0.045em; font-weight: 700`) and similar utilities for the H1, feature, and tracked-label sizes documented above.
- **Motion**: implement the manifesto reveal with `motion/react` — `<motion.div variants={container}>` + per-character `<motion.span variants={item}>` is the cleanest pattern. Use the `useReducedMotion()` hook to skip the stagger entirely for users who request reduced motion (and fall back to a 300ms full-line opacity fade).
- **Sub-pages**: `/about`, `/projects`, `/blog/[slug]`, `/links`, `/prometheus`, `/photos` aren't redesigned in this bundle. Keep them on the existing system for now and only restyle if the user asks. The homepage and /events were the brief's stated offenders.
- **Avoid** carousels, auto-scrollers, hover-triggered horizontal scroll, pulsing dots, rotating taglines, multiple simultaneous animation loops. These are explicitly out.

---

## Files in This Bundle

| Path                              | Purpose                                          |
| ---                               | ---                                              |
| `README.md`                       | This file                                        |
| `preview.html`                    | Open in a browser to see all 6 reference frames stacked (Homepage Desktop, Homepage Mobile, /writing, /events, Manifesto candidates, Specimen) |
| `src/shared.jsx`                  | Shared tokens (`MS` palette) + cross-page primitives (`Rule`, `SectionLabel`, `ListRow`, `AllLink`) + `PHOTOS` array |
| `src/home-desktop.jsx`            | Full desktop homepage. Canonical reference.      |
| `src/home-mobile.jsx`             | Mobile homepage                                  |
| `src/writing-index.jsx`           | `/writing` archive page                          |
| `src/events-index.jsx`            | `/events` archive page                           |
| `src/manifesto-card.jsx`          | The 3 candidate manifesto lines at hero scale, with editor's notes on each |
| `src/spec-card.jsx`               | Type scale + palette + motion-budget specimen, useful as a sanity-check while building |

To view: open `preview.html` in any browser. Photos load from the live site over HTTPS.

---

## Open Questions / Decisions Deferred

- **Manifesto line**: currently locked to "I BUILD / MACHINES THAT / THINK CAREFULLY." If Monty changes his mind, the alternates are in `manifesto-card.jsx`.
- **Photo Archive page** (`/photos`) wasn't designed in this round. The homepage Photographs grid links to it; the page itself should match the editorial system but is otherwise to-be-designed. A simple year-grouped grid (mirroring `/writing`'s `YearBlock` pattern) is a safe default.
- **About / Links / Prometheus sub-pages** — already calm per the brief, no redesign in scope here.
