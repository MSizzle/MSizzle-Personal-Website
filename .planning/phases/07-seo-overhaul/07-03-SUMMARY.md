---
phase: 07-seo-overhaul
plan: 03
subsystem: seo
tags: [homepage, copy, jsonld, schema.org, person]

requires:
  - phase: 07-seo-overhaul
    provides: buildPersonSchema + JsonLd component (from Plan 01)
provides:
  - Crawlable homepage intro paragraph with target keywords (Monty Singer, Prometheus, AI, builder, writer)
  - D-13-compliant Person JSON-LD (via buildPersonSchema, no inline duplication)
  - SEO-compliant rotating tagline strings (no "investor", no "NYC", no em dashes)
affects: []

tech-stack:
  added: []
  patterns:
    - "Homepage intro: crawlable prose first, decorative rotating tagline below"
    - "JSON-LD sourced from single builder module, never inlined in pages"

key-files:
  created: []
  modified:
    - src/app/page.tsx
    - src/components/home/rotating-tagline.tsx

key-decisions:
  - "Preserved RotatingTagline as a design element per user directive (deviation from original plan which called for deletion)"
  - "Updated tagline strings to drop 'investor' and 'NYC' (D-03/D-05) and add keyword-rich 'Prometheus' copy"

patterns-established:
  - "SEO + design coexistence: decorative client components are kept when they add visual identity, but their copy is held to the same D-01/D-03/D-05/D-19 compliance as SSR prose"

requirements-completed: []

duration: 12min
completed: 2026-04-15
---

# Phase 07 Plan 03: Homepage Copy Rewrite Summary

**Homepage intro rewritten for crawlable SEO prose, Person JSON-LD sourced from the D-13 builder, and the rotating tagline preserved with compliant copy.**

## Accomplishments

- Rewrote the hero intro paragraph into flat, keyword-rich prose naming Monty Singer, Prometheus, AI, builder, and writer — satisfying D-19 (crawlable prose with keywords), D-01 (no em dashes), D-03 (no location), and D-05 (no "investor").
- Removed the inline `personJsonLd` object and `<script dangerouslySetInnerHTML>` block; replaced with `<JsonLd data={buildPersonSchema()} />` so the Person schema has a single source of truth (D-13).
- **Deviation from plan:** preserved `<RotatingTagline />` instead of deleting it. The user wants it kept as a visual element. Task 2 was retargeted from component deletion to string rewrite.
- Updated `TAGLINES` in `rotating-tagline.tsx` to 5 new lines: "Building AI integrations and education at Prometheus.", "Founder. Builder. Writer.", "Shipping software, essays, and experiments.", "Tinkering with whatever is interesting.", "Always learning, always shipping." — all D-01/D-03/D-05 compliant and adding a Prometheus keyword hit.
- Verified SSR output: all 5 taglines appear in the rendered HTML (crawler-visible, not only post-hydration).

## Verification

- `curl http://localhost:3003/` → HTTP 200, 82 KB of HTML.
- Acceptance grep suite passes: `buildPersonSchema`, `founder of Prometheus`, and `RotatingTagline` all present in `src/app/page.tsx`; no `NYC` / `investor` / `&mdash;` anywhere.
- Manual dev-server check: intro paragraph renders correctly, rotating tagline animates below it, photo carousel + Writings + Works + Events sections unchanged.

## Decisions Made

- **Keep RotatingTagline.** User directive overrode the original plan's decision to delete. Rotating taglines are kept as part of the site's "alive and memorable" design identity; they just need to meet the same SEO content rules as static copy.
- **Tagline copy now pulls SEO weight too.** Rather than treat the tagline as pure chrome, one line explicitly names Prometheus, reinforcing the D-19 keyword density goal without sacrificing playfulness.
