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
        onClick={() => scrollBy(-320)}
        className="absolute left-0 top-1/2 z-10 hidden -translate-y-1/2 rounded-full border border-[var(--border)] bg-[var(--bg)] p-2 opacity-70 hover:opacity-100 md:block"
      >
        &larr;
      </button>
      <button
        type="button"
        aria-label="Scroll right"
        onClick={() => scrollBy(320)}
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
            className="block w-72 shrink-0 snap-start border border-[var(--border)] transition-opacity hover:opacity-70"
          >
            {issue.thumbnail ? (
              <div className="relative aspect-[3/2] w-full bg-[var(--muted)]">
                <Image
                  src={issue.thumbnail}
                  alt={issue.title}
                  fill
                  sizes="288px"
                  className="object-cover"
                />
              </div>
            ) : (
              <div className="aspect-[3/2] w-full bg-[var(--muted)]" aria-hidden />
            )}
            <div className="p-3">
              <h3 className="text-sm font-normal">{issue.title}</h3>
              <time className="mt-1 block text-xs opacity-75">
                {new Date(issue.pubDate).toLocaleDateString('en-US', {
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric',
                })}
              </time>
            </div>
          </a>
        ))}
      </div>
    </div>
  )
}
