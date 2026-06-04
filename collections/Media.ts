import type { CollectionConfig } from 'payload'

export const Media: CollectionConfig = {
  slug: 'media',
  access: {
    read: () => true,
  },
  admin: {
    description: 'Images, video, and PDFs. Backed by Vercel Blob storage.',
  },
  fields: [
    {
      name: 'alt',
      type: 'text',
      required: false,
      admin: {
        description: 'Describe the image for accessibility and SEO.',
      },
    },
    {
      name: 'caption',
      type: 'text',
      required: false,
    },
  ],
  upload: {
    mimeTypes: ['image/*', 'video/*', 'application/pdf'],
    imageSizes: [
      { name: 'thumbnail', width: 400, height: undefined, position: 'centre' },
      { name: 'card', width: 768, height: undefined, position: 'centre' },
      { name: 'feature', width: 1280, height: undefined, position: 'centre' },
      { name: 'hero', width: 1920, height: undefined, position: 'centre' },
    ],
    focalPoint: true,
  },
}
