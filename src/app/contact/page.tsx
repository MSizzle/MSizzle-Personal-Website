import type { Metadata } from "next";
import { PageHeroBand } from "@/components/v3/page-hero-band";
import { ContactRow } from "@/components/v3/contact-row";
import { RuleStrong } from "@/components/editorial/rule-strong";

export const revalidate = 1800;

const DESCRIPTION =
  "Get in touch with Monty Singer: email, X, LinkedIn, and the Monty Monthly newsletter.";

export const metadata: Metadata = {
  title: "Contact",
  description: DESCRIPTION,
  alternates: { canonical: "/contact" },
  openGraph: {
    title: "Contact",
    description: DESCRIPTION,
    url: "/contact",
    type: "website",
  },
};

/** The four ways to reach Monty. Handles + hrefs mirror the footer's
 *  "Elsewhere" list (src/components/layout/site-footer.tsx). Only Email is
 *  in-place (mailto:); the rest open off-site in a new tab. */
const LINKS = [
  {
    numeral: "01",
    title: "Email",
    href: "mailto:monty@prometheus.today",
    handle: "monty@prometheus.today",
    action: "Say hi",
    external: false,
  },
  {
    numeral: "02",
    title: "X / Twitter",
    href: "https://x.com/themontysinger",
    handle: "@themontysinger",
    action: "Follow",
    external: true,
  },
  {
    numeral: "03",
    title: "LinkedIn",
    href: "https://linkedin.com/in/monty-singer",
    handle: "/in/monty-singer",
    action: "Connect",
    external: true,
  },
  {
    numeral: "04",
    title: "Monty Monthly",
    href: "https://montymonthly.substack.com",
    handle: "montymonthly.substack.com",
    action: "Subscribe",
    external: true,
  },
] as const;

/**
 * /contact -- dedicated contact route.
 *
 * Layout mirrors the /building convention:
 *   1. PageHeroBand (v3) -- full-bleed vermilion band.
 *   2. Big brutalist link rows (ContactRow) -- numeral | title + reveal-arrow +
 *      handle | action word, hover-invert to ink. External links open in a new
 *      tab; Email is a mailto:.
 *   3. <RuleStrong />
 *
 * Server component. Brand rules: pure black/white, no hue anywhere, no gradients, no em dashes.
 */
export default function ContactPage() {
  return (
    <>
      <PageHeroBand title="Contact" crumb="Home / Contact" />

      <section className="px-6 md:px-40 pt-10 pb-2 md:pt-14">
        <div className="max-w-[62ch] space-y-5 font-sans text-base leading-[1.6] text-text-dim">
          <p>I answer email from people who are building something.</p>
          <p>
            Tell me what you are working on and where it is stuck. That is
            the whole filter. No warm intro, no deck, and no need for a
            quick call to align first.
          </p>
          <p>
            Cold pitches and SEO offers go unanswered, and I have made peace
            with that.
          </p>
        </div>
      </section>

      <section className="px-6 md:px-40">
        <div className="-mx-[18px]">
          {LINKS.map((link, i) => (
            <ContactRow
              key={link.numeral}
              numeral={link.numeral}
              title={link.title}
              href={link.href}
              handle={link.handle}
              action={link.action}
              external={link.external}
              accentIndex={i}
            />
          ))}
        </div>
      </section>

      <RuleStrong />
    </>
  );
}
