import Parser from 'rss-parser'

export const SUBSTACK_FEED_URL = 'https://montymonthly.substack.com/feed'

type CustomItem = {
  enclosure?: { url?: string }
  'media:thumbnail'?: { $?: { url?: string } }
  'content:encoded'?: string
  // rss-parser maps the RSS <description> (Substack's issue subtitle) to these.
  contentSnippet?: string
  content?: string
}

export type MontyMonthlyIssue = {
  title: string
  link: string
  pubDate: string
  /** Issue subtitle from the feed <description>, falling back to a body excerpt. */
  description: string
  thumbnail: string | null
  /** Whole-minutes reading time computed from the full body in content:encoded. */
  readingTime: number
}

const NAMED_ENTITIES: Record<string, string> = {
  amp: '&',
  lt: '<',
  gt: '>',
  quot: '"',
  apos: "'",
  nbsp: ' ',
  hellip: '…',
  mdash: '—',
  ndash: '–',
  rsquo: '’',
  lsquo: '‘',
  rdquo: '”',
  ldquo: '“',
}

/**
 * Decode a fixed set of common named HTML entities plus decimal and hex
 * numeric entities. Unrecognized named entities fall back to a single space.
 * Runs on already tag-stripped text, so it cannot reintroduce markup.
 */
export function decodeHtmlEntities(str: string): string {
  return str
    .replace(/&#x([0-9a-f]+);/gi, (_, hex: string) => String.fromCodePoint(parseInt(hex, 16)))
    .replace(/&#(\d+);/g, (_, dec: string) => String.fromCodePoint(parseInt(dec, 10)))
    .replace(/&([a-z]+);/gi, (_, name: string) => NAMED_ENTITIES[name.toLowerCase()] ?? ' ')
}

/**
 * Substack's <description> is the hand-written issue subtitle (a real summary),
 * unlike the body, which opens with the same template boilerplate every month.
 * Fall back to the body excerpt only when the subtitle is missing.
 */
function extractSubtitle(item: CustomItem): string {
  const raw = item.contentSnippet ?? item.content ?? ''
  const text = decodeHtmlEntities(raw.replace(/<[^>]+>/g, ' '))
    .replace(/\s+/g, ' ')
    .trim()
  return text || extractDescription(item)
}

/**
 * Reading time from the issue's full body, not its subtitle. The feed carries
 * the whole post in content:encoded, so this is a real word count rather than
 * an estimate off a one-line summary (which rounded every issue to "1 min").
 */
function extractReadingTime(item: CustomItem): number {
  const html = item['content:encoded']
  if (!html) return 1
  const text = decodeHtmlEntities(html.replace(/<[^>]+>/g, ' '))
    .replace(/\s+/g, ' ')
    .trim()
  const words = text.split(/\s+/).filter(Boolean).length
  return Math.max(1, Math.ceil(words / 200))
}

/** Strip HTML from the issue body and return a short plain-text excerpt. */
function extractDescription(item: CustomItem): string {
  const html = item['content:encoded']
  if (!html) return ''
  const text = decodeHtmlEntities(html.replace(/<[^>]+>/g, ' '))
    .replace(/\s+/g, ' ')
    .trim()
  if (text.length <= 200) return text
  return text.slice(0, 200).replace(/\s+\S*$/, '') + '…'
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
      description: extractSubtitle(item as unknown as CustomItem),
      thumbnail: extractThumbnail(item as unknown as CustomItem),
      readingTime: extractReadingTime(item as unknown as CustomItem),
    }))
  } catch {
    return []
  }
}
