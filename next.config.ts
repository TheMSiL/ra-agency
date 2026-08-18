import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // scripts/deploy.sh builds into a scratch directory while the live server keeps
  // serving from .next, so a failed build never takes the site down.
  distDir: process.env.NEXT_DIST_DIR || ".next",
  // The VPS builds while the old server is still running and holding its own
  // RAM, which leaves the build worker little headroom — it was SIGKILLed by the
  // OOM killer. This trades a slightly slower compile for a lower peak.
  experimental: {
    webpackMemoryOptimizations: true,
    // 1.9 GB of RAM on the VPS, and the old server keeps running through the
    // build. Sizing the worker pool by free memory rather than by CPU count
    // stops page generation from fanning out wider than the box can hold.
    memoryBasedWorkersCount: true,
  },
  images: {
    remotePatterns: [{ protocol: "https", hostname: "cdn.sanity.io" }],
    // Next 16 only serves qualities listed here, and defaults to [75]. Editorial
    // cover art is dark gradient artwork, which bands visibly when re-encoded at
    // 75 — blog imagery opts into 90 instead.
    qualities: [75, 90],
  },
};

export default nextConfig;
