import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  experimental: {
    serverActions: {
      // Increase Server Actions body size limit to 5 MB (adjust if needed)
      bodySizeLimit: 5 * 1024 * 1024,
    },
  },
};

export default nextConfig;
