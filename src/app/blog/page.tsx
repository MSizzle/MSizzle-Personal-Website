import Link from "next/link";
import { getPublishedPosts } from "@/lib/notion";

export const revalidate = 1800; // 30 minutes

export const metadata = {
  title: "Blog — Monty Singer",
  description: "Ideas, observations, and lessons learned.",
};

export default async function BlogPage() {
  let posts: Awaited<ReturnType<typeof getPublishedPosts>> = [];
  if (process.env.NOTION_TOKEN && process.env.NOTION_DATABASE_ID) {
    try {
      posts = await getPublishedPosts();
    } catch {
      // Notion API unavailable — show empty state
    }
  }

  return (
    <div className="mx-auto max-w-3xl px-6 pb-24 pt-32">
      <h1 className="text-4xl font-bold tracking-tight sm:text-5xl">
        Writing
      </h1>
      <p className="mt-4 text-lg text-neutral-600 dark:text-neutral-400">
        Ideas, observations, and lessons learned.
      </p>

      {posts.length === 0 ? (
        <p className="mt-12 text-neutral-500 dark:text-neutral-400">
          No posts yet. Check back soon.
        </p>
      ) : (
        <ul className="mt-12 space-y-8">
          {posts.map((post) => (
            <li key={post.id}>
              <Link
                href={`/blog/${post.slug}`}
                className="group block"
              >
                <article>
                  <div className="flex items-baseline justify-between gap-4">
                    <h2 className="text-xl font-semibold tracking-tight group-hover:underline sm:text-2xl">
                      {post.title}
                    </h2>
                    {post.date && (
                      <time
                        dateTime={post.date}
                        className="shrink-0 text-sm text-neutral-500 dark:text-neutral-400"
                      >
                        {new Date(post.date).toLocaleDateString("en-US", {
                          year: "numeric",
                          month: "short",
                          day: "numeric",
                        })}
                      </time>
                    )}
                  </div>
                  {post.description && (
                    <p className="mt-2 text-neutral-600 dark:text-neutral-400">
                      {post.description}
                    </p>
                  )}
                  {post.tags.length > 0 && (
                    <div className="mt-3 flex flex-wrap gap-2">
                      {post.tags.map((tag) => (
                        <span
                          key={tag}
                          className="rounded-full bg-neutral-100 px-2.5 py-0.5 text-xs font-medium text-neutral-600 dark:bg-neutral-800 dark:text-neutral-400"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                  )}
                </article>
              </Link>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
