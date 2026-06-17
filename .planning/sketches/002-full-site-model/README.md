---
sketch: 002
name: full-site-model
question: "Does the dark-kinetic language hold across the whole site, not just the homepage?"
winner: null
tags: [full-site, prototype, navigation, dark, prometheus-palette]
---

# Sketch 002: Full-Site Model

A clickable, multi-page prototype of the entire v3 site — not screenshots. Shared nav, footer,
atmosphere, palette, type, and motion language across every route. Open `index.html` and click around.

## How to View
```
open .planning/sketches/002-full-site-model/index.html
```
Navigate via the top nav and footer; the home → writing → essay and works → project flows are wired.
Switch palettes live from the bottom-right toolbar.

## Pages
- `index.html` — Home (full hero, travelling 3D blob, fixed atmosphere, marquee, clickable index slides)
- `writing.html` — Essays index (year-grouped, excerpts + reading time)
- `essay.html` — Single essay reading view (breadcrumb, meta, prose, related essays)
- `works.html` — Projects index (descriptions)
- `project.html` — Project detail (description, built-with chips, more works)
- `about.html` — About (intro, Prometheus, Writing, Education)
- `prometheus.html` — Prometheus (what we do, case studies, FAQ)
- `newsletter.html` — Monty Monthly (issues carousel)
- `uses.html` — What I Use (grouped tools)
- `events.html` — Events (empty state → newsletter)
- `links.html` — Links

## Architecture
- `assets/site.css` — all shared component styles (tokens come from `../themes/default.css`)
- `assets/site.js` — injects nav + footer + atmosphere, fills interior page heroes from `data-*`
  attrs, runs scroll reveals, and (home only) the Three.js blob + scroll-travel.
- Palette = Prometheus (orange + black). Alts switchable via toolbar (nocturne / ember / halogen).

## What to Look For
- Does the language hold on content-heavy pages (essay prose, indexes) as well as the hero?
- Navigation coherence: nav active states, breadcrumbs, footer, cross-links.
- Whether interior pages need their own moment of motion / 3D, or stay calm and let the home lead.

## Notes
- Throwaway HTML. Production rebuilds this on the existing Next.js + Notion stack; the blob becomes
  an R3F component; reading content comes from Notion. Motion must respect the LCP/PSI perf budget.
