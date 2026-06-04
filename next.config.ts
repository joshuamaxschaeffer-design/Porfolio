import { withPayload } from '@payloadcms/next/withPayload'
import type { NextConfig } from 'next'

const nextConfig: NextConfig = {
  experimental: {
    // Enables the View Transitions API for smooth cross-route transitions.
    // Falls back gracefully in browsers that don't support it.
    viewTransition: true,
    // Prerender static pages even when there are server-only headers in use.
    ppr: false, // set to 'incremental' later if you want Partial Prerendering
    reactCompiler: false,
  },
  images: {
    remotePatterns: [
      { protocol: 'https', hostname: '*.public.blob.vercel-storage.com' },
    ],
    // Modern formats first
    formats: ['image/avif', 'image/webp'],
  },
  // Aggressive HTTP caching for static assets — Vercel adds these automatically too,
  // but explicit headers ensure consistency across hosts.
  async headers() {
    return [
      {
        source: '/_next/static/(.*)',
        headers: [{ key: 'Cache-Control', value: 'public, max-age=31536000, immutable' }],
      },
      {
        source: '/fonts/(.*)',
        headers: [{ key: 'Cache-Control', value: 'public, max-age=31536000, immutable' }],
      },
    ]
  },
}

export default withPayload(nextConfig)
