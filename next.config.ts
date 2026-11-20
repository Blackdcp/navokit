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
      {
        source: '/:lang(en|zh)/blog/ai-video-character-consistency',
        destination: '/:lang/blog/ai-video-consistent-characters',
        permanent: true,
      },
      {
        source: '/:lang(en|zh)/blog/ai-video-foley-sound-design-dynamics',
        destination: '/:lang/blog/ai-video-sound-design-audio-sync-foley',
        permanent: true,
      },
      {
        source: '/:lang(en|zh)/blog/github-readme-visual-facade-design',
        destination: '/:lang/blog/github-readme-visual-structure',
        permanent: true,
      },
      {
        source: '/:lang(en|zh)/blog/long-context-window-illusion',
        destination: '/:lang/blog/lost-in-the-middle-long-context-u-shaped-attention',
        permanent: true,
      },
      {
        source: '/:lang(en|zh)/blog/lost-in-the-middle-long-context-illusion',
        destination: '/:lang/blog/lost-in-the-middle-long-context-u-shaped-attention',
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
