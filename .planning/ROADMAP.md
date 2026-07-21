# Roadmap: MSizzle Personal Website

## Milestones

- ✅ **v1.0 Build & Launch** — Phases 1-7 (shipped 2026-04-16, archived 2026-05-20). See [milestones/v1.0-ROADMAP.md](./milestones/v1.0-ROADMAP.md).
- ✅ **v2.0 Editorial Redesign** — Phases 8-13 (shipped 2026-05-21, archived 2026-05-21). See [milestones/v2.0-ROADMAP.md](./milestones/v2.0-ROADMAP.md).
- ✅ **v3.0 Dark Brutalist Rebuild** — Phases 14-19 (closed 2026-07-20; Phase 18 closed at 4/7, QA remainder folded into v4.0).
- 🚧 **v4.0 Mono Restyle** — Phases 20-25 (planning).

## Phases

### 🚧 v4.0 Mono Restyle (Phases 20-25)

**Milestone Goal:** Strip the site to pure black and white with zero accent, and rebuild the homepage as a quiet editorial index that reads "here's a bit about me" rather than a founder pitch. Design is locked by `.planning/sketches/015-mono-passive-home/` variant E — this milestone ports it, it does not explore it.

- [ ] **Phase 20: Mono Token Foundation** - Retheme `globals.css` to pure black/white with zero accent, kill every hardcoded survival, establish inversion as the emphasis language, on a branch with a live Vercel preview
- [ ] **Phase 21: Mono Homepage Rebuild** - Rebuild the homepage to sketch 015 variant E: type-only hero, Swiss numbered Building index, terminal writing log, one continuous ground, motion stripped to a single slow fade
- [ ] **Phase 22: Things I Love in Mono** - Recolor the pinboard to greyscale with a black note panel while preserving its shipped behaviour exactly, and prove reduced-motion across every surviving animation
- [ ] **Phase 23: Site Sweep & Mono OG** - Carry mono to every interior route, neutralize Notion inline text colors, retire non-content photography, and regenerate all three OG images without `#e5411f`
- [ ] **Phase 24: True Inversion Dark Mode** - Build light/dark theming from scratch (no `next-themes` today) so the whole site inverts cleanly and the inversion-based emphasis language still reads on a dark ground
- [ ] **Phase 25: v4.0 QA, Perf Gate & Alias Swap** - Perf budget, vitest + SEO regression gate, human visual QA over every route, then promote production by explicit alias swap

## Phase Details

### Phase 20: Mono Token Foundation

**Goal**: The site renders on a pure black-and-white token system with no accent color available anywhere, and that system is reviewable on a Vercel preview before it touches production.
**Depends on**: Phase 19 (v3.0 shipped design is the base being replaced)
**Requirements**: MO-01, MO-02, MO-03, MO-05, DQ-01
**Success Criteria** (what must be TRUE):

  1. Every surface renders on a `#ffffff` ground with `#000000` ink and `rgba(0,0,0,0.14)` hairlines; no warm paper, cream, or tinted grey appears on any route.
  2. Searching the codebase for Vermilion (`#e5411f`, `#c8381a`, `#a52d13`), cream `#f4ecdd`, and warm paper `#faf9f7` returns zero hits in the token layer or in the known hardcoded survivals — `globals.css:618`, `globals.css:122` (`--hero-bg`), `globals.css:673` (`.emoji-badge--cream`), `globals.css:1293` (`.pb-frame--cream`).
  3. Every hover and emphasis state that previously used the accent now reads as an inversion (black block on white) or a type-weight change, with no hue anywhere.
  4. Hanken Grotesk 800 display type, radius-0 hard corners, and the no-gradients rule are intact after the retheme.
  5. A visitor with the preview URL sees the mono system on a Vercel deployment while montysinger.com still serves the v3 design unchanged.

**Plans**: 5 plans (3 waves)

Plans:
- [ ] 20-01-PLAN.md — v4-mono branch setup + mono @theme token block, D-04 hardcoded-hex fixes, D-10 focus-ring unification
- [ ] 20-02-PLAN.md — globals.css Tier 1/2/3 accent-to-mono call-site conversion (~35 sites)
- [ ] 20-03-PLAN.md — src/components/v3/ shared-layer accent-to-mono conversion (9 files)
- [ ] 20-04-PLAN.md — site-footer, timeline, and interior-route accent-to-mono conversion (6 files)
- [ ] 20-05-PLAN.md — full D-03 audit, build/vitest check, v4-mono push, DQ-01 preview sign-off
**UI hint**: yes

**Sequencing note**: The palette is entirely token-driven in `src/app/globals.css` (lines 8-32), so this phase is cheap and unblocks everything. The 17 files under `src/` that reference `accent` mostly follow the tokens for free; only the four hardcoded survivals above need explicit edits. The three `opengraph-image.tsx` routes also hardcode `#e5411f` but are handled in Phase 23 alongside the rest of the sweep.

### Phase 21: Mono Homepage Rebuild

**Goal**: The homepage is a quiet editorial index built to sketch 015 variant E — a visitor lands on type, scans work and writing, and meets no pitch.
**Depends on**: Phase 20
**Requirements**: HP-01, HP-02, HP-03, HP-04, HP-05, MS-01, MS-02
**Success Criteria** (what must be TRUE):

  1. Above the fold a visitor sees type only: the rotating portrait carousel (stage pitch, fireside chat, mushroom blocks) is gone and no photograph appears in the hero.
  2. Building renders as a Swiss numbered index (`001`, `002`, `003`) whose rows invert to a solid black block on hover.
  3. Writing renders in terminal format — `~/writing`, dates flush left, read time flush right, no frame around the block — so the blog scans as a log.
  4. Scrolling the homepage moves across one continuous white ground with no alternating light/dark band slam.
  5. A visitor can reach work and essays without passing a subscribe CTA; Monty Monthly appears only as a quiet footer-level line, with no sticky nav button.
  6. The only motion left on the page is a slow opacity fade-up on scroll: the hero link marquee, pulsing status dot, photo ken-burns, and slide-in-from-side reveals no longer occur.

**Plans**: TBD
**UI hint**: yes

**Sequencing note**: Touches `src/components/home/` — `hero.tsx`, `explorative-homepage.tsx`, `section-building.tsx`, `section-work.tsx`, `section-newsletter.tsx`, `section-loves.tsx`, `photo.tsx`, `photo-marquee.tsx`, `scroll-reveals.tsx`, `sticky-nav.tsx`, `monty-monthly-carousel.tsx`, `rail-box.tsx`. **Do not touch `pinboard.tsx`** — TL-01 is a preservation requirement handled in Phase 22. Three vitest failures on the homepage (`section-building` HD-04, `explorative-homepage` TD-03/HD-05) **predate this milestone**; this rebuild is expected to delete or rewrite those tests rather than fix them, and they must not be logged as regressions introduced here.

### Phase 22: Things I Love in Mono

**Goal**: The pinboard looks like it belongs to the mono site while behaving exactly as it does in production today.
**Depends on**: Phase 21
**Requirements**: TL-01, TL-02, TL-03, MS-03
**Success Criteria** (what must be TRUE):

  1. A visitor can still scatter-browse across three start lines, drag cards, click a card to slide a note up over it, see per-type card kinds (book/film cover, YouTube thumb, Thing note card, Place polaroid), and press Organize by topic to gather the board into topic rows — identical to production.
  2. The board renders with no color: the `SWATCHES` array is greyscale, `.pb-frame--cream` has lost its cream fill, and the note panel that was Vermilion is black.
  3. A visitor can tell a Book from a Film from a Record from a Hobby by shape and border weight alone, with no hue carrying the distinction.
  4. With `prefers-reduced-motion` set, every remaining animation on the site — including the pinboard's scatter, drag, and note slide — degrades to a static, fully usable state.

**Plans**: TBD
**UI hint**: yes

**Sequencing note**: `src/components/home/pinboard.tsx` is 749 lines of shipped, working behaviour. This phase changes its palette only. **Do not schedule a pinboard rewrite.** Under 760px the board must still degrade to a tappable stack with the toolbar hidden, as shipped.

### Phase 23: Site Sweep & Mono OG

**Goal**: Every route beyond the homepage reads as one mono system, and nothing — not a sub-page, not a Notion-authored text color, not a social preview image — can reintroduce a hue.
**Depends on**: Phase 22
**Requirements**: SW-01, SW-02, SW-03, MO-04
**Success Criteria** (what must be TRUE):

  1. Writing, blog post, building, project detail, contact, and prometheus all render in the mono system with no accent survivals on any element or hover state.
  2. Sharing any of the three OG-image routes (root, `blog/[slug]`, `building/[slug]`) produces a black-and-white preview card; `#e5411f` no longer appears in any `opengraph-image.tsx`.
  3. A post authored in Notion using amber, orange, blue, or gray inline text renders as ink/dim/muted greys on the site.
  4. Photography appears only where it is content — Things I Love cards and Notion project covers; the hero portraits, the wide Prometheus screenshot, and the photo-marquee fallback are gone.

**Plans**: TBD
**UI hint**: yes

### Phase 24: True Inversion Dark Mode

**Goal**: A visitor can flip the entire site between a white ground and a black ground as a true inversion, and every emphasis surface still reads correctly on both.
**Depends on**: Phase 23
**Requirements**: DM-01, DM-02, DM-03
**Success Criteria** (what must be TRUE):

  1. A visitor can toggle the site between light (white ground, black ink) and dark (black ground, white ink), and every route inverts.
  2. On a dark ground, every element whose emphasis language is inversion — Building index rows on hover, the pinboard note panel, tags, buttons — remains clearly visible and distinct from the ground; no inverted surface disappears into black.
  3. The chosen theme survives navigating between routes and a full page reload, with no flash of the wrong ground on first paint.

**Plans**: TBD
**UI hint**: yes

**Sequencing note**: This is genuinely new scope. `next-themes` is **not** currently a dependency and there is no theme toggle anywhere in `src/` — it must be built from scratch. It is sequenced after the mono system exists because inversion needs something to invert. **DM-02 is the hardest requirement in the milestone:** the site uses inversion (black block on white) as its entire emphasis and hover language, so on a dark ground a "black block" hover has nothing to invert against. That tension must be resolved by an explicit design decision in this phase, not deferred.

### Phase 25: v4.0 QA, Perf Gate & Alias Swap

**Goal**: The mono site is proven correct, fast, and regression-free, and montysinger.com serves it.
**Depends on**: Phase 24
**Requirements**: DQ-02, DQ-03, DQ-04, DQ-05
**Success Criteria** (what must be TRUE):

  1. The restyled site meets the existing perf budget: PSI mobile (authoritative) at parity-or-better versus current production, and the LCP gate holds.
  2. The full vitest suite passes, including the SEO regression gate — sitemap, robots, blog feed, per-page metadata, breadcrumb JSON-LD — proven intact through the restyle.
  3. A human visual QA pass over every route (`/`, `/writing`, `/blog/[slug]`, `/building`, `/building/[slug]`, `/contact`, `/prometheus`) signs off the mono system in both light and dark, recorded as a GO/NO-GO verdict.
  4. On GO, montysinger.com serves the mono site via an explicit alias swap, verified post-promotion with no alias drift.

**Plans**: TBD

**Sequencing note**: Carries forward the unfinished remainder of v3.0's Phase 18 (QA, perf gate, alias swap) — that QA was never run against a design that was about to be replaced. Delivery pattern is unchanged: long-lived branch → Vercel preview → promote by explicit alias swap. **Never `--prebuilt --prod`** (known project gotcha: alias drift after `vercel deploy --prod`).

## Progress

**Execution Order:**
Phases execute in numeric order: 20 -> 21 -> 22 -> 23 -> 24 -> 25

| Phase | Milestone | Plans | Status | Completed |
|-------|-----------|-------|--------|-----------|
| 20. Mono Token Foundation | v4.0 | 0/5 | Planned | - |
| 21. Mono Homepage Rebuild | v4.0 | 0/? | Not started | - |
| 22. Things I Love in Mono | v4.0 | 0/? | Not started | - |
| 23. Site Sweep & Mono OG | v4.0 | 0/? | Not started | - |
| 24. True Inversion Dark Mode | v4.0 | 0/? | Not started | - |
| 25. v4.0 QA, Perf Gate & Alias Swap | v4.0 | 0/? | Not started | - |

## Completed Phases (v1.0 - v3.0)

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
| 14. Branch & Crimson Poster Foundation | v3.0 | 4/4 | Complete | 2026-06-19 |
| 15. WebGL Explorative Homepage | v3.0 | 5/5 | Complete | 2026-06-19 |
| 16. Interior Pages on Notion Data | v3.0 | 9/9 | Complete | 2026-06-20 |
| 17. Infrastructure Preservation & SEO Extension | v3.0 | 1/1 | Complete | 2026-07-02 |
| 17.1. Homepage Rebuild | v3.0 | 4/4 | Complete | 2026-07-02 |
| 17.2. Site Information Architecture | v3.0 | 4/4 | Complete | 2026-07-02 |
| 17.3. Portfolio | v3.0 | 2/2 | Complete | 2026-07-02 |
| 17.4. Photo-Forward Homepage Restyle | v3.0 | 9/9 | Complete | 2026-07-05 |
| 18. v3.0 QA, Perf Gate & Alias Swap | v3.0 | 4/7 | Closed (remainder folded into Phase 25) | 2026-07-20 |
| 19. Project Cards & Covers Redesign | v3.0 | 3/3 | Complete | 2026-07-06 |

Full milestone detail: [milestones/v1.0-ROADMAP.md](./milestones/v1.0-ROADMAP.md) · [milestones/v2.0-ROADMAP.md](./milestones/v2.0-ROADMAP.md)
