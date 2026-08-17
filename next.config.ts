import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // scripts/deploy.sh builds into a scratch directory while the live server keeps
  // serving from .next, so a failed build never takes the site down.
  distDir: process.env.NEXT_DIST_DIR || ".next",
  images: {
    remotePatterns: [{ protocol: "https", hostname: "cdn.sanity.io" }],
    // Next 16 only serves qualities listed here, and defaults to [75]. Editorial
    // cover art is dark gradient artwork, which bands visibly when re-encoded at
    // 75 — blog imagery opts into 90 instead.
    qualities: [75, 90],
  },
};

export default nextConfig;
