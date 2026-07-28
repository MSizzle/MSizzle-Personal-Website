---
id: 260728-fri
type: quick
status: in-progress
date: 2026-07-28
description: SEO P0 — server-render all essay links, add /uses redirect, unblock Notion image APIs in robots.txt
must_haves:
  truths:
    - All published essays appear as crawlable <a href="/blog/..."> in the server-rendered HTML of /writing, not only after a client-side expand.
    - GET /uses returns a 308 redirect instead of 404.
    - robots.txt allows /api/notion-cover and /api/notion-image while continuing to disallow every other /api/ route.
  artifacts:
    - src/components/editorial/essay-grid.tsx
    - next.config.ts
    - src/app/robots.ts
  key_links:
    - src/components/editorial/essay-grid.tsx:23 (INITIAL_VISIBLE cap)
    - src/app/robots.ts:6 (disallow ['/api/'])
    - next.config.ts redirects() array
---

# Quick Task 260728-fri: SEO P0 index fixes

## Problem

Google Search Console coverage export (2026-07-28) reports 36 known URLs, 15
indexed, 21 not. Three of the four not-indexed buckets trace to code:

| GSC reason | Pages | Root cause |
|---|---|---|
| Discovered – currently not indexed | 13 | 10 of 16 essays are orphans: `EssayGrid` server-renders only 6 links, the rest appear after a client `useState` flip. Sitemap-only URLs on a low-authority domain don't earn crawl budget. |
| Not found (404) | 1 | `/uses` was deleted; `next.config.ts` added a `/watching` redirect but never `/uses`. |
| Blocked by robots.txt | 1 | `/api/notion-cover` is the image `src` on the homepage and every blog post, but `robots.ts` disallows all of `/api/`. |
| Crawled – currently not indexed | 6 | Thin project pages (65–187 words). **Content problem, out of scope for this task.** |

## Tasks

### T-1: Server-render every essay card in the collapsed grid

**files:** `src/components/editorial/essay-grid.tsx`

**action:** In the collapsed branch (`!expanded && posts.length > INITIAL_VISIBLE`),
render **all** posts into the `card-grid` rather than `posts.slice(0, INITIAL_VISIBLE)`.
Wrap each card beyond `INITIAL_VISIBLE` in a container carrying the `hidden`
utility so it is present in the DOM (and therefore in the SSR payload Googlebot
parses) but invisible and non-interactive for humans.

Do **not** flatten the expanded branch — expanding still switches to the
year-grouped `YearBlock` layout. Only the collapsed branch changes.

Use `hidden` (`display: none`), not `sr-only`/opacity: the cards must not
occupy layout space or receive focus while collapsed. `display:none` links are
still parsed and followed by Googlebot; the SEO win is the presence of the
`<a href>` in the HTML, not its visibility.

**verify:** `curl -s https://<preview>/writing | grep -o '/blog/[a-z-]*' | sort -u | wc -l`
returns the full published-essay count (16 at time of writing), not 6.
Visually, `/writing` still shows 6 cards plus the "show all essays (N)" button.

**done:** All 16 essay hrefs present in `/writing` server HTML; collapsed view
unchanged to the eye; expand still renders year groups.

### T-2: Redirect /uses

**files:** `next.config.ts`

**action:** Add `{ source: '/uses', destination: '/#loves', permanent: true }` to
the `redirects()` array, alongside the existing `/watching` entry that already
points at the same successor content.

**verify:** `curl -s -o /dev/null -w '%{http_code} %{redirect_url}' http://localhost:3000/uses`
returns `308 http://localhost:3000/#loves`.

**done:** `/uses` no longer 404s.

### T-3: Allow Notion image proxy routes in robots.txt

**files:** `src/app/robots.ts`

**action:** Replace the blanket `disallow: ['/api/']` with an allow/disallow pair
that keeps `/api/` blocked but carves out the two image proxy routes actually
referenced as `<img src>` in page HTML:

```ts
rules: {
  userAgent: '*',
  allow: ['/', '/api/notion-cover', '/api/notion-image'],
  disallow: ['/api/'],
}
```

Google resolves competing rules by longest-match, so the more specific
`Allow: /api/notion-cover` wins over `Disallow: /api/`. Leave every other
`/api/` route blocked — `/api/revalidate` (401) and `/api/enrich-loves` must
stay out of the index.

Add a comment recording why the carve-out exists so a future blanket-disallow
edit doesn't silently re-break image crawling.

**verify:** Generated `/robots.txt` contains both `Allow:` lines and still
contains `Disallow: /api/`.

**done:** Cover images on the homepage and blog posts are crawlable.

## Out of scope

- P0 item 4 (expanding the 6 thin pages past 300 words) — needs Monty's writing.
- P1 items: per-post meta descriptions, `BlogPosting`/`WebSite` JSON-LD,
  related-posts block, `Gene-own` slug rename.
- Resubmitting the sitemap / requesting indexing in GSC (manual, post-deploy).
