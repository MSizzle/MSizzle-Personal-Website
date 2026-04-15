import Link from 'next/link'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Page Not Found | Monty Singer',
  description: 'The page you were looking for does not exist.',
  robots: { index: false, follow: false },
}

export default function NotFound() {
  return (
    <div className="mx-auto max-w-[66ch] px-6 pb-16 pt-32 md:px-0">
      <h1 className="text-2xl font-normal tracking-tight sm:text-3xl">404</h1>
      <p className="mt-4 text-lg opacity-80">
        This page does not exist, or it wandered off.
      </p>
      <p className="mt-6">
        <Link href="/" className="underline">Go home</Link>, or read the{' '}
        <Link href="/blog" className="underline">writings</Link>.
      </p>
    </div>
  )
}
