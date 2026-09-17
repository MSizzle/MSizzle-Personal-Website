import { describe, it, expect } from 'vitest'
import { readFileSync } from 'node:fs'
import { join } from 'node:path'

describe('OG Image Generation', () => {
  it('og-shared exports the v5 bone/ink tokens', async () => {
    const module = await import('@/lib/seo/og-shared')
    expect(module.OG_INK).toBe('#111111')
    expect(module.OG_PAPER).toBe('#F5F2EB')
  })

  it('og-shared accent palette matches globals.css --ac-0..--ac-9 and the root accent is Oxblood', async () => {
    const ogShared = await import('@/lib/seo/og-shared')
    expect(ogShared.OG_ACCENTS).toEqual([
      '#6B1F2B',
      '#185661',
      '#8E6214',
      '#2A3A6B',
      '#1E4D3C',
      '#4A2547',
      '#14524F',
      '#7A5230',
      '#17395B',
      '#55632F',
    ])
    expect(ogShared.OG_ROOT_ACCENT).toBe('#6B1F2B')
  })

  it('accentForSlug is deterministic and always returns a palette colour', async () => {
    const ogShared = await import('@/lib/seo/og-shared')
    const slugs = ['my-first-post', 'exoskel', 'a', '']
    for (const slug of slugs) {
      const first = ogShared.accentForSlug(slug)
      const second = ogShared.accentForSlug(slug)
      expect(first).toBe(second)
      expect(ogShared.OG_ACCENTS).toContain(first)
    }
  })

  it('none of the OG route generators contain the retired vermilion hex', () => {
    const files = [
      'src/app/opengraph-image.tsx',
      'src/app/blog/[slug]/opengraph-image.tsx',
      'src/app/building/[slug]/opengraph-image.tsx',
      'src/app/writing/opengraph-image.tsx',
      'src/app/building/opengraph-image.tsx',
      'src/app/contact/opengraph-image.tsx',
    ]
    for (const f of files) {
      const src = readFileSync(join(process.cwd(), f), 'utf-8')
      expect(src.toLowerCase()).not.toContain('#e5411f')
    }
  })

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

  it('writing OG module exports correct shape and non-empty alt', async () => {
    const module = await import('@/app/writing/opengraph-image')
    expect(module.size).toEqual({ width: 1200, height: 630 })
    expect(module.contentType).toBe('image/png')
    expect(typeof module.alt).toBe('string')
    expect(module.alt.length).toBeGreaterThan(0)
    expect(module.alt).not.toMatch(/—|–|--/)
    expect(typeof module.default).toBe('function')
  })

  it('building index OG module exports correct shape and non-empty alt', async () => {
    const module = await import('@/app/building/opengraph-image')
    expect(module.size).toEqual({ width: 1200, height: 630 })
    expect(module.contentType).toBe('image/png')
    expect(typeof module.alt).toBe('string')
    expect(module.alt.length).toBeGreaterThan(0)
    expect(module.alt).not.toMatch(/—|–|--/)
    expect(typeof module.default).toBe('function')
  })

  it('contact OG module exports correct shape and non-empty alt', async () => {
    const module = await import('@/app/contact/opengraph-image')
    expect(module.size).toEqual({ width: 1200, height: 630 })
    expect(module.contentType).toBe('image/png')
    expect(typeof module.alt).toBe('string')
    expect(module.alt.length).toBeGreaterThan(0)
    expect(module.alt).not.toMatch(/—|–|--/)
    expect(typeof module.default).toBe('function')
  })
})
