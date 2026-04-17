import type { Metadata } from "next";
import { Inter, Geist_Mono } from "next/font/google";
import { ThemeProvider } from "@/components/providers/theme-provider";
import { LenisProvider } from "@/components/providers/lenis-provider";
import { MotionProvider } from "@/components/providers/motion-provider";
import { Navigation } from "@/components/nav/navigation";
import { Footer } from "@/components/footer";
import { UmamiAnalytics } from "@/components/analytics/umami-analytics";
import { VisitSurvey } from "@/components/visit-survey";
import { SITE_URL } from "@/lib/seo/site";
import "./globals.css";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  weight: ["400", "700"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const SITE_DESCRIPTION =
  "Monty Singer is the founder of Prometheus, an AI integrations and education company. Builder, writer, and perpetual tinkerer.";
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
      className={`${inter.variable} ${geistMono.variable}`}
      suppressHydrationWarning
    >
      <body className="min-h-screen bg-background text-foreground antialiased">
        <ThemeProvider>
          <LenisProvider>
            <MotionProvider>
              <Navigation />
              <main className="pt-16">{children}</main>
              <Footer />
            </MotionProvider>
          </LenisProvider>
        </ThemeProvider>
        <UmamiAnalytics />
        <VisitSurvey />
        <span className="fixed right-3 bottom-3 z-50 text-xs opacity-20 select-none">
          Prometheus
        </span>
      </body>
    </html>
  );
}
