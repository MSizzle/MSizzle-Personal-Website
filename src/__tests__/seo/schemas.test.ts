import { describe, it, expect } from 'vitest'
import {
  buildPersonSchema,
  buildFaqPageSchema,
  buildBreadcrumbListSchema,
  buildWebSiteSchema,
  buildBlogPostingSchema,
} from '@/lib/seo/schemas'

describe('buildPersonSchema', () => {
  it('returns exact D-13 payload', () => {
    const schema = buildPersonSchema()
    expect(schema['@context']).toBe('https://schema.org')
    expect(schema['@type']).toBe('Person')
    expect(schema.name).toBe('Monty Singer')
    expect(schema.url).toBe('https://montysinger.com')
    expect(schema.jobTitle).toBe('Founder')
    expect(schema.worksFor).toEqual({
      '@type': 'Organization',
      name: 'Prometheus',
      url: 'https://prometheus.today',
    })
    expect(schema.sameAs).toEqual([
      'https://linkedin.com/in/monty-singer',
      'https://github.com/MSizzle',
      'https://x.com/themontysinger',
    ])
    expect(schema.alumniOf).toEqual({
      '@type': 'CollegeOrUniversity',
      name: 'Georgetown University',
    })
  })
})

describe('buildFaqPageSchema', () => {
  it('wraps Q/A pairs in FAQPage + Question/Answer nodes', () => {
    const faq = buildFaqPageSchema([
      { question: 'Q1?', answer: 'A1.' },
      { question: 'Q2?', answer: 'A2.' },
    ])
    expect(faq['@type']).toBe('FAQPage')
    expect(faq.mainEntity).toHaveLength(2)
    expect(faq.mainEntity[0]).toEqual({
      '@type': 'Question',
      name: 'Q1?',
      acceptedAnswer: { '@type': 'Answer', text: 'A1.' },
    })
  })
})

describe('buildBreadcrumbListSchema', () => {
  it('numbers items starting at position 1 and omits item URL on final', () => {
    const crumbs = buildBreadcrumbListSchema([
      { name: 'Home', href: '/' },
      { name: 'Writings', href: '/blog' },
      { name: 'Choosing Faith' },
    ])
    expect(crumbs['@type']).toBe('BreadcrumbList')
    expect(crumbs.itemListElement).toHaveLength(3)
    expect(crumbs.itemListElement[0].position).toBe(1)
    // Bare, no trailing slash -- matches the homepage canonical tag and the
    // sitemap <loc>, which previously disagreed with this one (260728-kcg).
    expect(crumbs.itemListElement[0].item).toBe('https://montysinger.com')
    expect(crumbs.itemListElement[2].position).toBe(3)
    expect(crumbs.itemListElement[2].item).toBeUndefined()
  })
})

describe('buildWebSiteSchema', () => {
  it('names the site and ties it to the Person publisher', () => {
    const site = buildWebSiteSchema()
    expect(site['@type']).toBe('WebSite')
    expect(site.url).toBe('https://montysinger.com')
    expect(site.publisher['@type']).toBe('Person')
    expect(site.publisher.name).toBe('Monty Singer')
  })
})

describe('buildBlogPostingSchema', () => {
  const base = {
    title: 'Vibe Check',
    slug: 'vibe-check',
    description: 'An opening line.',
    date: '2026-07-09T09:31:00.000Z',
    lastEdited: '2026-07-20T10:00:00.000Z',
  }

  it('carries the fields that make a post rich-result eligible', () => {
    const node = buildBlogPostingSchema({ ...base, coverPageId: 'abc', wordCount: 718 })
    expect(node['@type']).toBe('BlogPosting')
    expect(node.headline).toBe('Vibe Check')
    expect(node.url).toBe('https://montysinger.com/blog/vibe-check')
    expect(node.datePublished).toBe(base.date)
    expect(node.dateModified).toBe(base.lastEdited)
    expect(node.wordCount).toBe(718)
    expect(node.image).toContain('/api/notion-cover?pageId=abc')
    expect((node.author as Record<string, unknown>).name).toBe('Monty Singer')
  })

  it('emits ISO-parseable dates', () => {
    const node = buildBlogPostingSchema(base)
    expect(Number.isNaN(Date.parse(node.datePublished as string))).toBe(false)
    expect(Number.isNaN(Date.parse(node.dateModified as string))).toBe(false)
  })

  it('omits image and wordCount when the post has no cover or body', () => {
    const node = buildBlogPostingSchema({ ...base, coverPageId: null, wordCount: 0 })
    expect(node.image).toBeUndefined()
    expect(node.wordCount).toBeUndefined()
  })

  // Schema.org treats a dateModified earlier than datePublished as invalid, and
  // Notion's last_edited_time is occasionally unset on imported pages.
  it('falls back to datePublished when lastEdited is missing', () => {
    const node = buildBlogPostingSchema({ ...base, lastEdited: undefined })
    expect(node.dateModified).toBe(base.date)
  })

  it('omits both dates entirely when the post has neither', () => {
    const node = buildBlogPostingSchema({ ...base, date: undefined, lastEdited: undefined })
    expect(node.datePublished).toBeUndefined()
    expect(node.dateModified).toBeUndefined()
  })
})
