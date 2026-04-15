import { describe, it, expect } from 'vitest'
import { extractExcerpt } from '@/utils/notion-text'
import type { BlockObjectResponse } from '@notionhq/client/build/src/api-endpoints'

function para(text: string): BlockObjectResponse {
  return {
    type: 'paragraph',
    paragraph: { rich_text: [{ plain_text: text }] },
  } as unknown as BlockObjectResponse
}

describe('extractExcerpt', () => {
  it('returns full text when shorter than maxChars', () => {
    expect(extractExcerpt([para('short body')], 150)).toBe('short body')
  })

  it('truncates to maxChars at a word boundary with ellipsis', () => {
    const long = 'word '.repeat(100).trim()
    const out = extractExcerpt([para(long)], 50)
    expect(out.length).toBeLessThanOrEqual(51) // 50 + ellipsis
    expect(out.endsWith('…')).toBe(true)
    expect(out).not.toMatch(/\S$/) // no partial-word end before ellipsis
  })

  it('handles empty blocks', () => {
    expect(extractExcerpt([], 150)).toBe('')
  })
})
