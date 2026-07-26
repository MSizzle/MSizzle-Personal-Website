// OG image for /prometheus (quick task 260726-kjp -- previously this route had
// none). No gradients (site-wide rule); pure mono via the shared OgCard.
import { ImageResponse } from 'next/og'
import { OG_SIZE, OG_CONTENT_TYPE, ogFonts, OgCard, truncateOg } from '@/lib/seo/og-shared'

export const alt = 'Prometheus, AI integrations and education by Monty Singer'
export const size = OG_SIZE
export const contentType = OG_CONTENT_TYPE

export default function Image() {
  return new ImageResponse(
    (
      <OgCard
        kicker="PROMETHEUS"
        title="Prometheus"
        description={truncateOg(
          'Prometheus is an AI integrations and education company founded by Monty Singer. Custom automation, AI implementation, and training for businesses.'
        )}
        footerLeft="montysinger.com"
      />
    ),
    {
      ...size,
      fonts: ogFonts(),
    },
  )
}
