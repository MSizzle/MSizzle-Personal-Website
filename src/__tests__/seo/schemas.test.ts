import { describe, it, expect } from 'vitest'
import {
  buildPersonSchema,
  buildFaqPageSchema,
  buildBreadcrumbListSchema,
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
      'https://x.com/thefullmonty0',
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
    expect(crumbs.itemListElement[0].item).toBe('https://montysinger.com/')
    expect(crumbs.itemListElement[2].position).toBe(3)
    expect(crumbs.itemListElement[2].item).toBeUndefined()
  })
})
