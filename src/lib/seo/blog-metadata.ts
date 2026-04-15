import type { Metadata } from 'next'
import type { BlogPost } from '@/lib/notion'
import { canonical } from './site'

function truncate(text: string, maxChars: number = 155): string {
  if (!text) return ''
  if (text.length <= maxChars) return text
  return text.slice(0, maxChars).replace(/\s+\S*$/, '').trim() + '…'
}

export function buildBlogPostMetadata(post: BlogPost): Metadata {
  const title = `${post.title} | Monty Singer`
  const description = truncate(post.description || `An essay by Monty Singer: ${post.title}.`, 155)
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
