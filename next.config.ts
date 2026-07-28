import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Next.js bundles `next-polyfill-module` unconditionally, ignoring browserslist
  // (vercel/next.js#86785, discussion #64330). The Next client imports it via
  // a relative path (`../build/polyfills/polyfill-module`), so alias both the
  // relative form AND the package form to a noop. Our browserslist already
  // targets Chrome 100+/Safari 15.4+ which support Array.prototype.at,
  // Object.hasOwn, String.prototype.trim{Start,End}, etc. natively.
  turbopack: {
    resolveAlias: {
      "../build/polyfills/polyfill-module": "./src/lib/noop-polyfill.js",
      "next/dist/build/polyfills/polyfill-module": "./src/lib/noop-polyfill.js",
    },
  },
  async redirects() {
    return [
      { source: '/blog', destination: '/writing', permanent: true },
      { source: '/events', destination: '/', permanent: true },
      { source: '/photos', destination: '/', permanent: true },
      { source: '/links', destination: '/', permanent: true },
      { source: '/about', destination: '/', permanent: true },
      { source: '/newsletter', destination: '/writing', permanent: true },
      { source: '/watching', destination: '/#loves', permanent: true }, // '/uses' was deleted; the Things I Love section is the successor content (quick task 260726-kjp)
      { source: '/uses', destination: '/#loves', permanent: true }, // /uses itself still 404'd and sat in Google's index as a Not-found (quick task 260728-fri)
      { source: '/portfolio', destination: '/building', permanent: true },
      { source: '/projects', destination: '/building', permanent: true },
      { source: '/projects/:slug', destination: '/building/:slug', permanent: true },
    ]
  },
  images: {
    localPatterns: [
      {
        pathname: "/**",
      },
    ],
    remotePatterns: [
      {
        protocol: "https",
        hostname: "prod-files-secure.s3.us-east-1.amazonaws.com",
      },
      {
        protocol: "https",
        hostname: "www.notion.so",
      },
      {
        protocol: "https",
        hostname: "images.unsplash.com",
      },
      {
        protocol: "https",
        hostname: "substackcdn.com",
      },
      {
        protocol: "https",
        hostname: "substack-post-media.s3.amazonaws.com",
      },
      {
        protocol: "https",
        hostname: "*.substackcdn.com",
      },
      {
        protocol: "https",
        hostname: "img.youtube.com",
      },
    ],
  },
};

export default nextConfig;
