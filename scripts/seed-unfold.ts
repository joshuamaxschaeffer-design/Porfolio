/**
 * Seed ONLY the Unfold case study doc — as a DRAFT.
 * Run with: pnpm payload run scripts/seed-unfold.ts
 *
 * Narrow on purpose — re-running can never touch other docs.
 * Idempotent: matched by slug+brand, updates in place.
 *
 * status stays 'draft' until launch review: drafts render on the staging
 * preview (schaeffer.studio) only; production never serves them.
 */
import { getPayload } from 'payload'
import config from '@payload-config'

const run = async () => {
  const payload = await getPayload({ config })
  console.log('Seeding Unfold case study (draft)...')

  const where = {
    and: [{ slug: { equals: 'unfold' } }, { brand: { contains: 'personal' } }],
  }
  const data = {
    title: 'Unfold',
    slug: 'unfold',
    brand: ['personal'],
    status: 'draft',
    featured: true,
    client: 'Unfold · Neil Broere',
    role: 'Product Designer & Builder — UX, UI, Brand, Content Systems, Front + Back End, Launch',
    dates: { start: 'Apr 2026', end: 'Aug 2026' },
    oneLineOutcome:
      'A Bible reading app rebuilt end to end by one designer directing an AI agent fleet — every screen, the brand, a 14,000-entry study library, and the App Store launch itself.',
    blocks: [{ blockType: 'unfoldCaseStudy' }],
    publishedAt: new Date('2026-08-10').toISOString(),
  }

  const existing = await payload.find({ collection: 'case-studies', where, limit: 1, depth: 0 })
  if (existing.docs[0]) {
    const doc = await payload.update({ collection: 'case-studies', id: existing.docs[0].id, data })
    console.log(`  updated unfold (case-studies#${doc.id})`)
  } else {
    const doc = await payload.create({ collection: 'case-studies', data })
    console.log(`  created unfold (case-studies#${doc.id})`)
  }

  console.log('Done. Draft — visible on staging only. Visit /work/unfold behind the staging lock.')
  process.exit(0)
}

// Top-level await is required: `payload run` process.exit(0)s as soon as the
// module import resolves, so an un-awaited run() gets killed mid-flight.
await run().catch((err) => {
  console.error('Seed failed:', err)
  process.exit(1)
})
