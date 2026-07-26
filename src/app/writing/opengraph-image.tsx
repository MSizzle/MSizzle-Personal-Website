// OG image for /writing (quick task 260726-kjp -- previously this route had none).
// No gradients (site-wide rule); pure mono via the shared OgCard.
import { ImageResponse } from 'next/og'
import { OG_SIZE, OG_CONTENT_TYPE, ogFonts, OgCard } from '@/lib/seo/og-shared'

export const alt = 'Writing, essays by Monty Singer'
export const size = OG_SIZE
export const contentType = OG_CONTENT_TYPE

export default function Image() {
  return new ImageResponse(
    (
      <OgCard
        kicker="WRITING"
        title="Writing"
        description="Long-form essays on philosophy, technology, and the texture of an attentive life."
        footerLeft="montysinger.com"
      />
    ),
    {
      ...size,
      fonts: ogFonts(),
    },
  )
}
