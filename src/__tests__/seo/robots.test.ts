import { describe, it, expect } from 'vitest'
import robots from '@/app/robots'

describe('robots()', () => {
  it('allows / globally and disallows /specimen and /api/', () => {
    const result = robots()
    expect(result.rules.allow).toBe('/')
    expect(result.rules.disallow).toContain('/specimen')
    expect(result.rules.disallow).toContain('/api/')
  })

  it('returns sitemap URL containing /sitemap.xml', () => {
    const result = robots()
    expect(result.sitemap).toContain('/sitemap.xml')
  })
})
