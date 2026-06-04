import type { CollectionConfig } from 'payload'

export const Logos: CollectionConfig = {
  slug: 'logos',
  admin: {
    useAsTitle: 'name',
    defaultColumns: ['name', 'industry', 'updatedAt'],
    description:
      'Reusable client/brand logos. Used in LogoWall and LifecycleSection blocks.',
  },
  access: { read: () => true },
  fields: [
    { name: 'name', type: 'text', required: true },
    {
      name: 'image',
      type: 'upload',
      relationTo: 'media',
      required: true,
      admin: { description: 'SVG preferred. Falls back to PNG.' },
    },
    {
      name: 'imageDark',
      type: 'upload',
      relationTo: 'media',
      admin: { description: 'Optional dark-theme variant.' },
    },
    {
      name: 'link',
      type: 'text',
      admin: { description: 'Optional URL the logo links to.' },
    },
    {
      name: 'industry',
      type: 'select',
      hasMany: false,
      options: [
        { label: 'Consumer', value: 'consumer' },
        { label: 'Fintech / Investor', value: 'fintech' },
        { label: 'Enterprise', value: 'enterprise' },
        { label: 'B2B SaaS', value: 'b2b' },
        { label: 'Agency', value: 'agency' },
        { label: 'Startup', value: 'startup' },
      ],
    },
  ],
}
