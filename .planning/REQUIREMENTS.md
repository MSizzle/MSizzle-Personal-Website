# Requirements — Milestone v3.0 Dark Brutalist Rebuild

Design is fully specified by the committed prototype at `.planning/sketches/002-full-site-model/`
(open `index.html`) and the locked decisions in `.planning/sketches/MANIFEST.md`. This is a
presentation-layer rebuild: infrastructure is preserved, not rebuilt.

## v3.0 Requirements

### Design System (DS)
- [ ] **DS-01**: The site renders in the "Crimson Poster" palette (crimson-orange field #d93c1e, black accent, near-black supporting text) with no gradients anywhere.
- [ ] **DS-02**: Display headings render in the same crimson as the background, lifted by a hard black drop shadow; the outline variant uses a black stroke.
- [ ] **DS-03**: Typography uses Space Grotesk (display) and JetBrains Mono (labels) with a defined type scale, implemented as Tailwind v4 `@theme` tokens.
- [ ] **DS-04**: A reusable set of brutalist primitives (rules, section labels, clickable list rows, big-type list, buttons, marquee, cards) is available to every page.
- [ ] **DS-05**: The site honors `prefers-reduced-motion` (disables autonomous and scroll-driven animation, keeps content fully usable).

### Homepage Slide Deck (HD)
- [ ] **HD-01**: The homepage is a full-page slide deck where one wheel or keyboard gesture advances exactly one slide.
- [ ] **HD-02**: The controller ignores decaying trackpad momentum (fresh-gesture detection) and applies a short reversal-bypass cool-down, so one push moves one slide without feeling blocked.
- [ ] **HD-03**: The background stays static while slide content moves; keyboard (arrows/space/Home/End) and touch-swipe navigation work; a progress indicator is shown.
- [ ] **HD-04**: Slide 2 is the brutalist big-type index ("What I'm Building / Writing / Doing") linking to Works / Writing / Prometheus.
- [ ] **HD-05**: On touch and small screens the homepage falls back to native vertical scroll (no wheel controller).

### 3D Hero Object (TD)
- [ ] **TD-01**: The hero shows a morphing near-black glossy 3D object (React-Three-Fiber) with a crimson rim, animating autonomously.
- [ ] **TD-02**: The object spawns in the right portion and flies in from the left on each slide change.
- [ ] **TD-03**: The object is lazy-loaded (off the LCP critical path) and degrades to a static fallback when WebGL is unavailable or reduced-motion is set.

### Pages (PG)
- [ ] **PG-01**: Home, Writing index, Essay reading view, Works index, Project detail, About, Prometheus, Newsletter, Events, and Links are rebuilt in the new system, content sourced from Notion as today.
- [ ] **PG-02**: A new `/uses` page (tools and stack) is built and linked.
- [ ] **PG-03**: A new `/watching` page lists favorite YouTube videos as cards linking out to YouTube.
- [ ] **PG-04**: The essay reading view shows breadcrumb, reading time, publish date, prose, and related essays; the writing and works indexes show excerpts.
- [ ] **PG-05**: A shared nav and footer link all pages with correct active states and breadcrumbs.

### Infrastructure Preservation (IN)
- [ ] **IN-01**: The Notion CMS pipeline (dataSources.query v5, ISR 30min) continues to power all content unchanged.
- [ ] **IN-02**: The image proxy routes (`notion-cover`, `notion-image`) continue to serve Notion images.
- [ ] **IN-03**: SEO infrastructure (sitemap, robots, blog feed, `src/lib/seo`, JSON-LD, per-page metadata) is preserved and extended to the new `/uses` and `/watching` pages.
- [ ] **IN-04**: Umami analytics continues to load and track on every page.

### Delivery & Quality (DQ)
- [ ] **DQ-01**: v3 is built on a long-lived branch and previewed on Vercel without affecting the live production site.
- [ ] **DQ-02**: The build passes the production-readiness gate (`vercel build --prod`) before any swap.
- [ ] **DQ-03**: Mobile performance meets the budget (PSI mobile authoritative, parity-or-better vs current); the 3D object does not regress LCP.
- [ ] **DQ-04**: At a QA GO verdict, the production alias is promoted to v3 and verified post-promotion.

## Future Requirements (deferred)
- Real YouTube thumbnails/oEmbed for /watching (prototype uses placeholders).
- Per-slide bespoke motion on interior pages (interiors stay calm for v3).

## Out of Scope
- Content migration or CMS change — Notion stays; no content moves.
- Rebuilding the Notion/SEO/analytics internals — preserved as-is.
- Light/dark theme toggle — v3 is a single fixed crimson aesthetic (drops the v2 paper/ink light mode).
- New backend features, auth, or comments.

## Traceability

REQ-ID → Phase. All 21 v3.0 requirements mapped to exactly one phase (100% coverage, no orphans, no duplicates).

| Requirement | Phase | Status |
|-------------|-------|--------|
| DS-01 | Phase 14 | Pending |
| DS-02 | Phase 14 | Pending |
| DS-03 | Phase 14 | Pending |
| DS-04 | Phase 14 | Pending |
| DS-05 | Phase 14 | Pending |
| HD-01 | Phase 15 | Pending |
| HD-02 | Phase 15 | Pending |
| HD-03 | Phase 15 | Pending |
| HD-04 | Phase 15 | Pending |
| HD-05 | Phase 15 | Pending |
| TD-01 | Phase 15 | Pending |
| TD-02 | Phase 15 | Pending |
| TD-03 | Phase 15 | Pending |
| PG-01 | Phase 16 | Pending |
| PG-02 | Phase 16 | Pending |
| PG-03 | Phase 16 | Pending |
| PG-04 | Phase 16 | Pending |
| PG-05 | Phase 16 | Pending |
| IN-01 | Phase 16 | Pending |
| IN-02 | Phase 16 | Pending |
| IN-03 | Phase 17 | Pending |
| IN-04 | Phase 17 | Pending |
| DQ-01 | Phase 14 | Pending |
| DQ-02 | Phase 18 | Pending |
| DQ-03 | Phase 18 | Pending |
| DQ-04 | Phase 18 | Pending |
</content>
