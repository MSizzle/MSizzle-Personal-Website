import { describe, it, expect } from 'vitest'
import { selectRelatedPosts } from '@/components/blog/related-essays'
import type { BlogPost } from '@/lib/notion'

function makePost(over: Partial<BlogPost> & { slug: string }): BlogPost {
  return {
    id: over.slug,
    slug: over.slug,
    title: over.slug,
    description: '',
    published: true,
    date: '2026-01-01',
    tags: [],
    cover: null,
    emoji: null,
    lastEdited: '2026-01-01T00:00:00.000Z',
    ...over,
  }
}

// Slugs present in the curated RELATED_ESSAYS map.
const CURATED = ['choosing-faith', 'practical-philosophy', 'defiant-optimism']

describe('selectRelatedPosts', () => {
  it('honours the curated map first, in its authored order', () => {
    const all = CURATED.concat('unrelated-a', 'unrelated-b').map((slug) =>
      makePost({ slug })
    )
    const picked = selectRelatedPosts('choosing-faith', all)
    expect(picked.slice(0, 2).map((p) => p.slug)).toEqual([
      'practical-philosophy',
      'defiant-optimism',
    ])
  })

  it('never includes the current post', () => {
    const all = CURATED.concat('x', 'y', 'z').map((slug) => makePost({ slug }))
    for (const slug of all.map((p) => p.slug)) {
      expect(selectRelatedPosts(slug, all).map((p) => p.slug)).not.toContain(slug)
    }
  })

  // /blog/vibe-check rendered zero onward links because it had no map entry at
  // all (quick task 260728-kcg). Any post must now get links regardless.
  it('still returns posts for a slug absent from the curated map', () => {
    const all = ['brand-new-post', 'a', 'b', 'c', 'd'].map((slug) =>
      makePost({ slug })
    )
    const picked = selectRelatedPosts('brand-new-post', all)
    expect(picked).toHaveLength(3)
    expect(picked.map((p) => p.slug)).not.toContain('brand-new-post')
  })

  it('prefers posts sharing the most tags when topping up', () => {
    const all = [
      makePost({ slug: 'current', tags: ['ai', 'essay'] }),
      makePost({ slug: 'both', tags: ['ai', 'essay'] }),
      makePost({ slug: 'one', tags: ['ai'] }),
      makePost({ slug: 'none', tags: ['cooking'] }),
    ]
    const picked = selectRelatedPosts('current', all)
    expect(picked[0].slug).toBe('both')
    expect(picked[1].slug).toBe('one')
  })

  it('returns no duplicates', () => {
    const all = CURATED.concat('p1', 'p2', 'p3').map((slug) => makePost({ slug }))
    const picked = selectRelatedPosts('choosing-faith', all)
    expect(new Set(picked.map((p) => p.slug)).size).toBe(picked.length)
  })

  it('caps at 3 and degrades gracefully to a short archive', () => {
    const many = Array.from({ length: 12 }, (_, i) => makePost({ slug: `p${i}` }))
    expect(selectRelatedPosts('p0', many)).toHaveLength(3)

    const two = [makePost({ slug: 'only' }), makePost({ slug: 'other' })]
    expect(selectRelatedPosts('only', two).map((p) => p.slug)).toEqual(['other'])

    expect(selectRelatedPosts('lonely', [makePost({ slug: 'lonely' })])).toEqual([])
  })

  it('skips curated slugs that no longer exist in the archive', () => {
    // 'practical-philosophy' is curated for 'choosing-faith' but absent here.
    const all = [makePost({ slug: 'choosing-faith' }), makePost({ slug: 'defiant-optimism' })]
    const picked = selectRelatedPosts('choosing-faith', all)
    expect(picked.map((p) => p.slug)).toEqual(['defiant-optimism'])
  })
})
