---
phase: 07-seo-overhaul
plan: 08
subsystem: seo
tags: [blog, metadata, breadcrumbs, related-essays, tdd]

requires:
  - phase: 07-seo-overhaul
    provides: Breadcrumbs (Plan 01), RELATED_ESSAYS map (Plan 02), canonical helper (Plan 01)
provides:
  - buildBlogPostMetadata helper that returns D-37 compliant Metadata for any BlogPost
  - RelatedEssays server component (D-41) — renders 2-3 Notion-resolved related posts, hides if zero
  - Per-post Metadata + Breadcrumbs + RelatedEssays wired into /blog/[slug]
  - Blog index Metadata pipe-separator title, Breadcrumbs, and "min read" label
affects:
  - 07-11 (final regression sweep validates the absence of em-dash patterns and runs vitest)

tech-stack:
  added: []
  patterns:
    - "Per-domain Metadata builders centralized in src/lib/seo/* (parallel to project-metadata in Plan 09)"
    - "RelatedEssays is a server component — runs Notion lookups in parallel with try/catch fallback to null"
    - "Truncation helper trims at last whitespace + ellipsis, keeping descriptions <=156 chars"

key-files:
  created:
    - src/lib/seo/blog-metadata.ts
    - src/components/blog/related-essays.tsx
    - src/__tests__/seo/metadata.test.ts
  modified:
    - src/app/blog/[slug]/page.tsx
    - src/app/blog/page.tsx
    - src/components/blog/tag-filter.tsx

key-decisions:
  - "Truncate at 155 chars (ellipsis added) so OG/Twitter descriptions never exceed search-snippet length."
  - "RelatedEssays renders nothing when zero slugs resolve — clean DOM, no empty section header."
  - "Index excerpt uses post.description directly (no extra Notion call) per D-40 cost guidance."
  - "Index 'min read' replaces the prior cryptic '7m' for clarity."

requirements-completed: []

duration: ~6min
completed: 2026-04-15
---

# Phase 07 Plan 08: Blog SEO Wave (Per-Post Metadata, Index Enhancements, Related Essays) Summary

**Per-post pipe-title metadata + canonical/OG, Breadcrumbs above every blog post, Related Essays bottom-of-post link block, and 'min read' on the blog index.**

## Accomplishments

- Shipped `buildBlogPostMetadata(post)` helper (`src/lib/seo/blog-metadata.ts`) returning D-07/D-08/D-10/D-37 compliant Next.js `Metadata`: pipe title, 155-char truncated description, canonical, OG `type: 'article'`, Twitter card.
- Test suite `src/__tests__/seo/metadata.test.ts` locks pipe separator, canonical, OG type, truncation behavior, and fallback description (3/3 passing).
- Shipped `RelatedEssays` server component (`src/components/blog/related-essays.tsx`): looks up `RELATED_ESSAYS[currentSlug]`, resolves each via `getPostBySlug` in parallel with try/catch, hides the section when nothing resolves.
- Wired `src/app/blog/[slug]/page.tsx`:
  - `generateMetadata` now returns `buildBlogPostMetadata(post)` (no more em-dash fallback title).
  - Wrapped article in fragment with `<Breadcrumbs items={[Home, Writings, post.title]}>` above and `<RelatedEssays currentSlug={slug} />` after `<NewsletterCta />`.
  - Article container padding moved from `pt-24` to `pt-8` so Breadcrumbs supplies the top offset.
- Wired `src/app/blog/page.tsx`:
  - Metadata title flipped to pipe form `'Writings | Monty Singer'` plus 150–160 char description, canonical, OG.
  - Wrapped in fragment with `<Breadcrumbs items={[Home, Writings]}>` above and container padding flipped to `pt-8`.
- Updated `src/components/blog/tag-filter.tsx` to render `{n} min read` instead of the bare `{n}m` next to each post (already had date + description excerpt visible per D-40).

## Verification

- `npx vitest run src/__tests__/seo/metadata.test.ts` → 3/3 PASS.
- Acceptance grep suite passes:
  - blog/[slug]/page.tsx contains `buildBlogPostMetadata`, `Breadcrumbs`, `RelatedEssays`; no `— Monty Singer`.
  - blog/page.tsx contains `'Writings | Monty Singer'`, `Breadcrumbs`; no `— Monty Singer`.
  - tag-filter.tsx contains `post.description` and `min read`.

## Decisions Made

- **Server component for RelatedEssays.** Lookups happen at request/ISR time and result in static HTML; client component would force a JS bundle for content that's identical for every visitor.
- **`Promise.all` with per-slug try/catch.** One bad slug doesn't take down the whole block.
- **Index excerpt = `post.description` only.** Per D-40 we deliberately skip fetching block content for an excerpt — would multiply Notion API calls 15x without meaningful SEO gain since `description` is already curated by Monty.
- **Index "min read" over abbreviated "m".** Costs 5 chars per row but eliminates ambiguity (could've meant minutes or meters in a glance). D-39 says "visible reading time"; spelling it out satisfies the spirit of the rule.

## Self-Check: PASSED

- All 6 acceptance criteria across 4 tasks satisfied.
- `npx vitest run src/__tests__/seo/metadata.test.ts` exits 0.
- No `— Monty Singer` regression in either blog page.
