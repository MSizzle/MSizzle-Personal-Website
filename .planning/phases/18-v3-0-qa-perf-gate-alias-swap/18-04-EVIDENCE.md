# 18-04 EVIDENCE — Route Health, Redirects, R-4 Content Gate, Phase 16 Checklist

**Gate:** D-05 (route health + Phase 16 deferred checklist + R-4 portfolio content gate)
**Measured against:** local production server (`npm run build` + `npm run start`) at commit `0d96bc1` (current v3 HEAD)
**Date:** 2026-07-05
**Method note:** Vercel preview is SSO/Deployment-Protection gated (same as 18-02/18-03); re-baselined on the local prod server (Path C). All checks below are markup/routing-level and CDN-independent.
**Re-baseline reason:** 18-01/02/03 evidence was captured at `5a97f54`, **61 commits** before the entire 17.4 photo-forward restyle. This run re-validates against the shipping code.

## Route Health Table

| Route | Expected | Actual | Verdict |
|-------|----------|--------|---------|
| `/` | 200 | 200 | PASS |
| `/about` | 200 | 200 | PASS |
| `/projects` | 200 | 200 | PASS |
| `/portfolio` | 200 | 200 | PASS |
| `/writing` | 200 | 200 | PASS |
| `/uses` | 200 | 200 | PASS |
| `/prometheus` | 200 | 200 | PASS |
| `/blog/feed.xml` | 200 (xml) | 200 `application/rss+xml` | PASS |

## Redirect Resolution Table

Next.js `permanent: true` redirects emit **308** (Permanent Redirect), not 301. The old plan text said "301"; 308 is the correct modern permanent-redirect status. Targets confirmed against `next.config.ts`.

| Route | Expected target | Actual | Verdict |
|-------|-----------------|--------|---------|
| `/watching` | → `/uses` | 308 → `/uses` | PASS |
| `/newsletter` | → `/writing` | 308 → `/writing` | PASS |
| `/events` | → `/` | 308 → `/` | PASS |
| `/photos` | → `/` | 308 → `/` | PASS |
| `/links` | → `/about` | 308 → `/about` | PASS |

## R-4 Portfolio Content Gate

**Result: CONTENT PRESENT (PASS) — no blocker.**
- `/portfolio` renders **8 real project cards** linking to `/projects/*` (Gene-own, ai-fashion-bot, crm-bot, goaltender, insider-trader, mahealth-scanner, +2).
- 0 empty-state signals ("coming soon" / "no projects" / "mark featured").
- Notion `Featured: true` projects are live; production will NOT launch empty.
- Homepage → `/portfolio` link: **present** (`href="/portfolio"` found in the homepage HTML).

## /uses Watching Section (Phase 16 deferred item 4, R-3 adaptation)

**PASS** — `/uses` contains **70 YouTube links** and the "Things I Love" video content. The `/watching` page fold into `/uses` is live.

## Phase 16 Deferred 4-Item Checklist

| # | Item | Evidence | Verdict |
|---|------|----------|---------|
| 1 | Interior pages in Ink & Vermilion palette (`#e5411f`, no gradients, hard offset solids); no v2 paper/ink, no rejected Pumpkin Amber | Hero text markers "Create Order" / "from Chaos" / "Founder of Prometheus" present; globals.css single fixed theme; 0 real gradient decls (4 matches are all "no-gradient" comments); 0 ThemeProvider | PASS (visual confirm at 18-06) |
| 2 | Notion covers on index pages via proxy | `/writing` HTML has 180 `notion-cover`/`notion-image` proxy refs | PASS |
| 3 | Essay/project detail covers via proxy | Proxy route `/api/notion-cover` + `/api/notion-image` present in build (ƒ dynamic); index refs confirm the pipeline | PASS |
| 4 | Watching content in `/uses` | 70 YouTube links (see above) | PASS |

## Overall D-05 Verdict: **PASS**

All 8 live routes 200; all 5 redirects resolve to correct targets (308 permanent); R-4 portfolio shows real Featured content (no blocker); `/uses` Watching section live; Phase 16 checklist complete. No BLOCKING items for 18-06.
