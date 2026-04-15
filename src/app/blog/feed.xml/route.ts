import { getPublishedPosts } from '@/lib/notion'
import { buildRssXml } from '@/lib/rss/blog-feed'

export const revalidate = 1800

export async function GET() {
  let posts: Awaited<ReturnType<typeof getPublishedPosts>> = []
  if (process.env.NOTION_TOKEN && process.env.NOTION_DATABASE_ID) {
    try {
      posts = await getPublishedPosts()
    } catch {}
  }
  const xml = buildRssXml(posts)
  return new Response(xml, {
    headers: {
      'Content-Type': 'application/rss+xml; charset=utf-8',
      'Cache-Control': 'public, max-age=0, s-maxage=1800',
    },
  })
}
