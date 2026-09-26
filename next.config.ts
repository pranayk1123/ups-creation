import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "**", // He sagle baherche HTTPS links allow karel
      },
    ],
  },
};

export default nextConfig;