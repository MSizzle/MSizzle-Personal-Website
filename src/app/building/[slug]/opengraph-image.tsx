// Phase 19 SC-5 title-card OG image for projects.
// Node runtime for fs font loading; no gradients (site-wide rule).
// Layout comes from the shared OgCard (quick task 260726-kjp).
import { ImageResponse } from 'next/og'
import { getProjectBySlug } from '@/lib/notion-projects'
import { OG_SIZE, OG_CONTENT_TYPE, ogFonts, OgCard } from '@/lib/seo/og-shared'

export const alt = 'Project by Monty Singer'
export const size = OG_SIZE
export const contentType = OG_CONTENT_TYPE

interface Props {
  params: Promise<{ slug: string }>
}

export default async function Image({ params }: Props) {
  const { slug } = await params
  let title = 'Project'
  let description = ''

  try {
    const project = await getProjectBySlug(slug)
    if (project) {
      title = project.title
      description = project.description
    }
  } catch {
    // Fallback to generic title
  }

  const displayTitle = title.length > 90 ? title.slice(0, 87).trimEnd() + '…' : title
  const displayDescription =
    description.length > 140 ? description.slice(0, 137).trimEnd() + '…' : description

  return new ImageResponse(
    (
      <OgCard
        kicker="PROJECT"
        title={displayTitle}
        description={displayDescription || undefined}
        footerLeft="montysinger.com"
      />
    ),
    {
      ...size,
      fonts: ogFonts(),
    },
  )
}
