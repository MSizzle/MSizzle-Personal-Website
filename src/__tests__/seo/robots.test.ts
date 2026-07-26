import { describe, it, expect } from 'vitest'
import robots from '@/app/robots'

describe('robots()', () => {
  it('allows / globally, disallows /api/, and no longer disallows the deleted /specimen route', () => {
    const result = robots()
    expect(result.rules.allow).toBe('/')
    expect(result.rules.disallow).not.toContain('/specimen')
    expect(result.rules.disallow).toContain('/api/')
  })

  it('returns sitemap URL containing /sitemap.xml', () => {
    const result = robots()
    expect(result.sitemap).toContain('/sitemap.xml')
  })
})
