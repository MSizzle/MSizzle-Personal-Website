---
id: 260728-kcg
type: quick
status: in-progress
date: 2026-07-28
description: P1 SEO batch (real meta descriptions, BlogPosting/WebSite JSON-LD, related posts, canonical) plus removal of the /prometheus route
must_haves:
  truths:
    - GET /prometheus permanently redirects to https://prometheus.today and the route no longer exists in the app.
    - No page on the site links to the internal /prometheus path.
    - Each blog post emits a meta description derived from its own opening prose when the Notion Description property is empty, not a shared template string.
    - Each blog post emits BlogPosting JSON-LD carrying headline, datePublished, dateModified, author, and image.
    - The site emits WebSite JSON-LD once.
    - Each blog post links to sibling posts at the end of the article.
    - The homepage canonical and the sitemap homepage entry use the same trailing-slash form as the breadcrumb schema.
  artifacts:
    - next.config.ts
    - src/app/sitemap.ts
    - src/lib/seo/blog-metadata.ts
    - src/lib/seo/schemas.ts
    - src/components/layout/site-footer.tsx
  key_links:
    - src/lib/seo/blog-metadata.ts:13 (template-string description fallback)
    - src/lib/seo/site.ts (SITE_URL, canonical)
    - src/app/blog/[slug]/page.tsx (post render + JSON-LD injection point)
---

# Quick Task 260728-kcg: P1 SEO batch + drop the /prometheus route

Follow-up to 260728-fri, which cleared the code-caused index blockers. This
round is about the quality signals on the pages that *are* indexed, plus a
structural change Monty asked for.

## Context

- `/prometheus` is a 187-word stub duplicating `prometheus.today`. The main nav,
  hero, sticky nav, and section-building already link to the external site —
  only the footer still points at the internal route, so it's nearly orphaned
  already. Monty wants it gone and the path routed to the real site.
- `blog-metadata.ts:13` already prefers `post.description` and only falls back to
  `` `An essay by Monty Singer: ${post.title}.` ``. Every one of the 16 live
  posts renders that fallback, which means the Notion `Description` property is
  empty across the board. Fixing this in code means a better *fallback*, not a
  new field: anything Monty later types into Notion still wins.
- Posts currently emit only `BreadcrumbList` JSON-LD.

## Tasks

### T-1: Delete the /prometheus route, redirect the path to prometheus.today

**files:** `src/app/prometheus/page.tsx` (delete),
`src/app/prometheus/opengraph-image.tsx` (delete), `next.config.ts`,
`src/app/sitemap.ts`, `src/components/layout/site-footer.tsx`,
`src/__tests__/pages/og-image.test.tsx`, `src/__tests__/seo/sitemap.test.ts`

**action:**
1. Delete both files under `src/app/prometheus/`.
2. Add `{ source: '/prometheus', destination: 'https://prometheus.today', permanent: true }`
   to `redirects()`. Next supports absolute external destinations.
3. Drop the `/prometheus` entry from `sitemap.ts` and fix the stale comment above
   the static-routes array (it currently claims 5 routes including /prometheus).
4. Point the footer's `Prometheus` entry at `https://prometheus.today`. Confirm
   the footer renders external hrefs correctly (it may assume internal `Link`).
5. Update `og-image.test.tsx` to stop importing the deleted OG module and drop
   it from the module list; update `sitemap.test.ts` so its static-route
   assertion no longer expects `/prometheus`.

**verify:** `curl -sI /prometheus` → 308 to `https://prometheus.today`;
`grep -rn 'href="/prometheus"' src/` returns nothing; build succeeds.

**done:** Route gone, path redirects, no internal links, tests green.

### T-2: Derive real meta descriptions from post content

**files:** `src/lib/seo/blog-metadata.ts`, `src/app/blog/[slug]/page.tsx`,
`src/lib/notion.ts` (only if a block-to-text helper is needed)

**action:** Give `buildBlogPostMetadata` an optional second argument carrying the
post's fetched blocks (the post page already calls `getBlocks(post.id)` for
reading time, so this is free — no extra Notion request). Derive the fallback
description from the first paragraph-ish block's plain text, collapsed to one
line and truncated to 155 chars on a word boundary.

Precedence must stay: Notion `Description` → derived opening prose → the existing
template string as a last resort (a post whose body starts with an image or an
embed has no prose to pull).

`generateMetadata` re-fetches via `getPostBySlug`; have it fetch blocks too.
Next dedupes identical fetches within a request, and the ISR window already
caps Notion call volume, so this does not add meaningful load.

**verify:** No two posts share a description; spot-check that
`/blog/vibe-check`'s description is its opening line, not the template.

**done:** 16 distinct, content-derived descriptions.

### T-3: BlogPosting and WebSite JSON-LD

**files:** `src/lib/seo/schemas.ts`, `src/app/blog/[slug]/page.tsx`,
`src/app/layout.tsx`, `src/__tests__/seo/schemas.test.ts`

**action:** Add `buildBlogPostingSchema(post, { description, readingTime })`
emitting `@type: BlogPosting` with `headline`, `description`, `datePublished`
(`post.date`), `dateModified` (`post.lastEdited`), `author` (reuse the Person
node), `image` (the absolute `/api/notion-cover` URL when `post.cover` exists),
`mainEntityOfPage`, and `wordCount` when available. Render it in the post page
alongside the existing breadcrumb script.

Add `buildWebSiteSchema()` (`@type: WebSite`, `name`, `url`, `publisher`
pointing at the Person) and emit it once from the root layout.

Add schema tests covering required-field presence and that `datePublished` is
a valid ISO date.

**verify:** Post HTML contains three `ld+json` blocks (Breadcrumb, BlogPosting,
WebSite); values validate as well-formed JSON.

**done:** Rich-result-eligible article markup on every post.

### T-4: Related posts at the end of each article

**files:** new `src/components/editorial/related-posts.tsx`,
`src/app/blog/[slug]/page.tsx`, new test

**action:** After the article body, render up to 3 sibling posts. Selection:
prefer posts sharing at least one tag with the current post, then fill by
recency; always exclude the current post. Reuse the existing `Card` treatment so
it matches `/writing`, and keep it server-rendered — the whole point is
crawlable internal links and crawl depth.

Degrade to rendering nothing when there are fewer than 2 published posts.

**verify:** `/blog/vibe-check` HTML contains 3 distinct `/blog/…` hrefs that are
not `vibe-check`.

**done:** Every post links onward to 3 others.

### T-5: Canonical trailing-slash consistency

**files:** `src/lib/seo/site.ts` or `src/app/sitemap.ts`

**action:** The homepage canonical and sitemap `<loc>` render as
`https://montysinger.com` (no trailing slash) while the breadcrumb JSON-LD emits
`https://montysinger.com/`. Pick the bare form (matches the existing canonical
and sitemap) and make `canonical('/')` agree, so all three references match.

**verify:** Homepage canonical, sitemap first `<loc>`, and breadcrumb `item`
for Home are byte-identical.

**done:** One homepage URL form sitewide.

## Out of scope

- **`Gene-own` slug rename.** `getProjectBySlug` queries Notion with
  `Slug equals`, so lowercasing the slug in code breaks the lookup, and a 301
  to `/building/gene-own` would point at a dead URL until the Notion property
  itself changes. Monty edits the `Slug` property to `gene-own` in Notion; the
  redirect gets added in a follow-up.
- Thin-content expansion on `/contact` and the project pages (needs Monty's
  writing).
- Off-site work: inbound links, Search Console resubmission.
