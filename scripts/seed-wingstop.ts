/**
 * Seed ONLY the Wingstop case study doc.
 * Run with: pnpm payload run scripts/seed-wingstop.ts
 *
 * Narrow on purpose — re-running can never touch other docs.
 * Idempotent: matched by slug+brand, updates in place.
 */
import { getPayload } from 'payload'
import config from '@payload-config'

const run = async () => {
  const payload = await getPayload({ config })
  console.log('Seeding Wingstop case study...')

  const where = {
    and: [{ slug: { equals: 'wingstop' } }, { brand: { contains: 'personal' } }],
  }
  const data = {
    title: 'Wingstop',
    slug: 'wingstop',
    brand: ['personal'],
    status: 'published',
    featured: true,
    client: 'Wingstop',
    role: 'Lead Designer & Art Director',
    dates: { start: '2019', end: '2022' },
    oneLineOutcome:
      'The flavor-first ordering app shipped a year before COVID — then carried the business: 4.9★ across 1.4M ratings and a digital mix that ran from 30% to 70%+ of sales.',
    blocks: [{ blockType: 'wingstopCaseStudy' }],
    publishedAt: new Date('2022-01-15').toISOString(),
  }

  const existing = await payload.find({ collection: 'case-studies', where, limit: 1, depth: 0 })
  if (existing.docs[0]) {
    const doc = await payload.update({ collection: 'case-studies', id: existing.docs[0].id, data })
    console.log(`  updated wingstop (case-studies#${doc.id})`)
  } else {
    const doc = await payload.create({ collection: 'case-studies', data })
    console.log(`  created wingstop (case-studies#${doc.id})`)
  }

  console.log('Done. Visit /work/wingstop')
  process.exit(0)
}

// Top-level await is required: `payload run` process.exit(0)s as soon as the
// module import resolves, so an un-awaited run() gets killed mid-flight.
await run().catch((err) => {
  console.error('Seed failed:', err)
  process.exit(1)
})
