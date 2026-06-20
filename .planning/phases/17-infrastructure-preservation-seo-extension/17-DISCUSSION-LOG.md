# Phase 17: Infrastructure Preservation & SEO Extension - Discussion Log

> **Audit trail only.** Do not use as input to planning, research, or execution agents.
> Decisions are captured in CONTEXT.md — this log preserves the alternatives considered.

**Date:** 2026-06-20
**Phase:** 17-Infrastructure Preservation & SEO Extension
**Areas discussed:** Structured-data depth, OG images for new pages, Verification rigor, Sitemap entry tuning

---

## Structured-data depth

| Option | Description | Selected |
|--------|-------------|----------|
| Breadcrumb-only (no new schema) | Keep what ships today; both pages already emit BreadcrumbList JSON-LD. Zero new builders, no malformed-schema risk, lowest SEO upside. | ✓ |
| /watching as VideoObject ItemList | Add ItemList of VideoObject for /watching (rich-result eligible), /uses breadcrumb-only. Needs new buildVideoListSchema. | |
| Full ItemList on both | VideoObject ItemList on /watching + SoftwareApplication ItemList on /uses. Most complete, least ROI for /uses. | |

**User's choice:** Breadcrumb-only (no new schema)
**Notes:** /watching video IDs in src/lib/watching.ts are still placeholders, so VideoObject schema would be premature.

---

## OG images for new pages

| Option | Description | Selected |
|--------|-------------|----------|
| Use site-wide default OG | Inherit root layout/metadata default; no per-page work; consistent with other static pages. | ✓ |
| Dynamic @vercel/og per page | Branded per-page OG image (title + Pumpkin Amber); adds an Edge route + design work for two low-traffic pages. | |
| You decide | Check whether a site-wide default exists, then match other v3 static pages. | |

**User's choice:** Use site-wide default OG
**Notes:** Planner to confirm parity with /about, /links, /events OG behavior.

---

## Verification rigor

| Option | Description | Selected |
|--------|-------------|----------|
| Automated regression assertions | vitest/build checks: sitemap completeness incl. new pages, robots/feed resolve, every page exports metadata, Umami present when env set. Durable, re-runnable. Matches Phase 16 16-09 gate. | ✓ |
| Lightweight smoke check | One-time manual/scripted preview pass; no lasting safety net; leans on Phase 18 to re-verify. | |
| Defer heavy verification to Phase 18 | Phase 17 only adds sitemap entries; all verification in Phase 18 QA gate. Risks completing without proving IN-03/IN-04. | |

**User's choice:** Automated regression assertions
**Notes:** Scope to preservation + the two new pages; do not duplicate Phase 18's PSI/perf budget.

---

## Sitemap entry tuning

| Option | Description | Selected |
|--------|-------------|----------|
| Match /photos (0.6, monthly) | Treat both as stable secondary pages like /photos. | ✓ |
| Fresher (0.7, weekly) | Signal more frequent updates; overstates reality for placeholder-stage pages. | |
| Split them | /uses 0.5 monthly, /watching 0.6 monthly. Most honest, marginal benefit. | |

**User's choice:** Match /photos (0.6, monthly)
**Notes:** —

## Claude's Discretion

- Exact test file location/naming and whether assertions extend the Phase 16 gate or live in a new vitest file.
- Whether the Umami "tracks on every page" proof is a component render assertion vs. a preview smoke note (automated preferred).

## Deferred Ideas

- VideoObject / ItemList structured data for /watching — once real video IDs land.
- Per-page dynamic @vercel/og images for /uses + /watching — polish pass.
- Full PSI / mobile perf budget + alias swap — Phase 18.
