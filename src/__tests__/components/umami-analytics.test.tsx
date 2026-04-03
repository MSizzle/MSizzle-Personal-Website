import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { render } from '@testing-library/react'

describe('UmamiAnalytics', () => {
  const originalEnv = process.env

  beforeEach(() => {
    vi.resetModules()
    process.env = { ...originalEnv }
  })

  afterEach(() => {
    process.env = originalEnv
  })

  it('renders script when both env vars are set', async () => {
    process.env.NEXT_PUBLIC_UMAMI_WEBSITE_ID = 'test-website-id'
    process.env.NEXT_PUBLIC_UMAMI_URL = 'https://analytics.example.com'

    // Mock next/script as a span to avoid jsdom script-tag stripping
    vi.doMock('next/script', () => ({
      default: ({ src, 'data-website-id': websiteId, ...rest }: any) => (
        <span data-testid="umami-script" data-src={src} data-website-id={websiteId} />
      ),
    }))

    const { UmamiAnalytics } = await import('@/components/analytics/umami-analytics')
    const { container } = render(<UmamiAnalytics />)
    const el = container.querySelector('[data-testid="umami-script"]')
    expect(el).not.toBeNull()
    expect(el?.getAttribute('data-src')).toBe('https://analytics.example.com/script.js')
    expect(el?.getAttribute('data-website-id')).toBe('test-website-id')
  })

  it('renders null when NEXT_PUBLIC_UMAMI_WEBSITE_ID is unset', async () => {
    delete process.env.NEXT_PUBLIC_UMAMI_WEBSITE_ID
    process.env.NEXT_PUBLIC_UMAMI_URL = 'https://analytics.example.com'

    vi.doMock('next/script', () => ({
      default: ({ src, 'data-website-id': websiteId }: any) => (
        <span data-testid="umami-script" data-src={src} data-website-id={websiteId} />
      ),
    }))

    const { UmamiAnalytics } = await import('@/components/analytics/umami-analytics')
    const { container } = render(<UmamiAnalytics />)
    expect(container.querySelector('[data-testid="umami-script"]')).toBeNull()
  })

  it('renders null when NEXT_PUBLIC_UMAMI_URL is unset', async () => {
    process.env.NEXT_PUBLIC_UMAMI_WEBSITE_ID = 'test-website-id'
    delete process.env.NEXT_PUBLIC_UMAMI_URL

    vi.doMock('next/script', () => ({
      default: ({ src, 'data-website-id': websiteId }: any) => (
        <span data-testid="umami-script" data-src={src} data-website-id={websiteId} />
      ),
    }))

    const { UmamiAnalytics } = await import('@/components/analytics/umami-analytics')
    const { container } = render(<UmamiAnalytics />)
    expect(container.querySelector('[data-testid="umami-script"]')).toBeNull()
  })
})
