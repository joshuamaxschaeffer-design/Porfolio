/**
 * Seed ONLY the Panda Express case study doc.
 * Run with: pnpm payload run scripts/seed-panda.ts
 *
 * Deliberately narrower than scripts/seed.ts so re-running can never touch
 * settings/home/baserate (which may have drifted in the live CMS).
 * Idempotent: matched by slug+brand, updates in place.
 */
import { getPayload } from 'payload'
import config from '@payload-config'

const run = async () => {
  const payload = await getPayload({ config })
  console.log('Seeding Panda Express case study...')

  const where = {
    and: [{ slug: { equals: 'panda-express' } }, { brand: { contains: 'personal' } }],
  }
  const data = {
    title: 'Panda Express',
    slug: 'panda-express',
    brand: ['personal'],
    status: 'published',
    featured: true,
    client: 'Panda Express',
    role: 'Lead Designer & Art Director',
    dates: { start: '2020', end: '2022' },
    oneLineOutcome:
      'The mobile ordering app behind a 4.8★ rating, 16M+ rewards members, and $1B+ in member sales — shipped twice: once for COVID, once for the vision.',
    blocks: [{ blockType: 'pandaCaseStudy' }],
    publishedAt: new Date('2022-06-01').toISOString(),
  }

  const existing = await payload.find({ collection: 'case-studies', where, limit: 1, depth: 0 })
  if (existing.docs[0]) {
    const doc = await payload.update({ collection: 'case-studies', id: existing.docs[0].id, data })
    console.log(`  updated panda-express (case-studies#${doc.id})`)
  } else {
    const doc = await payload.create({ collection: 'case-studies', data })
    console.log(`  created panda-express (case-studies#${doc.id})`)
  }

  console.log('Done. Visit /work/panda-express')
  process.exit(0)
}

// Top-level await is required: `payload run` process.exit(0)s as soon as the
// module import resolves, so an un-awaited run() gets killed mid-flight.
await run().catch((err) => {
  console.error('Seed failed:', err)
  process.exit(1)
})
