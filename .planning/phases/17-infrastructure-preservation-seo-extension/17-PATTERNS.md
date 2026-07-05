# Phase 17: Infrastructure Preservation & SEO Extension - Pattern Map

**Mapped:** 2026-06-20
**Files analyzed:** 7 new/modified files
**Analogs found:** 6 / 7 (86% coverage)

## File Classification

| New/Modified File | Role | Data Flow | Closest Analog | Match Quality |
|-------------------|------|-----------|----------------|---------------|
| `src/app/sitemap.ts` | route handler (metadata) | build-time static generation | `src/app/robots.ts` | exact (same file type, metadata route) |
| `src/__tests__/seo/sitemap.test.ts` | test (unit) | N/A | `src/__tests__/seo/metadata.test.ts` | role-match (SEO unit test pattern) |
| `src/__tests__/seo/robots.test.ts` | test (unit) | N/A | `src/__tests__/seo/metadata.test.ts` | role-match (SEO unit test pattern) |
| `src/__tests__/pages/uses.test.tsx` | test (component/page) | N/A | `src/__tests__/pages/writing.test.tsx` | exact (page component test with mocks and metadata assertions) |
| `src/__tests__/pages/watching.test.tsx` | test (component/page) | N/A | `src/__tests__/pages/projects.test.tsx` | exact (page component test with server component rendering) |
| `src/__tests__/components/analytics.test.tsx` | test (unit, env-gated component) | N/A | `src/__tests__/components/umami-analytics.test.tsx` | exact (identical component, test already exists) |
| `src/__tests__/seo/feed-route.test.ts` | test (route handler) | N/A | `src/__tests__/seo/feed-route.test.ts` (existing) | exact (file exists, may extend or reuse) |

---

## Pattern Assignments

### `src/app/sitemap.ts` (route handler, build-time metadata)

**Analog:** `src/app/robots.ts` (lines 1-9)

**Imports pattern** (from robots.ts, lines 1-2):
```typescript
import type { MetadataRoute } from 'next'
import { SITE_URL } from '@/lib/seo/site'
```

**Core pattern** (sitemap.ts already exists; modify staticRoutes array, lines 18-28):
```typescript
// Current staticRoutes array (lines 18-28 in existing sitemap.ts)
const staticRoutes: MetadataRoute.Sitemap = [
  { url: SITE_URL, lastModified: new Date(), changeFrequency: 'weekly', priority: 1 },
  { url: `${SITE_URL}/about`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.8 },
  { url: `${SITE_URL}/prometheus`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.9 },
  { url: `${SITE_URL}/newsletter`, lastModified: new Date(), changeFrequency: 'weekly', priority: 0.8 },
  { url: `${SITE_URL}/projects`, lastModified: new Date(), changeFrequency: 'weekly', priority: 0.9 },
  { url: `${SITE_URL}/writing`, lastModified: new Date(), changeFrequency: 'weekly', priority: 0.9 },
  { url: `${SITE_URL}/photos`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.6 },
  // ADD THESE TWO (D-04):
  { url: `${SITE_URL}/uses`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.6 },
  { url: `${SITE_URL}/watching`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.6 },
  { url: `${SITE_URL}/links`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.5 },
  { url: `${SITE_URL}/events`, lastModified: new Date(), changeFrequency: 'weekly', priority: 0.7 },
]
```

**Note:** This is a MODIFY operation on existing file. The async function, dynamic routes logic, and return statement remain unchanged.

---

### `src/__tests__/seo/sitemap.test.ts` (test, unit)

**Analog:** `src/__tests__/seo/metadata.test.ts` (lines 1-38)

**Imports pattern** (lines 1-5):
```typescript
import { describe, it, expect } from 'vitest'
import { buildBlogPostMetadata } from '@/lib/seo/blog-metadata'
import type { BlogPost } from '@/lib/notion'
```

**Test structure pattern** (lines 1-38):
```typescript
// Import describe/it/expect from vitest
// Define test data (fake objects matching the module's type expectations)
// describe('SomeFunctionality', () => { ... })
//   it('specific behavior assertion', () => {
//     const result = functionUnderTest()
//     expect(result).toBe(expectedValue)
//   })
// })
```

**Specific pattern for sitemap testing** (from RESEARCH.md Example 4, lines 530-560):
```typescript
import { describe, it, expect } from 'vitest'
import sitemap from '@/app/sitemap'

describe('sitemap', () => {
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
    expect(dynamicRoutes.length).toBeGreaterThan(0)
  })
})
```

---

### `src/__tests__/seo/robots.test.ts` (test, unit)

**Analog:** `src/__tests__/seo/metadata.test.ts` (vitest structure)

**Imports pattern** (same as metadata.test.ts):
```typescript
import { describe, it, expect } from 'vitest'
```

**Test pattern for robots** (from RESEARCH.md, Pitfalls §"Pitfall 5"):
```typescript
import { describe, it, expect } from 'vitest'
import robots from '@/app/robots'

describe('robots', () => {
  it('allows / globally and disallows /specimen and /api/', () => {
    const result = robots()
    
    expect(result.rules.userAgent).toBe('*')
    expect(result.rules.allow).toBe('/')
    expect(result.rules.disallow).toEqual(['/specimen', '/api/'])
    expect(result.sitemap).toContain('/sitemap.xml')
  })
})
```

---

### `src/__tests__/pages/uses.test.tsx` (test, page component)

**Analog:** `src/__tests__/pages/writing.test.tsx` (lines 1-89)

**Imports pattern** (lines 1-22 from writing.test.tsx):
```typescript
import React from "react";
import { describe, it, expect, vi, afterEach } from "vitest";
import { render, screen, cleanup } from "@testing-library/react";
import { USES_DATA } from "@/lib/uses";

// Mock next/image
vi.mock("next/image", () => ({
  default: (props: Record<string, unknown>) =>
    React.createElement("img", { ...props }),
}));

// Mock next/link
vi.mock("next/link", () => ({
  default: ({ children, href, ...props }: any) =>
    React.createElement("a", { href, ...props }, children),
}));

// Mock components that have internal dependencies
vi.mock("@/components/v3/uses-list", () => ({
  UsesList: () =>
    React.createElement("div", { "data-testid": "uses-list" }),
}));

afterEach(() => {
  cleanup();
  vi.clearAllMocks();
});
```

**Async server component rendering pattern** (writing.test.tsx, lines 44-50):
```typescript
async function renderUsesPage() {
  const { default: UsesPage } = await import("@/app/uses/page");
  const element = await UsesPage();
  render(element as any);
}
```

**Metadata assertion pattern** (from RESEARCH.md Example 5, lines 570-592):
```typescript
it('/uses page exports valid metadata', async () => {
  const { metadata: usesMetadata } = await import('@/app/uses/page')
  
  const resolvedMetadata = typeof usesMetadata === 'function' 
    ? await usesMetadata() 
    : usesMetadata
  
  expect(resolvedMetadata.title).toBe('Uses | Monty Singer')
  expect(resolvedMetadata.description).toBeDefined()
  expect(resolvedMetadata.alternates?.canonical).toBe('/uses')
  expect(resolvedMetadata.openGraph?.title).toBe('Uses | Monty Singer')
})
```

**Breadcrumbs presence assertion pattern** (from breadcrumbs.test.tsx, lines 49-83):
```typescript
it('renders Breadcrumbs with correct items', async () => {
  await renderUsesPage()
  // Assert that breadcrumb items are rendered
  expect(screen.getByText("Home")).toBeDefined()
  expect(screen.getByText("Uses")).toBeDefined()
})
```

---

### `src/__tests__/pages/watching.test.tsx` (test, page component)

**Analog:** `src/__tests__/pages/projects.test.tsx` (lines 1-80)

**Imports pattern** (lines 1-52 from projects.test.tsx):
```typescript
import React from "react";
import { describe, it, expect, vi, afterEach } from "vitest";
import { render, screen, cleanup } from "@testing-library/react";
import { WATCHING_ITEMS } from "@/lib/watching";

// Mock next/image
vi.mock("next/image", () => ({
  default: (props: Record<string, unknown>) =>
    React.createElement("img", { ...props, "data-testid": "next-image" }),
}));

// Mock next/link
vi.mock("next/link", () => ({
  default: ({ children, href, ...props }: any) =>
    React.createElement("a", { href, ...props }, children),
}));

// Mock video card component
vi.mock("@/components/v3/video-card", () => ({
  VideoCard: ({ item }: any) =>
    React.createElement("div", { "data-testid": "video-card", "data-id": item.id }),
}));

afterEach(() => {
  cleanup();
  vi.clearAllMocks();
});
```

**Async server component rendering pattern** (same as uses, projects.test.tsx, lines 74-78):
```typescript
async function renderWatchingPage() {
  const { default: WatchingPage } = await import("@/app/watching/page");
  const element = await WatchingPage();
  render(element as any);
}
```

**Data shape verification pattern** (projects.test.tsx, lines 82-101):
```typescript
it("WATCHING_ITEMS from @/lib/watching has length 6 (Plan 01 deliverable)", () => {
  expect(WATCHING_ITEMS.length).toBe(6);
});

it("every WatchingItem has non-empty id, title, channel, url fields", () => {
  WATCHING_ITEMS.forEach((item) => {
    expect(item.id.length).toBeGreaterThan(0);
    expect(item.title.length).toBeGreaterThan(0);
    expect(item.channel.length).toBeGreaterThan(0);
    expect(item.url.length).toBeGreaterThan(0);
  });
});
```

**Metadata assertion pattern** (same as uses, RESEARCH.md Example 5):
```typescript
it('/watching page exports valid metadata with canonical', async () => {
  const { metadata: watchingMetadata } = await import('@/app/watching/page')
  
  expect(watchingMetadata.title).toBe('Watching | Monty Singer')
  expect(watchingMetadata.description).toBeDefined()
  expect(watchingMetadata.alternates?.canonical).toBe('/watching')
})
```

---

### `src/__tests__/components/analytics.test.tsx` (test, env-gated component)

**Analog:** `src/__tests__/components/umami-analytics.test.tsx` (lines 1-64) — This test file already exists for the UmamiAnalytics component (Phase 17 requirement IN-04)

**Imports pattern** (lines 1-2):
```typescript
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { render } from '@testing-library/react'
```

**Env var setup and teardown pattern** (lines 5-14):
```typescript
const originalEnv = process.env

beforeEach(() => {
  vi.resetModules()
  process.env = { ...originalEnv }
})

afterEach(() => {
  process.env = originalEnv
})
```

**Env var mocking pattern for when vars are set** (lines 16-32):
```typescript
it('renders script when env vars are set', async () => {
  process.env.NEXT_PUBLIC_UMAMI_WEBSITE_ID = 'test-id-123'
  process.env.NEXT_PUBLIC_UMAMI_URL = 'https://analytics.example.com'

  // Mock next/script as a span to avoid jsdom script-tag stripping
  vi.doMock('next/script', () => ({
    default: ({ src, 'data-website-id': websiteId, ...rest }: any) => (
      <span data-testid="umami-script" data-src={src} data-website-id={websiteId} />
    ),
  }))

  const { UmamiAnalytics } = await import('@/components/analytics/umami-analytics')
  const { container } = render(<UmamiAnalytics />)
  const el = container.querySelector('[data-testid="umami-script"]')
  expect(el).not.toBeNull()
  expect(el?.getAttribute('data-src')).toBe('https://analytics.example.com/script.js')
  expect(el?.getAttribute('data-website-id')).toBe('test-id-123')
})
```

**Env var missing pattern** (lines 35-47):
```typescript
it('renders null when env var is missing', async () => {
  delete process.env.NEXT_PUBLIC_UMAMI_WEBSITE_ID
  process.env.NEXT_PUBLIC_UMAMI_URL = 'https://analytics.example.com'

  vi.doMock('next/script', () => ({
    default: ({ src, 'data-website-id': websiteId }: any) => (
      <span data-testid="umami-script" data-src={src} data-website-id={websiteId} />
    ),
  }))

  const { UmamiAnalytics } = await import('@/components/analytics/umami-analytics')
  const { container } = render(<UmamiAnalytics />)
  expect(container.querySelector('[data-testid="umami-script"]')).toBeNull()
})
```

---

### `src/__tests__/seo/feed-route.test.ts` (test, route handler)

**Analog:** `src/__tests__/seo/feed-route.test.ts` (existing file, lines 1-14) — may extend or reuse

**Imports pattern** (lines 1-1):
```typescript
import { describe, it, expect, vi } from 'vitest'
```

**Mock pattern for Notion dependency** (lines 3-5):
```typescript
vi.mock('@/lib/notion', () => ({
  getPublishedPosts: vi.fn(async () => []),
}))
```

**Route handler test pattern** (lines 7-14):
```typescript
describe('GET /blog/feed.xml', () => {
  it('responds with application/rss+xml content-type', async () => {
    const { GET } = await import('@/app/blog/feed.xml/route')
    const res = await GET()
    expect(res.headers.get('content-type')).toContain('application/rss+xml')
    const body = await res.text()
    expect(body).toContain('<rss version="2.0">')
  })
})
```

---

## Shared Patterns

### Test Framework Setup
**Source:** `vitest.config.ts` (lines 1-17)
**Apply to:** All test files

```typescript
// vitest.config.ts is already configured with:
// - environment: 'jsdom'
// - setupFiles: ['./src/__tests__/setup.ts']
// - include: ['src/**/*.test.{ts,tsx}']
// - alias '@' → './src'

// Run tests: npx vitest run [path]
```

### Next.js Framework Mocking
**Source:** Common across all test files (writing.test.tsx, projects.test.tsx, breadcrumbs.test.tsx)
**Apply to:** All component/page tests

```typescript
// Standard mocks for Next.js modules
vi.mock("next/image", () => ({
  default: (props: Record<string, unknown>) =>
    React.createElement("img", { ...props }),
}));

vi.mock("next/link", () => ({
  default: ({ children, href, ...props }: any) =>
    React.createElement("a", { href, ...props }, children),
}));

// For route handlers, no mocking needed — import and call directly
const { GET } = await import('@/app/some/route')
const res = await GET()
```

### Async Server Component Rendering
**Source:** `src/__tests__/pages/writing.test.tsx` (lines 44-50)
**Apply to:** uses.test.tsx, watching.test.tsx

```typescript
async function renderPageName() {
  const { default: PageComponent } = await import("@/app/path/page");
  const element = await PageComponent();
  render(element as any);
}

// Usage in tests:
it('some assertion', async () => {
  await renderPageName()
  // Assert on rendered content
})
```

### Metadata Import and Assertion
**Source:** `src/__tests__/seo/metadata.test.ts` (lines 1-38)
**Apply to:** uses.test.tsx, watching.test.tsx

```typescript
// For pages that export metadata:
const { metadata } = await import('@/app/uses/page')

// Handle both static and dynamic metadata:
const resolvedMetadata = typeof metadata === 'function' 
  ? await metadata() 
  : metadata

// Assert on metadata fields:
expect(resolvedMetadata.title).toBe('Expected Title')
expect(resolvedMetadata.alternates?.canonical).toBe('/expected-path')
expect(resolvedMetadata.openGraph?.type).toBe('website')
```

### Env Var Isolation in Tests
**Source:** `src/__tests__/components/umami-analytics.test.tsx` (lines 5-14)
**Apply to:** analytics.test.tsx

```typescript
beforeEach(() => {
  vi.resetModules()
  process.env = { ...originalEnv }  // Copy original env
})

afterEach(() => {
  process.env = originalEnv  // Restore original env
})

// In test:
process.env.NEXT_PUBLIC_VAR = 'value'
// ... test logic ...
delete process.env.NEXT_PUBLIC_VAR  // Clean up if needed
```

### Notion/API Mocking Pattern
**Source:** `src/__tests__/pages/writing.test.tsx` (lines 34-37) and `src/__tests__/pages/projects.test.tsx` (lines 44-52)
**Apply to:** Any test that imports from @/lib/notion or @/lib/notion-projects

```typescript
vi.mock("@/lib/notion", () => ({
  getPublishedPosts: vi.fn(),
}));

// Usage in test:
const { getPublishedPosts } = await import("@/lib/notion");
vi.mocked(getPublishedPosts).mockResolvedValue([
  { id: 'x', slug: 'test', ... }
])

// For assertions on Notion data shape:
import { USES_DATA } from "@/lib/uses";
expect(USES_DATA.length).toBe(expectedCount);
```

---

## No Analog Found

All files either have direct analogs or are extensions of existing analogs. Coverage: **100%** (7/7 files mapped).

---

## Metadata

**Analog search scope:** src/__tests__/ (all test files), src/app/ (route handlers like sitemap.ts, robots.ts), src/components/analytics/ (UmamiAnalytics)

**Files scanned:**
- `src/__tests__/seo/` (6 files: metadata.test.ts, schemas.test.ts, blog-feed.test.ts, feed-route.test.ts, excerpt.test.ts, rss-parser.test.ts)
- `src/__tests__/pages/` (8 files: writing.test.tsx, projects.test.tsx, blog-slug.test.tsx, home.test.tsx, links.test.tsx, about.test.tsx, blog.test.tsx, og-image.test.tsx)
- `src/__tests__/components/` (umami-analytics.test.tsx and others)
- `src/app/` (sitemap.ts, robots.ts)

**Pattern extraction date:** 2026-06-20

**Key findings:**
1. All test files use `vitest` + `@testing-library/react` with JSdom
2. Page component tests follow async server component rendering pattern
3. Metadata assertions handle both static and dynamic metadata exports
4. Env var tests use `vi.resetModules()` + `process.env` copy/restore
5. Route handlers tested via direct import and function call (no server needed)
6. SEO tests are lightweight — validate structure, not complex logic
7. Mocking is comprehensive (next/image, next/link, custom components) to avoid side effects
