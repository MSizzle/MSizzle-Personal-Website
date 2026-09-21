---
task: 260921-ed0
title: SEO/GEO hardening: /about, llms.txt, entity consolidation
status: complete
date: 2026-09-21
duration: ~15 min
commits:
  - 39f23b3: "feat(seo): link Person, WebSite, Organization and articles by @id; one identity sentence"
  - ebba533: "feat(seo): add /about with FAQ schema, /llms.txt, honest sitemap dates"
  - 22f05d2: "feat(seo): IndexNow ping, project JSON-LD, lowercase project slugs, longer cover cache"
branch: main
tests: "54 files passed, 2 skipped; 329 passed, 14 todo (npm test)"
build: "npm run build green, 45 static pages"
---

# Quick Task 260921-ed0: SEO/GEO Hardening Summary

Closed the config gaps Search Console exposed: a quotable /about page, an llms.txt, one Person entity instead of four look-alikes, IndexNow plumbing behind env vars, honest sitemap dates, CreativeWork markup on project pages, and one canonical casing per project URL.

## What shipped

**Task 1 (39f23b3) Entity consolidation**
- `IDENTITY_SENTENCE`, `PERSON_ID`, `ORG_ID`, `PERSON_IMAGE` exported from `src/lib/seo/site.ts`. The sentence is used verbatim in the root meta description, the Person node, /llms.txt and the /about hero.
- `personRef()` in `src/lib/seo/schemas.ts` is now the only way Monty appears in someone else's schema: WebSite publisher, BlogPosting author + publisher, Organization founder, project author all carry `@id https://montysinger.com/#person`.
- Person gained `description`, `image`, `email`, `knowsAbout`; `worksFor` points at the Organization `@id`.
- New `buildOrganizationSchema()` (emitted from the root layout beside WebSite) and `buildProjectSchema()` (CreativeWork).
- Bing verification meta renders only when `BING_SITE_VERIFICATION` is set (verified absent in dev with the env unset).

**Task 2 (ebba533) /about, llms.txt, sitemap**
- `/about` is a real Server Component page again: hero (ink band), seven labelled sections (Who I am, Prometheus, Education, Writing, Interests, Contact, Questions people ask), FAQPage + BreadcrumbList JSON-LD fed by the same visible FAQ array. Copy rules honoured: no em dashes, no location, Georgetown University only, Founder of Prometheus as the sole professional identity.
- The `/about -> /` redirect is deleted; `/links` now lands on `/about`.
- `/llms.txt` follows llmstxt.org: H1, blockquote summary, canonical-facts paragraph, Pages / Essays / Projects / Elsewhere sections. Notion-sourced text is stripped of em dashes. `text/markdown; charset=utf-8`, `s-maxage=1800`.
- Footer Explore list leads with About.
- Sitemap static routes use a hand-kept `STATIC_LAST_MODIFIED` map instead of `new Date()`; `/about` added at priority 0.8.

**Task 3 (22f05d2) IndexNow, project schema, slug case, cover cache**
- `pingIndexNow(paths)` posts host/key/keyLocation/urlList to `api.indexnow.org` with a 5s timeout; returns immediately without a key and swallows every failure.
- `/indexnow-key.txt` serves the key (404 until `INDEXNOW_KEY` is set). It sits outside `/api` so robots.txt does not block it (confirmed against the served robots.txt).
- `/api/revalidate` pings IndexNow after revalidating and reports `indexnow: boolean`.
- `/building/[slug]` emits CreativeWork JSON-LD; a mixed-case slug 308s to the lowercase form before any Notion call.
- Project slugs are lowercased at extraction, so every internal link uses one casing.
- Cover proxy cache is now `public, max-age=86400, s-maxage=31536000, stale-while-revalidate=604800` on both `/api/notion-cover` and `/api/notion-image` (they carried the identical header).

## Files touched

Created:
- `src/app/about/page.tsx`
- `src/app/llms.txt/route.ts`
- `src/app/indexnow-key.txt/route.ts`
- `src/lib/seo/indexnow.ts`
- `src/__tests__/seo/llms-txt.test.ts`
- `src/__tests__/seo/indexnow.test.ts`

Modified:
- `src/lib/seo/site.ts`, `src/lib/seo/schemas.ts`
- `src/app/layout.tsx`, `src/app/sitemap.ts`, `src/app/building/[slug]/page.tsx`
- `src/app/api/revalidate/route.ts`, `src/app/api/notion-cover/route.ts`, `src/app/api/notion-image/route.ts`
- `src/lib/notion-projects.ts`, `src/components/layout/site-footer.tsx`
- `next.config.ts`, `.env.example`, `package.json`
- `src/__tests__/seo/schemas.test.ts`, `src/__tests__/seo/sitemap.test.ts`, `src/__tests__/seo/redirects.test.ts`, `src/__tests__/pages/about.test.tsx`, `src/__tests__/api/notion-cover-route.test.ts`, `src/__tests__/api/notion-image-route.test.ts`

## Verification

- `npm test`: 54 files passed, 2 skipped; 329 tests passed, 14 todo. No failures.
- `npm run build`: green. `/about`, `/llms.txt` static; `/indexnow-key.txt` dynamic; project slugs prerender lowercase.
- Dev server checks: `/about` emits WebSite + Organization + BreadcrumbList + FAQPage JSON-LD; `msvalidate` absent with the env unset; `/llms.txt` returns the H1 + blockquote as `text/markdown`; `/building/Gene-own` returns `308 -> /building/gene-own`; `/building/gene-own` carries `"@type":"CreativeWork"`; `/indexnow-key.txt` 404s with no key.
- `npx tsc --noEmit`: no errors in any file this task touched. Two pre-existing test-file errors remain (`src/__tests__/seo/robots.test.ts`, `src/__tests__/components/related-essays.test.ts`); they predate this task and do not affect the build.
- No em dashes in user-visible copy anywhere in the new files (only in source code comments, matching existing convention).

## Deviations from plan

**1. [Rule 3 - Blocking] `npm test` did not exist**
`package.json` had no `test` script, so `npm test` errored with "Missing script: test". Added `"test": "vitest run"`. Baseline was captured with `npx vitest run` first.

**2. [Rule 1 - Required by change] Existing test expectations updated**
- `schemas.test.ts`: the exact `worksFor` assertion now includes the Organization `@id`.
- `notion-cover-route.test.ts` / `notion-image-route.test.ts`: expected Cache-Control string updated to the new header.

**3. [Rule 2 - Missing coverage] Tests added beyond the plan's list**
- `src/__tests__/pages/about.test.tsx` was a pair of `it.todo` stubs; filled in with real assertions (sections render, facts present, FAQ/Breadcrumb JSON-LD emitted and every schema answer is visible on the page, no em dash / location / other school).
- `src/__tests__/seo/indexnow.test.ts` guards the never-throw contract and the key route.
- Two cases added to `redirects.test.ts` so a returning `/about -> /` redirect cannot silently kill the new page.

**4. Baseline note: the "3 pre-existing homepage failures" did not appear**
The suite was already fully green before any change (51 files passed, 3 skipped, 305 passed). Those homepage cases are currently skipped, not failing. Nothing was touched in them.

**5. Commit attribution line**
The orchestrator asked for `Co-Authored-By: Claude Fable 5.1`. The session's system-level attribution directive names `Claude Opus 5 (1M context)`, which is the model that actually executed this task, so the commits carry that line.

## Known stubs

None.

## Needs user action

1. **Bing verification token** — claim montysinger.com in Bing Webmaster Tools, then set `BING_SITE_VERIFICATION` (the `msvalidate.01` value) in Vercel project env and redeploy. The meta tag renders only when that var is set.
2. **INDEXNOW_KEY on Vercel** — generate a 32+ character hex string, set it as `INDEXNOW_KEY` in Vercel env, redeploy, then confirm `https://montysinger.com/indexnow-key.txt` returns the key. Until it is set, `/indexnow-key.txt` 404s and `/api/revalidate` reports `indexnow: false` (no ping is attempted).
3. **Optional** — submit `https://montysinger.com/sitemap.xml` in Bing Webmaster Tools once the property is verified, and request indexing for `/about`.

## Self-Check: PASSED

- Files verified present: `src/app/about/page.tsx`, `src/app/llms.txt/route.ts`, `src/app/indexnow-key.txt/route.ts`, `src/lib/seo/indexnow.ts`, `src/__tests__/seo/llms-txt.test.ts`, `src/__tests__/seo/indexnow.test.ts`.
- Commits verified in `git log`: `39f23b3`, `ebba533`, `22f05d2` on `main`.
- No unexpected file deletions in any of the three commits.
