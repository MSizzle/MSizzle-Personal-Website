# 06-05 Evidence: SEO Re-audit Against Phase 07 Decisions

**Date:** 2026-04-16
**Commit:** e3dc470

## Deny-list Sweep (D-01/D-03/D-05) — Live HTML

Zero hits across all 7 routes for: investor, investing, NYC, New York, "based in", msizzle.com, em dash.

| Route | Deny-list hits |
|-------|---------------|
| / | 0 |
| /about | 0 |
| /prometheus | 0 |
| /blog | 0 |
| /projects | 0 |
| /newsletter | 0 |
| /uses | 0 |

## JSON-LD Validation

| Route | JSON-LD blocks | Type |
|-------|---------------|------|
| / | 1 | Person (buildPersonSchema) |
| /about | 1 | BreadcrumbList |
| /prometheus | 1 | FAQPage (4 Q&As per D-14) |

## Sitemap & Robots

- `/sitemap.xml`: 30 `<url>` entries
- `/robots.txt`: `Allow: /` + `Sitemap: https://montysinger.com/sitemap.xml`

## RSS Feed

- `/blog/feed.xml`: HTTP 200 (XML content)

## 404 Page

- `/nonexistent-page-test`: HTTP 404 (styled 404 page from Phase 07-11)

## SEO Metadata (spot check)

- Homepage title: "Monty Singer | Founder of Prometheus, Builder, Writer"
- All pages have og:title + og:image tags
- Blog posts have per-post metadata via buildBlogPostMetadata
- All routes have canonical URLs via alternates
