import type { Metadata } from "next";
import { Inter, Geist_Mono } from "next/font/google";
import { ThemeProvider } from "@/components/providers/theme-provider";
import { LenisProvider } from "@/components/providers/lenis-provider";
import { MotionProvider } from "@/components/providers/motion-provider";
import { Navigation } from "@/components/nav/navigation";
import { Footer } from "@/components/footer";
import { UmamiAnalytics } from "@/components/analytics/umami-analytics";
import { VisitSurvey } from "@/components/visit-survey";
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

export const metadata: Metadata = {
  title: "Monty Singer",
  description: "Portfolio, blog, and personal site of Monty Singer.",
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
              <main>{children}</main>
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
