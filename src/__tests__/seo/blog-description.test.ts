import { describe, it, expect } from 'vitest'
import {
  deriveDescriptionFromBlocks,
  buildBlogPostMetadata,
} from '@/lib/seo/blog-metadata'
import type { BlockObjectResponse } from '@notionhq/client/build/src/api-endpoints'
import type { BlogPost } from '@/lib/notion'

function block(type: string, text: string): BlockObjectResponse {
  return {
    type,
    [type]: { rich_text: [{ plain_text: text }] },
  } as unknown as BlockObjectResponse
}

function imageBlock(): BlockObjectResponse {
  return { type: 'image', image: {} } as unknown as BlockObjectResponse
}

const post: BlogPost = {
  id: 'p1',
  slug: 'vibe-check',
  title: 'Vibe Check',
  description: '',
  published: true,
  date: '2026-07-09',
  tags: [],
  cover: null,
  emoji: null,
  lastEdited: '2026-07-20T00:00:00.000Z',
}

describe('deriveDescriptionFromBlocks', () => {
  it('pulls the opening prose', () => {
    const blocks = [block('paragraph', 'Vibes are high. This past month was loud.')]
    expect(deriveDescriptionFromBlocks(blocks)).toBe(
      'Vibes are high. This past month was loud.'
    )
  })

  // A post's first heading usually restates its title, which would make the
  // description duplicate the <title> tag and tell Google nothing new.
  it('skips headings in favour of real prose', () => {
    const blocks = [block('heading_1', 'Vibe Check'), block('paragraph', 'Vibes are high.')]
    expect(deriveDescriptionFromBlocks(blocks)).toBe('Vibes are high.')
  })

  it('truncates on a word boundary with an ellipsis', () => {
    // Distinct words so a mid-word cut is detectable.
    const long = Array.from({ length: 60 }, (_, i) => `word${i}`).join(' ')
    const out = deriveDescriptionFromBlocks([block('paragraph', long)])

    expect(out.length).toBeLessThanOrEqual(156)
    expect(out.endsWith('…')).toBe(true)

    // The kept text must be a whole-word prefix of the original: it appears
    // verbatim at the start, and the original continues with a space rather
    // than mid-token.
    const kept = out.slice(0, -1)
    expect(long.startsWith(kept)).toBe(true)
    expect(long[kept.length]).toBe(' ')
  })

  it('returns empty when the post opens with no prose at all', () => {
    expect(deriveDescriptionFromBlocks([imageBlock()])).toBe('')
  })

  it('collapses whitespace across joined blocks', () => {
    const blocks = [block('paragraph', '  spaced   out  '), block('paragraph', 'second')]
    expect(deriveDescriptionFromBlocks(blocks)).toBe('spaced out second')
  })
})

describe('buildBlogPostMetadata description precedence', () => {
  it('prefers an explicit Notion Description over derived prose', () => {
    const meta = buildBlogPostMetadata(
      { ...post, description: 'Hand-written summary.' },
      [block('paragraph', 'Opening prose.')]
    )
    expect(meta.description).toBe('Hand-written summary.')
  })

  it('falls back to derived prose when Notion Description is empty', () => {
    const meta = buildBlogPostMetadata(post, [block('paragraph', 'Opening prose.')])
    expect(meta.description).toBe('Opening prose.')
    expect(meta.openGraph?.description).toBe('Opening prose.')
  })

  // 16 posts all rendered this same string before 260728-kcg.
  it('falls back to the template only when there is no prose at all', () => {
    expect(buildBlogPostMetadata(post, [imageBlock()]).description).toBe(
      'An essay by Monty Singer: Vibe Check.'
    )
    expect(buildBlogPostMetadata(post).description).toBe(
      'An essay by Monty Singer: Vibe Check.'
    )
  })
})
