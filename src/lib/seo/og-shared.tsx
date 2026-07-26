// Shared foundation for every route's OG image generator: root
// (src/app/opengraph-image.tsx), blog/[slug], building/[slug], and the four
// segment-level generators added for /writing, /building, /prometheus, /contact
// (quick task 260726-kjp). Pure mono per the v4 lock: zero accent hue, no
// gradients, hard corners. Font files are read once here at module scope
// (not duplicated per route file) so every generator's static prerender
// shares the same buffers.
import { readFileSync } from 'node:fs'
import { join } from 'node:path'

export const OG_INK = '#000000'
export const OG_PAPER = '#ffffff'
export const OG_SIZE = { width: 1200, height: 630 }
export const OG_CONTENT_TYPE = 'image/png'

export function truncateOg(text: string, max: number = 140): string {
  if (text.length <= max) return text
  return text.slice(0, max - 3).trimEnd() + '…'
}

const hankenFont = readFileSync(join(process.cwd(), 'src/app/og-fonts/hanken-grotesk-800.woff'))
const monoFont = readFileSync(join(process.cwd(), 'src/app/og-fonts/jetbrains-mono-400.woff'))

export function ogFonts() {
  return [
    { name: 'Hanken Grotesk', data: hankenFont, weight: 800 as const, style: 'normal' as const },
    { name: 'JetBrains Mono', data: monoFont, weight: 400 as const, style: 'normal' as const },
  ]
}

interface OgCardProps {
  kicker: string
  title: string
  description?: string
  footerLeft?: string
  footerRight?: string
}

export function OgCard({ kicker, title, description, footerLeft, footerRight }: OgCardProps) {
  return (
    <div
      style={{
        width: '100%',
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
        alignItems: 'flex-start',
        background: OG_PAPER,
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
          background: OG_INK,
          color: OG_PAPER,
          padding: '10px 20px',
        }}
      >
        {kicker}
      </div>

      {/* Title block */}
      <div
        style={{
          display: 'flex',
          background: OG_PAPER,
          color: OG_INK,
          fontFamily: 'Hanken Grotesk',
          fontWeight: 800,
          fontSize: 68,
          lineHeight: 1.05,
          letterSpacing: -1.5,
          padding: '24px 36px',
          boxShadow: `14px 14px 0 ${OG_INK}`,
          maxWidth: 1000,
        }}
      >
        {title}
      </div>

      {/* Description (when present) */}
      {description && (
        <div
          style={{
            display: 'flex',
            fontFamily: 'JetBrains Mono',
            fontSize: 26,
            color: OG_INK,
            opacity: 0.75,
            maxWidth: 960,
            lineHeight: 1.4,
          }}
        >
          {description}
        </div>
      )}

      {/* Footer row (when either side is present) */}
      {(footerLeft || footerRight) && (
        <div
          style={{
            display: 'flex',
            width: '100%',
            justifyContent: 'space-between',
            fontFamily: 'JetBrains Mono',
            fontSize: 24,
            color: OG_INK,
          }}
        >
          {footerLeft && <span style={{ opacity: 0.75 }}>{footerLeft}</span>}
          {footerRight && <span>{footerRight}</span>}
        </div>
      )}
    </div>
  )
}
