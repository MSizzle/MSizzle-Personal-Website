import { ContactRow } from "@/components/v3/contact-row";

export function SectionAdvice({ accentIndex }: { accentIndex: number }) {
  return (
    <section className="band py-20 md:py-28" id="advice">
      <div className="px-6 md:px-40">
        <div className="-mx-[18px]">
          <ContactRow
            title="Unsolicited advice"
            handle="Anonymous. No login. I read every one."
            action="Say it"
            href="/advice"
            external={false}
            accentIndex={accentIndex}
          />
        </div>
      </div>
    </section>
  );
}
