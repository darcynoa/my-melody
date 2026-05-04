import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  output: "export",
  images: {
    unoptimized: true, // Required because Next.js Image Optimization needs a Node server
  },
};

export default nextConfig;
