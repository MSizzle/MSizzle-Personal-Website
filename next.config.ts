import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  async redirects() {
    return [
      { source: '/uses', destination: '/about', permanent: true },
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
    ],
  },
};

export default nextConfig;
