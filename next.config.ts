import type { NextConfig } from "next";

const assetVersion =
  process.env.VERCEL_GIT_COMMIT_SHA ??
  process.env.VERCEL_DEPLOYMENT_ID ??
  `local-${Date.now()}`;

const nextConfig: NextConfig = {
  env: {
    NEXT_PUBLIC_ASSET_VERSION: assetVersion,
  },
  images: {
    minimumCacheTTL: 60,
    localPatterns: [{ pathname: "/**" }],
  },
  turbopack: {
    root: process.cwd(),
  },
};

export default nextConfig;
