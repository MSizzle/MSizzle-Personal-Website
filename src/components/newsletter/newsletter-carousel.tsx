'use client'

import { useRef } from 'react'
import Image from 'next/image'
import type { MontyMonthlyIssue } from '@/lib/rss/substack'

export function NewsletterCarousel({ issues }: { issues: MontyMonthlyIssue[] }) {
  const scrollRef = useRef<HTMLDivElement>(null)

  const scrollBy = (delta: number) => {
    scrollRef.current?.scrollBy({ left: delta, behavior: 'smooth' })
  }

  return (
    <div className="relative">
      <button
        type="button"
        aria-label="Scroll left"
        onClick={() => scrollBy(-400)}
        className="absolute left-0 top-1/2 z-10 hidden -translate-y-1/2 rounded-full border border-[var(--border)] bg-[var(--bg)] p-2 opacity-70 hover:opacity-100 md:block"
      >
        &larr;
      </button>
      <button
        type="button"
        aria-label="Scroll right"
        onClick={() => scrollBy(400)}
        className="absolute right-0 top-1/2 z-10 hidden -translate-y-1/2 rounded-full border border-[var(--border)] bg-[var(--bg)] p-2 opacity-70 hover:opacity-100 md:block"
      >
        &rarr;
      </button>

      <div
        ref={scrollRef}
        className="flex snap-x snap-mandatory gap-4 overflow-x-auto scroll-smooth pb-4"
      >
        {issues.map((issue) => (
          <a
            key={issue.link}
            href={issue.link}
            target="_blank"
            rel="noopener noreferrer"
            className="group block w-80 shrink-0 snap-start overflow-hidden rounded-lg border border-[var(--border)] bg-[var(--bg)] shadow-sm transition-all hover:shadow-md hover:border-[var(--accent)] sm:w-96"
          >
            {issue.thumbnail ? (
              <div className="relative aspect-[16/9] w-full overflow-hidden bg-[var(--muted)]">
                <Image
                  src={issue.thumbnail}
                  alt={issue.title}
                  fill
                  sizes="(max-width: 640px) 320px, 384px"
                  className="object-cover transition-transform duration-300 group-hover:scale-105"
                />
              </div>
            ) : (
              <div className="aspect-[16/9] w-full bg-[var(--muted)]" aria-hidden />
            )}
            <div className="p-4">
              <h3 className="text-base font-normal leading-snug">{issue.title}</h3>
              <time className="mt-2 block text-sm opacity-75" suppressHydrationWarning>
                {new Date(issue.pubDate).toLocaleDateString('en-US', {
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric',
                  timeZone: 'UTC',
                })}
              </time>
            </div>
          </a>
        ))}
      </div>
    </div>
  )
}
