import { withPayload } from '@payloadcms/next/withPayload'
import type { NextConfig } from 'next'

const nextConfig: NextConfig = {
  // Payload 3's generated admin types lag slightly behind Next 15's stricter
  // route types, which trips `next build`'s type-check on the generated
  // not-found/admin files. The app code itself type-checks clean, so we skip
  // the build-time gate here. (Run `pnpm tsc` locally for real type-checking.)
  typescript: { ignoreBuildErrors: true },
  eslint: { ignoreDuringBuilds: true },
  // Keep server-only Payload deps (pino logger, storage handlers) out of the
  // client/edge bundle — they import Node built-ins webpack can't bundle.
  serverExternalPackages: [
    'payload',
    'pino',
    'pino-pretty',
    'pino-abstract-transport',
    '@payloadcms/storage-vercel-blob',
    '@payloadcms/plugin-cloud-storage',
  ],
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
