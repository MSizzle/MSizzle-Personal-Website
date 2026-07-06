// Phase 19 SC-5 title-card OG image for projects.
// Node runtime for fs font loading; no gradients (site-wide rule).
import { ImageResponse } from 'next/og'
import { readFileSync } from 'node:fs'
import { join } from 'node:path'
import { getProjectBySlug } from '@/lib/notion-projects'

export const alt = 'Project by Monty Singer'
export const size = { width: 1200, height: 630 }
export const contentType = 'image/png'

const hankenFont = readFileSync(join(process.cwd(), 'src/app/og-fonts/hanken-grotesk-800.woff'))
const monoFont = readFileSync(join(process.cwd(), 'src/app/og-fonts/jetbrains-mono-400.woff'))

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

  const displayTitle = title.length > 90 ? title.slice(0, 87).trimEnd() + '…' : title
  const displayDescription =
    description.length > 140 ? description.slice(0, 137).trimEnd() + '…' : description

  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
          alignItems: 'flex-start',
          background: '#faf9f7',
          padding: 64,
        }}
      >
        {/* Kicker chip - top-left */}
        <div
          style={{
            display: 'flex',
            fontFamily: 'JetBrains Mono',
            fontSize: 24,
            letterSpacing: 4,
            textTransform: 'uppercase',
            background: '#e5411f',
            color: '#ffffff',
            padding: '10px 20px',
          }}
        >
          PROJECT
        </div>

        {/* Title block */}
        <div
          style={{
            display: 'flex',
            background: '#ffffff',
            color: '#171717',
            fontFamily: 'Hanken Grotesk',
            fontWeight: 800,
            fontSize: 68,
            lineHeight: 1.05,
            letterSpacing: -1.5,
            padding: '24px 36px',
            boxShadow: '14px 14px 0 #171717',
            maxWidth: 1000,
          }}
        >
          {displayTitle}
        </div>

        {/* Description (when present) */}
        {displayDescription && (
          <div
            style={{
              display: 'flex',
              fontFamily: 'JetBrains Mono',
              fontSize: 26,
              color: '#171717',
              opacity: 0.75,
              maxWidth: 960,
              lineHeight: 1.4,
            }}
          >
            {displayDescription}
          </div>
        )}

        {/* Footer - site mark */}
        <div
          style={{
            display: 'flex',
            fontFamily: 'JetBrains Mono',
            fontSize: 24,
            color: '#171717',
            opacity: 0.75,
          }}
        >
          montysinger.com
        </div>
      </div>
    ),
    {
      ...size,
      fonts: [
        { name: 'Hanken Grotesk', data: hankenFont, weight: 800, style: 'normal' },
        { name: 'JetBrains Mono', data: monoFont, weight: 400, style: 'normal' },
      ],
    },
  )
}
