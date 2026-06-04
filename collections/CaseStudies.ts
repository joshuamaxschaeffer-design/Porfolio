import type { CollectionConfig } from 'payload'
import { allBlocks } from '../blocks'
import { brandField } from '../fields/brandField'
import { seoGroup } from '../fields/seoGroup'
import { revalidateCaseStudyHook, revalidateCaseStudyDelete } from '../hooks/revalidate'
import { uniqueSlugPerBrand, formatSlug } from '../hooks/uniqueSlugPerBrand'

export const CaseStudies: CollectionConfig = {
  slug: 'case-studies',
  labels: {
    singular: 'Case Study',
    plural: 'Case Studies',
  },
  hooks: {
    afterChange: [revalidateCaseStudyHook],
    afterDelete: [revalidateCaseStudyDelete],
  },
  admin: {
    useAsTitle: 'title',
    defaultColumns: ['title', 'client', 'role', 'featured', 'status', 'updatedAt'],
    livePreview: {
      url: ({ data }) => {
        const brand = Array.isArray(data?.brand) && data.brand.includes('practice')
          ? 'practice'
          : 'personal'
        const base = process.env.NEXT_PUBLIC_SERVER_URL || 'http://localhost:3000'
        return `${base}/work/${data?.slug || ''}?brand=${brand}&preview=true`
      },
    },
  },
  access: {
    read: ({ req: { user } }) => {
      if (user) return true
      return { status: { equals: 'published' } }
    },
  },
  fields: [
    {
      name: 'title',
      type: 'text',
      required: true,
    },
    {
      name: 'slug',
      type: 'text',
      required: true,
      // Not `unique: true` — see Pages.ts. Uniqueness is scoped per-brand.
      index: true,
      hooks: {
        beforeValidate: [formatSlug],
      },
      validate: uniqueSlugPerBrand,
      admin: { description: 'URL slug (e.g. "panda-express", "baserate"). Unique per site.' },
    },
    brandField(),
    {
      name: 'status',
      type: 'select',
      defaultValue: 'draft',
      options: [
        { label: 'Draft', value: 'draft' },
        { label: 'Published', value: 'published' },
      ],
      admin: { position: 'sidebar' },
    },
    {
      name: 'featured',
      type: 'checkbox',
      defaultValue: false,
      admin: {
        position: 'sidebar',
        description: 'Show in FeaturedWork blocks.',
      },
    },
    {
      type: 'tabs',
      tabs: [
        {
          label: 'Header',
          fields: [
            {
              name: 'client',
              type: 'text',
              required: true,
              admin: { description: 'e.g. "Panda Express", "Baserate"' },
            },
            {
              name: 'role',
              type: 'text',
              required: true,
              admin: { description: 'e.g. "Lead Product Designer", "Art Director"' },
            },
            {
              name: 'dates',
              type: 'group',
              fields: [
                { name: 'start', type: 'text', admin: { description: 'e.g. "2022"' } },
                { name: 'end', type: 'text', admin: { description: 'e.g. "2024" or "Present"' } },
              ],
            },
            {
              name: 'oneLineOutcome',
              type: 'textarea',
              required: true,
              admin: {
                description:
                  'One sentence describing the outcome. Used in tiles and previews.',
              },
            },
            {
              name: 'heroImage',
              type: 'upload',
              relationTo: 'media',
              required: false,
            },
            {
              name: 'heroVideo',
              type: 'upload',
              relationTo: 'media',
              required: false,
              admin: { description: 'Optional looping hero video.' },
            },
          ],
        },
        {
          label: 'Metrics',
          fields: [
            {
              name: 'metrics',
              type: 'array',
              labels: { singular: 'Metric', plural: 'Metrics' },
              admin: {
                description: 'Up to 4 metrics for the case study header.',
              },
              maxRows: 4,
              fields: [
                { name: 'value', type: 'text', required: true, admin: { description: 'e.g. "4.8★", "+38%"' } },
                { name: 'label', type: 'text', required: true, admin: { description: 'e.g. "App Store rating"' } },
                { name: 'description', type: 'text', admin: { description: 'Optional explanatory text' } },
              ],
            },
          ],
        },
        {
          label: 'Testimonial',
          fields: [
            {
              name: 'testimonial',
              type: 'relationship',
              relationTo: 'testimonials',
              hasMany: false,
            },
          ],
        },
        {
          label: 'Tags',
          fields: [
            {
              name: 'tags',
              type: 'relationship',
              relationTo: 'tags',
              hasMany: true,
            },
          ],
        },
        {
          label: 'Body',
          fields: [
            {
              name: 'blocks',
              type: 'blocks',
              blocks: allBlocks,
              admin: {
                description:
                  'The case study body. Drop in blocks: TextSection, ImageGrid, Quote, etc.',
              },
            },
          ],
        },
        {
          label: 'SEO',
          fields: [seoGroup()],
        },
      ],
    },
    {
      name: 'publishedAt',
      type: 'date',
      admin: { position: 'sidebar' },
    },
  ],
}
