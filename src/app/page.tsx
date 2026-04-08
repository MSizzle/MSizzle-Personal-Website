import fs from "fs";
import path from "path";
import Link from "next/link";
import { getPublishedPosts } from "@/lib/notion";
import { getFeaturedProjects } from "@/lib/notion-projects";
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

      {/* Hero — editorial intro */}
      <section className="px-6 pt-32 pb-20 md:px-24">
        <div className="mx-auto max-w-[66ch]">
          <h1 className="text-4xl font-normal uppercase tracking-tight sm:text-5xl">
            Monty Singer
          </h1>
          <p className="mt-6 text-lg leading-relaxed opacity-80">
            Hello! I&rsquo;m Monty, an investor, builder, and writer based in
            NYC. I spend my time at the intersection of technology and finance
            &mdash; reading, writing, and tinkering.
          </p>
          <div className="mt-4">
            <RotatingTagline />
          </div>
          <div className="mt-8 flex items-center gap-6">
            <Link
              href="/about"
              className="border-b border-current pb-0.5 text-base transition-opacity hover:opacity-60"
            >
              More About Me
            </Link>
            <a
              href="mailto:mds@georgetown.edu"
              className="border-b border-current pb-0.5 text-base transition-opacity hover:opacity-60"
            >
              Get in Touch
            </a>
          </div>
        </div>
      </section>

      {/* Photo carousel */}
      {carouselPhotos.length > 0 && (
        <section className="px-6 pb-20 md:px-24">
          <div className="mx-auto max-w-[66ch]">
            <PhotoCarousel photos={carouselPhotos} />
          </div>
        </section>
      )}

      {/* Selected Works */}
      {(projects.length > 0 || latestPost) && (
        <section className="px-6 pb-20 md:px-24">
          <div className="mx-auto max-w-[66ch]">
            <h2 className="text-sm font-normal uppercase tracking-widest">
              Selected Works
            </h2>

            <div className="mt-8 grid gap-10 sm:grid-cols-2 sm:gap-12">
              {projects.map((project) => (
                <Link
                  key={project.id}
                  href={`/projects/${project.slug}`}
                  className="group block"
                >
                  {project.image && (
                    <div className="aspect-[3/2] w-full overflow-hidden border border-[var(--border)]">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src={`/api/notion-cover?pageId=${project.id}`}
                        alt={project.title}
                        className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-[1.02]"
                      />
                    </div>
                  )}
                  <h3 className="mt-3 text-sm uppercase tracking-wide">
                    {project.title}
                  </h3>
                  {project.description && (
                    <p className="mt-1 text-sm opacity-50">
                      {project.description}
                    </p>
                  )}
                </Link>
              ))}
            </div>

            {projects.length === 0 && (
              <p className="mt-8 opacity-50">Projects coming soon.</p>
            )}
          </div>
        </section>
      )}

      {/* Statement + Writing */}
      <section className="px-6 pb-20 md:px-24">
        <div className="mx-auto grid max-w-[66ch] gap-16 md:grid-cols-2 md:gap-12">
          {/* Statement */}
          <div>
            <p className="text-2xl font-normal leading-snug sm:text-3xl">
              Georgetown grad, lifelong learner, always shipping.
            </p>
            <p className="mt-4 text-base leading-relaxed opacity-50">
              I believe in building things that matter, writing to think
              clearly, and staying curious about everything.
            </p>
            <Link
              href="/about"
              className="mt-4 inline-block border-b border-current pb-0.5 text-base transition-opacity hover:opacity-60"
            >
              More About Me
            </Link>
          </div>

          {/* Recent Writing */}
          <div>
            <h3 className="text-sm font-normal uppercase tracking-widest">
              Writing
            </h3>
            <ul className="mt-6 space-y-5">
              {latestPost && (
                <li>
                  <Link href={`/blog/${latestPost.slug}`} className="group block">
                    <h4 className="text-base transition-opacity group-hover:opacity-60">
                      {latestPost.title}
                    </h4>
                    {latestPost.date && (
                      <time className="text-sm opacity-50" dateTime={latestPost.date}>
                        {new Date(latestPost.date).toLocaleDateString("en-US", {
                          month: "long",
                          day: "numeric",
                          year: "numeric",
                        })}
                      </time>
                    )}
                  </Link>
                </li>
              )}
              {recentPosts.map((post) => (
                <li key={post.id}>
                  <Link href={`/blog/${post.slug}`} className="group block">
                    <h4 className="text-base transition-opacity group-hover:opacity-60">
                      {post.title}
                    </h4>
                    {post.date && (
                      <time className="text-sm opacity-50" dateTime={post.date}>
                        {new Date(post.date).toLocaleDateString("en-US", {
                          month: "short",
                          day: "numeric",
                        })}
                      </time>
                    )}
                  </Link>
                </li>
              ))}
              {posts.length === 0 && (
                <li className="opacity-50">More posts coming soon.</li>
              )}
            </ul>
            <Link
              href="/blog"
              className="mt-6 inline-block border-b border-current pb-0.5 text-sm transition-opacity hover:opacity-60"
            >
              All posts
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
