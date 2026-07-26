import { describe, it, expect } from 'vitest'
import { buildProjectMetadata } from '@/lib/seo/project-metadata'
import type { Project } from '@/lib/notion-projects'

const fakeProject: Project = {
  id: 'x',
  slug: 'a-project',
  title: 'A Project',
  description: 'A short description of the project.',
  cover: null,
  image:
    'https://prod-files-secure.s3.us-east-1.amazonaws.com/abc/def.png?X-Amz-Expires=3600&X-Amz-Signature=xyz',
  emoji: '🛠️',
  externalUrl: '',
  tags: [],
  featured: false,
  published: true,
  lastEdited: '2026-01-15',
}

describe('buildProjectMetadata', () => {
  it('never sets openGraph.images, even when project.image is a presigned amazonaws.com URL', () => {
    const meta = buildProjectMetadata(fakeProject)
    expect(meta.openGraph).not.toHaveProperty('images')
    expect(JSON.stringify(meta)).not.toMatch(/amazonaws\.com/)
  })

  it('still returns the correct title, canonical alternate, and openGraph.type', () => {
    const meta = buildProjectMetadata(fakeProject)
    expect(meta.title).toBe('A Project')
    expect(meta.alternates?.canonical).toBe('/building/a-project')
    expect((meta.openGraph as { type?: string })?.type).toBe('website')
  })
})
