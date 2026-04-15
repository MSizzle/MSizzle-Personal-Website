import { describe, it, expect, vi } from 'vitest'

vi.mock('@/lib/notion', () => ({
  getPublishedPosts: vi.fn(async () => []),
}))

describe('GET /blog/feed.xml', () => {
  it('responds with application/rss+xml content-type', async () => {
    const { GET } = await import('@/app/blog/feed.xml/route')
    const res = await GET()
    expect(res.headers.get('content-type')).toContain('application/rss+xml')
    const body = await res.text()
    expect(body).toContain('<rss version="2.0">')
  })
})
