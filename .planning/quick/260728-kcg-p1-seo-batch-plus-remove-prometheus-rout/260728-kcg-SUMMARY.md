---
id: 260728-kcg
type: quick
status: complete
date: 2026-07-28
description: P1 SEO batch (real meta descriptions, BlogPosting/WebSite JSON-LD, related posts, canonical) plus removal of the /prometheus route
commits:
  - 5f45747 feat(seo): drop the /prometheus stub and redirect the path to prometheus.today
  - 8cfbd8d feat(seo): derive meta descriptions from each post's opening prose
  - 15cffdf feat(seo): add BlogPosting and WebSite JSON-LD, unify the homepage URL form
  - 6a39444 fix(seo): repair related essays, which rendered nothing on several posts
---

# Quick Task 260728-kcg — Summary

Follow-up to 260728-fri. That round cleared the code-caused indexing blockers;
this one is about quality signals on the pages that are indexed, plus the
`/prometheus` removal Monty asked for.

## What changed

| Task | Outcome |
|---|---|
| T-1 | `/prometheus` route and its OG generator deleted; path 301s to `https://prometheus.today`; dropped from sitemap; footer link now external with `rel="noopener noreferrer"` |
| T-2 | Meta descriptions derived from each post's opening prose when the Notion `Description` is empty |
| T-3 | `BlogPosting` JSON-LD per post; `WebSite` JSON-LD once from the root layout |
| T-4 | Related-essays section repaired and made self-healing |
| T-5 | Homepage canonical, sitemap `<loc>`, and breadcrumb `item` unified on the bare origin |

## Two real bugs found while doing T-4

The related-essays feature existed and was wired into the post page, but served
**zero links** on the live site:

1. `vibe-check` had no entry in `RELATED_ESSAYS`, so the component returned
   `null` outright.
2. The map keyed the AI post as `ai-is-nibbling-the-world`, but the live Notion
   slug is `ai-nibbling`. That key never matched, and the two entries
   referencing it as a *value* silently resolved to nothing — leaving
   `algorithmic-content` and `standing-on-sediment` with one related essay
   instead of two.

Beyond fixing both, the map is no longer a single point of failure: it stays
the preferred source and keeps its authored order, but its output is topped up
to 3 from the rest of the archive (most shared tags first, then recency). New
posts get links the day they publish with no map edit.

## Verification

Against a clean production build (`rm -rf .next && npm run build && npm start`):

- `/prometheus` → `308 → https://prometheus.today/`; zero occurrences in the
  sitemap; no `href="/prometheus"` anywhere in `src/`.
- **16 of 16** post descriptions distinct; **zero** still on the template.
- Every post emits three valid `ld+json` blocks: `WebSite`, `BlogPosting`,
  `BreadcrumbList`. `BlogPosting` carries headline, description,
  `datePublished`, `dateModified`, author, publisher, `mainEntityOfPage`,
  and `wordCount`.
- `vibe-check`, `ai-nibbling`, and `defiant-optimism` each serve 3 distinct
  related links, none self-referential.
- Homepage canonical, sitemap first `<loc>`, and breadcrumb Home `item` are all
  `https://montysinger.com`.
- Full suite: 256 passed, 3 files skipped, 16 todo, 0 failures (up from 235 —
  21 new tests).

## Deliberately not done

- **`Gene-own` slug rename.** `getProjectBySlug` queries Notion with
  `Slug equals`, so lowercasing in code breaks the lookup and a 301 to
  `/building/gene-own` would point at a dead URL. Monty edits the `Slug`
  property to `gene-own` in Notion; the redirect follows.
- **Thin content** on `/contact` (83 words) and the project pages (65–138).
  Needs Monty's writing. Note `/prometheus` is no longer on this list — it was
  the strongest commercial-intent page and is now redirected away, which trades
  that intent to prometheus.today.
- **Off-site:** inbound links (highest-leverage remaining item), and
  resubmitting the sitemap in Search Console after deploy.
