import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  devIndicators: false,
  async rewrites() {
    return [
      {
        source: '/api/:path*',
        destination: 'https://1key6868.com/api/:path*',
      },
      {
        source: '/assets/video/:path*',
        destination: 'https://platform-outputs.agnes-ai.space/videos/:path*',
      },
    ];
  },
};

export default nextConfig;