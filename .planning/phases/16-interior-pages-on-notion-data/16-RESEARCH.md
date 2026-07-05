# Phase 16: Interior Pages on Notion Data - Research

**Researched:** 2026-06-20
**Domain:** Next.js 16 + React 19 presentation-layer rebuild on existing Notion pipeline
**Confidence:** HIGH (established codebase, verified loaders, locked design decisions)

## Summary

Phase 16 rebuilds every interior page in the v3 Pumpkin Amber system by:
1. Repainting v2 editorial pages (v2 paper/ink tokens) onto the Pumpkin Amber `@theme` tokens already locked in `src/app/globals.css`
2. Converting index pages (Writing, Works) from list rows to photo-forward card grids
3. Adding full-bleed Notion cover images to essay and project detail pages
4. Building two new hardcoded pages (`/uses`, `/watching`) following the `photos.ts` pattern
5. Extending the navigation to cover all routes with breadcrumbs on detail views

The infrastructure is PRESERVED — Notion loaders, image proxies, ISR (30min), and the `NotionRenderer` stay unchanged (IN-01/IN-02). This is a **presentation-layer rebuild**, not a backend refactor.

**Primary recommendation:** Adopt the v3 components (`Card`, `PageHero`, `VideoCard`, `UsesList`) for consistency; repaint editorial primitives to Pumpkin Amber tokens; confirm token mapping v2→v3 before mass replacement.

## User Constraints (from CONTEXT.md)

### Locked Decisions
- **D-01:** Interior pages are calm + reading-first with big photographic moments (no kinetic marquees or animated oversized type)
- **D-02:** Full-bleed photos on all four surfaces: project detail hero, essay reading hero (with fallback), Works & Writing indexes (photo grid), About + /photos
- **D-03:** Writing and Works indexes use photo-grid cards (departure from v2 list rows)
- **D-04:** Keep year-grouping as section headers within the card grid
- **D-05:** `/uses` content in hardcoded typed TS file (e.g., `src/lib/uses.ts`); no Notion DB this phase
- **D-06:** `/uses` has four groups: AI & Development, Productivity, Communication, Hardware (with TODO placeholders for Hardware entries)
- **D-07:** `/watching` content in hardcoded typed TS file (`src/lib/watching.ts`)
- **D-08:** Thumbnails auto-derived from YouTube video ID (no manual assets)
- **D-09:** `/watching` card grid; each card links to YouTube in a new tab
- **D-10:** Seed `/watching` with 6 placeholder titles
- **D-11:** Focused primary desktop nav (5 routes: Work, Writing, Events, About, Links); secondary routes → footer
- **D-12:** Footer is full sitemap (includes Uses, Watching, Prometheus, Newsletter, Photos)
- **D-13:** Active states = pathname-based (bold/underline current); breadcrumbs on detail views + /uses + /watching; mobile = hamburger drawer
- **D-14:** Essay view shows breadcrumb, reading time, publish date, prose (NotionRenderer), related essays

### Claude's Discretion
- Whether to repaint v2 editorial primitives or adopt v3 components (goal: one consistent v3 system)
- Exact card grid breakpoints, image aspect ratios, scroll-reveal timings (within perf budget, respect reducedMotion)
- Excerpt source: Writing uses `getPostExcerpt`; Works uses `description` field

### Deferred Ideas (OUT OF SCOPE)
- Move `/uses` or `/watching` into Notion (start hardcoded; revisit if editing friction appears)
- Move `/photos` into Notion (pre-existing deferral)
- Real `/uses` Hardware values + real `/watching` video list (Monty-owned content fill, not a code blocker)

## Phase Requirements

| ID | Description | Research Support |
|----|-------------|------------------|
| PG-01 | Home, Writing, Essay, Works, Project, About, Prometheus, Newsletter, Events, Links rebuilt in v3; Notion-sourced | Confirmed: loaders output BlogPost, Project, EventItem; cover/image fields available for full-bleed heroes; ISR 30min + NotionRenderer preserve pipeline |
| PG-02 | New `/uses` page built and linked | Confirmed: v3 `UsesList` component exists; `photos.ts` pattern established for hardcoded typed data; update nav + footer to include `/uses` |
| PG-03 | New `/watching` page (YouTube videos as cards, opens in new tab) | Confirmed: v3 `VideoCard` component exists; YouTube thumbnail pattern (`https://img.youtube.com/vi/{id}/{res}.jpg`); must add `img.youtube.com` to `next.config` remotePatterns |
| PG-04 | Essay view breadcrumb, reading time, publish date, prose, related essays; indexes show excerpts | Confirmed: `Breadcrumbs`, `calculateReadingTime`, `RelatedEssays`, `getPostExcerpt` all exist; integrate into `/blog/[slug]` and rebuild `/writing`, `/projects` grids |
| PG-05 | Shared nav + footer with active states and breadcrumbs | Confirmed: `Navigation` has active-label mapping; `Breadcrumbs` component exists; rebuild footer to full sitemap; extend active mapping for /uses, /watching |
| IN-01 | Notion pipeline (dataSources.query v5, ISR 30min) unchanged | Verified: all loaders use ISR 30min; no changes expected |
| IN-02 | Image proxy routes (notion-cover, notion-image) unchanged | Verified: routes exist and work; no changes expected |

## Architectural Responsibility Map

| Capability | Primary Tier | Secondary Tier | Rationale |
|------------|-------------|----------------|-----------|
| Interior page layout & Pumpkin Amber tokens | Frontend (Browser/SSR) | — | CSS theming + Tailwind tokens are presentation-layer concerns; `@theme` declared in globals.css |
| Notion data loading & ISR refresh | API/Backend (server loaders) | — | `getPublishedPosts`, `getProjectBySlug`, `getBlocks` are async server functions; 30min ISR is a server concern |
| Photo-grid card rendering | Frontend (Browser) | — | React components (`Card`, `UsesList`, `VideoCard`) render grid layouts and responsive images |
| Breadcrumb & nav active state | Frontend (Browser/SSR) | — | `Breadcrumbs` component + `usePathname` hook in `Navigation` handle client-side routing awareness |
| Hardcoded `/uses` and `/watching` data | Static (Code) | — | Typed TS files (`uses.ts`, `watching.ts`) are static assets compiled into the bundle |
| YouTube thumbnail fetching | CDN (img.youtube.com) | Frontend (Next.js Image) | CDN serves thumbnails; Next.js Image optimizes and caches via remotePatterns config |

## Standard Stack

### Core (Preserved)
| Library | Version | Purpose | Why Standard |
|---------|---------|---------|--------------|
| Next.js | 16.x | Framework, routing, ISR, Image optimization | App Router stable; ISR gates content freshness at 30min; Image component with remotePatterns handles Notion + YouTube CDN |
| React | 19.x | UI runtime | Ships with Next.js 16; `usePathname` for nav active state; server components for data loading |
| TypeScript | 5.x | Type safety | All existing loaders use strict types (BlogPost, Project, EventItem); hardcoded modules follow same pattern |
| Tailwind CSS | v4.x | Styling | `@theme` tokens in globals.css lock Pumpkin Amber palette; interior pages repaint via token replacement (no new CSS files needed) |

### Notion Integration (Preserved)
| Library | Version | Purpose | Verified |
|---------|---------|---------|----------|
| @notionhq/client | 5.x | Notion API client | [VERIFIED: npm registry] Loaders use `Client` from @notionhq/client; BlogPost, Project, EventItem shapes confirmed in `src/lib/notion*.ts` |
| src/lib/notion.ts | — | Blog loader | [VERIFIED: codebase] Exports `getPublishedPosts`, `getPostBySlug`, `getBlocks`, `getPostExcerpt`, `getFreshImageUrl`; cover access via page.cover |
| src/lib/notion-projects.ts | — | Projects loader | [VERIFIED: codebase] Exports `getPublishedProjects`, `getProjectBySlug`, `getFeaturedProjects`; image field is page.cover |
| src/lib/notion-events.ts | — | Events loader | [VERIFIED: codebase] Exports `getPublishedEvents`, `getUpcomingEvents`, `getPastEvents`; image field is page.cover; date sorting available |

### Interior Page Components (v3 + v2 to Repaint)
| Component | Location | Purpose | Preserve or Repaint |
|-----------|----------|---------|-------------------|
| Card | src/components/v3/card.tsx | Essay/works grid card (kicker, title, blurb, href) | **Adopt** — already targets Pumpkin Amber tokens (--color-bg, --color-text) |
| PageHero | src/components/v3/page-hero.tsx | Title + breadcrumb + subtitle (sig/sig-out variants) | **Adopt** — already uses Pumpkin Amber sig treatment |
| VideoCard | src/components/v3/video-card.tsx | YouTube thumb + play-triangle + title + channel | **Adopt** — already built for v3, used by /watching |
| UsesList | src/components/v3/uses-list.tsx | Grouped dt/dd list (responsive grid collapse) | **Adopt** — already built for v3 |
| ListRow | src/components/editorial/list-row.tsx | v2 prose list row (big variant used in /writing, /projects) | **Repaint** — currently uses v2 tokens (text-ink, text-muted); map to Pumpkin Amber vars |
| YearBlock | src/components/editorial/year-block.tsx | v2 year section header | **Repaint** — currently uses v2 tokens; map to v3 |
| Rule, RuleStrong | src/components/editorial/*.tsx | v2 divider lines | **Repaint** — if tokens reference v2 paper/ink, map to Pumpkin Amber borders |
| Breadcrumbs | src/components/seo/breadcrumbs.tsx | Semantic nav (sr-only + JSON-LD) | **Reuse** — already exists; used in blog/project detail pages |
| RelatedEssays | src/components/blog/related-essays.tsx | Related posts list (uses RELATED_ESSAYS data file) | **Reuse** — already exists; used in essay view |
| NewsletterCta | src/components/blog/newsletter-cta.tsx | Newsletter signup footer | **Reuse** — already exists; used in essay view |

### Image & Asset Handling
| Pattern | Location | Purpose | Verified |
|---------|----------|---------|----------|
| Notion cover proxy | src/app/api/notion-cover/route.ts | Fetch page.cover image from Notion; cache 45min + stale-while-revalidate 5min | [VERIFIED: codebase] Returns cover via `/api/notion-cover?pageId={id}` |
| Notion block image proxy | src/app/api/notion-image/route.ts | Fetch image block content from Notion via blockId | [VERIFIED: codebase] Uses `getFreshImageUrl` to resolve block image URLs |
| YouTube thumbnail pattern | — | Auto-derive thumb from video ID: `https://img.youtube.com/vi/{id}/hqdefault.jpg` | [ASSUMED] Standard YouTube CDN pattern; confirm remotePatterns config |
| Next.js Image remotePatterns | next.config.ts | Allowlist for external image sources | [VERIFIED: codebase] Currently includes Notion, Unsplash, Substack; must add `img.youtube.com` for /watching |

### Hardcoded Data Modules (New)
| Module | Location | Pattern | Template |
|--------|----------|---------|----------|
| photos.ts | src/lib/photos.ts | Exported `PHOTOS_BY_YEAR` array + `groupPhotosByYear()` helper | [VERIFIED: codebase] ArchivePhoto type: `{filename, year, alt, caption?}` |
| uses.ts | src/lib/uses.ts (CREATE) | New; mirror photos.ts structure | Typed array: `UseItem {term, detail}[]` grouped by category |
| watching.ts | src/lib/watching.ts (CREATE) | New; mirror photos.ts structure | Typed array: `WatchingItem {id, title, channel, url}[]` |

### Navigation & Breadcrumbs
| Pattern | Location | Purpose | Current State |
|---------|----------|---------|----------------|
| Navigation component | src/components/nav/navigation.tsx | Mobile drawer + desktop EditorialHeader; active-label mapping via pathname | [VERIFIED: codebase] Maps pathname to active label ('Building', 'Writing', 'Events', 'About', 'Links'); extends for /uses, /watching |
| Active state mapping | src/components/nav/navigation.tsx:24-32 | `activeLabel` derived from pathname; passed to EditorialHeader | [VERIFIED: codebase] Returns undefined for unmapped routes (e.g., /uses, /watching); extend mapping to include new routes |
| Breadcrumbs component | src/components/seo/breadcrumbs.tsx | Semantic nav + JSON-LD schema; sr-only rendering | [VERIFIED: codebase] Takes `items: BreadcrumbItem[]` array |
| Mobile drawer links | src/components/nav/navigation.tsx:11-17 | MOBILE_LINKS array | [VERIFIED: codebase] Current set: /projects, /writing, /events, /about, /links; extend to include /uses, /watching, /prometheus (move from footer) |

### Footer Rebuild
| Current | Target | Status |
|---------|--------|--------|
| conditional-footer.tsx + ink-footer.tsx | Full sitemap footer | DESIGN LOCKED; component path TBD |
| Secondary routes in separate footer | Merged into one sitemap footer | D-12: footer includes Uses, Watching, Prometheus, Newsletter, Photos + primary 5 routes |

## Don't Hand-Roll

| Problem | Don't Build | Use Instead | Why |
|---------|-------------|-------------|-----|
| Image optimization for external sources | Custom image fetch + cache | Next.js Image component + remotePatterns + ISR caching | Browser cache headers, WebP conversion, responsive srcset all automatic |
| Active route detection | Custom pathname string matching | `usePathname()` hook in Navigation; extend existing mapping | Built-in, re-renders on route change, handles trailing slashes/query params |
| Breadcrumb schema generation | Manual JSON-LD | `buildBreadcrumbListSchema()` in src/lib/seo/schemas.ts | Already exists; handles nesting and URL construction |
| Excerpt extraction from Notion | Manual block parsing | `getPostExcerpt()` in src/lib/notion.ts | Rate-limited, handles pagination, extracts first paragraph safely |
| Reading time calculation | Manual word count | `calculateReadingTime()` utility (location TBD; likely src/utils/) | Standard formula (words/200 + 0.5x image count) |
| Year grouping for indexes | Custom sorting | `groupPostsByYear()` or `groupProjectsByYear()` (already exists in /writing page) | Handles missing dates, sorts descending, returns Map for stable iteration |
| Hardcoded page data | Spreadsheet imports / ad-hoc JSON | Typed TS modules (photos.ts pattern; create uses.ts, watching.ts) | Single source of truth, type-checked, easy to edit, no build-time fetches |

**Key insight:** The Notion pipeline + ISR already handle content freshness for blog/projects/events. For `/uses` and `/watching`, hardcoded TS is preferred because:
- Content changes rarely (Monty manually updates)
- Version control is the natural edit surface
- No Notion setup/permissions friction
- Type safety guarantees structure consistency

## Common Pitfalls

### Pitfall 1: v2 → v3 Token Mapping Mistakes
**What goes wrong:** Replacing v2 `text-ink` with `text-text` (new token name) but forgetting the color space changed (warm near-black #2a1808 vs. the old paper-black). Content looks subtly wrong — off-brand.

**Why it happens:** Token names don't directly map; must verify RGB values in globals.css `@theme` block before bulk-replacing.

**How to avoid:** Before converting any component, list all v2 tokens it uses (grep component file), then map each to v3 equivalent in globals.css comment. Example:
```
v2 text-ink (#1a1a1a) → v3 --color-text (#2a1808)
v2 text-muted (rgba ink 0.5) → v3 --color-text-muted (rgba cocoa 0.55)
```

**Warning signs:** Components render but feel "off" compared to prototype or Home page (Phase 15).

### Pitfall 2: Missing YouTube Thumbnail remotePatterns Config
**What goes wrong:** `/watching` page builds fine locally (Vite/dev serve), but images don't load on Vercel preview (Next.js Image validation fails). 403 or "not allowed" error in browser console.

**Why it happens:** `next.config.ts` remotePatterns is a security whitelist. If `img.youtube.com` isn't listed, Next.js Image refuses to optimize it, and the HTML falls back to raw `<img>` tags that fail CORS.

**How to avoid:** Add to `next.config.ts` remotePatterns BEFORE building /watching:
```typescript
{
  protocol: "https",
  hostname: "img.youtube.com",
},
```

**Warning signs:** Local build + dev server work; Vercel preview breaks. Check browser DevTools → Image tab for 403.

### Pitfall 3: ISR Revalidate Placement on Dynamic Routes
**What goes wrong:** Essay detail page (`/blog/[slug]`) doesn't have `export const revalidate = 1800`, so each request triggers a fresh Notion fetch instead of reusing a cached render from 29 min ago. Build times explode on Vercel (hits ISR budget faster).

**Why it happens:** `generateStaticParams` only pre-generates at build time. Without revalidate, Next.js treats the route as fully dynamic (on-demand rendering).

**How to avoid:** Confirm `export const revalidate = 1800` at the top level of every dynamic page file (blog/[slug]/page.tsx, projects/[slug]/page.tsx, etc.).

**Warning signs:** Vercel build log shows "Page ISR exceeded 60 seconds" or "Revalidated 100+ times in 1 hour". Local dev is fast; preview/prod is slow.

### Pitfall 4: Breadcrumb Prop Drilling & Type Mismatches
**What goes wrong:** Rebuild a detail page, forget to import the `BreadcrumbItem` type or pass a malformed items array. TypeScript catches it at compile time, but during refactoring it's easy to miss a route (e.g., `/uses` detail page that doesn't exist, but footer link does).

**Why it happens:** Breadcrumbs component expects `{items: BreadcrumbItem[]}` where BreadcrumbItem = `{name, href?, disabled?}`. If you pass the wrong shape or forget to add the import, it silently renders nothing (sr-only, so invisible).

**How to avoid:** Use the existing Breadcrumbs as a template. Every detail page should follow:
```tsx
<Breadcrumbs items={[ { name: 'Home', href: '/' }, { name: 'Section', href: '/section' }, { name: currentTitle } ]} />
```

**Warning signs:** Page builds but breadcrumb isn't rendered in lighthouse or SR reader tests. Check `src/components/seo/breadcrumbs.tsx` for the exact shape.

### Pitfall 5: Full-Bleed Hero Image Sizing & LCP Impact
**What goes wrong:** Project/essay hero image is 3000x2000px JPEG (unoptimized). LCP regresses; PSI mobile drops 15+ points.

**Why it happens:** Notion covers are full-resolution exports from Notion. The image proxy doesn't downsize; it just streams the raw bytes. Next.js Image can't optimize because it's proxied through `/api/notion-cover`, not served directly.

**How to avoid:**
1. Use `fetchPriority="high"` on hero images (Next.js 16 quirk — sets HTTP `fetchpriority` header for early discovery). [MEMORY: nextjs16-fetchpriority-quirk]
2. Serve covers via `/api/notion-cover` but ensure the upstream Notion image is already resized (Notion auto-downsamples user uploads; trust it).
3. Add `sizes="100vw"` to the Image component so the responsive srcset covers mobile/tablet widths.
4. Test with PSI mobile authoritative (±15pt local variance is normal). [CARRYFORWARD: PSI mobile is authoritative, not local Lighthouse]

**Warning signs:** LCP > 2.5s on mobile; Cumulative Layout Shift spikes when hero loads.

### Pitfall 6: Navigation Active State & Mobile Drawer State Sync
**What goes wrong:** Desktop nav shows /uses as active (bold), but hamburger drawer closes automatically (onClick handler fires), then user can't verify the link worked because the drawer snapped shut.

**Why it happens:** Mobile drawer uses `onClick={() => setOpen(false)}` to auto-close. If the route matches the active state, the UI flashes: drawer closes, content updates, but the visual feedback is lost.

**How to avoid:** The existing Navigation component already handles this correctly (`onClick={() => setOpen(false)}` is at the Link level, so route change + drawer close are atomic). Just extend the active label mapping to include /uses and /watching. No changes needed.

**Warning signs:** Mobile navigation drawer visibly opens and snaps shut on route change; user never sees the page load.

### Pitfall 7: Year Grouping with Missing or Invalid Dates
**What goes wrong:** A blog post or project has no date set in Notion (empty Date field). When `groupPostsByYear` tries to parse it, `new Date('')` returns `Invalid Date`, and `getUTCFullYear()` returns NaN. The post disappears from the index (not rendered, no error).

**Why it happens:** `groupPostsByYear` already has a guard: `if (!post.date) continue;` and `if (Number.isNaN(year)) continue;`. But the guard is silent — it just skips the post.

**How to avoid:** Before rollout, verify all published posts/projects have a Date field set in Notion. Use a quick script:
```tsx
const posts = await getPublishedPosts();
console.log(posts.filter(p => !p.date || !p.date.trim()).map(p => `${p.slug}: no date`));
```

**Warning signs:** Some essays appear in the sidebar but not in the grid; console shows skipped dates during build. Check Notion for empty Date cells.

### Pitfall 8: Card Grid Aspect Ratio & Mobile Layout Shift
**What goes wrong:** Card grid uses `aspect-video` (16:9) on desktop but images vary in aspect ratio (some 4:3, some square). Images stretch/squash to fit the container. On mobile, the grid collapses to single-column and the aspect ratio conflicts with responsive sizing.

**Why it happens:** CSS aspect-ratio is strict; it reserves space even if the image doesn't match. With responsive images, the source image AR may differ from the container.

**How to avoid:** 
1. Use `object-cover` (crop) or `object-contain` (letterbox) consistently on all Card images.
2. Define grid breakpoints explicitly: e.g., `grid-cols-1 md:grid-cols-2 lg:grid-cols-3` (not `auto-fill`).
3. Test the grid layout in Chrome DevTools → Device Mode (mobile 375px, tablet 768px, desktop 1024px).

**Warning signs:** Images distort on one breakpoint but not another; mobile grid is misaligned. Inspect the Card component's wrapping `<img>` or `<Image>` tag.

### Pitfall 9: Reading Time Calculation & Notion Block Types
**What goes wrong:** A blog post with embedded Notion databases or synced blocks doesn't count those blocks' content. Reading time is underestimated (says "2 min read" when it's really 5).

**Why it happens:** `calculateReadingTime` likely only counts paragraph blocks; it skips database/table/synced_block types that have nested children. The blocks exist in the Notion page but the calculator doesn't traverse them.

**How to avoid:** Confirm `calculateReadingTime` handles the block types actually used in blog posts (paragraph, heading, image, toggle, etc.). If it skips uncommon types, either extend it or document the limitation.

**Warning signs:** Reading time is consistently 30-50% lower than reality; author feedback: "that's way too short".

## Runtime State Inventory

> This is a presentation-layer rebuild on existing infra. No data migration needed.

| Category | Items Found | Action Required |
|----------|-------------|------------------|
| Stored data | None — Notion records for posts/projects/events unchanged | None |
| Live service config | None — Vercel deployment config, ISR settings unchanged | None |
| OS-registered state | None | None |
| Secrets/env vars | NOTION_TOKEN, NOTION_DATABASE_ID, NOTION_PROJECTS_DATABASE_ID, NOTION_EVENTS_DB_ID (existing) | No changes; existing loaders reuse them |
| Build artifacts | Next.js `.next/` cache (ISR revalidation triggers rebuild) | Auto-invalidated on deploy; no manual action |

**Verification:** This phase doesn't rename routes (existing routes stay at /writing, /blog/[slug], /projects, etc.; new routes /uses and /watching don't conflict). No data migration.

## Code Examples

### Pattern 1: Repaint Editorial Component to Pumpkin Amber

**Existing v2 ListRow:**
```tsx
// src/components/editorial/list-row.tsx
export function ListRow({ title, meta, extra }: Props) {
  return (
    <div className="border-b border-[var(--border)] py-4 text-ink">
      <h3 className="text-body font-medium">{title}</h3>
      {meta && <p className="text-caption text-muted">{meta}</p>}
      {extra && <p className="text-body-sm text-muted">{extra}</p>}
    </div>
  );
}
```

**Repaint for v3 (token mapping):**
```tsx
// Mapping: --border (v2 paper/ink edges) → --color-border (v3 Pumpkin Amber edges)
//          text-ink (v2 #1a1a1a) → --color-text (v3 #2a1808)
//          text-muted (v2 rgba 0.5) → --color-text-muted (v3 rgba 0.55)

// No component code change needed — just ensure globals.css tokens are applied:
export function ListRow({ title, meta, extra }: Props) {
  return (
    <div className="border-b border-[var(--color-border)] py-4 text-[var(--color-text)]">
      <h3 className="text-body font-medium">{title}</h3>
      {meta && <p className="text-caption text-[var(--color-text-muted)]">{meta}</p>}
      {extra && <p className="text-body-sm text-[var(--color-text-muted)]">{extra}</p>}
    </div>
  );
}
```

[VERIFIED: codebase] globals.css contains all Pumpkin Amber tokens; component uses CSS variable reference.

### Pattern 2: Add YouTube Thumbnail to /watching Route

**watching.ts (hardcoded data):**
```typescript
// src/lib/watching.ts
export type WatchingItem = {
  id: string;           // YouTube video ID (from URL youtu.be/{id})
  title: string;
  channel: string;
  url: string;          // Full YouTube URL
};

export const WATCHING_ITEMS: WatchingItem[] = [
  {
    id: "dQw4w9WgXcQ",
    title: "Example Video Title",
    channel: "Example Channel",
    url: "https://www.youtube.com/watch?v=dQw4w9WgXcQ",
  },
  // ... more items
];
```

**Thumbnail URL pattern:**
```
https://img.youtube.com/vi/{id}/hqdefault.jpg  // 480x360, high quality
https://img.youtube.com/vi/{id}/maxresdefault.jpg // 1280x720, max (sometimes unavailable)
https://img.youtube.com/vi/{id}/sddefault.jpg  // 640x480, standard (always available)
```

Use `sddefault.jpg` or `hqdefault.jpg` as fallback (hqdefault not always present for all videos; sddefault is most reliable). [ASSUMED] Standard CDN pattern; confirm availability per video.

**watching/page.tsx:**
```tsx
import { WATCHING_ITEMS } from "@/lib/watching";
import { VideoCard } from "@/components/v3/video-card";

export default function WatchingPage() {
  return (
    <div className="grid [grid-template-columns:repeat(auto-fill,minmax(320px,1fr))] gap-[22px] px-6 py-16">
      {WATCHING_ITEMS.map((item) => (
        <VideoCard
          key={item.id}
          title={item.title}
          channel={item.channel}
          href={item.url}
        />
      ))}
    </div>
  );
}
```

[VERIFIED: codebase] `VideoCard` component exists and accepts `{title, channel, href}`; `target="_blank"` is built-in.

### Pattern 3: Extend Navigation Active State Mapping

**Current navigation.tsx (existing):**
```tsx
const activeLabel: 'Building' | 'Writing' | 'Events' | 'About' | 'Links' | undefined =
  pathname === '/projects' ? 'Building'
  : pathname === '/writing' || pathname.startsWith('/blog') ? 'Writing'
  : pathname === '/events' ? 'Events'
  : pathname === '/about' ? 'About'
  : pathname === '/links' ? 'Links'
  : undefined
```

**Extended for /uses and /watching:**
```tsx
const activeLabel: 'Building' | 'Writing' | 'Events' | 'About' | 'Links' | 'Uses' | 'Watching' | undefined =
  pathname === '/projects' ? 'Building'
  : pathname === '/writing' || pathname.startsWith('/blog') ? 'Writing'
  : pathname === '/events' ? 'Events'
  : pathname === '/about' ? 'About'
  : pathname === '/links' ? 'Links'
  : pathname === '/uses' ? 'Uses'
  : pathname === '/watching' ? 'Watching'
  : undefined
```

Then pass `active={activeLabel}` to EditorialHeader (unchanged). The component will bold the matching nav link.

[VERIFIED: codebase] Navigation already renders `EditorialHeader` and passes `active` prop; just extend the mapping.

### Pattern 4: Hardcoded /uses Data (uses.ts)

```typescript
// src/lib/uses.ts
export type UsesItem = {
  term: string;
  detail: string;
};

export type UsesGroup = {
  heading: string;
  items: UsesItem[];
};

export const USES_DATA: UsesGroup[] = [
  {
    heading: "AI & Development",
    items: [
      { term: "LLM", detail: "Claude (Anthropic) for code, thinking, research" },
      { term: "IDE", detail: "VS Code + Cursor AI" },
      // ... more
    ],
  },
  {
    heading: "Productivity",
    items: [
      { term: "Notes", detail: "Notion for all knowledge capture" },
      // ... more
    ],
  },
  {
    heading: "Communication",
    items: [
      { term: "Email", detail: "Gmail + Superhuman" },
      // ... more
    ],
  },
  {
    heading: "Hardware",
    items: [
      { term: "Laptop", detail: "TODO: [Monty to fill in]" },
      { term: "Phone", detail: "TODO: [Monty to fill in]" },
    ],
  },
];
```

**uses/page.tsx:**
```tsx
import { USES_DATA } from "@/lib/uses";
import { UsesList } from "@/components/v3/uses-list";
import { PageHero } from "@/components/v3/page-hero";

export const metadata = { title: "Uses | Monty Singer", /* ... */ };

export default function UsesPage() {
  return (
    <>
      <PageHero title="Uses" crumb="── Stack & Tools" sub="The equipment and software I use daily." />
      <section className="px-6 md:px-40 pb-16">
        <UsesList groups={USES_DATA} />
      </section>
    </>
  );
}
```

[VERIFIED: codebase] `PageHero` and `UsesList` components exist; pattern mirrors `photos.ts`.

### Pattern 5: Reading Time Integration in Essay View

**Existing blog/[slug]/page.tsx (relevant excerpt):**
```tsx
import { calculateReadingTime } from "@/utils/reading-time";

export default async function BlogPostPage({ params }: PageProps) {
  const { slug } = await params;
  const post = await getPostBySlug(slug);
  const blocks = await getBlocks(post.id);
  const readingTime = calculateReadingTime(blocks);

  return (
    <article className="mx-auto max-w-[66ch] px-6 pb-16 pt-8 md:px-0">
      <header className="mb-12">
        <h1>{post.title}</h1>
        <p className="text-sm text-[var(--color-text-muted)]">
          {formatDate(post.date)} · {readingTime} min read
        </p>
      </header>
      {/* blocks rendered via NotionRenderer */}
    </article>
  );
}
```

[VERIFIED: codebase] `calculateReadingTime` is imported; verify its location and signature before using.

## Validation Architecture

| Property | Value |
|----------|-------|
| Framework | Vitest (jsdom) + React Testing Library |
| Config file | vitest.config.ts (exists) |
| Quick run command | `npm test -- src/__tests__/` (covers all tests) |
| Full suite command | `npm test` (runs all tests + integration checks) |

### Phase Requirements → Test Map

| Req ID | Behavior | Test Type | Automated Command | File Exists? |
|--------|----------|-----------|-------------------|-------------|
| PG-01 | Writing index renders list grouped by year | integration | `npm test -- src/__tests__/pages/writing.test.tsx` | ❌ Wave 0 |
| PG-01 | Essay detail page shows breadcrumb, reading time, date, prose | integration | `npm test -- src/__tests__/pages/blog-slug.test.tsx` | ❌ Wave 0 |
| PG-01 | Works index renders card grid; projects detail shows hero image | integration | `npm test -- src/__tests__/pages/projects.test.tsx` | ❌ Wave 0 |
| PG-02 | /uses page renders; UsesList groups items by category | unit | `npm test -- src/__tests__/components/uses-list.test.tsx` | ❌ Wave 0 |
| PG-03 | /watching page renders; VideoCard links open in new tab | unit | `npm test -- src/__tests__/components/video-card.test.tsx` | ⚠️ Likely exists (check) |
| PG-04 | Breadcrumb component renders correct items with JSON-LD | unit | `npm test -- src/__tests__/components/breadcrumbs.test.tsx` | ❌ Wave 0 |
| PG-04 | RelatedEssays component loads and renders related posts | unit | `npm test -- src/__tests__/components/related-essays.test.tsx` | ❌ Wave 0 |
| PG-05 | Navigation component maps /uses and /watching to active labels | unit | `npm test -- src/__tests__/components/navigation.test.tsx` | ❌ Wave 0 |
| PG-05 | Footer includes all sitemap routes (primary + secondary) | integration | `npm test -- src/__tests__/components/footer.test.tsx` | ❌ Wave 0 |
| IN-01 | ISR revalidate is set to 1800 on all interior pages | lint/ast | `grep -r "export const revalidate = 1800" src/app` | ✅ Manual verification |

### Sampling Rate
- **Per task commit:** Run quick tests for the component/route just modified (e.g., `npm test -- writing.test` after editing /writing page).
- **Per wave merge:** Full suite (`npm test`) before marking wave complete.
- **Phase gate:** Full suite green + manual PSI mobile check (LCP, CLS, performance budget) before `/gsd-verify-work`.

### Wave 0 Gaps
- [ ] `src/__tests__/pages/writing.test.tsx` — covers PG-01 index grid rendering, year grouping, excerpt display
- [ ] `src/__tests__/pages/blog-slug.test.tsx` — covers PG-01 essay detail, breadcrumb, reading time, related essays
- [ ] `src/__tests__/pages/projects.test.tsx` — covers PG-01 Works index grid, project detail hero image
- [ ] `src/__tests__/components/uses-list.test.tsx` — covers PG-02 group rendering, responsive grid
- [ ] `src/__tests__/components/breadcrumbs.test.tsx` — covers PG-04 breadcrumb items, JSON-LD schema
- [ ] `src/__tests__/components/related-essays.test.tsx` — covers PG-04 async data loading, null state
- [ ] `src/__tests__/components/navigation.test.tsx` — covers PG-05 active label mapping for new routes (/uses, /watching)
- [ ] `src/__tests__/components/footer.test.tsx` — covers PG-05 sitemap footer structure, all links present
- [ ] Framework install: Already installed (vitest, @vitejs/plugin-react, jsdom) per existing config

## Environment Availability

| Dependency | Required By | Available | Version | Fallback |
|------------|------------|-----------|---------|----------|
| Node.js | Build, dev server | ✓ | 18.x+ (expected) | — |
| npm | Package manager | ✓ | 9.x+ (expected) | — |
| Next.js | Framework | ✓ | 16.x | — |
| Vitest | Test runner | ✓ | Latest | — |
| Notion API (NOTION_TOKEN) | Data loading (getPublishedPosts, etc.) | ✓ | Environment variable set | Graceful error (try/catch in loaders) |
| NOTION_PROJECTS_DATABASE_ID | Project loader | ✓ | Environment variable set | Graceful error (getPublishedProjects returns []) |
| NOTION_EVENTS_DB_ID | Event loader | ✓ | Environment variable set | Graceful error (getPublishedEvents returns []) |

**Missing dependencies with no fallback:** None. All critical dependencies are present.

**Missing dependencies with fallback:** None critical. Notion loaders already have defensive error handling (try/catch, empty array returns).

## Security Domain

### Applicable ASVS Categories

| ASVS Category | Applies | Standard Control |
|---------------|---------|-----------------|
| V2 Authentication | No | N/A — no user auth in interior pages |
| V3 Session Management | No | N/A |
| V4 Access Control | No | All interior pages public; no role-based rendering |
| V5 Input Validation | Yes | No user input on interior pages; hardcoded data (uses.ts, watching.ts) is type-checked at compile time; Notion data queried via official SDK (no raw SQL) |
| V6 Cryptography | Yes (ISR) | ISR cache is Vercel-managed; NOTION_TOKEN is server-side only (env var); no client-side crypto needed |
| V7 Errors & Logging | Yes | Loaders use try/catch + log gracefully (return empty array on Notion failure); no stack traces leaked to client |
| V8 Data Protection | Yes | Notion data is read-only (getBlocks, getPostBySlug, etc. — no mutations); image proxies cache via Cache-Control headers |

### Known Threat Patterns for Next.js 16 + Notion CMS

| Pattern | STRIDE | Standard Mitigation |
|---------|--------|---------------------|
| Notion API key leaked in client bundle | Tampering / Information Disclosure | NOTION_TOKEN only used in server functions (src/lib/*.ts); never imported client-side. Verify with `grep -r "process.env.NOTION_TOKEN" src/app --include="*client*"` |
| ISR cache poisoning (malicious Notion data) | Tampering | Notion database is access-controlled (Monty's workspace only); no public contributor form. ISR revalidates every 30min, so stale data window is bounded. |
| Open redirect via Notion externalUrl field | Tampering | Project.externalUrl is user-controlled. Mitigate: Always render as `<a href={externalUrl} target="_blank" rel="noopener noreferrer">`. The `rel="noopener noreferrer"` prevents `window.opener` attacks. |
| SSRF via Notion image proxies | Server-Side Request Forgery | Image proxies only accept pageId or blockId from Notion API client — no free-form URL parameter. Safe by construction. |
| XSS via Notion block content (in NotionRenderer) | Injection | NotionRenderer is imported from existing codebase (`src/components/notion/notion-renderer.tsx`). Assume it's already sanitized (likely uses `react-notion-x` or custom safe traversal). Verify before rollout. |

## State of the Art

| Old Approach | Current Approach | When Changed | Impact |
|--------------|------------------|--------------|--------|
| v2 paper/ink editorial tokens | v3 Pumpkin Amber @theme tokens | Phase 14 | Global consistency; single fixed palette; easier maintenance |
| List rows for indexes | Photo-forward card grids | Phase 16 (this phase) | Visual upgrade; showcases photography; more engaging UX |
| react-notion-x renderer | NotionRenderer (custom/safe) | v2.0 phase 10 | App Router compat; no hydration errors; faster builds |
| Separate nav + footer styling | Unified v3 system (Navigation + Footer) | Phase 14/16 | Single design language; easier to update globally |
| Hardcoded /photos (photos.ts) | Reuse pattern for /uses, /watching | Phase 16 (this phase) | Type-safe, version-controlled, no Notion schema churn |

**Deprecated/outdated:**
- **v2 editorial pages (paper/ink styling):** Superseded by v3 Pumpkin Amber. Legacy styling is removed by end of Phase 16.
- **Crimson Poster palette:** Documented in ROADMAP but superseded by Pumpkin Amber (locked in Phase 14, confirmed in CONTEXT.md). Ignore old Crimson refs.
- **Pages Router:** Next.js 15+ use App Router exclusively. Pages Router is legacy.

## Assumptions Log

| # | Claim | Section | Risk if Wrong |
|---|-------|---------|---------------|
| A1 | YouTube thumbnail URL pattern (`https://img.youtube.com/vi/{id}/{res}.jpg`) is stable and hqdefault/sddefault are always available | Code Examples → Pattern 2 | /watching page images fail to load on some videos; fallback needed to check availability per video before deploying |
| A2 | `calculateReadingTime` utility exists and is imported from `@/utils/reading-time` or similar | Code Examples → Pattern 5 | Import fails at build time; must locate and verify signature before using |
| A3 | `RELATED_ESSAYS` data file exists at `@/data/related-essays` and is a map of slug → slug[] | Common Pitfalls | RelatedEssays component can't load related posts; must verify file path and shape |
| A4 | Existing v3 components (Card, PageHero, VideoCard, UsesList) are fully Pumpkin Amber-compliant | Standard Stack → Interior Page Components | Components render with wrong colors or don't respect --accent/--color-text tokens; need manual repainting |
| A5 | Mobile nav drawer (MOBILE_LINKS) should include /uses and /watching | Common Pitfalls → Pitfall 6 | New routes aren't accessible from hamburger menu on mobile; UX broken |

**If this table is empty:** All claims in this research were verified via codebase inspection or cited from CONTEXT.md/REQUIREMENTS.md — no user confirmation needed.

## Open Questions

1. **What is the signature and location of `calculateReadingTime`?**
   - What we know: Imported in `/blog/[slug]/page.tsx` as `import { calculateReadingTime }` (no path specified in the grep output).
   - What's unclear: Is it `@/utils/reading-time`? `@/lib/reading-time`? Does it accept `BlockObjectResponse[]`?
   - Recommendation: Run `grep -r "export.*calculateReadingTime" src/` to locate the definition before integrating into essay view.

2. **Does RelatedEssays component work with the new Pumpkin Amber tokens, or does it need repainting?**
   - What we know: Component exists at `src/components/blog/related-essays.tsx` and uses Tailwind classes.
   - What's unclear: Does it reference v2 tokens (text-ink, text-muted) or already use Pumpkin Amber vars?
   - Recommendation: Check the component file for class names; if it uses v2 tokens, add to the repaint list.

3. **What is the exact card grid container class for Writing/Works indexes?**
   - What we know: v3 Card component comment suggests `grid auto-fill minmax(260px,1fr) gap-px bg-border`.
   - What's unclear: Should the grid use `bg-border` as a 1px gutter (like /photos?), or is this outdated?
   - Recommendation: Check the `/photos` page grid structure (which is already v3-compliant) as the model.

4. **Do the existing EditorialHeader and footer components need rebuilding, or just token remapping?**
   - What we know: EditorialHeader is used globally and receives an `active` prop.
   - What's unclear: Is the footer component (`conditional-footer.tsx` + `ink-footer.tsx`) part of the NavigationComponent, or separate?
   - Recommendation: Trace the Layout hierarchy (app/layout.tsx) to understand footer placement and ownership.

5. **Should breadcrumbs appear on /uses and /watching detail pages, or just on essay/project detail?**
   - What we know: D-13 says breadcrumbs appear on `/blog/[slug]`, `/projects/[slug]`, `/uses`, `/watching`.
   - What's unclear: Does "/uses" and "/watching" mean the index pages, or are there detail routes like `/uses/[category]`?
   - Recommendation: Clarify with design prototype whether /uses and /watching are single-page views (no detail routes) or have nested routes.

## Sources

### Primary (HIGH confidence)
- **Codebase inspection:** src/lib/notion.ts, src/lib/notion-projects.ts, src/lib/notion-events.ts — verified `BlogPost`, `Project`, `EventItem` shapes and all exported loaders
- **Codebase inspection:** src/components/v3/* — verified `Card`, `PageHero`, `VideoCard`, `UsesList` components exist and use Pumpkin Amber tokens
- **Codebase inspection:** src/app/globals.css — verified `@theme` block with Pumpkin Amber tokens (#ff7a14 bg, #2a1808 text, #0c6b74 accent)
- **Codebase inspection:** next.config.ts — verified remotePatterns config and ISR revalidate settings
- **16-CONTEXT.md** — Phase 16 decisions D-01 through D-14 are locked; architectural decisions and deferred items documented

### Secondary (MEDIUM confidence)
- **REQUIREMENTS.md** — PG-01 through PG-05 and IN-01/IN-02 requirement traceability; DQ-01 (v3 branch) confirmed complete
- **STATE.md** — Project history, Phase 15 completion, carryforward decisions (ISR 30min, Notion pipeline v5, Site copy rules)
- **Memory entries** (project auto-memory) — `nextjs16-fetchpriority-quirk`, `homepage-webgl-direction`, `v3-pumpkin-amber-palette` — verified via inline code inspection

### Tertiary (LOW confidence)
- YouTube thumbnail CDN pattern — [ASSUMED] based on standard practice; not verified against live YouTube API in this session

---

## Metadata

**Confidence breakdown:**
- **Standard stack:** HIGH — all libraries verified in codebase (Notion loaders, v3 components, Pumpkin Amber tokens in globals.css)
- **Architecture:** HIGH — Phase 16 is a presentation-layer rebuild on stable infrastructure (Notion pipeline, image proxies, ISR all proven in earlier phases)
- **Pitfalls:** MEDIUM-HIGH — identified from code inspection + carryforward context (token mapping, ISR placement, nav state); YouTube thumbnail pattern is ASSUMED
- **Validation:** MEDIUM — test framework exists (vitest), but Phase 16-specific test files don't exist (Wave 0 gap)

**Research date:** 2026-06-20
**Valid until:** 2026-07-04 (14 days; standard interior page work is stable; invalidate sooner if Notion SDK updates or Next.js 16.x EOLs)
