import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: "standalone",
  // Allow ngrok / tunnel domains to load dev assets (/_next/*) without 403
  allowedDevOrigins: [
    "*.ngrok-free.dev",
    "*.ngrok-free.app",
    "*.ngrok.io",
    "*.ngrok.app",
  ],
};

export default nextConfig;
