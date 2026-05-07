import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "images.unsplash.com",
      },
      {
        protocol: "https",
        hostname: "plus.unsplash.com",
      },
    ],
  },
  allowedDevOrigins: [
    "*.ngrok.io",
    "*.ngrok-free.app",
    "192.168.0.113",
    "192.168.1.*",
    "192.168.*.*",
  ],
};

export default nextConfig;
