import type { Metadata } from "next";
import { Hanken_Grotesk, JetBrains_Mono } from "next/font/google";
import { LenisProvider } from "@/components/providers/lenis-provider";
import { MotionProvider } from "@/components/providers/motion-provider";
import { Navigation } from "@/components/nav/navigation";
import { SiteFooter } from "@/components/layout/site-footer";
import { MainOffset } from "@/components/main-offset";
import { UmamiAnalytics } from "@/components/analytics/umami-analytics";
import { VisitSurvey } from "@/components/visit-survey";
import { SITE_URL } from "@/lib/seo/site";
import "./globals.css";

// Hanken Grotesk: display + body font for photo-forward design (D-02).
// Weight 800 is the headline/sig weight used in hero and section headings.
const hanken = Hanken_Grotesk({
  variable: "--font-hanken",
  subsets: ["latin"],
  weight: ["400", "500", "700", "800"],
  display: "swap",
});

const jetbrainsMono = JetBrains_Mono({
  variable: "--font-jetbrains-mono",
  subsets: ["latin"],
  weight: ["400", "500", "700"],
  display: "swap",
});

const SITE_DESCRIPTION =
  "Monty Singer is the founder of Prometheus, an AI integrations and education company. Builder, writer, and doer.";
const SITE_TITLE = "Monty Singer | Founder of Prometheus, Builder, Writer";

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  verification: {
    google: "EV4m-VDmZ4Zqq2sjmhq9qW0OFkBWdMk6eXDAKXOQOcA",
  },
  title: {
    default: SITE_TITLE,
    template: "%s | Monty Singer",
  },
  description: SITE_DESCRIPTION,
  alternates: {
    canonical: "/",
    types: { "application/rss+xml": "/blog/feed.xml" },
  },
  openGraph: {
    type: "website",
    url: SITE_URL,
    siteName: "Monty Singer",
    title: SITE_TITLE,
    description: SITE_DESCRIPTION,
  },
  twitter: {
    card: "summary_large_image",
    title: SITE_TITLE,
    description: SITE_DESCRIPTION,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${hanken.variable} ${jetbrainsMono.variable}`}
      suppressHydrationWarning
    >
      <body className="min-h-screen bg-bg text-text antialiased">
        <LenisProvider>
          <MotionProvider>
            <Navigation />
            <MainOffset>{children}</MainOffset>
            <SiteFooter />
            <VisitSurvey />
          </MotionProvider>
        </LenisProvider>
        <UmamiAnalytics />
        <span aria-hidden="true" className="fixed right-3 bottom-3 z-50 text-xs opacity-20 select-none">
          Prometheus
        </span>
      </body>
    </html>
  );
}
