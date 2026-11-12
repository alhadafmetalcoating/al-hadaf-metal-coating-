import { legacyRedirects } from "./src/lib/published.js";

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    unoptimized: true,
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
  async redirects() {
    return legacyRedirects().map((item) => ({
      source: item.source,
      destination: item.destination,
      permanent: true,
    }));
  },
};

export default nextConfig;
