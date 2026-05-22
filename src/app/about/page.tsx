import Image from "next/image";
import type { Metadata } from "next";
import { RuleStrong } from "@/components/editorial/rule-strong";
import { Rule } from "@/components/editorial/rule";
import { AllLink } from "@/components/editorial/all-link";

export const metadata: Metadata = {
  title: "About | Monty Singer",
  description:
    "Monty Singer — builder, writer, founder of Prometheus. Based in Washington, D.C.",
  alternates: { canonical: "/about" },
  openGraph: {
    title: "About | Monty Singer",
    description:
      "Monty Singer — builder, writer, founder of Prometheus. Based in Washington, D.C.",
    url: "/about",
    type: "profile",
  },
};

export default function AboutPage() {
  return (
    <>
      <section className="px-6 pt-16 pb-15 md:px-40 md:pt-40 md:pb-25">
        <div className="grid grid-cols-1 items-end gap-10 md:grid-cols-[1fr_360px] md:gap-20">
          <div>
            <div className="text-label uppercase text-muted">── The Person · 05</div>
            <h1 className="mt-6 text-page-title uppercase text-ink">About.</h1>
            <p className="mt-10 max-w-[35rem] text-body-lead text-muted">
              The longer version. I build, write, learn, and lift — in roughly
              that order. Based in Washington, D.C.
            </p>
          </div>
          <div className="hidden md:block">
            <div className="relative h-[480px] w-[360px] overflow-hidden bg-rule-strong">
              <Image
                src="/MSizzle-website-photos/000092530012.jpeg"
                alt=""
                fill
                sizes="360px"
                className="object-cover saturate-[0.92]"
              />
            </div>
          </div>
        </div>
      </section>

      <RuleStrong />

      <section className="px-6 pt-[120px] pb-[120px] md:px-40">
        {/* Studio row */}
        <div className="grid grid-cols-1 gap-6 py-9 md:grid-cols-[180px_1fr_1fr] md:gap-12">
          <div className="text-meta uppercase text-muted">Studio · Active</div>
          <div className="text-feature text-ink">Prometheus</div>
          <div className="text-body text-ink">
            <p>
              A startup that AI-enables enterprise businesses — automating
              processes, building agentic systems, and increasing operating
              leverage.
            </p>
            <div className="mt-4">
              <AllLink href="https://prometheus.today">prometheus.today &rarr;</AllLink>
            </div>
          </div>
        </div>

        <Rule />

        {/* Newsletter row */}
        <div className="grid grid-cols-1 gap-6 py-9 md:grid-cols-[180px_1fr_1fr] md:gap-12">
          <div className="text-meta uppercase text-muted">Newsletter &middot; Monthly</div>
          <div className="text-feature text-ink">Monty Monthly</div>
          <div className="text-body text-ink">
            <p>
              Once a month, an essay-letter on what I&rsquo;m building,
              learning, and reading. Sometimes longer.
            </p>
            <div className="mt-4">
              <AllLink href="/newsletter">Subscribe &rarr;</AllLink>
            </div>
          </div>
        </div>

        <Rule />

        {/* Writing row */}
        <div className="grid grid-cols-1 gap-6 py-9 md:grid-cols-[180px_1fr_1fr] md:gap-12">
          <div className="text-meta uppercase text-muted">Writing &middot; Ongoing</div>
          <div className="text-feature text-ink">Essays</div>
          <div className="text-body text-ink">
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
          <div className="text-meta uppercase text-muted">Education</div>
          <div className="text-feature text-ink">Georgetown University</div>
          <div className="text-body text-ink">
            <p>Washington, D.C.</p>
          </div>
        </div>
      </section>

      <RuleStrong />
    </>
  );
}
