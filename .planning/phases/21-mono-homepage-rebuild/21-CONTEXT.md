# Phase 21: Mono Homepage Rebuild - Context

**Gathered:** 2026-07-21
**Status:** Ready for planning
**Source:** Sketch Express Path (`.planning/sketches/015-mono-passive-home`, winner variant E, revisions 1-3)

<domain>
## Phase Boundary

Rebuild the homepage (`src/app/page.tsx` + `src/components/home/`) to sketch 015 variant E: a
quiet Swiss-editorial index on one continuous white ground, with the writing list in terminal
register, no photographs above the fold, no subscribe CTA above the footer, and all motion
subtracted down to a single slow opacity fade-up on scroll.

Phase 20 already shipped the mono token foundation (`#ffffff` ground, `#000000` ink,
`rgba(0,0,0,0.14)` hairlines, zero accent) across the repo. This phase consumes those tokens; it
does not redefine them.

**In scope** — `src/components/home/`: `hero.tsx`, `explorative-homepage.tsx`,
`section-building.tsx`, `section-work.tsx`, `section-newsletter.tsx`, `section-loves.tsx`,
`photo.tsx`, `photo-marquee.tsx`, `scroll-reveals.tsx`, `sticky-nav.tsx`,
`monty-monthly-carousel.tsx`, `rail-box.tsx`.

**Explicitly OUT of scope:**
- **`src/components/home/pinboard.tsx` must not be touched.** TL-01/TL-02/TL-03 and MS-03
  (pinboard `prefers-reduced-motion`) are Phase 22. Section 03 Things I Love keeps rendering the
  shipped pinboard as-is; only its surrounding band chrome (which lives in `section-loves.tsx`)
  is in scope here.
- Interior routes (`/building`, `/writing`, `/contact`) — Phase 23 site sweep.
- OG images still hardcoding `#e5411f` — Phase 23 (SW/MO-04).
- Dark mode / true inversion — Phase 24.

</domain>

<decisions>
## Implementation Decisions

All decisions below are LOCKED by Monty's sketch-015 sign-off on 2026-07-20 (variant E, three
recorded revisions). They are not open for reinterpretation during planning or execution.

### Register — three bands, three registers, one page

| Band | Register | Source |
|------|----------|--------|
| Hero + `01 Building` | Swiss editorial (variant A) | numbered rows, tracked-out mono labels, hover inverts full row to a solid black block |
| `02 Writing` | Terminal (variant B) | `~/writing`, dates flush left, read time flush right, mono type |
| `03 Things I Love` | Pinboard (sketches 012/013) | shipped `pinboard.tsx`, untouched this phase |

### Hero (HP-01)
- Type only. No photograph above the fold.
- The 44%-width rotating portrait carousel (stage pitch / fireside chat / mushroom blocks) is
  **deleted**, not hidden.
- The Vermilion marker block reading "Create Order from Chaos" is gone (accent is dead as of
  Phase 20).
- Hanken Grotesk 800 display survives from v3. JetBrains Mono carries the mono labels and the
  terminal band. Both already load via `next/font`.
- Photographs may survive deeper in the page but never in the hero.

### Building index (HP-02)
- Renders as a Swiss numbered index: `001`, `002`, `003` — zero-padded three digits.
- Rows sit on hairline rules, generous whitespace, tracked-out mono column labels.
- **Hover inverts the entire row to a solid black block** (white type on black). This is the
  site's only hover language now — no accent, no underline-slide, no color shift.
- Full-row inversion, not tight-row (variant D's tight invert was rejected as reading like a
  glitch at speed).

### Writing list (HP-03)
- Terminal format: `~/writing` header, post title, date flush left, read time flush right.
- Mono type throughout — this is the **only** mono-type surface on the page, which is what makes
  the blog read as a log rather than a pitch.
- **No frame.** Revision 2 removed the 2px box; it read as a widget bolted onto the page. The
  terminal register is carried by mono type plus a single header rule, sitting directly on the
  paper like every other band.
- No blinking cursor. If a cursor glyph is used at all it is static — a perpetual blink is the
  same attention-grab as the pulsing status dot the v4 lock cut.

### Continuous ground (HP-04)
- One continuous `#ffffff` ground for the whole page. The alternating light/dark band rhythm is
  removed entirely — no dark section, no inverted band, no tonal slam between sections.
- Depth and separation come from hairline rules, whitespace, and type weight only.
- The site-wide no-gradients rule holds: hard corners (`radius: 0`), no gradients anywhere.

### Subscribe demotion (HP-05)
- A visitor must be able to reach work and essays without meeting a subscribe CTA above the
  footer.
- Monty Monthly becomes a quiet footer-level line. The `section-newsletter.tsx` mid-page CTA
  band and the `monty-monthly-carousel.tsx` treatment do not survive as promotional surfaces.
- **`sticky-nav.tsx` loses its subscribe button.** No sticky CTA anywhere on the page.

### Motion subtraction (MS-01, MS-02)
Removed outright:
- hero link marquee (`photo-marquee.tsx`)
- pulsing status dot
- photo ken-burns (`photo.tsx`)
- slide-in-from-side reveals (`scroll-reveals.tsx`)
- the light/dark band slam

Surviving motion: **one slow opacity fade-up on scroll, and nothing else.** Verify it stays
perceptible without reading as a page that is loading slowly.

### Content
- Real content where known: Prometheus, Monty Monthly, CULTIVATE, real essay titles and real post
  dates from the Notion pipeline at build time.
- Where a count or a fact is unknown, omit it rather than guess. The sketch omitted Monty's
  location rather than invent one; hold that standard.

### Claude's Discretion
- Exact spacing scale, type ramp, and grid column counts — extract from the sketch's
  `index.html` / `../themes/mono.css` rather than inventing, but the precise Tailwind token
  mapping is an implementation call.
- Whether deleted components are removed from the repo or reduced to unused files (prefer
  deletion; leave no dead homepage components behind).
- Component decomposition and file boundaries within `src/components/home/`.
- Test structure for the new sections.

</decisions>

<canonical_refs>
## Canonical References

**Downstream agents MUST read these before planning or implementing.**

### Design contract (authoritative)
- `.planning/sketches/015-mono-passive-home/README.md` — the design question, variant E rationale,
  and revisions 1-3. Locked decisions live here.
- `.planning/sketches/015-mono-passive-home/index.html` — the **reference implementation** of all
  five variants. Variant E's markup and CSS are the visual contract; read it for concrete spacing,
  type scale, rule weights, and the row-inversion hover implementation.
- `.planning/sketches/015-mono-passive-home/preview-a-swiss.png` — full-page capture of variant A
  (E's Swiss shell).
- `.planning/sketches/themes/mono.css` — the sketch theme. Deliberately defines **no
  `--color-accent`**, so anything that secretly needs a hue breaks visibly.
- `.planning/sketches/MANIFEST.md` — "CURRENT Homepage Direction (2026-07-20)" section; supersedes
  the 007-011 photo-forward direction.

### Shipped foundation (Phase 20)
- `.planning/phases/20-mono-token-foundation/20-CONTEXT.md` — the mono token decisions this phase
  builds on.
- `.planning/phases/20-mono-token-foundation/20-VERIFICATION.md` — what actually shipped.
- `.planning/phases/20-mono-token-foundation/20-PATTERNS.md` — analog files and code excerpts.

### Preservation fence
- `src/components/home/pinboard.tsx` — **read to understand the boundary, do not modify.**

</canonical_refs>

<specifics>
## Specific Ideas

- Numbered index uses zero-padded three-digit numerals (`001`, `002`, `003`), not `1.` or `01`.
- Terminal band header is literally `~/writing`.
- Hover inversion is the whole row going solid black with white type — the single hover language
  site-wide.
- Mobile: at 375px the Swiss four-column rows must **collapse gracefully**, not merely fit.
  Sketch note 6 flags this as a thing to verify, not assume.
- Under 760px the pinboard already degrades to a tappable stack with the toolbar hidden — that is
  shipped behaviour, unchanged.

</specifics>

<deferred>
## Deferred Ideas

- Pinboard mono translation (greyscale `SWATCHES`, `.pb-frame--cream` losing its cream, note panel
  Vermilion → black, category-by-fill-weight: Book solid black / Film light grey / Record
  45-degree hatch / Hobby empty) — **Phase 22** (TL-01/02/03, MS-03).
- OG images still hardcoding `#e5411f` — **Phase 23**.
- Interior route sweep — **Phase 23**.
- Dark mode true inversion — **Phase 24**.

</deferred>

<scope_fence>
## Scope Fence

**Hard stop:** `src/components/home/pinboard.tsx` is not edited in this phase under any
circumstance. If a homepage change appears to require a pinboard edit, stop and flag it rather
than crossing the fence.

**Test baseline:** the only pre-existing suite failure is
`src/__tests__/pages/projects.test.tsx:188` ("renders a title-card face instead of a cover image
when project.image is non-null"), confirmed failing on `main` before Phase 20 began. It belongs to
the projects page, not the homepage, and must not be logged as a regression introduced here. The
three homepage vitest failures historically listed (`section-building` HD-04,
`explorative-homepage` TD-03/HD-05) **no longer exist in the suite** — verified during Phase 20
execution on 2026-07-21.

</scope_fence>

---

*Phase: 21-mono-homepage-rebuild*
*Context gathered: 2026-07-21 via Sketch Express Path (sketch 015 variant E)*
