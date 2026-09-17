// Phase 19 SC-5 title-card OG image, rebuilt onto the v5 palette: bone ground,
// ink text, and the fixed Oxblood root accent (no slug to derive one from).
// No gradients (site-wide rule; the old OG gradient exception is void) -
// depth comes from a hard, 0-blur accent block offset behind the title.
// Fonts and mono tokens come from the shared og-shared module (quick task 260726-kjp).
import { ImageResponse } from 'next/og'
import {
  OG_INK,
  OG_PAPER,
  OG_SIZE,
  OG_CONTENT_TYPE,
  OG_ROOT_ACCENT,
  ogFonts,
} from '@/lib/seo/og-shared'

export const alt = 'Monty Singer, founder of Prometheus, builder, and writer'
export const size = OG_SIZE
export const contentType = OG_CONTENT_TYPE

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
          background: OG_PAPER,
          padding: 72,
        }}
      >
        {/* Kicker chip - top-left. Accent field: bone text, never white/ink. */}
        <div
          style={{
            display: 'flex',
            fontFamily: 'JetBrains Mono',
            fontSize: 24,
            letterSpacing: 4,
            textTransform: 'uppercase',
            background: OG_ROOT_ACCENT,
            color: OG_PAPER,
            padding: '10px 20px',
          }}
        >
          MONTYSINGER.COM
        </div>

        {/* Title block - middle. Ink text on bone; depth is a hard accent
            block offset behind it (0-blur box-shadow, sharp corners, no gradient). */}
        <div
          style={{
            display: 'flex',
            background: OG_PAPER,
            color: OG_INK,
            fontFamily: 'Hanken Grotesk',
            fontWeight: 800,
            fontSize: 108,
            lineHeight: 1,
            letterSpacing: -3,
            padding: '28px 44px',
            boxShadow: `16px 16px 0 ${OG_ROOT_ACCENT}`,
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
            color: OG_INK,
            opacity: 0.75,
          }}
        >
          Founder of Prometheus. Builder, writer, and doer.
        </div>
      </div>
    ),
    {
      ...size,
      fonts: ogFonts(),
    },
  )
}
