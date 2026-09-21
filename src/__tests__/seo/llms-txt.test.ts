import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { IDENTITY_SENTENCE } from '@/lib/seo/site'

vi.mock('@/lib/notion', () => ({
  getPublishedPosts: vi.fn(async () => [
    {
      id: 'p1',
      slug: 'vibe-check',
      title: 'Vibe Check',
      description: 'An essay about paying attention.',
      published: true,
      date: '2026-07-09',
      tags: [],
      cover: null,
      emoji: null,
      lastEdited: '2026-07-20',
    },
  ]),
}))

vi.mock('@/lib/notion-projects', () => ({
  getPublishedProjects: vi.fn(async () => [
    {
      id: 'j1',
      slug: 'gene-own',
      title: 'Gene Own',
      // Notion copy sometimes carries an em dash; the route strips it.
      description: 'A project — with a dash.',
      cover: null,
      image: null,
      emoji: null,
      externalUrl: '',
      tags: [],
      featured: false,
      published: true,
      lastEdited: '2026-05-01',
    },
  ]),
}))

beforeEach(() => {
  vi.stubEnv('NOTION_TOKEN', 'test-token')
  vi.stubEnv('NOTION_DATABASE_ID', 'test-db')
  vi.stubEnv('NOTION_PROJECTS_DATABASE_ID', 'test-projects-db')
})

afterEach(() => {
  vi.unstubAllEnvs()
})

describe('GET /llms.txt', () => {
  it('serves markdown with the llmstxt.org header shape', async () => {
    const { GET } = await import('@/app/llms.txt/route')
    const res = await GET()
    expect(res.status).toBe(200)
    expect(res.headers.get('content-type')).toContain('text/markdown')

    const body = await res.text()
    expect(body.startsWith('# Monty Singer')).toBe(true)
    expect(body).toContain(`> ${IDENTITY_SENTENCE}`)
  })

  it('links the key pages, the published essays and the projects', async () => {
    const { GET } = await import('@/app/llms.txt/route')
    const body = await (await GET()).text()
    expect(body).toContain('https://montysinger.com/about')
    expect(body).toContain('https://montysinger.com/blog/feed.xml')
    expect(body).toContain('https://montysinger.com/blog/vibe-check')
    expect(body).toContain('https://montysinger.com/building/gene-own')
    expect(body).toContain('https://prometheus.today')
  })

  it('carries no em dash, including in Notion-sourced copy (CLAUDE.md rule)', async () => {
    const { GET } = await import('@/app/llms.txt/route')
    const body = await (await GET()).text()
    expect(body).not.toMatch(/[—–]/)
  })
})
