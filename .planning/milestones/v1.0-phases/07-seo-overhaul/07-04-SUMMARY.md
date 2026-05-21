---
phase: 07-seo-overhaul
plan: 04
subsystem: seo
tags: [about, copy, metadata, breadcrumbs]

requires:
  - phase: 07-seo-overhaul
    provides: Breadcrumbs component (Plan 01)
provides:
  - About page rewritten per D-21 (founder of Prometheus framing)
  - Per-page metadata + breadcrumbs on /about
affects: []

tech-stack:
  added: []
  patterns:
    - "Page = Breadcrumbs (above) + content container in a fragment, no inline JSON-LD on non-home pages"

key-files:
  created: []
  modified:
    - src/app/about/page.tsx

key-decisions:
  - "Removed inline Person JSON-LD from /about. Person schema lives only on the homepage per D-13."
  - "Education section collapsed to a single line ('Georgetown University.') per D-04."
  - "Removed Career and Outside of Work sections per D-05."

requirements-completed: []

duration: ~3min
completed: 2026-04-15
---

# Phase 07 Plan 04: About Page Rewrite Summary

**Full About page rewrite per D-21: founder-of-Prometheus framing, removed Career / Outside of Work / NYC / investor copy, collapsed Education, deduped Person JSON-LD (homepage-only), added Breadcrumbs and pipe-separator metadata.**

## Accomplishments

- Replaced the entire `src/app/about/page.tsx` with the D-21 structure: Intro → Prometheus → Writing → Education.
- Removed the inline `personJsonLd` block (was duplicating the homepage Person schema and contained a stale `https://msizzle.com` URL plus banned `Investor` / `NYC` strings).
- Added `<Breadcrumbs items={[{name:'Home',href:'/'}, {name:'About'}]} />` above the content container so BreadcrumbList JSON-LD ships per D-15/D-16.
- Updated metadata to D-07/D-08/D-10 form: title `'About | Monty Singer'`, 155-char description, canonical `/about`, OG block with `type: 'profile'`.
- Eliminated all em dashes (D-01) and rewrote intro to drop "investor", "NYC", and past-job references (D-03, D-05).

## Verification

- Acceptance grep suite passes: contains `founder of Prometheus`, `Monty Monthly`, `Breadcrumbs`, `'About | Monty Singer'`; no `investor`, `investing`, `NYC`, `New York`, `Outside of Work`, `Career`, `personJsonLd`, `application/ld+json`, or em dashes.
- Single H1 (`About`); three H2s (`Prometheus`, `Writing`, `Education`).

## Decisions Made

- **No Person JSON-LD on /about.** D-13 calls out Person schema on the homepage only; duplicating it on /about creates SERP confusion.
- **Pipe separator on title.** Replaces the old em dash pattern `'About — Monty Singer'`. D-01 compliant.

## Self-Check: PASSED

- File contains all required strings, no banned strings.
- One H1, three H2s.
- Breadcrumbs imported and rendered.
