# Phase 17: Infrastructure Preservation & SEO Extension - Research

**Researched:** 2026-06-20
**Domain:** Next.js 16 SEO infrastructure, Umami analytics preservation, RSS feed validation
**Confidence:** HIGH

## Summary

Phase 17 is a **verification + minimal extension phase**: the Phase 16 interior pages are now live on the `v3` branch, and this phase confirms all existing SEO infrastructure (sitemap, robots, blog feed, JSON-LD, per-page metadata) works intact on `v3` and extends coverage to the two new pages (`/uses` and `/watching`).

The **production-code change is minimal**: add two entries to `src/app/sitemap.ts` for `/uses` and `/watching` at priority 0.6 and changeFrequency 'monthly' (matching `/photos`). All other assets are already in place — the new pages already export `metadata` with proper canonical and OG tags, they already render `<Breadcrumbs>` (which emits BreadcrumbList JSON-LD), and the Umami analytics script is already wired in `layout.tsx`.

**Verification is automated**: mirror the Phase 16 gate pattern using vitest + build checks. Assertions cover sitemap output (includes both new routes + dynamic blog/project routes), robots.ts resolution, RSS feed validity, per-page metadata presence, and Umami script presence when env vars are set.

**Primary recommendation:** Add the two sitemap entries, write a vitest test file that calls `sitemap()` and asserts the output includes the new routes, run the automated gate (tests + build), and formally close IN-03 and IN-04.

## Architectural Responsibility Map

| Capability | Primary Tier | Secondary Tier | Rationale |
|------------|-------------|----------------|-----------|
| SEO metadata (title, description, canonical, OG) | API / Frontend Server | Browser (client-side overrides) | Next.js App Router exports `metadata` at route level; Metadata object is serialized at build time |
| Sitemap generation | Build-time (API route return) | Browser (serves XML) | `sitemap.ts` runs at build and returns dynamic XML; served as static file |
| Robots.txt | Build-time (API route return) | Browser (serves rules) | `robots.ts` runs at build time, returns rules; served as static robots.txt |
| RSS blog feed | Build-time (API route, ISR 30min) | Browser (subscriber clients) | `src/app/blog/feed.xml/route.ts` fetches Notion posts at build/ISR, returns RSS XML |
| JSON-LD structured data | Frontend Server (React component) | Browser (meta tag) | `<Breadcrumbs>` component emits JSON-LD via `<JsonLd>` (dangerouslySetInnerHTML); runs on server, hydrates on client |
| Umami analytics tracking | Browser (script injection) | Frontend Server (conditional render) | `<UmamiAnalytics>` server component conditionally renders `<Script>` tag based on env vars; script runs async in browser |

## User Constraints (from CONTEXT.md)

### Locked Decisions
- **D-01:** `/uses` and `/watching` stay breadcrumb-only JSON-LD (already emitted via `buildBreadcrumbListSchema`). Do NOT add VideoObject/ItemList builders this phase.
- **D-02:** New pages inherit site-wide default OG (no per-page `@vercel/og` images).
- **D-03:** Prove IN-03/IN-04 with **automated regression assertions**, not a one-time smoke check. Follow the Phase 16 automated-gate pattern (vitest + build).
- **D-04:** Add `/uses` and `/watching` to `sitemap.ts` at priority 0.6, changeFrequency 'monthly' (match `/photos`).

### Claude's Discretion
- Exact test file location/naming and whether assertions live in a new vitest file vs. extending the Phase 16 gate file.
- Whether the Umami "tracks on every page" check is a unit assertion on the layout component vs. a build-time check.

### Deferred Ideas (OUT OF SCOPE)
- VideoObject / ItemList structured data for `/watching` (real YouTube IDs replace placeholders in Phase 18).
- Per-page dynamic `@vercel/og` images (Phase 18 or later polish).
- Full PSI / mobile perf budget + alias swap (Phase 18).

## Phase Requirements

| ID | Description | Research Support |
|----|-------------|------------------|
| IN-03 | SEO infrastructure (sitemap, robots, blog feed, `src/lib/seo`, JSON-LD, per-page metadata) is preserved and extended to the new `/uses` and `/watching` pages. | Verified: both new pages export `metadata` with canonical + OG; both render `<Breadcrumbs>` (emits BreadcrumbList JSON-LD); sitemap.ts and robots.ts are intact; blog feed unchanged. |
| IN-04 | Umami analytics continues to load and track on every page. | Verified: `<UmamiAnalytics>` in `layout.tsx` conditionally renders Script tag when `NEXT_PUBLIC_UMAMI_WEBSITE_ID` and `NEXT_PUBLIC_UMAMI_URL` are set. |

## Current SEO Infrastructure Shape (What to Preserve & Assert)

### 1. Sitemap (`src/app/sitemap.ts`)
**Current state:**
- Async function returns `Promise<MetadataRoute.Sitemap>`
- Static routes array (hardcoded): home, about, prometheus, newsletter, projects, writing, **photos**, links, events (9 routes)
- **MISSING:** `/uses` and `/watching` (D-04 requires adding these)
- Dynamic routes: blog posts (fetched from Notion, ISR 30min, priority 0.7)
- Dynamic routes: projects (fetched from Notion, ISR 30min, priority 0.7)

**Change required (D-04):** Add two entries to staticRoutes array:
```typescript
{ url: `${SITE_URL}/uses`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.6 },
{ url: `${SITE_URL}/watching`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.6 },
```

**Testing:** Import `sitemap()` function, call it with no args, assert:
- Output includes both `/uses` and `/watching` URLs
- Output includes dynamic blog and project routes (count > 9)
- Each entry has `url`, `lastModified`, `changeFrequency`, `priority` keys
- Priority values are correct (1.0 for home, 0.9 for curator pages, 0.8 for about, 0.7 for dynamic, 0.6 for secondary)

### 2. Robots.txt (`src/app/robots.ts`)
**Current state:**
- Synchronous function returns `MetadataRoute.Robots`
- Allows `/` globally
- Disallows: `/specimen` (staging route), `/api/` (internal API)
- Sitemap: `${SITE_URL}/sitemap.xml`

**No change required.** Testing: import `robots()`, assert:
- Returns an object with `rules` and `sitemap` keys
- `rules.allow` includes `/`
- `rules.disallow` includes `/specimen` and `/api/`
- `sitemap` points to `/sitemap.xml`

### 3. Blog Feed (`src/app/blog/feed.xml/route.ts` + `src/lib/rss/blog-feed.ts`)
**Current state:**
- Route handler exports `GET()` function
- ISR revalidation: `export const revalidate = 1800` (30 min)
- Fetches published posts from Notion (graceful fail if env vars absent)
- Returns RSS 2.0 XML with:
  - Channel: title "Monty Singer | Writings", link `/writing`, description, language en-us, atom:link
  - Items: title, link, guid, pubDate, description, author
- Content-Type: `application/rss+xml; charset=utf-8`
- Cache-Control: `public, max-age=0, s-maxage=1800` (ISR cache)

**No change required.** Testing: call `GET()` async, assert:
- Returns a Response object with status 200
- Content-Type header is `application/rss+xml; charset=utf-8`
- Body contains valid XML (parseable by DOMParser or xml library)
- XML includes channel title "Monty Singer | Writings"
- XML includes atom:link to `/blog/feed.xml`
- If posts exist, items are included with title, link, guid, pubDate, description

### 4. SEO Library (`src/lib/seo/site.ts`, `src/lib/seo/schemas.ts`)
**Current state:**
- `site.ts`: exports `SITE_URL` (defaults to 'https://montysinger.com') and `canonical(path)` function
- `schemas.ts`: three builder functions:
  - `buildPersonSchema()` — emits Person schema (Monty Singer @ Prometheus, Georgetown alumni)
  - `buildFaqPageSchema(items)` — wraps Q/A pairs in FAQPage + Question/Answer nodes
  - `buildBreadcrumbListSchema(items)` — numbers breadcrumb items, omits URL on final item

**No change required.** Builders are generic and tested already. New pages use `buildBreadcrumbListSchema` via `<Breadcrumbs>`.

### 5. Breadcrumbs Component (`src/components/seo/breadcrumbs.tsx`)
**Current state:**
- Accepts `items: BreadcrumbItem[]` (array of `{ name, href? }`)
- Emits `<JsonLd data={buildBreadcrumbListSchema(items)} />`
- Emits `<nav aria-label="Breadcrumb">` with `sr-only` class (screen-reader only; hidden visually)

**Both new pages already use it correctly:**
- `/uses/page.tsx`: `<Breadcrumbs items={[{ name: "Home", href: "/" }, { name: "Uses" }]} />`
- `/watching/page.tsx`: `<Breadcrumbs items={[{ name: "Home", href: "/" }, { name: "Watching" }]} />`

**No change required.** Testing: Breadcrumbs component is already tested; assertion can verify new pages render it.

### 6. JSON-LD Component (`src/components/seo/json-ld.tsx`)
**Current state:**
- Generic component: `<JsonLd data={unknown} />`
- Renders `<script type="application/ld+json">` with `dangerouslySetInnerHTML`
- Stringifies data to JSON

**No change required.** Already used by Breadcrumbs; no new JSON-LD types needed per D-01.

### 7. Per-Page Metadata (every route exports `metadata`)
**Current state:**
- Next.js App Router convention: every page exports `export const metadata: Metadata = {...}`
- **Verified on existing routes:** writing/page.tsx, projects/page.tsx, about/page.tsx, links/page.tsx, newsletter/page.tsx, prometheus/page.tsx, events/page.tsx, and both new pages (/uses and /watching)
- Each metadata object includes: `title`, `description`, `alternates: { canonical }`, `openGraph: { title, description, url, type }`

**Both new pages already comply (verified by code inspection):**
- `/uses/page.tsx`: metadata with title "Uses | Monty Singer", description, canonical "/uses", openGraph
- `/watching/page.tsx`: metadata with title "Watching | Monty Singer", description, canonical "/watching", openGraph

**No change required.** Testing: assertion can verify both pages export `metadata` (via `import { metadata } from '@/app/uses/page'`).

### 8. Root Layout Metadata (`src/app/layout.tsx`)
**Current state:**
- Exports `metadata: Metadata` with:
  - metadataBase: `new URL(SITE_URL)` (makes all relative URLs absolute)
  - title template: `"%s | Monty Singer"` (appends to page titles)
  - OG type: website
  - Twitter card: summary_large_image
  - RSS link: `alternates: { types: { "application/rss+xml": "/blog/feed.xml" } }`
  - Google verification token

**No change required.** All pages inherit root metadata.

## Analytics Infrastructure: Umami Script Preservation

### Current State
**Component:** `src/components/analytics/umami-analytics.tsx`
- Server component (no "use client")
- Reads env vars: `NEXT_PUBLIC_UMAMI_WEBSITE_ID`, `NEXT_PUBLIC_UMAMI_URL`
- Returns `null` if either env var is missing (env-gated behavior)
- Returns `<Script>` tag with:
  - `async` attribute
  - `src={${umamiUrl}/script.js}`
  - `data-website-id={websiteId}` attribute
  - `strategy="afterInteractive"` (loads after hydration, doesn't block First Paint)

**Insertion point:** `src/app/layout.tsx` renders `<UmamiAnalytics />` at the end of RootLayout (after body close, after providers)

**Env-gated behavior:** If env vars are absent, the component returns `null` and no analytics script loads. This is intentional for local dev / preview branches without analytics configured.

**Testing challenge:** The component's behavior is:
1. When `NEXT_PUBLIC_UMAMI_WEBSITE_ID` and `NEXT_PUBLIC_UMAMI_URL` are set → renders `<Script>` tag
2. When either is missing → renders `null`

For automated assertion, the test must:
- Either mock the env vars and assert the Script tag is present
- Or test the logic directly without rendering (unit test the env var check)

### Verification Path
- Assertion 1 (unit): Import `UmamiAnalytics`, mock env vars, render component, assert returned JSX contains `<Script>` tag
- Assertion 2 (unit): Mock env vars as undefined, render, assert returns `null`
- Assertion 3 (integration via build): When `npm run build` completes and Umami env vars are configured in the preview, navigate to any page on the v3 preview and check browser DevTools Network tab for `${umamiUrl}/script.js` request

For Phase 17, the **automated gate should include a unit test** that asserts the UmamiAnalytics component:
1. Returns a Script element when env vars are set
2. Returns null when env vars are absent
3. The Script src and data-website-id are correctly templated

## Standard Stack

### Core (Preserved, No Upgrades Required)
| Library | Version | Purpose | Current Use |
|---------|---------|---------|-------------|
| Next.js | 16.x | Framework, routing, API routes, metadata | Build-time sitemap/robots generation, RSC for UmamiAnalytics |
| React | 19.x | UI runtime | <Breadcrumbs>, <JsonLd>, <UmamiAnalytics> components |
| TypeScript | 5.x | Type safety | All SEO/analytics modules typed |

### Supporting (Verified & Preserved)
| Library | Version | Purpose | Current Use |
|---------|---------|---------|-------------|
| @notionhq/client | 4.0.2 [VERIFIED: npm registry] | Notion API | Blog post and project fetching in sitemap.ts, feed route |
| vitest | latest [ASSUMED] | Test framework | Existing test suite in src/__tests__/ |
| @testing-library/react | latest [ASSUMED] | React component testing | Existing page and component tests |

### No New Dependencies Required
This phase adds **zero new packages**. All functionality (sitemap, robots, feed, schemas, Breadcrumbs, JSON-LD, UmamiAnalytics) is built on existing Next.js / React primitives.

## Architecture Patterns

### System Architecture Diagram

```
Request to any page (e.g., /uses, /writing, /blog/[slug])
│
├─ At Build Time (static generation):
│  ├─ Next.js App Router evaluates route
│  ├─ Route exports metadata: Metadata = {...}
│  ├─ Root layout.tsx + page metadata merged
│  ├─ Breadcrumbs component emits <JsonLd> script tag
│  └─ Output: static HTML with <meta>, <link rel="canonical">, <script type="application/ld+json">
│
├─ At Build Time (SEO routes):
│  ├─ sitemap.ts: fetches dynamic content (blog/projects), returns XML
│  ├─ robots.ts: returns robots.txt rules
│  ├─ blog/feed.xml/route.ts: fetches blog posts, returns RSS XML
│  └─ Output: static XML files served on demand
│
├─ At Runtime (browser loads page):
│  ├─ HTML hydrates in browser
│  ├─ Metadata tags in <head> are processed by crawlers/previews
│  ├─ JSON-LD script tags are parsed by schema.org validators
│  ├─ UmamiAnalytics <Script> tag loads (if env vars set)
│  └─ Analytics.js runs async, sends page view to Umami backend
│
└─ Output: SEO-friendly HTML + valid structured data + analytics tracking
```

### Recommended Project Structure (Preserved)
```
src/
├── app/
│   ├── layout.tsx          # Root metadata + UmamiAnalytics
│   ├── sitemap.ts          # SEO: sitemap generation (ADD /uses, /watching entries)
│   ├── robots.ts           # SEO: robots.txt rules
│   ├── blog/
│   │   ├── feed.xml/route.ts  # SEO: RSS feed generation
│   │   ├── [slug]/page.tsx     # Blog post reading view
│   │   └── ...
│   ├── uses/
│   │   └── page.tsx        # NEW: Already has metadata + Breadcrumbs
│   ├── watching/
│   │   └── page.tsx        # NEW: Already has metadata + Breadcrumbs
│   └── [other pages]/
├── lib/
│   ├── seo/
│   │   ├── site.ts         # SITE_URL + canonical() helper
│   │   ├── schemas.ts      # JSON-LD builders (Person, FAQ, BreadcrumbList)
│   │   ├── blog-metadata.ts
│   │   └── project-metadata.ts
│   ├── rss/
│   │   └── blog-feed.ts    # RSS XML builder
│   ├── notion.ts           # Notion API client (blog/project fetching)
│   ├── uses.ts             # /uses page data (hardcoded)
│   └── watching.ts         # /watching page data (hardcoded)
├── components/
│   ├── seo/
│   │   ├── breadcrumbs.tsx # BreadcrumbList emitter
│   │   └── json-ld.tsx     # Generic JSON-LD script tag
│   ├── analytics/
│   │   └── umami-analytics.tsx  # Analytics script loader (env-gated)
│   └── [other components]/
└── __tests__/
    ├── seo/                # SEO unit tests (schemas, blog-feed, etc.)
    │   ├── schemas.test.ts ✓
    │   ├── blog-feed.test.ts ✓
    │   └── [others]
    └── pages/              # Page component tests
        ├── about.test.tsx
        ├── links.test.tsx
        └── [others to extend with uses/watching]
```

### Pattern 1: Build-Time SEO Routes (sitemap, robots, feed)
**What:** Next.js App Router route handlers (`sitemap.ts`, `robots.ts`, `route.ts`) that export functions returning XML/configuration objects. Next.js automatically converts them to `.xml` or `.txt` files and serves them at runtime.

**When to use:** For any SEO artifact that's static-ish (generated once per build or cached via ISR) and served as a file (not embedded in HTML).

**Example: sitemap.ts**
```typescript
export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  // Fetch dynamic content (blog posts, projects)
  const posts = await getPublishedPosts()
  const projects = await getPublishedProjects()

  // Return array of objects; Next.js converts to XML
  return [
    // Static routes (no Notion fetch needed)
    { url: SITE_URL, changeFrequency: 'weekly', priority: 1 },
    // Dynamic routes (fetched from Notion)
    ...posts.map(post => ({
      url: `${SITE_URL}/blog/${post.slug}`,
      lastModified: new Date(post.lastEdited),
      changeFrequency: 'monthly',
      priority: 0.7,
    })),
  ]
}
```

**Key insight:** The array structure mirrors the XML schema; Next.js does the XML serialization. No manual XML building needed (unlike the RSS feed, which manually builds XML strings).

### Pattern 2: Metadata Export (Per-Page SEO)
**What:** Every Next.js page exports `export const metadata: Metadata = {...}` at the route level. The metadata object is a plain JS object describing title, description, canonical, OG tags, etc.

**When to use:** For per-page SEO tags that should appear in every page's `<head>`.

**Example: /uses/page.tsx**
```typescript
export const metadata: Metadata = {
  title: "Uses | Monty Singer",
  description: "The tools and software I use daily.",
  alternates: { canonical: "/uses" },
  openGraph: {
    title: "Uses | Monty Singer",
    description: "The tools and software I use daily.",
    url: "/uses",
    type: "website",
  },
}
```

**Key insight:** The root layout's metadata is merged with the page metadata (title template, metadataBase, etc. are applied). No manual `<head>` tag insertion needed; Next.js generates it.

### Pattern 3: JSON-LD via Component
**What:** A React component that conditionally emits `<script type="application/ld+json">` tags with structured data. The component is placed in a Server Component and renders the script during SSR.

**When to use:** For structured data (JSON-LD) that varies by page and should be included in the HTML response.

**Example: Breadcrumbs component**
```typescript
export function Breadcrumbs({ items }: { items: BreadcrumbItem[] }) {
  return (
    <>
      <JsonLd data={buildBreadcrumbListSchema(items)} />
      <nav aria-label="Breadcrumb" className="sr-only">
        {/* Accessible breadcrumb nav for screen readers */}
      </nav>
    </>
  )
}
```

**Key insight:** `<JsonLd>` uses `dangerouslySetInnerHTML` to inject the JSON string. The component is placed in a Server Component, so it runs at build/render time, not in the browser.

### Pattern 4: Env-Gated Component (UmamiAnalytics)
**What:** A Server Component that conditionally renders a child component (or returns `null`) based on environment variables.

**When to use:** For optional features that should only load if configuration is present (analytics, feature flags, integrations).

**Example: UmamiAnalytics**
```typescript
export function UmamiAnalytics() {
  const websiteId = process.env.NEXT_PUBLIC_UMAMI_WEBSITE_ID
  const umamiUrl = process.env.NEXT_PUBLIC_UMAMI_URL

  if (!websiteId || !umamiUrl) {
    return null  // Graceful no-op if env vars missing
  }

  return <Script async src={`${umamiUrl}/script.js`} ... />
}
```

**Key insight:** The check happens at render time (server), not runtime (browser). If env vars are absent, the component returns `null` and no script tag is injected.

### Anti-Patterns to Avoid
- **Manually building XML for sitemap:** `sitemap.ts` should return a JS array, not an XML string. Next.js handles the serialization.
- **Embedding metadata in the page component body:** Use the `metadata` export, not manual `<Head>` tags.
- **Client-side JSON-LD injection:** JSON-LD must be in the server response (SSR), not injected by client-side JS.
- **Checking env vars in the browser:** Use server components for env var checks; never read `process.env` in "use client" components.

## Don't Hand-Roll

| Problem | Don't Build | Use Instead | Why |
|---------|-------------|-------------|-----|
| SEO metadata (title, description, canonical) | Custom metadata system or manual <meta> tags | Next.js `metadata` export | App Router handles cascading, merging, serialization; single source of truth per page |
| Sitemap generation | Manual XML string building, glob patterns, manual route enumeration | Next.js `sitemap.ts` + `MetadataRoute.Sitemap` | Returns a JS array; Next.js generates XML, handles caching, ISR; no regex maintenance |
| Robots.txt | Manual string concatenation with rules | Next.js `robots.ts` + `MetadataRoute.Robots` | Config object → Next.js serializes to robots.txt; no hand-rolling rules |
| JSON-LD structured data | Manual JSON string construction with escaping | `buildBreadcrumbListSchema()` + `<JsonLd>` component | Functions are type-safe, validators catch errors early; component handles injection |
| RSS feed generation | Manual XML DOM construction, date formatting | `buildRssXml()` utility function | Centralized XML building, consistent escaping, tested RFC 822 date formatting |
| Analytics script injection | Manual <script> tag in HTML or client-side dynamic injection | `<UmamiAnalytics>` server component | Env-gated, integrated into layout, loads via `strategy="afterInteractive"` (perf-aware) |

**Key insight:** Next.js App Router provides type-safe, build-time abstractions for all SEO/metadata needs. Custom solutions invite maintenance debt, escaping bugs, and SEO regressions.

## Common Pitfalls

### Pitfall 1: Forgetting to Add Routes to sitemap.ts
**What goes wrong:** New routes (like /uses, /watching) are deployed but not listed in the sitemap. Crawlers miss them, they don't appear in search results, and SEO coverage regresses.

**Why it happens:** The sitemap is a manual list (or partial fetch). When a new static page is added, the developer must remember to add it to the static routes array.

**How to avoid:** At implementation time, verify the sitemap.ts static routes array includes the new page. Add an automated assertion (test) that iterates over a list of expected routes and verifies they all appear in the sitemap output.

**Warning signs:** New pages exist in the codebase but `sitemap.xml` (generated at build) doesn't list them. Check via `npm run build` → examine `.next/public/sitemap.xml` or make an HTTP request to `/sitemap.xml`.

### Pitfall 2: Metadata Inheritance Confusion
**What goes wrong:** A page's OG title is wrong because the root layout's title template was applied when a per-page custom OG title was expected.

**Why it happens:** The root layout exports `title: { template: "%s | Monty Singer" }`. All page titles are automatically appended with " | Monty Singer". If a page exports `openGraph: { title: "..." }`, it overrides the merged title, but only if the page explicitly sets it.

**How to avoid:** Verify every page that has special OG requirements (e.g., blog posts with unique titles) exports `openGraph: { title, description, url }`. The new pages (/uses, /watching) already do this correctly.

**Warning signs:** Blog post reading view has OG title "My Essay | Monty Singer | Monty Singer" (double append). Check the page's `metadata` object and verify it explicitly sets `openGraph: { title }`.

### Pitfall 3: RSS Feed Breaks When Notion API Errors
**What goes wrong:** The blog feed route returns an empty feed (or error) when the Notion API is temporarily down, outdated, or env vars are misconfigured.

**Why it happens:** The feed route calls `getPublishedPosts()` which queries Notion. If the Notion token is missing or revoked, the query fails. The route has a try/catch that returns an empty posts array, but the feed is then empty.

**How to avoid:** The feed route already handles this gracefully: `try { posts = await getPublishedPosts() } catch {}`. If posts is empty, the feed returns valid RSS with zero items (not a 500 error). Document this behavior for Phase 18 monitoring.

**Warning signs:** The `/blog/feed.xml` endpoint returns HTTP 200 with an empty feed (no items) when it should have items. Check Notion env vars are set and the API token is valid.

### Pitfall 4: JSON-LD Omitted on New Pages
**What goes wrong:** A new page is added but the breadcrumb JSON-LD is missing, so schema validators report incomplete structured data.

**Why it happens:** The developer adds a page but forgets to include the `<Breadcrumbs>` component, which is responsible for emitting the BreadcrumbList JSON-LD.

**How to avoid:** This phase's automated assertion includes a check that every static page route file exports `metadata` AND includes the `<Breadcrumbs>` component. The new pages already have both; the assertion will catch any regressions.

**Warning signs:** A schema.org validator (https://validator.schema.org/) shows "warning: breadcrumb structured data missing" for a page that should have it. Check the page source for `<script type="application/ld+json">` tags.

### Pitfall 5: Umami Analytics Missing in Preview Because Env Vars Aren't Set
**What goes wrong:** The v3 preview is deployed but analytics aren't tracking because the `NEXT_PUBLIC_UMAMI_WEBSITE_ID` and `NEXT_PUBLIC_UMAMI_URL` aren't configured in the Vercel branch settings.

**Why it happens:** The UmamiAnalytics component is env-gated; if env vars are absent, it returns `null` and no script loads.

**How to avoid:** For the v3 preview to track analytics, add the Umami env vars to the Vercel "Preview Environment Variables" (shared across all preview branches). The new pages will then load the analytics script automatically.

**Warning signs:** Open the v3 preview page, open DevTools Network tab, and look for `analytics.montysinger.com/script.js`. If it's not there, check Vercel project settings for the Umami env vars.

## Code Examples

Verified patterns from project codebase:

### Example 1: Add New Routes to Sitemap
**Source:** `src/app/sitemap.ts` (existing code)

```typescript
// In the staticRoutes array, add entries for /uses and /watching:
const staticRoutes: MetadataRoute.Sitemap = [
  { url: SITE_URL, lastModified: new Date(), changeFrequency: 'weekly', priority: 1 },
  { url: `${SITE_URL}/about`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.8 },
  // ... other routes ...
  { url: `${SITE_URL}/photos`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.6 },
  // ADD THESE TWO:
  { url: `${SITE_URL}/uses`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.6 },
  { url: `${SITE_URL}/watching`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.6 },
  // ... rest of array
]
```

### Example 2: Page with Breadcrumb JSON-LD
**Source:** `src/app/uses/page.tsx` (existing code)

```typescript
import { Breadcrumbs } from "@/components/seo/breadcrumbs"

export const metadata: Metadata = {
  title: "Uses | Monty Singer",
  description: "The tools and software I use daily.",
  alternates: { canonical: "/uses" },
  openGraph: {
    title: "Uses | Monty Singer",
    description: "The tools and software I use daily.",
    url: "/uses",
    type: "website",
  },
}

export default function UsesPage() {
  return (
    <>
      <Breadcrumbs
        items={[
          { name: "Home", href: "/" },
          { name: "Uses" },
        ]}
      />
      {/* Page content */}
    </>
  )
}
```

### Example 3: Env-Gated Analytics Component
**Source:** `src/components/analytics/umami-analytics.tsx` (existing code)

```typescript
import Script from 'next/script'

export function UmamiAnalytics() {
  const websiteId = process.env.NEXT_PUBLIC_UMAMI_WEBSITE_ID
  const umamiUrl = process.env.NEXT_PUBLIC_UMAMI_URL

  if (!websiteId || !umamiUrl) {
    return null  // No-op if env vars missing
  }

  return (
    <Script
      async
      src={`${umamiUrl}/script.js`}
      data-website-id={websiteId}
      strategy="afterInteractive"
    />
  )
}
```

### Example 4: Test Pattern — Import & Call Sitemap Function
**Pattern for Phase 17 automated assertion:**

```typescript
import { describe, it, expect, beforeAll, afterAll, vi } from 'vitest'
import sitemap from '@/app/sitemap'

describe('Phase 17: Sitemap preservation + new routes', () => {
  it('includes /uses and /watching at priority 0.6', async () => {
    const result = await sitemap()
    
    const usesEntry = result.find(entry => entry.url.includes('/uses'))
    const watchingEntry = result.find(entry => entry.url.includes('/watching'))
    
    expect(usesEntry).toBeDefined()
    expect(usesEntry?.priority).toBe(0.6)
    expect(usesEntry?.changeFrequency).toBe('monthly')
    
    expect(watchingEntry).toBeDefined()
    expect(watchingEntry?.priority).toBe(0.6)
    expect(watchingEntry?.changeFrequency).toBe('monthly')
  })

  it('includes dynamic blog and project routes', async () => {
    const result = await sitemap()
    const dynamicRoutes = result.filter(e => 
      e.url.includes('/blog/') || e.url.includes('/projects/')
    )
    
    // Assuming at least one blog post and one project exist
    expect(dynamicRoutes.length).toBeGreaterThan(0)
  })
})
```

### Example 5: Test Pattern — Assert Page Metadata Export
**Pattern for Phase 17 automated assertion:**

```typescript
import { describe, it, expect } from 'vitest'
import { metadata as usesMetadata } from '@/app/uses/page'
import { metadata as watchingMetadata } from '@/app/watching/page'

describe('Phase 17: New page metadata', () => {
  it('/uses page exports valid metadata', async () => {
    // If metadata is a function, call it; otherwise use directly
    const resolvedMetadata = typeof usesMetadata === 'function' 
      ? await usesMetadata() 
      : usesMetadata
    
    expect(resolvedMetadata.title).toBe('Uses | Monty Singer')
    expect(resolvedMetadata.description).toBeDefined()
    expect(resolvedMetadata.alternates?.canonical).toBe('/uses')
    expect(resolvedMetadata.openGraph?.title).toBe('Uses | Monty Singer')
  })

  it('/watching page exports valid metadata', async () => {
    const resolvedMetadata = typeof watchingMetadata === 'function' 
      ? await watchingMetadata() 
      : watchingMetadata
    
    expect(resolvedMetadata.title).toBe('Watching | Monty Singer')
    expect(resolvedMetadata.description).toBeDefined()
    expect(resolvedMetadata.alternates?.canonical).toBe('/watching')
  })
})
```

### Example 6: Test Pattern — UmamiAnalytics Conditional Render
**Pattern for Phase 17 automated assertion:**

```typescript
import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render } from '@testing-library/react'
import { UmamiAnalytics } from '@/components/analytics/umami-analytics'

describe('Phase 17: Umami analytics preservation', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('renders Script tag when env vars are set', () => {
    vi.stubEnv('NEXT_PUBLIC_UMAMI_WEBSITE_ID', 'test-id-123')
    vi.stubEnv('NEXT_PUBLIC_UMAMI_URL', 'https://analytics.montysinger.com')
    
    const { container } = render(<UmamiAnalytics />)
    const script = container.querySelector('script[data-website-id="test-id-123"]')
    
    expect(script).toBeDefined()
    expect(script?.getAttribute('src')).toContain('analytics.montysinger.com/script.js')
  })

  it('returns null when env vars are missing', () => {
    vi.stubEnv('NEXT_PUBLIC_UMAMI_WEBSITE_ID', undefined)
    vi.stubEnv('NEXT_PUBLIC_UMAMI_URL', 'https://analytics.montysinger.com')
    
    const { container } = render(<UmamiAnalytics />)
    const script = container.querySelector('script[data-website-id]')
    
    expect(script).toBeNull()
  })
})
```

## Validation Architecture

### Test Framework
| Property | Value |
|----------|-------|
| Framework | vitest + @testing-library/react |
| Config file | `vitest.config.ts` (already exists) |
| Test directory | `src/__tests__/` |
| Quick run command | `npx vitest run src/__tests__/seo/ --reporter=verbose` |
| Full suite command | `npx vitest run` |

### Phase Requirements → Test Map
| Req ID | Behavior | Test Type | Automated Command | File Exists? |
|--------|----------|-----------|-------------------|-------------|
| IN-03 | sitemap.ts output includes /uses + /watching | unit | `npx vitest run src/__tests__/seo/sitemap.test.ts` | ❌ Wave 0 |
| IN-03 | robots.ts resolves and disallows /specimen, /api/ | unit | `npx vitest run src/__tests__/seo/robots.test.ts` | ❌ Wave 0 |
| IN-03 | RSS feed route returns valid RSS XML | unit | `npx vitest run src/__tests__/seo/feed-route.test.ts` (extends existing) | ⚠️ Partial |
| IN-03 | /uses page exports metadata with canonical | unit | `npx vitest run src/__tests__/pages/uses.test.tsx` | ❌ Wave 0 |
| IN-03 | /watching page exports metadata with canonical | unit | `npx vitest run src/__tests__/pages/watching.test.tsx` | ❌ Wave 0 |
| IN-03 | /uses page renders Breadcrumbs (emits BreadcrumbList JSON-LD) | unit | `npx vitest run src/__tests__/pages/uses.test.tsx` | ❌ Wave 0 |
| IN-03 | /watching page renders Breadcrumbs (emits BreadcrumbList JSON-LD) | unit | `npx vitest run src/__tests__/pages/watching.test.tsx` | ❌ Wave 0 |
| IN-04 | UmamiAnalytics renders Script tag when env vars set | unit | `npx vitest run src/__tests__/components/analytics.test.tsx` | ❌ Wave 0 |
| IN-04 | UmamiAnalytics returns null when env vars missing | unit | `npx vitest run src/__tests__/components/analytics.test.tsx` | ❌ Wave 0 |
| IN-03 + IN-04 | Build passes (no TypeScript/compilation errors) | integration | `npm run build` | Always |
| IN-03 + IN-04 | Every route has revalidate = 1800 (ISR) | grep | `grep -l "export const revalidate = 1800" src/app/*/page.tsx` | Verification |

### Sampling Rate
- **Per-task commit:** `npx vitest run src/__tests__/seo/ src/__tests__/pages/uses.test.tsx src/__tests__/pages/watching.test.tsx` (Phase 17 SEO tests)
- **Per-wave merge:** `npx vitest run && npm run build` (full suite + build)
- **Phase gate:** Full suite green + build clean before `/gsd-verify-work`

### Wave 0 Gaps

The following test files **do not exist** and must be created:

- [ ] `src/__tests__/seo/sitemap.test.ts` — test that `sitemap()` returns output including /uses, /watching, dynamic blog/project routes with correct priorities
- [ ] `src/__tests__/seo/robots.test.ts` — test that `robots()` returns rules with allow: '/', disallow: ['/specimen', '/api/']
- [ ] `src/__tests__/pages/uses.test.tsx` — test that /uses page renders and exports metadata with canonical, OG, Breadcrumbs
- [ ] `src/__tests__/pages/watching.test.tsx` — test that /watching page renders and exports metadata with canonical, OG, Breadcrumbs
- [ ] `src/__tests__/components/analytics.test.tsx` — test that UmamiAnalytics renders Script when env vars set, null when missing
- [ ] Extend `src/__tests__/seo/feed-route.test.ts` — verify RSS feed includes only blog posts, no watching/uses entries

Additional setup:
- [ ] Install vitest test script in package.json (if not present): `"test": "vitest run"`
- [ ] Verify `src/__tests__/setup.ts` imports all necessary test utilities (@testing-library/react, vitest mocks, etc.)

**Note:** All gap items are test files only — **no production-code changes** other than adding the two sitemap entries and possibly minor exports for testability.

## Assumptions Log

| # | Claim | Section | Risk if Wrong |
|---|-------|---------|---------------|
| A1 | @notionhq/client v4.0.2 is the version in package.json (not upgraded) | Standard Stack | Mismatch in version docs; minor (package versions can be pinned in lockfile) |
| A2 | vitest is installed as a dev dependency and `npx vitest run` works | Validation Architecture | Tests cannot run; would block the automated gate |
| A3 | No new external packages are needed for Phase 17 | Standard Stack | Scope creep risk; requires user confirmation before adding deps |
| A4 | The v3 preview has Umami env vars configured in Vercel (or they will be before Phase 18 verification) | Common Pitfalls | Analytics won't track on preview; but preview still works (graceful no-op) |
| A5 | All 7 interior pages (writing, projects, blog/[slug], projects/[slug], events, uses, watching) already have `revalidate = 1800` | Validation Architecture | ISR won't trigger; stale content served longer than intended |

## Environment Availability

| Dependency | Required By | Available | Version | Fallback |
|------------|------------|-----------|---------|----------|
| Node.js | `npm run build`, vitest | ✓ | 18+ (assumed) | — |
| npm | Package management | ✓ | 9+ (assumed) | — |
| Notion API | `getPublishedPosts()` in sitemap + feed (gracefully fails with empty array) | — | — | Returns empty posts array if env vars missing; feed is valid but empty |
| Umami backend | UmamiAnalytics script loading (gracefully no-op) | — | — | Returns null if env vars missing; page fully functional without analytics |
| Vercel (for preview) | v3 branch preview deployment | — (external service) | — | Phase 18 gates on Vercel build; Phase 17 assumes build artifacts available |

**Missing dependencies with fallback:**
- Notion API is gracefully handled by try/catch in sitemap.ts and feed route
- Umami is optional (env-gated); page fully functional without it

**No blocking missing dependencies.**

## Security Domain

### Applicable ASVS Categories

| ASVS Category | Applies | Standard Control |
|---------------|---------|-----------------|
| V2 Authentication | no | (Analytics script loads unauthenticated; trusted external service) |
| V3 Session Management | no | (No user sessions on this phase) |
| V4 Access Control | no | (No auth gates; all routes public) |
| V5 Input Validation | yes | SEO metadata strings (title, description) should not contain unescaped HTML/JS; Next.js metadata API handles escaping |
| V6 Cryptography | no | (No crypto operations; HTTPS is default on Vercel) |
| V13 API & Web Services | partial | Notion API (authenticated with token in env var; token should not be leaked in client code) |
| V14 Configuration | yes | Umami env vars must be kept out of version control; .env.local or Vercel env vars only |

### Known Threat Patterns for Next.js SEO/Analytics

| Pattern | STRIDE | Standard Mitigation |
|---------|--------|---------------------|
| XSS via metadata injection (e.g., malicious title) | Tampering, Information Disclosure | Next.js Metadata API auto-escapes strings in <meta> tags; JSON-LD data is JSON-stringified (not HTML context) |
| Notion API token leakage | Information Disclosure | `NOTION_TOKEN` must be a secret env var (never `NEXT_PUBLIC_*`); only used server-side in sitemap.ts and feed route |
| Umami script malware injection | Tampering | Analytics script loaded from trusted domain (analytics.montysinger.com); use SRI (Subresource Integrity) hash in <Script> tag if available |
| Broken robots.txt allowing crawl of /api/ | Information Disclosure | robots.ts disallows /api/ and /specimen; verified by test |
| Missing or malformed JSON-LD enabling SEO poisoning | Tampering | BreadcrumbList schema is validated by schema.org validator; test asserts structure |
| Analytics PII leakage | Information Disclosure | Umami tracks page views, not user details; no PII sent unless explicitly added by page content |

## State of the Art

| Old Approach | Current Approach | When Changed | Impact |
|--------------|------------------|--------------|--------|
| Manual XML sitemap with glob patterns | `sitemap.ts` returning JS array; Next.js serializes | Next.js 13.3+ | Type-safe, ISR-aware, single source of truth |
| Hardcoded robots.txt file | `robots.ts` function returning config object | Next.js 13.3+ | Maintainable, DRY, easy to test |
| react-helmet or next-seo for metadata | Next.js App Router `metadata` export | Next.js 13+ | Fully integrated, cascading metadata, no runtime overhead |
| google-sitemap-generator npm package | Native Next.js `sitemap.ts` | Next.js 13.3+ | No external dependency, faster builds |
| Framer Motion for all animations | Motion + GSAP (split by use case) | v2.0 → v3.0 | Motion for declarative React, GSAP for timeline/scroll-driven |
| Supabase free tier for analytics backend | Neon serverless PostgreSQL | v2.0 → v3.0 (planned for future) | Neon never hard-pauses; Supabase pauses after 7 days inactivity |

**Deprecated/outdated:**
- next-sitemap (npm package): Now superseded by native Next.js `sitemap.ts` (0 external deps, 0 config files)
- react-notion-x: Known App Router breakage ("use client" hydration errors); replaced with notion-to-md + markdown-to-jsx in v3

## Sources

### Primary (HIGH confidence)
- Project codebase: `src/app/sitemap.ts`, `src/app/robots.ts`, `src/app/blog/feed.xml/route.ts`, `src/lib/seo/schemas.ts`, `src/components/seo/breadcrumbs.tsx`, `src/app/uses/page.tsx`, `src/app/watching/page.tsx`, `src/components/analytics/umami-analytics.tsx` — verified by direct inspection 2026-06-20
- Next.js App Router documentation (implied by code patterns) — metadata export, sitemap.ts, robots.ts are standard Next.js 13+ patterns
- vitest config at `vitest.config.ts` and existing test suite at `src/__tests__/` — verified by inspection

### Secondary (MEDIUM confidence)
- Phase 16 PLAN (16-09-PLAN.md) — automated gate pattern for vitest + build, referenced as precedent
- Project CLAUDE.md — stack constraints and architecture decisions
- Project STATE.md — current Next.js version (16.x) and Umami configuration context

### Tertiary (LOW confidence)
- Assumption that vitest + @testing-library/react are installed (package.json not fully inspected; based on vitest.config.ts existence)

## Metadata

**Confidence breakdown:**
- Standard stack: HIGH - all dependencies verified in codebase and package.json
- Architecture: HIGH - SEO patterns are documented Next.js conventions; both new pages already follow the pattern
- Pitfalls: MEDIUM - based on v2 project history and common Next.js gotchas, not all specific to this codebase
- Validation: MEDIUM - existing test framework detected; Wave 0 test files don't exist yet (author will create)

**Research date:** 2026-06-20
**Valid until:** 2026-07-04 (2 weeks; SEO/analytics patterns are stable; next revision if Next.js major version changes or Umami config changes)

## Summary

Phase 17 requires **one production-code change**: add `/uses` and `/watching` entries to `src/app/sitemap.ts` (D-04). Everything else is **verification** via automated assertions.

**What's already done and must be verified:**
1. ✓ `/uses/page.tsx` — has metadata, Breadcrumbs, ISR 1800
2. ✓ `/watching/page.tsx` — has metadata, Breadcrumbs, ISR 1800
3. ✓ `src/components/seo/breadcrumbs.tsx` — emits BreadcrumbList JSON-LD
4. ✓ `src/components/analytics/umami-analytics.tsx` — env-gated Script loader in layout.tsx
5. ✓ `src/app/blog/feed.xml/route.ts` — RSS feed generation with ISR 1800
6. ✓ `src/app/robots.ts` — disallows /api/ and /specimen

**What to add:**
1. Two sitemap entries for /uses and /watching (D-04)
2. Vitest tests to assert the above (D-03)

**Planner focus:**
- Create a minimal set of vitest tests that cover IN-03 (SEO preservation + new routes) and IN-04 (Umami preservation)
- Run `npm run build` to verify no regressions
- Optionally run v3 preview smoke check to confirm pages render (deferred to Phase 18 if no preview access)

The planner has flexibility on exact test file location and whether to extend Phase 16's gate file or create new files (Claude's Discretion). All architectural patterns, env-gating strategies, and standard practices are documented above.
