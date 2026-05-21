# Roadmap: MSizzle Personal Website

## Milestones

- ✅ **v1.0 Build & Launch** — Phases 1-7 (shipped 2026-04-16, archived 2026-05-20). See [milestones/v1.0-ROADMAP.md](./milestones/v1.0-ROADMAP.md).
- 🚧 **v2.0 Editorial Redesign** — Phases 8-13. Vanschneider-inspired minimal editorial system, new homepage + archive pages, motion budget reset, lightweight sub-page restyle. Design contract: [research/editorial-redesign-handoff/README.md](./research/editorial-redesign-handoff/README.md).

## Phases

<details>
<summary>✅ v1.0 Build & Launch (Phases 1-7) — SHIPPED 2026-04-16</summary>

- [x] Phase 1: Foundation (1/1 plan) — completed 2026-03-31
- [x] Phase 2: Notion CMS Integration (1/1 plan) — completed 2026-03-31
- [x] Phase 3: Core Pages (6/6 plans) — completed 2026-04-02
- [x] Phase 4: Animation & Polish (3/3 plans) — completed 2026-04-03
- [x] Phase 5: Analytics (2/2 plans) — completed 2026-04-03
- [x] Phase 6: Pre-Launch QA (6/6 plans) — completed 2026-04-16 (GO verdict)
- [x] Phase 7: SEO Overhaul (11/11 plans) — completed 2026-04-16

Full milestone detail: [milestones/v1.0-ROADMAP.md](./milestones/v1.0-ROADMAP.md)

</details>

### 🚧 v2.0 Editorial Redesign (Phases 8-13)

- [ ] **Phase 8: Motion Subtractions** — Delete v1.0 animation loops, pulsing dots, hover-carousels, cascading reveals; preserve Lenis + page-fade
- [ ] **Phase 9: Design Tokens & Editorial Primitives** — Warm-paper palette tokens, editorial type scale utilities, 7 shared primitive components
- [ ] **Phase 10: Editorial Homepage** — Manifesto-anchored homepage with 5 labeled sections, ink footer, mobile parity, manifesto letter-stagger signature interaction
- [ ] **Phase 11: Archive Pages** — `/writing`, `/events`, `/photos` year-grouped archive pages
- [ ] **Phase 12: Sub-page Restyle Sweep** — Lightweight palette+typography pass on `/about`, `/projects`, `/blog`, `/links`, `/prometheus`, `/newsletter`
- [ ] **Phase 13: v2.0 QA & GO/NO-GO** — Production build gate, Lighthouse re-baseline (desktop + mobile PSI), mobile visual QA, dark-mode FOUC, secret scan, GO verdict

## Phase Details

### Phase 8: Motion Subtractions
**Goal**: Strip v1.0's competing animation loops and cascading reveals so the canvas is clean for editorial work — without breaking pages that currently import the deleted components.
**Depends on**: Nothing (first v2.0 phase; safe to ship before tokens/primitives because deletions are reversible)
**Requirements**: MOTION-01, MOTION-02, MOTION-03, MOTION-04, MOTION-05, MOTION-06, MOTION-08
**Success Criteria** (what must be TRUE):
  1. Loading the current homepage in production shows no auto-scrolling photo carousel, no rotating tagline, no hover-triggered works/writings carousels
  2. The featured event card on `/events` and the homepage render with no `animate-ping` pulsing indicator
  3. Event lists and blog card lists fade in together (or with simple per-item fade) — no visible cascading delay
  4. `vercel build --prod` exits 0 after deletions — no dead imports, no missing module errors
  5. Lenis smooth scroll and the 200-300ms page-load fade still work on every existing route
**Plans**: 7 plans
- [x] 08-01-PLAN.md — Delete `PhotoCarousel` (MOTION-01): remove component file, import, JSX, `getCarouselPhotos()` helper, and orphaned `fs`/`path` imports in `src/app/page.tsx`
- [x] 08-02-PLAN.md — Delete `RotatingTagline` (MOTION-02): remove component file, import, and `<RotatingTagline />` JSX block from Hero section
- [x] 08-03-PLAN.md — Delete `WorksCarousel` (MOTION-03): remove component file, import, JSX; replace with minimal first-3-projects `<Link>` list or empty-state copy
- [x] 08-04-PLAN.md — Delete `WritingsCarousel` (MOTION-04) + purge orphaned `scroll-left` keyframe + `.animate-scroll-*` utility classes from `globals.css`
- [ ] 08-05-PLAN.md — Remove `animate-ping` wrapper from `FeaturedUpcoming` (MOTION-05) + site-wide sweep for `animate-(ping|pulse|bounce|spin)`
- [ ] 08-06-PLAN.md — Flatten cascading ScrollReveal delays (MOTION-06): drop 4 accumulator-style `delay=` JSX props in `src/app/page.tsx` + `src/app/events/page.tsx` and clean 3 component prop signatures in `event-cards.tsx`
- [ ] 08-07-PLAN.md — Verify MOTION-08 preservation: `git diff main` byte-equality for Lenis/template/ScrollReveal + Vitest preservation tests + `vercel build --prod` phase gate + human smoke test
**Risks**: v1.0 components are currently imported by `app/page.tsx` and possibly other routes; sweeping deletion without grep-replacing call sites will break the build. Each motion-deletion plan must run a `rg <ComponentName>` sweep before removing the file. The `animate-ping` removal must also catch any other always-on CSS animations introduced after v1.0 close.

### Phase 9: Design Tokens & Editorial Primitives
**Goal**: Establish the warm-paper palette, editorial type scale on Inter, and the 7 shared primitive components that every subsequent phase will compose with.
**Depends on**: Phase 8
**Requirements**: TOKEN-01, TOKEN-02, TOKEN-03, PRIM-01, PRIM-02, PRIM-03, PRIM-04, PRIM-05, PRIM-06, PRIM-07
**Success Criteria** (what must be TRUE):
  1. A specimen page (or Storybook-style route) renders every palette token and type-scale utility at spec values pulled from the handoff
  2. Inter at weights 400/700 renders the 124px manifesto with letter-spacing -0.045em and line-height 0.96 — no Helvetica Neue swap, no font-loading flash
  3. Each of the 7 primitive components (`Rule`, `RuleStrong`, `SectionLabel`, `ListRow` + `big` variant, `AllLink`, `IntroLink`, `FooterCol`) renders in isolation with documented props and Tailwind-token-driven styling — zero arbitrary color or size values
  4. `vercel build --prod` exits 0 and the primitives type-check with zero TS errors
**Plans**: TBD
**UI hint**: yes
**Risks**: Tailwind v4 `@theme` block must be in `globals.css` (or equivalent) and the type-scale utilities must be authored as Tailwind v4 utilities, not arbitrary classes. Mis-placing the `@theme` block silently no-ops the tokens. Inter weight 700 must be explicitly requested in the `next/font/google` call — verify in `src/app/layout.tsx` before claiming TOKEN-03 complete.

### Phase 10: Editorial Homepage
**Goal**: Ship the manifesto-anchored editorial homepage end-to-end — desktop + mobile + the manifesto letter-stagger signature interaction — wired to live Notion data for the dynamic sections.
**Depends on**: Phase 9 (needs tokens + primitives), Phase 8 (needs deleted-component slots to fill)
**Requirements**: HOME-V2-01, HOME-V2-02, HOME-V2-03, HOME-V2-04, HOME-V2-05, HOME-V2-06, HOME-V2-07, HOME-V2-08, HOME-V2-09, HOME-V2-10, HOME-V2-11, HOME-V2-12, MOTION-07
**Success Criteria** (what must be TRUE):
  1. Visiting `/` on first paint shows "BRING FIRE / TO HUMANITY." at 124px uppercase with the per-letter translateY/opacity stagger; reloading or returning via internal nav does not replay the stagger (sessionStorage flag); `prefers-reduced-motion: reduce` falls back to a 300ms full-line opacity fade
  2. The homepage renders header → manifesto → meta row → epigraph photo → letter-style intro → BUILDING → WRITING → EVENTS → PHOTOGRAPHS → PERSONAL → inverted ink footer, in that order, with bold rules between sections
  3. The WRITING (3 latest essays), EVENTS (1 featured + 2 secondary), and BUILDING (Selected Works) sections pull real data from `notion.ts` / `notion-projects.ts` / `notion-events.ts` — no hardcoded essay titles, no hardcoded project names
  4. The Photographs grid renders 6 plates in the documented 12-column asymmetric layout with `mix-blend-mode: difference` caption overlays that stay legible over each image
  5. At 390px viewport the homepage renders single-column with manifesto at 56px / 4 lines, photographs as a 2×2 grid, inverted footer with per-column hairline dividers, and every tap target ≥ 44px
**Plans**: TBD
**UI hint**: yes
**Risks**: BUILDING / Selected Works depends on `notion-projects.ts` returning at least 8 entries — verify Notion DB content before plan kickoff. The manifesto stagger is the *only* surviving signature interaction; any regression here violates the motion budget and must block ship. SessionStorage flag must be keyed per-tab (not localStorage) so the user can replay by re-opening; verify keying explicitly. Footer column copy (Studio / Library / Person) is static and must match the handoff exactly.

### Phase 11: Archive Pages
**Goal**: Ship three new editorial archive pages (`/writing`, `/events`, `/photos`) using the year-grouped `YearBlock` pattern, wired to live Notion data, with the giant-day-numeral signature visual on `/events`.
**Depends on**: Phase 9 (primitives), Phase 10 (homepage links target these archives)
**Requirements**: ARCH-01, ARCH-02, ARCH-03
**Success Criteria** (what must be TRUE):
  1. `/writing` renders the 2-column title block (label · `Writing.` 120px · blurb · 360×480 atmosphere photo), then year-grouped essay lists with sticky year labels, ending in an inverted ink email-subscribe footer — all essays come from Notion, no hardcoded titles
  2. `/events` renders the matching title block, an Upcoming section with the 84px/56px giant day numerals as the signature visual + RSVP CTAs, and a denser Past section in 4-column rows — both sections pull from `notion-events.ts`
  3. `/photos` renders a year-grouped grid mirroring `/writing`'s `YearBlock` pattern using existing photos in `/public/MSizzle-website-photos/`
  4. The Photographs section on the homepage links to `/photos` and the click navigates successfully
  5. At 390px viewport all three archive pages render single-column with no horizontal overflow
**Plans**: TBD
**UI hint**: yes
**Risks**: `/events` requires upcoming events in Notion for the giant-numeral section to look right — verify Notion DB has at least one upcoming event before plan kickoff, or ship a graceful empty state. `/photos` has no Notion source; year grouping must be derived from photo metadata or filename convention — decide and document the source-of-truth at plan-check. The email-subscribe footer on `/writing` should reuse the existing newsletter integration, not introduce a second pipeline.

### Phase 12: Sub-page Restyle Sweep
**Goal**: Apply the warm-paper palette and editorial type scale to every existing sub-page so the whole site reads as one system — no layout changes, palette + typography pass only.
**Depends on**: Phase 9 (tokens + primitives)
**Requirements**: RESTYLE-01, RESTYLE-02, RESTYLE-03, RESTYLE-04, RESTYLE-05, RESTYLE-06
**Success Criteria** (what must be TRUE):
  1. `/about`, `/projects` (index + slug), `/blog` (index + slug), `/links`, `/prometheus`, and `/newsletter` all render on the `bg-paper` background with `text-ink` body type and `text-muted` secondary type — zero v1.0 palette holdouts visible
  2. Body type on sub-pages uses the editorial type-scale utilities (body 16-18px, caption 13-15px, tracked labels at 11px) — no arbitrary `text-[14px]` values introduced
  3. Existing page layouts (Breadcrumbs on `/about`, project cards on `/projects`, tag filter on `/blog`, link list on `/links`, FAQ on `/prometheus`, carousel on `/newsletter`) render unchanged structurally
  4. The `/newsletter` clickable carousel is preserved as the documented motion-budget exception — still functions, no loops added
  5. `vercel build --prod` exits 0 with the restyled pages; no regressions in dark-mode rendering for pages still supporting it
**Plans**: TBD
**UI hint**: yes
**Risks**: This phase touches 7 routes — high parallelization opportunity but also high risk of palette-token drift if plans use slightly different class patterns. Define a one-page "restyle recipe" at phase plan-check before splitting into per-route plans. The `/newsletter` carousel is the *only* sanctioned carousel survivor; any plan must explicitly preserve it, not "tidy it up."

### Phase 13: v2.0 QA & GO/NO-GO
**Goal**: Verify the redesigned site against production-readiness gates and deliver a signed GO/NO-GO verdict that can ship to `montysinger.com`. Run `/gsd:complete-milestone` at the GO verdict, not weeks later.
**Depends on**: Phases 8, 9, 10, 11, 12 (everything must be in)
**Requirements**: QA-V2-01, QA-V2-02, QA-V2-03, QA-V2-04, QA-V2-05, QA-V2-06, QA-V2-07
**Success Criteria** (what must be TRUE):
  1. `vercel build --prod` exits 0 with zero TS / ESLint / 429 errors on the redesigned codebase — captured as the canonical production-readiness gate
  2. Lighthouse desktop scores ≥ 90/95/95/100 on home / about / prometheus / blog index / blog post against the new design — captured in the GO/NO-GO doc
  3. PageSpeed Insights mobile (authoritative per v1.0 retrospective; local mobile Lighthouse explicitly NOT a gate) scores ≥ 75 on the homepage
  4. Visual QA at 375px confirms the homepage and all 3 archive pages render with no horizontal overflow and no broken editorial layout
  5. Dark-mode FOUC test passes in incognito Chrome — system theme controls first paint with no flash (or a dark-mode dropped decision is explicitly recorded if v2.0 ships light-only)
  6. D-14 client-bundle secret scan re-run against both `.next/static/chunks/` and `.vercel/output/static/_next/static/chunks/` trees returns zero literal-secret leaks
  7. A signed `13-GO-NO-GO.md` exists with an explicit GO verdict, and `/gsd:complete-milestone` is run AT that verdict (carried forward from v1.0 retrospective lesson #1)
**Plans**: TBD
**Risks**: PSI scores can fluctuate; QA-V2-03 must use PSI not local mobile Lighthouse. The GO/NO-GO doc is the canonical phase-close artifact for this QA phase per the v1.0 retrospective — per-plan SUMMARYs are optional; the GO doc is mandatory. Dark-mode decision: if no dark-mode editorial palette has been built by this phase, the GO doc must explicitly record "light-only ship, dark dropped to future requirement" rather than silently fail the FOUC test.

## Progress

| Phase | Milestone | Plans | Status | Completed |
|-------|-----------|-------|--------|-----------|
| 1. Foundation | v1.0 | 1/1 | Complete | 2026-03-31 |
| 2. Notion CMS Integration | v1.0 | 1/1 | Complete | 2026-03-31 |
| 3. Core Pages | v1.0 | 6/6 | Complete | 2026-04-02 |
| 4. Animation & Polish | v1.0 | 3/3 | Complete | 2026-04-03 |
| 5. Analytics | v1.0 | 2/2 | Complete | 2026-04-03 |
| 6. Pre-Launch QA | v1.0 | 6/6 | Complete | 2026-04-16 |
| 7. SEO Overhaul | v1.0 | 11/11 | Complete | 2026-04-16 |
| 8. Motion Subtractions | v2.0 | 4/7 | In Progress|  |
| 9. Design Tokens & Editorial Primitives | v2.0 | 0/? | Not started | — |
| 10. Editorial Homepage | v2.0 | 0/? | Not started | — |
| 11. Archive Pages | v2.0 | 0/? | Not started | — |
| 12. Sub-page Restyle Sweep | v2.0 | 0/? | Not started | — |
| 13. v2.0 QA & GO/NO-GO | v2.0 | 0/? | Not started | — |
