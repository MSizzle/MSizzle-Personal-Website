// Phase 19 SC-5 title-card OG image.
// No gradients (site-wide rule; the old OG gradient exception is void).
// Fonts read via fs at module scope so the route statically prerenders at build time.
import { ImageResponse } from 'next/og'
import { readFileSync } from 'node:fs'
import { join } from 'node:path'

export const alt = 'Monty Singer, founder of Prometheus, builder, and writer'
export const size = { width: 1200, height: 630 }
export const contentType = 'image/png'

const hankenFont = readFileSync(join(process.cwd(), 'src/app/og-fonts/hanken-grotesk-800.woff'))
const monoFont = readFileSync(join(process.cwd(), 'src/app/og-fonts/jetbrains-mono-400.woff'))

export default function Image() {
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
          padding: 72,
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
          MONTYSINGER.COM
        </div>

        {/* Title block - middle */}
        <div
          style={{
            display: 'flex',
            background: '#ffffff',
            color: '#171717',
            fontFamily: 'Hanken Grotesk',
            fontWeight: 800,
            fontSize: 108,
            lineHeight: 1,
            letterSpacing: -3,
            padding: '28px 44px',
            boxShadow: '16px 16px 0 #171717',
          }}
        >
          Monty Singer
        </div>

        {/* Bottom tagline */}
        <div
          style={{
            display: 'flex',
            fontFamily: 'JetBrains Mono',
            fontSize: 26,
            color: '#171717',
            opacity: 0.75,
          }}
        >
          Founder of Prometheus. Builder, writer, and perpetual tinkerer.
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
