import Parser from 'rss-parser'

export const SUBSTACK_FEED_URL = 'https://montymonthly.substack.com/feed'

type CustomItem = {
  enclosure?: { url?: string }
  'media:thumbnail'?: { $?: { url?: string } }
  'content:encoded'?: string
}

export type MontyMonthlyIssue = {
  title: string
  link: string
  pubDate: string
  thumbnail: string | null
}

function extractThumbnail(item: CustomItem): string | null {
  if (item.enclosure?.url) return item.enclosure.url
  const mediaUrl = item['media:thumbnail']?.$?.url
  if (mediaUrl) return mediaUrl
  const encoded = item['content:encoded']
  if (encoded) {
    const m = encoded.match(/<img[^>]+src="([^"]+)"/i)
    if (m) return m[1]
  }
  return null
}

export async function fetchMontyMonthlyIssues(limit: number = 10): Promise<MontyMonthlyIssue[]> {
  try {
    const parser = new Parser<object, CustomItem>({
      customFields: {
        item: ['enclosure', 'media:thumbnail', 'content:encoded'],
      },
    })
    const feed = await parser.parseURL(SUBSTACK_FEED_URL)
    const items = feed.items ?? []
    return items.slice(0, limit).map((item) => ({
      title: (item as unknown as { title?: string }).title ?? '',
      link: (item as unknown as { link?: string }).link ?? '',
      pubDate: (item as unknown as { pubDate?: string }).pubDate ?? '',
      thumbnail: extractThumbnail(item as unknown as CustomItem),
    }))
  } catch {
    return []
  }
}
