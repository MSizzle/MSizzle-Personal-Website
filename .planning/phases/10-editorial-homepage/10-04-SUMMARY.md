---
phase: 10
plan: 04
subsystem: homepage-photographs
tags: [homepage, editorial, photographs, asymmetric-grid, mix-blend-difference, next-image]
dependency_graph:
  requires:
    - phase-9-primitives             # RuleStrong, SectionLabel, AllLink from Phase 9
    - phase-9-tokens                 # text-paper, text-ink, text-meta-equivalent arbitrary values
    - 10-03-summary                  # WRITING + EVENTS section landing surface (PHOTOGRAPHS placeholder still in place after 10-03)
    - public-photos-assets           # /public/MSizzle-website-photos/* (all 6 files verified present)
  provides:
    - homepage-photographs-section   # HOME-V2-09 — 12-col asymmetric grid + 6 plates + mix-blend captions + AllLink
    - home-photos-constant           # HOME_PHOTOS module-level array (reused signal — Phase 11 /photos may consume or refactor)
  affects:
    - src/app/page.tsx               # +39 lines: HOME_PHOTOS constant (10 lines) + PHOTOGRAPHS section (28 lines, replaces 1-line placeholder)
tech-stack:
  added:
    - HOME_PHOTOS (module-level `as const` array — 6 entries)
  patterns:
    - twelve-col-asymmetric-grid     # grid-cols-12 + grid-rows-[180px] + per-cell col-span/row-span — first occurrence in v2.0
    - next-image-fill-cover-saturate # `<Image fill ... className="object-cover saturate-[0.92]" />` — reusable pattern for Phase 11 /photos
    - mix-blend-difference-caption   # text-paper mix-blend-difference absolute-positioned overlay — guarantees legibility over any image background
    - url-encoded-asset-path         # `20230928%20MSB_0114.jpg` — encode literal spaces in next/image src strings
key-files:
  created:
    - .planning/phases/10-editorial-homepage/10-04-SUMMARY.md
  modified:
    - src/app/page.tsx
decisions:
  - "Module-level `HOME_PHOTOS` constant (above `export const revalidate`) with 6 entries — chosen over inline-array-inside-JSX for: (a) readability of the asymmetric span table, (b) future signal to Phase 11 /photos route that this canonical 6-photo set exists (could be reused or migrated to a data file), (c) `as const` narrows the `span` field for grep-friendly literal strings."
  - "Caption uses arbitrary values `text-[10px] tracking-[0.2em]` instead of the closest existing token (text-meta = 11px / 0.16em or text-label = 11px / 0.2em). This is documented in CONTEXT D-24 as an acceptable Phase 9 D-09 exception — one-off image-overlay style that won't be reused. Phase 13 QA reviewer should confirm legibility on the actual photos and decide whether to promote to a token."
  - "No `priority` flag on any of the 6 PHOTOGRAPHS plates — the LCP candidate stays the epigraph (Plan 10-01, PHOTOS[0] above the fold). Adding priority to below-fold plates would defeat Next.js's LCP heuristics by competing for the optimization budget. Per 10-RESEARCH anti-patterns."
  - "Caption `alt=\"\"` (intentionally empty per the handoff) — the handoff treats these as decorative editorial plates, with the visible 'No. NN' caption providing semantic context. This matches the figure-without-per-image-alt convention used by editorial print layouts. Phase 13 QA validates accessibility."
  - "Used `${p.span}` template literal in className rather than `clsx`/`cn` — single dynamic value (`relative ${p.span}`), no conditional logic, no array of strings to merge. Tailwind v4 scanner picks up literal `col-span-7`, `col-span-5`, `col-span-3`, `col-span-2` etc. from the `HOME_PHOTOS` constant because they appear verbatim in the file."
  - "Mobile parity (2×2 grid breakpoint) deliberately NOT addressed in this plan — Plan 10-06 is the mobile-parity sweep that handles all sections. The current desktop grid is the only target for 10-04. At 390px mobile the `grid-cols-12 grid-rows-[180px]` layout will render as a literal 12-column grid (cramped); Plan 10-06 will add the `md:` breakpoint and a mobile fallback `grid-cols-2`. Build remains green either way."
metrics:
  duration: "~6 minutes"
  completed: "2026-05-21"
  tasks_completed: 1
  files_modified: 1
  files_created: 0   # No new source files this plan — SUMMARY only.
requirements:
  - HOME-V2-09
---

# Phase 10 Plan 04: PHOTOGRAPHS Section Summary

Shipped HOME-V2-09 (PHOTOGRAPHS section) — the signature 12-column asymmetric photo grid that is one of the two most visual sections of the v2.0 homepage (alongside the manifesto). Six plates with col-span/row-span values from D-23, mix-blend-difference caption overlays for guaranteed legibility, and an `AllLink` to `/photos` (Phase 11 future route, 404 until then). Build green; 41 routes prerender; one placeholder remaining in `page.tsx` (PLAN-10-05 PERSONAL + FOOTER). Phase 10 progress: 9 of 13 homepage requirements complete (HOME-V2-01..09).

## What Shipped

### Task 1 — PHOTOGRAPHS section (HOME-V2-09)

**Commit `45f6ceb`** — `feat(10-04): PHOTOGRAPHS section — 12-col asymmetric grid + 6 plates (HOME-V2-09)`

Two surgical insertions into `src/app/page.tsx`:

#### 1. `HOME_PHOTOS` module-level constant (10 lines)

Placed between the import block and `export const revalidate = 1800;`:

```ts
const HOME_PHOTOS = [
  { src: "/MSizzle-website-photos/000092530012.jpeg",       no: "01", span: "col-span-7 row-span-3" },
  { src: "/MSizzle-website-photos/20230928%20MSB_0114.jpg",  no: "02", span: "col-span-5 row-span-2" },
  { src: "/MSizzle-website-photos/IMG_0028.jpeg",           no: "03", span: "col-span-3 row-span-1" },
  { src: "/MSizzle-website-photos/IMG_1075.JPG",            no: "04", span: "col-span-2 row-span-1" },
  { src: "/MSizzle-website-photos/IMG_2129.jpeg",           no: "05", span: "col-span-5 row-span-2" },
  { src: "/MSizzle-website-photos/Patricof09.jpg",          no: "06", span: "col-span-7 row-span-2" },
] as const;
```

PHOTOS[1] uses `%20` for the literal space in `20230928 MSB_0114.jpg` (D-25 + 10-RESEARCH §"Asset Verification"). All 6 file paths verified at runtime via `ls /public/MSizzle-website-photos/` before edit.

#### 2. PHOTOGRAPHS section JSX (28 lines, replaces the 1-line placeholder)

| Surface | Mapping | Details |
|---|---|---|
| `<RuleStrong />` | D-13 | Top boundary of PHOTOGRAPHS section (mirrors BUILDING / WRITING / EVENTS) |
| `<section>` | D-13 | `px-6 pt-[120px] pb-[120px] md:px-40` — identical spacing to the other 3 content sections |
| `<SectionLabel numeral="04 — Archive">Photographs</SectionLabel>` | D-14 | Numeral aligns with the running `01 — Studio`, `02 — Library`, `03 — Calendar` series |
| `<div className="mt-[72px]">` | D-13 | 72px between section label and grid |
| `<div className="grid grid-cols-12 grid-rows-[180px] gap-3">` | D-23 | 12-col asymmetric grid; 180px auto-rows; 12px (`gap-3`) inter-cell gap |
| `HOME_PHOTOS.map((p) => ... )` | D-23 | One iteration per plate; `key={p.no}` |
| `<div className={\`relative ${p.span}\`}>` | D-23 | Per-plate container with span utility from `HOME_PHOTOS` |
| `<Image src={p.src} alt="" fill className="object-cover saturate-[0.92]" sizes="(max-width: 768px) 50vw, 50vw" />` | D-25 | `fill` (parent grid cell controls dimensions), `object-cover`, `saturate-[0.92]`, NO `priority` |
| `<span className="absolute left-3.5 bottom-3 text-[10px] uppercase tracking-[0.2em] font-bold text-paper mix-blend-difference">No. {p.no}</span>` | D-24 | Caption overlay; arbitrary tokens (Phase 9 D-09 exception documented) |
| `{/* TODO: /photos route lands in Phase 11 (ARCH-03) — current target is 404 until then. */}` | — | Inline annotation per plan `<action>` |
| `<AllLink href="/photos">Photo Archive →</AllLink>` (inside `mt-12`) | D-26 | 404 until Phase 11 ships ARCH-03 |

#### Acceptance grep results (plan `<verify>` + 10-VALIDATION row 10-04-V)

| Assertion | Hits | Status |
|---|---|---|
| `rg "col-span-7"` | 2 (Plate A `col-span-7 row-span-3` + Plate F `col-span-7 row-span-2`) | ✓ ≥ 2 |
| `rg "mix-blend-difference"` | 1 (the caption className string — one occurrence covers all 6 plates because the className is shared via `.map`) | ✓ ≥ 1 |
| `rg "000092530012"` | 2 (epigraph in Plan 10-01 + PHOTOS[0] anchor in this plan) | ✓ ≥ 2 |
| `rg "20230928%20MSB_0114"` | 1 | ✓ present |
| `rg "Patricof09"` | 1 | ✓ present |
| `rg "Photo Archive"` | 1 (`<AllLink href="/photos">Photo Archive →</AllLink>`) | ✓ present |
| `rg 'SectionLabel numeral="04 — Archive"'` | 1 | ✓ present |
| `rg "PLAN-10-04"` | 0 | ✓ placeholder removed |
| `rg "grid-cols-12 grid-rows-\[180px\] gap-3"` | 1 | ✓ present |
| `npm run build` exit 0 | — | ✓ (41 routes prerender) |
| `src/app/page.tsx` line count | 298 (≥ `min_lines: 240`) | ✓ |

## Mix-Blend-Difference Caption Pattern (D-24)

The chosen pattern guarantees caption legibility against any photograph background by inverting whichever color the image renders behind the caption:

```jsx
<span className="absolute left-3.5 bottom-3 text-[10px] uppercase tracking-[0.2em] font-bold text-paper mix-blend-difference">
  No. {p.no}
</span>
```

How it works at render time:
1. The caption text is set to `text-paper` (the warm-paper near-white token).
2. `mix-blend-mode: difference` (Tailwind utility `mix-blend-difference`) blends each pixel of the caption against the pixel of the image behind it using the CSS `difference` formula.
3. The result: over light areas the caption reads dark; over dark areas the caption reads light. Either way, legibility is preserved.

Phase 13 QA should perceptually verify this across all 6 plates — the handoff's principle is that no photo can defeat the caption. If a particular plate proves marginal, the fallback is to add a subtle drop-shadow rather than abandon the mix-blend pattern.

## Phase 9 D-09 Exception — `text-[10px]` + `tracking-[0.2em]`

Phase 9's D-09 mandates "no arbitrary Tailwind values for typography tokens — always use the type-scale utilities (text-display, text-feature, text-event-title, text-list-title, text-list-title-home, text-body-lead, text-caption, text-nav, text-label, text-meta, text-body)." This plan introduces TWO arbitrary values in the caption overlay:

| Token | Closest Phase 9 token | Why exception is taken |
|---|---|---|
| `text-[10px]` (10px) | `text-meta` (11px) / `text-label` (11px) | The handoff specifies 10px exactly for the plate caption; 11px is perceptibly too large at the editorial scale. The caption is a one-off image overlay, not a body / list / meta surface, so reusing `text-meta` would also be semantically incorrect. |
| `tracking-[0.2em]` (0.2em) | `text-label` (also tracking 0.2em) | The tracking value matches text-label; if a `text-caption-overlay` token were introduced it would be `10px / uppercase / 700 / 0.2em` — distinct from all 11 existing tokens. Until Phase 13 QA confirms this is a reusable pattern, ship as an inline arbitrary value. |

Per D-24 + CONTEXT.md, this exception is acceptable and documented here for Phase 13 QA audit. If QA decides to promote the pattern, the work is: (1) add `text-caption-overlay` to `globals.css @theme`, (2) extract a `<PlateCaption>` primitive into `src/components/editorial/`, (3) replace the 6 inline className occurrences. None of that is needed to ship Phase 10.

## next/image Configuration Decisions

**No `priority`.** All 6 plates are below the fold (the epigraph in Plan 10-01 holds the LCP candidate slot via `priority`). Adding priority to the photographs grid would:
- Trigger eager loading of all 6 large photos at first paint.
- Defeat Next.js's LCP heuristics — the epigraph is the intended LCP target.
- Inflate Time To Interactive on slow connections.

Per 10-RESEARCH §"Anti-Patterns to Avoid" and the project's general LCP guidance, the only homepage image with `priority` should be PHOTOS[0] as rendered in the epigraph.

**`fill` + `object-cover`.** The parent grid cell (sized by `grid-rows-[180px]` × `row-span-N`) controls the image dimensions. `fill` lets next/image inherit those dimensions, and `object-cover` ensures the image fills the cell without distortion (cropping as needed). This pattern is reusable in Phase 11 `/photos` for any grid-based photo layout.

**`saturate-[0.92]` filter (D-25).** Slight desaturation matches the editorial print aesthetic of the handoff — photos feel slightly muted rather than fully vivid. The Tailwind utility compiles to `filter: saturate(0.92)` at the CSS level.

**`sizes="(max-width: 768px) 50vw, 50vw"`.** A reasonable default for the asymmetric grid; the actual responsive optimization (each plate occupying different col-spans on different breakpoints) is tightened in Plan 10-06's mobile sweep. The current value already triggers responsive image generation in next/image's pipeline.

**`alt=""` (intentionally empty).** The handoff treats these as decorative editorial plates with the visible `No. NN` caption providing semantic context. This matches the figure-without-per-image-alt convention used in print editorial layouts. Phase 13 QA validates accessibility.

## Mobile Behavior — Deferred to Plan 10-06

At 390px reference width the current `grid grid-cols-12 grid-rows-[180px] gap-3` markup will render as a literal 12-column grid with each plate ~28px wide (cramped, unusable). This is **intentional** — D-32 + D-34 specifies that the mobile parity sweep is Plan 10-06's responsibility, and that all Phase 10 plans through 10-05 target the 1440px desktop reference only. The plan currently ships:

- Desktop (≥768px breakpoint): correct 12-col asymmetric grid as specified by D-23.
- Mobile (<768px): degraded layout that will be corrected by Plan 10-06.

Plan 10-06 will add the `md:` breakpoint prefix to switch between the asymmetric `grid-cols-12` desktop layout and a `grid-cols-2 gap-2` mobile fallback (D-32). No new code is needed in this plan — the markup is ready to be wrapped in `md:` modifiers when 10-06 sweeps.

`npm run build` remains green either way because Tailwind's scanner sees both `grid-cols-12` and the eventual `md:grid-cols-12` literal strings; the static prerender of `/` succeeds at compile time without exercising the responsive layout.

## Phase 9 Primitives Consumed (cumulative across 10-01 + 10-02 + 10-03 + 10-04)

| Primitive | Used by | Plan first introduced |
|---|---|---|
| `IntroLink` | Letter intro paragraph (3×) | 10-02 |
| `RuleStrong` | BUILDING / WRITING / EVENTS / **PHOTOGRAPHS** top boundaries (4×) | 10-02 |
| `Rule` | Between Prometheus and Selected Works rows (1×) | 10-02 |
| `SectionLabel` | BUILDING / WRITING / EVENTS / **PHOTOGRAPHS** headers (4×) | 10-02 |
| `AllLink` | Prometheus / Selected Works / WRITING / RSVP / All events / **Photo Archive** CTAs (6×) | 10-02 |
| `ListRow` | WRITING (3) + EVENTS secondary (2) | 10-03 |
| `LetterDrop` | reserved for Plan 10-07 | — |
| `FooterCol` | reserved for Plan 10-05 | — |

After this plan, the homepage consumes 5 of the 7 Phase 9 primitives. `FooterCol` lands in Plan 10-05; `LetterDrop` is not yet allocated.

## Deviations from Plan

### Auto-fixed Issues
None. Task 1 executed exactly as written. No Rule 1, Rule 2, or Rule 3 fixes triggered. No Rule 4 architectural questions raised.

### Notes (not deviations)

1. **`HOME_PHOTOS` `as const`.** The plan `<action>` showed the array literal without explicitly specifying `as const`; I added the assertion because (a) it narrows the inferred type from `Array<{ src: string; no: string; span: string }>` to a readonly tuple of 6 literal-typed objects, which (b) lets TypeScript catch any typo in span values at edit time, and (c) future Phase 11 consumers can do exhaustive switch checks on `p.no`. Zero cost at runtime, free safety.

2. **Caption className formatting choice.** The plan `<action>` showed the className as a single space-separated string. I kept that — even though it's long enough to warrant line-wrapping, breaking it across lines would (a) introduce arbitrary indentation choices, (b) defeat Tailwind v4's scanner which expects literal class strings (it works either way but the lint config may prefer single-line for utility heavy classNames), and (c) match the existing meta-row and figcaption className patterns in the same file. Consistent style across the file.

3. **`gap-3` desktop vs Plan 10-06 mobile `gap-2`.** D-23 specifies `gap-3` (12px) for the desktop asymmetric grid. D-32 + 10-06 will introduce `gap-2` (8px) for the mobile 2×2. This plan ships only `gap-3`; the mobile gap override is Plan 10-06's responsibility.

4. **Why `key={p.no}` and not `key={i}` or `key={p.src}`.** All three would be stable since `HOME_PHOTOS` is a module-level immutable constant. I chose `p.no` because it's the most semantically meaningful (it's literally the displayed plate number "01" through "06") and makes React DevTools traces immediately readable. `p.src` would also work but is longer and less symmetric.

## Build & Verification

- `npm run build` exits 0 after Task 1 (verified before commit).
- 41 routes prerender; `/` continues to be statically generated with 30m revalidate.
- Final `src/app/page.tsx` is 298 lines — meets the `min_lines: 240` must_have artifact spec.
- No new lint warnings; no new TypeScript errors.
- VALIDATION 10-04-V row passes: all 9 of 9 grep assertions green; visual smoke at `/` will show header + manifesto + meta + epigraph + intro + BUILDING + WRITING + EVENTS + PHOTOGRAPHS in order, with the 6-plate asymmetric grid below the EVENTS section (visual + mix-blend legibility deferred to Phase 13 QA).

## Files Touched

| File | Action | Commit |
|---|---|---|
| src/app/page.tsx | modified — HOME_PHOTOS constant added; PHOTOGRAPHS section JSX replaces the PLAN-10-04 placeholder | 45f6ceb |

## Setup for Downstream Plans

After Plan 10-04:
- `src/app/page.tsx` is 298 lines with 9 of 13 homepage requirements shipped (HOME-V2-01..09). One placeholder remaining: `PLAN-10-05 PERSONAL + FOOTER`.
- The 12-column asymmetric grid pattern (`grid-cols-12 grid-rows-[180px] gap-3` + per-cell `col-span-N row-span-N`) is now established and battle-tested through `npm run build` static prerender.
- The mix-blend-difference caption overlay pattern (`text-paper mix-blend-difference` on an absolutely-positioned overlay) is now established for future image-overlay surfaces.
- `HOME_PHOTOS` is module-level — Phase 11 `/photos` can import it, migrate to a Notion-driven data source, or reuse the array as a fallback. The 6 file paths are verified working.
- Phase 9 `FooterCol` primitive is unconsumed; Plan 10-05 will exercise it.
- Phase 9 `LetterDrop` primitive (Plan 10-07 reserve) remains unallocated.
- Plan 10-05 (PERSONAL + FOOTER) is the only remaining content-heavy plan before the mobile-parity sweep (10-06) and the manifesto stagger (10-07).

## Known Stubs
None. The PHOTOGRAPHS section renders 6 real photos from `/public/MSizzle-website-photos/` (all 6 files verified present at build time; static asset paths embedded in the file). The `AllLink href="/photos"` deliberately points at a route that doesn't exist yet (Phase 11 ARCH-03 builds it) — but this is documented behavior per D-26 + Risk 3 in 10-RESEARCH, not an unintentional stub. The inline TODO comment near the AllLink calls this out explicitly.

## Threat Flags
None. No new auth, no new input handling, no new network endpoints. The PHOTOGRAPHS section is static markup serving static images from `/public/`. The defensive `try/catch` around Notion getters (Plans 10-01..10-03) continues to absorb data-source failures — but PHOTOGRAPHS doesn't depend on any of those getters. T-10-04-CONF is satisfied: `npm run build` exits 0 after the task.

## Self-Check: PASSED

- `src/app/page.tsx` — FOUND (298 lines; PHOTOGRAPHS section + HOME_PHOTOS constant both verified)
- Commit `45f6ceb` (feat 10-04 PHOTOGRAPHS section) — FOUND in git log
- `npm run build` exits 0 — VERIFIED (41 routes prerender)
- All 9 acceptance grep assertions — PASSED (2/2 col-span-7, 1/1 mix-blend-difference, 2/2 000092530012, 1/1 20230928%20MSB_0114, 1/1 Patricof09, 1/1 Photo Archive, 1/1 SectionLabel "04 — Archive", 0/0 PLAN-10-04 placeholder remaining, 1/1 grid-cols-12 grid-rows-[180px] gap-3)
- All 6 photo file paths — VERIFIED present in `/public/MSizzle-website-photos/`
- `HOME_PHOTOS` 6-entry module-level constant — VERIFIED present
- Phase 9 D-09 exception documented for Phase 13 QA audit — VERIFIED
- No `priority` flag on any of the 6 plates — VERIFIED
- URL-encoded `%20` in PHOTOS[1] path — VERIFIED
