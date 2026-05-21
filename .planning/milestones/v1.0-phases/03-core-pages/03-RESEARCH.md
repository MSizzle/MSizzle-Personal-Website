# Phase 3: Core Pages - Research

**Researched:** 2026-04-02
**Domain:** Next.js App Router page layout, OG images, sitemap, SEO, client-side filtering, mobile-responsive navigation
**Confidence:** HIGH

---

<user_constraints>
## User Constraints (from CONTEXT.md)

### Locked Decisions

- **D-01:** Scroll-driven narrative layout — hero followed by full-viewport sections for about snapshot, featured work, writing teaser, contact CTA.
- **D-02:** Keep existing hero ("Hey, I'm Monty.") as base — enhance with profile photo, tagline, and CTA button.
- **D-03:** Fixed top navigation bar with site name left, nav links center/right, theme toggle right. Collapses to hamburger menu on mobile.
- **D-04:** Nav links: Home, Projects, Blog, About, Links. Highlight active route.
- **D-05:** Card grid layout (2-3 columns on desktop, 1 on mobile) for projects. Each card shows title, description, thumbnail image, and external link.
- **D-06:** Project data sourced from a Notion database, same pattern as blog — reuse the Notion data layer from Phase 2.
- **D-07:** Case study pages at `/projects/[slug]` using Notion page content + NotionRenderer.
- **D-08:** Client-side tag filtering on `/blog` — no page reload. Tags as clickable pills, active tag highlighted, "All" option.
- **D-09:** Reading time calculated from word count (~200 wpm), displayed on listing and detail pages.
- **D-10:** Vertical card list style for `/links` (Linktree-inspired). Each link is a card with icon, label, external URL. Mobile-first.
- **D-11:** Links: Email, Twitter/X, LinkedIn, GitHub, Newsletter signup CTA.
- **D-12:** About page as prose narrative with section headings (not a timeline). Sections: intro/background, education (Georgetown), career (investing, NYC), skills and interests.
- **D-13:** About content can be hardcoded initially — no Notion dependency needed.
- **D-14:** Dynamic OG images via @vercel/og using Edge Runtime. Text-on-gradient design. Different variants per page type.
- **D-15:** `app/sitemap.ts` generating XML sitemap listing all public routes (static + dynamic slugs).
- **D-16:** `app/robots.ts` with standard allow-all + sitemap reference.
- **D-17:** JSON-LD Person structured data on homepage/about page.
- **D-18:** Per-page metadata via `generateMetadata` (established in Phase 2 for blog).
- **D-19:** Consistent footer across all pages with social links, copyright, optional tagline.
- **D-20:** Use Tailwind v4 CSS variables for color tokens, spacing scale, typography. Consistent neutral palette in light and dark mode.

### Claude's Discretion

- Exact spacing and sizing values within Tailwind's scale
- Component file organization (co-located vs centralized)
- Specific Tailwind color shades (as long as consistent and work in dark mode)
- Newsletter CTA implementation approach (form service vs mailto vs placeholder)

### Deferred Ideas (OUT OF SCOPE)

None — discussion stayed within phase scope.
</user_constraints>

---

<phase_requirements>
## Phase Requirements

| ID | Description | Research Support |
|----|-------------|------------------|
| HOME-01 | Hero section with profile photo, name, tagline, and CTA | D-02 layout + Next.js Image component patterns |
| HOME-02 | Scroll-driven narrative sections (about snapshot, featured work, writing teaser, contact CTA) | D-01 full-viewport sections; Lenis already active from Phase 1 |
| PORT-01 | Project cards with title, description, image, external links | D-05 card grid; reuse Notion data layer from Phase 2 |
| PORT-03 | Case study deep-dive pages with rich media | D-07 `/projects/[slug]` with NotionRenderer (already built) |
| BLOG-03 | Estimated reading time displayed on each post | D-09 word-count utility; extract plain_text from Notion block rich_text arrays |
| BLOG-04 | Tag/category filtering on blog listing page | D-08 client component with useState; Suspense boundary required |
| ABOUT-01 | Bio page: background, education, career, skills as prose | D-12/D-13 hardcoded prose narrative |
| SOC-01 | Social links hub in footer + dedicated /links page | D-10/D-11/D-19 footer + links page |
| SOC-02 | OG meta tags with dynamic OG images per page | D-14 `opengraph-image.tsx` files using `next/og` ImageResponse |
| SOC-03 | Auto-generated sitemap via app/sitemap.ts | D-15 MetadataRoute.Sitemap return type |
| SOC-04 | robots.txt and Person structured data (JSON-LD) | D-16/D-17 `app/robots.ts` + `<script type="application/ld+json">` in RSC |
| SOC-05 | Newsletter subscribe CTA (inline at end of blog posts) | D-11 inline CTA at bottom of `/blog/[slug]` — not a popup |
| DSGN-02 | Mobile responsive design tested at 375px / iPhone SE | D-03 hamburger nav; all grids 1-col on mobile; no horizontal overflow |
| DSGN-05 | Consistent design tokens via Tailwind v4 | D-20 CSS variables in globals.css; already started with `--bg` / `--fg` |
</phase_requirements>

---

## Summary

Phase 3 is a page-building phase with no new external dependencies beyond `@vercel/og` (for OG image generation) and optionally `reading-time` (a tiny utility for word count). Every other problem is solved by patterns already established in Phases 1–2: the Notion data layer, NotionRenderer, ISR, image proxy, Tailwind v4 design tokens, and the provider hierarchy.

The key technical challenges are: (1) client-side tag filtering requires isolating the interactive part into a `"use client"` component with a Suspense boundary — the rest of the blog page stays a Server Component; (2) dynamic OG images use `next/og` (not `@vercel/og` directly) via file-convention `opengraph-image.tsx` co-located inside each route segment; (3) the Projects Notion database must be created with the same schema as the blog database, and `getPublishedPosts` / `getPostBySlug` in `src/lib/notion.ts` must be generalized or duplicated to support a second database ID; (4) the ISR revalidation webhook must be token-guarded before connecting Notion to production routes.

**Primary recommendation:** Reuse every Phase 2 pattern wholesale. Add two thin new files: a `src/lib/notion-projects.ts` (same shape as notion.ts, different env var) and a `src/utils/reading-time.ts` (10-line word counter). All other work is routing, layout, and metadata.

---

## Standard Stack

### Core (already installed — no new installs required for most work)

| Library | Version | Purpose | Why Standard |
|---------|---------|---------|--------------|
| next | 16.2.1 | App Router, ISR, metadata file conventions | Already installed |
| react | 19.2.4 | Server + Client components | Already installed |
| tailwindcss | 4.x | Styling, design tokens via CSS variables | Already installed |
| @notionhq/client | 5.16.0 | Notion API queries for projects database | Already installed |
| next-themes | 0.4.6 | Dark mode in navigation + footer | Already installed |
| motion | 12.38.0 | Page transitions already scaffolded | Already installed |

### New Dependencies for This Phase

| Library | Version | Purpose | Install |
|---------|---------|---------|---------|
| @vercel/og | 0.11.1 | ImageResponse for dynamic OG images (re-exported as `next/og`) | Not needed — `next/og` is built into Next.js 16 |
| reading-time | 1.5.0 | Word count → minutes estimate | Optional — can hand-roll 5-line utility |
| clsx | 2.1.1 | Conditional className merging for tag pills, active states | `npm install clsx` |
| tailwind-merge | 3.5.0 | Merge Tailwind classes without conflicts | `npm install tailwind-merge` |

**Installation (only what's actually new):**
```bash
npm install clsx tailwind-merge
```

`reading-time` is optional — see Don't Hand-Roll section.

**Version verification (confirmed 2026-04-02):**
- `next/og` is a re-export of `@vercel/og` — ships with Next.js 16, zero install needed
- `clsx@2.1.1` — verified via `npm view clsx version`
- `tailwind-merge@3.5.0` — verified via `npm view tailwind-merge version`

### Alternatives Considered

| Instead of | Could Use | Tradeoff |
|------------|-----------|----------|
| `next/og` (built-in) | `@vercel/og` directly | `next/og` is the idiomatic import in Next.js 13+; both resolve to same package but `next/og` auto-bundles correctly |
| Custom word counter | `reading-time` npm package | `reading-time` is 1KB and handles edge cases; custom is fine for simple plain-text counting |
| `clsx` + `tailwind-merge` | Template literals | Template literals cause class conflicts with Tailwind; the `cn()` helper pattern prevents this |

---

## Architecture Patterns

### Recommended Project Structure (additions for Phase 3)

```
src/
├── app/
│   ├── page.tsx                        # UPDATE: real homepage content
│   ├── about/
│   │   └── page.tsx                    # NEW: prose about page
│   ├── projects/
│   │   ├── page.tsx                    # NEW: project card grid
│   │   └── [slug]/
│   │       └── page.tsx                # NEW: case study detail
│   ├── blog/
│   │   ├── page.tsx                    # UPDATE: add tag filter + reading time
│   │   └── [slug]/
│   │       ├── page.tsx                # UPDATE: add reading time + newsletter CTA
│   │       └── opengraph-image.tsx     # NEW: dynamic OG image
│   ├── links/
│   │   └── page.tsx                    # NEW: links hub page
│   ├── opengraph-image.tsx             # NEW: site-wide default OG image
│   ├── sitemap.ts                      # NEW: XML sitemap
│   └── robots.ts                       # NEW: robots.txt
├── components/
│   ├── nav/
│   │   └── navigation.tsx              # NEW: fixed top nav with hamburger
│   ├── footer.tsx                      # NEW: shared footer
│   ├── blog/
│   │   ├── tag-filter.tsx              # NEW: "use client" tag pill filter
│   │   └── newsletter-cta.tsx          # NEW: inline newsletter block
│   ├── projects/
│   │   └── project-card.tsx            # NEW: card component
│   └── notion/ (existing)
├── lib/
│   ├── notion.ts                       # EXISTING: blog queries
│   └── notion-projects.ts              # NEW: project queries (same pattern)
└── utils/
    └── reading-time.ts                 # NEW: word count utility
```

### Pattern 1: File-Convention OG Images (next/og)

**What:** Place `opengraph-image.tsx` inside any route segment. Next.js discovers it automatically and serves it at `/<route>/opengraph-image`. No API route needed.

**When to use:** All routes — `/`, `/blog/[slug]`, `/projects/[slug]`

```typescript
// Source: https://nextjs.org/docs/app/api-reference/file-conventions/metadata/opengraph-image
// src/app/blog/[slug]/opengraph-image.tsx

import { ImageResponse } from 'next/og'
import { getPostBySlug } from '@/lib/notion'

export const runtime = 'edge'

export const size = { width: 1200, height: 630 }
export const contentType = 'image/png'

interface Props {
  params: Promise<{ slug: string }>
}

export default async function Image({ params }: Props) {
  const { slug } = await params
  const post = await getPostBySlug(slug)

  return new ImageResponse(
    (
      <div
        style={{
          background: 'linear-gradient(135deg, #0a0a0a 0%, #1a1a2e 100%)',
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'flex-start',
          justifyContent: 'flex-end',
          padding: '60px',
        }}
      >
        <p style={{ color: '#888', fontSize: 24, margin: '0 0 16px' }}>Monty Singer</p>
        <h1 style={{ color: '#fafafa', fontSize: 56, fontWeight: 700, margin: 0, lineHeight: 1.1 }}>
          {post?.title ?? 'Writing'}
        </h1>
      </div>
    ),
    { ...size }
  )
}
```

**Critical constraints:**
- CSS inside ImageResponse is NOT standard CSS — only flexbox layout is supported (no grid, no Tailwind classes)
- All styles must be passed as inline `style={{}}` objects
- Custom fonts require loading them via `fetch` before the `new ImageResponse()` call
- `export const runtime = 'edge'` is required for fast cold starts

### Pattern 2: Client-Side Tag Filter with Suspense

**What:** The blog page server component passes all posts as props to a `"use client"` child that handles filtering with `useState`. This avoids a full server round-trip per filter click while keeping data fetching server-side.

**When to use:** Any client-side filtering where data is already loaded (BLOG-04)

```typescript
// src/components/blog/tag-filter.tsx
'use client'

import { useState } from 'react'
import type { BlogPost } from '@/lib/notion'

interface TagFilterProps {
  posts: BlogPost[]
}

export function TagFilter({ posts }: TagFilterProps) {
  const [activeTag, setActiveTag] = useState<string | null>(null)

  const allTags = Array.from(new Set(posts.flatMap((p) => p.tags)))
  const filtered = activeTag ? posts.filter((p) => p.tags.includes(activeTag)) : posts

  return (
    <>
      {/* Tag pills */}
      <div className="flex flex-wrap gap-2 mt-8">
        <button
          onClick={() => setActiveTag(null)}
          className={`rounded-full px-3 py-1 text-sm font-medium transition-colors
            ${!activeTag ? 'bg-neutral-900 text-white dark:bg-white dark:text-neutral-900' : 'bg-neutral-100 dark:bg-neutral-800'}`}
        >
          All
        </button>
        {allTags.map((tag) => (
          <button
            key={tag}
            onClick={() => setActiveTag(tag === activeTag ? null : tag)}
            className={`rounded-full px-3 py-1 text-sm font-medium transition-colors
              ${tag === activeTag ? 'bg-neutral-900 text-white dark:bg-white dark:text-neutral-900' : 'bg-neutral-100 dark:bg-neutral-800'}`}
          >
            {tag}
          </button>
        ))}
      </div>
      {/* Filtered post list */}
      <ul className="mt-8 space-y-8">
        {filtered.map((post) => (
          // ... post card markup
        ))}
      </ul>
    </>
  )
}
```

```typescript
// src/app/blog/page.tsx  (server component)
import { Suspense } from 'react'
import { getPublishedPosts } from '@/lib/notion'
import { TagFilter } from '@/components/blog/tag-filter'

export default async function BlogPage() {
  const posts = await getPublishedPosts()
  return (
    <div className="mx-auto max-w-3xl px-6 pb-24 pt-32">
      <h1>Writing</h1>
      <Suspense fallback={<div>Loading...</div>}>
        <TagFilter posts={posts} />
      </Suspense>
    </div>
  )
}
```

**Critical:** Even though `TagFilter` doesn't use `useSearchParams`, wrapping client-only interactive components in `Suspense` is the safe default in Next.js App Router to prevent CSR bailout warnings.

### Pattern 3: Sitemap (app/sitemap.ts)

```typescript
// src/app/sitemap.ts
import { MetadataRoute } from 'next'
import { getPublishedPosts } from '@/lib/notion'
import { getPublishedProjects } from '@/lib/notion-projects'

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const posts = await getPublishedPosts()
  const projects = await getPublishedProjects()

  const staticRoutes: MetadataRoute.Sitemap = [
    { url: 'https://msizzle.com', lastModified: new Date(), changeFrequency: 'weekly', priority: 1 },
    { url: 'https://msizzle.com/about', lastModified: new Date(), changeFrequency: 'monthly', priority: 0.8 },
    { url: 'https://msizzle.com/projects', lastModified: new Date(), changeFrequency: 'weekly', priority: 0.9 },
    { url: 'https://msizzle.com/blog', lastModified: new Date(), changeFrequency: 'daily', priority: 0.9 },
    { url: 'https://msizzle.com/links', lastModified: new Date(), changeFrequency: 'monthly', priority: 0.5 },
  ]

  const postRoutes: MetadataRoute.Sitemap = posts.map((post) => ({
    url: `https://msizzle.com/blog/${post.slug}`,
    lastModified: new Date(post.lastEdited),
    changeFrequency: 'monthly',
    priority: 0.7,
  }))

  const projectRoutes: MetadataRoute.Sitemap = projects.map((project) => ({
    url: `https://msizzle.com/projects/${project.slug}`,
    lastModified: new Date(project.lastEdited),
    changeFrequency: 'monthly',
    priority: 0.7,
  }))

  return [...staticRoutes, ...postRoutes, ...projectRoutes]
}
```

### Pattern 4: JSON-LD in React Server Component

**What:** Inject JSON-LD as a `<script>` tag from an RSC — no client JS needed.

```typescript
// Inside src/app/page.tsx or src/app/about/page.tsx
const personJsonLd = {
  '@context': 'https://schema.org',
  '@type': 'Person',
  name: 'Monty Singer',
  url: 'https://msizzle.com',
  sameAs: [
    'https://twitter.com/msizzle',
    'https://linkedin.com/in/montysinger',
    'https://github.com/montysinger',
  ],
  jobTitle: 'Investor',
  worksFor: { '@type': 'Organization', name: 'Independent' },
}

// In the JSX return:
<script
  type="application/ld+json"
  dangerouslySetInnerHTML={{ __html: JSON.stringify(personJsonLd) }}
/>
```

**Security note:** `JSON.stringify` does not sanitize XSS. For user-supplied content (blog titles in ArticleSchema), replace `<` with `\u003c` before serializing. For hardcoded Person schema this is not a risk.

### Pattern 5: Reading Time Utility

**What:** Extract plain text from Notion blocks, count words, divide by 200.

```typescript
// src/utils/reading-time.ts
import type { BlockObjectResponse } from '@notionhq/client/build/src/api-endpoints'

function extractTextFromBlock(block: BlockObjectResponse): string {
  const richTextTypes = ['paragraph','heading_1','heading_2','heading_3','bulleted_list_item','numbered_list_item','quote','callout','toggle'] as const
  for (const type of richTextTypes) {
    const b = block as Record<string, unknown>
    if (b[type] && typeof b[type] === 'object') {
      const rich = (b[type] as { rich_text?: Array<{ plain_text: string }> }).rich_text
      if (rich) return rich.map((r) => r.plain_text).join(' ')
    }
  }
  return ''
}

export function calculateReadingTime(blocks: BlockObjectResponse[]): number {
  const text = blocks.map(extractTextFromBlock).join(' ')
  const words = text.trim().split(/\s+/).filter(Boolean).length
  return Math.max(1, Math.ceil(words / 200))
}
```

### Pattern 6: robots.ts

```typescript
// src/app/robots.ts
import { MetadataRoute } from 'next'

export default function robots(): MetadataRoute.Robots {
  return {
    rules: { userAgent: '*', allow: '/' },
    sitemap: 'https://msizzle.com/sitemap.xml',
  }
}
```

### Pattern 7: Notion Projects Database (new database ID)

The existing `notion.ts` hardcodes `NOTION_DATABASE_ID`. Projects require a second database and a second env var.

```typescript
// src/lib/notion-projects.ts
// Same withRetry + limit setup as notion.ts, but reads NOTION_PROJECTS_DATABASE_ID
const PROJECTS_DATABASE_ID = process.env.NOTION_PROJECTS_DATABASE_ID!

export interface Project {
  id: string
  slug: string
  title: string
  description: string
  image: string | null
  externalUrl: string
  tags: string[]
  published: boolean
  lastEdited: string
}
// getPublishedProjects(), getProjectBySlug() — same query pattern as blog
```

**Alternative:** Refactor `notion.ts` to accept a `databaseId` parameter. Either approach works; the split-file approach avoids touching working Phase 2 code.

### Anti-Patterns to Avoid

- **Using Tailwind classes inside `ImageResponse` JSX:** Only inline styles work. No `className`, no `cn()` utility.
- **Putting tag filter logic directly in the server page component:** Makes the entire page client-rendered. Extract to a `"use client"` child component.
- **Missing `Suspense` wrapper around client components in static pages:** Next.js build fails with "Missing Suspense boundary with useSearchParams" if any ancestor uses `useSearchParams`. Wrap client island components in `Suspense` preventatively.
- **Hardcoding the domain in sitemap without an env var:** Makes it impossible to test in staging. Use `process.env.NEXT_PUBLIC_SITE_URL ?? 'https://msizzle.com'`.
- **Fetching Notion API in `opengraph-image.tsx` without error handling:** OG route failures are silent — add a try/catch that falls back to a generic image.
- **Adding `"use client"` to the navigation without isolating the hamburger toggle:** The entire nav should be a server component except for the mobile menu toggle state. Alternatively, use a `details`/`summary` CSS-only disclosure pattern.

---

## Don't Hand-Roll

| Problem | Don't Build | Use Instead | Why |
|---------|-------------|-------------|-----|
| OG image rendering | Custom canvas/Puppeteer screenshot | `next/og` ImageResponse | Satori renders JSX to SVG to PNG at Edge runtime; sub-50ms, zero infrastructure |
| Sitemap generation | Manual XML string builder | `app/sitemap.ts` with `MetadataRoute.Sitemap` | Next.js validates the return type, auto-adds `application/xml` header, handles encoding |
| robots.txt | Static file in /public | `app/robots.ts` | Dynamic — can reference the live sitemap URL from env var |
| Class merging | Template literals with ternaries | `clsx` + `tailwind-merge` (`cn()` helper) | Template literals produce duplicate/conflicting Tailwind classes that don't get de-duped |
| Reading time | `reading-time` npm package | Inline 10-line utility (see Pattern 5) | The package does the same thing; for this use case the hand-rolled version is simpler |

**Key insight:** Next.js file conventions (sitemap.ts, robots.ts, opengraph-image.tsx) replace entire categories of third-party libraries. The framework already handles the hard parts.

---

## Common Pitfalls

### Pitfall 1: OG Images Silently Return 404 in Dev
**What goes wrong:** `opengraph-image.tsx` file is found but returns a blank image or 404 in local dev.
**Why it happens:** Edge Runtime environment differences; Notion fetch fails silently inside `ImageResponse`.
**How to avoid:** Add try/catch around all async calls inside `opengraph-image.tsx`. Return a static fallback image using JSX if data fetch fails. Test by navigating directly to `localhost:3000/blog/your-slug/opengraph-image`.
**Warning signs:** Twitter Card debugger shows a generic/blank image; no console error on the page itself.

### Pitfall 2: Tailwind Classes Don't Work in ImageResponse JSX
**What goes wrong:** OG image renders plain text with no styling.
**Why it happens:** ImageResponse uses Satori (not a browser), which has no knowledge of Tailwind CSS class names. Only inline styles work.
**How to avoid:** Write all ImageResponse JSX using `style={{}}` object props. Do not use `className` at all inside `new ImageResponse(...)`.

### Pitfall 3: Client Filter Causes Full-Page Client Render
**What goes wrong:** Entire blog listing page loses SSR. First load is blank until JS hydrates.
**Why it happens:** Adding `"use client"` to `blog/page.tsx` converts the server component to a client component, losing all SSR benefits.
**How to avoid:** Keep `page.tsx` as a Server Component. Extract the tag pills + list rendering into a `TagFilter` client component that receives `posts` as a prop. Only the filter UI needs to be client-side.

### Pitfall 4: Unsecured /api/revalidate Webhook
**What goes wrong:** Anyone who discovers the route can trigger cache invalidation, causing repeated Notion API calls.
**Why it happens:** Route is left without authentication.
**How to avoid:** Check `Authorization: Bearer <REVALIDATE_SECRET>` or query param `?secret=<TOKEN>` against an env var. Return 401 if missing. The webhook is not in this phase's scope but the route must be secured before Notion connects to any production page.
**Warning signs:** Notion publish events trigger unusually high API call counts.

### Pitfall 5: Missing `revalidate` Export on New Routes
**What goes wrong:** Projects and links pages are fully static (no revalidation). Content changes in Notion don't reflect without a redeploy.
**Why it happens:** Forgetting to copy `export const revalidate = 1800` to new route files.
**How to avoid:** Every page that reads from Notion must have `export const revalidate = 1800`. Add it as the first non-import line in the file.

### Pitfall 6: Two Notion Databases Need Two Env Vars
**What goes wrong:** Projects page breaks in production because `NOTION_PROJECTS_DATABASE_ID` is not set in Vercel.
**Why it happens:** New env var added to code but not added to Vercel dashboard.
**How to avoid:** Document both env vars in `.env.example`. Add them to Vercel before deploying.
**Warning signs:** `Error: relation "" does not exist` or Notion 400/404 in production logs.

### Pitfall 7: Hamburger Menu Causes Hydration Mismatch
**What goes wrong:** Console shows hydration mismatch warning; nav flickers on page load.
**Why it happens:** Server renders menu as closed; if a client component manages `isOpen` state, the initial render may differ if not defaulted to `false` explicitly.
**How to avoid:** Default `isOpen` to `false`. Do not derive initial state from `window` (which doesn't exist on server). Consider a CSS-only `details/summary` approach to avoid client JS entirely for the toggle.

### Pitfall 8: Horizontal Overflow at 375px (iPhone SE)
**What goes wrong:** Mobile layout check fails — content overflows horizontally.
**Why it happens:** Fixed-width elements, `min-w` constraints, or long unbreakable text (URLs, code) in blog posts.
**How to avoid:** Add `overflow-x-hidden` to `<body>`. Use `break-words` or `overflow-wrap: break-word` on prose content. Test all new routes at 375px width before marking done. Use `max-w-full` on images.

---

## Code Examples

### cn() Helper (standard Tailwind utility)
```typescript
// src/utils/cn.ts
import { clsx, type ClassValue } from 'clsx'
import { twMerge } from 'tailwind-merge'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}
```

### Fixed Navigation with Mobile Hamburger
```typescript
// src/components/nav/navigation.tsx
'use client'

import { useState } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { ThemeToggle } from '@/components/theme-toggle'

const NAV_LINKS = [
  { href: '/', label: 'Home' },
  { href: '/projects', label: 'Projects' },
  { href: '/blog', label: 'Blog' },
  { href: '/about', label: 'About' },
  { href: '/links', label: 'Links' },
]

export function Navigation() {
  const [open, setOpen] = useState(false)
  const pathname = usePathname()

  return (
    <header className="fixed inset-x-0 top-0 z-50 border-b border-neutral-200/50 bg-background/80 backdrop-blur dark:border-neutral-800/50">
      <nav className="mx-auto flex max-w-5xl items-center justify-between px-6 py-4">
        <Link href="/" className="text-lg font-semibold tracking-tight">Monty Singer</Link>

        {/* Desktop links */}
        <ul className="hidden items-center gap-6 md:flex">
          {NAV_LINKS.map((link) => (
            <li key={link.href}>
              <Link
                href={link.href}
                className={`text-sm transition-colors hover:text-foreground ${
                  pathname === link.href ? 'text-foreground font-medium' : 'text-neutral-500 dark:text-neutral-400'
                }`}
              >
                {link.label}
              </Link>
            </li>
          ))}
        </ul>

        <div className="flex items-center gap-4">
          <ThemeToggle />
          {/* Hamburger */}
          <button
            className="md:hidden"
            onClick={() => setOpen(!open)}
            aria-label={open ? 'Close menu' : 'Open menu'}
          >
            <span className="block h-0.5 w-5 bg-current transition-transform" />
            <span className="mt-1 block h-0.5 w-5 bg-current" />
            <span className="mt-1 block h-0.5 w-5 bg-current transition-transform" />
          </button>
        </div>
      </nav>

      {/* Mobile menu */}
      {open && (
        <div className="border-t border-neutral-200 px-6 py-4 md:hidden dark:border-neutral-800">
          {NAV_LINKS.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="block py-2 text-sm"
              onClick={() => setOpen(false)}
            >
              {link.label}
            </Link>
          ))}
        </div>
      )}
    </header>
  )
}
```

**Navigation placement:** Add `<Navigation />` to `src/app/layout.tsx` inside `<MotionProvider>`, before `{children}`.

### generateMetadata for Projects
```typescript
// src/app/projects/[slug]/page.tsx
export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params
  const project = await getProjectBySlug(slug)
  if (!project) return { title: 'Project Not Found' }

  return {
    title: `${project.title} — Monty Singer`,
    description: project.description,
    openGraph: {
      title: project.title,
      description: project.description,
      images: project.image ? [{ url: project.image }] : [],
    },
  }
}
```

---

## State of the Art

| Old Approach | Current Approach | When Changed | Impact |
|--------------|------------------|--------------|--------|
| `@vercel/og` direct import | `import { ImageResponse } from 'next/og'` | Next.js 13.3 | `@vercel/og` still works but `next/og` is canonical |
| `next-sitemap` library | `app/sitemap.ts` file convention | Next.js 13.4 | No library needed; framework handles it natively |
| Static `/public/robots.txt` file | `app/robots.ts` file convention | Next.js 13.4 | Enables dynamic content (siteUrl from env var) |
| `pages/_document.tsx` for JSON-LD | `<script>` tag in RSC page/layout | Next.js 13 App Router | Simpler, no custom Document needed |
| `useRouter` for URL state | `useSearchParams` for query param reads | Next.js 13 | Cleaner separation; router.push still used for writes |

**Deprecated / outdated:**
- `next-sitemap`: Extra dependency with manual config — use native `app/sitemap.ts` instead (CLAUDE.md explicitly lists this)
- `pages/api/og.ts` OG route pattern: Replaced by `opengraph-image.tsx` file convention colocation

---

## Open Questions

1. **Projects Notion Database Schema**
   - What we know: Must match the blog database pattern (slug, Published checkbox, Date, Tags, Description)
   - What's unclear: Does the Projects database also need a "Featured" boolean to support the homepage "featured work" section (HOME-02)?
   - Recommendation: Add `Featured` as a checkbox property to the Projects database. Filter `featured: true` for the homepage section. This avoids hardcoding featured project IDs.

2. **Newsletter CTA (SOC-05)**
   - What we know: Must be inline at end of blog posts, not a popup. CLAUDE.md leaves implementation approach to Claude's discretion.
   - What's unclear: Is there an actual newsletter service (ConvertKit, Beehiiv, Substack) or is this a placeholder CTA linking to one?
   - Recommendation: Implement as a styled block with a mailto link (`mailto:monty@example.com?subject=Newsletter`) or a Substack subscribe URL. Zero infrastructure, zero cost, zero ops. Replace with form integration in a future phase if a service is chosen.

3. **Profile Photo for HOME-01**
   - What we know: Hero requires a profile photo.
   - What's unclear: Does the photo exist as a local asset or is it in Notion/elsewhere?
   - Recommendation: Expect a local image at `public/monty.jpg`. Use `next/image` with `width={400} height={400} className="rounded-full"`. If no photo is available, use a placeholder SVG initially.

4. **Domain for Sitemap + OG Canonical URLs**
   - What we know: `msizzle.com` is the intended domain. Vercel deployment and DNS are not yet configured (STATE.md).
   - What's unclear: Is the domain live? Sitemap URLs must use the real domain.
   - Recommendation: Use `process.env.NEXT_PUBLIC_SITE_URL ?? 'https://msizzle.com'` in sitemap.ts and OG image files. Set the env var in `.env.local` for dev and Vercel for production.

---

## Environment Availability

| Dependency | Required By | Available | Version | Fallback |
|------------|------------|-----------|---------|----------|
| Node.js | Build, dev server | Yes | v25.8.0 | — |
| npm | Package install | Yes | 11.11.0 | — |
| next | All routing + build | Yes | 16.2.1 | — |
| `next/og` (built-in) | SOC-02 OG images | Yes — ships with Next.js | Built-in | — |
| clsx + tailwind-merge | Tag pills, active states | No — not installed | — | Install: `npm install clsx tailwind-merge` |
| NOTION_TOKEN | Projects database | Env var — not verified set | — | Site works but projects page shows empty state |
| NOTION_PROJECTS_DATABASE_ID | Projects page + sitemap | Env var — must be created | — | Projects page shows empty state; sitemap omits project URLs |
| NEXT_PUBLIC_SITE_URL | Sitemap canonical URLs | Env var — not set | — | Fallback to hardcoded 'https://msizzle.com' |

**Missing dependencies with no fallback:**
- `clsx` and `tailwind-merge` — must be installed before implementing tag filter and nav active states

**Missing dependencies with fallback:**
- Notion env vars — site renders with empty states; does not crash (existing `getPublishedPosts` handles empty results gracefully)
- `NEXT_PUBLIC_SITE_URL` — hardcoded domain fallback is acceptable for single-domain site

---

## Validation Architecture

### Test Framework

| Property | Value |
|----------|-------|
| Framework | None detected in project — no jest.config, vitest.config, or test files found |
| Config file | None — Wave 0 must create vitest config |
| Quick run command | `npx vitest run --reporter=verbose` (after Wave 0 setup) |
| Full suite command | `npx vitest run` |

### Phase Requirements → Test Map

| Req ID | Behavior | Test Type | Automated Command | File Exists? |
|--------|----------|-----------|-------------------|-------------|
| HOME-01 | Hero renders profile photo, name, tagline, CTA | smoke | Manual browser check at `/` | Wave 0 |
| HOME-02 | 4 scroll sections present in DOM | unit | `vitest tests/homepage.test.tsx` | Wave 0 |
| PORT-01 | Project cards render title, description, image, link | unit | `vitest tests/project-card.test.tsx` | Wave 0 |
| PORT-03 | `/projects/[slug]` renders NotionRenderer output | smoke | Manual check at `/projects/<slug>` | Wave 0 |
| BLOG-03 | Reading time calculation returns integer >= 1 | unit | `vitest tests/reading-time.test.ts` | Wave 0 |
| BLOG-04 | Tag filter hides non-matching posts without page reload | unit | `vitest tests/tag-filter.test.tsx` | Wave 0 |
| ABOUT-01 | About page contains Georgetown, NYC, investing text | unit | `vitest tests/about.test.tsx` | Wave 0 |
| SOC-01 | Footer and /links page contain social link hrefs | unit | `vitest tests/footer.test.tsx` | Wave 0 |
| SOC-02 | OG image route returns 200 with image/png content-type | smoke | `curl -I http://localhost:3000/blog/<slug>/opengraph-image` | Manual |
| SOC-03 | sitemap.xml returns valid XML with all routes | smoke | `curl https://msizzle.com/sitemap.xml \| xmllint --noout -` | Manual |
| SOC-04 | robots.txt allows all, references sitemap | smoke | `curl http://localhost:3000/robots.txt` | Manual |
| SOC-05 | Newsletter CTA block appears at end of blog post | unit | `vitest tests/newsletter-cta.test.tsx` | Wave 0 |
| DSGN-02 | No horizontal overflow at 375px viewport | e2e/manual | Playwright viewport test or browser DevTools | Wave 0 |
| DSGN-05 | CSS variables `--bg`, `--fg` defined; dark class flips them | unit | `vitest tests/design-tokens.test.ts` | Wave 0 |

### Sampling Rate

- **Per task commit:** `npx vitest run --reporter=dot` (fast smoke)
- **Per wave merge:** `npx vitest run` (full suite)
- **Phase gate:** Full suite green + manual OG/sitemap/robots checks before `/gsd:verify-work`

### Wave 0 Gaps

- [ ] `tests/reading-time.test.ts` — covers BLOG-03
- [ ] `tests/tag-filter.test.tsx` — covers BLOG-04
- [ ] `tests/footer.test.tsx` — covers SOC-01
- [ ] `tests/newsletter-cta.test.tsx` — covers SOC-05
- [ ] `vitest.config.ts` — framework not yet installed
- [ ] Framework install: `npm install -D vitest @vitejs/plugin-react jsdom @testing-library/react @testing-library/dom`

---

## Sources

### Primary (HIGH confidence)
- Next.js official docs (nextjs.org) — sitemap.ts, robots.ts, opengraph-image file conventions, ImageResponse API, generateMetadata
- Existing codebase — `src/lib/notion.ts`, `src/app/blog/[slug]/page.tsx`, `src/app/layout.tsx` (directly read)
- Phase 1 + Phase 2 SUMMARY.md files (directly read) — provider architecture, ISR pattern, NotionRenderer

### Secondary (MEDIUM confidence)
- WebSearch verified with official Next.js docs: `next/og` vs `@vercel/og` canonical import path; Suspense requirement for client components in static pages; JSON-LD RSC pattern
- npm registry: `@vercel/og@0.11.1`, `reading-time@1.5.0`, `clsx@2.1.1`, `tailwind-merge@3.5.0` — confirmed current versions

### Tertiary (LOW confidence)
- Reading time word count formula (~200 wpm) — standard industry figure, multiple sources agree; no single authoritative source

---

## Metadata

**Confidence breakdown:**
- Standard stack: HIGH — all core packages already installed; new ones verified on npm
- Architecture: HIGH — patterns drawn directly from existing codebase and Next.js file conventions
- Pitfalls: HIGH — pitfalls 1-5 are from direct code inspection and official docs; pitfall 6-8 from verified patterns

**Research date:** 2026-04-02
**Valid until:** 2026-05-02 (Next.js file conventions are stable; `next/og` API is stable since 13.3)
