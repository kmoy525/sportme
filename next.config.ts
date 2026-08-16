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
};

export default nextConfig;
