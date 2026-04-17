'use client'

import Image from 'next/image'
import Link from 'next/link'
import type { BlogPost } from '@/lib/notion'

interface WritingsCarouselProps {
  posts: BlogPost[]
}

export function WritingsCarousel({ posts }: WritingsCarouselProps) {
  if (posts.length === 0) return null

  // Duplicate for seamless infinite scroll
  const doubled = [...posts, ...posts]

  return (
    <div className="relative overflow-hidden px-6">
      <div className="flex w-max animate-scroll-left gap-5">
        {doubled.map((post, i) => (
          <Link
            key={`${post.id}-${i}`}
            href={`/blog/${post.slug}`}
            className="group block w-[80vw] shrink-0 overflow-hidden border border-[var(--border)] bg-[var(--bg)] transition-opacity hover:opacity-70 sm:w-[45vw] md:w-[30vw]"
          >
            {post.cover ? (
              <div className="relative aspect-[16/9] w-full overflow-hidden bg-[var(--muted)]">
                <Image
                  src={post.cover}
                  alt={post.title}
                  fill
                  sizes="(max-width: 640px) 80vw, (max-width: 768px) 45vw, 30vw"
                  className="object-cover transition-transform duration-500 group-hover:scale-105"
                />
              </div>
            ) : (
              <div className="aspect-[16/9] w-full bg-[var(--muted)]" aria-hidden />
            )}
            <div className="p-4">
              <div className="flex items-baseline gap-2">
                {post.emoji && (
                  <span className="shrink-0 text-lg leading-none">{post.emoji}</span>
                )}
                <h3 className="line-clamp-2 text-base font-normal leading-snug">{post.title}</h3>
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
