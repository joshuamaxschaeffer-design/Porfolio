import type { Block } from 'payload'
import { lexicalEditor } from '@payloadcms/richtext-lexical'

export const TextSection: Block = {
  slug: 'textSection',
  labels: { singular: 'Text Section', plural: 'Text Sections' },
  fields: [
    { name: 'eyebrow', type: 'text' },
    { name: 'heading', type: 'text' },
    { name: 'body', type: 'richText', editor: lexicalEditor({}) },
    {
      name: 'width',
      type: 'select',
      defaultValue: 'narrow',
      options: [
        { label: 'Narrow (prose width)', value: 'narrow' },
        { label: 'Wide', value: 'wide' },
        { label: 'Full', value: 'full' },
      ],
    },
  ],
}
