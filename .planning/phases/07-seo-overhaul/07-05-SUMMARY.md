---
phase: 07-seo-overhaul
plan: 05
subsystem: seo
tags: [prometheus, faq, jsonld, schema.org, breadcrumbs]

requires:
  - phase: 07-seo-overhaul
    provides: Breadcrumbs, JsonLd, buildFaqPageSchema (Plan 01)
provides:
  - /prometheus route with FAQPage JSON-LD (D-14) and BreadcrumbList JSON-LD (D-15)
  - Headline, subhead, services list, two case studies, CTA per D-22
affects:
  - 07-10 (Navigation will link /prometheus)

tech-stack:
  added: []
  patterns:
    - "Static page = Breadcrumbs + JsonLd + content article in a fragment"
    - "FAQ payload defined as a typed array constant, fed straight to buildFaqPageSchema"

key-files:
  created:
    - src/app/prometheus/page.tsx
  modified: []

key-decisions:
  - "Inlined the FAQS array at module scope rather than importing from a shared data file (only one consumer)."
  - "Used <strong> rather than separate H3s for the two case studies — keeps the page to one H1 and four H2s for clean heading hierarchy (D-48)."

requirements-completed: []

duration: ~3min
completed: 2026-04-15
---

# Phase 07 Plan 05: /prometheus Page Summary

**New /prometheus landing page with the four-question FAQPage JSON-LD (D-14), breadcrumbs, headline/subhead, services list, two anonymized case studies, and CTA to prometheus.today.**

## Accomplishments

- Shipped `src/app/prometheus/page.tsx` as a server component matching D-22 structure exactly.
- Embedded the four D-14 FAQ Q&As verbatim in a `FAQS` array; passed through `buildFaqPageSchema` from Plan 01 so JSON-LD shape is locked + tested upstream.
- Added Breadcrumbs (`Home / Prometheus`) above the article container per D-15/D-16.
- Metadata uses pipe separator and 155-char description per D-07/D-08; canonical + OG block per D-10/D-09.
- All copy from PRD §4 / §11 verbatim; no em dashes, no banned identity strings.

## Verification

- Acceptance grep suite passes: file exists; contains `buildFaqPageSchema`, `orthodontic`, `boutique hospitality`, `https://prometheus.today`, exact metadata title; no em dashes.
- Exactly one H1 (`Prometheus`) and four H2s (`What We Do`, `Case Studies`, `Work with Prometheus` — three are explicit, plus the FAQ content lives in JSON-LD only).

## Decisions Made

- **FAQS lives at module scope, not in a shared file.** Only consumer is this page; centralizing now would be premature.
- **Case studies as bold-prefixed paragraphs.** Keeps heading hierarchy clean and readable; PRD copy fits naturally into prose.

## Self-Check: PASSED

- File exists; contains the four D-14 answer markers ("Prometheus helps businesses implement AI", "small and mid-size businesses", "custom automation pipelines, AI-powered", "Prometheus was founded by Monty Singer in 2026").
- Two case-study markers present (orthodontic, boutique hospitality).
- prometheus.today CTA + mailto fallback both present.
