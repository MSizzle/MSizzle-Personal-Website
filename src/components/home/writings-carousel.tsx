'use client'

import Image from 'next/image'
import Link from 'next/link'
import type { BlogPost } from '@/lib/notion'

interface WritingsCarouselProps {
  posts: BlogPost[]
}

export function WritingsCarousel({ posts }: WritingsCarouselProps) {
  if (posts.length === 0) return null

  // Duplicate for seamless infinite loop
  const doubled = [...posts, ...posts]

  return (
    <div className="group relative overflow-hidden">
      <div className="flex w-max animate-scroll-hover gap-5">
        {doubled.map((post, i) => (
          <Link
            key={`${post.id}-${i}`}
            href={`/blog/${post.slug}`}
            className="block w-56 shrink-0 overflow-hidden bg-[var(--bg)] transition-opacity hover:opacity-70 sm:w-64"
          >
            <div className="relative aspect-[4/3] w-full overflow-hidden bg-[var(--muted)]">
              {post.cover && (
                <Image
                  src={`/api/notion-cover?pageId=${post.id}`}
                  alt={post.title}
                  fill
                  sizes="(max-width: 640px) 224px, 256px"
                  className="object-cover"
                />
              )}
            </div>
            <div className="p-4">
              <div className="flex items-baseline gap-2">
                {post.emoji && (
                  <span className="shrink-0 text-lg leading-none">{post.emoji}</span>
                )}
                <h3 className="line-clamp-2 text-base font-normal leading-snug">
                  {post.title}
                </h3>
              </div>
              {post.description && (
                <p className="mt-2 line-clamp-2 text-sm leading-relaxed opacity-60">
                  {post.description}
                </p>
              )}
            </div>
          </Link>
        ))}
      </div>
    </div>
  )
}
