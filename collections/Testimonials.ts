import type { CollectionConfig } from 'payload'

export const Testimonials: CollectionConfig = {
  slug: 'testimonials',
  admin: {
    useAsTitle: 'name',
    defaultColumns: ['name', 'company', 'updatedAt'],
  },
  access: { read: () => true },
  fields: [
    { name: 'name', type: 'text', required: true },
    { name: 'title', type: 'text', admin: { description: 'e.g. "Co-founder, Baserate"' } },
    { name: 'company', type: 'text' },
    {
      name: 'headshot',
      type: 'upload',
      relationTo: 'media',
      admin: { description: 'Optional small photo (160×160 minimum).' },
    },
    {
      name: 'quote',
      type: 'textarea',
      required: true,
      admin: { description: '2–3 sentences max. Keep it specific.' },
    },
    {
      name: 'project',
      type: 'relationship',
      relationTo: 'case-studies',
      admin: { description: 'Optionally link to the case study this is about.' },
    },
  ],
}
