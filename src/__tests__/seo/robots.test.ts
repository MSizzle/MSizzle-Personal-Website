import { describe, it, expect } from 'vitest'
import robots from '@/app/robots'

describe('robots()', () => {
  it('allows / globally, disallows /api/, and no longer disallows the deleted /specimen route', () => {
    const result = robots()
    expect(result.rules.allow).toContain('/')
    expect(result.rules.disallow).not.toContain('/specimen')
    expect(result.rules.disallow).toContain('/api/')
  })

  // The Notion image proxies are the `src` of every cover image on the site.
  // A blanket Disallow: /api/ made them uncrawlable and Search Console flagged
  // it as "Blocked by robots.txt" (quick task 260728-fri).
  it('carves the Notion image proxy routes out of the /api/ block', () => {
    const result = robots()
    expect(result.rules.allow).toContain('/api/notion-cover')
    expect(result.rules.allow).toContain('/api/notion-image')
    expect(result.rules.disallow).toContain('/api/')
  })

  it('returns sitemap URL containing /sitemap.xml', () => {
    const result = robots()
    expect(result.sitemap).toContain('/sitemap.xml')
  })
})
