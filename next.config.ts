import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  devIndicators: false,
  async redirects() {
    return [
      {
        source: '/:lang(en|zh)/tools/ai-video-generator',
        destination: '/:lang/tools/free-ai-video-generator',
        permanent: true,
      },
      {
        source: '/:lang(en|zh)/tools/chat-exporter',
        destination: '/:lang/tools/markdown-to-image',
        permanent: true,
      },
      {
        source: '/:lang(en|zh)/tools/social-booster',
        destination: '/:lang/tools/ai-social-booster',
        permanent: true,
      },
      {
        source: '/:lang(en|zh)/blog/how-to-write-viral-social-media-posts-with-ai',
        destination: '/:lang/blog/how-to-draft-social-posts-with-ai',
        permanent: true,
      },
    ];
  },
  async rewrites() {
    return [
      {
        source: '/assets/video/:year/:month/:day/:filename',
        destination: 'https://platform-outputs.agnes-ai.space/videos/agnes-video-v2.0/:year/:month/:day/:filename',
      },
    ];
  },
};

export default nextConfig;
