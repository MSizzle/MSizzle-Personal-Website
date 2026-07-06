# Phase 19: Project Cards & Covers Redesign - Pattern Map

**Mapped:** 2026-07-06
**Files analyzed:** 8 new/modified files
**Analogs found:** 7 / 8

---

## File Classification

| New/Modified File | Role | Data Flow | Closest Analog | Match Quality |
|-------------------|------|-----------|----------------|---------------|
| `src/components/v3/title-card.tsx` | component | render | `src/app/globals.css` (h1.sig) + `.marker` | exact |
| `src/components/v3/card.tsx` | component | render | `src/components/v3/card.tsx` (extend) | self |
| `src/components/home/section-work.tsx` | component | CRUD | `src/components/home/section-work.tsx` (modify) | self |
| `src/app/writing/page.tsx` | page | CRUD | `src/app/writing/page.tsx` (modify) | self |
| `src/app/projects/page.tsx` | page | CRUD | `src/app/projects/page.tsx` (modify) | self |
| `src/app/opengraph-image.tsx` | route | render | `src/app/blog/[slug]/opengraph-image.tsx` | exact |
| `src/app/blog/[slug]/opengraph-image.tsx` | route | CRUD | `src/app/blog/[slug]/opengraph-image.tsx` (modify) | self |
| `src/app/projects/[slug]/opengraph-image.tsx` | route | CRUD | `src/app/projects/[slug]/opengraph-image.tsx` (modify) | self |

---

## Pattern Assignments

### `src/components/v3/title-card.tsx` (component, render)

**Analog:** `src/app/globals.css` — h1.sig rule (lines 85–104) + .marker treatment (lines 252–263)

**DNA:** The hero "Create Order" title-card block (white/paper background, Hanken 800 black text, hard 12px offset vermilion shadow, radius 0) is the design anchor for fallback card faces across /projects and /writing.

**Imports pattern** (from Card component, lines 1–3):
```typescript
import type { ReactNode } from "react";
```

**Core title-card style tokens** (from globals.css @theme, lines 3–49):
```css
/* Use these tokens for the title-card component */
--color-bg:      #faf9f7;      /* Near-white paper field */
--color-text:    #171717;      /* Near-black ink */
--color-accent:  #e5411f;      /* Vermilion */

--font-display: var(--hanken-grotesk);
--font-mono: var(--jetbrains-mono);
--sig-weight: 800;              /* Title weight */
```

**Offset shadow pattern** (from h1.sig, lines 96–100):
```css
h1.sig {
  background: #ffffff;
  padding: clamp(16px, 2.1vw, 28px) clamp(20px, 2.6vw, 38px);
  box-shadow: 12px 12px 0 var(--color-text); /* hard offset solid shape */
}
```

**Marker accent treatment** (from globals.css lines 255–263, used for title highlights):
```css
.marker,
h1.sig .hw {
  display: inline-block;
  background: var(--accent);
  color: #fff;
  padding: 0.05em 0.16em;
  line-height: 0.9;
  margin-left: -0.1em;
}
```

**Props structure** (from Card component):
- `title: ReactNode` — Display title (Hanken 800)
- `kicker?: string` — Mono label (year, category, "Essay" / "Project")
- `field?: 'paper' | 'ink'` — Background color for deterministic alternation
- `accentPosition?: 'left' | 'top'` — Vermilion highlight placement (design discretion)

---

### `src/components/v3/card.tsx` (component, render)

**Analog:** `src/components/v3/card.tsx` (existing, lines 35–73)

**Current structure** (existing lines 5–16 props):
```typescript
type Props = {
  kicker?: string;
  title: ReactNode;
  blurb?: ReactNode;
  href?: string;
  coverSrc?: string;
  coverAlt?: string;
};
```

**Extend to add:**
- `readingTime?: number` — Minutes for essays (/writing only)
- `showTitleCard?: boolean` — Force title-card fallback (e.g., when coverSrc fails)
- Support rendering the new `<TitleCard />` as fallback when `coverSrc` is undefined or missing

**Cover slot logic** (existing lines 46–56):
```typescript
const coverSlot = coverSrc ? (
  <div className="relative w-full aspect-[4/3] overflow-hidden">
    <Image
      src={coverSrc}
      alt={coverAlt ?? ""}
      fill
      sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
      className="object-cover"
    />
  </div>
) : null;
```

**Modification:** Replace `null` fallback with `<TitleCard />` component when cover is absent.

**Blurb pattern** (existing lines 41–42):
```typescript
<h3 className="font-display font-medium text-lg uppercase mb-2">{title}</h3>
{blurb && <p className="text-sm text-text-dim">{blurb}</p>}
```

**Reading time rendering** (add near blurb, optional):
```typescript
{readingTime && (
  <p className="font-mono text-xs text-text-muted">
    {readingTime} min read
  </p>
)}
```

---

### `src/components/home/section-work.tsx` (component, CRUD)

**Analog:** `src/components/home/section-work.tsx` (existing, lines 35–95)

**Current Photo structure** (lines 57–69):
```typescript
<Photo
  aspectRatio="3/2.2"
  src={
    project?.cover
      ? `/api/notion-cover?pageId=${project.id}`
      : undefined
  }
  alt={project?.cover ? project.title : undefined}
  caption={captionFor(project, i)}
/>
```

**Modification for title-cards:**
- When `project?.cover` is falsy, the Photo renders a placeholder; this will be replaced by a TitleCard in the Card wrapper
- The Card component (via parent grid) now handles fallback rendering: if coverSrc is undefined, the TitleCard appears as the card face

**No change to this file's data fetch or filtering logic** — the cover existence signal remains; the visual fallback shifts from Photo placeholder to TitleCard.

---

### `src/app/writing/page.tsx` (page, CRUD)

**Analog:** `src/app/writing/page.tsx` (existing, lines 67–155)

**Current Card rendering** (lines 109–123):
```typescript
{yearPosts.map((post) => (
  <Card
    key={post.id}
    href={`/blog/${post.slug}`}
    title={post.title}
    blurb={post.description}
    kicker={post.tags?.[0]}
    coverSrc={
      post.cover
        ? `/api/notion-cover?pageId=${post.id}`
        : undefined
    }
    coverAlt={post.cover ? post.title : undefined}
  />
))}
```

**Modification to add reading time:**

Import reading-time utility (lines 1–10):
```typescript
import { estimateReadingTime } from '@/utils/reading-time'
```

Add `readingTime` prop when rendering Card:
```typescript
readingTime={post.description ? estimateReadingTime(post.description) : undefined}
```

**Reading time calculation pattern** (from src/utils/reading-time.ts, lines 11–17):
```typescript
export function estimateReadingTime(text: string): number {
  const words = text.trim().split(/\s+/).filter(Boolean).length
  return Math.max(1, Math.ceil(words / 200))
}
```

---

### `src/app/projects/page.tsx` (page, CRUD)

**Analog:** `src/app/projects/page.tsx` (existing, lines 52–114)

**Current Card rendering** (lines 87–101):
```typescript
{yearProjects.map((project) => (
  <Card
    key={project.id}
    href={`/projects/${project.slug}`}
    title={project.title}
    blurb={project.description}
    kicker={project.tags?.[0]}
    coverSrc={
      project.image
        ? `/api/notion-cover?pageId=${project.id}`
        : undefined
    }
    coverAlt={project.image ? project.title : undefined}
  />
))}
```

**No modification required for reading time** (projects don't have reading time per D-09).

**Title and blurb already present** — Card component already renders them. The fallback title-card behavior is automatic when `coverSrc` is undefined.

---

### `src/app/opengraph-image.tsx` (route, render)

**Analog:** `src/app/blog/[slug]/opengraph-image.tsx` (lines 1–59)

**Pattern structure** (from existing OG routes):
```typescript
import { ImageResponse } from 'next/og'

export const alt = 'Monty Singer, founder of Prometheus, builder, and writer'
export const size = { width: 1200, height: 630 }
export const contentType = 'image/png'

export default function Image() {
  return new ImageResponse(
    (
      <div style={{ /* layout */ }}>
        {/* Title-card style content */}
      </div>
    ),
    { ...size }
  )
}
```

**Rebuild target:** Replace the photo + gradient (lines 20–57 in current root version) with a vermilion/ink/paper title-card design.

**Token colors for OG images:**
```typescript
--color-bg:      '#faf9f7',     /* Near-white paper */
--color-text:    '#171717',     /* Near-black ink */
--color-accent:  '#e5411f',     /* Vermilion */
```

**Offset shadow in JSX-style OG image:**
```typescript
<div style={{
  position: 'absolute',
  width: '100%',
  height: '100%',
  background: '#faf9f7',  /* paper field */
}}>
  <h1 style={{
    fontSize: 96,
    fontWeight: 800,  /* --sig-weight */
    color: '#171717',
    textShadow: '12px 12px 0 #171717',  /* offset solid shape */
  }}>
    Monty Singer
  </h1>
</div>
```

---

### `src/app/blog/[slug]/opengraph-image.tsx` (route, CRUD)

**Analog:** `src/app/blog/[slug]/opengraph-image.tsx` (existing, lines 1–59)

**Current structure:**
```typescript
import { ImageResponse } from 'next/og'
import { getPostBySlug } from '@/lib/notion'

export const runtime = 'edge'
export const size = { width: 1200, height: 630 }
export const contentType = 'image/png'

export default async function Image({ params }: Props) {
  const { slug } = await params
  let title = 'Writing'
  let date = ''

  try {
    const post = await getPostBySlug(slug)
    if (post) {
      title = post.title
      date = post.date ? new Date(post.date).toLocaleDateString(...) : ''
    }
  } catch { /* fallback */ }

  return new ImageResponse(/* ... */)
}
```

**Modification:** Replace the navy gradient (line 37) with paper/ink/vermilion title-card style.

**Props passed to ImageResponse:**
```typescript
// From post object (fetched via getPostBySlug):
- post.title → OG title display
- post.date → formatted kicker
- (new) post.description → optional subtitle / dek
```

**Kicker pattern** (use ISO date as the "Essay" label):
```typescript
const kicker = post.date
  ? new Date(post.date).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' })
  : 'Essay'
```

---

### `src/app/projects/[slug]/opengraph-image.tsx` (route, CRUD)

**Analog:** `src/app/projects/[slug]/opengraph-image.tsx` (existing, lines 1–54)

**Current structure:**
```typescript
import { ImageResponse } from 'next/og'
import { getProjectBySlug } from '@/lib/notion-projects'

export const runtime = 'edge'
export const size = { width: 1200, height: 630 }
export const contentType = 'image/png'

export default async function Image({ params }: Props) {
  const { slug } = await params
  let title = 'Project'
  let description = ''

  try {
    const project = await getProjectBySlug(slug)
    if (project) {
      title = project.title
      description = project.description
    }
  } catch { /* fallback */ }

  return new ImageResponse(/* ... */)
}
```

**Modification:** Replace the navy gradient (line 31) with paper/ink/vermilion title-card style.

**Props passed to ImageResponse:**
```typescript
// From project object (fetched via getProjectBySlug):
- project.title → OG title display
- project.tags?.[0] → kicker (category / tag)
- project.description → optional subtitle / dek
```

**Kicker pattern** (use project category/tag):
```typescript
const kicker = project?.tags?.[0] || 'Project'
```

---

## Shared Patterns

### Offset Solid Shadow (Brutalist Signature)
**Source:** `src/app/globals.css` lines 85–100 (h1.sig) + lines 933–939 (.shadowed.in .photo)
**Apply to:** All title-card components, OG images, hover states on card grids
```css
box-shadow: 12px 12px 0 var(--color-text);  /* hard offset solid — ink on light, paper on dark */
```

### Token-Based Color Auto-Inversion
**Source:** `src/app/globals.css` lines 203–213 (.band-dark mechanism)
**Apply to:** Title-card fallback rendering when placed in light vs dark sections
```css
/* Light section (default) */
--color-text: #171717;
--color-bg: #faf9f7;

/* Dark section override */
.band-dark {
  --color-text: #f5f3ee;
  --color-bg: #141416;
}
```

### Reading Time Estimation
**Source:** `src/utils/reading-time.ts` lines 11–17
**Apply to:** All /writing cards
```typescript
export function estimateReadingTime(text: string): number {
  const words = text.trim().split(/\s+/).filter(Boolean).length
  return Math.max(1, Math.ceil(words / 200))
}
```

### Notion Property Mapping
**Source:** `src/lib/notion.ts` lines 39–50 (BlogPost interface)
**Apply to:** Ensure description property is always fetched from Notion
```typescript
export interface BlogPost {
  id: string;
  slug: string;
  title: string;
  description: string;  /* excerpted from Notion; used for card dek */
  published: boolean;
  date: string;
  tags: string[];
  cover: string | null;
  /* ... */
}
```

### Cover Fetch via Proxy
**Source:** `src/app/api/notion-cover/route.ts` lines 1–43
**Apply to:** All cover image URLs in Card component
```typescript
src={`/api/notion-cover?pageId=${project.id}`}
```

---

## No Analog Found

All Phase 19 files have direct analogs or self-referential patterns (modify existing components). No files require external RESEARCH.md pattern reference.

---

## Metadata

**Analog search scope:** `src/app/`, `src/components/`, `src/lib/`, `src/utils/`
**Key files scanned:**
- `src/app/globals.css` (design tokens, h1.sig pattern, .band-dark mechanism)
- `src/components/v3/card.tsx` (Card component structure)
- `src/components/home/section-work.tsx` (cover fetch pattern)
- `src/app/blog/[slug]/opengraph-image.tsx` (OG image pattern)
- `src/utils/reading-time.ts` (reading time utilities)
- `src/lib/notion.ts`, `src/lib/notion-projects.ts` (BlogPost/Project interfaces)

**Pattern extraction date:** 2026-07-06
