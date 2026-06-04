import type { Field } from 'payload'

export function seoGroup(): Field {
  return {
    name: 'seo',
    type: 'group',
    admin: {
      description: 'Optional. Falls back to the page title and a default OG image.',
    },
    fields: [
      {
        name: 'title',
        type: 'text',
        admin: { description: 'Browser tab + search result title.' },
      },
      {
        name: 'description',
        type: 'textarea',
        admin: { description: 'Meta description for search results.' },
      },
      {
        name: 'ogImage',
        type: 'upload',
        relationTo: 'media',
        admin: { description: 'Open Graph / social share image. 1200×630 recommended.' },
      },
    ],
  }
}
