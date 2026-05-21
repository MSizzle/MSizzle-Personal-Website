---
phase: 07-seo-overhaul
plan: 06
subsystem: seo
tags: [newsletter, substack, rss, isr, carousel, breadcrumbs]

requires:
  - phase: 07-seo-overhaul
    provides: Breadcrumbs (Plan 01), fetchMontyMonthlyIssues + MontyMonthlyIssue type (Plan 02)
provides:
  - /newsletter route (server component, ISR 86400) per D-24
  - NewsletterCarousel client component with horizontal scroll-snap and desktop arrows per D-26
  - Substack image host allowlist in next.config.ts so Next/Image accepts RSS thumbnails
  - D-27 graceful fallback: empty issues → subscribe CTA only
affects:
  - 07-10 (Footer + Nav will link /newsletter)

tech-stack:
  added: []
  patterns:
    - "External RSS data fetched in a server component at ISR boundary; client component receives plain typed array"
    - "Image host allowlist via next.config.ts images.remotePatterns (security: scoped to substackcdn.com + substack-post-media.s3.amazonaws.com)"
    - "Empty-state branch in server component as the formal fallback path — no try/catch in the page; fetchMontyMonthlyIssues already returns [] on failure"

key-files:
  created:
    - src/app/newsletter/page.tsx
    - src/components/newsletter/newsletter-carousel.tsx
  modified:
    - next.config.ts

key-decisions:
  - "ISR revalidate=86400 (24h) — Substack publishes monthly, daily revalidation is plenty fresh and stays well under Vercel free-tier function limits."
  - "Carousel sized to 288px cards (w-72) with 3:2 aspect ratio for thumbnails; falls back to muted block when no image."
  - "Desktop arrows hidden via md:block; mobile users scroll natively."

requirements-completed: []

duration: ~ (shipped previously across 3 commits 5f3e320, bc0f8da, 8722921; SUMMARY backfilled 2026-04-15)
completed: 2026-04-15
---

# Phase 07 Plan 06: /newsletter Page Summary

**Monty Monthly landing page driven by Substack RSS, with horizontal scroll-snap carousel, ISR refresh every 24h, breadcrumbs, D-compliant metadata, and a graceful subscribe-CTA fallback when the feed is empty.**

## Accomplishments

- Shipped `src/app/newsletter/page.tsx` as a server component with `export const revalidate = 86400`, calling `fetchMontyMonthlyIssues(10)` from Plan 02 to load issues at build / ISR time.
- Shipped `src/components/newsletter/newsletter-carousel.tsx` as a client component (`'use client'`) with horizontal scroll-snap (`snap-x snap-mandatory`), desktop scroll-by buttons (`md:block`), and Next/Image cards.
- Allowlisted `substackcdn.com`, `*.substackcdn.com`, and `substack-post-media.s3.amazonaws.com` in `next.config.ts` `images.remotePatterns` so Substack-hosted thumbnails pass through Next.js image optimization.
- D-27 fallback: when the issues array is empty (RSS unreachable, parse error, or Substack down), the page renders a "Recent issues coming soon" paragraph with a Subscribe-on-Substack link instead of the carousel — the build never breaks.
- D-28 metadata: title `'Monty Monthly | Newsletter by Monty Singer'`, 155-char description, canonical `/newsletter`, OG block.
- D-15/D-16 breadcrumbs: `Home / Monty Monthly`.

## Verification

- All three files exist on `main` and have been on production since 2026-04-15.
- Acceptance grep checks (file existence, `revalidate = 86400`, `fetchMontyMonthlyIssues`, exact metadata title, `substackcdn.com` in next.config, `'use client'` in carousel, no em dashes anywhere) all PASS.
- Manual smoke test against dev server (port 3003) returns 200 OK with carousel rendering issues from the live Substack feed.

## Decisions Made

- **ISR @ 86400s.** Substack publishes monthly; 24h freshness window keeps Vercel function calls minimal while ensuring new issues surface within a day.
- **Server-side fetch only.** Per D-25 the RSS call must NOT be client-side. This avoids leaking the feed URL through bundles, lets us cache via ISR, and keeps the carousel card payload tiny.
- **Empty-array branch as fallback.** Rather than wrapping the page in try/catch, `fetchMontyMonthlyIssues` already returns `[]` on any failure (Plan 02), and the page just branches on `issues.length`. Cleaner separation: the page knows about empty states, not about HTTP errors.
- **Image host allowlist scoped tight.** Only Substack's CDN hostnames are allowed — no wildcard outside the substackcdn.com subdomain, no third-party image hosts. Mitigates SSRF risk per the Plan 06 threat model T-07-06-2.

## Self-Check: PASSED

All three files present, all acceptance criteria satisfied, all three commits (`5f3e320`, `bc0f8da`, `8722921`) on `main`. SUMMARY backfilled retroactively to close the planning loop.

## Task Commits

This plan shipped in three sequential commits rather than one (each task → one commit, in order):

1. **Task 1 — next.config.ts allowlist** — `5f3e320` (chore)
2. **Task 2 — NewsletterCarousel client component** — `bc0f8da` (feat)
3. **Task 3 — /newsletter server page** — `8722921` (feat)
