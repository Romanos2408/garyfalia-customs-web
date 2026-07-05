import type { NextConfig } from "next";

/**
 * DEPLOY_TARGET=pages → static export for the GitHub Pages preview
 * (served under /garyfalia-customs-web, no server: CI strips src/app/api).
 * Default (dev / Vercel) is untouched: server build, no base path.
 */
const isPages = process.env.DEPLOY_TARGET === "pages";
const basePath = isPages ? "/garyfalia-customs-web" : "";

const nextConfig: NextConfig = {
  ...(isPages
    ? {
        output: "export" as const,
        basePath,
        images: { unoptimized: true },
      }
    : {}),
  env: {
    NEXT_PUBLIC_BASE_PATH: basePath,
  },
};

export default nextConfig;
