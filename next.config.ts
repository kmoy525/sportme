import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // pg's optional native binding isn't installed (we use the pure-JS driver
  // via @prisma/adapter-pg); this keeps webpack from bundling around it.
  serverExternalPackages: ["pg"],
  experimental: {
    serverActions: {
      // Server Actions default to a 1MB body limit, well under our own
      // 6MB photo-size check in photo.ts — real phone photos routinely
      // exceed 1MB, so uploads failed before our validation even ran.
      // Set comfortably above 6MB so oversized files hit our own friendly
      // "over 6 MB" message instead of a framework-level crash.
      bodySizeLimit: "10mb",
    },
  },
  env: {
    // Vercel doesn't expose its system env vars to the client by default —
    // re-export as NEXT_PUBLIC_ so src/lib/invite.ts can build a correct
    // share link without every environment needing NEXT_PUBLIC_APP_URL set
    // by hand. VERCEL_PROJECT_PRODUCTION_URL is the assigned production
    // domain (e.g. sportme-social.vercel.app); VERCEL_URL is that specific
    // deployment's own unique hash URL, only right as a preview fallback.
    NEXT_PUBLIC_VERCEL_PROJECT_PRODUCTION_URL: process.env.VERCEL_PROJECT_PRODUCTION_URL,
    NEXT_PUBLIC_VERCEL_URL: process.env.VERCEL_URL,
  },
};

export default nextConfig;
