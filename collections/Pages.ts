import type { CollectionConfig } from 'payload'
import { allBlocks } from '../blocks'
import { brandField } from '../fields/brandField'
import { seoGroup } from '../fields/seoGroup'
import { revalidatePageHook, revalidatePageDelete } from '../hooks/revalidate'
import { uniqueSlugPerBrand, formatSlug } from '../hooks/uniqueSlugPerBrand'

export const Pages: CollectionConfig = {
  slug: 'pages',
  hooks: {
    afterChange: [revalidatePageHook],
    afterDelete: [revalidatePageDelete],
  },
  admin: {
    useAsTitle: 'title',
    defaultColumns: ['title', 'slug', 'brand', 'status', 'updatedAt'],
    livePreview: {
      url: ({ data, req }) => {
        const brand = Array.isArray(data?.brand) && data.brand.includes('practice')
          ? 'practice'
          : 'personal'
        const base = process.env.NEXT_PUBLIC_SERVER_URL || 'http://localhost:3000'
        const slug = data?.slug === 'home' ? '' : data?.slug || ''
        return `${base}/${slug}?brand=${brand}&preview=true`
      },
    },
  },
  access: {
    read: ({ req: { user } }) => {
      if (user) return true
      // Public: only published pages visible
      return {
        status: { equals: 'published' },
      }
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
      // NOTE: intentionally NOT `unique: true`. This is a multi-tenant codebase
      // (personal + practice sites share one DB), so the same slug must be
      // allowed once per brand. Per-brand uniqueness is enforced in `validate`.
      index: true,
      hooks: {
        beforeValidate: [formatSlug],
      },
      validate: uniqueSlugPerBrand,
      admin: {
        description:
          'URL path (e.g. "home", "about", "for-investors"). Use "home" for the homepage. Must be unique per site.',
      },
    },
    brandField(),
    {
      name: 'status',
      type: 'select',
      defaultValue: 'draft',
      required: true,
      options: [
        { label: 'Draft', value: 'draft' },
        { label: 'Published', value: 'published' },
      ],
      admin: { position: 'sidebar' },
    },
    {
      name: 'nav',
      type: 'group',
      admin: {
        position: 'sidebar',
        description: 'Controls whether this page appears in the main nav.',
      },
      fields: [
        {
          name: 'showInNav',
          type: 'checkbox',
          defaultValue: false,
        },
        {
          name: 'label',
          type: 'text',
          admin: {
            description: 'Override the page title in nav. Leave empty to use title.',
            condition: (_, siblingData) => Boolean(siblingData?.showInNav),
          },
        },
        {
          name: 'order',
          type: 'number',
          defaultValue: 100,
          admin: {
            condition: (_, siblingData) => Boolean(siblingData?.showInNav),
          },
        },
      ],
    },
    seoGroup(),
    {
      name: 'blocks',
      type: 'blocks',
      blocks: allBlocks,
      admin: {
        description:
          'The page builder. Click "+ Add Block" to drop modules onto the page. Drag to reorder.',
      },
    },
    {
      name: 'publishedAt',
      type: 'date',
      admin: { position: 'sidebar' },
    },
  ],
}
