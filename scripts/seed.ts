/**
 * Seed the CMS with the Baserate case study + minimum brand scaffolding.
 * Run with: pnpm payload run scripts/seed.ts
 *
 * Idempotent: re-running updates the same docs (matched by slug/brand)
 * instead of creating duplicates.
 */
import { getPayload } from 'payload'
import config from '@payload-config'

async function upsert(
  payload: any,
  collection: string,
  where: any,
  data: any,
  label: string,
) {
  const existing = await payload.find({ collection, where, limit: 1, depth: 0 })
  if (existing.docs[0]) {
    const doc = await payload.update({ collection, id: existing.docs[0].id, data })
    console.log(`  updated ${label} (${collection}#${doc.id})`)
    return doc
  }
  const doc = await payload.create({ collection, data })
  console.log(`  created ${label} (${collection}#${doc.id})`)
  return doc
}

const run = async () => {
  const payload = await getPayload({ config })
  console.log('Seeding CMS...')

  // 1. Personal-brand site settings
  await upsert(
    payload,
    'settings',
    { brand: { contains: 'personal' } },
    {
      brand: ['personal'],
      siteName: 'Joshua Schaeffer',
      tagline: 'Product & Brand Designer',
      contactEmail: 'josh@journalytic.com',
      footerCopy: '© Joshua Schaeffer',
    },
    'personal settings',
  )

  // 2. Baserate case study — the page itself.
  //    The baserateCaseStudy block carries all its content as defaults,
  //    so the block just needs its blockType.
  await upsert(
    payload,
    'case-studies',
    { and: [{ slug: { equals: 'baserate' } }, { brand: { contains: 'personal' } }] },
    {
      title: 'Baserate',
      slug: 'baserate',
      brand: ['personal'],
      status: 'published',
      featured: true,
      client: 'Baserate',
      role: 'Lead Product & Brand Designer',
      dates: { start: '2022', end: '2024' },
      oneLineOutcome:
        'The investment operating system for family offices and modern investment teams — 70+ features designed end to end.',
      blocks: [{ blockType: 'baserateCaseStudy' }],
      publishedAt: new Date('2024-04-19').toISOString(),
    },
    'baserate case study',
  )

  // 3. Minimal homepage so the site root renders.
  await upsert(
    payload,
    'pages',
    { and: [{ slug: { equals: 'home' } }, { brand: { contains: 'personal' } }] },
    {
      title: 'Home',
      slug: 'home',
      brand: ['personal'],
      status: 'published',
      blocks: [
        {
          blockType: 'hero',
          eyebrow: 'Product & Brand Designer',
          headline: 'Joshua Schaeffer',
          subhead: 'Designing investment software, brands, and product systems end to end.',
        },
      ],
      publishedAt: new Date().toISOString(),
    },
    'home page',
  )

  console.log('Done. Visit /personal/work/baserate')
  process.exit(0)
}

run().catch((err) => {
  console.error('Seed failed:', err)
  process.exit(1)
})
