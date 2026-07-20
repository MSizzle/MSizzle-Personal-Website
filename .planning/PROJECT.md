# MSizzle Personal Website

## What This Is

A custom-built personal website for Monty Singer (founder of Prometheus, builder, writer), live at https://montysinger.com. Replaced a Notion Super site in v1.0 with a Next.js platform — portfolio, blog, about, social links, events, newsletter, and a `/prometheus` landing page — with self-hosted Umami analytics, Notion as CMS, and an animation-rich design. v2.0 is now redirecting toward a calmer editorial system without losing personality.

## Core Value

A personal site that feels alive and memorable, *and* legible — not another template blog, but also not so busy it competes with the content. v1.0 delivered the "alive" half; v2.0 dials the noise down so the writing, work, and identity come through.

## Current State

- **Live:** https://montysinger.com (Vercel, Namecheap DNS, Super disconnected)
- **Last shipped:** v1.0 Build & Launch — 2026-04-16 (GO per Phase 6 QA, 0 UAT failures, Lighthouse desktop 100/96/96/100, mobile PSI 77 accepted non-blocking)
- **v2.0 shipped 2026-05-21:** Editorial Redesign milestone complete. 6 phases (8-13), 41 plans. Vanschneider-inspired manifesto homepage, warm-paper palette, 7 shared editorial primitives, archive pages (`/writing`, `/events`, `/photos`), sub-page restyle sweep, mobile nav restructure, modern browserslist (Chrome 92+/Safari 15.4+ — dropped ~14 KiB legacy polyfills). Lighthouse desktop median 96-100, PSI mobile 95 (up from 82). GO verdict signed by Monty Singer.
- **v3.0 in progress (branch `v3`):** Dark Brutalist Rebuild. Phase 15 complete (2026-06-19) — the homepage pivoted from the planned CHOMP slide-deck to a **WebGL explorative scroll-story** (real-time GPU vertex-shader 3D hero blob, RoomEnvironment IBL + rim + bloom, after-LCP `dynamic({ssr:false})` mount, capability-gated mobile poster fallback, four section beats). Slide-deck approach superseded.
- **v3 palette is now "Pumpkin Amber"** (bright orange field `#ff7a14`, roasted-cocoa ink `#2a1808`, deep-teal accent `#0c6b74`) — locked 2026-06-19, live in `src/app/globals.css`. Supersedes the stale "Crimson Poster" docs and the interim dark "Crimson Line".
- **Phase 16 complete (2026-06-20):** All interior pages rebuilt in the Pumpkin Amber system on the existing Notion pipeline — Writing/Works indexes as photo-grids of Notion-cover cards, essay + project detail with full-bleed covers, About/Prometheus/Newsletter/Events/Links repainted, a shared focused-nav + full-sitemap V3Footer, and two new pages live: `/uses` (grouped tools) and `/watching` (YouTube card grid). Notion loaders, image proxies, NotionRenderer, and ISR 30min all preserved. Automated gate passed (tests + build + ISR/token/security audits); visual QA on the Vercel preview deferred to Phase 18.
- **Phase 17 complete (2026-06-21):** Infrastructure preservation verified + SEO extended to the new routes. `/uses` and `/watching` added to `src/app/sitemap.ts` (priority 0.6, monthly) — the one production gap closed. A durable vitest regression gate now proves the SEO surface (sitemap, robots, blog RSS feed, per-page metadata, breadcrumb JSON-LD) and the env-gated Umami loader are intact (full suite 136 green, build clean). Decisions held: breadcrumb-only JSON-LD (no VideoObject/ItemList), site-wide default OG (no per-page @vercel/og). Closes **IN-03** + **IN-04**.
- **Phase 17.1 complete (2026-07-01):** Homepage rebuilt around a personal-brand narrative arc (who → what → engage) in the current Pumpkin Amber aesthetic — the WebGL blob scroll-story is removed from the home path (`explorative-homepage.tsx` is now a Server Component, no canvas/hooks). Six-section arc: hero → What I'm Building → Selected Work → Things I Love → Writing + Monty Monthly → Footer. Velvet-rope engagement (no CTA button, no contact page; Monty Monthly is the primary "way in"). Hero leads with Monty's guiding principle **"Create Order from Chaos"** (revises D-11; "Founder of Prometheus" identity moved to the subtitle) — approved in the D-12 human visual review. Build passes with `/` static; verification 6/6. Next: Phase 17.2 (Site Information Architecture).
- **Phase 17.2 complete (2026-07-02):** Site IA restructured to the personal-brand scope in the locked Pumpkin Amber skin (structure only, no restyle). Lean 4-item primary nav (About / Projects / Writing / Uses); `/prometheus` stays a dedicated page reached via hero + woven links. Five public cut routes 301-redirect (`/events`→`/`, `/photos`→`/`, `/links`→`/about`, `/newsletter`→`/writing`, `/watching`→`/uses`); two internal design pages hard-deleted (`/specimen`, `/v3-specimen` → 404). `/uses` reframed **"Things I Love"** (folds the `/watching` YouTube grid into a Watching section); `/writing` merged into one **"Writing / Monty Monthly"** surface (NewsletterCarousel + Substack RSS folded in). `sitemap.ts` trimmed to 6 static routes; Phase 17 SEO regression gate updated in lockstep; footer carries the fuller map + woven socials (the `/links` fold). Zero internal links to cut routes anywhere in `src/`. Verification 10/10 (D-01..D-10), code review clean, build clean. Next: Phase 17.3 (Portfolio surface).
- **Phase 17.3 complete (2026-07-02):** Curated **`/portfolio`** surface for proud-of past work, built on the existing Notion projects pipeline in the Pumpkin Amber aesthetic — no new pipeline, no schema change. New `src/app/portfolio/page.tsx` mirrors `/projects` (PageHero + year-grouped Cards + `/api/notion-cover` proxy, ISR 1800, defensive try/catch → empty-state) but filters via the pre-existing `getFeaturedProjects()` (`Published AND Featured`). Homepage "Selected Work" (`section-work.tsx`) now links into `/portfolio` (portfolio-only per D-01; the full `/projects` archive stays reachable via nav); Prometheus external link `rel="noopener noreferrer"` preserved. `/portfolio` added to `sitemap.ts` (priority 0.9, weekly). 10 new vitest tests (portfolio + section-work), sitemap test updated; 13/13 phase tests green, full suite 132 pass (4 pre-existing homepage failures unchanged). Verification 8/8 (SC-1, SC-2), code review 0 critical (2 advisory: DRY `groupProjectsByYear`, test-mock typing). **Content note:** Monty must set `Featured: true` on 1+ Notion projects before `/portfolio` shows real content (defensive empty-state until then). Next: Phase 18 (v3.0 QA + perf gate + alias swap).
- **v3.0 closed 2026-07-20 / v4.0 Mono Restyle opened.** Phases 17.4 (photo-forward homepage) and 19 (project cards) shipped; Phase 18 closed at 4/7 with its QA remainder folded into v4.0. Trigger for v4.0: the shipped photo-forward homepage read as a founder pitch ("I'm not in photos smiling, this is just a bit about me") and the Vermilion/clay palette was rejected outright. Direction locked via sketch 015 variant E: pure black/white with **zero accent**, type-only hero, motion stripped to a single slow fade, terminal-format writing list, Things I Love pinboard kept but recolored. Not yet ported to `src/`.
- **Stack in production:** Next.js 16 App Router + React 19 + Tailwind v4 + Inter (next/font/google) + Motion (motion/react) + GSAP + Lenis + `@notionhq/client` v5 — v3 adds React Three Fiber + `@react-three/postprocessing` + `three-custom-shader-material`
- **Analytics:** Self-hosted Umami at https://analytics.montysinger.com (Neon Postgres, separate Vercel project)
- **Routes (post-17.3):** `/`, `/about`, `/projects` + `/projects/[slug]`, `/portfolio` (curated Featured view), `/writing` + `/blog/[slug]` + `/blog/feed.xml`, `/uses`, `/prometheus`. Redirects (301): `/events`→`/`, `/photos`→`/`, `/links`→`/about`, `/newsletter`→`/writing`, `/watching`→`/uses`, `/blog`→`/writing`. Removed (404): `/specimen`, `/v3-specimen`.

## Current Milestone: v4.0 Mono Restyle

**Goal:** Strip the site to pure black and white with zero accent, and rebuild the homepage as a quiet editorial index that reads "here's a bit about me" rather than a founder pitch.

**Target features:**
- **Pure mono palette, zero accent.** `#ffffff` ground, `#000000` ink, `rgba(0,0,0,0.14)` hairlines. Vermilion (`#e5411f` / `#c8381a` / `#a52d13`), cream `#f4ecdd`, and warm paper `#faf9f7` are all retired. Contrast comes from inversion (black block on white) and type weight, never hue.
- **Homepage rebuilt to sketch 015 variant E.** Type-only hero (the 44% rotating portrait carousel is cut), Swiss editorial numbered index for Building, and a terminal-format writing list (`~/writing`, dates left, read time right, no frame) so the blog reads as a log.
- **Motion stripped to one slow fade.** Hero marquee, pulsing status dot, photo ken-burns, slide-in-from-side reveals, and the alternating light/dark band slam are all removed. Scroll fade-up survives; `prefers-reduced-motion` still honored.
- **Things I Love pinboard preserved, recolored.** Behaviour is unchanged from production (`pinboard.tsx`): loose scatter on three start lines, drag, click-to-slide-a-note-up, per-type card kinds, Organize-by-topic. Palette deltas only: colored `SWATCHES` go greyscale, `.pb-frame--cream` loses its cream, note panel goes Vermilion to black.
- **Sub-page and OG sweep.** The 17 files referencing `accent` follow the tokens; three `opengraph-image.tsx` routes hardcode `#e5411f` and need a mono redo (OG was the one deferred exception to the no-gradients rule).
- **QA, perf gate, and alias swap** — carries forward Phase 18's unfinished remainder, since a site-wide restyle invalidates that QA anyway.

**Key context:** Design is locked and sketched — `.planning/sketches/015-mono-passive-home/` variant E is the spec (open with `#e`); no further exploration needed. Trigger was Monty's read of the shipped photo-forward homepage: "make it cooler, more passive and laid-back: this is cool, but I'm not in photos smiling, this is just a bit about me," plus "redo the palette so there's no orange and clay, mostly black and white." Surviving from v3: Hanken Grotesk 800 display, hard corners (radius 0), and the no-gradients rule. Copy rules unchanged: no em dashes, no location, sole professional identity is Founder of Prometheus.

## Previous Milestone: v3.0 Dark Brutalist Rebuild (closed 2026-07-20)

**Closed with Phase 18 at 4/7.** The remaining QA, perf gate, and alias swap plans were folded into v4.0's ship phase rather than run against a design that was about to be replaced.

**Goal:** Rebuild the presentation layer of montysinger.com as a dark, flat, brutalist site (crimson-poster palette, a wheel-driven slide-deck homepage, a lazy-loaded 3D hero object) while preserving all existing infrastructure. Built on a branch and swapped via Vercel alias when at parity.

**Target features:**
- "Crimson Poster" design system: crimson-orange field (#d93c1e); display type in the same crimson lifted by a hard black shadow; black as the only accent; near-black supporting text; no gradients. Space Grotesk display, JetBrains Mono labels.
- Slide-deck homepage: CHOMP-style wheel controller (one gesture = one slide, fresh-gesture detection, 820ms reversal-bypass cool-down), static background, big-type signature slides, keyboard and touch input.
- 3D hero object (morphing icosahedron, near-black glossy with a crimson rim) as a lazy-loaded React-Three-Fiber component; spawns on the right and flies in from the left per slide; reduced-motion fallback; respects the LCP/PSI budget.
- Rebuilt interior pages on native scroll, wired to existing Notion data: writing index, essay reading view, works, project detail, about, prometheus, newsletter, events, links, /uses (new), /watching (new, favorite YouTube videos).
- Preserve infrastructure: Notion pipeline, image proxy routes, SEO (sitemap/robots/feed/JSON-LD), Umami analytics, Notion render components.

**Key context:** Design fully specified by the committed prototype at `.planning/sketches/002-full-site-model/` and `.planning/sketches/MANIFEST.md`. Deck mechanic ported from CHOMP (`~/PrometheusUltra/Client Projects/Chomp`, `components/Slideshow.tsx`). Delivery: long-lived `v3` branch, Vercel preview, promote the production alias at parity and QA (watch alias drift; never `--prebuilt --prod`). Site copy rules: no em dashes, no location, "Georgetown University" only, sole professional identity is Founder of Prometheus.

## Previous Milestone: v2.0 Editorial Redesign (shipped 2026-05-21)

**Goal:** Replace v1.0's competing-animation homepage with a vanschneider-inspired minimal editorial system, add dedicated archive pages, and apply a lightweight palette/typography pass to sub-pages — without sacrificing the personal-site "alive" feel.

**Target features:**
- Editorial homepage anchored on the "BRING FIRE / TO HUMANITY." manifesto with five labeled vertical sections (Building / Writing / Events / Photographs / Personal)
- Warm-paper monochrome design system (#F4F2EC paper / #0E0E0C ink / #9A9690 muted) implemented as Tailwind v4 `@theme` tokens
- New archive pages: `/writing` (year-grouped), `/events` (upcoming + past), `/photos` (year-grouped grid)
- Lightweight palette+typography restyle of every sub-page (no layout changes)
- Strict motion budget: zero loops, zero auto-scrollers, one signature interaction per page (manifesto letter-stagger on first paint)
- Shared editorial component primitives reusable across all pages

**Key context:** Full Claude Design handoff at `.planning/research/editorial-redesign-handoff/` is the canonical design contract. Manifesto override (BRING FIRE / TO HUMANITY) and typeface override (keep Inter, do not switch to Helvetica Neue) take precedence over the handoff README.

## Next Milestone Goals — v2.0 Editorial Redesign

Replace the homepage's competing animation loops with a vanschneider-inspired editorial system, add dedicated archive pages, and apply a lightweight palette/typography pass to the sub-pages. Design contract: `.planning/research/editorial-redesign-handoff/`.

Specifically:
- New homepage anchored on a single manifesto line (**BRING FIRE / TO HUMANITY.**), letter-style intro, five labeled vertical sections (Building / Writing / Events / Photographs / Personal), warm-paper monochrome palette
- New `/writing`, `/events`, `/photos` archive pages with year-grouped layouts
- Delete: photo auto-carousel, rotating tagline, hover-triggered carousels, pulsing event indicator, cascading reveal delays
- Keep: Lenis smooth scroll, page-fade transitions, one signature interaction (manifesto letter-stagger on first paint only)
- Lightweight palette+typography pass on `/about`, `/projects`, `/blog`, `/blog/[slug]`, `/links`, `/prometheus`, `/newsletter` so the entire site reads as one system
- Notion as CMS stays — no content migration

## Requirements

### Validated (v1.0)

- ✓ Portfolio/projects showcase with interactive presentation — v1.0 (Phase 3)
- ✓ Blog/writing section with content pulled from Notion — v1.0 (Phase 2 + Phase 3)
- ✓ About/resume page with bio + Prometheus framing — v1.0 (Phase 3, rewritten Phase 7)
- ✓ Links/social hub — v1.0 (Phase 3)
- ✓ Notion as CMS (image expiry solved via proxy) — v1.0 (Phase 2)
- ✓ Visitor analytics (real-time, sources, geo, devices) — v1.0 (Phase 5, Umami on Neon)
- ✓ Smooth page transitions and scroll-triggered animations — v1.0 (Phase 4)
- ✓ Light/dark mode support (no FOUC) — v1.0 (Phase 1)
- ✓ Custom domain integration (montysinger.com) — v1.0 (Phase 1 + Phase 6 cutover)
- ✓ Mobile responsive design — v1.0 (Phase 3, verified Phase 6)
- ✓ Fast load times (static generation + ISR) — v1.0 (desktop Lighthouse 100, mobile 77 acceptable)
- ✓ SEO infrastructure (JSON-LD, sitemap, RSS, per-page metadata) — v1.0 (Phase 7, added mid-milestone)

### Reframed for v2.0

The following v1.0 requirements were *technically* met but the v2.0 redesign reinterprets what they should look like:

- "Unique, non-template layouts that feel unexpected" — v1.0 delivered with stacked carousels and parallax. v2.0 reinterprets: editorial-magazine system (vanschneider-inspired) reads as unique without visual noise.
- "Interactive elements — things to click, explore, play with" — v1.0 had many. v2.0 dials to one signature interaction per page (manifesto letter-stagger; manual clickable carousels only on archive pages where they fit).

### Active (v2.0)

- [ ] Editorial homepage with single manifesto, letter-style intro, five labeled sections
- [ ] Warm-paper monochrome design system (#F4F2EC / #0E0E0C / muted #9A9690) implemented as Tailwind v4 `@theme` tokens
- [ ] One typeface family (Inter, weights 400/700) with display-scale utilities (124px / 120px / 44px / 28px / 11px tracked)
- [ ] New archive pages: `/writing` (year-grouped), `/events` (upcoming + past), `/photos` (year-grouped grid)
- [ ] Lightweight palette+typography restyle of all sub-pages (no layout changes)
- [ ] Motion budget enforced: zero loops, zero auto-scrollers, one signature interaction per page
- [ ] Shared editorial component primitives (`Rule`, `SectionLabel`, `ListRow`, `AllLink`, `IntroLink`, `FooterCol`)

### Out of Scope

- Paid hosting — Vercel free tier confirmed sufficient at v1.0 traffic levels
- Paid analytics — Umami self-hosted delivered all needed dimensions
- E-commerce or payments — personal site, not a store
- User accounts / authentication — public-facing only
- CMS migration — Notion stays; image expiry fully solved via proxy
- v1.0's competing-animation homepage aesthetic — explicitly reverted in v2.0 (kept here so future-me remembers *why* we removed it: see Phase 04 vs v2.0 motion-budget delta)

## Context

- v1.0 codebase: Next.js 16 + React 19 + Tailwind v4 project on `/Users/Montster/MSizzle Personal Website/`
- Notion DB powering blog (`notion-projects.ts`, `notion-events.ts`, `notion.ts` in `src/lib/`); 17-block-type renderer in place
- Image pipeline: proxy route at `/api/notion-image` solves Notion signed-URL expiry indefinitely
- Analytics: Umami fork in separate Vercel project, Neon Postgres free tier, custom subdomain via Namecheap CNAME
- Monty: Georgetown University, founder of Prometheus (AI integrations + education, prometheus.today), writes Monty Monthly (montymonthly.substack.com)
- v2.0 trigger: user perceived v1.0 homepage as "too much going on" — three independent animation loops on home + pulsing dot on events; corrective is editorial subtraction, not feature addition

## Constraints

- **CMS**: Notion — Monty's content workflow stays the same (validated through v1.0)
- **Hosting**: Vercel free tier — zero hosting cost (validated; well under quotas)
- **Analytics**: Self-hosted Umami — no recurring fees (validated; running on Neon free tier)
- **Tech Level**: Monty is learning with AI assistance — stack must stay well-documented and AI-friendly
- **Design (v2.0 update)**: Must feel like a personal site, not a template — but "alive" achieved via editorial typography and one signature interaction, not stacked animation loops
- **Motion budget (v2.0)**: Zero looping animations · zero auto-scrollers · one signature interaction per page max · clickable carousels OK on archive pages

## Key Decisions

| Decision | Rationale | Outcome |
|----------|-----------|---------|
| Replace Super with custom site | Analytics + design freedom + cost savings | ✓ Good — v1.0 shipped 2026-04-16, all goals met |
| Keep Notion as CMS | Existing content workflow, no migration needed | ✓ Good — Phase 2 image proxy solved the one real risk |
| Vercel free tier hosting | Zero cost, excellent DX, great for Next.js | ✓ Good — well under all quotas at current traffic |
| Self-hosted analytics (Umami) | Full analytics at zero recurring cost | ✓ Good — Umami on Neon delivering real-time data |
| Fresh start design | Not a recreation — rethink structure and visual identity | ✓ Good — v1.0 went hard on motion; v2.0 reinterprets within same fresh-start spirit |
| Use `notion-to-md` + `@notionhq/client` not `react-notion-x` | Documented App Router breakage in `react-notion-x` | ✓ Good — zero render issues across 17 block types |
| Image proxy route over build-time download | Avoids 5MB build payload; works for any post age | ✓ Good — Phase 6 long-tail test confirmed 2h+ posts still return 200 |
| GSAP ticker drives Lenis | Prevents ScrollTrigger desync | ✓ Good — no animation jank observed |
| Production domain montysinger.com (not msizzle.com) | Owned domain alignment | ✓ Good — Phase 7 swept all references mid-milestone |
| v2.0 editorial redesign (vanschneider-inspired minimal) | v1.0 homepage had 3 competing animation loops; user perceived noise | — Pending v2.0 |
| Manifesto: "BRING FIRE / TO HUMANITY." | Thematic anchor to Prometheus (Titan who brought fire); bridges builder + writer | — Pending v2.0 (locked at design-handoff) |
| Keep Inter, don't switch to Helvetica Neue | Already wired via next/font/google; spec values carry the editorial feel | — Pending v2.0 |

## Evolution

This document evolves at phase transitions and milestone boundaries.

**After each phase transition** (via `/gsd:transition`):
1. Requirements invalidated? -> Move to Out of Scope with reason
2. Requirements validated? -> Move to Validated with phase reference
3. New requirements emerged? -> Add to Active
4. Decisions to log? -> Add to Key Decisions
5. "What This Is" still accurate? -> Update if drifted

**After each milestone** (via `/gsd:complete-milestone`):
1. Full review of all sections
2. Core Value check — still the right priority?
3. Audit Out of Scope — reasons still valid?
4. Update Context with current state

---
*Last updated: 2026-07-02 — v3.0 Phase 17.3 (Portfolio surface) complete; curated `/portfolio` route on the existing Notion pipeline via pre-existing `getFeaturedProjects()` (Published AND Featured), mirrors `/projects` aesthetic with ISR 1800 + defensive empty-state, added to sitemap (priority 0.9). Homepage "Selected Work" links portfolio-only (D-01); Prometheus rel preserved. 10 new tests, 13/13 phase green, full suite 132 pass (4 pre-existing failures unchanged). Verification 8/8, review 0 critical. Content gate: set Notion `Featured: true` on 1+ projects to populate. Next: Phase 18 (v3.0 QA + perf gate + alias swap).*
