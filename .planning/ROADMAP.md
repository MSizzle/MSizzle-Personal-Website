# Roadmap: MSizzle Personal Website

## Milestones

- ✅ **v1.0 Build & Launch** — Phases 1-7 (shipped 2026-04-16, archived 2026-05-20). See [milestones/v1.0-ROADMAP.md](./milestones/v1.0-ROADMAP.md).
- ✅ **v2.0 Editorial Redesign** — Phases 8-13 (shipped 2026-05-21, archived 2026-05-21). See [milestones/v2.0-ROADMAP.md](./milestones/v2.0-ROADMAP.md).
- 🚧 **v3.0 Dark Brutalist Rebuild** — Phases 14-18 (planning).

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

<details>
<summary>✅ v2.0 Editorial Redesign (Phases 8-13) — SHIPPED 2026-05-21</summary>

- [x] Phase 8: Motion Subtractions (7/7 plans) — completed 2026-05-21
- [x] Phase 9: Design Tokens & Editorial Primitives (9/9 plans) — completed 2026-05-21
- [x] Phase 10: Editorial Homepage (7/7 plans) — completed 2026-05-21
- [x] Phase 11: Archive Pages (5/5 plans) — completed 2026-05-21
- [x] Phase 12: Sub-page Restyle Sweep (7/7 plans) — completed 2026-05-21
- [x] Phase 13: v2.0 QA & GO/NO-GO (6/6 plans) — completed 2026-05-21 (GO verdict, signed)

Full milestone detail: [milestones/v2.0-ROADMAP.md](./milestones/v2.0-ROADMAP.md)

</details>

### 🚧 v3.0 Dark Brutalist Rebuild (Phases 14-18)

**Milestone Goal:** Rebuild the presentation layer of montysinger.com as a dark, flat, brutalist site (Crimson Poster palette, wheel-driven slide-deck homepage, lazy-loaded 3D hero object) while preserving all existing infrastructure. Built on a `v3` branch, previewed on Vercel, and promoted via alias swap at parity + QA.

- [x] **Phase 14: Branch & Crimson Poster Foundation** - `v3` branch + Crimson Poster `@theme` tokens and brutalist primitives, previewed on Vercel (completed 2026-06-19)
- [x] **Phase 15: WebGL Explorative Homepage** - Lusion-grade WebGL scroll-story homepage (real-time 3D hero, fluid interweaving line, themed beats); replaces the superseded slide deck. Desktop-WebGL / mobile-poster. (completed 2026-06-19)
- [x] **Phase 16: Interior Pages on Notion Data** - All interior pages rebuilt on the new system and wired to existing Notion loaders, plus new /uses and /watching (completed 2026-06-20)
- [x] **Phase 17: Infrastructure Preservation & SEO Extension** - Verify Notion/image-proxy/analytics intact and extend SEO to the new pages (completed 2026-06-21)
- [ ] **Phase 18: v3.0 QA, Perf Gate & Alias Swap** - Production-readiness gate, mobile-perf budget, GO/NO-GO, and production alias promotion

## Phase Details

### Phase 14: Branch & Crimson Poster Foundation

**Goal**: The `v3` branch exists on a Vercel preview and renders the Crimson Poster design system — tokens plus a full set of brutalist primitives — ready to build pages on.
**Depends on**: Phase 13 (v2.0 shipped; existing stack is the base)
**Requirements**: DS-01, DS-02, DS-03, DS-04, DS-05, DQ-01
**Success Criteria** (what must be TRUE):

  1. The `v3` branch is live on a Vercel preview URL with the production site unaffected.
  2. A primitives showcase renders the Crimson Poster palette (crimson-orange field #d93c1e, black accent, near-black text, no gradients) with display headings in crimson lifted by a hard black drop shadow and an outline-stroke variant.
  3. Space Grotesk (display) and JetBrains Mono (labels) load on a defined type scale via Tailwind v4 `@theme` tokens.
  4. Every brutalist primitive (rules, section labels, clickable list rows, big-type list, buttons, marquee, cards) is available and demonstrated.
  5. With `prefers-reduced-motion` set, autonomous and scroll-driven animation is disabled and content stays fully usable.

**Plans**: 4 plans

- [x] 14-01-PLAN.md — v3 branch + deploy baseline + Crimson Poster @theme tokens, sig utility, Space Grotesk/JetBrains Mono fonts
- [x] 14-02-PLAN.md — Static brutalist primitives (Rule, RuleStrong, SectionLabel, Chip, ListRow, Button, BigList, PageHero, Marquee)
- [x] 14-03-PLAN.md — Composite + animated primitives (Card, VideoCard, NewsletterCarousel, UsesList, Reveal)
- [x] 14-04-PLAN.md — /v3-specimen showcase route + production build gate (DQ-01 readiness)

**UI hint**: yes

### Phase 15: WebGL Explorative Homepage

**Goal**: The homepage is an expansive, Lusion-grade WebGL "explorative scroll-story" -- a real-time 3D hero object, a fluid interweaving scroll line, and themed section beats you wander down -- that stays inside the project's perf budget. Replaces the superseded slide deck.
**Depends on**: Phase 14
**Direction validated by**: sketches 003-005 (`.planning/sketches/`) + perf spike 001 (`.planning/spikes/`, GO-WITH-CUTS). See memory homepage-webgl-direction.
**Requirements**: TD-01, TD-02, TD-03 (3D object / lazy-load / fallback -- carry forward), HD-04 (big-type index), HD-05 (touch/small-screen fallback). _HD-01, HD-02, HD-03 (CHOMP wheel-deck nav) are superseded._
**Success Criteria** (what must be TRUE):

  1. Palette: near-black canvas, off-white name (NO red-on-red), crimson as a sparing accent (line / rim / hover).
  2. Desktop renders a live WebGL 3D hero (PBR/clearcoat, RoomEnvironment IBL, crimson rim, bloom) with GPU vertex-shader morph; canvas is `dynamic({ssr:false})` in a `"use client"` loader, mounted after LCP.
  3. LCP element is SSR'd text/poster -- never the canvas; mobile LCP/PSI stays within the budget already won.
  4. Mobile / pointer:coarse / small-screen / reduced-motion / no-WebGL2 -> static poster (`public/hero-blob-poster.webp`), no canvas.
  5. Expansive scroll-story structure with four section beats (Building, Writing, Newsletter, Footer); GLB swap-in seam built; v1 ships on the procedural blob stand-in.

**Plans**: 5 plans

- [x] 15-01-PLAN.md — Palette swap (globals.css Crimson Line tokens + deck CSS removal) + 1x1 poster placeholder + test scaffolds
- [x] 15-02-PLAN.md — GPU vertex-shader HeroBlob (CSM migration) + HeroBlobCanvas (Bloom/postprocessing) + HeroPodium
- [x] 15-03-PLAN.md — canvas-loader.tsx (after-LCP dynamic mount) + explorative-homepage.tsx (gate orchestrator) + page.tsx swap
- [x] 15-04-PLAN.md — FallbackPoster + four section beats (Building, Writing, Newsletter, Footer)
- [x] 15-05-PLAN.md — Playwright poster capture + scroll-cue + GLB swap-in seam + visual verification checkpoint

**Carry-forward from the superseded deck**: HeroBlob, HeroBlobCanvas, FallbackPoster, WebGL2 detection, section content, v3 tokens.
**Build cuts (from spike 001, non-negotiable)**: desktop-only WebGL; defer canvas mount past LCP; GPU vertex-shader morph (no per-frame JS computeVertexNormals); trim/lazy postprocessing; produce the poster asset; confirm on Vercel preview PSI mobile.
**UI hint**: yes
**Note**: directory slug `15-slide-deck-homepage-3d-hero` is legacy (kept to avoid breaking references).

### Phase 16: Interior Pages on Notion Data

**Goal**: Every interior page is rebuilt in the Pumpkin Amber system, sourced from the existing Notion pipeline, with a shared nav and footer and the two new pages (/uses, /watching) live.
**Depends on**: Phase 15
**Requirements**: PG-01, PG-02, PG-03, PG-04, PG-05, IN-01, IN-02
**Success Criteria** (what must be TRUE):

  1. Writing index, Essay reading view, Works index, Project detail, About, Prometheus, Newsletter, Events, and Links render in the new system with content sourced from Notion as today (ISR 30min, dataSources.query v5 unchanged), and Notion images serve through the existing proxy routes.
  2. The essay reading view shows breadcrumb, reading time, publish date, prose, and related essays; the writing and works indexes show excerpts.
  3. A new `/uses` page (grouped tools and stack) is built and linked.
  4. A new `/watching` page lists favorite YouTube videos as cards that link out to YouTube.
  5. A shared nav and footer link all pages with correct active states and breadcrumbs.

**Plans**: 9 plans

- [x] 16-01-PLAN.md — next.config.ts (add YouTube remotePattern, remove /uses redirect) + src/lib/uses.ts + src/lib/watching.ts + Wave 0 test scaffolds
- [x] 16-02-PLAN.md — Navigation active-label extension (/uses, /watching, Prometheus in mobile) + V3Footer full sitemap + ConditionalFooter swap
- [x] 16-03-PLAN.md — Editorial component token repaint (ListRow, YearBlock, Rule, RuleStrong, SectionLabel, AllLink) to Pumpkin Amber
- [x] 16-04-PLAN.md — Writing index + Projects index repainted with v3 PageHero + Pumpkin Amber tokens
- [x] 16-05-PLAN.md — New /uses page (UsesList + USES_DATA) + new /watching page (VideoCard grid + WATCHING_ITEMS)
- [x] 16-06-PLAN.md — Essay reading view (/blog/[slug]) repainted with PageHero, full-bleed cover, reading meta, related essays
- [x] 16-07-PLAN.md — Project detail (/projects/[slug]) repainted with full-bleed cover, breadcrumb, Pumpkin Amber tokens
- [x] 16-08-PLAN.md — About, Prometheus, Newsletter, Events, Links pages repainted with PageHero + Pumpkin Amber tokens
- [x] 16-09-PLAN.md — Automated gate (vitest + build + ISR audit + token audit) + human visual checkpoint on v3 preview

**UI hint**: yes

### Phase 17: Infrastructure Preservation & SEO Extension

**Goal**: All preserved infrastructure (Notion, image proxy, SEO, analytics) is verified intact on the `v3` branch, and SEO is extended to the two new pages.
**Depends on**: Phase 16
**Requirements**: IN-03, IN-04
**Success Criteria** (what must be TRUE):

  1. Sitemap, robots, blog feed, `src/lib/seo`, JSON-LD, and per-page metadata are preserved and now include the new `/uses` and `/watching` pages.
  2. Umami analytics loads and tracks on every page of the `v3` preview.
  3. The blog feed, sitemap, and robots resolve correctly on the preview with no regressions versus production.

**Plans**: 1 plan
Plans:

- [x] 17-01-PLAN.md — Add /uses + /watching to sitemap + automated regression gate (IN-03, IN-04)

### Phase 17.1: Homepage Rebuild (INSERTED)

**Goal**: The homepage is rebuilt around a personal-brand narrative arc (who am I → what I am building → how to engage), rendered in the CURRENT aesthetic (Pumpkin Amber palette + current fonts), replacing the superseded WebGL blob scroll-story. The WebGL/blob canvas is removed from the home path. Full agreed direction lives in project memory `personal-brand-homepage-direction`.
**Depends on**: Phase 17
**Requirements**: TBD (set at plan time; governed by CONTEXT.md D-01..D-12)
**Success Criteria** (what must be TRUE):

  1. The homepage renders the who → what → engage arc in the current aesthetic, with no WebGL/blob canvas on the home path.
  2. Sections present and populated top-to-bottom: hero (Founder of Prometheus + one-liner + one woven "way in" to Monty Monthly), what-I'm-building (Prometheus + current work, CTA woven into prose), selected-work/portfolio teaser, "things I love" teaser, writing + Monty Monthly gate (a flagship essay or two shown open), understated footer contact (email + socials woven in).
  3. Engagement is woven/contextual only: no CTA button and no contact page; the primary "way in" is Monty Monthly (velvet-rope principle).

**Plans**: 4 plans

**Wave 1**

- [x] 17.1-01-PLAN.md — Blob removal + text-forward hero + orchestrator refactor (explorative-homepage.tsx becomes Server Component, no canvas gate)

**Wave 2** *(parallel; both depend on 17.1-01)*

- [x] 17.1-02-PLAN.md — New section-work.tsx + section-loves.tsx + orchestrator final assembly (D-06 narrative arc order, SectionWriting retired)
- [x] 17.1-03-PLAN.md — Section narrative copy adaptations: section-building (Prometheus-forward), section-newsletter (essay teasers + newsletter gate), section-footer (velvet-rope tone)

**Wave 3** *(depends on Wave 2 completion)*

- [x] 17.1-04-PLAN.md — Automated build gate + human visual verify at localhost:3000 (D-12)

### Phase 17.2: Site Information Architecture (INSERTED)

**Goal**: The site IA matches the new scope. New nav (Building, Work, Things I love, Writing, Prometheus). Cut /events and /photos. Delete /specimen and /v3-specimen dev pages. Fold /links socials into the woven footer/contact layer. Reframe /uses as "Things I love" and fold /watching into it. Merge /writing + /newsletter into a single "Writing / Monty Monthly" surface (hybrid: a few open flagship essays + the newsletter gate). Keep /about and /prometheus as dedicated pages.
**Depends on**: Phase 17.1
**Requirements**: D-01, D-02, D-03, D-04, D-05, D-06, D-07, D-08, D-09, D-10 (governed by 17.2-CONTEXT.md)
**Success Criteria** (what must be TRUE):

  1. Nav reflects the new set; /events, /photos, /specimen, /v3-specimen no longer exist (routes + nav + sitemap all updated).
  2. /links is folded into the footer/contact layer; /watching is folded into a reframed /uses ("Things I love").
  3. /writing and /newsletter are merged into one "Writing / Monty Monthly" surface; sitemap, nav, and internal links are consistent with the new IA with no broken links.

**Plans**: 4 plans

**Wave 1**

- [x] 17.2-01-PLAN.md — 5 x 301 redirects in next.config.ts + 7 route dir deletions + sitemap.ts trimmed to 6 routes + SEO/component test lockstep

**Wave 2** *(parallel; both depend on 17.2-01)*

- [x] 17.2-02-PLAN.md — Nav/footer link sweep (EditorialHeader 4-item nav, Navigation MOBILE_LINKS, V3Footer + section-footer + slide-footer restructure)
- [x] 17.2-03-PLAN.md — /uses reframe "Things I Love" + Watching section (VideoCard + WATCHING_ITEMS); /writing merge Monty Monthly section + update page tests

**Wave 3** *(depends on Wave 2 completion)*

- [x] 17.2-04-PLAN.md — Automated validation gate (grep + vitest + build) + human visual checkpoint on /uses, /writing, nav, footer, redirects

### Phase 17.3: Portfolio (INSERTED)

**Goal**: A real portfolio surface for proud past work exists, built on the existing /projects (Notion) pipeline in the current aesthetic, and linked from the homepage "selected work" section.
**Depends on**: Phase 17.1
**Requirements**: SC-1 (portfolio surface), SC-2 (homepage link) — set at plan time; no formal REQ IDs in REQUIREMENTS.md
**Success Criteria** (what must be TRUE):

  1. A portfolio surface presents selected proud-of past work, sourced from the existing projects Notion pipeline, in the current aesthetic.
  2. The homepage "selected work" section links into the portfolio.

**Plans**: 2 plans

**Wave 1** *(parallel — no shared files)*

- [x] 17.3-01-PLAN.md — /portfolio page route (getFeaturedProjects, ISR 1800, year-grouped Card grid, empty-state) + sitemap /portfolio entry + portfolio tests + sitemap test update
- [ ] 17.3-02-PLAN.md — section-work.tsx link update (/projects → /portfolio, D-01) + section-work.test.tsx (SC-2 assertions)

### Phase 18: v3.0 QA, Perf Gate & Alias Swap

**Goal**: v3 passes the production-readiness gate and mobile-perf budget, earns a GO verdict, and the production alias is promoted to v3 and verified.
**Depends on**: Phase 17.3
**Requirements**: DQ-02, DQ-03, DQ-04
**Success Criteria** (what must be TRUE):

  1. `vercel build --prod` passes cleanly before any swap.
  2. PSI mobile (authoritative) meets parity-or-better versus current, and the 3D object does not regress LCP.
  3. A QA GO/NO-GO verdict is recorded; on GO the production alias is promoted to v3 (no `--prebuilt --prod`; alias drift checked).
  4. Post-promotion verification confirms montysinger.com serves the v3 site at parity.

**Plans**: 6 plans
Plans:
**Wave 1**

- [ ] 18-01-PLAN.md — vercel build --prod gate at HEAD of v3 (DQ-02)
- [ ] 18-02-PLAN.md — v3 Vercel preview deploy + Lighthouse desktop median-of-3 (D-02)

**Wave 2** *(blocked on Wave 1 completion)*

- [ ] 18-03-PLAN.md — PSI mobile gate + D-04 WebGL hero LCP verification (DQ-03)
- [ ] 18-04-PLAN.md — 375px visual QA, 7-route walk, Phase-16 deferred checklist (D-05)
- [ ] 18-05-PLAN.md — D-14 dual-tree secret scan + D-10 theme/FOUC decision (D-06, D-10)

**Wave 3** *(blocked on Wave 2 completion)*

- [ ] 18-06-PLAN.md — compile 18-GO-NO-GO.md, human sign-off, alias promotion, milestone close (DQ-04)

## Progress

**Execution Order:**
Phases execute in numeric order: 14 -> 15 -> 16 -> 17 -> 18

| Phase | Milestone | Plans | Status | Completed |
|-------|-----------|-------|--------|-----------|
| 1. Foundation | v1.0 | 1/1 | Complete | 2026-03-31 |
| 2. Notion CMS Integration | v1.0 | 1/1 | Complete | 2026-03-31 |
| 3. Core Pages | v1.0 | 6/6 | Complete | 2026-04-02 |
| 4. Animation & Polish | v1.0 | 3/3 | Complete | 2026-04-03 |
| 5. Analytics | v1.0 | 2/2 | Complete | 2026-04-03 |
| 6. Pre-Launch QA | v1.0 | 6/6 | Complete | 2026-04-16 |
| 7. SEO Overhaul | v1.0 | 11/11 | Complete | 2026-04-16 |
| 8. Motion Subtractions | v2.0 | 7/7 | Complete | 2026-05-21 |
| 9. Design Tokens & Editorial Primitives | v2.0 | 9/9 | Complete | 2026-05-21 |
| 10. Editorial Homepage | v2.0 | 7/7 | Complete | 2026-05-21 |
| 11. Archive Pages | v2.0 | 5/5 | Complete | 2026-05-21 |
| 12. Sub-page Restyle Sweep | v2.0 | 7/7 | Complete | 2026-05-21 |
| 13. v2.0 QA & GO/NO-GO | v2.0 | 6/6 | Complete | 2026-05-21 |
| 14. Branch & Crimson Poster Foundation | v3.0 | 4/4 | Complete   | 2026-06-19 |
| 15. WebGL Explorative Homepage | v3.0 | 5/5 | Complete    | 2026-06-19 |
| 16. Interior Pages on Notion Data | v3.0 | 9/9 | Complete    | 2026-06-20 |
| 17. Infrastructure Preservation & SEO Extension | v3.0 | 1/1 | Complete   | 2026-07-02 |
| 17.1. Homepage Rebuild | v3.0 | 4/4 | Complete    | 2026-07-02 |
| 17.2. Site Information Architecture | v3.0 | 4/4 | Complete    | 2026-07-02 |
| 17.3. Portfolio | v3.0 | 1/2 | In Progress|  |
| 18. v3.0 QA, Perf Gate & Alias Swap | v3.0 | 0/6 | Not started | - |
