import fs from "fs";
import path from "path";
import Link from "next/link";
import { getPublishedPosts } from "@/lib/notion";
import { getFeaturedProjects } from "@/lib/notion-projects";
import { EVENTS } from "@/data/events";
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
              className="underline transition-opacity hover:opacity-60"
            >
              More About Me
            </Link>
            <a
              href="#contact"
              className="underline transition-opacity hover:opacity-60"
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

      {/* Writings */}
      <section className="px-6 pb-20 md:px-24">
        <div className="mx-auto max-w-[66ch]">
          <Link
            href="/blog"
            className="text-base font-normal uppercase tracking-widest transition-opacity hover:opacity-60"
          >
            Writings &#8600;
          </Link>
          <ul className="mt-4 space-y-2">
            {posts.map((post) => (
              <li key={post.id}>
                <Link
                  href={`/blog/${post.slug}`}
                  className="group flex items-baseline transition-opacity hover:opacity-60"
                >
                  {post.emoji && (
                    <span className="mr-2 shrink-0 no-underline">{post.emoji}</span>
                  )}
                  <span className="underline">{post.title}</span>
                </Link>
              </li>
            ))}
            {posts.length === 0 && (
              <li className="opacity-50">More posts coming soon.</li>
            )}
          </ul>
        </div>
      </section>

      {/* Works */}
      <section className="px-6 pb-20 md:px-24">
        <div className="mx-auto max-w-[66ch]">
          <Link
            href="/projects"
            className="text-base font-normal uppercase tracking-widest transition-opacity hover:opacity-60"
          >
            Works &#8600;
          </Link>
          <ul className="mt-4 space-y-2">
            {projects.map((project) => (
              <li key={project.id}>
                <Link
                  href={`/projects/${project.slug}`}
                  className="group block"
                >
                  <span className="underline transition-opacity group-hover:opacity-60">
                    {project.title}
                  </span>
                  {project.description && (
                    <span className="ml-2 text-base opacity-50">
                      &bull; {project.description}
                    </span>
                  )}
                </Link>
              </li>
            ))}
            {projects.length === 0 && (
              <li className="opacity-50">Projects coming soon.</li>
            )}
          </ul>
        </div>
      </section>

      {/* Events */}
      <section className="px-6 pb-20 md:px-24">
        <div className="mx-auto max-w-[66ch]">
          <Link
            href="/events"
            className="text-base font-normal uppercase tracking-widest transition-opacity hover:opacity-60"
          >
            Events &#8600;
          </Link>
          {EVENTS.length > 0 ? (
            <ul className="mt-4 space-y-2">
              {EVENTS.slice(0, 5).map((event) => (
                <li key={event.id}>
                  {event.url ? (
                    <a
                      href={event.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="underline transition-opacity hover:opacity-60"
                    >
                      {event.title}
                    </a>
                  ) : (
                    <span>{event.title}</span>
                  )}
                  <span className="ml-2 text-base opacity-50">
                    &bull;{" "}
                    {new Date(event.date).toLocaleDateString("en-US", {
                      month: "short",
                      day: "numeric",
                    })}
                    {event.location && `, ${event.location}`}
                  </span>
                </li>
              ))}
            </ul>
          ) : (
            <p className="mt-4 opacity-50">Events coming soon.</p>
          )}
        </div>
      </section>
    </>
  );
}
