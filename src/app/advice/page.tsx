import type { Metadata } from "next";
import { AdviceForm } from "@/components/advice/advice-form";

const DESCRIPTION =
  "Tell Monty Singer something anonymously: advice, a question, a correction. No account, no IP logged.";

export const metadata: Metadata = {
  title: "Unsolicited advice",
  description: DESCRIPTION,
  alternates: { canonical: "/advice" },
  openGraph: {
    title: "Unsolicited advice",
    description: DESCRIPTION,
    url: "/advice",
    type: "website",
  },
};

export default function AdvicePage() {
  return <AdviceForm />;
}
