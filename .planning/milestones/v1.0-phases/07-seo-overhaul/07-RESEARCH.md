# Phase 7: SEO Overhaul - Research

**Researched:** 2026-04-15
**Approach:** Targeted codebase exploration (gsd-phase-researcher agent timed out; orchestrator produced this research directly after focused Grep/Read on actual app routes, layout, notion helpers, sitemap, robots, nav, and home components).

## RESEARCH COMPLETE

---

## Summary

The site is **Next.js 16.2.1 App Router** with full framework-native SEO primitives already wired up:

- `src/app/layout.tsx` exports a typed `Metadata` with `metadataBase` and a title template.
- `src/app/sitemap.ts` already calls `getPublishedPosts()` + `getPublishedProjects()` and emits `MetadataRoute.Sitemap`.
- `src/app/robots.ts` already emits `MetadataRoute.Robots`.
- `src/app/opengraph-image.tsx` exists at the root (and `src/app/blog/[slug]/opengraph-image.tsx` overrides per-post).
- Blog and project detail pages already use async `generateMetadata({ params })`.
- `src/utils/reading-time.ts` already has both `calculateReadingTime(blocks)` and `estimateReadingTime(text)`.

The work is overwhelmingly **surgical edits, metadata additions, three new routes, and shared helpers** — not greenfield scaffolding. However, there is real baggage to clean up: the current copy violates D-03 (NYC location mentioned everywhere), D-05 (past identity as "investor"), and D-01 (em dashes in title templates and prose).

**Baseline URL constant** (`SITE_URL`) currently defaults to `https://msizzle.com` in `sitemap.ts` and `robots.ts`. Per STATE.md D-04 and project memory, the production domain is **montysinger.com** — planner should fix this at the source during infra work.

---

## Focus Area Findings

### 1. Next.js 16 App Router metadata patterns

**Pattern to adopt:** per-route `generateMetadata()` for dynamic routes, `export const metadata` for static routes. Both are already in use — no new convention needed.

- **Root** (`src/app/layout.tsx:23-42`): static `export const metadata: Metadata` with `metadataBase`, title template, default openGraph + twitter. **Must fix:** description copy (D-03, D-05 violations), em-dash in title template (D-01 violation — `%s — Monty Singer` should become `%s | Monty Singer` per D-07).
- **Blog detail** (`src/app/blog/[slug]/page.tsx:27-38`): async `generateMetadata({ params })`. Currently returns `title: '${post.title} — Monty Singer'` (em dash violation, D-01). Needs full OG block + canonical per D-07, D-08, D-09, D-10.
- **Project detail** (`src/app/projects/[slug]/page.tsx:19-34`): same pattern, same em-dash issue, same gaps.
- **Blog index** (`src/app/blog/page.tsx:9-12`): static `export const metadata` — em-dash + thin.
- **About** (`src/app/about/page.tsx:3-6`): static `export const metadata` — em-dash + D-05 violation.
- **Projects index, Events, Links** — unchecked but expected to follow same pattern.

**Canonical URL generation:** use `alternates.canonical` in Metadata object:
```ts
alternates: {
  canonical: new URL(`/blog/${slug}`, 'https://montysinger.com').toString()
}
```
Since `metadataBase` is set on the root, `alternates.canonical` can be a relative path in most places.

**RSS discovery `<link rel="alternate">`:** add to root layout `metadata.alternates.types`:
```ts
alternates: {
  canonical: '/',
  types: { 'application/rss+xml': '/blog/feed.xml' }
}
```

### 2. JSON-LD in App Router — pattern to standardize

Two instances already exist, both using inline `<script type="application/ld+json" dangerouslySetInnerHTML>`:
- `src/app/page.tsx:62-65` (homepage Person schema)
- `src/app/about/page.tsx:30-33` (duplicate Person schema — should be **removed** from About; D-13 says homepage only, and BreadcrumbList is what About needs)

**Recommendation:** create a single helper component `src/components/seo/json-ld.tsx`:
```tsx
export function JsonLd({ data }: { data: Record<string, unknown> }) {
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
    />
  )
}
```
Render as a server component child anywhere. Centralize schema builders in `src/lib/seo/schemas.ts`:
- `buildPersonSchema()` (homepage only)
- `buildFaqPageSchema(faqs)` (/prometheus)
- `buildBreadcrumbListSchema(items)` (every page except homepage)

**Important:** the existing Person schemas set `jobTitle: "Investor"` and `description: "Investor, builder, and lifelong learner based in NYC."` — **both violate D-05 and D-03**. Replace with the exact D-13 payload.

### 3. Sitemap extension

`src/app/sitemap.ts` is 46 lines and already handles Notion failure gracefully (try/catch around each fetch). Extension is trivial:
1. Fix `SITE_URL` default to `https://montysinger.com`.
2. Add `{url: '${SITE_URL}/prometheus', ...}`, `/newsletter`, `/uses`, `/events` to `staticRoutes`.
3. No changes needed to post/project loops.

### 4. Substack RSS ingestion for Monty Monthly carousel

**No RSS parser currently installed** (`rss-parser` is absent from package.json). Recommended addition: `rss-parser@3.x` — 7kb gzipped, zero dependencies beyond `xml2js`, handles `enclosure` and `media:thumbnail` natively, works fine in server components (no browser globals).

Alternative: `fast-xml-parser` is already a transitive dep via Notion SDK — could hand-roll thumbnail extraction. But `rss-parser` is 15 lines shorter and more maintainable.

**ISR pattern** (already the project's standard — see `revalidate = 1800` on all pages):
```ts
// src/lib/rss/substack.ts
import Parser from 'rss-parser'
const parser = new Parser({
  customFields: { item: [['enclosure', 'enclosure'], ['media:thumbnail', 'thumbnail']] }
})
export async function fetchMontyMonthly() {
  const feed = await parser.parseURL('https://montymonthly.substack.com/feed')
  return feed.items.slice(0, 10).map((item) => ({
    title: item.title ?? '',
    link: item.link ?? '',
    pubDate: item.pubDate ?? '',
    thumbnail: extractThumbnail(item),
  }))
}
```
Use in `/newsletter/page.tsx` with `export const revalidate = 86400` (D-25). Wrap in try/catch; on failure render the subscribe-CTA fallback (D-27).

**Thumbnail extraction order:** `enclosure.url` → `media:thumbnail` → first `<img>` in `content:encoded` (regex: `/<img[^>]+src="([^"]+)"/`). Substack typically provides `enclosure`.

### 5. Blog RSS feed at `/blog/feed.xml`

Use a **Route Handler**, not a static file:

```ts
// src/app/blog/feed.xml/route.ts
import { getPublishedPosts } from '@/lib/notion'

export const revalidate = 1800

export async function GET() {
  const posts = await getPublishedPosts()
  const xml = buildRssXml(posts)
  return new Response(xml, {
    headers: { 'Content-Type': 'application/rss+xml; charset=utf-8' }
  })
}
```
Hand-roll the RSS XML in `src/lib/rss/blog-feed.ts` — spec is ~20 lines and avoids pulling in `feed` or `rss` libraries. Escape `& < > " '` in titles/descriptions.

Link via root layout `metadata.alternates.types['application/rss+xml'] = '/blog/feed.xml'` (see focus area 1).

### 6. Reading time — reuse as-is

`src/utils/reading-time.ts` already exports both functions (200 wpm, not 250 as PRD says — worth noting but aligns with what Phase 3 shipped per STATE.md D-09). Planner should decide whether to keep 200 (consistency) or switch to 250 (PRD §10 literal). **Recommendation: keep 200** — it's already shipped, the delta is cosmetic.

Blog detail already displays reading time (`blog/[slug]/page.tsx:66`) and publish date (`blog/[slug]/page.tsx:57-63`). ✓ D-39 already satisfied on post pages; only the **index page display** (D-40) needs to be added.

### 7. Breadcrumbs

No breadcrumb component exists. Build `src/components/seo/breadcrumbs.tsx` (server component — no interactivity needed):
```tsx
type Item = { name: string; href?: string }
export function Breadcrumbs({ items }: { items: Item[] }) {
  return (
    <>
      <nav aria-label="Breadcrumb" className="text-xs uppercase tracking-widest opacity-50 pt-24 px-6 md:px-0 mx-auto max-w-[66ch]">
        {/* visible UI */}
      </nav>
      <JsonLd data={buildBreadcrumbListSchema(items)} />
    </>
  )
}
```
Pair the visible nav with the JSON-LD from the **same `items` array** — no drift risk. Use the exact labels from D-16 ("Writings" not "Blog", "Works" not "Projects").

**Where it lives in each page:** the current pages use `pt-24` top padding (nav is `fixed` + `h-16`). Breadcrumb should slot between the fixed nav and the page `<h1>`.

### 8. Related Essays — static lookup map

No tagging infra. Build `src/data/related-essays.ts` with a single object keyed by slug:
```ts
export const RELATED_ESSAYS: Record<string, string[]> = {
  'choosing-faith': ['practical-philosophy', 'defiant-optimism'],
  'ai-is-nibbling-the-world': ['algorithmic-content', 'standing-on-sediment'],
  // ...etc per D-41 groupings
}
```
Derive from the manual groupings in D-41. Component `src/components/blog/related-essays.tsx` looks up by current slug, resolves each related slug via `getPostBySlug()`, renders title + excerpt.

**Caveat:** slugs in D-41 are essay titles, not URL slugs. Planner must cross-reference actual Notion slugs during execution. Include a slug-resolution helper that falls back to fuzzy title match if a slug lookup fails.

### 9. Homepage rotating tagline removal (D-19)

`src/components/home/rotating-tagline.tsx` is a client component rendering 5 taglines on a 3.5s interval. The intro paragraph in `src/app/page.tsx:73-77` already violates D-03 ("based in NYC") and D-05 ("investor"). Replacement work:

1. Delete `<RotatingTagline />` usage on line 79.
2. Rewrite lines 73-77 to match D-19 (keywords: Monty Singer, founder, Prometheus, AI, builder, writer; 2-3 sentences; no location; no em dashes; no investor/past-job identity).
3. `RotatingTagline` component file can be deleted after, or left until /gsd:cleanup (memory: no dead code per Claude Code defaults — delete it).
4. Photo carousel (`PhotoCarousel`), CTA buttons, Writings list, Works list, Events section stay untouched (D-20).

### 10. Navigation + footer slotting

`src/components/nav/navigation.tsx:8-11` has `NAV_LINKS` hardcoded:
```ts
const NAV_LINKS = [
  { href: '/about', label: 'About' },
  { href: '#contact', label: 'Contact' },
]
```
**Required updates (D-44):**
```ts
const NAV_LINKS = [
  { href: '/about', label: 'About' },
  { href: '/prometheus', label: 'Prometheus' },
  { href: '/blog', label: 'Writings' },
  { href: '/projects', label: 'Works' },
  { href: '/newsletter', label: 'Monty Monthly' },
  { href: '#contact', label: 'Contact' },
]
```

**"Contact" confirmed as an anchor**, not a page: `footer.tsx:23` has `<div id="contact" ...>`. D-44's "Contact" item stays as `#contact`. Document this in CONTEXT.md deferred note.

**Footer** (`src/components/footer.tsx:3-8`) has `LINKS` array. Add `{ href: '/uses', label: 'Uses' }` (D-45). Also add Prometheus and Monty Monthly for redundancy.

### 11. OG image infra

`src/app/opengraph-image.tsx` exists at root (default). `src/app/blog/[slug]/opengraph-image.tsx` overrides per-post. Next.js auto-generates the `<meta property="og:image">` tag from these files — **no manual OG URL handling needed** in `generateMetadata`.

**Memory flag:** homepage OG was moved OFF edge runtime after 1MB limit issues (most recent commit: `962aeb8 fix(og): drop edge runtime, statically prerender homepage OG image`). Preserve that behavior — new pages should follow the same static-prerender pattern if they need custom OG.

For `/prometheus`, `/newsletter`, `/uses` — the root `opengraph-image.tsx` cascades automatically. No per-page OG image required unless we want branded ones (out of scope per D-11).

### 12. Notion block → plain-text excerpt (D-40)

No dedicated excerpt helper exists. But `src/utils/reading-time.ts:3-18` already has `extractTextFromBlock()` — private but easily extracted.

**Plan:** promote `extractTextFromBlock` to a named export in `src/utils/reading-time.ts` (or move to `src/utils/notion-text.ts`). Then add:
```ts
export function extractExcerpt(blocks: BlockObjectResponse[], maxChars = 150): string {
  const text = blocks.map(extractTextFromBlock).join(' ').trim()
  if (text.length <= maxChars) return text
  return text.slice(0, maxChars).replace(/\s+\S*$/, '') + '…'
}
```

**Caveat for D-40 on the blog index:** post bodies require `getBlocks(post.id)` — extra API calls per post. Options:
  - (a) Use `post.description` (Notion "Description" property) as the excerpt — zero extra calls, already fetched.
  - (b) Batch `getBlocks` for all posts in parallel with `p-limit` (already in deps).
  - (c) Hybrid: use `description` if present, fall back to blocks.
  **Recommendation: (a)** — matches pattern used for reading time on the index per STATE.md D-09. PRD §10 even allows "custom excerpt field if one exists in the content structure" and `description` is exactly that. No extra API calls.

### 13. Validation Architecture (for Nyquist VALIDATION.md)

SEO work is unusually easy to validate mechanically. Plans should cover:

- **Unit tests** for pure helpers: `buildPersonSchema`, `buildFaqPageSchema`, `buildBreadcrumbListSchema`, `extractExcerpt`, `buildRssXml`.
- **Metadata shape tests** per route: instantiate `generateMetadata({params: {slug: 'x'}})` in a test, assert title contains `| Monty Singer`, description length ∈ [100, 170], `openGraph.type` is set, `alternates.canonical` matches URL.
- **Integration test** for `/blog/feed.xml` route handler: hit the route, parse the XML, assert `<channel>`, `<item>` count > 0, valid `pubDate` formats.
- **Build-time smoke tests:** `next build` must succeed; sitemap output must include the three new URLs.
- **Schema.org validator (manual, once):** paste `/` and `/prometheus` rendered HTML into https://validator.schema.org — blocks merge if errors.
- **grep-based acceptance criteria on every PLAN.md task** (no em dashes in changed files, no "NYC" / "Investor" regression, each new page has exactly one H1).

VALIDATION.md will be auto-created from the `$HOME/.claude/get-shit-done/templates/VALIDATION.md` template during step 5.5 of the workflow.

---

## Validation Architecture

**Mandatory validation strategy for SEO phase** (consumed by Step 5.5):

### Test layers

1. **Unit** — `src/__tests__/seo/` — schema builders, excerpt helper, RSS XML builder, URL helpers. Pure functions, no network.
2. **Integration** — metadata functions for every route called with representative params; route handler for `/blog/feed.xml`. Use existing `vitest` + `jsdom` setup.
3. **Build / smoke** — `next build` must pass; `curl localhost:3000/sitemap.xml` includes `/prometheus`, `/newsletter`, `/uses`; `curl localhost:3000/blog/feed.xml` returns `application/rss+xml`.
4. **Grep acceptance** (executor gate) — every modified file grep'd against deny-list: ` — ` (em dash with spaces), ` — ` (em dash U+2014), `NYC`, `based in`, `investor` (case-insensitive) in user-facing copy files.

### Per-plan coverage expectations

| Plan area | Unit test | Integration test | Grep gate |
|-----------|-----------|------------------|-----------|
| Global metadata infra (title template, canonicals, RSS alternate) | yes | yes | yes |
| Homepage + About rewrites | — | — | yes |
| `/prometheus` with FAQ JSON-LD | yes (schema builder) | yes (metadata shape) | yes |
| `/newsletter` + Substack RSS | yes (parser + fallback) | yes (build succeeds with feed mocked) | yes |
| `/uses` | — | yes (metadata shape) | yes |
| Breadcrumbs | yes (schema builder) | — | — |
| Related Essays | yes (lookup) | — | — |
| Blog RSS `/blog/feed.xml` | yes (XML builder) | yes (route handler) | — |
| Per-post metadata (15 posts) | — | yes (sample 3 posts) | yes |
| Per-project metadata (7 projects) | — | yes (sample 3) | yes |
| Sitemap extension | — | yes (all 3 new URLs present) | — |
| 404 page | — | yes (404 returns) | — |

### Blocking thresholds

- **Any em dash in modified user-facing copy** → BLOCK.
- **"NYC", "investor", "Leerink", "based in"** in any page's rendered output → BLOCK.
- **Duplicate `<h1>` on any page** → BLOCK.
- **Schema.org validator error on `/` or `/prometheus`** → WARN (manual verification step).
- **Build failure** → BLOCK.
- **Unit/integration test failure** → BLOCK.

---

## Gotchas the planner MUST address

1. **SITE_URL baseline is wrong** — `sitemap.ts:5`, `robots.ts:3`, `page.tsx:29`, `about/page.tsx:15` all hardcode `msizzle.com`. Must switch to `montysinger.com` atomically; ship in infra plan 01 so every downstream plan can trust canonical URLs.
2. **About page has a Person schema that should be removed** — D-13 says homepage only. Don't dedupe; delete.
3. **Title template em dash** — `layout.tsx:27` uses `"%s — Monty Singer"`. Change to `"%s | Monty Singer"` per D-07.
4. **Blog slug ≠ essay title** — D-41 related-essays groupings use titles. Planner needs a slug-resolution task or static title-to-slug map.
5. **Footer has em dash usage** (`&mdash;`) and "investor" mention (`Want to chat about investing...`). Must rewrite footer contact copy. Also uses `mds345@georgetown.edu` — keep (D-04 allows "Georgetown University" but this is just an email, fine).
6. **Existing `<NewsletterCta />` component** at end of blog posts — verify it doesn't conflict with the new Related Essays section layout.
7. **Homepage hero mentions "investor"** and "NYC" explicitly (`page.tsx:74-77`). Multiple violations. Must be rewritten as part of D-19.
8. **No `not-found.tsx` exists** — D-49 requires a styled 404. Add `src/app/not-found.tsx`.
9. **`<h1>` variants** — blog index uses `text-sm` uppercase H1 (`blog/page.tsx:33-35`). About uses `text-sm` H1. Blog detail uses `text-2xl` H1. Inconsistent but each page has exactly one — D-48 is satisfied. Keep the pattern.
10. **`rotating-tagline.tsx` file should be deleted** after removal from page.tsx — no dead code.
11. **Substack RSS must be fetched server-side** (D-25) — no `use client` in the carousel server component; use a nested client component only for the snap-scroll arrows.
12. **Preview deployment canonicals** — Vercel preview URLs shouldn't claim canonical to production. `metadataBase` already uses hardcoded `montysinger.com`, which is the right behavior (canonical always points to prod). No change needed.
13. **Bundle size for `rss-parser`** — 7kb gzipped is fine, but confirm it doesn't break edge runtime (it shouldn't — we're on Fluid Compute / Node.js).
14. **Notion rate limits during bulk metadata** — D-37 touches 15 posts. `generateMetadata` runs per-request; ISR 30min is fine. No bulk operation needed.

---

## Recommended plan breakdown (for planner)

Suggested 8-10 atomic plans in 3 waves. Planner may re-group.

**Wave 1 — Shared infrastructure (no UI deps):**
- **Plan 01:** Global metadata infrastructure (SITE_URL fix, root layout metadata rewrite, title template, canonical helper, RSS alternate link, JsonLd helper component, schema builders, Breadcrumbs component).
- **Plan 02:** Content helpers (promote `extractTextFromBlock`, add `extractExcerpt`, slug resolver for related essays, static RELATED_ESSAYS map, Substack RSS fetcher).

**Wave 2 — Routes and rewrites (depend on Wave 1):**
- **Plan 03:** Homepage rewrite (intro copy, remove RotatingTagline, delete component file, fix Person schema to D-13).
- **Plan 04:** About rewrite (remove schema, rewrite sections, breadcrumbs).
- **Plan 05:** `/prometheus` page (new route with FAQ JSON-LD, breadcrumbs, metadata).
- **Plan 06:** `/newsletter` page (new route with Substack carousel, fallback, breadcrumbs, metadata).
- **Plan 07:** `/uses` page (new route with sections, breadcrumbs, metadata).
- **Plan 08:** Blog index enhancements (excerpts on index, reading time + date beside each title, breadcrumbs on post detail, Related Essays block on post detail, per-post metadata fix — loop through 15 slugs).
- **Plan 09:** Project pages (descriptions, metadata, breadcrumbs — loop through 7 projects).
- **Plan 10:** Navigation + footer updates (nav links, footer links, Contact copy fix).

**Wave 3 — Orthogonal wrap-up (depend on Wave 2):**
- **Plan 11:** Sitemap extension + 404 page + blog RSS route handler + nav/footer final polish + technical SEO checklist pass (alt text audit, H1 audit, orphan-page check).

Each plan's `<read_first>` should include the relevant source files listed in the Focus Areas above. Acceptance criteria should use `grep -r` deny-list scans and file-existence checks.

---

*Phase: 07-seo-overhaul*
*Research written: 2026-04-15*
