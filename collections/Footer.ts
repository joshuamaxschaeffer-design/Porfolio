import type { CollectionConfig } from 'payload'
import { revalidateGlobalHook } from '../hooks/revalidate'

export const Footer: CollectionConfig = {
  slug: 'footer',
  labels: {
    singular: 'Footer (per brand)',
    plural: 'Footer',
  },
  hooks: { afterChange: [revalidateGlobalHook] },
  admin: {
    useAsTitle: 'brand',
    description: 'Footer content. One entry per brand.',
  },
  access: { read: () => true },
  fields: [
    {
      name: 'brand',
      type: 'select',
      required: true,
      unique: true,
      options: [
        { label: 'Personal (schaeffer.design)', value: 'personal' },
        { label: 'Practice (schaefferpractice.com)', value: 'practice' },
      ],
    },
    {
      name: 'columns',
      type: 'array',
      labels: { singular: 'Column', plural: 'Columns' },
      maxRows: 4,
      fields: [
        { name: 'heading', type: 'text' },
        {
          name: 'items',
          type: 'array',
          fields: [
            { name: 'label', type: 'text', required: true },
            { name: 'url', type: 'text', required: true },
          ],
        },
      ],
    },
    {
      name: 'copyrightText',
      type: 'text',
      admin: { description: 'e.g. "© 2026 Joshua Schaeffer."' },
    },
  ],
}
