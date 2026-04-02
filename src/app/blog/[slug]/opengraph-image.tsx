import { ImageResponse } from 'next/og'
import { getPostBySlug } from '@/lib/notion'

export const runtime = 'edge'
export const size = { width: 1200, height: 630 }
export const contentType = 'image/png'

interface Props {
  params: Promise<{ slug: string }>
}

export default async function Image({ params }: Props) {
  const { slug } = await params
  let title = 'Writing'
  let date = ''

  try {
    const post = await getPostBySlug(slug)
    if (post) {
      title = post.title
      date = post.date
        ? new Date(post.date).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
          })
        : ''
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
        {date && (
          <p style={{ color: '#a3a3a3', fontSize: 24, margin: '16px 0 0' }}>
            {date}
          </p>
        )}
      </div>
    ),
    { ...size }
  )
}
