# Architecture Research

**Domain:** Personal website with Notion CMS + self-hosted analytics
**Researched:** 2026-03-31
**Confidence:** HIGH

---

## Standard Architecture

### System Overview

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                            AUTHORING / ADMIN                                │
│                                                                             │
│   ┌──────────────┐       ┌─────────────────────────────┐                  │
│   │  Notion CMS  │──────▶│  Notion API (official SDK)  │                  │
│   │  (content)   │       │  notion-client / @notionhq  │                  │
│   └──────────────┘       └───────────────┬─────────────┘                  │
│                                          │                                  │
└──────────────────────────────────────────┼──────────────────────────────────┘
                                           │ API fetch (build-time + revalidate)
┌──────────────────────────────────────────▼──────────────────────────────────┐
│                            NEXT.JS APP (Vercel)                             │
│                                                                             │
│   ┌──────────────────────────────────────────────────────────────────────┐ │
│   │  App Router (src/app/)                                               │ │
│   │                                                                      │ │
│   │  /          → Home (ISR, revalidate: 3600)                          │ │
│   │  /blog      → Blog index (ISR, revalidate: 3600)                   │ │
│   │  /blog/[slug] → Blog post (ISR, revalidate: 3600 + on-demand)      │ │
│   │  /projects  → Portfolio (ISR, revalidate: 3600)                    │ │
│   │  /about     → Resume/bio (ISR, revalidate: 86400)                  │ │
│   │  /links     → Social hub (static, revalidate: 86400)               │ │
│   └──────────────────────────────────────────────────────────────────────┘ │
│                                                                             │
│   ┌───────────────────┐   ┌──────────────────┐   ┌──────────────────────┐ │
│   │  Server Components│   │ Client Components │   │  API Routes          │ │
│   │  (data fetch,     │   │  (animations,     │   │  /api/revalidate     │ │
│   │   layout, SEO)    │   │   interactivity,  │   │  /api/analytics      │ │
│   └───────────────────┘   │   theme toggle)   │   └──────────────────────┘ │
│                            └──────────────────┘                             │
│                                                                             │
│   ┌──────────────────────────────────────────────────────────────────────┐ │
│   │  Image Optimization Pipeline                                         │ │
│   │  Notion image URL → next/image → Vercel Edge → cached/optimized CDN │ │
│   └──────────────────────────────────────────────────────────────────────┘ │
└──────────────────────────────────────────────────────────────────────────────┘
           │ page load JS          │ analytics events
           ▼                       ▼
┌──────────────────┐    ┌──────────────────────────────────────┐
│   End User /     │    │  Umami Analytics (self-hosted)        │
│   Browser        │    │  Railway / Render / Fly.io (free)    │
│                  │    │  Postgres DB (analytics data)         │
└──────────────────┘    └──────────────────────────────────────┘
```

---

### Component Responsibilities

| Component | Responsibility | Typical Implementation |
|-----------|---------------|------------------------|
| Notion CMS | Content authoring for blog posts, projects, about page | Notion databases with properties (title, slug, status, date, tags, cover) |
| `@notionhq/client` | Official Notion SDK — fetches pages, blocks, databases | Server-only module; never imported in client components |
| `notion-to-md` | Converts Notion block tree → Markdown/MDX | Used in build pipeline; handles rich text, embeds, code blocks |
| Next.js App Router | Routing, RSC, ISR, API routes, image optimization | `src/app/` directory; Server Components by default |
| Vercel Edge Network | CDN caching of statically generated pages + images | Automatic with Vercel deploy; `revalidate` controls TTL |
| Umami | Self-hosted analytics — real-time visitors, sources, geo, devices | Deployed to Railway/Render free tier; Postgres backend; script tag injection |
| `next/image` | Image optimization — resize, WebP/AVIF, lazy load, blur placeholder | Wraps all Notion cover images and project screenshots |
| Framer Motion | Animation library — page transitions, scroll triggers, interactive elements | Client Components only; use `"use client"` boundary carefully |
| `next-themes` | Light/dark mode — SSR-safe, no flash, localStorage persistence | Wrap root layout; provides `useTheme()` hook |
| Tailwind CSS | Utility-first styling — responsive, dark mode via `dark:` variants | `tailwind.config.ts` with custom design tokens |
| On-demand revalidation webhook | Triggers ISR refresh when Notion content changes | Notion webhook or manual trigger → `POST /api/revalidate` → `revalidatePath()` |

---

## Recommended Project Structure

```
src/
├── app/
│   ├── layout.tsx               # Root layout: ThemeProvider, Analytics script
│   ├── page.tsx                 # Home — hero, featured work, highlights
│   ├── globals.css              # Tailwind base + custom CSS vars for theming
│   │
│   ├── blog/
│   │   ├── page.tsx             # Blog index — list from Notion DB
│   │   └── [slug]/
│   │       └── page.tsx         # Blog post — ISR, Notion blocks rendered
│   │
│   ├── projects/
│   │   ├── page.tsx             # Portfolio grid
│   │   └── [slug]/
│   │       └── page.tsx         # Project detail
│   │
│   ├── about/
│   │   └── page.tsx             # Bio, experience, skills — mostly static
│   │
│   ├── links/
│   │   └── page.tsx             # Social hub / link-in-bio style
│   │
│   └── api/
│       ├── revalidate/
│       │   └── route.ts         # On-demand ISR: validates secret, calls revalidatePath
│       └── og/
│           └── route.tsx        # Dynamic OG image generation (optional)
│
├── components/
│   ├── layout/
│   │   ├── Header.tsx           # Nav — sticky, theme toggle, mobile menu
│   │   ├── Footer.tsx
│   │   └── PageTransition.tsx   # Framer Motion layout animation wrapper
│   │
│   ├── notion/
│   │   ├── NotionRenderer.tsx   # Maps Notion block types → React components
│   │   ├── RichText.tsx         # Handles bold/italic/links/code in text
│   │   └── NotionImage.tsx      # next/image wrapper for Notion-hosted images
│   │
│   ├── blog/
│   │   ├── PostCard.tsx
│   │   └── PostBody.tsx
│   │
│   ├── projects/
│   │   ├── ProjectCard.tsx
│   │   └── ProjectGrid.tsx
│   │
│   ├── animations/
│   │   ├── FadeIn.tsx           # Scroll-triggered fade — reusable wrapper
│   │   ├── StaggerChildren.tsx  # Staggers list item entrances
│   │   └── HoverCard.tsx        # Interactive hover effects
│   │
│   └── ui/
│       ├── ThemeToggle.tsx
│       ├── Tag.tsx
│       └── ExternalLink.tsx
│
├── lib/
│   ├── notion/
│   │   ├── client.ts            # Notion SDK singleton (server-only)
│   │   ├── api.ts               # getDatabase(), getPage(), getBlocks()
│   │   ├── transforms.ts        # Notion response → clean typed DTOs
│   │   └── types.ts             # NotionPost, NotionProject, etc.
│   │
│   ├── analytics.ts             # Umami event helpers (pageview, custom events)
│   └── utils.ts                 # slugify, formatDate, cn() (clsx + twMerge)
│
├── types/
│   └── index.ts                 # Shared TypeScript interfaces
│
└── styles/
    └── animations.css           # CSS keyframes for non-JS animations
```

---

## Architectural Patterns

### Pattern 1: ISR for Notion Content

**Problem:** Notion API is slow (~200-800ms per call). Can't call it on every request. Static generation is fast but stale. Streaming SSR adds complexity.

**Solution:** Incremental Static Regeneration (ISR) with on-demand revalidation as the escape hatch.

```
Build time:  generateStaticParams() fetches all slugs → pages pre-built
Runtime:     Stale-while-revalidate: serve cached page instantly,
             regenerate in background after revalidate interval expires
On publish:  Notion webhook → POST /api/revalidate?secret=XYZ&path=/blog/slug
             → revalidatePath('/blog/slug') → next visit gets fresh page
```

**Implementation pattern for a blog post route:**
```ts
// app/blog/[slug]/page.tsx
export const revalidate = 3600  // fallback: regenerate after 1 hour max

export async function generateStaticParams() {
  const posts = await getPublishedPosts()  // server-only, build time
  return posts.map(p => ({ slug: p.slug }))
}

export default async function BlogPost({ params }) {
  const post = await getPostBySlug(params.slug)  // cached via Next.js fetch cache
  // ...
}
```

**Notion API caching layer (`lib/notion/api.ts`):**
All Notion fetch calls should use Next.js `fetch()` with `next: { revalidate }` or `unstable_cache()` — this deduplicates requests within a render and caches at the data layer, independent of page-level ISR.

**Revalidation hierarchy:**
- `revalidate: 3600` (1h) on most pages — safety net if webhook misses
- `revalidate: 86400` (24h) on slow-changing pages like /about
- On-demand `revalidatePath()` via webhook for instant updates when Monty publishes

---

### Pattern 2: Analytics Event Pipeline

**Problem:** Need real-time visitor data, traffic sources, geo, devices — at zero recurring cost.

**Solution:** Self-hosted Umami on a free PaaS tier (Railway or Render), injected via Next.js Script component.

```
Browser → Umami tracker script (umami.is/script.js self-hosted)
        → POST /api/collect on Umami server
        → Postgres DB (analytics events)
        → Umami dashboard UI (real-time queries)
```

**Integration in Next.js (root layout):**
```tsx
// app/layout.tsx
import Script from 'next/script'

<Script
  src="https://your-umami.railway.app/script.js"
  data-website-id="YOUR_WEBSITE_ID"
  strategy="afterInteractive"   // don't block paint
/>
```

**Custom events for richer data:**
```ts
// lib/analytics.ts — thin wrapper
export const track = (event: string, data?: Record<string, string>) => {
  if (typeof window !== 'undefined' && window.umami) {
    window.umami.track(event, data)
  }
}

// Usage in components:
track('project-click', { project: 'fintech-app' })
track('blog-read', { post: slug, readTime: '3min' })
```

**Hosting Umami:**
- Railway free tier: 500 hours/month, $5 credit — sufficient for personal site traffic
- Render free tier: spins down after inactivity (15min delay on first daily hit) — acceptable
- Both use Postgres free tier (Railway: 100MB, Supabase free: 500MB)

---

### Pattern 3: Animation Architecture

**Problem:** Framer Motion bundle is ~30KB gzipped. Overusing client components destroys the RSC performance gains. Animation jank kills perceived quality.

**Solution:** Strict separation between Server Components (data, layout, SEO) and Client Components (animation, interactivity). Use CSS animations for simple cases; reserve Framer Motion for complex sequences.

**The boundary rule:**
```
Server Component (default)          Client Component ("use client")
─────────────────────────────       ─────────────────────────────────
Page shells                         PageTransition.tsx
Notion data fetching                FadeIn.tsx / StaggerChildren.tsx
SEO metadata                        ThemeToggle.tsx
Static text content                 Interactive project cards
Image layout                        Hover effects
                                    Mobile nav menu
```

**Scroll-triggered animations — the right way:**
```tsx
// components/animations/FadeIn.tsx
"use client"
import { motion } from 'framer-motion'

export function FadeIn({ children, delay = 0 }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-50px" }}  // once:true = don't re-fire
      transition={{ duration: 0.5, delay }}
    >
      {children}
    </motion.div>
  )
}
```

**Page transitions:**
Use Framer Motion `AnimatePresence` at the layout level. Wrap with `"use client"` in a thin `PageTransition` component that only receives `children` — keep the actual page components as Server Components.

**Performance checklist:**
- `viewport={{ once: true }}` on all scroll animations — no re-triggering on scroll-up
- `will-change: transform` only during animation (Framer handles this)
- `transform` and `opacity` only — never animate layout properties (width, height, padding)
- Lazy-load Framer Motion for non-critical pages via `dynamic(() => import(...), { ssr: false })`
- Prefer CSS `@keyframes` for looping/ambient animations (no JS overhead)

---

## Data Flow

### Content Flow (Notion → Site)

```
1. AUTHORING
   Monty writes/edits in Notion
   └─ Notion DB with properties: Title, Slug, Status, PublishedAt, Tags, Cover

2. TRIGGER
   a. Automatic: ISR revalidate interval expires (1h)
   b. Manual: Monty hits a "Deploy" button → POST /api/revalidate
   c. Webhook: Notion automation → POST /api/revalidate (advanced, optional)

3. DATA FETCH (server, build-time or ISR background)
   getPublishedPosts()
   └─ notion.databases.query({ database_id, filter: { Status: 'Published' } })
   └─ Returns: list of page metadata (title, slug, date, tags, cover image URL)

   getPostBlocks(pageId)
   └─ notion.blocks.children.list({ block_id: pageId })
   └─ Returns: block tree (paragraphs, headings, images, code, callouts, etc.)

4. TRANSFORM
   Notion API response → clean TypeScript DTOs
   └─ Extract rich text arrays → plain strings
   └─ Extract cover image URL → prepare for next/image
   └─ Map block types → component-friendly structures

5. RENDER
   Server Component receives clean DTOs
   └─ NotionRenderer maps block.type → React component
   └─ next/image handles all images (optimization, lazy load, blur placeholder)
   └─ Page is serialized to HTML + RSC payload

6. CACHE
   Vercel Edge caches the rendered page
   └─ Served at CDN speed globally until revalidated
```

### Analytics Flow (Visitor → Dashboard)

```
1. VISIT
   Browser loads page → Umami script tag executes (afterInteractive)
   └─ Umami auto-tracks: URL, referrer, user-agent, screen size, country (IP-based)

2. EVENT
   Browser → POST https://umami.your-domain.com/api/collect
   └─ Payload: { type: 'pageview', url, referrer, ... }
   └─ No cookies set (GDPR-friendly by default)

3. STORE
   Umami server → Postgres
   └─ Inserts into: sessions, pageviews tables
   └─ Aggregations run at query time in the dashboard

4. QUERY
   Monty opens Umami dashboard
   └─ Real-time: active visitors (30-second polling)
   └─ Reports: top pages, referrers, devices, geo, custom events
   └─ Retention: all data owned by Monty, no vendor lock-in
```

---

## Scaling Considerations

- **Vercel free tier limits:** 100GB bandwidth/month, 6000 build minutes/month. A personal site will never hit these. ISR only regenerates changed pages, not the whole site.
- **Notion API rate limits:** 3 requests/second. Not a concern for a personal site with ISR — API is only called during revalidation, not on every request.
- **Umami free tier:** Railway/Render free tiers handle thousands of events/day easily. Postgres 100MB on Railway = ~2M pageview rows before needing to prune old data.
- **Image delivery:** Notion-hosted images have expiring signed URLs (1 hour). This is the key gotcha — see Anti-Patterns below. Solution: re-fetch or proxy via Vercel's image optimization edge.
- **Cold starts:** Vercel Serverless Functions (API routes) have cold starts on free tier. Keep `/api/revalidate` lean. Umami on Render free tier sleeps — acceptable since it auto-wakes on first hit.

---

## Anti-Patterns

| Anti-Pattern | Why It's Bad | Correct Approach |
|-------------|-------------|-----------------|
| Calling Notion API in Client Components | Exposes API secret to browser; runs on every render | Only call Notion in Server Components or API routes |
| Using `getServerSideProps` (Pages Router) style SSR | Re-fetches Notion on every request → slow, rate-limited | Use ISR (`revalidate`) so pages are served from cache |
| Storing Notion image URLs in DB/cache long-term | Notion signed URLs expire after ~1 hour — images break | Always fetch fresh URLs at revalidation time; use `next/image` which re-fetches at render |
| Animating `layout properties` (width, height, margin) | Triggers browser reflow on every frame — jank | Animate only `transform` (translate, scale) and `opacity` |
| `"use client"` on page-level components | Turns entire page into client bundle — kills RSC benefits | Keep pages as Server Components; push `"use client"` to leaf interactive nodes |
| Importing Framer Motion in Server Components | Build error + unnecessary bundle bloat | Always put Framer Motion inside `"use client"` components |
| Single Notion database for all content types | Hard to query, filter, type | Separate databases: Blog Posts DB, Projects DB |
| No `revalidate` fallback (only on-demand) | If webhook fails, content never updates | Always set `revalidate` time as a safety net |
| Tracking analytics in Server Components | Runs on server, not per-user browser visit | Umami script in browser; custom events via client-side `window.umami.track()` |
| Hardcoding Notion database IDs in components | Makes refactoring painful | Centralize all IDs in `lib/notion/config.ts` or env vars |

---

## Integration Points

### Environment Variables Required
```
# Notion
NOTION_API_SECRET=secret_...
NOTION_BLOG_DB_ID=...
NOTION_PROJECTS_DB_ID=...
NOTION_ABOUT_PAGE_ID=...

# Revalidation
REVALIDATE_SECRET=...          # Random string to secure /api/revalidate

# Umami
NEXT_PUBLIC_UMAMI_URL=https://your-umami.railway.app/script.js
NEXT_PUBLIC_UMAMI_WEBSITE_ID=...
```

### Notion Database Schema (Blog Posts)
| Property | Type | Notes |
|----------|------|-------|
| Title | Title | Post headline |
| Slug | Rich Text | URL-safe identifier (e.g., `my-post-title`) |
| Status | Select | `Draft` / `Published` |
| PublishedAt | Date | Controls sort order |
| Tags | Multi-select | For filtering/grouping |
| Cover | Files & media | Hero image for post |
| Excerpt | Rich Text | Meta description / card preview |

### Notion Database Schema (Projects)
| Property | Type | Notes |
|----------|------|-------|
| Title | Title | Project name |
| Slug | Rich Text | URL slug |
| Status | Select | `Active` / `Archived` / `Featured` |
| Tags | Multi-select | Tech stack / category |
| Cover | Files & media | Project screenshot/thumbnail |
| URL | URL | Live link |
| Year | Number | For sorting |

### Key Library Versions (as of 2026)
```json
{
  "next": "^15.x",
  "@notionhq/client": "^2.x",
  "notion-to-md": "^3.x",
  "framer-motion": "^11.x",
  "next-themes": "^0.4.x",
  "tailwindcss": "^4.x",
  "clsx": "^2.x",
  "tailwind-merge": "^2.x"
}
```

---

## Sources

- Next.js App Router docs — caching, ISR, `revalidatePath`, `generateStaticParams`
- Notion API reference — `databases.query`, `blocks.children.list`, rate limits
- Umami docs — self-hosting guide, event tracking API, Railway/Render deploy
- Framer Motion docs — `whileInView`, `AnimatePresence`, `viewport` options
- Next.js `next/image` docs — remote patterns config, Notion image domain allowlist
- `@notionhq/client` GitHub — typed response shapes, pagination helpers
- `notion-to-md` GitHub — block renderer customization
- `next-themes` GitHub — SSR-safe theme switching pattern
- Vercel free tier limits — vercel.com/pricing
- Notion signed URL expiry behavior — community reports + Notion changelog
