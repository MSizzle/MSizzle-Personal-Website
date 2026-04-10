import { ImageResponse } from 'next/og'

export const runtime = 'edge'
export const alt = 'Monty Singer — investor, builder, and lifelong learner based in NYC'
export const size = { width: 1200, height: 630 }
export const contentType = 'image/png'

export default async function Image() {
  const photoData = await fetch(new URL('./og-photo.jpg', import.meta.url)).then((res) =>
    res.arrayBuffer(),
  )
  const photoSrc = `data:image/jpeg;base64,${Buffer.from(photoData).toString('base64')}`

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
