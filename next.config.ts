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
      // Redirect unlocalized public URLs (e.g., external links missing /en prefix) cleanly to /en
      {
        source: '/tools',
        destination: '/en/tools',
        permanent: true,
      },
      {
        source: '/tools/:path*',
        destination: '/en/tools/:path*',
        permanent: true,
      },
      {
        source: '/compare',
        destination: '/en/compare',
        permanent: true,
      },
      {
        source: '/compare/:path*',
        destination: '/en/compare/:path*',
        permanent: true,
      },
      {
        source: '/alternatives/:slug([^.]+)',
        destination: '/en/alternatives/:slug',
        permanent: true,
      },
      {
        source: '/categories/:id([^.]+)',
        destination: '/en/categories/:id',
        permanent: true,
      },
      {
        source: '/blog',
        destination: '/en/blog',
        permanent: true,
      },
      {
        source: '/blog/:slug([^.]+)',
        destination: '/en/blog/:slug',
        permanent: true,
      },
      {
        source: '/topics',
        destination: '/en/topics',
        permanent: true,
      },
      {
        source: '/topics/:id([^.]+)',
        destination: '/en/topics/:id',
        permanent: true,
      },
      {
        source: '/updates',
        destination: '/en/updates',
        permanent: true,
      },
      {
        source: '/about',
        destination: '/en/about',
        permanent: true,
      },
      {
        source: '/submit',
        destination: '/en/submit',
        permanent: true,
      },
      {
        source: '/contact',
        destination: '/en/contact',
        permanent: true,
      },
      {
        source: '/editorial-policy',
        destination: '/en/editorial-policy',
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
