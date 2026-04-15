import type { BlockObjectResponse } from '@notionhq/client/build/src/api-endpoints'

export function extractTextFromBlock(block: BlockObjectResponse): string {
  const richTextTypes = [
    'paragraph', 'heading_1', 'heading_2', 'heading_3',
    'bulleted_list_item', 'numbered_list_item', 'quote', 'callout', 'toggle',
  ] as const

  for (const type of richTextTypes) {
    const b = block as Record<string, unknown>
    if (b[type] && typeof b[type] === 'object') {
      const rich = (b[type] as { rich_text?: Array<{ plain_text: string }> }).rich_text
      if (rich) return rich.map((r) => r.plain_text).join(' ')
    }
  }
  return ''
}

/** First `maxChars` chars of the concatenated block text, trimmed to a word boundary, with `…` appended on truncation. */
export function extractExcerpt(blocks: BlockObjectResponse[], maxChars: number = 150): string {
  const text = blocks.map(extractTextFromBlock).join(' ').replace(/\s+/g, ' ').trim()
  if (text.length <= maxChars) return text
  return text.slice(0, maxChars).replace(/\s+\S*$/, '').trim() + '…'
}
