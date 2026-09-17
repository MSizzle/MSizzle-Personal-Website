// Shared foundation for every route's OG image generator: root
// (src/app/opengraph-image.tsx), blog/[slug], building/[slug], and the four
// segment-level generators added for /writing, /building, /prometheus, /contact
// (quick task 260726-kjp). Rebuilt onto the v5 warm palette: bone ground, near
// -black ink, and a ten-entry accent used on root/blog/building item routes.
// Still zero gradients and hard corners (site-wide rule; OG images were the
// lone deferred exception and lose it here too). Font files are read once
// here at module scope (not duplicated per route file) so every generator's
// static prerender shares the same buffers.
import { readFileSync } from 'node:fs'
import { join } from 'node:path'

// Ink and ground match globals.css v5 tokens (--color-text / --color-bg).
// next/og cannot read CSS custom properties at Edge/Node render time, so the
// hex values are duplicated here as the OG-side source of truth.
export const OG_INK = '#111111'
export const OG_PAPER = '#F5F2EB'
export const OG_SIZE = { width: 1200, height: 630 }
export const OG_CONTENT_TYPE = 'image/png'

// Ten-entry v5 accent palette, in the same order as globals.css --ac-0..--ac-9.
// All ten clear 4.5:1 against bone, which is why text on an accent field below
// always uses OG_PAPER (bone), never white and never OG_INK.
export const OG_ACCENTS = [
  '#6B1F2B', // 0 Oxblood
  '#185661', // 1 Slate teal
  '#8E6214', // 2 Ochre
  '#2A3A6B', // 3 Indigo ink
  '#1E4D3C', // 4 Forest ink
  '#4A2547', // 5 Plum
  '#14524F', // 6 Deep teal
  '#7A5230', // 7 Bronze
  '#17395B', // 8 Prussian
  '#55632F', // 9 Olive
] as const

// Root route has no slug to derive a colour from, so it gets one fixed accent.
export const OG_ROOT_ACCENT: string = OG_ACCENTS[0]

// Deterministic slug -> accent (djb2 hash, mod 10) so a given post or project
// always previews in the same colour across renders, deploys, and revalidations.
export function accentForSlug(slug: string): string {
  let hash = 5381
  for (let i = 0; i < slug.length; i++) {
    hash = ((hash * 33) ^ slug.charCodeAt(i)) >>> 0
  }
  return OG_ACCENTS[hash % OG_ACCENTS.length]
}

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
  /** One of OG_ACCENTS, or OG_ROOT_ACCENT / accentForSlug(slug) for callers
   *  that want the v5 accent treatment. Defaults to OG_INK so routes that
   *  don't pass one (writing/building/contact index cards) keep the plain
   *  ink chip they already had. Never applied behind title text itself, so
   *  ink-on-bone stays the large-text pairing and accent never carries ink
   *  text directly (the kicker chip below uses bone text on the accent field). */
  accent?: string
}

export function OgCard({
  kicker,
  title,
  description,
  footerLeft,
  footerRight,
  accent = OG_INK,
}: OgCardProps) {
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
      {/* Kicker chip - top-left. Accent field: text is bone, never white/ink. */}
      <div
        style={{
          display: 'flex',
          fontFamily: 'JetBrains Mono',
          fontSize: 24,
          letterSpacing: 4,
          textTransform: 'uppercase',
          background: accent,
          color: OG_PAPER,
          padding: '10px 20px',
        }}
      >
        {kicker}
      </div>

      {/* Title block. Ink text on bone; depth comes from a hard accent block
          offset behind it (0-blur box-shadow = solid rectangle, no gradient). */}
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
          boxShadow: `14px 14px 0 ${accent}`,
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
