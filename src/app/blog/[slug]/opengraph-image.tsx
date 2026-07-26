// Phase 19 SC-5 title-card OG image for blog essays.
// Node runtime for fs font loading; no gradients (site-wide rule).
// Layout comes from the shared OgCard (quick task 260726-kjp).
import { ImageResponse } from 'next/og'
import { getPostBySlug } from '@/lib/notion'
import { OG_SIZE, OG_CONTENT_TYPE, ogFonts, OgCard } from '@/lib/seo/og-shared'

export const alt = 'Essay by Monty Singer'
export const size = OG_SIZE
export const contentType = OG_CONTENT_TYPE

interface Props {
  params: Promise<{ slug: string }>
}

export default async function Image({ params }: Props) {
  const { slug } = await params
  let title = 'Writing'
  let date = ''

  try {
    const post = await getPostBySlug(slug)
    if (post) {
      title = post.title
      date = post.date
        ? new Date(post.date).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
          })
        : ''
    }
  } catch {
    // Fallback to generic title
  }

  const displayTitle = title.length > 90 ? title.slice(0, 87).trimEnd() + '…' : title

  return new ImageResponse(
    (
      <OgCard
        kicker="ESSAY"
        title={displayTitle}
        footerLeft="montysinger.com"
        footerRight={date || undefined}
      />
    ),
    {
      ...size,
      fonts: ogFonts(),
    },
  )
}
