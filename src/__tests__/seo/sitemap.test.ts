import { describe, it, expect, vi } from 'vitest'

vi.mock('@/lib/notion', () => ({
  getPublishedPosts: vi.fn(async () => []),
}))

vi.mock('@/lib/notion-projects', () => ({
  getPublishedProjects: vi.fn(async () => []),
}))

import sitemap from '@/app/sitemap'

describe('sitemap()', () => {
  it('includes /uses entry with priority 0.6 and changeFrequency monthly', async () => {
    const result = await sitemap()
    const usesEntry = result.find((entry) => entry.url.endsWith('/uses'))
    expect(usesEntry).toBeDefined()
    expect(usesEntry?.priority).toBe(0.6)
    expect(usesEntry?.changeFrequency).toBe('monthly')
  })

  it('includes at least 6 static routes (existing site routes)', async () => {
    const result = await sitemap()
    // Static routes: /, /about, /prometheus, /projects, /writing, /uses = 6
    // Dynamic routes from mocked Notion return [] so only static routes are present
    // Filter out blog/ and projects/ slugs to count only static-looking entries
    const staticLooking = result.filter(
      (entry) => !entry.url.includes('/blog/') && !entry.url.includes('/projects/')
    )
    expect(staticLooking.length).toBeGreaterThanOrEqual(6)
  })
})
