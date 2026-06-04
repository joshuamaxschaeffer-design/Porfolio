import type { Block } from 'payload'

export const FeaturedWork: Block = {
  slug: 'featuredWork',
  labels: { singular: 'Featured Work', plural: 'Featured Work' },
  fields: [
    {
      name: 'caseStudies',
      type: 'relationship',
      relationTo: 'case-studies',
      hasMany: true,
      required: true,
      maxRows: 3,
      admin: {
        description:
          'Pick 1–3 case studies for the flagship featured block. Order matters.',
      },
    },
    {
      name: 'layout',
      type: 'select',
      defaultValue: 'two',
      options: [
        { label: 'Single (one large card)', value: 'single' },
        { label: 'Two side-by-side', value: 'two' },
        { label: 'Three in a row', value: 'three' },
      ],
    },
  ],
}
