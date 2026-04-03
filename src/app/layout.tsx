import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { ThemeProvider } from "@/components/providers/theme-provider";
import { LenisProvider } from "@/components/providers/lenis-provider";
import { MotionProvider } from "@/components/providers/motion-provider";
import { Navigation } from "@/components/nav/navigation";
import { Footer } from "@/components/footer";
import { UmamiAnalytics } from "@/components/analytics/umami-analytics";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
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
      className={`${geistSans.variable} ${geistMono.variable}`}
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
      </body>
    </html>
  );
}
