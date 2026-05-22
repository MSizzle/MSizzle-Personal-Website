/**
 * Substack-outbound subscribe CTA — D-15 REVISED.
 *
 * Extracted from `src/app/writing/page.tsx` (Path 2) into its own component so
 * `/writing` keeps this section above the global InkFooter, while no other
 * route inherits it. A styled anchor to the same endpoint /newsletter uses
 * (verified at src/app/newsletter/page.tsx:39). NOT a markup form, NO email
 * field, NO in-house subscribe endpoint — the Substack outbound IS the pipeline.
 *
 * Server Component — pure markup, no client hooks. Renders inline on /writing
 * just before the global InkFooter (rendered by `src/app/layout.tsx`).
 */
export function WritingSubscribeCTA() {
  return (
    <footer className="bg-footer-bg text-footer-fg px-7 py-12 md:px-40 md:py-16">
      <div className="text-label uppercase text-footer-mute">── End of archive</div>
      <h2 className="mt-6 max-w-[40rem] text-section-feature text-footer-fg">
        Receive new essays the morning they&rsquo;re published.
      </h2>
      <p className="mt-6 max-w-[34rem] text-body-lead text-footer-mute">
        Monty Monthly is a long-form newsletter on Substack. No spam, no firehose — just one essay each month.
      </p>
      <div className="mt-10">
        <a
          href="https://montymonthly.substack.com"
          target="_blank"
          rel="noopener noreferrer"
          className="inline-block border border-footer-fg/40 px-7 py-3 text-label uppercase text-footer-fg transition-opacity hover:opacity-80"
        >
          Subscribe on Substack →
        </a>
      </div>
      <div className="mt-16 text-meta uppercase text-footer-mute">
        © 2026 Monty Singer · montymonthly.substack.com
      </div>
    </footer>
  );
}
