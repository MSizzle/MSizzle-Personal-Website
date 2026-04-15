import type { BlogPost } from '@/lib/notion'
import { SITE_URL, canonical } from '@/lib/seo/site'

function escapeXml(s: string): string {
  return s
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;')
}

function toRfc822(date: string): string {
  const d = date ? new Date(date) : new Date()
  return d.toUTCString()
}

export function buildRssXml(posts: BlogPost[]): string {
  const items = posts
    .map((post) => {
      const url = canonical(`/blog/${post.slug}`)
      return `    <item>
      <title>${escapeXml(post.title)}</title>
      <link>${escapeXml(url)}</link>
      <guid isPermaLink="true">${escapeXml(url)}</guid>
      <pubDate>${toRfc822(post.date)}</pubDate>
      <description>${escapeXml(post.description ?? '')}</description>
      <author>montydsinger@gmail.com (Monty Singer)</author>
    </item>`
    })
    .join('\n')

  return `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0">
  <channel>
    <title>Monty Singer | Writings</title>
    <link>${canonical('/blog')}</link>
    <description>Essays by Monty Singer on philosophy, technology, AI, entrepreneurship, and life.</description>
    <language>en-us</language>
    <atom:link xmlns:atom="http://www.w3.org/2005/Atom" href="${SITE_URL}/blog/feed.xml" rel="self" type="application/rss+xml"/>
${items}
  </channel>
</rss>`
}
