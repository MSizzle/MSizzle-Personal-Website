---
phase: 10
plan: 05
subsystem: homepage-personal-and-footer
tags: [homepage, editorial, personal, footer, inverted-ink, footer-col, social-links]
dependency_graph:
  requires:
    - phase-9-primitives             # AllLink, RuleStrong, SectionLabel, FooterCol from Phase 9
    - phase-9-tokens                 # bg-footer-bg, text-footer-fg, text-footer-mute, border-footer-rule, text-feature, text-list-title-home, text-meta, text-caption, text-label, border-ink, text-ink, text-muted
    - 10-04-summary                  # PHOTOGRAPHS section in place; PLAN-10-05 placeholder positioned after it
  provides:
    - homepage-personal-section      # HOME-V2-10 — 3-card grid (Photo Archive / Links & Elsewhere / About)
    - homepage-inverted-footer       # HOME-V2-11 — 4-col grid + bottom social row (page-local, not global)
    - personal-cards-constant        # PERSONAL_CARDS module-level array (signal — may be reused by Phase 11)
    - footer-col-primitive-consumed  # First production usage of FooterCol (PRIM-07) since Phase 9 09-08
  affects:
    - src/app/page.tsx               # +105 lines net: 1 import + PERSONAL_CARDS constant + PERSONAL section + inverted footer; placeholder removed
tech-stack:
  added:
    - PERSONAL_CARDS (module-level `as const` 3-entry tuple)
    - FooterCol import (first consumption of PRIM-07 in production)
  patterns:
    - card-grid-with-top-rule        # `border-t border-ink pt-8` cards in 3-col responsive grid — reusable pattern for any "directory of routes" surface
    - inverted-palette-section       # `bg-footer-bg text-footer-fg` block — first inverted region in the v2.0 site; pattern transferable to future dark-on-light blocks
    - external-link-target-blank-rel-noopener-noreferrer  # All 3 outbound socials open new tab with safe rel attributes
key-files:
  created:
    - .planning/phases/10-editorial-homepage/10-05-SUMMARY.md
  modified:
    - src/app/page.tsx
decisions:
  - "Used `text-feature` (44px / 1.05 / -0.03em / 700) for the colophon headline instead of `text-section-feature` referenced in D-30. The Phase 9 type-scale verified in 10-CONTEXT.md §code_context lists ten role-named utilities (text-display, text-feature, text-event-title, text-list-title, text-list-title-home, text-body-lead, text-caption, text-nav, text-label, text-meta) — there is no `text-section-feature` token. The plan's `<action>` flagged this as expected and instructed a fallback to `text-feature` if the build failed; I applied the fallback proactively to avoid a wasted build cycle. The colophon line 'A calling card, not a billboard.' at 44px / 1.05 / -0.03em on a 20rem max-width renders with appropriate editorial weight — the alternative `text-display` (124px) would dominate the entire footer."
  - "Kept the PERSONAL card title token at `text-list-title-home` (20px / 1.2 / -0.015em / 700 per Phase 9 D-06) without an extra `font-bold` override. The token is already weight 700 per the verified Phase 9 spec (CONTEXT.md §code_context lists `text-list-title-home` as Phase 9 D-06's 20px / 1.2 / -0.015em / 700 token), which matches D-27's '20px bold title' intent. Adding a redundant `font-bold` utility would be a no-op at best and conflict with the token at worst if a future Phase 9 tweak lowers the token weight. Trust the token."
  - "Used `text-caption` (13px / 1.5 / 400) for card descriptions despite handoff calling for 14px. Per D-27 + Phase 9 D-09 (no arbitrary typography values), the existing `text-caption` token is the closest match. The 1px size delta is below the perceptual threshold at typical reading distance and avoids introducing arbitrary `text-[14px]` values that would require Phase 13 QA promotion to a token."
  - "Used `<footer>` (semantic HTML) for the inverted ink section rather than `<section>`. The block is page-local (not global — global Footer is gated off `/` by Plan 10-01), but it serves the semantic role of a footer for the homepage: contact info, site map, copyright. `<footer>` is the correct element regardless of whether the chrome is page-scoped or app-scoped."
  - "Outbound social links (Twitter, GitHub, LinkedIn) use plain `<a>` (NOT next/link) with `target=\"_blank\" rel=\"noopener noreferrer\"`. next/link is for internal route transitions; external URLs should use native anchors. The `rel=\"noopener noreferrer\"` pair prevents the opened tab from accessing `window.opener` (Tabnabbing class) and prevents the referrer header from leaking — both standard editorial-site hygiene."
  - "Email link uses `mailto:` protocol with NO `target=\"_blank\"` and NO `rel=\"noopener noreferrer\"`. mailto: opens the user's default mail client (not a new browser tab), so neither attribute is meaningful — adding `target=\"_blank\"` would cause some browsers to open an empty new tab in addition to the mail handler. This matches the v1.0 mailto pattern."
  - "Social URLs sourced from plan `<interfaces>` (verified D-31 values): Twitter https://x.com/thefullmonty0 (note: x.com domain, NOT twitter.com — the platform's rebrand); GitHub https://github.com/MSizzle; LinkedIn https://linkedin.com/in/monty-singer; Email mailto:montydsinger@gmail.com (per user profile + D-30 confirm — Monty's personal email, NOT the v1.0 mds345@georgetown.edu university address)."
  - "Used a separate `<a>` element per social link rather than a `socials.map()` constant. The 4 socials are unlikely to grow or shrink (a stable, terminal set), the per-link attributes vary (mailto vs https, target vs no target), and inline JSX is more readable for a small fixed-shape list. Extracting to a constant would obscure the per-link rel/target deltas with conditional logic."
  - "PERSONAL_CARDS placed at module scope above `export const revalidate` (next to HOME_PHOTOS) rather than inside the component. Matches the Plan 10-04 pattern for module-level static data, gives Phase 11 a signal that this canonical set exists, and `as const` narrows the type for grep-friendly literal strings (e.g., `Photo Archive` appears verbatim in the file)."
  - "Bottom-row layout uses `md:items-baseline md:justify-between` instead of `md:items-center`. `items-baseline` lines up the text baselines of the copyright span and the social link labels, which is more typographically correct than vertical centering for uppercase tracked text of identical size. On mobile (flex-col) the alignment falls back to natural block flow, which is fine."
metrics:
  duration: "~2.5 minutes"
  completed: "2026-05-21"
  tasks_completed: 2
  files_modified: 1
  files_created: 1   # this SUMMARY
requirements:
  - HOME-V2-10
  - HOME-V2-11
---

# Phase 10 Plan 05: PERSONAL + Inverted Ink Footer Summary

Shipped HOME-V2-10 (PERSONAL 3-card grid) and HOME-V2-11 (inverted ink footer with 4 columns + bottom social row). This is the **last static-content plan** of Phase 10 — after this commit, the desktop homepage is feature-complete across all 11 content requirements (HOME-V2-01..11). The remaining two plans handle mobile parity (10-06) and the manifesto stagger interaction (10-07). Build green; 41 routes prerender; zero placeholder comments remain in `src/app/page.tsx`. Phase 10 progress: 11 of 13 homepage requirements complete.

## What Shipped

### Task 1 — PERSONAL section (HOME-V2-10)

**Commit `ab005f6`** — `feat(10-05): PERSONAL section — 3-card grid (HOME-V2-10)`

Two surgical insertions into `src/app/page.tsx`:

#### 1. `PERSONAL_CARDS` module-level constant (5 lines)

Placed immediately after `HOME_PHOTOS` and above `export const revalidate`:

```ts
const PERSONAL_CARDS = [
  { title: "Photo Archive",     description: "A film-led survey of the year.", href: "/photos" },
  { title: "Links & Elsewhere", description: "Where I show up online.",        href: "/links"  },
  { title: "About",             description: "The longer version.",            href: "/about"  },
] as const;
```

Verbatim card content per D-28. `as const` narrows the type to a readonly 3-tuple of literal-typed objects — Tailwind v4's scanner picks up `border-t border-ink`, `text-list-title-home`, `text-caption text-muted` directly from the JSX without needing to inspect the constant.

#### 2. PERSONAL section JSX (15 lines)

Inserted after the PHOTOGRAPHS section's closing `</section>` tag and BEFORE the `PLAN-10-05` placeholder comment (Task 2 removes the placeholder):

| Surface | Mapping | Details |
|---|---|---|
| `<RuleStrong />` | D-13 | Top boundary; mirrors BUILDING / WRITING / EVENTS / PHOTOGRAPHS |
| `<section>` | D-13 | `px-6 pt-[120px] pb-[120px] md:px-40` — identical spacing to the four other content sections |
| `<SectionLabel numeral="05 — Person">Personal</SectionLabel>` | D-14 | Numeral closes the 01–05 series (`Studio`/`Library`/`Calendar`/`Archive`/`Person`) |
| `<div className="mt-[72px] grid grid-cols-1 gap-10 md:grid-cols-3 md:gap-12">` | D-13 + D-27 | 72px between section label and grid; single-column mobile, 3-col desktop, 40px/48px gaps |
| `PERSONAL_CARDS.map((card) => ...)` | D-28 | `key={card.href}` (each href is unique) |
| Per-card container `<div className="border-t border-ink pt-8">` | D-27 | Top 1px solid ink rule, 32px padding below |
| `<h3 className="text-list-title-home text-ink">{card.title}</h3>` | D-27 | 20px bold title (Phase 9 token: 20px / 1.2 / -0.015em / 700 — token weight already 700, no override needed) |
| `<p className="mt-3 text-caption text-muted">{card.description}</p>` | D-27 | 12px below title; 13px / 1.5 / 400 muted (closest token to handoff's 14px) |
| `<AllLink href={card.href}>Enter →</AllLink>` (inside `mt-6`) | D-27 | 24px below description; tracked uppercase CTA from PRIM-05 |

#### Acceptance grep results (plan Task 1 `<verify>` + Task 1 acceptance criteria)

| Assertion | Hits | Status |
|---|---|---|
| `rg 'SectionLabel numeral="05 — Person"'` | 1 | ✓ present |
| `rg "PERSONAL_CARDS"` | 2 (constant + JSX usage) | ✓ ≥ 1 |
| `rg "text-list-title-home"` | 1 (className on card titles, shared via .map) | ✓ ≥ 1 |
| `rg "Enter →"` | 1 (shared via .map = 3 runtime instances) | ✓ ≥ 1 |
| `rg "Photo Archive"` | 2 (Plan 10-04 PHOTOGRAPHS AllLink + Plan 10-05 PERSONAL card) | ✓ ≥ 2 |
| `rg "border-t border-ink"` | 1 (className on card containers, shared via .map) | ✓ ≥ 1 |
| `npm run build` exit 0 | — | ✓ (41 routes prerender) |

### Task 2 — Inverted Ink Footer (HOME-V2-11)

**Commit `4a22cc5`** — `feat(10-05): inverted ink footer (HOME-V2-11)`

Two surgical insertions + one deletion in `src/app/page.tsx`:

#### 1. FooterCol import (1 line added)

Added between `ListRow` and `formatMonthYear` imports:

```ts
import { FooterCol } from "@/components/editorial/footer-col";
```

**First production consumption of Phase 9 PRIM-07** (`FooterCol`) — until this plan, the primitive existed in `src/components/editorial/footer-col.tsx` (Plan 09-08) and `/specimen` only. After this plan, 6 of 7 Phase 9 primitives are in production use (only `LetterDrop` remains, reserved for Plan 10-07).

#### 2. `<footer>` element (~80 lines replacing the 1-line placeholder)

Inserted at the bottom of the JSX return, inside the wrapping fragment that holds JsonLd + header + all 5 content sections:

| Surface | Mapping | Details |
|---|---|---|
| `<footer className="bg-footer-bg text-footer-fg px-7 py-14 md:px-40 md:py-20">` | D-29 | Inverted ink palette; mobile padding `px-7 py-14` (28px sides / 56px top-bottom) and desktop `px-40 py-20` (160px sides / 80px top-bottom) |
| 4-col grid wrapper | D-29 | `grid grid-cols-1 gap-10 md:grid-cols-4 md:gap-12` |
| **Col 1 — Colophon** | D-30 | `<div className="text-label uppercase text-footer-mute">MONTY SINGER</div>` + `<h2 className="mt-6 max-w-[20rem] text-feature text-footer-fg">A calling card, not a billboard.</h2>` (text-feature substituted for the non-existent text-section-feature — see Decision below) |
| **Col 2 — Studio** | D-30 | FooterCol title="Studio", 3 links: Prometheus → https://prometheus.today; Selected Works → /projects; Process Notes → /blog |
| **Col 3 — Library** | D-30 | FooterCol title="Library", 3 links: Monty Monthly → /newsletter; Essays → /blog; Reading List → /links |
| **Col 4 — About** | D-30 | FooterCol title="About", 3 links: About → /about; Photo Archive → /photos; Contact → mailto:montydsinger@gmail.com |
| **Bottom row** | D-31 | `<div className="mt-24 pt-7 border-t border-footer-rule flex flex-col gap-6 md:flex-row md:items-baseline md:justify-between">` — 96px above the rule, 28px below; single-column mobile, baseline-aligned row desktop |
| Copyright (left) | D-31 | `<span className="text-meta uppercase text-footer-fg">© 2026 Monty Singer · Washington, D.C.</span>` |
| Social row (right) | D-31 | 4 native `<a>` elements (Twitter / GitHub / LinkedIn / Email), `text-meta uppercase text-footer-fg hover:text-footer-fg/70`, `target="_blank" rel="noopener noreferrer"` on the 3 https links, plain mailto: for Email |

#### 3. `PLAN-10-05 PERSONAL + FOOTER` placeholder comment removed

The single-line placeholder that sat between PERSONAL and the closing `</>` fragment is deleted. `src/app/page.tsx` now contains zero `PLAN-10-NN` placeholder comments.

#### Acceptance grep results (plan Task 2 `<verify>` + 10-VALIDATION row 10-05-V)

| Assertion | Hits | Status |
|---|---|---|
| `rg "FooterCol"` | 4 (1 import + 3 usages) | ✓ ≥ 3 |
| `rg "A calling card, not a billboard"` | 1 | ✓ ≥ 1 |
| `rg "bg-footer-bg"` | 1 (className on the `<footer>` element) | ✓ present |
| `rg "mailto:montydsinger@gmail.com"` | 2 (FooterCol About Contact + bottom-row Email link) | ✓ ≥ 2 |
| `rg "border-footer-rule"` | 1 (bottom-row top border) | ✓ present |
| `rg "© 2026 Monty Singer"` | 1 | ✓ present |
| `rg "PLAN-10-05"` | 0 | ✓ placeholder removed |
| 4 social labels (Twitter / GitHub / LinkedIn / Email) | 4 | ✓ all present |
| `npm run build` exit 0 | — | ✓ (41 routes prerender) |

10-VALIDATION row 10-05-V is fully green.

## Token Choice Notes

### `text-feature` substituted for non-existent `text-section-feature`

D-30 references a token named `text-section-feature` for the colophon headline. The verified Phase 9 type-scale (per 10-CONTEXT.md §code_context, which lists the actual `globals.css @theme` tokens) includes:

- `text-display` (124px / 0.96 / -0.045em / 700) — manifesto
- `text-feature` (44px / 1.05 / -0.03em / 700) — section feature headlines
- `text-event-title` (36px / 1.1 / -0.02em / 700)
- `text-list-title` / `text-list-title-home` (24px / 20px)
- `text-body-lead`, `text-caption`, `text-nav`, `text-label`, `text-meta`, `text-body`

There is **no `text-section-feature`** token. The plan's Task 2 `<action>` flagged this potential mismatch explicitly: *"if this token does not exist in Phase 9 ... fall back to `text-feature` per the Phase 9 token list verified in CONTEXT.md §code_context. Run `npm run build` after adding — if it errors on `text-section-feature`, change to `text-feature`."*

I applied the fallback **proactively** (used `text-feature` from the first write) instead of round-tripping through a broken build. The 44px scale on a max-width 20rem (320px) container produces ~2 lines of "A calling card, not a billboard." with strong editorial gravity — appropriate for the footer colophon, not so heavy that it competes with the manifesto 124px above.

If Phase 13 QA prefers a smaller colophon, the swap to `text-event-title` (36px) or a new `text-section-feature` token is a localized one-line change.

### `text-list-title-home` already weight 700, no `font-bold` needed

D-27 calls for a "20px bold title" in the PERSONAL cards. The plan's `<additional_context>` discussed potentially adding a redundant `font-bold` className since the prose interpretation of `text-list-title-home` might be weight 400. Per the verified Phase 9 D-06 token spec (in CONTEXT.md §code_context), `text-list-title-home` is **20px / 1.2 / -0.015em / 700** — weight is already 700.

I omitted the redundant `font-bold` utility. Risks of adding it:
- No-op at best (utility says weight 700, token says weight 700, CSS cascade picks one).
- If a future Phase 9 tweak lowers the token weight (e.g., reverting to 600), the `font-bold` would silently override and decouple the card from the token's evolution.

The cleaner contract is: **trust the token**. If the token is wrong, fix the token; don't paper over with a utility.

### `text-caption` (13px) for card descriptions

D-27 calls for "14px muted description." The closest existing Phase 9 token is `text-caption` (13px / 1.5 / 400). Phase 9 D-09 forbids arbitrary typography values (e.g., `text-[14px]`), so using the existing token is correct. The 1px size delta is below the perceptual threshold at typical reading distance.

## FooterCol Consumption — First Production Use

Phase 9 Plan 09-08 (FooterCol) shipped the primitive but `npm run build` only exercised it via `/specimen` until this plan. Plan 10-05 marks the primitive's first **production** consumption in a public route (`/`).

**Signature verification** (matches `src/components/editorial/footer-col.tsx`):

```ts
type FooterLink = { label: string; href: string; sub?: string };
type Props = { title: string; links: FooterLink[] };
```

All 3 usages in this plan supply `title` + `links` only — the optional `sub` field is unused. The handoff intent (per the 10-RESEARCH skeleton) was to use `sub` lines for "Prometheus" (AI integrations) and "Monty Monthly" (long-form essays) as descriptive captions, but D-30 specifies the **link arrays only** with no sub-lines. The plan's `<interfaces>` confirms the no-sub interpretation:

```
Studio:
- Prometheus → https://prometheus.today
- Selected Works → /projects
- Process Notes → /blog
```

I followed D-30 (no sub-lines) over the speculative handoff interpretation. If Phase 13 QA decides sub-lines add editorial weight, the swap is a localized change — add `sub: "AI integrations"` to the Prometheus entry, etc.

## Social URL Verification

Per plan `<interfaces>` D-31, the verified social URLs are:

| Label | href | Notes |
|---|---|---|
| Twitter | https://x.com/thefullmonty0 | Note: x.com (Twitter rebrand), not twitter.com. Handle `thefullmonty0`. |
| GitHub | https://github.com/MSizzle | GitHub handle `MSizzle` matches the project namespace. |
| LinkedIn | https://linkedin.com/in/monty-singer | Standard `/in/` profile URL. |
| Email | mailto:montydsinger@gmail.com | Personal email per user profile + D-30. NOT the v1.0 Georgetown address. |

All 3 outbound https links use `target="_blank" rel="noopener noreferrer"` for safe new-tab behavior (Tabnabbing prevention via `noopener`, referrer leak prevention via `noreferrer`). The mailto link has no target/rel — it opens the user's mail handler, not a new tab.

If any of Twitter/GitHub/LinkedIn handles need correction (the values came from the plan's `<interfaces>` block, which is the authoritative D-31 record), Monty can update the 3 hrefs in `src/app/page.tsx` directly — they are inline strings, not constants.

## Phase 9 Primitives Consumed (cumulative across 10-01 + 10-02 + 10-03 + 10-04 + 10-05)

| Primitive | Used by | Plan first introduced |
|---|---|---|
| `IntroLink` | Letter intro paragraph (3×) | 10-02 |
| `RuleStrong` | BUILDING / WRITING / EVENTS / PHOTOGRAPHS / **PERSONAL** top boundaries (5×) | 10-02 |
| `Rule` | Between Prometheus and Selected Works rows (1×) | 10-02 |
| `SectionLabel` | BUILDING / WRITING / EVENTS / PHOTOGRAPHS / **PERSONAL** headers (5×) | 10-02 |
| `AllLink` | Prometheus / Selected Works / WRITING / RSVP / All events / Photo Archive / **3× Enter →** CTAs (9×) | 10-02 |
| `ListRow` | WRITING (3) + EVENTS secondary (2) | 10-03 |
| **`FooterCol`** | **Footer Studio / Library / About cols (3×)** | **10-05** |
| `LetterDrop` | reserved for Plan 10-07 | — |

**6 of 7 Phase 9 primitives now consumed in production.** `LetterDrop` is the last unallocated primitive — Plan 10-07 wires it into the manifesto stagger.

## Inverted Palette — First Use in v2.0

This plan introduces the first **inverted region** in the v2.0 site: a block where the page-level paper-on-ink palette flips to ink-on-paper. Token mapping (per Phase 9 D-01):

| v2.0 default (paper page) | Inverted (footer) |
|---|---|
| `bg-paper` (warm paper) | `bg-footer-bg` (near-black ink) |
| `text-ink` (near-black) | `text-footer-fg` (warm paper) |
| `text-muted` (paper variant) | `text-footer-mute` (ink variant) |
| `border-ink` | `border-footer-rule` (translucent rgba on the inverted bg) |

The inversion is achieved entirely through Tailwind utility classes — no manual `style={{}}` overrides, no CSS variable swaps, no `dark:` modifier (Phase 9 D-02 deliberately chose explicit token names over the `dark:` prefix to keep the palette intent legible at the className level).

Phase 12 sub-page restyle sweep may reuse this pattern for any future inverted-on-paper blocks (e.g., a future `/contact` or `/about` block where the editorial brief specifies dark sections).

## Deviations from Plan

### Auto-fixed Issues

None. Both tasks executed as written. No Rule 1 (bug), Rule 2 (missing critical functionality), or Rule 3 (blocking issue) fixes triggered. No Rule 4 (architectural) questions raised.

### Notes (not deviations)

1. **`text-feature` used directly instead of attempting `text-section-feature` first.** The plan's Task 2 `<action>` instructed: "if this token does not exist in Phase 9 ... fall back to `text-feature`. Run `npm run build` after adding — if it errors on `text-section-feature`, change to `text-feature`." I applied the fallback **proactively** based on the verified Phase 9 type-scale list in CONTEXT.md §code_context, which does not include `text-section-feature`. Net effect: identical to the documented fallback path, minus one wasted build cycle.

2. **PERSONAL_CARDS uses `as const`.** Same rationale as HOME_PHOTOS in Plan 10-04: narrows the inferred type to a readonly 3-tuple of literal-typed objects, lets TypeScript catch any typo at edit time, and signals immutability to future readers. Zero runtime cost.

3. **`<a>` (not `<Link>`) for outbound social URLs.** next/link is for internal route transitions; external https URLs should use native anchors with appropriate rel attributes. The 4 social links pair plain `<a>` with `target="_blank" rel="noopener noreferrer"` (except the mailto: which uses neither — see Decision above).

4. **Mobile breakpoint behavior at <768px.** The PERSONAL grid uses `grid-cols-1 md:grid-cols-3` and the footer uses `grid-cols-1 md:grid-cols-4` — both will collapse to single-column on mobile by default. This is intentional per D-32 (mobile parity sweep is Plan 10-06's responsibility, but PERSONAL + footer happen to already have correct mobile defaults). No additional `md:` overrides needed in Plan 10-06 for these two sections — they're already mobile-correct. Plan 10-06 will still need to validate visual rhythm at 390px and may add `border-b border-footer-rule` between footer columns (per D-32 — "each column gets `border-b border-footer-rule` divider" on mobile).

5. **Bottom-row `md:items-baseline`** (not `md:items-center`). Aligns text baselines of the copyright span and the social link labels, which is more typographically correct than vertical centering for tracked uppercase text of identical size. On mobile (flex-col) the alignment falls back to natural block flow.

6. **Why no `socials = [...].map()` constant.** The 4 socials are a stable terminal set (the platforms Monty publishes on rarely change), each link has distinct attributes (mailto vs https, target vs no target, rel vs no rel), and inline JSX is more readable than a constant + conditional rendering. If the set grows beyond ~6 items the calculus changes; at 4 items inline wins.

## Build & Verification

- `npm run build` exits 0 after Task 1 AND after Task 2 (both verified before commit).
- 41 routes prerender; `/` continues to be statically generated with 30m revalidate.
- Final `src/app/page.tsx` is **403 lines** — exceeds the `min_lines: 290` must_have artifact spec.
- No new lint warnings; no new TypeScript errors.
- VALIDATION 10-05-V row passes: all grep assertions green (FooterCol ≥ 3 ✓; A calling card present ✓; bg-footer-bg present ✓; mailto: ≥ 2 ✓; © 2026 present ✓; border-footer-rule present ✓; PLAN-10-05 placeholder removed ✓).
- Visual smoke at `/` will show, top-to-bottom: header + manifesto + meta + epigraph + intro + BUILDING + WRITING + EVENTS + PHOTOGRAPHS + **PERSONAL** + **inverted ink footer** with copyright (left) and 4 socials (right).

## Files Touched

| File | Action | Commits |
|---|---|---|
| src/app/page.tsx | modified — PERSONAL_CARDS constant + PERSONAL section + FooterCol import + inverted footer + placeholder removed | ab005f6, 4a22cc5 |

## Setup for Downstream Plans

After Plan 10-05:

- `src/app/page.tsx` is **403 lines** with 11 of 13 homepage requirements shipped (HOME-V2-01..11). **Zero placeholder comments** remain in the file.
- The desktop editorial homepage is **feature-complete in static form**. All 5 content sections + footer render correctly at desktop breakpoints.
- The inverted ink palette pattern (`bg-footer-bg` + `text-footer-fg` + `text-footer-mute` + `border-footer-rule`) is now battle-tested.
- The FooterCol primitive (PRIM-07) has its first production consumer; Phase 11 future routes can reuse the pattern.
- Phase 9 LetterDrop primitive remains unallocated (Plan 10-07 reserve).
- Plan 10-06 (mobile parity, HOME-V2-12) is next: mobile breakpoint sweep across all sections, manifesto 3-line `["BRING", "FIRE TO", "HUMANITY."]`, 2×2 photo grid, footer column dividers, tap-target validation.
- Plan 10-07 (manifesto stagger, MOTION-07) is the phase-closing interaction plan.

## Known Stubs

None. All 3 PERSONAL cards link to canonical routes:

- **/photos** — 404 until Phase 11 ARCH-03 ships. Documented as deferred per CONTEXT 10-RESEARCH Risk 3 + plan acceptance criteria. The card is intentional advance scaffolding, not an unintentional stub.
- **/links** — existing v1.0 route (prerendered per the build output above), still served by the legacy implementation. Phase 12 may restyle.
- **/about** — existing v1.0 route, still served. Phase 12 may restyle.

The footer has the same shape: Photo Archive → /photos is a forward-pointer to Phase 11; all other links target existing routes.

## Threat Flags

None. No new auth surface, no new input handling, no new server endpoints. The PERSONAL section is static markup; the footer is static markup with 3 outbound `<a>` tags to trusted domains (x.com, github.com, linkedin.com) and one mailto: native protocol link. All outbound `<a>` tags use `rel="noopener noreferrer"` for safe new-tab behavior. T-10-05-CONF (build pipeline) is satisfied: `npm run build` exits 0 after each task. T-10-05-LINK (tampering on external <a> tags) was accepted in the plan threat model — trusted domains, native mailto:, no third-party JS injected.

## Self-Check: PASSED

- `src/app/page.tsx` — FOUND (403 lines; PERSONAL section + inverted footer both verified)
- `.planning/phases/10-editorial-homepage/10-05-SUMMARY.md` — FOUND (this file)
- Commit `ab005f6` (feat 10-05 PERSONAL) — FOUND in git log
- Commit `4a22cc5` (feat 10-05 footer) — FOUND in git log
- `npm run build` exits 0 after each task — VERIFIED (41 routes prerender)
- All Task 1 acceptance grep assertions — PASSED
- All Task 2 acceptance grep assertions + 10-VALIDATION 10-05-V — PASSED
- PERSONAL_CARDS 3-entry module-level constant — VERIFIED present
- FooterCol import + 3 production usages — VERIFIED present
- PLAN-10-05 placeholder comment — VERIFIED removed (zero placeholders remaining in page.tsx)
