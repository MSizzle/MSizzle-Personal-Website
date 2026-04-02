import { ImageResponse } from 'next/og'

export const runtime = 'edge'
export const size = { width: 1200, height: 630 }
export const contentType = 'image/png'

export default function Image() {
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
        <p style={{ color: '#888', fontSize: 24, margin: '0 0 16px' }}>msizzle.com</p>
        <h1 style={{ color: '#fafafa', fontSize: 56, fontWeight: 600, margin: 0, lineHeight: 1.1 }}>
          Monty Singer
        </h1>
        <p style={{ color: '#a3a3a3', fontSize: 24, margin: '16px 0 0' }}>
          Investor, builder, and lifelong learner based in NYC.
        </p>
      </div>
    ),
    { ...size }
  )
}
