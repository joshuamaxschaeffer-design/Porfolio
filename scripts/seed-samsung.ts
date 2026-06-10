/**
 * Seed ONLY the Samsung case study doc.
 * Run with: pnpm payload run scripts/seed-samsung.ts
 *
 * Narrow on purpose — re-running can never touch other docs.
 * Idempotent: matched by slug+brand, updates in place.
 */
import { getPayload } from 'payload'
import config from '@payload-config'

const run = async () => {
  const payload = await getPayload({ config })
  console.log('Seeding Samsung case study...')

  const where = {
    and: [{ slug: { equals: 'samsung' } }, { brand: { contains: 'personal' } }],
  }
  const data = {
    title: 'Samsung',
    slug: 'samsung',
    brand: ['personal'],
    status: 'published',
    featured: false,
    client: 'Samsung',
    role: 'Designer — Razorfish, for Samsung Mobile',
    dates: { start: '2013', end: '2017' },
    oneLineOutcome:
      'Launch pages, social content, and in-store experiences for the Galaxy era — designed under NDA inside the biggest marketing machine in consumer tech.',
    blocks: [{ blockType: 'samsungCaseStudy' }],
    publishedAt: new Date('2017-06-01').toISOString(),
  }

  const existing = await payload.find({ collection: 'case-studies', where, limit: 1, depth: 0 })
  if (existing.docs[0]) {
    const doc = await payload.update({ collection: 'case-studies', id: existing.docs[0].id, data })
    console.log(`  updated samsung (case-studies#${doc.id})`)
  } else {
    const doc = await payload.create({ collection: 'case-studies', data })
    console.log(`  created samsung (case-studies#${doc.id})`)
  }

  console.log('Done. Visit /work/samsung')
  process.exit(0)
}

// Top-level await is required: `payload run` process.exit(0)s as soon as the
// module import resolves, so an un-awaited run() gets killed mid-flight.
await run().catch((err) => {
  console.error('Seed failed:', err)
  process.exit(1)
})
