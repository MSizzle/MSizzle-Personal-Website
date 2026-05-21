# MSizzle Personal Website

## What This Is

A custom-built personal website for Monty Singer (founder of Prometheus, builder, writer), live at https://montysinger.com. Replaced a Notion Super site in v1.0 with a Next.js platform — portfolio, blog, about, social links, events, newsletter, and a `/prometheus` landing page — with self-hosted Umami analytics, Notion as CMS, and an animation-rich design. v2.0 is now redirecting toward a calmer editorial system without losing personality.

## Core Value

A personal site that feels alive and memorable, *and* legible — not another template blog, but also not so busy it competes with the content. v1.0 delivered the "alive" half; v2.0 dials the noise down so the writing, work, and identity come through.

## Current State

- **Live:** https://montysinger.com (Vercel, Namecheap DNS, Super disconnected)
- **Last shipped:** v1.0 Build & Launch — 2026-04-16 (GO per Phase 6 QA, 0 UAT failures, Lighthouse desktop 100/96/96/100, mobile PSI 77 accepted non-blocking)
- **Stack in production:** Next.js 16 App Router + React 19 + Tailwind v4 + Inter (next/font/google) + Motion (motion/react) + GSAP + Lenis + `@notionhq/client` v5
- **Analytics:** Self-hosted Umami at https://analytics.montysinger.com (Neon Postgres, separate Vercel project)
- **Routes:** `/`, `/about`, `/projects` + `/projects/[slug]`, `/blog` + `/blog/[slug]` + `/blog/feed.xml`, `/events`, `/links`, `/newsletter`, `/prometheus`, `/uses` (redirects to `/about` post-v1.0)

## Current Milestone: v2.0 Editorial Redesign

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
*Last updated: 2026-05-20 after v1.0 milestone close · v2.0 Editorial Redesign queued*
