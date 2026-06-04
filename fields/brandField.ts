import type { Field } from 'payload'

/**
 * Shared brand field: multi-select for ["personal", "practice"].
 * Controls which sites a document appears on.
 */
export function brandField(): Field {
  return {
    name: 'brand',
    type: 'select',
    hasMany: true,
    required: true,
    defaultValue: ['personal'],
    options: [
      { label: 'Personal (schaeffer.design)', value: 'personal' },
      { label: 'Practice (schaefferpractice.com)', value: 'practice' },
    ],
    admin: {
      position: 'sidebar',
      description:
        'Which sites show this document. Most case studies should be on both.',
    },
  }
}
