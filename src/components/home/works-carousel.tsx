'use client'

import Image from 'next/image'
import Link from 'next/link'
import type { Project } from '@/lib/notion-projects'

interface WorksCarouselProps {
  projects: Project[]
  referenceCount?: number
}

export function WorksCarousel({ projects, referenceCount = projects.length }: WorksCarouselProps) {
  if (projects.length === 0) return null

  // Duplicate for seamless infinite loop
  const doubled = [...projects, ...projects]
  const duration = Math.max(12, (80 * projects.length) / Math.max(1, referenceCount))

  return (
    <div className="group relative overflow-hidden">
      <div
        className="flex w-max animate-scroll-hover gap-5"
        style={{ animationDuration: `${duration}s` }}
      >
        {doubled.map((project, i) => (
          <Link
            key={`${project.id}-${i}`}
            href={`/projects/${project.slug}`}
            className="block w-56 shrink-0 overflow-hidden bg-[var(--bg)] transition-opacity hover:opacity-70 sm:w-64"
          >
            <div className="relative aspect-[4/3] w-full overflow-hidden bg-[var(--muted)]">
              {project.image ? (
                <Image
                  src={`/api/notion-cover?pageId=${project.id}`}
                  alt={project.title}
                  fill
                  sizes="(max-width: 640px) 224px, 256px"
                  className="object-contain"
                />
              ) : project.emoji ? (
                <span className="flex h-full w-full items-center justify-center text-4xl">
                  {project.emoji}
                </span>
              ) : null}
            </div>
            <div className="p-4">
              <div className="flex items-baseline gap-2">
                {project.emoji && (
                  <span className="shrink-0 text-lg leading-none">{project.emoji}</span>
                )}
                <h3 className="line-clamp-2 text-base font-normal leading-snug">
                  {project.title}
                </h3>
              </div>
              {project.description && (
                <p className="mt-2 line-clamp-2 text-sm leading-relaxed opacity-60">
                  {project.description}
                </p>
              )}
            </div>
          </Link>
        ))}
      </div>
    </div>
  )
}
