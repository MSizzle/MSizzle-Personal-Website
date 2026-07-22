# Phase 22: Things I Love in Mono - Context

**Gathered:** 2026-07-22
**Status:** Ready for planning
**Mode:** `--auto` (all gray areas auto-resolved to the recommended option; see `22-DISCUSSION-LOG.md` for alternatives considered)

<domain>
## Phase Boundary

Recolor the Things I Love pinboard so it belongs to the v4 mono system, and close out
`prefers-reduced-motion` across every animation that survived Phase 21's motion subtraction.

**In scope:**
- `src/components/home/pinboard.tsx` — the `SWATCHES` array and any per-type class/markup needed
  for hue-free type distinction. **Palette and reduced-motion only.**
- `src/app/globals.css` — the `.pb-*` block (lines ~1014-1275) and the reduced-motion guards at
  lines 807, 943-960, 1188-1195, 1262-1272.
- A site-wide reduced-motion audit: every remaining animation on the site degrades to a static,
  fully usable state under `prefers-reduced-motion: reduce`.
- `src/__tests__/home/pinboard.test.tsx` — extended with mono + reduced-motion assertions.

**Explicitly OUT of scope:**
- **Any behavioural change to the pinboard.** No rewrite, no restructure, no refactor of the
  749-line component. Scatter across three start lines, drag, click-to-slide-note, per-type card
  kinds, Organize-by-topic, and the sub-760px tappable-stack downgrade all stay byte-for-byte
  equivalent in behaviour (TL-01 is a *preservation* requirement).
- Interior routes and OG images — Phase 23.
- Dark mode / true inversion — Phase 24.
- Any new pinboard feature (filtering, sorting, search, new card types).

**Already done upstream — verify, do not redo:** Phase 20 tokenized most of the `.pb-*` block.
`.pb-frame--cream` is already `#ffffff` (globals.css:1061) and `.pb-note` already uses
`var(--color-invert)` (globals.css:1123), which is black post-Phase-20. The only live color left
in the pinboard is the `SWATCHES` array in `pinboard.tsx:119`.

</domain>

<decisions>
## Implementation Decisions

### Greyscale swatch scale (TL-02)

- **D-01:** Replace `SWATCHES = ["#8f9e86", "#7c93a6", "#b9805f", "#c9a14e", "#a49e93", "#8a6f82"]`
  (`pinboard.tsx:119`) with **six greys, keeping the array at exactly six entries**. Array length
  feeds `Math.abs(hashId(item.id)) % SWATCHES.length` (`pinboard.tsx:142`); changing the length
  reshuffles which item gets which swatch. Length stays 6, index math untouched.
- **D-02:** All six greys sit in the **dark half of the range (~`#141414` to `#6e6e6e`)**, not
  spread across the full scale. Reason: `.pb-book-title` and `.pb-book-author` render in
  `--color-text-inverse` / `rgba(255,255,255,0.82)` **on top of the media area**
  (globals.css:1082-1086). A light-grey swatch fallback would make a coverless Book card's title
  unreadable. The old muted colors were already marginal here; the mono pass must not make it
  worse. Contrast of white-on-swatch must be checked, not assumed.
- **D-03:** The swatch is a **fallback only** — it renders when `coverSrc()` returns null
  (`pinboard.tsx:145-152`). It is not a type signal and must not carry type meaning (see D-05).

### Cover photography stays in color (TL-02 boundary)

- **D-04:** **Do NOT apply `filter: grayscale()` to `.pb-img`.** Book/film covers, YouTube
  thumbnails, and Notion page covers stay in full color. Phase 23's Success Criterion 4 explicitly
  names Things I Love cards as *content* photography that survives the mono lock. TL-02 names
  three targets and only three: the `SWATCHES` array, `.pb-frame--cream`, and the note panel.
  Greyscaling the covers is out of scope and would flatten the board's only remaining content.

### Type distinction without hue (TL-03)

- **D-05:** Distinction is carried by **shipped card geometry + a per-type border-weight ramp on
  `.pb-frame`**, not by fill or pattern. The geometry already differs per type and is doing most
  of the work today: Place is a polaroid (210x150 media + caption plate), Book/Movie are 150px
  portrait covers with a `.pb-foot` rule, YouTube is a 260px landscape card with the play glyph,
  Thing is a 200px card with aspect-preserving media. Phase 22 adds a deliberate border-weight
  ramp on top so the difference survives at a glance and at speed.
- **D-06:** **Reject the fill-weight scheme** sketched in `21-CONTEXT.md`'s deferred note
  ("Book solid black / Film light grey / Record 45-degree hatch / Hobby empty"). Two reasons:
  (a) it names types that do not exist — `LoveType` is
  `"Place" | "Book" | "Movie" | "YouTube" | "Thing"` (`src/lib/notion-loves.ts:34`); there is no
  Record and no Hobby type; (b) a 45-degree hatch is decorative texture, which reads as noise on a
  board that already carries real photography.
- **D-07:** Roadmap Success Criterion 3's nominal names map to the shipped union as:
  **Book → Book, Film → Movie, Record → YouTube (tagged "Watch"), Hobby → Thing.** Plan and verify
  against the shipped five (`Place`, `Book`, `Movie`, `YouTube`, `Thing`), not the roadmap's four
  nominal names.
- **D-08:** The existing `.pb-tag` uppercase label (`Read` / `Film` / `Watch` / `Thing` / `Place`,
  from `tagFor()` at `pinboard.tsx:131`) stays as the literal fallback distinguisher. Shape and
  border weight are the visual language; the tag is the guarantee.

### Dead cream affordance

- **D-09:** `.pb-frame--cream { background: #ffffff; }` (globals.css:1061) is now a **no-op** —
  `.pb-frame` already has `background: var(--color-bg)`, which is `#ffffff`. Delete the rule and
  the `--cream` modifier from `pinboard.tsx` rather than leave a class whose name lies about what
  it does. Verify it is genuinely a no-op before deleting; if `--color-bg` ever differs from
  `#ffffff` on any surface, keep the rule and rename it instead.
- **D-10:** `.pb-note` already resolves to black via `var(--color-invert)`. **No change** — add a
  regression assertion instead so a future edit cannot quietly reintroduce a hue there.

### Reduced motion (MS-03)

- **D-11:** Keep the shipped **two-track mechanism**: the `@media (prefers-reduced-motion: reduce)`
  query is the contract, and the `body.no-motion` class stays as a JS-togglable escape hatch.
  Audit finding: **nothing in `src/` ever sets `body.no-motion`** — it appears only in CSS
  (globals.css:950, 1189-1190, 1265-1266). Leave the hook in place (it is harmless and useful for
  tests) but **do not build a user-facing motion toggle** — that would be a new capability.
- **D-12:** MS-03 is a **site-wide** requirement, not a pinboard-only one. Enumerate every
  animation and transition that survived Phase 21's motion subtraction (the single slow
  opacity fade-up on scroll, the hover row inversion, plus the whole pinboard set) and confirm each
  has a reduced-motion path. Every guard must degrade to **static and fully usable**, never to
  hidden or unreachable.
- **D-13:** The pinboard's reduced-motion set to verify explicitly: scatter/gather
  (`.pb-card.pb-anim`), riffle (`.pb-card.pb-riffle`), the note slide (`.pb-note` transform), the
  frame box-shadow transition (`.pb-frame`), and the JS branch at `pinboard.tsx:381` that reads
  `matchMedia("(prefers-reduced-motion: reduce)")`. Under reduce, cards must land in their final
  positions instantly and drag must still work.

### Verification split

- **D-14:** **Vitest** covers the assertable: `SWATCHES` contains only greys, no non-grey hex
  literal survives anywhere in `pinboard.tsx`, per-type classes still render for all five
  `LoveType` values, and the reduced-motion rules exist. **Human UAT** covers behaviour parity —
  scatter across three start lines, drag, click-to-slide-note, Organize-by-topic, and the sub-760px
  tappable stack with the toolbar hidden. Behaviour parity is a human judgement call; do not claim
  it from a passing suite.
- **D-15:** **Test baseline.** The only pre-existing suite failure is
  `src/__tests__/pages/projects.test.tsx:188` ("renders a title-card face instead of a cover image
  when project.image is non-null"), confirmed failing on `main` before Phase 20 began. It belongs
  to the projects page and must not be logged as a regression introduced here.

### Diff discipline

- **D-16:** This phase is a palette + reduced-motion pass on 749 lines of shipped, working code.
  Keep the diff tight. **If any change appears to require restructuring `pinboard.tsx`, stop and
  flag it rather than proceeding** — that is the signal that the scope fence is being crossed.

### Claude's Discretion

- Exact six grey hex values, within the D-02 dark-half constraint.
- The exact border-weight ramp per card type (which type gets which weight), so long as the five
  shipped types are mutually distinguishable by shape + weight alone.
- Test file structure and how the "no non-grey hex" assertion is implemented.
- Whether the site-wide MS-03 audit lands as a separate plan or folds into the pinboard plan.

</decisions>

<canonical_refs>
## Canonical References

**Downstream agents MUST read these before planning or implementing.**

### Phase definition
- `.planning/ROADMAP.md` §"Phase 22: Things I Love in Mono" (lines 104-119) — goal, four success
  criteria, and the "do not schedule a pinboard rewrite" sequencing note.
- `.planning/REQUIREMENTS.md` — TL-01 (line 33), TL-02 (line 34), TL-03 (line 35), MS-03 (line 30).

### Upstream phase decisions
- `.planning/phases/21-mono-homepage-rebuild/21-CONTEXT.md` — the preservation fence that kept
  `pinboard.tsx` untouched, and the `<deferred>` note that seeded this phase. **Note its
  fill-weight proposal is explicitly rejected here — see D-06.**
- `.planning/phases/20-mono-token-foundation/20-CONTEXT.md` — the mono token decisions this phase
  consumes.
- `.planning/phases/20-mono-token-foundation/20-VERIFICATION.md` — what actually shipped in the
  token pass, including which `.pb-*` rules were already converted.
- `.planning/phases/20-mono-token-foundation/20-PATTERNS.md` — analog files and code excerpts.

### Design contract
- `.planning/sketches/015-mono-passive-home/README.md` — variant E lock; the pinboard is kept but
  recolored.
- `.planning/sketches/themes/mono.css` — defines **no `--color-accent`**, so anything that
  secretly needs a hue breaks visibly.
- `.planning/sketches/012-things-i-love-pinboard/` — the pinboard's origin sketch; read for the
  intent behind the card kinds before altering how they read.
- `.planning/sketches/013-loves-shuffle-draw/` — the shuffle/draw behaviour layer
  (`.pb-riffle`, `.pb-drawn`, `.pb-dim`, `.pb-peek`) that must survive intact.

### Code under change
- `src/components/home/pinboard.tsx` — 749 lines. `SWATCHES` at line 119; swatch index math at
  line 142; `tagFor()` at line 131; the reduced-motion branch at line 381; the mobile breakpoint
  check at line 267.
- `src/app/globals.css` lines ~1014-1275 — the full `.pb-*` block, including `.pb-frame--cream`
  (1061), `.pb-note` (1121-1135), and the reduced-motion guards (1188-1195, 1262-1272).
- `src/app/globals.css` lines 807, 943-960 — the site-wide reduced-motion guards MS-03 extends.
- `src/lib/notion-loves.ts:34` — the authoritative `LoveType` union.
- `src/__tests__/home/pinboard.test.tsx` (87 lines) and `src/__tests__/home/section-loves.test.tsx`
  — the existing coverage this phase extends.

### Standing site rules
- `.planning/sketches/MANIFEST.md` §"CURRENT Homepage Direction (2026-07-20)".
- No gradients anywhere; depth via hard offset solid shadows (the `.pb-frame` `box-shadow:
  7px 7px 0` idiom already follows this). No em dashes in user-visible copy.

</canonical_refs>

<code_context>
## Existing Code Insights

### Reusable Assets
- **Mono token layer (Phase 20):** `--color-bg`, `--color-text`, `--color-invert`,
  `--color-text-inverse`, `--color-text-muted`. Most of the `.pb-*` block already consumes these,
  so the mono pass is mostly *verification* plus the one `SWATCHES` change.
- **Existing reduced-motion guards:** four separate blocks already exist in `globals.css` (807,
  955, 1191, 1269) plus the `body.no-motion` track. MS-03 extends this pattern; it does not invent
  a new mechanism.
- **`tagFor()`** (`pinboard.tsx:131`) already produces a per-type text label — the TL-03 fallback
  is already shipped and free.

### Established Patterns
- Card geometry is defined per type in CSS (`.pb-card--place|book|movie|youtube|thing`), so type
  distinction can be strengthened entirely in the stylesheet without touching the component's
  behaviour code.
- The component is deliberately imperative (direct DOM transforms, `will-change: transform`) for
  drag performance. Do not React-ify any part of it in service of a palette change.

### Integration Points
- `src/components/home/section-loves.tsx` renders the pinboard and owns the surrounding band
  chrome (already converted in Phase 21). Phase 22 should not need to touch it.
- `/api/notion-cover` proxies Notion covers; unchanged by this phase (see D-04).

### Audit findings surfaced during scout
- `SWATCHES` (`pinboard.tsx:119`) is **the last live color in the pinboard**.
- `.pb-frame--cream` is already a no-op (`background: #ffffff` on an element whose base background
  is already `var(--color-bg)` = `#ffffff`).
- `body.no-motion` is **referenced in CSS but never set anywhere in `src/`** — the media query is
  doing all the real work today.

</code_context>

<specifics>
## Specific Ideas

- Success Criterion 3's phrasing — "tell a Book from a Film from a Record from a Hobby by shape and
  border weight alone" — names **border weight explicitly**. The ramp is a requirement, not an
  option, and it is the reason D-06 rejects the fill/hatch alternative.
- A coverless Book card is the legibility trap: white title type sits directly on the swatch. This
  is the single case that constrains the grey scale (D-02).
- Under 760px the board degrades to a tappable stack with the toolbar hidden and cards locked to
  `rotate(var(--pb-r, -2deg))`. That is shipped behaviour and must come through this phase
  unchanged.
- "Identical to production" in Success Criterion 1 means the plan should include a before/after
  behavioural walkthrough, not just a visual diff.

</specifics>

<deferred>
## Deferred Ideas

- **Greys under dark mode** — the six greys in D-01/D-02 are chosen against a white ground with
  white overlay type on Book cards. When Phase 24 inverts the site, that contrast relationship
  flips and the swatch scale will need re-derivation. Note it for **Phase 24**, do not solve it
  here.
- **Interior route sweep and Notion inline text colors** — **Phase 23**.
- **OG images still hardcoding `#e5411f`** — **Phase 23**.
- **A user-facing motion toggle** driving `body.no-motion` — a new capability, not part of MS-03.
  Backlog, no phase assigned.
- **Pinboard feature work** (filtering, search, new card types) — out of the v4.0 milestone
  entirely; v4.0 is a restyle of a working site.

</deferred>

<scope_fence>
## Scope Fence

**Hard stop:** `src/components/home/pinboard.tsx` gets a palette change and reduced-motion
verification. Nothing else. No rewrite, no refactor, no behavioural "improvement" discovered along
the way. If a mono change appears to require restructuring the component, stop and flag it.

**Test baseline:** the only pre-existing suite failure is `src/__tests__/pages/projects.test.tsx:188`
(projects page, confirmed failing on `main` before Phase 20). It must not be attributed to this
phase.

</scope_fence>

---

*Phase: 22-things-i-love-in-mono*
*Context gathered: 2026-07-22 via `/gsd-discuss-phase 22 --auto`*
