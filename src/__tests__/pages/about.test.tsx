/**
 * /about -- the plain biographical page restored in 260921-ed0 (the route used
 * to 301 to the homepage). It is the page Google and language models are meant
 * to quote, so these tests guard the facts and the copy rules, not the layout.
 */
import { describe, it, expect, beforeEach, vi } from 'vitest'
import { render, screen, cleanup } from '@testing-library/react'
import { IDENTITY_SENTENCE } from '@/lib/seo/site'

beforeEach(() => {
  cleanup()
})

vi.mock('next/link', () => ({
  default: ({
    children,
    href,
    ...props
  }: {
    children: React.ReactNode
    href: string
    [key: string]: unknown
  }) => (
    <a href={href} {...props}>
      {children}
    </a>
  ),
}))

import AboutPage from '@/app/about/page'

describe('About Page', () => {
  it('renders the labelled prose sections', () => {
    render(<AboutPage />)
    for (const label of [
      'Who I am',
      'Prometheus',
      'Education',
      'Writing',
      'Interests',
      'Contact',
      'Questions people ask',
    ]) {
      expect(screen.getByText(label)).toBeDefined()
    }
  })

  it('states the identity sentence and the allowed facts', () => {
    const { container } = render(<AboutPage />)
    const text = container.textContent ?? ''
    expect(text).toContain(IDENTITY_SENTENCE)
    expect(text).toContain('Georgetown University')
    expect(document.querySelector('a[href="https://prometheus.today"]')).not.toBeNull()
    expect(document.querySelector('a[href="/writing"]')).not.toBeNull()
    expect(document.querySelector('a[href="/contact"]')).not.toBeNull()
    expect(document.querySelector('a[href="/advice"]')).not.toBeNull()
    expect(
      document.querySelector('a[href="mailto:monty@prometheus.today"]')
    ).not.toBeNull()
  })

  it('emits FAQPage and BreadcrumbList JSON-LD', () => {
    const { container } = render(<AboutPage />)
    const blobs = [...container.querySelectorAll('script[type="application/ld+json"]')].map(
      (el) => JSON.parse(el.textContent ?? '{}')
    )
    const types = blobs.map((b) => b['@type'])
    expect(types).toContain('FAQPage')
    expect(types).toContain('BreadcrumbList')

    const faq = blobs.find((b) => b['@type'] === 'FAQPage')
    expect(faq.mainEntity).toHaveLength(4)
    // Every schema answer is also visible on the page.
    for (const entry of faq.mainEntity) {
      expect(container.textContent).toContain(entry.acceptedAnswer.text)
    }
  })

  it('breaks no copy rule: no em dash, no location, no other school', () => {
    const { container } = render(<AboutPage />)
    const text = container.textContent ?? ''
    expect(text).not.toMatch(/[—–]/)
    expect(text).not.toMatch(/Choate|Network School|New York|Vermont|Malaysia/i)
  })
})
