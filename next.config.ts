import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    // Every screenshot is a local static import; no remote patterns needed.
    formats: ["image/avif", "image/webp"],
  },
};

export default nextConfig;
