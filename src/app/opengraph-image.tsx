import { ImageResponse } from 'next/og'
import { readFileSync } from 'node:fs'
import { join } from 'node:path'

export const alt = 'Monty Singer — investor, builder, and lifelong learner based in NYC'
export const size = { width: 1200, height: 630 }
export const contentType = 'image/png'

// Read the co-located background photo at module load. Using fs (instead of
// `fetch(new URL(..., import.meta.url))`) lets this route statically prerender
// at build time on Vercel, producing a plain cached PNG asset with no function
// invocation per request.
const photoBuffer = readFileSync(join(process.cwd(), 'src/app/og-photo.jpg'))
const photoSrc = `data:image/jpeg;base64,${photoBuffer.toString('base64')}`

export default function Image() {

  return new ImageResponse(
    (
      <div
        style={{
          position: 'relative',
          width: '100%',
          height: '100%',
          display: 'flex',
          background: '#0a0a0a',
        }}
      >
        {/* Full-bleed background photo */}
        <img
          src={photoSrc}
          alt=""
          width={1200}
          height={630}
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
            objectFit: 'cover',
          }}
        />

        {/* Dark gradient for text legibility — stronger at bottom */}
        <div
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
            display: 'flex',
            background:
              'linear-gradient(180deg, rgba(10,10,10,0) 35%, rgba(10,10,10,0.55) 70%, rgba(10,10,10,0.9) 100%)',
          }}
        />

        {/* Text block, bottom-left */}
        <div
          style={{
            position: 'absolute',
            left: 64,
            right: 64,
            bottom: 56,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'flex-start',
          }}
        >
          <p
            style={{
              color: 'rgba(250,250,250,0.7)',
              fontSize: 24,
              letterSpacing: 2,
              textTransform: 'uppercase',
              margin: 0,
            }}
          >
            montysinger.com
          </p>
          <h1
            style={{
              color: '#fafafa',
              fontSize: 96,
              fontWeight: 700,
              letterSpacing: -2,
              lineHeight: 1,
              margin: '18px 0 0',
            }}
          >
            Monty Singer
          </h1>
          <p
            style={{
              color: 'rgba(250,250,250,0.85)',
              fontSize: 30,
              lineHeight: 1.3,
              margin: '20px 0 0',
              maxWidth: 900,
            }}
          >
            Investor, builder, and lifelong learner based in NYC.
          </p>
        </div>
      </div>
    ),
    { ...size },
  )
}
