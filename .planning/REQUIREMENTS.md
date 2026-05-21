# Requirements: v2.0 Editorial Redesign

**Milestone:** v2.0 Editorial Redesign
**Created:** 2026-05-20
**Source:** PROJECT.md v2.0 Active section + `.planning/research/editorial-redesign-handoff/README.md`

The redesign is a *subtraction* from v1.0, not an addition. Vanschneider-inspired editorial minimal — one typeface, two weights, warm-paper monochrome, strict motion budget. Every requirement here either replaces v1.0 behavior or adds a new editorial primitive the rest depends on.

## v2.0 Requirements

### Design Tokens & Typography

- [x] **TOKEN-01**: Tailwind v4 `@theme` block defines the warm-paper palette as named tokens (`paper #F4F2EC`, `ink #0E0E0C`, `muted #9A9690`, `faint #C7C3BA`, `rule #E5E2D9`, `rule-strong #1A1A18`, `footer-bg`, `footer-fg`, `footer-mute`, `footer-rule`)
- [x] **TOKEN-02**: Custom Tailwind utilities exist for the editorial type scale (`text-display` 124px, page-title 120px, feature 44px, list-title 28px, body-lead 22px, body 16-18px, caption 13-15px, nav 13px, label 11px tracked 0.18-0.22em, meta 11px tracked 0.14-0.18em) — each utility bundles font-size + line-height + letter-spacing + weight per the handoff spec
- [x] **TOKEN-03**: Existing Inter font (already wired via `next/font/google` weights 400/700) is the typeface — Helvetica Neue spec values applied to Inter; no font swap

### Shared Editorial Primitives

- [ ] **PRIM-01**: `Rule` component — 1px hairline horizontal divider (`border-rule`)
- [ ] **PRIM-02**: `RuleStrong` component — 1px bold horizontal section divider (`border-rule-strong`)
- [ ] **PRIM-03**: `SectionLabel` component — 11px tracked uppercase section heading with optional right-aligned numeral
- [ ] **PRIM-04**: `ListRow` component — linked row with title + optional `extra` blurb + right-aligned tracked meta; `big` variant for archive pages
- [ ] **PRIM-05**: `AllLink` component — tracked uppercase "All X →" link with 1px ink bottom-border
- [ ] **PRIM-06**: `IntroLink` component — inline link with 1px ink bottom-border (used in letter-style intro)
- [ ] **PRIM-07**: `FooterCol` component — footer column with tracked uppercase title + list of links with grey sub-line

### New Homepage

- [ ] **HOME-V2-01**: Homepage header — name on left (15px bold), 5-link nav on right (Building · Writing · Events · About · Links) at 13px baseline-aligned
- [ ] **HOME-V2-02**: Hero manifesto renders "BRING FIRE / TO HUMANITY." at 124px uppercase 700 weight, line-height 0.96, letter-spacing -0.045em, each line `white-space: nowrap`
- [ ] **HOME-V2-03**: Meta row below manifesto with 32px hairline + "EST. 2026 · WASHINGTON, D.C." in 11px tracked uppercase muted
- [ ] **HOME-V2-04**: Epigraph image — single full-width letterbox photo (1120 × 540) using `PHOTOS[0]` with figcaption row (caption left, "Photographed on film" right)
- [ ] **HOME-V2-05**: Letter-style intro paragraph (max-width 720px, 22px body, line-height 1.55) with three inline `IntroLink`s to Prometheus / Monty Monthly / essays
- [ ] **HOME-V2-06**: BUILDING section — 2 rows (Prometheus, Selected Works) in 3-column grid (180px tag / 1fr title / 1fr blurb+link); Selected Works pulls live names from `notion-projects.ts` (8 real projects)
- [ ] **HOME-V2-07**: WRITING section — 3 latest essays as `ListRow big` with title + 13px muted extra blurb + 11px tracked date right; "All writing →" link
- [ ] **HOME-V2-08**: EVENTS section — featured upcoming event in 3-column grid (180px date / content / RSVP CTA) + 2 secondary `ListRow` entries + "All events →" link; **no `animate-ping` indicator**
- [ ] **HOME-V2-09**: PHOTOGRAPHS section — 12-column asymmetric grid with 6 plates per the handoff layout spec, `mix-blend-mode: difference` caption overlays, `Photo Archive →` link
- [ ] **HOME-V2-10**: PERSONAL section — 3-column card grid (Photo Archive, Links & Elsewhere, About) with top 1px ink border per card
- [ ] **HOME-V2-11**: Inverted ink footer with 4-column layout — colophon ("A calling card, not a billboard.") + 3 grouped link columns (Studio / Library / Person) + bottom row (copyright + socials)
- [ ] **HOME-V2-12**: Mobile homepage — same sections in single-column at 390px reference, manifesto at 56px / 4 lines, photographs as 2×2 grid, footer inverts with per-column hairline dividers, tap targets ≥ 44px

### Archive Pages

- [ ] **ARCH-01**: `/writing` index — 2-column title block (label "── The Library · 02" + `Writing.` page title 120px + blurb + 360×480 atmosphere photo), then year-grouped `YearBlock`s (2026, 2025, 2024) with sticky year labels, ending in an inverted email-subscribe footer
- [ ] **ARCH-02**: `/events` index — 2-column title block matching `/writing`, then Upcoming section (3-column grid with giant 84px/56px day numerals as signature visual + RSVP CTAs) and Past section (denser 4-column rows)
- [ ] **ARCH-03**: `/photos` archive — year-grouped grid mirroring `/writing`'s `YearBlock` pattern using existing photos in `/public/MSizzle-website-photos/`, linked from the homepage Photographs grid

### Sub-page Lightweight Restyle (No Layout Changes)

- [ ] **RESTYLE-01**: `/about` adopts warm-paper palette tokens + Inter at spec sizes; existing layout (Breadcrumbs + h1 + prose) preserved
- [ ] **RESTYLE-02**: `/projects` (index + `/projects/[slug]`) adopts palette + typography tokens; existing project card layout preserved
- [ ] **RESTYLE-03**: `/blog` and `/blog/[slug]` adopt palette + typography tokens; existing tag filter + post body preserved
- [ ] **RESTYLE-04**: `/links` adopts palette + typography tokens; existing link list preserved
- [ ] **RESTYLE-05**: `/prometheus` adopts palette + typography tokens; existing prose + FAQ preserved
- [ ] **RESTYLE-06**: `/newsletter` adopts palette + typography tokens; existing carousel preserved as the one clickable-carousel exception

### Motion Budget

- [x] **MOTION-01**: Delete photo auto-scroll carousel (`components/home/photo-carousel.tsx`) and all references
- [x] **MOTION-02**: Delete rotating tagline (`components/home/rotating-tagline.tsx`) and all references
- [x] **MOTION-03**: Delete hover-triggered works carousel (`components/home/works-carousel.tsx`) and all references
- [x] **MOTION-04**: Delete hover-triggered writings carousel (`components/home/writings-carousel.tsx`) and all references
- [x] **MOTION-05**: Remove `animate-ping` pulsing indicator from featured event card (`components/events/event-cards.tsx:53`) and any other always-on CSS animations site-wide
- [x] **MOTION-06**: Flatten cascading ScrollReveal delays on event and blog card lists — same-time reveal or simple per-item fade only
- [ ] **MOTION-07**: Manifesto letter-stagger signature interaction — per-character `translateY(110%)→0` + opacity 0→1, 18ms per-letter stagger, 500-700ms duration, fires ONCE on first paint of `/` (sessionStorage flag to skip on route returns), respects `useReducedMotion()` (300ms full-line fade fallback)
- [ ] **MOTION-08**: Lenis smooth scroll and 200-300ms page-load fade preserved as the only other site-wide motion

### QA & Launch

- [ ] **QA-V2-01**: `vercel build --prod` exits 0 with zero TS / ESLint / 429 errors on the redesigned codebase
- [ ] **QA-V2-02**: Lighthouse desktop scores ≥ 90/95/95/100 on home / about / prometheus / blog index / blog post against the new design
- [ ] **QA-V2-03**: Lighthouse mobile (PSI authoritative) ≥ 75 on homepage — accepted floor matching v1.0's PSI 77 baseline
- [ ] **QA-V2-04**: Visual QA at 375px mobile viewport confirms editorial layout reads correctly on the homepage and all 3 archive pages with no horizontal overflow
- [ ] **QA-V2-05**: Dark-mode FOUC test passes incognito Chrome — system theme controls first paint with no flash (warm-paper palette in light, ink-inverted equivalent in dark — or light-only with explicit decision recorded if dark dropped)
- [ ] **QA-V2-06**: D-14 client-bundle secret scan re-run against new build, zero leaks (regression check post-restyle)
- [ ] **QA-V2-07**: GO/NO-GO doc explicitly signed off before v2.0 close — `/gsd:complete-milestone` run AT the GO verdict, not weeks later (carryforward lesson from v1.0 retrospective)

## Future Requirements (Deferred Beyond v2.0)

- [ ] Dark-mode editorial palette variant (if v2.0 ships light-only initially)
- [ ] CMS-driven manifesto rotation (currently hardcoded in code, not Notion)
- [ ] Sub-page LAYOUT redesigns (this milestone only does palette+typography pass)

## Out of Scope

- **Carousels on the homepage** — explicit removal per motion budget; clickable carousels OK on `/newsletter` only
- **New routes beyond /writing, /events, /photos** — sub-pages keep their existing routes
- **CMS migration** — Notion stays; no schema changes to existing databases
- **Custom webfont licensing (Helvetica Neue)** — Inter is the chosen typeface; spec values carry the editorial feel
- **Animation reintroduction post-launch** — v2.0 motion budget is durable, not provisional
- **v1.0-style stacked carousels, rotating taglines, hover-scrollers, pulsing indicators** — explicitly deleted, not replaced

## Traceability

Every v2.0 REQ-ID mapped to exactly one phase. 46/46 mapped · 0 orphans.

| Requirement | Phase | Status |
|-------------|-------|--------|
| TOKEN-01 | Phase 9 | not_started |
| TOKEN-02 | Phase 9 | not_started |
| TOKEN-03 | Phase 9 | not_started |
| PRIM-01 | Phase 9 | not_started |
| PRIM-02 | Phase 9 | not_started |
| PRIM-03 | Phase 9 | not_started |
| PRIM-04 | Phase 9 | not_started |
| PRIM-05 | Phase 9 | not_started |
| PRIM-06 | Phase 9 | not_started |
| PRIM-07 | Phase 9 | not_started |
| HOME-V2-01 | Phase 10 | not_started |
| HOME-V2-02 | Phase 10 | not_started |
| HOME-V2-03 | Phase 10 | not_started |
| HOME-V2-04 | Phase 10 | not_started |
| HOME-V2-05 | Phase 10 | not_started |
| HOME-V2-06 | Phase 10 | not_started |
| HOME-V2-07 | Phase 10 | not_started |
| HOME-V2-08 | Phase 10 | not_started |
| HOME-V2-09 | Phase 10 | not_started |
| HOME-V2-10 | Phase 10 | not_started |
| HOME-V2-11 | Phase 10 | not_started |
| HOME-V2-12 | Phase 10 | not_started |
| ARCH-01 | Phase 11 | not_started |
| ARCH-02 | Phase 11 | not_started |
| ARCH-03 | Phase 11 | not_started |
| RESTYLE-01 | Phase 12 | not_started |
| RESTYLE-02 | Phase 12 | not_started |
| RESTYLE-03 | Phase 12 | not_started |
| RESTYLE-04 | Phase 12 | not_started |
| RESTYLE-05 | Phase 12 | not_started |
| RESTYLE-06 | Phase 12 | not_started |
| MOTION-01 | Phase 8 | not_started |
| MOTION-02 | Phase 8 | not_started |
| MOTION-03 | Phase 8 | not_started |
| MOTION-04 | Phase 8 | not_started |
| MOTION-05 | Phase 8 | not_started |
| MOTION-06 | Phase 8 | not_started |
| MOTION-07 | Phase 10 | not_started |
| MOTION-08 | Phase 8 | not_started |
| QA-V2-01 | Phase 13 | not_started |
| QA-V2-02 | Phase 13 | not_started |
| QA-V2-03 | Phase 13 | not_started |
| QA-V2-04 | Phase 13 | not_started |
| QA-V2-05 | Phase 13 | not_started |
| QA-V2-06 | Phase 13 | not_started |
| QA-V2-07 | Phase 13 | not_started |

**Total:** 46 requirements across 6 categories, mapped to 6 phases (Phase 8-13).

### Per-Phase Counts

| Phase | Requirement Count | Categories |
|-------|-------------------|------------|
| Phase 8 — Motion Subtractions | 7 | MOTION (01-06, 08) |
| Phase 9 — Design Tokens & Editorial Primitives | 10 | TOKEN (01-03) + PRIM (01-07) |
| Phase 10 — Editorial Homepage | 13 | HOME-V2 (01-12) + MOTION-07 |
| Phase 11 — Archive Pages | 3 | ARCH (01-03) |
| Phase 12 — Sub-page Restyle Sweep | 6 | RESTYLE (01-06) |
| Phase 13 — v2.0 QA & GO/NO-GO | 7 | QA-V2 (01-07) |
| **Total** | **46** | — |
