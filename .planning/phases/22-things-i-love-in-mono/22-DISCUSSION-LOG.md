# Phase 22: Things I Love in Mono - Discussion Log

> **Audit trail only.** Do not use as input to planning, research, or execution agents.
> Decisions are captured in CONTEXT.md — this log preserves the alternatives considered.

**Date:** 2026-07-22
**Phase:** 22-things-i-love-in-mono
**Mode:** `--auto` — no questions were put to Monty. Every area below was resolved to the
recommended option and logged for review.
**Areas discussed:** Swatch greyscale scale, Cover photography treatment, Type distinction without
hue, Reduced-motion scope and mechanism, Verification split

---

## Swatch greyscale scale

| Option | Description | Selected |
|--------|-------------|----------|
| Six greys, dark half, array length unchanged | Swap the six hexes for greys in `#141414`-`#6e6e6e`, leave `hashId % length` alone | ✓ |
| Six greys spread across the full 0-100% range | Wider tonal variety on the board | |
| Collapse to a single grey | Simplest possible; every coverless card identical | |
| Key the swatch to card type instead of item hash | Makes the swatch a type signal | |

**Auto-selected:** Six greys, dark half, array length unchanged (recommended default)
**Notes:** Array length is load-bearing — `Math.abs(hashId(item.id)) % SWATCHES.length`
(`pinboard.tsx:142`) reshuffles every item's swatch if the count changes. The dark-half constraint
comes from `.pb-book-title` rendering white type directly on the media area
(globals.css:1082-1086); a light swatch makes a coverless Book card unreadable. Type-keying was
rejected because TL-03 assigns type distinction to shape and border weight, not fill.

---

## Cover photography treatment

| Option | Description | Selected |
|--------|-------------|----------|
| Covers stay in full color | Mono applies to chrome and swatch fallbacks only | ✓ |
| `filter: grayscale(1)` on `.pb-img` | Total board desaturation | |
| Grayscale at rest, color on hover | Reveal-on-interaction | |

**Auto-selected:** Covers stay in full color (recommended default)
**Notes:** Phase 23 Success Criterion 4 explicitly names Things I Love cards as *content*
photography that survives the mono lock. TL-02 names exactly three targets — the `SWATCHES` array,
`.pb-frame--cream`, and the note panel — and covers are not among them. Hover-to-color was rejected
as new motion in a milestone that is subtracting motion.

---

## Type distinction without hue (TL-03)

| Option | Description | Selected |
|--------|-------------|----------|
| Shipped geometry + per-type border-weight ramp | Keep the five card shapes, add a deliberate weight ramp on `.pb-frame` | ✓ |
| Fill-weight scheme from `21-CONTEXT.md` | Book solid black / Film light grey / Record hatch / Hobby empty | |
| Per-type corner or edge treatment | Notched, torn, or clipped edges per type | |

**Auto-selected:** Shipped geometry + per-type border-weight ramp (recommended default)
**Notes:** Success Criterion 3 names border weight literally, which settles it. The
`21-CONTEXT.md` fill-weight proposal was rejected on two counts: it names types that do not exist
(`LoveType` is `Place | Book | Movie | YouTube | Thing` — no Record, no Hobby), and a 45-degree
hatch reads as decorative noise on a board already carrying real photography. Roadmap names map as
Book→Book, Film→Movie, Record→YouTube, Hobby→Thing. The existing `.pb-tag` label
(`tagFor()`, `pinboard.tsx:131`) stays as the literal fallback.

---

## Reduced-motion scope and mechanism (MS-03)

| Option | Description | Selected |
|--------|-------------|----------|
| Keep both tracks, audit site-wide, no new toggle | Media query is the contract; `body.no-motion` stays as a test hook | ✓ |
| Pinboard-only pass | Treat MS-03 as scoped to this component | |
| Add a user-facing motion toggle | Wire `body.no-motion` to a control | |

**Auto-selected:** Keep both tracks, audit site-wide, no new toggle (recommended default)
**Notes:** MS-03 reads "across every remaining animation, including the pinboard" — pinboard-only
would under-deliver. Audit finding: `body.no-motion` is referenced in four CSS rules
(globals.css:950, 1189-1190, 1265-1266) but is **never set by any code in `src/`**; the media query
does all the real work today. The hook stays (harmless, useful in tests); building a UI toggle
would be a new capability and belongs in the backlog.

---

## Verification split

| Option | Description | Selected |
|--------|-------------|----------|
| Vitest for the assertable, human UAT for behaviour parity | Suite proves greyscale and rules exist; Monty judges "identical to production" | ✓ |
| Vitest only | Ship on a green suite | |
| Add Playwright visual regression | Snapshot the board before/after | |

**Auto-selected:** Vitest for the assertable, human UAT for behaviour parity (recommended default)
**Notes:** "Identical to production" (Success Criterion 1) covers scatter, drag, note slide,
Organize-by-topic, and the sub-760px stack — behaviour a unit suite cannot honestly certify.
Playwright is not in the stack and adding it is its own phase. Test baseline: the only pre-existing
failure is `src/__tests__/pages/projects.test.tsx:188`, confirmed failing on `main` before Phase 20.

---

## Claude's Discretion

- Exact six grey hex values, within the dark-half constraint.
- Which card type gets which border weight in the ramp.
- Test file structure and how "no non-grey hex survives" is asserted.
- Whether the site-wide MS-03 audit is a separate plan or folds into the pinboard plan.

## Deferred Ideas

- Re-deriving the grey scale for dark mode — **Phase 24** (the white-overlay-on-swatch contrast
  relationship inverts).
- Interior route sweep, Notion inline text colors, OG images — **Phase 23**.
- A user-facing motion toggle driving `body.no-motion` — backlog, no phase.
- Pinboard feature work (filtering, search, new card types) — outside the v4.0 restyle milestone.
