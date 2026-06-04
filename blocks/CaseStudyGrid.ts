import type { Block } from 'payload'

export const CaseStudyGrid: Block = {
  slug: 'caseStudyGrid',
  labels: { singular: 'Case Study Grid', plural: 'Case Study Grids' },
  fields: [
    {
      name: 'caseStudies',
      type: 'relationship',
      relationTo: 'case-studies',
      hasMany: true,
      required: true,
      admin: { description: 'Grid of case study tiles. Pick 4–8.' },
    },
    {
      name: 'columns',
      type: 'select',
      defaultValue: '2',
      options: [
        { label: '2 columns', value: '2' },
        { label: '3 columns', value: '3' },
      ],
    },
  ],
}
