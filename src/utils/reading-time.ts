import type { BlockObjectResponse } from '@notionhq/client/build/src/api-endpoints'
import { extractTextFromBlock } from './notion-text'

/** Exact reading time from Notion blocks. Use on detail page where blocks are already fetched. */
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
