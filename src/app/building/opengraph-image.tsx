// OG image for /building index (quick task 260726-kjp -- previously this route
// had none). Segment-level generator; does not conflict with the dynamic-segment
// building/[slug]/opengraph-image.tsx, Next resolves each independently.
// No gradients (site-wide rule); pure mono via the shared OgCard.
import { ImageResponse } from 'next/og'
import { OG_SIZE, OG_CONTENT_TYPE, ogFonts, OgCard } from '@/lib/seo/og-shared'

export const alt = 'Building, projects by Monty Singer'
export const size = OG_SIZE
export const contentType = OG_CONTENT_TYPE

export default function Image() {
  return new ImageResponse(
    (
      <OgCard
        kicker="BUILDING"
        title="Building"
        description="Projects, products, and AI systems Monty Singer is building or has built through Prometheus and independent work."
        footerLeft="montysinger.com"
      />
    ),
    {
      ...size,
      fonts: ogFonts(),
    },
  )
}
