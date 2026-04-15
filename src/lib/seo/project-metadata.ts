import type { Metadata } from 'next'
import type { Project } from '@/lib/notion-projects'
import { canonical } from './site'

function truncate(text: string, maxChars: number = 155): string {
  if (!text) return ''
  if (text.length <= maxChars) return text
  return text.slice(0, maxChars).replace(/\s+\S*$/, '').trim() + '…'
}

export function buildProjectMetadata(project: Project): Metadata {
  const title = `${project.title} | Monty Singer`
  const description = truncate(
    project.description || `${project.title}, a project by Monty Singer.`,
    155
  )
  const url = canonical(`/projects/${project.slug}`)

  return {
    title,
    description,
    alternates: { canonical: `/projects/${project.slug}` },
    openGraph: {
      title,
      description,
      url,
      type: 'website',
      ...(project.image ? { images: [{ url: project.image }] } : {}),
    },
    twitter: { card: 'summary_large_image', title, description },
  }
}
