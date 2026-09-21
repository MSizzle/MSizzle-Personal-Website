import type { Metadata } from "next";
import type { ReactNode } from "react";
import Link from "next/link";
import { PageHeroBand } from "@/components/v3/page-hero-band";
import { RuleStrong } from "@/components/editorial/rule-strong";
import { Breadcrumbs } from "@/components/seo/breadcrumbs";
import { JsonLd } from "@/components/seo/json-ld";
import { buildFaqPageSchema, type FaqItem } from "@/lib/seo/schemas";
import { IDENTITY_SENTENCE } from "@/lib/seo/site";

export const metadata: Metadata = {
  title: "About",
  description: IDENTITY_SENTENCE,
  alternates: { canonical: "/about" },
  openGraph: {
    title: "About",
    description: IDENTITY_SENTENCE,
    url: "/about",
    type: "profile",
  },
};

/**
 * The questions that actually get asked, answered in full sentences that name
 * the entity. One array feeds both the visible list and the FAQPage JSON-LD,
 * so a crawler never sees a claim the page does not make (260921-ed0).
 */
const FAQ: FaqItem[] = [
  {
    question: "What is Prometheus?",
    answer:
      "Prometheus is an applied AI company I founded. We integrate AI into how businesses actually operate and teach teams to use it well. More at prometheus.today.",
  },
  {
    question: "What does Monty Singer write about?",
    answer:
      "Philosophy, technology, building things, and how to live an attentive life. Essays live at montysinger.com/writing. Monty Monthly is the newsletter.",
  },
  {
    question: "How do I get in touch with Monty Singer?",
    answer:
      "Email monty@prometheus.today or use montysinger.com/contact. Anonymous notes go through montysinger.com/advice.",
  },
  {
    question: "Where did Monty Singer go to school?",
    answer: "Georgetown University.",
  },
];

/** One labelled block of prose. Mono uppercase label, short measure below. */
function Section({ label, children }: { label: string; children: ReactNode }) {
  return (
    <section className="px-6 py-12 md:px-40 md:py-16">
      <h2 className="mb-5 font-mono text-xs uppercase tracking-[0.16em] text-[var(--color-text-muted)]">
        {label}
      </h2>
      <div className="max-w-[60ch] space-y-4 text-[1.05rem] leading-relaxed">
        {children}
      </div>
    </section>
  );
}

const linkClass = "underline underline-offset-4 hover:opacity-70";

/**
 * /about -- the plain biographical page.
 *
 * It exists because both Google and language models need one page that states
 * the facts in flat prose: who Monty is, what Prometheus does, where he went
 * to school, where the writing lives, how to reach him. The rest of the site
 * is designed to be felt; this page is designed to be quoted (260921-ed0).
 *
 * Server Component, no client JS. Copy rules (CLAUDE.md): no em dashes, no
 * location, Georgetown University as the only school, Founder of Prometheus
 * as the only professional identity.
 */
export default function AboutPage() {
  return (
    <>
      <Breadcrumbs items={[{ name: "Home", href: "/" }, { name: "About" }]} />
      <JsonLd data={buildFaqPageSchema(FAQ)} />

      <PageHeroBand
        tone="ink"
        title="About"
        crumb="Home / About"
        sub={IDENTITY_SENTENCE}
      />

      <Section label="Who I am">
        <p>
          I&rsquo;m Monty Singer. I founded Prometheus, an applied AI company:
          we do AI integrations and education for businesses. I write essays
          here and a monthly letter called Monty Monthly.
        </p>
        <p>
          Most of what I do comes down to the same habit. Take something people
          talk about in the abstract, build it, and see what survives contact
          with real use.
        </p>
      </Section>

      <RuleStrong />

      <Section label="Prometheus">
        <p>
          Prometheus is an applied AI company. Two halves: integrations, where
          we wire AI into the tools a business already runs on, and education,
          where we teach the people who will use it. The work is practical. It
          ends in something a team uses on a Monday, not a slide deck.
        </p>
        <p>
          <a
            href="https://prometheus.today"
            target="_blank"
            rel="noopener noreferrer"
            className={linkClass}
          >
            prometheus.today
          </a>
        </p>
      </Section>

      <RuleStrong />

      <Section label="Education">
        <p>Georgetown University.</p>
      </Section>

      <RuleStrong />

      <Section label="Writing">
        <p>
          Essays live at{" "}
          <Link href="/writing" className={linkClass}>
            /writing
          </Link>
          . Monty Monthly is the letter I send once a month, published on
          Substack at{" "}
          <a
            href="https://montymonthly.substack.com"
            target="_blank"
            rel="noopener noreferrer"
            className={linkClass}
          >
            montymonthly.substack.com
          </a>
          .
        </p>
        <p>
          If you read by feed, the essays are at{" "}
          <a href="/blog/feed.xml" className={linkClass}>
            /blog/feed.xml
          </a>
          .
        </p>
      </Section>

      <RuleStrong />

      <Section label="Interests">
        <p>
          Technology, biology, and self-improvement. The three overlap more
          than they look like they should.
        </p>
        <p>
          <Link href="/#loves" className={linkClass}>
            Things I love outside of work
          </Link>{" "}
          are collected on the homepage: books, films, music, and the rest.
        </p>
      </Section>

      <RuleStrong />

      <Section label="Contact">
        <p>
          Email{" "}
          <a href="mailto:monty@prometheus.today" className={linkClass}>
            monty@prometheus.today
          </a>
          , or pick a line on the{" "}
          <Link href="/contact" className={linkClass}>
            contact page
          </Link>
          .
        </p>
        <p>
          If you would rather stay anonymous,{" "}
          <Link href="/advice" className={linkClass}>
            /advice
          </Link>{" "}
          takes notes without asking who you are.
        </p>
      </Section>

      <RuleStrong />

      <Section label="Questions people ask">
        <dl className="space-y-8">
          {FAQ.map((item) => (
            <div key={item.question}>
              <dt className="font-display text-[1.15rem] font-bold leading-snug">
                {item.question}
              </dt>
              <dd className="mt-2 leading-relaxed">{item.answer}</dd>
            </div>
          ))}
        </dl>
      </Section>

      <RuleStrong />
    </>
  );
}
