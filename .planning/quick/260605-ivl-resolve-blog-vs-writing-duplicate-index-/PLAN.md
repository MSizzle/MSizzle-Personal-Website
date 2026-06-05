---
quick_id: 260605-ivl
slug: resolve-blog-vs-writing-duplicate-index-
date: 2026-06-05
status: planned
---

# Quick Task: Resolve /blog ↔ /writing duplicate index + fix sitemap

## Problem

`/writing` (polished editorial essays index, in nav) and `/blog` (legacy plain
index) render the same Notion essays. This splits SEO signal and confuses
navigation. The sitemap compounds it: it lists `/blog` (priority 0.9, daily)
but omits `/writing`, `/photos`, and `/links` entirely — so crawlers are
pointed at the legacy index and never told about the canonical one.

`/blog/[slug]` post permalinks and `/blog/feed.xml` are CANONICAL and must keep
working. Only the `/blog` *index* is being retired.

## Approach

Redirect the `/blog` index to `/writing`, repoint internal links, and correct
the sitemap. A Next.js redirect with `source: '/blog'` matches ONLY the exact
path `/blog` — it does NOT match `/blog/[slug]` or `/blog/feed.xml`, so
permalinks and the RSS feed are unaffected. The nav active-label logic
(`pathname.startsWith('/blog')` in navigation.tsx) MUST be left intact so post
permalinks still highlight "Writing".

## Tasks

1. **Add redirect** — `next.config.ts`, inside the existing `redirects()` array
   (which already has `/uses → /about`):
   ```ts
   { source: '/blog', destination: '/writing', permanent: true },
   ```

2. **Delete the orphaned legacy index** — remove `src/app/blog/page.tsx`. The
   redirect intercepts `/blog` before render, so the page is unreachable dead
   code. Leave `src/app/blog/[slug]/` and `src/app/blog/feed.xml/` untouched.
   (`tag-filter.tsx` becomes unused but is out of scope — leave it.)

3. **Repoint footer link** — `src/components/home-v2/ink-footer.tsx` line ~26:
   change the "Process Notes" entry `href` from `/blog` to `/writing`. Keep the
   label text "Process Notes".

4. **Repoint 404 link** — `src/app/not-found.tsx` line ~19: the "writings" link
   `href="/blog"` → `href="/writing"`.

5. **Repoint RSS channel link** — `src/lib/rss/blog-feed.ts` line ~37: the
   channel `<link>` `canonical('/blog')` → `canonical('/writing')`. (The feed
   item permalinks `canonical('/blog/${slug}')` stay unchanged.)

6. **Fix the sitemap** — `src/app/sitemap.ts` `staticRoutes`:
   - Replace the `/blog` entry with `/writing`
     (`changeFrequency: 'weekly', priority: 0.9`).
   - Add `/photos` (`changeFrequency: 'monthly', priority: 0.6`).
   - Add `/links` (`changeFrequency: 'monthly', priority: 0.5`).
   - Leave the dynamic `/blog/${post.slug}` post routes exactly as-is —
     permalinks are unchanged.

## Out of scope / leave intact
- `src/components/nav/navigation.tsx` `pathname.startsWith('/blog')` — KEEP (post permalinks need the "Writing" active label).
- `src/app/blog/[slug]/` and `src/app/blog/feed.xml/` — KEEP.
- `src/lib/seo/blog-metadata.ts` `/blog/${slug}` canonicals — KEEP.
- `src/app/specimen/page.tsx` internal `/blog` links — noindexed internal QA page; the redirect covers them. Optional to update; not required.

## Verification
- `npm run build` succeeds (typecheck + route build; confirms blog index removal doesn't break imports).
- `npx vitest run` passes (no test renders the deleted index; blog.test.tsx is all `it.todo`).
- Manual reasoning: `/blog` → 308 → `/writing`; `/blog/<slug>` and `/blog/feed.xml` still resolve.
