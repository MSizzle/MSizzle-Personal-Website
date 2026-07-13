import { describe, it, expect, vi, beforeEach } from 'vitest'
import { decodeHtmlEntities } from '@/lib/rss/substack'

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
      description: '',
      thumbnail: 'https://img/1.jpg',
    })
    expect(items[1].thumbnail).toBeNull()
  })

  it('uses the feed <description> subtitle as description, decoded', async () => {
    const Parser = (await import('rss-parser')).default as unknown as ReturnType<typeof vi.fn>
    Parser.mockImplementation(function () {
      return {
        parseURL: async () => ({
          items: [
            {
              title: 'June 2026',
              link: 'https://sub/june',
              pubDate: '2026-06-30',
              contentSnippet: 'I moved to Malaysia. | Starting Network School | The Slice of Life',
              'content:encoded': '<p>This email&#8217;s purpose is to: share what I&#8217;m up to</p>',
            },
          ],
        }),
      }
    })
    const { fetchMontyMonthlyIssues } = await import('@/lib/rss/substack')
    const items = await fetchMontyMonthlyIssues()
    expect(items[0].description).toBe('I moved to Malaysia. | Starting Network School | The Slice of Life')
  })

  it('falls back to the body excerpt when the subtitle is missing', async () => {
    const Parser = (await import('rss-parser')).default as unknown as ReturnType<typeof vi.fn>
    Parser.mockImplementation(function () {
      return {
        parseURL: async () => ({
          items: [
            {
              title: 'No subtitle',
              link: 'https://sub/x',
              pubDate: '2026-01-01',
              'content:encoded': '<p>Body text I&#8217;m keeping</p>',
            },
          ],
        }),
      }
    })
    const { fetchMontyMonthlyIssues } = await import('@/lib/rss/substack')
    const items = await fetchMontyMonthlyIssues()
    expect(items[0].description).toBe('Body text I’m keeping')
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

describe('decodeHtmlEntities', () => {
  it('decodes &amp;', () => {
    expect(decodeHtmlEntities('a &amp; b')).toBe('a & b')
  })

  it('decodes &lt;', () => {
    expect(decodeHtmlEntities('&lt;div&gt;')).toBe('<div>')
  })

  it('decodes &gt;', () => {
    expect(decodeHtmlEntities('a &gt; b')).toBe('a > b')
  })

  it('decodes &quot;', () => {
    expect(decodeHtmlEntities('&quot;hi&quot;')).toBe('"hi"')
  })

  it('decodes &apos;', () => {
    expect(decodeHtmlEntities('it&apos;s')).toBe("it's")
  })

  it('decodes &nbsp; to a space', () => {
    expect(decodeHtmlEntities('a&nbsp;b')).toBe('a b')
  })

  it('decodes &hellip;', () => {
    expect(decodeHtmlEntities('wait&hellip;')).toBe('wait…')
  })

  it('decodes &mdash;', () => {
    expect(decodeHtmlEntities('a &mdash; b')).toBe('a — b')
  })

  it('decodes &ndash;', () => {
    expect(decodeHtmlEntities('a &ndash; b')).toBe('a – b')
  })

  it('decodes &rsquo; to U+2019', () => {
    expect(decodeHtmlEntities('I&rsquo;m')).toBe('I’m')
  })

  it('decodes &lsquo; to U+2018', () => {
    expect(decodeHtmlEntities('&lsquo;hi')).toBe('‘hi')
  })

  it('decodes &rdquo; to U+201D', () => {
    expect(decodeHtmlEntities('hi&rdquo;')).toBe('hi”')
  })

  it('decodes &ldquo; to U+201C', () => {
    expect(decodeHtmlEntities('&ldquo;hi')).toBe('“hi')
  })

  it('matches entity names case-insensitively', () => {
    expect(decodeHtmlEntities('a &AMP; b')).toBe('a & b')
  })

  it('decodes decimal numeric entities via code point', () => {
    expect(decodeHtmlEntities('I&#8217;m')).toBe('I’m')
  })

  it('decodes hex numeric entities via code point', () => {
    expect(decodeHtmlEntities('I&#x2019;m')).toBe('I’m')
  })

  it('decodes hex numeric entities with uppercase X and uppercase hex digits', () => {
    expect(decodeHtmlEntities('I&#X2019;m')).toBe('I’m')
  })

  it('falls back to a space for an unrecognized named entity', () => {
    expect(decodeHtmlEntities('a&foobar;b')).toBe('a b')
  })

  it('decodes mixed entities in place', () => {
    expect(decodeHtmlEntities('I&#8217;m happy &mdash; really!')).toBe('I’m happy — really!')
  })

  it('passes plain text with no entities through unchanged', () => {
    expect(decodeHtmlEntities('no entities here')).toBe('no entities here')
  })
})
