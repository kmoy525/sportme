import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // pg's optional native binding isn't installed (we use the pure-JS driver
  // via @prisma/adapter-pg); this keeps webpack from bundling around it.
  serverExternalPackages: ["pg"],
};

export default nextConfig;
