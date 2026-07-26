// OG image for /contact (quick task 260726-kjp -- previously this route had
// none). No gradients (site-wide rule); pure mono via the shared OgCard.
import { ImageResponse } from 'next/og'
import { OG_SIZE, OG_CONTENT_TYPE, ogFonts, OgCard } from '@/lib/seo/og-shared'

export const alt = 'Contact Monty Singer'
export const size = OG_SIZE
export const contentType = OG_CONTENT_TYPE

export default function Image() {
  return new ImageResponse(
    (
      <OgCard
        kicker="CONTACT"
        title="Contact"
        description="Get in touch with Monty Singer: email, X, LinkedIn, and the Monty Monthly newsletter."
        footerLeft="montysinger.com"
      />
    ),
    {
      ...size,
      fonts: ogFonts(),
    },
  )
}
