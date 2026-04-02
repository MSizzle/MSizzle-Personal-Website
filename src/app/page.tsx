import Link from "next/link";

const personJsonLd = {
  "@context": "https://schema.org",
  "@type": "Person",
  name: "Monty Singer",
  url: "https://msizzle.com",
  sameAs: [
    "https://twitter.com/msizzle",
    "https://linkedin.com/in/montysinger",
    "https://github.com/montysinger",
  ],
  jobTitle: "Investor",
  description: "Investor, builder, and lifelong learner based in NYC.",
};

export default function Home() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(personJsonLd) }}
      />

      {/* Section 1 — Hero */}
      <section className="flex min-h-screen items-center justify-center px-6 pt-24">
        <div className="max-w-2xl text-center">
          {/* Profile photo placeholder */}
          <div className="mx-auto mb-8 h-32 w-32 rounded-full bg-[var(--bg-secondary)] border border-[var(--border)]" />

          <h1 className="text-6xl font-semibold tracking-tight sm:text-7xl">
            Hey, I&apos;m Monty.
          </h1>

          <p className="mt-6 text-lg text-[var(--fg-muted)]">
            Investor, builder, and lifelong learner based in NYC.
          </p>

          <div className="mt-8 flex flex-col items-center gap-4 sm:flex-row sm:justify-center">
            <Link
              href="/projects"
              className="inline-flex items-center rounded-lg bg-[var(--accent)] px-6 py-3 text-sm font-semibold text-white transition-opacity hover:opacity-90"
            >
              View My Work
            </Link>
            <Link
              href="/blog"
              className="inline-flex items-center text-sm font-semibold text-[var(--fg-muted)] transition-colors hover:text-foreground"
            >
              Read My Writing<span className="ml-1">&rarr;</span>
            </Link>
          </div>
        </div>
      </section>

      {/* Section 2 — About Snapshot */}
      <section className="flex min-h-screen items-center justify-center border-t border-[var(--border)] px-6 py-16">
        <div className="max-w-xl text-center">
          <h2 className="text-3xl font-semibold tracking-tight sm:text-5xl">
            About
          </h2>
          <p className="mt-6 text-lg leading-relaxed text-[var(--fg-muted)]">
            Georgetown grad turned investor, now building at the intersection of
            technology and finance in New York City. Always learning, always
            shipping.
          </p>
          <Link
            href="/about"
            className="mt-6 inline-block text-sm font-semibold text-[var(--accent)] hover:underline"
          >
            More about me &rarr;
          </Link>
        </div>
      </section>

      {/* Section 3 — Featured Work */}
      <section className="flex min-h-screen items-center justify-center border-t border-[var(--border)] px-6 py-16">
        <div className="max-w-xl text-center">
          <h2 className="text-3xl font-semibold tracking-tight sm:text-5xl">
            Projects
          </h2>
          <p className="mt-6 text-lg leading-relaxed text-[var(--fg-muted)]">
            Things I&apos;ve built and invested in — from software products to
            creative experiments.
          </p>
          <Link
            href="/projects"
            className="mt-6 inline-block text-sm font-semibold text-[var(--accent)] hover:underline"
          >
            See all projects &rarr;
          </Link>
        </div>
      </section>

      {/* Section 4 — Writing Teaser */}
      <section className="flex min-h-screen items-center justify-center border-t border-[var(--border)] px-6 py-16">
        <div className="max-w-xl text-center">
          <h2 className="text-3xl font-semibold tracking-tight sm:text-5xl">
            Writing
          </h2>
          <p className="mt-6 text-lg leading-relaxed text-[var(--fg-muted)]">
            Ideas, observations, and lessons learned. On investing, building,
            and everything in between.
          </p>
          <Link
            href="/blog"
            className="mt-6 inline-block text-sm font-semibold text-[var(--accent)] hover:underline"
          >
            Read the blog &rarr;
          </Link>
        </div>
      </section>

      {/* Section 5 — Contact CTA */}
      <section className="flex min-h-screen items-center justify-center border-t border-[var(--border)] px-6 py-16">
        <div className="max-w-xl text-center">
          <h2 className="text-3xl font-semibold tracking-tight sm:text-5xl">
            Let&apos;s Connect
          </h2>
          <p className="mt-6 text-lg leading-relaxed text-[var(--fg-muted)]">
            Always open to conversations about investing, technology, or
            interesting ideas.
          </p>
          <a
            href="mailto:monty@msizzle.com"
            className="mt-6 inline-block text-sm font-semibold text-[var(--accent)] hover:underline"
          >
            Say hello &rarr;
          </a>
        </div>
      </section>
    </>
  );
}
