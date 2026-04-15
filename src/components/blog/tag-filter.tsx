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
        <p className="mt-8 opacity-50">
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
                        <h2 className="text-base font-normal underline transition-opacity group-hover:opacity-60">
                          {post.title}
                        </h2>
                        <div className="flex shrink-0 items-baseline gap-2 text-sm opacity-50">
                          {post.date && (
                            <time dateTime={post.date}>
                              {new Date(post.date).toLocaleDateString('en-US', {
                                month: 'short',
                                day: 'numeric',
                              })}
                            </time>
                          )}
                          <span>{readingTimes[post.slug] ?? 1} min read</span>
                        </div>
                      </div>
                      {post.description && (
                        <p className="mt-1 text-sm opacity-50 line-clamp-2">
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
