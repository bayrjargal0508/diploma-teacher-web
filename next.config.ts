import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: 'standalone',
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "cdn.yesh.mn", // <-- replace with your image host
        port: "", // usually leave empty
        pathname: "/**", // allow all image paths
      },
    ],
  },
};

export default nextConfig;
