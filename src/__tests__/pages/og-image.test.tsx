import { describe, it, expect } from 'vitest'

describe('OG Image Generation', () => {
  it('root OG module exports correct size, contentType, and alt without em dash', async () => {
    const module = await import('@/app/opengraph-image')
    expect(module.size).toEqual({ width: 1200, height: 630 })
    expect(module.contentType).toBe('image/png')
    expect(typeof module.alt).toBe('string')
    expect(module.alt.length).toBeGreaterThan(0)
    // No em dash (U+2014) or en dash (U+2013) in alt text
    expect(module.alt).not.toMatch(/—|–|--/)
  })

  it('blog slug OG module exports correct shape, has no runtime export, and has non-empty alt', async () => {
    const module = await import('@/app/blog/[slug]/opengraph-image')
    expect(module.size).toEqual({ width: 1200, height: 630 })
    expect(module.contentType).toBe('image/png')
    expect(typeof module.alt).toBe('string')
    expect(module.alt.length).toBeGreaterThan(0)
    expect(module.alt).not.toMatch(/—|–|--/)
    // Node runtime: no runtime export
    expect('runtime' in module).toBe(false)
    // Default export is an async function
    expect(typeof module.default).toBe('function')
  })

  it('project slug OG module exports correct shape, has no runtime export, and has non-empty alt', async () => {
    const module = await import('@/app/building/[slug]/opengraph-image')
    expect(module.size).toEqual({ width: 1200, height: 630 })
    expect(module.contentType).toBe('image/png')
    expect(typeof module.alt).toBe('string')
    expect(module.alt.length).toBeGreaterThan(0)
    expect(module.alt).not.toMatch(/—|–|--/)
    // Node runtime: no runtime export
    expect('runtime' in module).toBe(false)
    // Default export is an async function
    expect(typeof module.default).toBe('function')
  })
})
