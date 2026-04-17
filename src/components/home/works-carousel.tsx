'use client'

import Image from 'next/image'
import Link from 'next/link'
import type { Project } from '@/lib/notion-projects'

interface WorksCarouselProps {
  projects: Project[]
}

export function WorksCarousel({ projects }: WorksCarouselProps) {
  if (projects.length === 0) return null

  return (
    <div className="grid grid-cols-3 gap-x-3 gap-y-1 sm:grid-cols-4">
      {projects.map((project) => (
        <Link
          key={project.id}
          href={`/projects/${project.slug}`}
          className="block transition-opacity hover:opacity-60"
        >
          <div className="relative aspect-[4/3] w-full overflow-hidden bg-[var(--muted)]">
            {project.image ? (
              <Image
                src={`/api/notion-cover?pageId=${project.id}`}
                alt={project.title}
                fill
                sizes="(max-width: 640px) 33vw, 25vw"
                className="object-contain"
              />
            ) : project.emoji ? (
              <span className="flex h-full w-full items-center justify-center text-4xl">
                {project.emoji}
              </span>
            ) : null}
          </div>
        </Link>
      ))}
    </div>
  )
}
