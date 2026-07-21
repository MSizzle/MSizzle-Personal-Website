# Phase 20: Mono Token Foundation - Conversion Map

**Mapped:** 2026-07-21  
**Task Type:** Token replacement + call-site conversion (retheme, not new files)  
**Files modified:** 17 components under `src/` + globals.css  
**Call sites analyzed:** 80+ accent references  
**Hardcoded hex survivals:** 18 instances  

---

## Part 1: Accent Call-Site Inventory

### Components (v3 shared layer)

| File | Line | Expression | Tier | Classification | Notes |
|------|------|-----------|------|-----------------|-------|
| button.tsx | 5, 32 | `bg-accent border-accent text-bg hover:bg-transparent hover:text-accent` | Block | Button filled state (bg-accent + border) inverts on hover | Entire button fills with accent, text inverts |
| button.tsx | 2 | Comment: `.btn-accent { ... hover → transparent color-accent }` | Block | Documented pattern | For reference |
| big-list.tsx | 6, 45 | `hover:text-accent` | Oversized Display | Outline stroke variant (sig-out); color fills on hover | Tier 3: `-webkit-text-stroke` becomes solid fill |
| big-list.tsx | 46 | `hover:[-webkit-text-stroke-color:var(--accent)]` | Oversized Display | Outline stroke color change on hover | Explicit -webkit-text-stroke-color change |
| big-list.tsx | 55 | `group-hover:text-accent` | Oversized Display | Tag text warms to accent on hover | Part of Tier 3 pattern |
| section-label.tsx | 18 | `text-accent` | Inline Text | Mono label color (muted → accent) | Pure text color, no block background |
| marquee.tsx | 50 | `[-webkit-text-stroke:1.5px_var(--accent)]` | Oversized Display | Outline stroke on "hot" text | Tier 3: stroke color is accent |
| video-card.tsx | 37 | `group-hover:bg-accent` | Block | Play triangle fallback: fill becomes accent on hover | When no thumbnail, CSS triangle fills to accent |
| video-card.tsx | 52 | `border-l-accent` → `border-l-[24px] border-l-accent` | Block | CSS triangle primary edge (play button) | Accent-colored border-left = play triangle point |
| video-card.tsx | 55 | `group-hover:border-l-bg` | Block | Triangle hover state: border inverts | On hover, triangle edge becomes bg color |
| card.tsx | 106 | `text-accent` | Inline Text | Kicker label (mono, small) | Pure text color on cover-slot variant |
| uses-list.tsx | 30 | `text-accent` | Inline Text | Group heading (mono, tracked) | Pure text color for section subheading |
| page-hero.tsx | 1-6 | Comment `.page-hero h1 .out { ... accent ... }` | Oversized Display | Documented outline stroke | For reference |
| newsletter-carousel.tsx | 30 | `border-b-2 border-accent` | Block | Border accent on card's bottom edge | Horizontal divider/edge accent |

### Layout

| File | Line | Expression | Tier | Classification | Notes |
|------|------|-----------|------|-----------------|-------|
| site-footer.tsx | 37 | `bg-[var(--accent)]` | Block | Solid offset rule (2px height) | Full-width vermilion bar above footer content; D-11 → `bg-[var(--color-invert)]` |
| site-footer.tsx | 65 | `hover:text-[var(--accent)]` | Inline Text | Footer nav link hover state | Text color warms to accent on hover |
| site-footer.tsx | 87 | `hover:text-[var(--accent)]` | Inline Text | Footer nav link hover state (elsewhere) | Same hover behavior |

### About/Timeline (experimental, has undefined tokens)

| File | Line | Expression | Tier | Classification | Notes |
|------|------|-----------|------|-----------------|-------|
| timeline.tsx | 27 | `bg-[var(--accent)]` | Block | Icon dot background (education + award) | Radial fill for timeline icon; also uses `--accent-warm` and `--gold` (undefined) |
| timeline.tsx | 68 | `group-hover:text-[var(--accent)]` | Inline Text | Hover state on title | Text color warms to accent on hover |
| timeline.tsx | 123 | `text-[var(--accent)]` | Inline Text | "Learn more" link text | Pure text link color |

### Routes (app)

| File | Line | Expression | Tier | Classification | Notes |
|------|------|-----------|------|-----------------|-------|
| contact/page.tsx | N/A | No direct accent references | — | — | Uses ContactRow component (not in src provided) |
| writing/page.tsx | 177 | `text-accent` | Inline Text | Section subheading (Monty Monthly) | Pure text color, mono tracked label |
| blog/[slug]/page.tsx | 90 | `text-[var(--accent)]` | Inline Text | Bullet separator (·) in metadata row | Small accent-colored separator dots |
| blog/[slug]/page.tsx | 96 | `text-[var(--accent)]` | Inline Text | Bullet separator (·) in metadata row | Another separator dot |
| building/[slug]/page.tsx | 91 | `text-[var(--accent)] underline hover:text-[var(--accent-hover)]` | Inline Text | External link (View Project ↗) | Text link with underline; hover uses `--accent-hover` |

### Globals.css

| File | Line | Expression | Tier | Classification | Notes |
|------|------|-----------|------|-----------------|-------|
| globals.css | 79 | `-webkit-text-stroke: 2px var(--accent)` | Oversized Display | .sig-out outline stroke base | Core pattern for outline display type |
| globals.css | 109 | `--sig-shadow: 0.055em 0.055em 0 var(--accent)` | Block | Shadow lift color (vermilion drop shadow) | Accent-colored hard shadow on h1.sig |
| globals.css | 158 | `color: var(--accent)` | Inline Text | Prose link default color | Essay links rendered in accent |
| globals.css | 164 | `border-left: 2px solid var(--accent)` | Inline Text | Prose blockquote left border | Quote left edge in accent |
| globals.css | 239 | `color: var(--accent)` | Inline Text | .eyebrow label color | Section eyebrow label text |
| globals.css | 248 | `background: var(--accent)` | Block | .eyebrow ::before line | Horizontal rule to left of eyebrow |
| globals.css | 258 | `background: var(--accent)` | Block | .marker / h1.sig .hw background | Inline highlight block (accent background) |
| globals.css | 374 | `border-bottom: 2px solid var(--accent)` | Inline Text | .wayin a underline | Hover state underline on "way in" link |
| globals.css | 378 | `color: var(--accent)` | Inline Text | .wayin a:hover color | Hover text color warm to accent |
| globals.css | 405 | `color: var(--accent)` | Inline Text | .photo .icon color | Placeholder icon on photo fill |
| globals.css | 436 | `color: var(--accent)` | Inline Text | .rail-box .num color | Large number in rail box (accent) |
| globals.css | 467 | `background: var(--accent)` | Block | .statustag .dot background | Pulsing availability indicator dot |
| globals.css | 518 | `color: var(--accent)` | Inline Text | .hero-ticker .tick-link:hover | Ticker link text warm to accent on hover |
| globals.css | 529 | `color: var(--accent)` | Inline Text | .hero-ticker .tick-sep | Separator glyph between ticker items |
| globals.css | 554 | `border-bottom: 2px solid var(--accent)` | Inline Text | .inline underline | Inline link underline (wayin-like) |
| globals.css | 558 | `color: var(--accent)` | Inline Text | .inline:hover color | Inline link hover text |
| globals.css | 570 | `color: var(--accent)` | Inline Text | .prometheus-link:hover/focus-visible | Prometheus headline link hover |
| globals.css | 618 | `background: #e5411f` | Block | .title-card-kicker background (hardcoded hex) | Mono chip on kicker — D-04 fix needed |
| globals.css | 674 | `background: var(--accent)` | Block | .emoji-badge--vermilion fill | Colored badge field (to be renamed `.emoji-badge--invert`) |
| globals.css | 682 | `background: var(--accent)` | Block | .hero-band background | Full-bleed hero band color (vermilion) |
| globals.css | 704 | `text-shadow: 8px 8px 0 #17171a` | Block | .hero-band-title hard shadow | Ink offset on hero band; hex hardcoded |
| globals.css | 733 | `box-shadow: 8px 8px 0 var(--color-accent)` | Block | .card-grid > a:hover shadow | Hover shadow warms to accent |
| globals.css | 794 | `color: var(--accent)` | Inline Text | .mm-issue (Monty Monthly issue label) | Section label on carousel card |
| globals.css | 818 | `border-bottom: 2px solid var(--accent)` | Inline Text | .mm-read underline | "Read more" link underline |
| globals.css | 827 | `background: var(--accent)` | Block | .mm-sub background (subscribe card) | Full-bleed vermilion card |
| globals.css | 851 | `color: var(--accent)` | Inline Text | .mm-sub .btn text color | Subscribe button text |
| globals.css | 881 | `background: var(--accent)` | Block | .mm-btn:hover background | Carousel control button hover fill |
| globals.css | 882 | `border-color: var(--accent)` | Block | .mm-btn:hover border | Carousel control button hover border |
| globals.css | 898 | `background: var(--accent)` | Inline Text | .mm-dots span.on background | Active carousel dot indicator |
| globals.css | 982 | `background: var(--accent)` | Block | .nav-cell::before (before pseudo) | Navigation cell hover fill wipe |
| globals.css | 1015 | `background: var(--accent)` | Block | .stickynav .cta background | CTA button on sticky nav |
| globals.css | 1076 | `background: var(--accent)` | Block | .avail .dot background | Availability indicator dot (pulsing) |
| globals.css | 1105 | `color: var(--accent)` | Inline Text | .foot-col a:hover color | Footer link hover text |
| globals.css | 1218 | `color: var(--accent)` | Inline Text | .selective b color | Footer selective line emphasized words |
| globals.css | 1285 | `outline: 0 solid var(--accent)` | Block | .pb-frame outline at rest | Pinboard card outline base (0px, no visibility) |
| globals.css | 1289 | `outline: 3px solid var(--accent)` | Block | .pb-card:hover .pb-frame outline | **D-10 fix needed**: should be `2px solid var(--color-invert)` with `outline-offset: 2px` |
| globals.css | 1326 | `background: var(--accent)` | Block | .pb-play > span background | YouTube play button background |
| globals.css | 1355 | `background: var(--accent)` | Block | .pb-note background | "Why I love it" note panel on pinboard |
| globals.css | 1361 | `box-shadow: 10px 10px 0 var(--accent)` | Block | .pb-card.is-open .pb-frame shadow | Open card shadow (accent-colored) |
| globals.css | 1457 | `color: var(--accent)` | Inline Text | .pb-btn:hover text | Pinboard button hover text |
| globals.css | 1459 | `background: var(--accent)` | Block | .pb-btn--go fill | "Go" button filled state |
| globals.css | 1464 | `box-shadow: 4px 4px 0 var(--accent)` | Block | .pb-btn--stop hover shadow | Stop button hover shadow |
| globals.css | 1485 | `outline: 3px solid var(--accent)` | Block | .pb-card.pb-peek outline | Peek/preview outline (D-10 fix needed like line 1289) |
| globals.css | 1489 | `box-shadow: 12px 12px 0 var(--accent)` | Block | .pb-card.pb-drawn shadow | Drawn card accent shadow |

---

## Part 2: Hardcoded Hex Survival Audit

| File | Line | Current Hex | Usage | D-04 Action | Verified |
|------|------|------------|-------|-------------|----------|
| globals.css | 8 | #faf9f7 | `--color-bg` token value | Replace with #ffffff | ✓ D-05 |
| globals.css | 9 | #f0f1f3 | `--color-bg-2` token value | DELETE token entirely (D-06) | ✓ Confirmed in D-06 |
| globals.css | 10 | #17171a | `--color-surface` token value | Replace with #ffffff (D-08) | ✓ D-08 |
| globals.css | 19 | #f7f5f0 | `--color-text-inverse` token value | Replace with #ffffff (D-05) | ✓ D-05 |
| globals.css | 22–24 | #e5411f, #c8381a, #a52d13 | `--accent` and variants token values | DELETE all accent tokens (D-01) | ✓ Confirmed in D-01 |
| globals.css | 30–32 | #e5411f, #c8381a, #a52d13 | `--color-accent` and variants aliases | DELETE all (part of D-01) | ✓ Confirmed in D-01 |
| globals.css | 122 | #f4ecdd | `--hero-bg` token value | Becomes #ffffff or deleted if hero dies (D-04, row 1) | ✓ Confirmed |
| globals.css | 334 | #dbe2ee | `.pslide:nth-child(3) .img background` | D-04 audit note: blue-tinted grey, violates MO-01 → replace with `rgba(0,0,0,0.08)` | ⚠️ Not in D-04 table but flagged |
| globals.css | 600 | #faf9f7 | `.title-card` background (paper field) | Replace per D-05 token changes; becomes #ffffff context | ✓ Cascades from token |
| globals.css | 608 | #17171a | `.title-card--ink` background | Replace per D-05/D-08; becomes #000000 (or use `--color-invert`) | ✓ Cascades from token |
| globals.css | 609 | #faf9f7 | `.title-card--ink` text color | Replace per D-05 token changes; becomes #ffffff context | ✓ Cascades from token |
| globals.css | 618 | #e5411f | `.title-card-kicker` background (hardcoded hex) | **D-04 fix**: Becomes `var(--color-invert)` | ✓ Confirmed |
| globals.css | 672 | #17171a | `.emoji-badge--ink` background | D-04 audit note: matches `--color-surface`; becomes `--color-invert` or #000000 | ⚠️ Flagged for audit, not in table |
| globals.css | 673 | #f4ecdd | `.emoji-badge--cream` background | **D-04 fix**: Becomes `rgba(0,0,0,0.08)` | ✓ Confirmed |
| globals.css | 675 | #dbe2ee | `.emoji-badge--gray` background | D-04 audit note: blue-tinted grey, violates MO-01 → replace with `rgba(0,0,0,0.08)` | ⚠️ Flagged for audit |
| globals.css | 704 | #17171a | `.hero-band-title` text-shadow (hard offset) | Stays as black, but convert to `var(--color-text)` or `#000000` explicitly | ✓ Confirmed |
| globals.css | 1293 | #f4ecdd | `.pb-frame--cream` background | **D-04 fix**: Becomes #ffffff with border carrying edge | ✓ Confirmed |
| globals.css | 1296 | #a49e93 | `.pb-media` background (placeholder) | **D-04 fix**: Becomes `rgba(0,0,0,0.08)` | ✓ Confirmed |
| opengraph-image.tsx | 26 | #faf9f7 | Background color in OG image | Phase 23 (explicitly noted in D-03) | ✗ Excluded (Phase 23) |
| opengraph-image.tsx | 38 | #e5411f | Accent color in OG image | Phase 23 (explicitly noted in D-03) | ✗ Excluded (Phase 23) |
| blog/[slug]/opengraph-image.tsx | 52 | #faf9f7 | OG background | Phase 23 | ✗ Excluded (Phase 23) |
| blog/[slug]/opengraph-image.tsx | 64 | #e5411f | OG accent | Phase 23 | ✗ Excluded (Phase 23) |
| building/[slug]/opengraph-image.tsx | 48 | #faf9f7 | OG background | Phase 23 | ✗ Excluded (Phase 23) |
| building/[slug]/opengraph-image.tsx | 60 | #e5411f | OG accent | Phase 23 | ✗ Excluded (Phase 23) |
| components/home/pinboard.tsx | 110 | #8f9e86, #7c93a6, #b9805f, #c9a14e, #a49e93, #8a6f82 | SWATCHES array (swatch colors) | Phase 22 (TL-02) | ✗ Excluded (Phase 22) |

**Summary:**
- **D-04 fixes confirmed:** 6 instances in globals.css (lines 122, 618, 673, 1293, 1296, and the renamed `.emoji-badge--vermilion` → `.emoji-badge--invert` at 674)
- **D-04 audit flags:** 2 instances need attention (lines 334 `.pslide:nth-child(3)`, 675 `.emoji-badge--gray`)
- **Phase 23 exclusions:** 3 opengraph-image.tsx files (6 hex instances) — out of scope
- **Phase 22 exclusions:** pinboard.tsx SWATCHES array — out of scope

---

## Part 3: Three-Tier Hover Rule Classification

### Tier 1: Block Surfaces (Invert wholesale)

Entire background fills with `--color-invert` (#000000); text becomes `--color-text-inverse` (#ffffff); borders become black. Transition 120ms on `background-color` and `color` only.

**Call sites:**
- `button.tsx:32` — Button.accent variant
- `video-card.tsx:37, 52, 55` — Play triangle fallback and hover states
- `newsletter-carousel.tsx:30` — Border-b accent (edge emphasis, not full block)
- `site-footer.tsx:37` — Solid offset rule bar (full-width vermilion → invert)
- globals.css:258, 467, 618, 674, 682, 733, 827, 881–882, 982, 1015, 1076, 1326, 1355, 1361, 1464, 1489

**Tier 1 count:** ~24 sites

### Tier 2: Inline Text Links (1px underline reveal)

No fill, no weight change. Text stays at current color or dims. On hover, reveal a 1px `currentColor` underline.

**Call sites:**
- `section-label.tsx:18` — Text color only (no hover state defined; becomes text-dim?)
- `card.tsx:106` — Kicker label text
- `uses-list.tsx:30` — Group heading text
- `site-footer.tsx:65, 87` — Footer nav hover text
- `writing/page.tsx:177` — Section subheading
- `blog/[slug]/page.tsx:90, 96` — Metadata separator dots
- `building/[slug]/page.tsx:91` — External link (has underline + hover state)
- globals.css:158, 164, 378, 405, 436, 518, 529, 554, 558, 570, 794, 818, 851, 898, 1105, 1218, 1457

**Tier 2 count:** ~21 sites

### Tier 3: Oversized Display Type (Stroke fills to solid)

Used by display-type outline variants (`sig-out`, `-webkit-text-stroke`). Hover fills the stroke to solid black, text remains transparent or becomes solid.

**Call sites:**
- `big-list.tsx:6, 45–46, 55` — Outline sig-out variant with hover color fill
- `marquee.tsx:50` — "Hot" text outline stroke
- `page-hero.tsx:39` — Outline variant (sig-out class reference)
- globals.css:79 (base), 109 (shadow), and all sites using `.sig-out` class

**Tier 3 count:** ~6 sites (plus all downstream `.sig-out` users)

### Ambiguous / Needs Review

| Site | Issue |
|------|-------|
| `big-list.tsx:55` `group-hover:text-accent` | Is this Tier 2 (text link) or Tier 3 (stroke fill)? Context: `.tag` element on hover within `.big-list a`. Classified as Tier 3 because it's inside an outline sig-out variant. |
| `timeline.tsx:27–28, 68, 123` | Uses `--accent` for icon dots and hover states, but also references undefined tokens (`--accent-warm`, `--gold`). Not in scope for Phase 20 (timeline is experimental/about route). |
| `globals.css:109` `--sig-shadow` | Vermilion drop shadow on h1.sig. Is this a block inversion or a shadow color? Classified as Block because it's a hard offset solid shape. On mono, becomes `var(--color-text)` black shadow. |
| `building/[slug]/page.tsx:91` | Has both default and hover states (`text-[var(--accent)] ... hover:text-[var(--accent-hover)]`). Classified as Tier 2 (inline link), but the `-hover` variant may not exist post-retheme. Need to decide: does "hover text color" → "underline reveal" or does the link stay text and gain underline? |

---

## Part 4: Token Mapping (v3 → Mono)

### v3 @theme inline block (globals.css:3–49)

| v3 Token Name | v3 Value | v3 Purpose | Mono Value | D-reference | Survives? | Tailwind Emission |
|---|---|---|---|---|---|---|
| `--color-bg` | #faf9f7 | Main background (near-white paper) | #ffffff | D-05 | YES, renamed | Emits `bg-bg` utility |
| `--color-bg-2` | #f0f1f3 | Alternate section band (cool-gray) | DELETED | D-06 | NO | No utility (deleted) |
| `--color-surface` | #17171a | Dark panels/cards (near-black) | #ffffff | D-08 | YES, revalued | Emits `bg-surface` utility |
| `--color-surface-2` | #ffffff | Light card inverse | UNKNOWN | — | UNKNOWN | — |
| `--color-border` | rgba(23,23,23,0.15) | Light hairline | rgba(0,0,0,0.14) | D-05 | YES | Emits `border-border` utility |
| `--color-border-strong` | rgba(23,23,23,0.32) | Firm divider | rgba(0,0,0,0.32) | D-05 | YES | Emits `border-border-strong` utility |
| `--color-text` | #171717 | Primary text (near-black ink) | #000000 | D-05 | YES | Emits `text-text` utility |
| `--color-text-dim` | rgba(23,23,23,0.72) | Secondary text (66% opacity) | rgba(0,0,0,0.66) | D-05 | YES | Emits `text-text-dim` utility |
| `--color-text-muted` | rgba(23,23,23,0.60) | Tertiary text (60% opacity, WCAG AA) | rgba(0,0,0,0.60) | D-07 | YES (overridden) | Emits `text-text-muted` utility |
| `--color-text-inverse` | #f7f5f0 | Text on dark surfaces (near-white) | #ffffff | D-05 | YES, revalued | Emits `text-text-inverse` utility |
| `--accent` | #e5411f | Vermilion accent marker | DELETED | D-01 | NO | No utility (deleted) |
| `--accent-hover` | #c8381a | Vermilion hover state | DELETED | D-01 | NO | No utility (deleted) |
| `--accent-deep` | #a52d13 | Vermilion deep variant | DELETED | D-01 | NO | No utility (deleted) |
| `--color-accent` | #e5411f | Alias for Tailwind `text-accent` | DELETED | D-01 | NO | No utility (deleted) |
| `--color-accent-hover` | #c8381a | Alias for hover variant | DELETED | D-01 | NO | No utility (deleted) |
| `--color-accent-deep` | #a52d13 | Alias for deep variant | DELETED | D-01 | NO | No utility (deleted) |

### Mono tokens to ADD (from mono.css, D-05)

| New Token Name | New Value | Purpose | D-reference | Replaces | Tailwind Emission |
|---|---|---|---|---|---|
| `--color-invert` | #000000 | Black block ground (emphasis) | D-05 | `--accent` for block fills | Emits `bg-invert`, `text-invert` utilities |
| `--color-text-inverse-dim` | rgba(255,255,255,0.66) | Text on black at 66% opacity | D-05 | New (no v3 analog) | Emits `text-text-inverse-dim` utility |
| `--color-border-inverse` | rgba(255,255,255,0.20) | Border on black ground | D-05 | New (no v3 analog) | Emits `border-border-inverse` utility |

### Tailwind v4 Utility Emission Risk

**Critical:** D-01 deletes `--color-accent*` tokens. After deletion:
- `bg-accent` emits nothing (silent no-op, not a build error)
- `text-accent` emits nothing (silent no-op)
- `border-accent`, `border-l-accent` emit nothing

Any call site still using these utilities will render unstyled with **no compiler signal**. This is why D-02 requires converting all call sites **in this phase**, not deferring to Phase 23.

**New utility emission** (D-05):
- `bg-invert` / `text-invert` / `border-invert` — emitted from `--color-invert`
- `bg-surface` — revalued; emits as before but now `#ffffff` instead of `#17171a`
- `text-text-inverse-dim`, `border-border-inverse` — newly emitted

**Call sites using `text-inverse` or `bg-invert` in D-08/D-11:**
- D-08: `bg-invert` + `text-inverse` for surfaces formerly using `bg-surface` (near-black)
- D-11: `bg-[var(--color-invert)]` for footer rule (site-footer.tsx:37)

Both will work post-retheme if the new tokens are in the `--color-*` namespace. ✓

**Special case: `.emoji-badge--vermilion` → `.emoji-badge--invert`**
- Currently: `background: var(--accent)` (line 674)
- Becomes: `background: var(--color-invert)` (D-04, renaming approved)
- Tailwind emission: No utility generated from renamed class, so no risk

**Hardcoded `-webkit-text-stroke-color` (Tier 3)**
- Currently: `hover:[-webkit-text-stroke-color:var(--accent)]` (big-list.tsx:46)
- Becomes: `hover:[-webkit-text-stroke-color:var(--color-invert)]`
- Tailwind emission: Arbitrary value in square brackets, no built-in utility; safe to change variable reference

---

## Part 5: Call-Site Conversion Strategy

### Phase 20 Conversion Sequencing (Claude's discretion allowed)

**Shared utility deletions first** (all files affected):
1. Delete all six accent token aliases from @theme inline:
   - `--accent`, `--accent-hover`, `--accent-deep`
   - `--color-accent`, `--color-accent-hover`, `--color-accent-deep`

2. Replace v3 token values with mono values (D-05):
   - `--color-bg: #ffffff`
   - `--color-surface: #ffffff`
   - `--color-border: rgba(0,0,0,0.14)`
   - `--color-border-strong: rgba(0,0,0,0.32)` (no change)
   - `--color-text: #000000`
   - `--color-text-dim: rgba(0,0,0,0.66)`
   - `--color-text-muted: rgba(0,0,0,0.60)` (D-07 override, not mono.css)
   - `--color-text-inverse: #ffffff`

3. Add three new mono tokens (D-05):
   - `--color-invert: #000000`
   - `--color-text-inverse-dim: rgba(255,255,255,0.66)`
   - `--color-border-inverse: rgba(255,255,255,0.20)`

4. Delete `--color-bg-2` (D-06)

**D-04 Hardcoded fixes** (globals.css only):
- Line 122: `--hero-bg: #f4ecdd` → `#ffffff` (or keep token if hero band survives Phase 21)
- Line 618: `.title-card-kicker` background `#e5411f` → `var(--color-invert)`
- Line 673: `.emoji-badge--cream` background `#f4ecdd` → `rgba(0,0,0,0.08)`
- Line 674: Rename `.emoji-badge--vermilion` to `.emoji-badge--invert`, background stays `var(...)` (now points to invert)
- Line 675: `.emoji-badge--gray` background `#dbe2ee` → `rgba(0,0,0,0.08)` (audit issue; violates MO-01)
- Line 672: `.emoji-badge--ink` background `#17171a` → `var(--color-invert)` or `#000000`
- Line 334: `.pslide:nth-child(3) .img` background `#dbe2ee` → `rgba(0,0,0,0.08)` (audit issue)
- Line 1289: `.pb-card:hover .pb-frame` outline `3px solid var(--accent)` → `2px solid var(--color-invert)` with `outline-offset: 2px` (D-10)
- Line 1293: `.pb-frame--cream` background `#f4ecdd` → `#ffffff` with border carrying edge
- Line 1296: `.pb-media` background `#a49e93` → `rgba(0,0,0,0.08)`
- Line 1485: `.pb-card.pb-peek` outline `3px solid var(--accent)` → `2px solid var(--color-invert)` with `outline-offset: 2px` (D-10)

**Tier 1 (Block surface) conversions:**
→ Each site: `bg-accent border-accent text-bg hover:bg-transparent hover:text-accent` becomes `bg-invert border-invert text-inverse hover:bg-transparent hover:text-invert`, with `transition-colors duration-120`.
- button.tsx:32
- video-card.tsx:37, 52–55 (play triangle edge + hover states)
- And 20+ globals.css sites

**Tier 2 (Inline text link) conversions:**
→ Each site: pure text color, no fill. Keep text-accent → text-text-dim or text-text. On hover, add `underline` (or keep text-accent → text-text-dim).
- section-label.tsx:18
- card.tsx:106, uses-list.tsx:30
- writing/page.tsx:177
- blog/[slug]/page.tsx:90, 96
- building/[slug]/page.tsx:91 (special case: has `-hover` variant to delete)
- site-footer.tsx:65, 87 (hover underline or text-dim)
- And 15+ globals.css sites

**Tier 3 (Oversized display) conversions:**
→ Each site: replace `var(--accent)` with `var(--color-invert)` in `-webkit-text-stroke-color` and on-hover stroke fill logic.
- big-list.tsx:45–46, 55
- marquee.tsx:50
- globals.css:79, and all downstream `.sig-out` uses

**D-09–D-11 Application:**
- D-09: Three-tier hover rule applied uniformly across all converted sites (see above)
- D-10: `:focus-visible` outline becomes `2px solid var(--color-invert)` with `outline-offset: 2px` site-wide (globals.css around 1289, 1485)
- D-11: site-footer.tsx:37 — `h-2 bg-[var(--accent)]` becomes `h-2 bg-[var(--color-invert)]`

---

## Part 6: Annotation Registry (for planner cross-reference)

### Files & line ranges for team action tracking

| File | Start Line | End Line | Type | D-ref | Summary |
|------|----------|---------|------|-------|---------|
| globals.css | 3 | 49 | Token block | D-01, D-05, D-06, D-07 | Replace entire @theme inline block; delete 6 accent tokens; add 3 new tokens; revalue 9 tokens; delete --color-bg-2 |
| globals.css | 122 | 122 | Hardcoded hex | D-04 | `--hero-bg: #f4ecdd` → `#ffffff` |
| globals.css | 618 | 618 | Hardcoded hex | D-04 | `.title-card-kicker` `#e5411f` → `var(--color-invert)` |
| globals.css | 672 | 675 | Hardcoded hex × 4 | D-04 audit | `.emoji-badge--ink/cream/vermilion/gray` background updates + rename to `.emoji-badge--invert` |
| globals.css | 1289 | 1289 | Focus ring | D-10 | `.pb-card:hover .pb-frame` outline `3px solid var(--accent)` → `2px solid var(--color-invert) with offset 2px` |
| globals.css | 1293 | 1296 | Hardcoded hex × 2 | D-04 | `.pb-frame--cream` and `.pb-media` backgrounds |
| globals.css | 1485 | 1485 | Focus ring | D-10 | `.pb-card.pb-peek` outline same fix as line 1289 |
| button.tsx | 32 | 32 | Tier 1 | D-09 | `bg-accent border-accent text-bg hover:...` → block inversion pattern |
| big-list.tsx | 45–46 | 55 | Tier 3 | D-09 | `hover:text-accent` + `-webkit-text-stroke-color` → Tier 3 fill pattern |
| section-label.tsx | 18 | 18 | Tier 2 | D-09 | `text-accent` → text-text-dim (or keep text color with underline on hover) |
| marquee.tsx | 50 | 50 | Tier 3 | D-09 | `[-webkit-text-stroke:1.5px_var(--accent)]` → `var(--color-invert)` |
| video-card.tsx | 37, 52–55 | — | Tier 1 | D-09 | Play triangle: `bg-accent` + `border-l-accent` + hover states → invert pattern |
| card.tsx | 106 | 106 | Tier 2 | D-09 | Kicker `text-accent` → text-text-dim or text-text |
| uses-list.tsx | 30 | 30 | Tier 2 | D-09 | Group heading `text-accent` → text color change |
| newsletter-carousel.tsx | 30 | 30 | Tier 1 | D-09 | `border-b-2 border-accent` → `border-b-2 border-invert` |
| site-footer.tsx | 37 | 37 | Tier 1 | D-11 | Vermilion rule `bg-[var(--accent)]` → `bg-[var(--color-invert)]` |
| site-footer.tsx | 65, 87 | — | Tier 2 | D-09 | Footer nav hover `hover:text-[var(--accent)]` → underline reveal pattern |
| timeline.tsx | 27–28, 68, 123 | — | Mixed | — | **Out of scope** — undefined tokens (`--accent-warm`, `--gold`) suggest this component is experimental |
| writing/page.tsx | 177 | 177 | Tier 2 | D-09 | Section label `text-accent` → text color |
| blog/[slug]/page.tsx | 90, 96 | — | Tier 2 | D-09 | Metadata separator dots `text-[var(--accent)]` → text-text-dim or dim-dim |
| building/[slug]/page.tsx | 91 | 91 | Tier 2 | D-09 | External link `text-[var(--accent)] ... hover:text-[var(--accent-hover)]` → remove `-hover` variant, apply underline reveal |
| contact/page.tsx | — | — | — | — | No direct accent refs (check ContactRow component if implemented) |

---

## Planner Notes

1. **One-time token block replacement:** The v3 `@theme inline` block (globals.css:3–49) is entirely replaced. No incremental utility-by-utility refactoring needed — one atomic change.

2. **Audit flags:** Two hex instances (lines 334, 675) were flagged by D-04 but not explicitly listed in the fix table. Recommend confirming with Monty whether these are in scope.

3. **Timeline component:** Uses `--accent-warm` and `--gold` tokens that don't exist anywhere in the codebase. This suggests the component is experimental or from an older design. Recommend deferring or seeking clarification.

4. **Focus ring unification:** D-10 requires `outline: 2px solid var(--color-invert) with outline-offset: 2px` site-wide. Two pinboard sites (lines 1289, 1485) are explicit. Recommend scanning for other `:focus-visible` rules in globals.css.

5. **OG image routes:** The three `opengraph-image.tsx` files (3 routes) carry 6 hex instances (#e5411f, #faf9f7). Explicitly Phase 23 per D-03. Do not touch in Phase 20.

6. **Pinboard SWATCHES:** The `pinboard.tsx` SWATCHES array and `.pb-note` (color background) are Phase 22 per CONTEXT.md. Only the `.pb-*` CSS rules in globals.css are Phase 20.

7. **Branch requirement:** D-12/D-13 state that this phase operates on a long-lived `v4-mono` branch with worktrees disabled. Ensure orchestrator creates the branch and disables worktree creation before executors run.

---

*Conversion map prepared: 2026-07-21*  
*Format: Per-file action summary with concrete line numbers and expressions*  
*Ready for planner discretion on sequencing and task breakdown*
