---
phase: 02-notion-cms-integration
plan: 01
subsystem: api
tags: [notion, notion-api, notion-to-md, notion-renderer, image-proxy, p-limit, rate-limiting, isr, blog]

# Dependency graph
requires:
  - phase: 01-foundation
    provides: Next.js App Router scaffold, Tailwind v4 styling, provider architecture
provides:
  - Notion API client with rate limiting (p-limit concurrency 2, exponential backoff)
  - BlogPost type and database query functions (getPublishedPosts, getPostBySlug)
  - Block fetching with recursive children (getBlocks)
  - Image proxy API route (/api/notion-image) solving URL expiry
  - NotionRenderer component (557 lines) supporting 17+ block types
  - Blog listing page (/blog) with ISR (30min revalidation)
  - Blog post page (/blog/[slug]) with static generation + ISR
  - Rich text renderer with Notion color mapping to Tailwind classes
affects: [core-pages, animation-polish, pre-launch-qa]

# Tech tracking
tech-stack:
  added: [@notionhq/client@5.16.0, notion-to-md@3.1.9, markdown-to-jsx@9.7.13, p-limit@7.3.0]
  patterns: [withRetry rate-limit wrapper, API route image proxy, ISR with 30min revalidation, recursive block fetching, list item grouping for ul/ol wrapping]

key-files:
  created:
    - src/lib/notion.ts
    - src/components/notion/notion-renderer.tsx
    - src/app/blog/page.tsx
    - src/app/blog/[slug]/page.tsx
    - src/app/api/notion-image/route.ts
  modified:
    - next.config.ts
    - package.json

key-decisions:
  - "Image proxy route (/api/notion-image?blockId=X) instead of build-time download — simpler, solves expiry at request time"
  - "notion.dataSources.query (v5 API) instead of databases.query — breaking change in @notionhq/client v5"
  - "p-limit concurrency 2 with exponential backoff (2^attempt seconds) for rate limiting"
  - "Direct Notion block rendering (NotionRenderer) instead of notion-to-md markdown conversion for richer output"
  - "ISR revalidation at 30 minutes — balances freshness with build quota"
  - "Recursive getBlocks for nested children (toggles, synced blocks)"

patterns-established:
  - "Rate limiting: all Notion SDK calls wrapped in withRetry(limit(fn)) pattern"
  - "Image handling: proxy route with 45min cache (2700s max-age + 300s stale-while-revalidate)"
  - "Block rendering: switch-case per block type with graceful null for unsupported types"
  - "List grouping: consecutive bulleted/numbered items grouped into ul/ol wrappers"
  - "Property extraction: flexible field name matching (e.g., 'Name' || 'Title' || 'title')"

requirements-completed: [BLOG-01, BLOG-02, BLOG-05]

# Metrics
duration: ~45min
completed: 2026-03-31
---

# Phase 2: Notion CMS Integration Summary

**Full Notion data layer with rate-limited API client, 17-block-type renderer, image proxy solving URL expiry, and ISR blog pages**

## Performance

- **Duration:** ~45 min (retroactive estimate)
- **Started:** 2026-03-31
- **Completed:** 2026-03-31
- **Tasks:** 1 (single commit)
- **Files modified:** 10

## Accomplishments
- Notion API client (`src/lib/notion.ts`) with rate limiting via p-limit (2 concurrent) and exponential backoff retry
- Uses `notion.dataSources.query` (v5 breaking change from `databases.query`)
- Blog post type extraction with flexible property name matching
- Recursive block fetching with automatic children resolution
- Image proxy route (`/api/notion-image`) that fetches fresh Notion image URLs on demand, solving the S3 URL expiry problem
- NotionRenderer (557 lines) supporting: paragraph, h1-h3, bulleted/numbered lists, to-do, toggle, code (with language label), quote, blockquote, callout (with emoji), divider, image (via proxy), bookmark, embed, video (YouTube/Vimeo/HTML5), table, column_list/column
- Rich text renderer with all Notion annotations (bold, italic, strikethrough, underline, code, links) and color mapping (18 colors including backgrounds)
- Blog listing page with ISR (30min) and blog post detail page with static generation
- Notion image remote patterns configured in `next.config.ts`

## Task Commits

1. **Notion CMS integration** - `c77ecad` (feat: add Notion CMS integration (Phase 2))

## Files Created/Modified
- `src/lib/notion.ts` - Notion client, rate limiter, database queries, block fetching, image URL refresh
- `src/components/notion/notion-renderer.tsx` - 17+ block type renderer with rich text and color support
- `src/app/blog/page.tsx` - Blog listing page with ISR
- `src/app/blog/[slug]/page.tsx` - Blog post detail with static generation + metadata
- `src/app/api/notion-image/route.ts` - Image proxy solving Notion URL expiry
- `next.config.ts` - Added Notion/S3/Unsplash image remote patterns
- `package.json` - Added @notionhq/client, notion-to-md, markdown-to-jsx, p-limit

## Decisions Made
- Image proxy route instead of build-time download — simpler architecture, solves expiry at request time with 45min cache headers
- Used `dataSources.query` (v5 API) — the standard `databases.query` is deprecated in @notionhq/client v5
- Direct block-by-block rendering instead of converting to markdown first — gives richer output (callouts, toggles, tables, columns)
- Concurrency limit of 2 (not 3) for Notion API — keeps headroom under the 3 req/s rate limit
- 30-minute ISR revalidation — balances content freshness with Vercel build quota

## Deviations from Plan
None — executed outside GSD workflow, retroactively documented.

## Issues Encountered
None documented. Note: e2e testing requires `NOTION_TOKEN` and `NOTION_DATABASE_ID` environment variables to be set.

## User Setup Required
- Set `NOTION_TOKEN` environment variable (Notion integration token)
- Create Notion database with properties: Name/Title (title), Slug (rich_text), Description (rich_text), Published (checkbox), Date (date), Tags (multi_select)
- Set `NOTION_DATABASE_ID` environment variable
- Configure same env vars in Vercel dashboard for production

## Next Phase Readiness
- Notion data layer complete — blog pages render from Notion content
- Image proxy handles URL expiry — no stale images
- Ready for Phase 3 (Core Pages) to build remaining routes using this data layer
- Blocker: env vars needed before live testing

---
*Phase: 02-notion-cms-integration*
*Completed: 2026-03-31*
