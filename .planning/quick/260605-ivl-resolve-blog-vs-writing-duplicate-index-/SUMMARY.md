---
quick_id: 260605-ivl
slug: resolve-blog-vs-writing-duplicate-index-
date: 2026-06-05
status: complete
commit: 457cd7a
build: pass
tests: pass
---

# Summary: Resolve /blog ↔ /writing duplicate index + fix sitemap

Retired the legacy `/blog` index in favor of the canonical `/writing` editorial
index, repointed all internal references, and corrected the sitemap so crawlers
are pointed at the canonical index and discover `/writing`, `/photos`, and
`/links`.

## Changes

1. **next.config.ts** — added `{ source: '/blog', destination: '/writing', permanent: true }`
   to the existing `redirects()` array. Exact-path match only, so `/blog/[slug]`
   permalinks and `/blog/feed.xml` are unaffected (confirmed in build route list).
2. **src/app/blog/page.tsx** — deleted via `git rm` (now unreachable dead code
   behind the redirect). `[slug]/` and `feed.xml/` left untouched.
3. **src/components/home-v2/ink-footer.tsx** — "Process Notes" link `href`
   changed `/blog` → `/writing` (label unchanged).
4. **src/app/not-found.tsx** — "writings" link `href` changed `/blog` → `/writing`.
5. **src/lib/rss/blog-feed.ts** — channel `<link>` changed `canonical('/blog')` →
   `canonical('/writing')`. Per-item `canonical('/blog/${slug}')` permalinks left
   unchanged.
6. **src/app/sitemap.ts** — replaced the `/blog` static entry with `/writing`
   (weekly, 0.9); added `/photos` (monthly, 0.6) and `/links` (monthly, 0.5).
   Dynamic `/blog/${post.slug}` post routes unchanged.

## Constraints honored
- `src/components/nav/navigation.tsx` `pathname.startsWith('/blog')` — untouched.
- `src/lib/seo/blog-metadata.ts` canonicals — untouched.
- `src/app/blog/[slug]/` and `src/app/blog/feed.xml/` — untouched.
- Redirect source is exactly `/blog`.

## Verification
- `npm run build` — **PASS**. 42/42 static pages generated. Route list confirms
  `/writing`, `/photos`, `/links`, `/blog/[slug]`, and `/blog/feed.xml` all
  present; standalone `/blog` index removed.
- `npx vitest run` — **PASS**. 13 files passed / 5 skipped; 29 tests passed / 14
  todo. No test renders the deleted index.

## Files changed
- next.config.ts (M)
- src/app/blog/page.tsx (D)
- src/components/home-v2/ink-footer.tsx (M)
- src/app/not-found.tsx (M)
- src/lib/rss/blog-feed.ts (M)
- src/app/sitemap.ts (M)

## Commit
- `457cd7a` — fix(seo): redirect /blog index -> /writing; add /writing,/photos,/links to sitemap

## Deviations
None. Plan executed exactly as written. Optional `src/app/specimen/page.tsx`
link update (explicitly not required) was not made — covered by the redirect.
