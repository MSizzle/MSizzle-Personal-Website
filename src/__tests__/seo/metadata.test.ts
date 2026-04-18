import { describe, it, expect } from 'vitest'
import { buildBlogPostMetadata } from '@/lib/seo/blog-metadata'
import type { BlogPost } from '@/lib/notion'

const fakePost: BlogPost = {
  id: 'x',
  slug: 'hello-world',
  title: 'Hello World',
  description: 'A short intro to the site and what it covers.',
  emoji: '👋',
  date: '2026-01-15',
  tags: [],
  cover: null,
  published: true,
  lastEdited: '2026-01-15',
}

describe('buildBlogPostMetadata', () => {
  it('uses pipe separator and sets canonical', () => {
    const meta = buildBlogPostMetadata(fakePost)
    expect(meta.title).toBe('Hello World | Monty Singer')
    expect(meta.alternates?.canonical).toBe('/blog/hello-world')
    expect((meta.openGraph as { type?: string })?.type).toBe('article')
  })

  it('truncates long descriptions to <=155 chars + ellipsis', () => {
    const long = 'word '.repeat(200).trim()
    const meta = buildBlogPostMetadata({ ...fakePost, description: long })
    const desc = meta.description as string
    expect(desc.length).toBeLessThanOrEqual(156)
    expect(desc.endsWith('…')).toBe(true)
  })

  it('falls back to generic description when post.description is empty', () => {
    const meta = buildBlogPostMetadata({ ...fakePost, description: '' })
    expect(meta.description).toContain('Hello World')
  })
})
