---
phase: 07-seo-overhaul
plan: 10
subsystem: seo
tags: [navigation, footer, events, links, breadcrumbs, copy]

requires:
  - phase: 07-seo-overhaul
    provides: Breadcrumbs (Plan 01); /prometheus, /newsletter, /uses pages (Plans 05/06/07)
provides:
  - Primary navigation matches D-44 (6 links: About, Prometheus, Writings, Works, Monty Monthly, Contact)
  - Footer LINKS includes /uses, /prometheus, /newsletter, /events plus existing entries (D-45)
  - Footer contact copy purged of investing/investor language and reframed for AI/Prometheus
  - /events and /links pages have D-compliant pipe-separator metadata + Breadcrumbs
affects: []

tech-stack:
  added: []
  patterns: []

key-files:
  created: []
  modified:
    - src/components/nav/navigation.tsx
    - src/components/footer.tsx
    - src/app/events/page.tsx
    - src/app/links/page.tsx

key-decisions:
  - "Footer kept the diagonal-arrow heading glyph (&#8600;) — D-01 only bans em dashes; arrows are decorative typography."
  - "Footer LINKS preserves Events alongside the new entries; the page still ships and deserves discovery."
  - "/events and /links pt-24 -> pt-8 to make room for Breadcrumbs supplying the top offset."

requirements-completed: []

duration: ~5min
completed: 2026-04-15
---

# Phase 07 Plan 10: Navigation, Footer, Events, and Links Summary

**Primary nav grew from 2 to 6 links per D-44; footer added /uses, /prometheus, /newsletter and dropped investing/investor copy; /events and /links got Breadcrumbs and pipe-separator metadata.**

## Accomplishments

- `src/components/nav/navigation.tsx` `NAV_LINKS` array updated to the six D-44 entries in order (About, Prometheus, Writings, Works, Monty Monthly, Contact).
- `src/components/footer.tsx`:
  - `LINKS` array expanded to include `/prometheus`, `/newsletter`, and `/uses` (D-45 footer-only) alongside existing About/Writings/Works/Events.
  - Contact paragraph rewritten to drop "investing" and frame around AI, building, writing, and Prometheus engagements.
- `src/app/events/page.tsx`:
  - Metadata title flipped to `'Events | Monty Singer'`, 150-160 char description added, canonical, OG.
  - Wrapped in fragment with `<Breadcrumbs items={[Home, Events]}>`; container padding shifted from `pt-24` to `pt-8`.
- `src/app/links/page.tsx`:
  - Metadata title flipped to `'Links | Monty Singer'`, 150-160 char description added, canonical, OG.
  - Wrapped in fragment with `<Breadcrumbs items={[Home, Links]}>`; container padding shifted from `pt-24` to `pt-8`.
  - Old description had an em dash (`Find Monty Singer online — social...`) — removed.

## Verification

- Acceptance grep suite passes:
  - nav contains `'/prometheus'`, `'Monty Monthly'`, `'Writings'`, `'Works'`.
  - footer contains `'/uses'`, `'/prometheus'`, `'/newsletter'`; no `investing` / `investor`; no em dashes.
  - events/links contain pipe-separator titles + `Breadcrumbs`; neither has `— Monty Singer`.

## Decisions Made

- **Diagonal arrow stays.** `&#8600;` in the footer headings is decorative typography, not an em dash. D-01 bans em dashes only.
- **Footer keeps Events.** Plan only required adding /uses + /prometheus + /newsletter; Events stays so the page is reachable from the footer too.
- **Padding migration.** Both /events and /links shift from `pt-24` to `pt-8` because the Breadcrumbs nav already supplies the page-top offset.

## Self-Check: PASSED

- All 6 acceptance criteria across 3 tasks satisfied.
- No `— Monty Singer` regression on events or links pages.
- All five new nav routes (About, Prometheus, Writings, Works, Monty Monthly) are now reachable from the desktop and mobile menus.
