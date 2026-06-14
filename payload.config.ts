import { buildConfig } from 'payload'
import { postgresAdapter } from '@payloadcms/db-postgres'
import { lexicalEditor } from '@payloadcms/richtext-lexical'
import { vercelBlobStorage } from '@payloadcms/storage-vercel-blob'
import sharp from 'sharp'
import path from 'path'
import { fileURLToPath } from 'url'

// Collections
import { Pages } from './collections/Pages'
import { CaseStudies } from './collections/CaseStudies'
import { Logos } from './collections/Logos'
import { Testimonials } from './collections/Testimonials'
import { Tags } from './collections/Tags'
import { Media } from './collections/Media'
import { Settings } from './collections/Settings'
import { Navigation } from './collections/Navigation'
import { Footer } from './collections/Footer'
import { Users } from './collections/Users'

const filename = fileURLToPath(import.meta.url)
const dirname = path.dirname(filename)

export default buildConfig({
  serverURL: process.env.NEXT_PUBLIC_SERVER_URL || 'http://localhost:3000',
  // Pass sharp so Payload can resize CMS-uploaded media (the build warned it
  // was installed but not wired into the config).
  sharp,
  admin: {
    user: Users.slug,
    meta: {
      titleSuffix: '— Schaeffer Portfolio',
    },
    livePreview: {
      breakpoints: [
        { label: 'Mobile', name: 'mobile', width: 375, height: 667 },
        { label: 'Tablet', name: 'tablet', width: 768, height: 1024 },
        { label: 'Desktop', name: 'desktop', width: 1440, height: 900 },
      ],
    },
  },
  editor: lexicalEditor({}),
  collections: [
    Users,
    Pages,
    CaseStudies,
    Logos,
    Testimonials,
    Tags,
    Media,
    Settings,
    Navigation,
    Footer,
  ],
  db: postgresAdapter({
    pool: {
      connectionString: process.env.DATABASE_URI || '',
      // Neon (free tier) autosuspends the compute after idle. The first request
      // after a sleep has to wait for the compute to wake, which can take a few
      // seconds. Give connections room to wait for that wake instead of throwing
      // a "Failed query" 500 the instant Neon is cold.
      connectionTimeoutMillis: 15000,
      // Keep sockets warm and recycle idle ones so we don't pile up dead
      // connections against a compute that just came back from suspend.
      keepAlive: true,
      idleTimeoutMillis: 30000,
      max: 10,
    },
  }),
  secret: process.env.PAYLOAD_SECRET || 'CHANGE-ME-IN-PRODUCTION',
  typescript: {
    outputFile: path.resolve(dirname, 'payload-types.ts'),
  },
  plugins: [
    vercelBlobStorage({
      collections: {
        media: true,
      },
      token: process.env.BLOB_READ_WRITE_TOKEN || '',
    }),
  ],
  // GraphQL is enabled by default at /api/graphql
})
