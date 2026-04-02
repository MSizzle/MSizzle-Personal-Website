import type { BlockObjectResponse } from '@notionhq/client/build/src/api-endpoints'

function extractTextFromBlock(block: BlockObjectResponse): string {
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

/** Exact reading time from Notion blocks — use on detail page where blocks are already fetched. */
export function calculateReadingTime(blocks: BlockObjectResponse[]): number {
  const text = blocks.map(extractTextFromBlock).join(' ')
  const words = text.trim().split(/\s+/).filter(Boolean).length
  return Math.max(1, Math.ceil(words / 200))
}

/** Lightweight reading time estimate from any text string (e.g. post description).
 *  Use on listing page to satisfy D-09 without extra API calls.
 *  Returns at least 1. */
export function estimateReadingTime(text: string): number {
  const words = text.trim().split(/\s+/).filter(Boolean).length
  return Math.max(1, Math.ceil(words / 200))
}
