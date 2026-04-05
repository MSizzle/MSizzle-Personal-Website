import fs from "fs";
import path from "path";
import Link from "next/link";
import { getPublishedPosts } from "@/lib/notion";
import { getFeaturedProjects } from "@/lib/notion-projects";
import { HorizontalTimeline } from "@/components/about/horizontal-timeline";
import { TIMELINE_EVENTS } from "@/data/timeline";
import { TIMELINE_VISUALS } from "@/data/timeline-visuals";
import { PhotoCarousel } from "@/components/home/photo-carousel";
import { RotatingTagline } from "@/components/home/rotating-tagline";

function getCarouselPhotos(): string[] {
  try {
    const dir = path.join(process.cwd(), "public", "MSizzle-website-photos");
    return fs
      .readdirSync(dir)
      .filter((f) => /\.(jpg|jpeg|png|webp|gif)$/i.test(f))
      .sort()
      .map((f) => `/MSizzle-website-photos/${f}`);
  } catch {
    return [];
  }
}

export const revalidate = 1800;

const personJsonLd = {
  "@context": "https://schema.org",
  "@type": "Person",
  name: "Monty Singer",
  url: "https://msizzle.com",
  sameAs: [
    "https://x.com/thefullmonty0",
    "https://linkedin.com/in/monty-singer",
    "https://github.com/MSizzle",
  ],
  jobTitle: "Investor",
  description: "Investor, builder, and lifelong learner based in NYC.",
};

export default async function Home() {
  let posts: Awaited<ReturnType<typeof getPublishedPosts>> = [];
  let projects: Awaited<ReturnType<typeof getFeaturedProjects>> = [];

  try {
    posts = await getPublishedPosts();
  } catch {}
  try {
    projects = await getFeaturedProjects();
  } catch {}

  const latestPost = posts[0];
  const recentPosts = posts.slice(1, 4);
  const carouselPhotos = getCarouselPhotos();

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(personJsonLd) }}
      />

      {/* Hero — full-width editorial banner */}
      <section className="relative overflow-hidden bg-[var(--accent)] px-6 pt-24 pb-16">
        <div className="mx-auto max-w-4xl">
          <p className="text-sm font-medium uppercase tracking-widest text-white/70">
            Investor &middot; Builder &middot; Writer
          </p>
          <h1 className="mt-3 text-5xl font-bold tracking-tight text-white sm:text-7xl">
            Monty Singer
          </h1>
          <div className="mt-4 max-w-lg">
            <RotatingTagline />
          </div>
          <div className="mt-6 flex gap-4">
            <Link
              href="/projects"
              className="inline-flex items-center rounded-lg bg-white px-5 py-2.5 text-sm font-semibold text-[var(--accent)] transition-opacity hover:opacity-90"
            >
              View My Work
            </Link>
            <Link
              href="/about"
              className="inline-flex items-center text-sm font-semibold text-white/90 transition-colors hover:text-white"
            >
              About Me<span className="ml-1">&rarr;</span>
            </Link>
          </div>
        </div>
      </section>

      {/* Photo carousel */}
      {carouselPhotos.length > 0 && (
        <section className="px-6 pt-12">
          <div className="mx-auto max-w-4xl">
            <PhotoCarousel photos={carouselPhotos} />
          </div>
        </section>
      )}

      {/* Featured Post — large card */}
      {latestPost && (
        <section className="px-6 py-12">
          <div className="mx-auto max-w-4xl">
            <p className="text-xs font-semibold uppercase tracking-widest text-[var(--accent)]">
              Latest
            </p>
            <Link href={`/blog/${latestPost.slug}`} className="group mt-3 block">
              <div className="flex flex-col gap-6 sm:flex-row sm:items-start">
                {latestPost.cover && (
                  <div className="aspect-video w-full overflow-hidden rounded-lg sm:w-72 sm:shrink-0">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={`/api/notion-cover?pageId=${latestPost.id}`}
                      alt={latestPost.title}
                      className="h-full w-full object-cover transition-transform duration-200 group-hover:scale-105"
                    />
                  </div>
                )}
                <div>
                  <h2 className="text-2xl font-bold tracking-tight group-hover:text-[var(--accent)] sm:text-3xl">
                    {latestPost.emoji && <span className="mr-2">{latestPost.emoji}</span>}
                    {latestPost.title}
                  </h2>
                  {latestPost.description && (
                    <p className="mt-2 text-base leading-relaxed text-[var(--fg-muted)] line-clamp-3">
                      {latestPost.description}
                    </p>
                  )}
                  <div className="mt-3 flex items-center gap-3 text-sm text-[var(--fg-muted)]">
                    {latestPost.date && (
                      <time dateTime={latestPost.date}>
                        {new Date(latestPost.date).toLocaleDateString("en-US", {
                          month: "long",
                          day: "numeric",
                          year: "numeric",
                        })}
                      </time>
                    )}
                    <span className="text-sm font-semibold text-[var(--accent)]">
                      Read &rarr;
                    </span>
                  </div>
                </div>
              </div>
            </Link>
          </div>
        </section>
      )}

      {/* Timeline — hidden for now, preserved for future use */}
      {false && (
        <section className="border-t border-[var(--border)] px-6 py-12">
          <div className="mx-auto max-w-5xl">
            <h2 className="text-xs font-semibold uppercase tracking-widest text-[var(--accent)]">
              The Journey
            </h2>
            <p className="mt-1 text-sm text-[var(--fg-muted)]">
              Click any icon to learn more about each experience.
            </p>
            <div className="mt-6">
              <HorizontalTimeline events={TIMELINE_EVENTS} visuals={TIMELINE_VISUALS} />
            </div>
          </div>
        </section>
      )}

      {/* Recent Posts + Featured Projects side by side */}
      <section className="border-t border-[var(--border)] px-6 py-12">
        <div className="mx-auto grid max-w-4xl gap-12 md:grid-cols-2">
          {/* Recent Writing */}
          <div>
            <div className="flex items-baseline justify-between">
              <h3 className="text-xs font-semibold uppercase tracking-widest text-[var(--accent)]">
                Writing
              </h3>
              <Link
                href="/blog"
                className="text-xs font-semibold text-[var(--fg-muted)] hover:text-foreground"
              >
                All posts &rarr;
              </Link>
            </div>
            <ul className="mt-4 space-y-4">
              {recentPosts.map((post) => (
                <li key={post.id}>
                  <Link href={`/blog/${post.slug}`} className="group block">
                    <div className="flex items-start gap-2">
                      {post.emoji && (
                        <span className="shrink-0 text-base">{post.emoji}</span>
                      )}
                      <div className="min-w-0">
                        <h4 className="text-sm font-semibold group-hover:text-[var(--accent)]">
                          {post.title}
                        </h4>
                        {post.date && (
                          <time className="text-xs text-[var(--fg-muted)]" dateTime={post.date}>
                            {new Date(post.date).toLocaleDateString("en-US", {
                              month: "short",
                              day: "numeric",
                            })}
                          </time>
                        )}
                      </div>
                    </div>
                  </Link>
                </li>
              ))}
              {recentPosts.length === 0 && (
                <li className="text-sm text-[var(--fg-muted)]">More posts coming soon.</li>
              )}
            </ul>
          </div>

          {/* Featured Projects */}
          <div>
            <div className="flex items-baseline justify-between">
              <h3 className="text-xs font-semibold uppercase tracking-widest text-[var(--accent)]">
                Projects
              </h3>
              <Link
                href="/projects"
                className="text-xs font-semibold text-[var(--fg-muted)] hover:text-foreground"
              >
                All projects &rarr;
              </Link>
            </div>
            <ul className="mt-4 space-y-4">
              {projects.map((project) => (
                <li key={project.id}>
                  <Link href={`/projects/${project.slug}`} className="group flex items-start gap-3">
                    {project.image ? (
                      <div className="h-14 w-14 shrink-0 overflow-hidden rounded-lg">
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img
                          src={`/api/notion-cover?pageId=${project.id}`}
                          alt={project.title}
                          className="h-full w-full object-cover"
                        />
                      </div>
                    ) : (
                      <div className="h-14 w-14 shrink-0 rounded-lg bg-[var(--bg-secondary)]" />
                    )}
                    <div className="min-w-0">
                      <h4 className="text-sm font-semibold group-hover:text-[var(--accent)]">
                        {project.emoji && <span className="mr-1">{project.emoji}</span>}
                        {project.title}
                      </h4>
                      {project.description && (
                        <p className="mt-0.5 text-xs text-[var(--fg-muted)] line-clamp-2">
                          {project.description}
                        </p>
                      )}
                    </div>
                  </Link>
                </li>
              ))}
              {projects.length === 0 && (
                <li className="text-sm text-[var(--fg-muted)]">Projects coming soon.</li>
              )}
            </ul>
          </div>
        </div>
      </section>
    </>
  );
}
