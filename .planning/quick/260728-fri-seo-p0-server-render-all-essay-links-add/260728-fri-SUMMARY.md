---
id: 260728-fri
type: quick
status: complete
date: 2026-07-28
description: SEO P0 — server-render all essay links, add /uses redirect, unblock Notion image APIs in robots.txt
commits:
  - 20de355 fix(seo): server-render every essay card so posts stop being orphans
  - 8fd5fd5 fix(seo): redirect /uses to /#loves instead of 404ing
  - a9d18c8 fix(seo): let Googlebot crawl the Notion image proxy routes
---

# Quick Task 260728-fri — Summary

Triggered by the Google Search Console coverage export dated 2026-07-28
(36 URLs known, 15 indexed, 21 not). Three of the four not-indexed buckets had
code root causes; all three are now fixed.

## What changed

| Task | File | Change |
|---|---|---|
| T-1 | `src/components/editorial/essay-grid.tsx` | Collapsed grid renders all posts; overflow past `INITIAL_VISIBLE` wrapped in `hidden` instead of sliced away |
| T-2 | `next.config.ts` | Added `/uses` → `/#loves` permanent redirect |
| T-3 | `src/app/robots.ts` | `Allow: /api/notion-cover` + `/api/notion-image` carve-out alongside the existing `Disallow: /api/` |

Two test files updated to match the inverted contracts:
`src/__tests__/components/essay-grid.test.tsx` (overflow is now present-but-hidden,
not absent) and `src/__tests__/seo/robots.test.ts` (`allow` is now an array).

## Verification

Run against a dev server on :3002 with a cleared `.next`:

- `/writing` serves **16** unique `/blog/…` hrefs (was 6), with 6 visible cards
  ahead of 10 `class="hidden"` wrappers, and the button still reads
  "show all essays (16)". Collapsed view is visually unchanged.
- `curl /uses` → `308 → /#loves` (was 404).
- `/robots.txt` emits both `Allow:` carve-out lines and still emits
  `Disallow: /api/`.
- Full suite: 235 passed, 3 files skipped, 16 todo, 0 failures.
- `npm run build` clean; route table unchanged.

## Expected index impact

Should address ~11 of the 21 not-indexed URLs: 10 orphaned essays
("Discovered – currently not indexed") plus the `/uses` 404. The
"Blocked by robots.txt" entry clears once Google refetches `/robots.txt`.
Recovery is not instant — Google has to recrawl `/writing`, discover the
restored links, and spend crawl budget on them.

## Still outstanding

- **P0 item 4 (not code):** 6 pages are "Crawled – currently not indexed"
  because they're thin — `/building/Gene-own` 65 words, `/building/weather-bot`
  72, `/contact` 83, `/building/two-phones` 138, `/prometheus` 187. Google
  crawled these and declined to index them. They need 300+ words each
  (problem / stack / what I learned / status). Requires Monty's writing.
- **P1:** real per-post meta descriptions (all 16 currently share the template
  `"An essay by Monty Singer: {title}."`); `BlogPosting` + `WebSite` JSON-LD
  (posts emit only `BreadcrumbList`); related-posts block for internal link
  depth; rename the `Gene-own` slug with a 301.
- **P2:** homepage canonical trailing-slash consistency; resubmit the sitemap
  and request indexing in Search Console after this deploys.
