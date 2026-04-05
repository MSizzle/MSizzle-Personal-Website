'use client'

import { useState } from 'react'
import Link from 'next/link'
import { cn } from '@/utils/cn'
import type { BlogPost } from '@/lib/notion'

interface TagFilterProps {
  posts: BlogPost[]
  readingTimes: Record<string, number>
}

export function TagFilter({ posts, readingTimes }: TagFilterProps) {
  const [activeTag, setActiveTag] = useState<string | null>(null)

  const allTags = Array.from(new Set(posts.flatMap((p) => p.tags))).sort()
  const filtered = activeTag ? posts.filter((p) => p.tags.includes(activeTag)) : posts

  return (
    <div>
      {allTags.length > 0 && (
        <div className="mt-8 flex gap-2 overflow-x-auto pb-2">
          <button
            onClick={() => setActiveTag(null)}
            className={cn(
              'rounded-full px-3 py-1 text-sm transition-colors duration-150 whitespace-nowrap',
              !activeTag
                ? 'bg-[var(--accent)] text-white'
                : 'bg-neutral-100 dark:bg-neutral-800 text-[var(--fg-muted)]'
            )}
          >
            All
          </button>
          {allTags.map((tag) => (
            <button
              key={tag}
              onClick={() => setActiveTag(tag === activeTag ? null : tag)}
              className={cn(
                'rounded-full px-3 py-1 text-sm whitespace-nowrap transition-colors duration-150',
                tag === activeTag
                  ? 'bg-[var(--accent)] text-white'
                  : 'bg-neutral-100 dark:bg-neutral-800 text-[var(--fg-muted)]'
              )}
            >
              {tag}
            </button>
          ))}
        </div>
      )}

      {filtered.length === 0 ? (
        <p className="mt-12 text-[var(--fg-muted)]">
          No posts tagged &ldquo;{activeTag}&rdquo;.
        </p>
      ) : (
        <ul className="mt-6 space-y-5">
          {filtered.map((post) => (
            <li key={post.id}>
              <Link href={`/blog/${post.slug}`} className="group block">
                <article>
                  <div className="flex items-start gap-2">
                    {post.emoji && (
                      <span className="shrink-0 text-lg leading-snug">{post.emoji}</span>
                    )}
                    <div className="min-w-0 flex-1">
                      <div className="flex items-baseline justify-between gap-3">
                        <h2 className="text-base font-semibold tracking-tight group-hover:underline">
                          {post.title}
                        </h2>
                        <div className="flex shrink-0 items-baseline gap-2 text-xs text-neutral-500 dark:text-neutral-400">
                          {post.date && (
                            <time dateTime={post.date}>
                              {new Date(post.date).toLocaleDateString('en-US', {
                                month: 'short',
                                day: 'numeric',
                              })}
                            </time>
                          )}
                          <span>{readingTimes[post.slug] ?? 1}m</span>
                        </div>
                      </div>
                      {post.description && (
                        <p className="mt-1 text-sm text-neutral-600 dark:text-neutral-400 line-clamp-2">
                          {post.description}
                        </p>
                      )}
                    </div>
                  </div>
                </article>
              </Link>
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}
