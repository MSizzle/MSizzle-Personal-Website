import type { Metadata } from 'next'
import type { BlockObjectResponse } from '@notionhq/client/build/src/api-endpoints'
import type { BlogPost } from '@/lib/notion'
import { extractTextFromBlock } from '@/utils/notion-text'
import { canonical } from './site'

function truncate(text: string, maxChars: number = 155): string {
  if (!text) return ''
  if (text.length <= maxChars) return text
  return text.slice(0, maxChars).replace(/\s+\S*$/, '').trim() + '…'
}

// Blocks that carry the post's actual opening prose. Headings are deliberately
// excluded -- a post's first heading usually restates its title, which would
// produce a description that duplicates the <title> tag and tells Google
// nothing new.
const PROSE_BLOCK_TYPES = new Set([
  'paragraph',
  'quote',
  'callout',
  'bulleted_list_item',
  'numbered_list_item',
])

/**
 * Meta description from the post's own opening prose.
 *
 * Every one of the 16 live posts had an empty Notion `Description` property, so
 * they all rendered the same `An essay by Monty Singer: {title}.` fallback --
 * 16 near-duplicate descriptions carrying no information (quick task
 * 260728-kcg). Walking the blocks gives each post a distinct, real description
 * without Monty having to backfill anything in Notion.
 *
 * Returns '' when the post opens with an image, embed, or divider and has no
 * prose to pull, so the caller can fall through to the template.
 */
export function deriveDescriptionFromBlocks(
  blocks: BlockObjectResponse[],
  maxChars: number = 155,
): string {
  const prose: string[] = []

  for (const block of blocks) {
    if (!PROSE_BLOCK_TYPES.has(block.type)) continue
    const text = extractTextFromBlock(block).replace(/\s+/g, ' ').trim()
    if (!text) continue
    prose.push(text)
    // One substantive block is usually enough; keep pulling only while the
    // running text is still too short to stand on its own.
    if (prose.join(' ').length >= maxChars) break
  }

  return truncate(prose.join(' ').replace(/\s+/g, ' ').trim(), maxChars)
}

/**
 * `blocks` is optional so callers that have not fetched the body (listings,
 * feeds) still get valid metadata. Precedence: an explicit Notion Description
 * always wins, then the post's own opening prose, then the template as a last
 * resort.
 */
export function buildBlogPostMetadata(
  post: BlogPost,
  blocks?: BlockObjectResponse[],
): Metadata {
  const title = post.title
  const derived = blocks?.length ? deriveDescriptionFromBlocks(blocks) : ''
  const description = truncate(
    post.description || derived || `An essay by Monty Singer: ${post.title}.`,
    155,
  )
  const url = canonical(`/blog/${post.slug}`)

  return {
    title,
    description,
    alternates: { canonical: `/blog/${post.slug}` },
    openGraph: {
      title,
      description,
      url,
      type: 'article',
      publishedTime: post.date || undefined,
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
    },
  }
}
