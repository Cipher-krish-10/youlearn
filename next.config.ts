import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactStrictMode: true,
  images: {
    remotePatterns: [
      // YouTube thumbnails
      { protocol: "https", hostname: "i.ytimg.com" },
      { protocol: "https", hostname: "img.youtube.com" },
      // Supabase storage (avatars, etc.)
      { protocol: "https", hostname: "*.supabase.co" },
    ],
  },
  experimental: {
    // Keep heavy server-only packages out of the client bundle.
    serverActions: {
      bodySizeLimit: "2mb",
    },
  },
};

export default nextConfig;
