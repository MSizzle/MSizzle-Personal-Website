import { describe, it, expect, vi } from 'vitest'

vi.mock('@/lib/notion', () => ({
  getPublishedPosts: vi.fn(async () => []),
}))

vi.mock('@/lib/notion-projects', () => ({
  getPublishedProjects: vi.fn(async () => []),
}))

import sitemap from '@/app/sitemap'

describe('sitemap()', () => {
  it('does NOT include /uses entry (page removed; Things I Love is the homepage #loves section)', async () => {
    const result = await sitemap()
    const usesEntry = result.find((entry) => entry.url.endsWith('/uses'))
    expect(usesEntry).toBeUndefined()
  })

  it('includes at least 4 static routes (/, /building, /writing, /contact)', async () => {
    const result = await sitemap()
    // Static routes: /, /building, /writing, /contact = 4
    // /about was removed and /projects renamed to /building (quick 260706-tx6);
    // /portfolio consolidated into /building via 308 redirect; /uses removed.
    // Dynamic routes from mocked Notion return [] so only static routes are present.
    // Filter out blog/ and building/ slugs to count only static-looking entries.
    const staticLooking = result.filter(
      (entry) => !entry.url.includes('/blog/') && !entry.url.includes('/building/')
    )
    expect(staticLooking.length).toBeGreaterThanOrEqual(4)
  })

  // /prometheus now 301s to prometheus.today (quick task 260728-kcg). A URL that
  // redirects must never appear in the sitemap.
  it('excludes the retired /prometheus route', async () => {
    const result = await sitemap()
    expect(result.find((entry) => entry.url.endsWith('/prometheus'))).toBeUndefined()
  })

  it('does NOT include /portfolio entry (consolidated into /projects)', async () => {
    const result = await sitemap()
    const portfolioEntry = result.find((e) => e.url.endsWith('/portfolio'))
    expect(portfolioEntry).toBeUndefined()
  })
})
