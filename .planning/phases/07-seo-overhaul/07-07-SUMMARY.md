---
phase: 07-seo-overhaul
plan: 07
subsystem: seo
tags: [uses, static-page, breadcrumbs]

requires:
  - phase: 07-seo-overhaul
    provides: Breadcrumbs (Plan 01)
provides:
  - /uses route per D-30 with four sections (AI/Dev, Productivity, Communication, Hardware)
affects:
  - 07-10 (Footer will link /uses)

tech-stack:
  added: []
  patterns: []

key-files:
  created:
    - src/app/uses/page.tsx
  modified: []

key-decisions:
  - "Hardware section ships as a placeholder per D-30 — explicitly noted in copy, no fabricated specs."
  - "Tools listed in the order from D-30; first-mention bold via <strong> for skim-readability."

requirements-completed: []

duration: ~2min
completed: 2026-04-15
---

# Phase 07 Plan 07: /uses Page Summary

**New /uses route with four sections (AI and Development, Productivity, Communication, Hardware) and pipe-separator metadata. Hardware ships as a placeholder per D-30.**

## Accomplishments

- Shipped `src/app/uses/page.tsx` as a server component with H1 `What I Use` and four H2 sections matching D-30 verbatim.
- All required tools listed: Claude, Claude Code, LangGraph, Ollama, Python, Next.js, React, Node.js, DigitalOcean, Vercel, GitHub, Obsidian, Substack, Notion, Telegram, Slack.
- Hardware section is a single italic placeholder paragraph (D-30 explicitly defers hardware specs to Monty later).
- Metadata: title `'Uses | Tools and Stack | Monty Singer'` (D-32), 155-char description, canonical `/uses`, OG block.
- Breadcrumbs `Home / Uses` per D-15/D-16.

## Verification

- Acceptance grep suite passes: file exists; `What I Use`, exact metadata title, `Obsidian`, `Telegram`, `Placeholder` all present; no em dashes.

## Decisions Made

- **One-line tool descriptions.** D-31 says "tool name + one-line description"; kept descriptions tight (under ~80 chars each) so the page scans quickly.
- **No icons.** Stays consistent with the rest of the site's typography-first aesthetic; can be added later if the page grows.

## Self-Check: PASSED

File present, all 16 named tools present, Hardware placeholder present, metadata + breadcrumbs in place.
