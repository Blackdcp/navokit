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
        source: '/assets/video/:year/:month/:day/:filename',
        destination: 'https://platform-outputs.agnes-ai.space/videos/agnes-video-v2.0/:year/:month/:day/:filename',
      },
    ];
  },
};

export default nextConfig;