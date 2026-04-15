import { describe, it, expect } from 'vitest'
import { buildRssXml } from '@/lib/rss/blog-feed'
import type { BlogPost } from '@/lib/notion'

const basePost: BlogPost = {
  id: '1',
  slug: 'x',
  title: 'x',
  description: '',
  emoji: '',
  date: '2026-01-01',
  tags: [],
  cover: null,
  published: true,
  lastEdited: '2026-01-01',
}

describe('buildRssXml', () => {
  it('returns a valid rss envelope with zero items when posts is empty', () => {
    const xml = buildRssXml([])
    expect(xml).toContain('<?xml version="1.0" encoding="UTF-8"?>')
    expect(xml).toContain('<rss version="2.0">')
    expect(xml).toContain('<channel>')
    expect(xml).not.toContain('<item>')
  })

  it('escapes XML special chars in titles and descriptions', () => {
    const xml = buildRssXml([
      {
        ...basePost,
        title: 'A & B < C > D "E" \'F\'',
        description: 'x & y',
      },
    ])
    expect(xml).toContain('A &amp; B &lt; C &gt; D &quot;E&quot; &apos;F&apos;')
    expect(xml).toContain('x &amp; y')
    expect(xml).not.toContain('<title>A & B')
  })

  it('includes one <item> per post with link and pubDate', () => {
    const xml = buildRssXml([
      { ...basePost, slug: 'hello', title: 'Hello', description: 'd', date: '2026-03-15', lastEdited: '2026-03-15' },
    ])
    expect((xml.match(/<item>/g) ?? []).length).toBe(1)
    expect(xml).toContain('/blog/hello')
    expect(xml).toContain('<pubDate>')
  })
})
