'use client'

import { useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { cn } from '@/utils/cn'
import type { BlogPost } from '@/lib/notion'

interface TagFilterProps {
  posts: BlogPost[]
  readingTimes: Record<string, number>
  excerpts: Record<string, string>
}

export function TagFilter({ posts, readingTimes, excerpts }: TagFilterProps) {
  const [activeTag, setActiveTag] = useState<string | null>(null)

  const allTags = Array.from(new Set(posts.flatMap((p) => p.tags))).sort()
  const filtered = activeTag ? posts.filter((p) => p.tags.includes(activeTag)) : posts

  return (
    <div>
      {allTags.length > 0 && (
        <div className="mt-8 flex gap-3 overflow-x-auto pb-2">
          <button
            onClick={() => setActiveTag(null)}
            className={cn(
              'text-sm uppercase tracking-wide whitespace-nowrap transition-opacity',
              !activeTag ? 'opacity-100' : 'opacity-40 hover:opacity-70'
            )}
          >
            All
          </button>
          {allTags.map((tag) => (
            <button
              key={tag}
              onClick={() => setActiveTag(tag === activeTag ? null : tag)}
              className={cn(
                'text-sm uppercase tracking-wide whitespace-nowrap transition-opacity',
                tag === activeTag ? 'opacity-100' : 'opacity-40 hover:opacity-70'
              )}
            >
              {tag}
            </button>
          ))}
        </div>
      )}

      {filtered.length === 0 ? (
        <p className="mt-8 opacity-75">
          No posts tagged &ldquo;{activeTag}&rdquo;.
        </p>
      ) : (
        <div className="mt-6 grid grid-cols-1 gap-5 sm:grid-cols-2">
          {filtered.map((post) => (
            <Link
              key={post.id}
              href={`/blog/${post.slug}`}
              className="group block overflow-hidden rounded-lg border border-[var(--border)]/10 bg-[var(--bg-secondary)] transition-all duration-300 hover:-translate-y-1 hover:shadow-lg hover:shadow-[var(--fg)]/5"
            >
              <div className="relative aspect-[16/9] w-full overflow-hidden bg-[var(--fg)]/5">
                {post.cover ? (
                  <Image
                    src={`/api/notion-cover?pageId=${post.id}`}
                    alt={post.title}
                    fill
                    sizes="(max-width: 640px) 100vw, 50vw"
                    className="object-cover transition-transform duration-300 group-hover:scale-105"
                  />
                ) : post.emoji ? (
                  <div className="flex h-full items-center justify-center text-4xl">
                    {post.emoji}
                  </div>
                ) : null}
              </div>

              <div className="p-5">
                <h2 className="text-base font-normal leading-snug">
                  {post.title}
                </h2>

                <div className="mt-2 flex items-center gap-2 text-xs opacity-50">
                  {post.date && (
                    <time dateTime={post.date}>
                      {new Date(post.date).toLocaleDateString('en-US', {
                        month: 'short',
                        day: 'numeric',
                        year: 'numeric',
                      })}
                    </time>
                  )}
                  {post.date && <span>&middot;</span>}
                  <span>{readingTimes[post.slug] ?? 1} min read</span>
                </div>

                {(excerpts[post.slug] || post.description) && (
                  <div className="relative mt-3 overflow-hidden" style={{ maxHeight: 'calc(1.625 * 0.875rem * 3)' }}>
                    <p className="text-sm leading-relaxed">
                      {excerpts[post.slug] || post.description}
                    </p>
                    <div
                      className="pointer-events-none absolute inset-x-0 bottom-0 bg-gradient-to-t from-[var(--bg-secondary)] to-transparent"
                      style={{ height: 'calc(1.625 * 0.875rem)' }}
                    />
                  </div>
                )}
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  )
}
