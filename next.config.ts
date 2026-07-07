import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  allowedDevOrigins: ["bold-chow-mainly.ngrok-free.app"],
  trailingSlash: false,
  images: {
    remotePatterns: [{ protocol: "https", hostname: "**" }],
  },
};

export default nextConfig;
