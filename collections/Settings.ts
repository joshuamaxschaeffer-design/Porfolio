import type { CollectionConfig } from 'payload'
import { revalidateGlobalHook } from '../hooks/revalidate'

export const Settings: CollectionConfig = {
  slug: 'settings',
  labels: {
    singular: 'Settings (per brand)',
    plural: 'Settings',
  },
  hooks: { afterChange: [revalidateGlobalHook] },
  admin: {
    useAsTitle: 'brand',
    description:
      'Per-brand site settings. Create one entry for "personal" and one for "practice".',
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
    { name: 'siteName', type: 'text', required: true },
    { name: 'tagline', type: 'text' },
    {
      name: 'defaultOGImage',
      type: 'upload',
      relationTo: 'media',
      admin: { description: 'Default social share image.' },
    },
    { name: 'contactEmail', type: 'email', required: true },
    { name: 'calLink', type: 'text', admin: { description: 'Cal.com / Calendly URL.' } },
    {
      name: 'socialLinks',
      type: 'array',
      fields: [
        {
          name: 'platform',
          type: 'select',
          options: [
            { label: 'LinkedIn', value: 'linkedin' },
            { label: 'Instagram', value: 'instagram' },
            { label: 'X / Twitter', value: 'x' },
            { label: 'Dribbble', value: 'dribbble' },
            { label: 'Read.cv', value: 'readcv' },
            { label: 'GitHub', value: 'github' },
          ],
        },
        { name: 'url', type: 'text' },
      ],
    },
    {
      name: 'footerCopy',
      type: 'textarea',
      admin: { description: 'Small copyright/footer line.' },
    },
  ],
}
