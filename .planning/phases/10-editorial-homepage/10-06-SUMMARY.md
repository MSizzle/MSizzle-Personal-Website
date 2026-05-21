---
phase: 10
plan: 06
subsystem: homepage-mobile-parity
tags: [homepage, editorial, mobile, responsive, manifesto, tap-targets, dual-h1]
dependency_graph:
  requires:
    - 10-05-summary                  # Desktop homepage feature-complete (page.tsx at 403 lines)
    - phase-9-tokens                 # text-display + arbitrary text-[56px] override + border-footer-rule
    - phase-9-primitives             # FooterCol (consumed) — wrapper divs go around primitives, no primitive edits
  provides:
    - homepage-mobile-parity         # HOME-V2-12 — 390px reference width renders single-column with 3-line manifesto, 2×2 photo grid, divided footer columns, 44px tap targets
    - mobile-manifesto-line-array    # Plan 10-07 inherits the 3-line mobile array ["BRING", "FIRE TO", "HUMANITY."] when wiring <ManifestoReveal> with matchMedia
    - per-plate-className-pattern    # HOME_PHOTOS refactor — each entry's full className contains literal md:col-span-N md:row-span-M tokens for Tailwind v4 scanner detection
  affects:
    - src/app/page.tsx               # +60 / -45 lines net; 15 net additions
tech-stack:
  added:
    - "arbitrary-value Tailwind classes: text-[56px] leading-[0.96] tracking-[-0.045em] on mobile manifesto h1 (D-32 documented exception — manifesto-only)"
    - "min-h-11 utility for 44px tap-target compliance on header nav + footer socials (9 hits)"
  patterns:
    - dual-h1-responsive-toggle      # Two h1 blocks (`hidden md:block` desktop + `block md:hidden` mobile) — pattern Plan 10-07 will collapse into one <ManifestoReveal> with matchMedia
    - per-plate-static-className-array  # Tailwind v4 scanner-friendly approach: store full className strings (including md: prefixes) directly in HOME_PHOTOS entries, NOT computed via interpolation
    - per-column-mobile-divider      # `border-b border-footer-rule pb-6 md:border-b-0 md:pb-0` wrapper around each grid child — collapses to single column with hairline dividers on mobile only
key-files:
  created:
    - .planning/phases/10-editorial-homepage/10-06-SUMMARY.md
  modified:
    - src/app/page.tsx
decisions:
  - "Used the dual-h1 approach (two `<h1>` blocks, hidden/visible toggles) for the desktop/mobile manifesto split rather than a single h1 with responsive line-array prop. Rationale: the manifesto is currently static markup (Plan 10-01); introducing a client component here would force a useState/matchMedia render path before MOTION-07 (Plan 10-07) actually needs one. Plan 10-07 replaces BOTH static h1s with a single `<ManifestoReveal>` client component that uses matchMedia internally to pick `['BRING', 'FIRE TO', 'HUMANITY.']` vs `['BRING FIRE', 'TO HUMANITY.']` based on viewport. The dual-h1 here is intentional staging that 10-07 collapses."
  - "Mobile manifesto uses arbitrary Tailwind values `text-[56px] leading-[0.96] tracking-[-0.045em] font-bold` instead of introducing a new `text-mobile-display` token. Per D-32 the mobile manifesto size is a deliberate one-off override (the 56px / 0.96 / -0.045em / 700 combination only fits one element on the entire site — the manifesto). Promoting it to a token would create a single-consumer utility, which is exactly the Phase 9 D-09 arbitrary-value exception case. Documented in the plan SUMMARY as the second arbitrary-value exception in v2.0 (first was Plan 10-04's `text-[10px] tracking-[0.2em]` photo caption overlay)."
  - "HOME_PHOTOS refactored to store FULL className strings (including md: prefixes) per entry rather than a `span` substring. Tailwind v4 detects utility classes by literal string scan at build time — dynamic interpolation like `` `relative md:${p.span}` `` would NOT generate the underlying CSS because `md:${variable}` isn't a literal token in the source. By moving each plate's complete `relative aspect-square md:aspect-auto md:col-span-N md:row-span-M` className into the constant, every token appears as a literal string in `page.tsx`, and the scanner picks them up. This is the canonical Tailwind v4 dynamic-className pattern."
  - "Added `aspect-square md:aspect-auto` to each plate's className. Mobile layout uses `grid-cols-2 gap-2` (no `grid-rows-[180px]`), so without an explicit aspect ratio the plate would have zero height (the `<Image fill>` needs an explicitly sized parent). `aspect-square` gives a 1:1 ratio on mobile (each plate is 50% viewport width by 50% width tall — a comfortable thumbnail size). At md+ the `md:aspect-auto` resets and `md:row-span-N` over the `md:grid-rows-[180px]` row-tracks controls height as before."
  - "Header nav switches from `flex items-baseline gap-8` to `flex flex-wrap items-baseline gap-x-6 gap-y-2 md:gap-x-8`. At 390px the 5 nav items at 13px with gap-8 (32px) come to roughly 5 × (~45px + 32px gap) = ~360px which is right at the edge of the 390 - 48px (px-6) = 342px content width. `flex-wrap gap-x-6 gap-y-2` lets the nav wrap to 2 lines gracefully if any link label runs slightly longer than estimated; gap-x-8 reasserts at md+ for the spacious desktop spacing."
  - "Each nav `<Link>` becomes `flex min-h-11 items-center` — 44px minimum height for WCAG 2.5.5 / iOS HIG tap-target compliance. `items-center` keeps the 13px text vertically centered within the 44px tappable region. The flex wrapper is essential — `min-h-11` alone on an inline link does nothing because inline elements don't honor height."
  - "Footer 4-column grid: wrapped each of the 4 children with `<div className='border-b border-footer-rule pb-6 md:border-b-0 md:pb-0'>` instead of editing FooterCol's internal markup. Phase 9 primitive edits are out of scope; wrappers at the consumer level achieve the same visual result without touching the primitive. The colophon (already a `<div>`) just gets the divider classes added directly to its existing classNames — it's not double-wrapped."
  - "Footer bottom-row socials: 4 `<a>` tags get `flex min-h-11 items-center` added to their className. Same rationale as the header nav — inline anchors don't honor `min-h-11`; wrapping with `flex items-center` makes the 44px height meaningful and keeps the 11px tracked uppercase text vertically centered."
  - "AllLink / IntroLink primitive tap targets are NOT individually wrapped. Per the plan `<action>` Edit 5 'simpler approach': leaving AllLink and IntroLink tap-target compliance to surrounding spacing + line-height (each AllLink lives inside `mt-6` / `mt-12` / `mt-4` wrappers that create natural breathing room). Visual smoke at 390px during HUMAN-UAT is the empirical verifier. If specific links fail the 44px gate during Phase 13 QA, the fix is a wrapper at the consumer level or a `min-h-11` prop on the primitive itself."
  - "Section vertical padding `pt-[120px] pb-[120px]` (the existing arbitrary value from Plans 10-02..10-05) NOT split into mobile / desktop variants. The 120px vertical rhythm is integral to the editorial design and reads well at both mobile (heavy whitespace = magazine pacing) and desktop. The additional context's Edit 2 suggestion (`pt-20 pb-20 md:pt-30 md:pb-30`) was a more aggressive mobile reduction that would have flattened the editorial cadence; I kept the desktop 120px uniformly. If Phase 13 QA finds the mobile spacing too generous, a single sweep `pt-[120px] pb-[120px]` → `pt-20 pb-20 md:pt-[120px] md:pb-[120px]` is straightforward."
  - "Did NOT modify text-section-feature on the colophon. The current 10-05 SUMMARY's claim that text-section-feature does not exist was incorrect — the token IS defined in globals.css at 28px / 1.15 / -0.025em / 700 (verified via direct grep of @theme block). The fix commit `d1dd5e0` reverted Plan 10-05's mistaken substitution. Plan 10-06 inherits the corrected state and leaves the colophon's text-section-feature unchanged."
metrics:
  duration: "~3.4 minutes"
  completed: "2026-05-21"
  tasks_completed: 1
  files_modified: 1
  files_created: 1
requirements:
  - HOME-V2-12
---

# Phase 10 Plan 06: Mobile Parity Sweep Summary

Shipped HOME-V2-12 (mobile parity at 390px reference width). Surgical edits across `src/app/page.tsx` add the missing mobile breakpoints, replace the 2-line desktop manifesto with a dual-h1 (desktop 2 lines + mobile 3 lines per D-32 REVISED), collapse the 12-col photo grid to 2 columns on mobile, add per-column hairline dividers between the 4 footer columns on mobile only, and put 44px tap targets on the most-clicked surfaces (5 header nav links + 4 footer socials = 9 `min-h-11` instances). Build green; 41 routes prerender; the desktop layout at md+ (768px) is preserved unchanged. Phase 10 progress: 12 of 13 homepage requirements complete — only MOTION-07 (Plan 10-07, manifesto stagger) remains.

## What Shipped

**Commit `2f5fe73`** — `feat(10-06): mobile parity sweep — 3-line manifesto + 2×2 photo grid + footer dividers + tap targets (HOME-V2-12)`

Six surgical edits to `src/app/page.tsx`:

### Edit 1 — Dual manifesto h1 (D-32 REVISED)

The single `<h1 className="text-display uppercase text-ink">` block from Plan 10-01 is replaced with TWO consecutive `<h1>` blocks — one visible at md+ (desktop), one visible below md (mobile):

```tsx
{/* Manifesto — D-32 REVISED: desktop 2 lines / mobile 3 lines */}
<h1 className="hidden text-display uppercase text-ink md:block">
  <span className="block whitespace-nowrap">BRING FIRE</span>
  <span className="block whitespace-nowrap">TO HUMANITY.</span>
</h1>
<h1 className="block text-[56px] leading-[0.96] tracking-[-0.045em] font-bold uppercase text-ink md:hidden">
  <span className="block whitespace-nowrap">BRING</span>
  <span className="block whitespace-nowrap">FIRE TO</span>
  <span className="block whitespace-nowrap">HUMANITY.</span>
</h1>
{/* Plan 10-07 replaces both h1s with a single <ManifestoReveal> using matchMedia-aware lines */}
```

The desktop h1 uses `text-display` (124px / 0.96 / -0.045em / 700, Phase 9 token). The mobile h1 uses arbitrary values `text-[56px] leading-[0.96] tracking-[-0.045em] font-bold` — these are an intentional D-32 exception because the 56px / 0.96 / -0.045em / 700 combination is a manifesto-only override that nothing else on the site reuses. Promoting it to a `text-mobile-display` token would create a single-consumer utility (Phase 9 D-09 arbitrary-value exception case).

Both `<h1>`s use 3 `<span className="block whitespace-nowrap">` per line so letters can't wrap mid-word when Plan 10-07's per-character stagger animates them.

### Edit 2 — Header nav with flex-wrap + tap targets

The 5-link nav `<ul>` becomes `flex flex-wrap items-baseline gap-x-6 gap-y-2 text-nav text-ink md:gap-x-8`. Each `<Link>` gets `flex min-h-11 items-center transition-opacity hover:opacity-60` for 44px minimum tap-target height. The `flex-wrap` gives the nav a graceful 2-row fallback if any nav label runs longer than expected at 390px content width (~342px usable after `px-6` padding).

### Edit 3 — PHOTOGRAPHS grid: 2-col mobile + per-plate className refactor

The grid wrapper becomes mobile-first: `grid grid-cols-2 gap-2 md:grid-cols-12 md:grid-rows-[180px] md:gap-3`. On mobile, 6 plates arrange as a 2×3 grid (auto-flow); at md+ the 12-col asymmetric layout reasserts with the existing 180px row tracks.

HOME_PHOTOS is refactored to store the FULL className per entry (no more `${p.span}` interpolation):

```ts
const HOME_PHOTOS = [
  { src: "...000092530012.jpeg",      no: "01", className: "relative aspect-square md:aspect-auto md:col-span-7 md:row-span-3" },
  { src: "...20230928%20MSB_0114.jpg", no: "02", className: "relative aspect-square md:aspect-auto md:col-span-5 md:row-span-2" },
  { src: "...IMG_0028.jpeg",          no: "03", className: "relative aspect-square md:aspect-auto md:col-span-3 md:row-span-1" },
  { src: "...IMG_1075.JPG",           no: "04", className: "relative aspect-square md:aspect-auto md:col-span-2 md:row-span-1" },
  { src: "...IMG_2129.jpeg",          no: "05", className: "relative aspect-square md:aspect-auto md:col-span-5 md:row-span-2" },
  { src: "...Patricof09.jpg",         no: "06", className: "relative aspect-square md:aspect-auto md:col-span-7 md:row-span-2" },
] as const;
```

The plate JSX becomes `<div key={p.no} className={p.className}>` — Tailwind v4's scanner picks up each `md:col-span-N md:row-span-M` token as a literal string in the source, generating the CSS correctly.

`aspect-square md:aspect-auto` is critical: on mobile the grid has no row-track height, so each plate needs an explicit aspect ratio (`aspect-square` = 1:1 = 50% viewport width tall). At md+, `md:aspect-auto` resets the ratio and the `md:row-span-N` × `md:grid-rows-[180px]` track height takes over.

### Edit 4 — Footer 4-column grid: per-column mobile dividers

Each of the 4 child columns (colophon `<div>` + 3 `<FooterCol>` invocations) is now wrapped in:

```tsx
<div className="border-b border-footer-rule pb-6 md:border-b-0 md:pb-0">
  {/* original child */}
</div>
```

For the colophon (originally a `<div>`), the classes are added directly — no double-wrap. For each FooterCol, a new wrapper `<div>` surrounds the primitive invocation (Phase 9 primitives are out of scope for edits).

On mobile this produces 4 stacked sections with a hairline 1px ink-on-paper rule separating each (via the `border-footer-rule` token's translucent-on-inverted-bg value). At md+ the dividers disappear (`md:border-b-0 md:pb-0`) and the 4-column grid reasserts.

### Edit 5 — Footer bottom-row social tap targets

Each of the 4 social `<a>` elements (Twitter / GitHub / LinkedIn / Email) gets `flex min-h-11 items-center` prepended to its className. The `items-center` keeps the 11px tracked uppercase label visually centered within the 44px tappable region — important because the labels are tight (1× line-height) and would otherwise sit at the top of the tap area.

### Edit 6 — Inspection-only sections (no changes)

Per the plan's Edit 6 audit:

| Section | Mobile behavior | Change needed |
|---|---|---|
| JsonLd | Server-only, no UI | None |
| Epigraph figure (HOME-V2-04) | `<Image>` is `w-full` with `aspect-[1120/540]` — scales naturally at any width | None |
| Letter intro (HOME-V2-05) | `max-w-[45rem]` at `text-body-lead` (22px / 1.55) — paragraph wraps within the 342px content width | None |
| BUILDING (HOME-V2-06) | `grid-cols-1 md:grid-cols-[180px_1fr_1fr]` — single column at mobile | None |
| WRITING (HOME-V2-07) | ListRow primitive handles its own responsive flex-baseline layout | None |
| EVENTS (HOME-V2-08) | Featured event `grid-cols-1 md:grid-cols-[180px_1fr_auto]` — single column at mobile | None |
| PERSONAL (HOME-V2-10) | `grid-cols-1 md:grid-cols-3` — single column at mobile | None |

All non-photographs sections were already correctly mobile-first from earlier plans (10-02..10-05). This audit confirms it.

## Acceptance grep results (Plan Task 1 `<verify>` + 10-VALIDATION 10-06-V)

| Assertion | Hits | Status |
|---|---|---|
| `rg "md:"` ≥ 10 | 32 | ✓ |
| `rg "text-\[56px\]"` ≥ 1 | 1 | ✓ (mobile manifesto h1) |
| `rg "FIRE TO"` ≥ 1 | 1 | ✓ (mobile h1 line 2) |
| `rg "HUMANITY\."` ≥ 2 | 2 | ✓ (desktop "TO HUMANITY." + mobile "HUMANITY.") |
| `rg "BRING\b"` ≥ 2 | 2 | ✓ (desktop "BRING FIRE" + mobile "BRING") |
| `rg "md:col-span-7"` ≥ 2 | 2 | ✓ (Plate A + Plate F) |
| `rg "grid-cols-2"` ≥ 1 | 1 | ✓ (PHOTOGRAPHS mobile grid) |
| `rg "border-b border-footer-rule"` ≥ 4 | 4 | ✓ (4 footer column wrappers) |
| `rg "min-h-11"` ≥ 5 | 9 | ✓ (5 nav links + 4 social links) |
| `npm run build` exit 0 | — | ✓ (41 routes prerender) |

All 10-VALIDATION row 10-06-V grep assertions green.

## Plan Inheritance — Setup for Plan 10-07

Plan 10-07 will replace the dual static `<h1>` markup with a single `<ManifestoReveal>` client component. The component will receive both line arrays as props:

```tsx
<ManifestoReveal
  desktopLines={["BRING FIRE", "TO HUMANITY."]}
  mobileLines={["BRING", "FIRE TO", "HUMANITY."]}
/>
```

Internally, ManifestoReveal will use `useMediaQuery('(min-width: 768px)')` (or matchMedia in a useEffect) to pick the active line array at render time, then split each line into per-character `<m.span>` elements for the stagger animation. The mobile h1's arbitrary values (`text-[56px] leading-[0.96] tracking-[-0.045em]`) get baked into the component's mobile-branch className; the desktop h1's `text-display` token stays as-is.

Plan 10-07 acceptance: after the swap, `rg "ManifestoReveal" src/app/page.tsx` = 1; `rg "BRING FIRE" src/app/page.tsx` = 1 (inside the desktopLines prop); `rg "FIRE TO" src/app/page.tsx` = 1 (inside the mobileLines prop). The static `<h1>` blocks are removed.

## HUMAN-UAT items (visual smoke at 390px)

The grep assertions confirm the markup is structurally correct, but the perceptual gate is visual inspection at 390px in Chrome DevTools device emulation. Items to verify during HUMAN-UAT:

| Surface | Expected at 390px | Verifier |
|---|---|---|
| Manifesto | 3 lines (BRING / FIRE TO / HUMANITY.) at 56px, no horizontal overflow | Visual |
| PHOTOGRAPHS grid | 2 columns × 3 rows of square plates | Visual |
| Footer columns | 4 stacked sections with hairline dividers between them | Visual |
| Header nav | 5 links across or wrapped to 2 rows, each tap target ≥ 44px tall | Visual + tap test |
| Footer socials | 4 social links in a row or wrapping, each tap target ≥ 44px tall | Visual + tap test |
| Desktop at 1440px | 2-line manifesto, 12-col asymmetric photo grid, 4-col footer (no dividers) | Visual regression |
| AllLink / IntroLink tap targets | Surrounding line-height + spacing makes the 13px / 11px text comfortably tappable | Tap test |

AllLink and IntroLink were NOT individually wrapped with `min-h-11` per the plan's Edit 5 "simpler approach." If Phase 13 QA finds specific instances failing the 44px gate, a follow-up commit adds the wrapper or extends the primitive itself.

## Deviations from Plan

### Auto-fixed Issues

None. The single task executed as written. No Rule 1 (bug), Rule 2 (missing critical functionality), Rule 3 (blocking issue), or Rule 4 (architectural) cases triggered.

### Notes (not deviations)

1. **Vertical section padding `pt-[120px] pb-[120px]` left unchanged.** The additional context suggested `pt-20 pb-20 md:pt-30 md:pb-30` to reduce mobile vertical whitespace, but the plan's Edit 6 explicitly notes that the existing 120px rhythm "is integral to the editorial design and reads well at both mobile and desktop." I followed the plan over the supplementary suggestion. If Phase 13 QA finds the mobile cadence too stretched, a single sweep is a one-line change per section.

2. **Header padding `px-6` (24px) kept, not `px-7` (28px).** Plan `<interfaces>` lists `px-6 mobile / md:px-40 desktop` as the consistent existing pattern (Plans 10-01..10-05 all use px-6). The footer uses `px-7` per its plan-specific spec (D-29), so the asymmetry between header (24px) and footer (28px) is intentional and unchanged.

3. **HOME_PHOTOS field renamed `span` → `className`.** The original field held just the col/row span tokens (`col-span-7 row-span-3`); the new field holds the FULL className string (`relative aspect-square md:aspect-auto md:col-span-7 md:row-span-3`). The rename signals the semantic shift — readers won't confuse it with the old span-only field. Type narrows correctly via `as const`.

4. **10-05 SUMMARY claim about `text-section-feature` was inaccurate.** The 10-05 SUMMARY decisions block stated the token did not exist in Phase 9; the fix commit `d1dd5e0` reverted that mistake. I verified `text-section-feature` IS defined in `src/app/globals.css` at 28px / 1.15 / -0.025em / 700. Plan 10-06 inherits the corrected state and does not touch the colophon. Documenting here for future readers who reference the 10-05 SUMMARY.

5. **`flex-wrap` on header nav is precautionary.** At 390px - 48px padding = 342px content width, 5 nav links at 13px with gap-x-6 (24px) come to roughly 5 × ~50px + 4 × 24px = ~346px — right at the edge. If a future label rename (e.g., "Newsletter" instead of "Library") pushes one link wider, `flex-wrap gap-y-2` lets the nav wrap to 2 rows without horizontal overflow. The current 5 labels fit on one row but the wrap fallback is free insurance.

## Phase 10 Progress After This Plan

- 12 of 13 homepage requirements shipped (HOME-V2-01..12).
- Only MOTION-07 (manifesto stagger interaction) remains — Plan 10-07 implements the `<ManifestoReveal>` client component using LetterDrop (the last unallocated Phase 9 primitive) + matchMedia line switching + sessionStorage reveal-once gate + useReducedMotion fallback.
- After Plan 10-07 ships, Phase 10 closes and `/gsd:verify-phase 10` becomes runnable.

## Files Touched

| File | Action | Commit |
|---|---|---|
| src/app/page.tsx | modified — 6 edits across manifesto / header / photographs / footer; 60 insertions, 45 deletions | 2f5fe73 |

## Setup for Downstream Plans

After Plan 10-06:

- `src/app/page.tsx` is **418 lines** with 12 of 13 homepage requirements shipped.
- Dual-h1 markup is staged for Plan 10-07 to collapse into a single `<ManifestoReveal>` client component.
- Mobile manifesto line array `["BRING", "FIRE TO", "HUMANITY."]` is locked — Plan 10-07's matchMedia branch uses this exact array.
- `<ManifestoReveal>` is the final consumer of the Phase 9 `LetterDrop` primitive (currently unallocated).
- HUMAN-UAT items above are queued for Phase 13 QA's visual regression sweep.

## Known Stubs

None. All edits are layout-only — no new placeholders, no new TODO comments, no new commented-out blocks.

## Threat Flags

None. No new auth surface, no new input handling, no new server endpoints. The edits are pure CSS / className changes (responsive utilities + dual-h1 conditional render via Tailwind's display utilities — no JS conditional, no client-side state). T-10-06-CONF (build pipeline) satisfied: `npm run build` exits 0 with all grep assertions green.

## Self-Check: PASSED

- `src/app/page.tsx` — FOUND (418 lines; dual manifesto h1 + 2-col photo grid + footer dividers + tap targets all verified)
- `.planning/phases/10-editorial-homepage/10-06-SUMMARY.md` — FOUND (this file)
- Commit `2f5fe73` (feat 10-06 mobile parity sweep) — FOUND in git log
- `npm run build` exits 0 — VERIFIED (41 routes prerender)
- All Task 1 acceptance grep assertions — PASSED (md: 32 ≥ 10; text-[56px] 1 ≥ 1; FIRE TO 1 ≥ 1; HUMANITY. 2 ≥ 2; BRING 2 ≥ 2; md:col-span-7 2 ≥ 2; grid-cols-2 1 ≥ 1; border-b border-footer-rule 4 ≥ 4; min-h-11 9 ≥ 5)
- 10-VALIDATION row 10-06-V — PASSED (all grep assertions green)
- HOME_PHOTOS refactor — VERIFIED (each entry's className contains literal md:col-span-N md:row-span-M tokens; no dynamic interpolation)
- Footer column wrappers — VERIFIED (4 `<div>` wrappers with border-b border-footer-rule pb-6 md:border-b-0 md:pb-0)
- Tap targets — VERIFIED (5 header nav Links + 4 footer social `<a>`s all have flex min-h-11 items-center; 9 total min-h-11 instances)
