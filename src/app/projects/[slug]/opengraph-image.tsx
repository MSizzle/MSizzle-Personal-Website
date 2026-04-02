import { ImageResponse } from 'next/og'
import { getProjectBySlug } from '@/lib/notion-projects'

export const runtime = 'edge'
export const size = { width: 1200, height: 630 }
export const contentType = 'image/png'

interface Props {
  params: Promise<{ slug: string }>
}

export default async function Image({ params }: Props) {
  const { slug } = await params
  let title = 'Project'
  let description = ''

  try {
    const project = await getProjectBySlug(slug)
    if (project) {
      title = project.title
      description = project.description
    }
  } catch {
    // Fallback to generic title
  }

  return new ImageResponse(
    (
      <div
        style={{
          background: 'linear-gradient(135deg, #0a0a0a 0%, #1a1a2e 100%)',
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'flex-start',
          justifyContent: 'flex-end',
          padding: '60px',
        }}
      >
        <p style={{ color: '#888', fontSize: 24, margin: '0 0 16px' }}>Monty Singer</p>
        <h1 style={{ color: '#fafafa', fontSize: 56, fontWeight: 600, margin: 0, lineHeight: 1.1 }}>
          {title}
        </h1>
        {description && (
          <p style={{ color: '#a3a3a3', fontSize: 24, margin: '16px 0 0', lineHeight: 1.3 }}>
            {description}
          </p>
        )}
      </div>
    ),
    { ...size }
  )
}
