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
    href: "https://x.com/thefullmonty0",
    handle: "@thefullmonty0",
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
 * Server component. Brand rules: Vermilion accent, no gradients, no em dashes.
 */
export default function ContactPage() {
  return (
    <>
      <PageHeroBand
        title="Contact"
        crumb="Home / Contact"
        sub="Want to talk shop, trade ideas, or just say hello? Pick a line below and reach out."
      />

      <section className="px-6 md:px-40">
        <div className="-mx-[18px]">
          {LINKS.map((link) => (
            <ContactRow
              key={link.numeral}
              numeral={link.numeral}
              title={link.title}
              href={link.href}
              handle={link.handle}
              action={link.action}
              external={link.external}
            />
          ))}
        </div>
      </section>

      <RuleStrong />
    </>
  );
}
