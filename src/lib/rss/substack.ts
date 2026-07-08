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

// Substack's enclosure is often a .heic source (Chrome/Firefox can't render
// HEIC), while the <img> in content:encoded and media:thumbnail are web-safe
// JPEG/WebP. Prefer the first candidate whose underlying source isn't HEIC, and
// only fall back to a HEIC URL if nothing else is available.
function isRenderable(url: string): boolean {
  return !/\.(heic|heif)(\?|#|$)/i.test(decodeURIComponent(url))
}

function extractThumbnail(item: CustomItem): string | null {
  const candidates: string[] = []
  if (item.enclosure?.url) candidates.push(item.enclosure.url)
  const mediaUrl = item['media:thumbnail']?.$?.url
  if (mediaUrl) candidates.push(mediaUrl)
  const encoded = item['content:encoded']
  if (encoded) {
    const m = encoded.match(/<img[^>]+src="([^"]+)"/i)
    if (m) candidates.push(m[1])
  }
  return candidates.find(isRenderable) ?? candidates[0] ?? null
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
