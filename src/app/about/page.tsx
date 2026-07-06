import type { Metadata } from "next";
import { PageHero } from "@/components/v3/page-hero";
import { RuleStrong } from "@/components/editorial/rule-strong";
import { Rule } from "@/components/editorial/rule";
import { AllLink } from "@/components/editorial/all-link";

export const metadata: Metadata = {
  title: "About",
  description:
    "Monty Singer — builder, writer, Founder of Prometheus.",
  alternates: { canonical: "/about" },
  openGraph: {
    title: "About",
    description:
      "Monty Singer — builder, writer, Founder of Prometheus.",
    url: "/about",
    type: "profile",
  },
};

export default function AboutPage() {
  return (
    <>
      <section className="px-6 md:px-40">
        <PageHero
          title="About"
          crumb="Home / About"
          sub="Builder, writer. Founder of Prometheus."
        />
      </section>

      <RuleStrong />

      <section className="px-6 pt-[120px] pb-[120px] md:px-40">
        {/* Studio row */}
        <div className="grid grid-cols-1 gap-6 py-9 md:grid-cols-[180px_1fr_1fr] md:gap-12">
          <div className="text-meta uppercase text-[var(--color-text-muted)]">Studio · Active</div>
          <div className="text-feature text-[var(--color-text)]">Prometheus</div>
          <div className="text-body text-[var(--color-text)]">
            <p>
              A startup that AI-enables enterprise businesses — automating
              processes, building agentic systems, and increasing operating
              leverage.
            </p>
            <div className="mt-4">
              <a
                href="https://prometheus.today"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-block border-b border-[var(--color-text)] pb-1 text-label uppercase text-[var(--color-text)]"
              >
                prometheus.today &rarr;
              </a>
            </div>
          </div>
        </div>

        <Rule />

        {/* Newsletter row */}
        <div className="grid grid-cols-1 gap-6 py-9 md:grid-cols-[180px_1fr_1fr] md:gap-12">
          <div className="text-meta uppercase text-[var(--color-text-muted)]">Newsletter &middot; Monthly</div>
          <div className="text-feature text-[var(--color-text)]">Monty Monthly</div>
          <div className="text-body text-[var(--color-text)]">
            <p>
              Once a month, an essay-letter on what I&rsquo;m building,
              learning, and reading. Sometimes longer.
            </p>
            <div className="mt-4">
              <AllLink href="/writing">Subscribe &rarr;</AllLink>
            </div>
          </div>
        </div>

        <Rule />

        {/* Writing row */}
        <div className="grid grid-cols-1 gap-6 py-9 md:grid-cols-[180px_1fr_1fr] md:gap-12">
          <div className="text-meta uppercase text-[var(--color-text-muted)]">Writing &middot; Ongoing</div>
          <div className="text-feature text-[var(--color-text)]">Essays</div>
          <div className="text-body text-[var(--color-text)]">
            <p>
              Long-form essays on philosophy, technology, and the texture of an
              attentive life.
            </p>
            <div className="mt-4">
              <AllLink href="/writing">All writing &rarr;</AllLink>
            </div>
          </div>
        </div>

        <Rule />

        {/* Education row */}
        <div className="grid grid-cols-1 gap-6 py-9 md:grid-cols-[180px_1fr_1fr] md:gap-12">
          <div className="text-meta uppercase text-[var(--color-text-muted)]">Education</div>
          <div className="text-feature text-[var(--color-text)]">Georgetown University</div>
          <div className="text-body text-[var(--color-text)]">
            <p>B.S., Business Administration.</p>
          </div>
        </div>
      </section>

      <RuleStrong />
    </>
  );
}
