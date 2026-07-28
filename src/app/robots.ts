import type { MetadataRoute } from 'next'
import { SITE_URL } from '@/lib/seo/site'

export default function robots(): MetadataRoute.Robots {
  return {
    // `/api/` stays blocked wholesale, but /api/notion-cover and
    // /api/notion-image are the `src` of the cover art on the homepage and
    // every blog post -- a blanket disallow made those images uncrawlable and
    // showed up in Search Console as "Blocked by robots.txt" (quick task
    // 260728-fri). Google resolves competing rules by longest match, so the
    // specific Allow beats the broader Disallow. If you ever tighten this
    // block, keep these two carve-outs or image indexing breaks again.
    rules: {
      userAgent: '*',
      allow: ['/', '/api/notion-cover', '/api/notion-image'],
      disallow: ['/api/'],
    },
    sitemap: `${SITE_URL}/sitemap.xml`,
  }
}
