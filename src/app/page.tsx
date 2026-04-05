import Link from "next/link";

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

export default function Home() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(personJsonLd) }}
      />

      {/* Hero */}
      <section className="px-6 pt-28 pb-12">
        <div className="mx-auto max-w-2xl">
          <div className="mb-6 h-28 w-28 rounded-full bg-[var(--bg-secondary)] border border-[var(--border)]" />
          <h1 className="text-5xl font-semibold tracking-tight sm:text-6xl">
            Hey, I&apos;m Monty.
          </h1>
          <p className="mt-4 text-lg text-[var(--fg-muted)]">
            Investor, builder, and lifelong learner based in NYC.
          </p>
          <div className="mt-6 flex gap-4">
            <Link
              href="/projects"
              className="inline-flex items-center rounded-lg bg-[var(--accent-warm)] px-6 py-3 text-sm font-semibold text-white transition-opacity hover:opacity-90"
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

      {/* About */}
      <section className="border-t border-[var(--border)] px-6 py-12">
        <div className="mx-auto max-w-2xl">
          <h2 className="text-2xl font-semibold tracking-tight sm:text-3xl">
            About
          </h2>
          <p className="mt-3 text-base leading-relaxed text-[var(--fg-muted)]">
            Georgetown grad turned investor, now building at the intersection of
            technology and finance in New York City. Always learning, always
            shipping.
          </p>
          <Link
            href="/about"
            className="mt-3 inline-block text-sm font-semibold text-[var(--accent)] hover:underline"
          >
            More about me &rarr;
          </Link>
        </div>
      </section>

      {/* Projects */}
      <section className="border-t border-[var(--border)] px-6 py-12">
        <div className="mx-auto max-w-2xl">
          <h2 className="text-2xl font-semibold tracking-tight sm:text-3xl">
            Projects
          </h2>
          <p className="mt-3 text-base leading-relaxed text-[var(--fg-muted)]">
            Things I&apos;ve built and invested in — from software products to
            creative experiments.
          </p>
          <Link
            href="/projects"
            className="mt-3 inline-block text-sm font-semibold text-[var(--accent)] hover:underline"
          >
            See all projects &rarr;
          </Link>
        </div>
      </section>

      {/* Writing */}
      <section className="border-t border-[var(--border)] px-6 py-12">
        <div className="mx-auto max-w-2xl">
          <h2 className="text-2xl font-semibold tracking-tight sm:text-3xl">
            Writing
          </h2>
          <p className="mt-3 text-base leading-relaxed text-[var(--fg-muted)]">
            Ideas, observations, and lessons learned. On investing, building,
            and everything in between.
          </p>
          <Link
            href="/blog"
            className="mt-3 inline-block text-sm font-semibold text-[var(--accent)] hover:underline"
          >
            Read the blog &rarr;
          </Link>
        </div>
      </section>
    </>
  );
}
