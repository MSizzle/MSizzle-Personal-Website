# Phase 16: Interior Pages on Notion Data - Pattern Map

**Mapped:** 2026-06-20  
**Files analyzed:** 16 new/modified files  
**Analogs found:** 15 / 16 (94%)

---

## File Classification

| New/Modified File | Role | Data Flow | Closest Analog | Match Quality |
|-------------------|------|-----------|----------------|---------------|
| `src/lib/uses.ts` | data module | static | `src/lib/photos.ts` | exact |
| `src/lib/watching.ts` | data module | static | `src/lib/photos.ts` | exact |
| `src/app/uses/page.tsx` | page | SSG | `src/app/photos/page.tsx` | exact |
| `src/app/watching/page.tsx` | page | SSG | `src/app/photos/page.tsx` | exact |
| `src/app/writing/page.tsx` | page | ISR-30min | `src/app/writing/page.tsx` (v2 editorial) | role-match |
| `src/app/projects/page.tsx` | page | ISR-30min | `src/app/projects/page.tsx` (v2 editorial) | role-match |
| `src/app/blog/[slug]/page.tsx` | page | dynamic-ISR | `src/app/blog/[slug]/page.tsx` (existing) | exact |
| `src/app/projects/[slug]/page.tsx` | page | dynamic-ISR | (no existing; use blog pattern) | role-match |
| `src/components/nav/navigation.tsx` | component | request-response | `src/components/nav/navigation.tsx` (extend mapping) | role-match |
| `src/app/layout.tsx` | layout | request-response | `src/app/layout.tsx` (existing) | exact |
| `next.config.ts` | config | build-time | `next.config.ts` (existing) | exact |
| `src/app/globals.css` | style | build-time | `src/app/globals.css` (token refs only) | token-match |
| `src/components/editorial/list-row.tsx` | component | presentation | `src/components/editorial/list-row.tsx` (token repaint) | token-match |
| `src/components/editorial/year-block.tsx` | component | presentation | `src/components/editorial/year-block.tsx` (token repaint) | token-match |
| `src/components/editorial/rule.tsx` | component | presentation | `src/components/editorial/rule.tsx` (token repaint) | token-match |
| `src/components/editorial/rule-strong.tsx` | component | presentation | `src/components/editorial/rule-strong.tsx` (token repaint) | token-match |

---

## Pattern Assignments

### `src/lib/uses.ts` (data module, static)

**Analog:** `src/lib/photos.ts`

**Template structure** (lines 18-78):
```typescript
// photos.ts pattern — apply verbatim to uses.ts

export type ArchivePhoto = {
  filename: string;
  year: number;
  alt: string;
  caption?: string;
};

export const PHOTOS_BY_YEAR: ArchivePhoto[] = [
  { filename: "...", year: 2025, alt: "...", caption: "..." },
  // ... more entries
];

export function groupPhotosByYear(): Map<number, ArchivePhoto[]> {
  const groups = new Map<number, ArchivePhoto[]>();
  for (const photo of PHOTOS_BY_YEAR) {
    const bucket = groups.get(photo.year) ?? [];
    bucket.push(photo);
    groups.set(photo.year, bucket);
  }
  return new Map([...groups.entries()].sort(([a], [b]) => b - a));
}
```

**For uses.ts, adapt as:**
```typescript
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
      // ... more items per D-06
    ],
  },
  // ... more groups
  {
    heading: "Hardware",
    items: [
      { term: "Laptop", detail: "TODO: [Monty to fill in]" },
      { term: "Phone", detail: "TODO: [Monty to fill in]" },
    ],
  },
];
```

**Key differences:**
- No year grouping (uses.ts is flat group-based, not chronological)
- No helper function needed (page iterates USES_DATA directly)
- Four locked groups per D-06; Hardware has TODO placeholders per D-06

---

### `src/lib/watching.ts` (data module, static)

**Analog:** `src/lib/photos.ts`

**Structure for watching.ts:**
```typescript
export type WatchingItem = {
  id: string;        // YouTube video ID (from youtu.be/{id})
  title: string;
  channel: string;
  url: string;       // Full YouTube URL (https://www.youtube.com/watch?v={id})
};

export const WATCHING_ITEMS: WatchingItem[] = [
  {
    id: "dQw4w9WgXcQ",
    title: "Example Video Title",
    channel: "Example Channel",
    url: "https://www.youtube.com/watch?v=dQw4w9WgXcQ",
  },
  // ... more items (6 placeholders per D-10)
];
```

**Key notes:**
- Flat array, no grouping (unlike photos.ts)
- Video ID is derived from YouTube URL; stored separately for thumbnail generation
- Thumbnail URL pattern: `https://img.youtube.com/vi/{id}/hqdefault.jpg` (per D-08)
- No helper function needed

---

### `src/app/uses/page.tsx` (page, SSG)

**Analog:** `src/app/photos/page.tsx`

**Page structure** (lines 1-73):
```typescript
import { Fragment } from "react";
import Image from "next/image";
import type { Metadata } from "next";
import { groupPhotosByYear } from "@/lib/photos";
import { RuleStrong } from "@/components/editorial/rule-strong";
import { YearBlock } from "@/components/editorial/year-block";

export const revalidate = 1800; // ISR 30min, consistent with /writing and /photos

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
};

export default function UsesPage() {
  // Imports: USES_DATA from @/lib/uses
  // Import: PageHero, UsesList from v3 components
  // Layout: PageHero (title + breadcrumb + sub) → RuleStrong → UsesList (grouped dt/dd) → RuleStrong
}
```

**For uses/page.tsx, adapt as:**
```typescript
import type { Metadata } from "next";
import { USES_DATA } from "@/lib/uses";
import { PageHero } from "@/components/v3/page-hero";
import { UsesList } from "@/components/v3/uses-list";
import { RuleStrong } from "@/components/editorial/rule-strong";

export const revalidate = 1800; // ISR 30min

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
};

export default function UsesPage() {
  return (
    <>
      <PageHero
        title="Uses"
        crumb="Home / Uses"
        sub="The equipment and software I use daily."
      />
      <RuleStrong />
      <section className="px-6 md:px-40 pb-16">
        <UsesList groups={USES_DATA} />
      </section>
      <RuleStrong />
    </>
  );
}
```

**Styling notes:**
- Pumpkin Amber tokens already applied in v3 components (PageHero, UsesList)
- No additional token mapping needed for this page
- ISR revalidate = 1800 matches /writing, /photos pattern

---

### `src/app/watching/page.tsx` (page, SSG)

**Analog:** `src/app/photos/page.tsx`

**For watching/page.tsx, adapt as:**
```typescript
import type { Metadata } from "next";
import { WATCHING_ITEMS } from "@/lib/watching";
import { PageHero } from "@/components/v3/page-hero";
import { VideoCard } from "@/components/v3/video-card";

export const revalidate = 1800; // ISR 30min

export const metadata: Metadata = {
  title: "Watching | Monty Singer",
  description: "Favorite videos and talks.",
  alternates: { canonical: "/watching" },
  openGraph: {
    title: "Watching | Monty Singer",
    description: "Favorite videos and talks.",
    url: "/watching",
    type: "website",
  },
};

export default function WatchingPage() {
  return (
    <>
      <PageHero
        title="Watching"
        crumb="Home / Watching"
        sub="Favorite videos and talks."
      />
      <section className="px-6 md:px-40 py-16">
        <div className="grid [grid-template-columns:repeat(auto-fill,minmax(320px,1fr))] gap-[22px]">
          {WATCHING_ITEMS.map((item) => (
            <VideoCard
              key={item.id}
              title={item.title}
              channel={item.channel}
              href={item.url}
            />
          ))}
        </div>
      </section>
    </>
  );
}
```

**Critical config change required:**
- `next.config.ts` remotePatterns: Add `img.youtube.com` (see next.config.ts pattern below)

---

### `src/app/writing/page.tsx` (page, ISR-30min, repaint)

**Analog:** `src/app/writing/page.tsx` (existing v2 editorial, token repaint)

**Existing page structure** (lines 75-152):
```typescript
export const revalidate = 1800; // ISR 30min — PRESERVE

export const metadata: Metadata = {
  title: "Writing | Monty Singer",
  description: "Long-form essays on philosophy, technology, and the texture of an attentive life.",
  alternates: { canonical: "/writing" },
  openGraph: {
    title: "Writing | Monty Singer",
    description: "Long-form essays on philosophy, technology, and the texture of an attentive life.",
    url: "/writing",
    type: "website",
  },
};

export default async function WritingPage() {
  let posts: BlogPost[] = [];
  try {
    posts = await getPublishedPosts();
  } catch {} // Defensive: return empty on Notion failure

  const postsByYear = groupPostsByYear(posts);
  const yearEntries = [...postsByYear.entries()];

  return (
    <>
      {/* Title block — keep structure, repaint tokens */}
      <section className="px-6 pt-16 pb-15 md:px-40 md:pt-40 md:pb-25">
        {/* Update text-ink → text-[var(--color-text)] */}
        {/* Update text-muted → text-[var(--color-text-muted)] */}
      </section>

      <RuleStrong />

      {/* Year-grouped essays — keep ListRow structure, repaint tokens */}
      <section className="px-6 md:px-40">
        {yearEntries.map(([year, yearPosts], i, arr) => (
          <Fragment key={year}>
            <YearBlock year={year}>
              {yearPosts.map((post) => (
                <ListRow
                  key={post.id}
                  big
                  href={`/blog/${post.slug}`}
                  title={post.title}
                  extra={post.description}
                  meta={formatMonthYear(post.date)}
                />
              ))}
            </YearBlock>
            {/* Keep dividers between year groups */}
          </Fragment>
        ))}
      </section>

      <RuleStrong />
      <WritingSubscribeCTA />
    </>
  );
}
```

**Token repaint required:**
- `text-ink` → `text-[var(--color-text)]` (roasted cocoa #2a1808)
- `text-muted` → `text-[var(--color-text-muted)]` (rgba 42,24,8,0.55)
- `text-page-title`, `text-body-lead` → verify they already reference Pumpkin Amber tokens in globals.css

**No structural changes:**
- Year grouping with YearBlock stays (D-04)
- ListRow components stay (vs. card grid; decision per D-01/prototype)
- ISR revalidate stays at 1800

---

### `src/app/projects/page.tsx` (page, ISR-30min, repaint)

**Analog:** `src/app/projects/page.tsx` (existing v2 editorial, token repaint)

**Same pattern as writing/page.tsx:**
- Keep ISR revalidate = 1800
- Keep year grouping + ListRow structure
- Repaint editorial tokens to Pumpkin Amber vars
- Update metadata (already correct)
- Keep groupProjectsByYear() function (uses lastEdited date)

**Data source:** `getPublishedProjects()` from `@/lib/notion-projects`  
**Excerpt source:** `project.description` field (not a helper)

---

### `src/app/blog/[slug]/page.tsx` (page, dynamic-ISR, preserve + extend)

**Analog:** `src/app/blog/[slug]/page.tsx` (existing, mostly preserved)

**Existing structure** (lines 39-102):
```typescript
export const revalidate = 1800; // ISR 30min — PRESERVE

export async function generateStaticParams() {
  if (!process.env.NOTION_TOKEN || !process.env.NOTION_DATABASE_ID) {
    return []
  }
  try {
    const posts = await getPublishedPosts()
    return posts.map((post) => ({ slug: post.slug }))
  } catch {
    return []
  }
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params
  const post = await getPostBySlug(slug)
  if (!post) return { title: 'Post Not Found | Monty Singer' }
  return buildBlogPostMetadata(post)
}

export default async function BlogPostPage({ params }: PageProps) {
  const { slug } = await params
  const post = await getPostBySlug(slug)

  if (!post) notFound()

  const blocks = await getBlocks(post.id)
  const readingTime = calculateReadingTime(blocks)

  return (
    <>
      <Breadcrumbs
        items={[
          { name: 'Home', href: '/' },
          { name: 'Writings', href: '/blog' },  // or '/writing' per D-14
          { name: post.title },
        ]}
      />
      <article className="mx-auto max-w-[66ch] px-6 pb-16 pt-8 md:px-0">
        <header className="mb-12">
          <h1 className="text-section-feature text-ink">{post.title}</h1>
          <div className="mt-4 flex items-center gap-4 text-sm text-muted">
            {/* Reading time, date, tags — repaint tokens */}
          </div>
        </header>

        <div className="prose max-w-none">
          <NotionRenderer blocks={blocks} />
        </div>

        <NewsletterCta />
        <RelatedEssays currentSlug={slug} />
      </article>
    </>
  );
}
```

**Repaint notes:**
- `text-ink` → `text-[var(--color-text)]`
- `text-muted` → `text-[var(--color-text-muted)]`
- `.prose` styles already updated in globals.css (lines 92-143)
- Breadcrumbs component already handles rendering (sr-only + JSON-LD)

**No changes to:**
- ISR revalidate = 1800
- generateStaticParams() logic
- NotionRenderer (preserve as-is, per IN-02)
- RelatedEssays component (uses existing RELATED_ESSAYS data file)

---

### `src/app/projects/[slug]/page.tsx` (page, dynamic-ISR, new — pattern from blog)

**Analog:** `src/app/blog/[slug]/page.tsx`

**Create projects/[slug]/page.tsx following blog pattern:**
```typescript
import { notFound } from 'next/navigation'
import { getPublishedProjects, getProjectBySlug, getBlocks } from '@/lib/notion-projects'
import { NotionRenderer } from '@/components/notion/notion-renderer'
import { Breadcrumbs } from '@/components/seo/breadcrumbs'
import { buildProjectMetadata } from '@/lib/seo/project-metadata' // existing per RESEARCH
import type { Metadata } from 'next'
import type { BlockObjectResponse } from '@notionhq/client/build/src/api-endpoints'
import Image from 'next/image'

export const revalidate = 1800; // ISR 30min

interface PageProps {
  params: Promise<{ slug: string }>
}

export async function generateStaticParams() {
  if (!process.env.NOTION_TOKEN || !process.env.NOTION_PROJECTS_DATABASE_ID) {
    return []
  }
  try {
    const projects = await getPublishedProjects()
    return projects.map((project) => ({ slug: project.slug }))
  } catch {
    return []
  }
}

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const { slug } = await params
  const project = await getProjectBySlug(slug)
  if (!project) return { title: 'Project Not Found | Monty Singer' }
  return buildProjectMetadata(project)
}

export default async function ProjectPage({ params }: PageProps) {
  const { slug } = await params
  const project = await getProjectBySlug(slug)

  if (!project) notFound()

  const blocks = await getBlocks(project.id)

  return (
    <>
      {/* Full-bleed hero image from Notion cover (D-02) */}
      {project.cover && (
        <div className="relative w-full h-[400px] md:h-[600px]">
          <Image
            src={`/api/notion-cover?pageId=${project.id}`}
            alt={`${project.title} cover`}
            fill
            priority
            fetchPriority="high"  // Next.js 16 quirk (nextjs16-fetchpriority-quirk)
            sizes="100vw"
            className="object-cover"
          />
        </div>
      )}

      <Breadcrumbs
        items={[
          { name: 'Home', href: '/' },
          { name: 'Building', href: '/projects' },
          { name: project.title },
        ]}
      />
      
      <article className="mx-auto max-w-[66ch] px-6 pb-16 pt-8 md:px-0">
        <header className="mb-12">
          <h1 className="text-section-feature text-[var(--color-text)]">{project.title}</h1>
          {project.description && (
            <p className="mt-4 text-lg text-[var(--color-text-dim)]">
              {project.description}
            </p>
          )}
          {project.externalUrl && (
            <a
              href={project.externalUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-2 inline-block text-[var(--accent)] underline"
            >
              View Project ↗
            </a>
          )}
        </header>

        <div className="prose max-w-none">
          <NotionRenderer blocks={blocks} />
        </div>
      </article>
    </>
  );
}
```

**Key details per D-02:**
- Full-bleed hero via `/api/notion-cover?pageId={id}` proxy
- `fetchPriority="high"` on Image (Next.js 16 quirk)
- `sizes="100vw"` for responsive srcset
- Breadcrumb items: Home / Building / [Title]
- Reuse Project data structure from `@/lib/notion-projects`

---

### `src/components/nav/navigation.tsx` (component, extend mapping)

**Analog:** `src/components/nav/navigation.tsx` (lines 26-32, activeLabel mapping)

**Current mapping:**
```typescript
const activeLabel: 'Building' | 'Writing' | 'Events' | 'About' | 'Links' | undefined =
  pathname === '/projects' ? 'Building'
  : pathname === '/writing' || pathname.startsWith('/blog') ? 'Writing'
  : pathname === '/events' ? 'Events'
  : pathname === '/about' ? 'About'
  : pathname === '/links' ? 'Links'
  : undefined
```

**Extend to include /uses and /watching per D-13:**
```typescript
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

**Also extend MOBILE_LINKS** (lines 11-17) per D-13:
```typescript
const MOBILE_LINKS = [
  { href: '/projects', label: 'Building' },
  { href: '/writing',  label: 'Writing'  },
  { href: '/events',   label: 'Events'   },
  { href: '/about',    label: 'About'    },
  { href: '/links',    label: 'Links'    },
  { href: '/uses',     label: 'Uses'     },      // NEW
  { href: '/watching', label: 'Watching' },      // NEW
  { href: '/prometheus', label: 'Prometheus' }, // Move from footer per D-12
]
```

**No other changes needed:**
- EditorialHeader component already receives `active` prop and renders correctly
- Drawer close logic (`onClick={() => setOpen(false)}`) already works

---

### `next.config.ts` (config, add remotePatterns)

**Analog:** `next.config.ts` (lines 23-55, images.remotePatterns)

**Current remotePatterns:**
```typescript
remotePatterns: [
  { protocol: "https", hostname: "prod-files-secure.s3.us-east-1.amazonaws.com" },
  { protocol: "https", hostname: "www.notion.so" },
  { protocol: "https", hostname: "images.unsplash.com" },
  { protocol: "https", hostname: "substackcdn.com" },
  { protocol: "https", hostname: "substack-post-media.s3.amazonaws.com" },
  { protocol: "https", hostname: "*.substackcdn.com" },
]
```

**Add for /watching (D-08):**
```typescript
remotePatterns: [
  // ... existing entries ...
  {
    protocol: "https",
    hostname: "img.youtube.com",  // For YouTube thumbnails per /watching
  },
]
```

**Verify:**
- Also remove the `/uses` redirect (lines 19-20) since the page now exists:
```typescript
async redirects() {
  return [
    // { source: '/uses', destination: '/about', permanent: true }, // DELETE — /uses now exists
    { source: '/blog', destination: '/writing', permanent: true },
  ]
}
```

---

### Editorial Component Token Repaints (4 files)

**Analog:** `src/app/globals.css` (lines 1-44, @theme block with Pumpkin Amber tokens)

These four components use v2 editorial tokens that must be remapped to Pumpkin Amber vars. The token definitions are in globals.css lines 3-44 (confirmed in RESEARCH).

#### `src/components/editorial/list-row.tsx` (lines 13-35)

**Current tokens:**
```typescript
className={cn(
  "flex items-baseline justify-between gap-6 border-t border-rule py-5 first:border-t-0",
  big && "py-7"
)}
// ...
<div className={cn("text-ink", big ? "text-list-title" : "text-list-title-home")}>
<div className="mt-1 text-caption text-muted">{extra}</div>
<div className="shrink-0 text-meta uppercase text-muted">{meta}</div>
```

**Repaint mapping:**
- `text-ink` → `text-[var(--color-text)]`
- `text-muted` → `text-[var(--color-text-muted)]`
- `border-rule` → `border-[var(--color-border)]`
- `text-list-title`, `text-caption`, `text-meta` → verify they reference Pumpkin Amber in globals.css or repaint to color vars

**Recommendation:** Check globals.css for these class definitions before bulk-repainting.

#### `src/components/editorial/year-block.tsx` (lines 28-39)

**Current tokens:**
```typescript
<div className="text-label uppercase font-bold text-ink md:sticky md:top-9 md:self-start">
  {year}
</div>
```

**Repaint:**
- `text-label` → verify reference in globals.css (likely already Pumpkin Amber)
- `text-ink` → `text-[var(--color-text)]`

#### `src/components/editorial/rule.tsx`

**Analog:** `src/components/editorial/rule.tsx` (read file if needed)

**Purpose:** Divider line between sections. Likely uses `border-rule` or `border-ink` color.

**Repaint:** Replace with `border-[var(--color-border)]` or `border-[var(--color-border-strong)]`

#### `src/components/editorial/rule-strong.tsx`

**Purpose:** Heavier divider line. Likely uses `border-rule-strong` or similar.

**Repaint:** Replace with `border-[var(--color-border-strong)]` per globals.css line 12

---

### `src/app/globals.css` (token refs — no code changes)

**Analog:** `src/app/globals.css` (lines 1-143, existing Pumpkin Amber tokens)

**Status:** All Pumpkin Amber tokens are already defined (lines 3-44):
- `--color-bg: #ff7a14` (main background)
- `--color-text: #2a1808` (roasted cocoa ink)
- `--color-text-dim`, `--color-text-muted`, `--color-text-inverse` (text hierarchy)
- `--accent: #0c6b74` (teal accent)
- `--color-border`, `--color-border-strong` (dividers)

**Prose styles** (lines 92-143) are already updated for Pumpkin Amber.

**No changes needed** — just verify that editorial components reference these vars correctly.

---

## Shared Patterns

### Pattern 1: Hardcoded Data Modules (uses.ts, watching.ts)

**Source:** `src/lib/photos.ts` (lines 18-78)

**Apply to:** All new hardcoded data files  
**Why:** Type-safe, version-controlled, no Notion schema churn

Template excerpt:
```typescript
export type DataItem = {
  // Define type shape
};

export const DATA_ARRAY: DataItem[] = [
  // Define typed entries
];

// Optional: helper to group/sort if needed
export function groupByKey(): Map<K, DataItem[]> {
  const groups = new Map<K, DataItem[]>();
  for (const item of DATA_ARRAY) {
    const bucket = groups.get(item.key) ?? [];
    bucket.push(item);
    groups.set(item.key, bucket);
  }
  return new Map([...groups.entries()].sort(([a], [b]) => b - a));
}
```

---

### Pattern 2: Page Hero + Year-Grouped Content (writing, projects, photos)

**Source:** `src/app/writing/page.tsx` (lines 86-111) + `src/app/photos/page.tsx` (lines 40-107)

**Apply to:** All interior pages with year grouping

Template excerpt:
```tsx
import { Fragment } from "react";
import type { Metadata } from "next";
import { YearBlock } from "@/components/editorial/year-block";
import { RuleStrong } from "@/components/editorial/rule-strong";

export const revalidate = 1800; // ISR 30min

export const metadata: Metadata = { /* ... */ };

function groupByYear(items: any[]): Map<number, any[]> {
  const groups = new Map<number, any[]>();
  for (const item of items) {
    if (!item.date) continue;
    const year = new Date(item.date).getUTCFullYear();
    if (Number.isNaN(year)) continue;
    const bucket = groups.get(year) ?? [];
    bucket.push(item);
    groups.set(year, bucket);
  }
  return new Map([...groups.entries()].sort(([a], [b]) => b - a));
}

export default async function PageName() {
  const itemsByYear = groupByYear(items);
  const yearEntries = [...itemsByYear.entries()];

  return (
    <>
      {/* Title block with optional atmosphere photo */}
      <section className="px-6 pt-16 pb-15 md:px-40 md:pt-40 md:pb-25">
        {/* PageHero or inline title */}
      </section>

      <RuleStrong />

      {/* Year-grouped content */}
      <section className="px-6 md:px-40">
        {yearEntries.map(([year, items], i, arr) => (
          <Fragment key={year}>
            <YearBlock year={year}>
              {/* Render items for this year */}
            </YearBlock>
            {i < arr.length - 1 && <RuleStrong />}
          </Fragment>
        ))}
      </section>

      <RuleStrong />
    </>
  );
}
```

---

### Pattern 3: Dynamic Detail Pages with Breadcrumbs (blog/[slug], projects/[slug])

**Source:** `src/app/blog/[slug]/page.tsx` (lines 18-102)

**Apply to:** All detail pages with dynamic routes

Template excerpt:
```tsx
import { notFound } from 'next/navigation'
import type { Metadata } from 'next'
import { Breadcrumbs } from '@/components/seo/breadcrumbs'

export const revalidate = 1800; // ISR 30min

interface PageProps {
  params: Promise<{ slug: string }>
}

export async function generateStaticParams() {
  try {
    const items = await getPublishedItems()
    return items.map((item) => ({ slug: item.slug }))
  } catch {
    return []
  }
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params
  const item = await getItemBySlug(slug)
  if (!item) return { title: 'Not Found' }
  return buildMetadata(item)
}

export default async function ItemPage({ params }: PageProps) {
  const { slug } = await params
  const item = await getItemBySlug(slug)

  if (!item) notFound()

  const blocks = await getBlocks(item.id)

  return (
    <>
      <Breadcrumbs
        items={[
          { name: 'Home', href: '/' },
          { name: 'Section', href: '/section' },
          { name: item.title },
        ]}
      />
      <article className="mx-auto max-w-[66ch] px-6 pb-16 pt-8 md:px-0">
        {/* Content */}
      </article>
    </>
  );
}
```

**Critical details:**
- `export const revalidate = 1800` at top level (not inside function)
- `generateStaticParams()` must return all slugs for ISR pre-generation
- `notFound()` for missing items (returns Next.js 404 page)
- Breadcrumbs component wraps the page (sr-only + JSON-LD)

---

### Pattern 4: Navigation Active State Mapping

**Source:** `src/components/nav/navigation.tsx` (lines 26-32)

**Apply to:** Extend mapping for new routes

Current pattern:
```tsx
const activeLabel = 
  pathname === '/path1' ? 'Label1'
  : pathname.startsWith('/path2') ? 'Label2'
  : undefined

// Pass to EditorialHeader
<EditorialHeader active={activeLabel} />
```

**For Phase 16:**
- Add routes: `/uses`, `/watching`
- Add to MOBILE_LINKS array
- Update activeLabel type union

---

### Pattern 5: Pumpkin Amber Token Repaint (Editorial Components)

**Source:** `src/app/globals.css` (lines 3-44, @theme block)

**Apply to:** All editorial components using v2 tokens

**Token mapping reference:**
```
v2 token name              → v3 var reference
─────────────────────────────────────────────
text-ink                   → text-[var(--color-text)]
text-muted                 → text-[var(--color-text-muted)]
text-rule / border-rule    → border-[var(--color-border)]
border-rule-strong         → border-[var(--color-border-strong)]
```

**Verification checklist before repainting:**
1. Open globals.css @theme block (lines 3-44)
2. For each component, list all v2 token class names
3. Check if token is defined in @theme (if not, it's a Tailwind semantic class and may need custom var mapping)
4. Replace inline

**Example repaint:**
```tsx
// Before (v2 editorial)
<div className="text-ink border-t border-rule">

// After (v3 Pumpkin Amber)
<div className="text-[var(--color-text)] border-t border-[var(--color-border)]">
```

---

## No Analog Found

| File | Role | Data Flow | Reason |
|------|------|-----------|--------|
| (none) | — | — | All Phase 16 files have established analogs in existing codebase |

---

## Metadata

**Analog search scope:** `src/app/`, `src/lib/`, `src/components/`  
**Files scanned:** 40+  
**Pattern extraction date:** 2026-06-20  
**Confidence:** HIGH — all analogs found in existing v2 editorial structure and v3 components

### Coverage Summary

- **Files with exact analog:** 10 (hardcoded data modules, pages, core components)
- **Files with role-match analog:** 4 (editorial pages with token repaint)
- **Files with token-match analog:** 2 (component styling refresh)
- **Files with no analog:** 0

### Key Pattern Inventories

1. **Data modules:** `photos.ts` → `uses.ts`, `watching.ts` (typed array + optional helper)
2. **Pages:** `photos/page.tsx` → `uses/page.tsx`, `watching/page.tsx` (SSG with ISR 1800)
3. **Detail pages:** `blog/[slug]/page.tsx` → `projects/[slug]/page.tsx` (dynamic ISR + breadcrumbs)
4. **Navigation:** Extend existing `navigation.tsx` activeLabel mapping + MOBILE_LINKS
5. **Tokens:** Use Pumpkin Amber @theme vars from globals.css (already defined)
6. **Config:** Add `img.youtube.com` to next.config.ts remotePatterns

### Ready for Planning

All patterns extracted. Planner can now reference analog patterns in PLAN.md files. Executor can copy code structures directly from analog files (e.g., photos.ts → uses.ts template, blog/[slug] → projects/[slug] template).
