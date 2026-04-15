import { describe, it, expect, vi, beforeEach } from 'vitest'

vi.mock('rss-parser', () => {
  return {
    default: vi.fn(),
  }
})

describe('fetchMontyMonthlyIssues', () => {
  beforeEach(() => { vi.resetModules() })

  // NOTE: vitest 4.x requires constructor mocks to use 'function' keyword (not arrow fns).
  // Using function expressions lets `new Parser()` return the intended instance object.

  it('maps parser items into {title, link, pubDate, thumbnail}', async () => {
    const Parser = (await import('rss-parser')).default as unknown as ReturnType<typeof vi.fn>
    Parser.mockImplementation(function () {
      return {
        parseURL: async () => ({
          items: [
            { title: 'Issue 1', link: 'https://sub/1', pubDate: '2026-03-01', enclosure: { url: 'https://img/1.jpg' } },
            { title: 'Issue 2', link: 'https://sub/2', pubDate: '2026-02-01' },
          ],
        }),
      }
    })
    const { fetchMontyMonthlyIssues } = await import('@/lib/rss/substack')
    const items = await fetchMontyMonthlyIssues()
    expect(items).toHaveLength(2)
    expect(items[0]).toEqual({
      title: 'Issue 1',
      link: 'https://sub/1',
      pubDate: '2026-03-01',
      thumbnail: 'https://img/1.jpg',
    })
    expect(items[1].thumbnail).toBeNull()
  })

  it('caps at 10 items', async () => {
    const Parser = (await import('rss-parser')).default as unknown as ReturnType<typeof vi.fn>
    Parser.mockImplementation(function () {
      return {
        parseURL: async () => ({
          items: Array.from({ length: 20 }, (_, i) => ({ title: `#${i}`, link: `https://x/${i}`, pubDate: '2026-01-01' })),
        }),
      }
    })
    const { fetchMontyMonthlyIssues } = await import('@/lib/rss/substack')
    const items = await fetchMontyMonthlyIssues()
    expect(items.length).toBeLessThanOrEqual(10)
  })

  it('returns [] on parser failure (D-27 fallback)', async () => {
    const Parser = (await import('rss-parser')).default as unknown as ReturnType<typeof vi.fn>
    Parser.mockImplementation(function () {
      return {
        parseURL: async () => { throw new Error('network') },
      }
    })
    const { fetchMontyMonthlyIssues } = await import('@/lib/rss/substack')
    const items = await fetchMontyMonthlyIssues()
    expect(items).toEqual([])
  })
})
