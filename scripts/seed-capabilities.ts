/**
 * Seed the Capabilities page as a CASE STUDY (renders at /work/capabilities,
 * sits in the WORK menu alongside Baserate/Panda/Samsung/Wingstop).
 * Run with: pnpm payload run scripts/seed-capabilities.ts
 *
 * Deliberately narrow (like scripts/seed-panda.ts) so re-running can never touch
 * settings / home / other case studies. Idempotent: matched by slug+brand,
 * updates in place. The capabilitiesPage block carries all its content as
 * defaults (FPO copy + grey placeholders), so the doc just needs the one block.
 *
 * Also removes the earlier standalone `pages` doc with slug `capabilities`
 * (from the first version of this page) so the old /capabilities route 404s and
 * only the /work/capabilities case study remains.
 */
import { getPayload } from 'payload'
import config from '@payload-config'

const run = async () => {
  const payload = await getPayload({ config })
  console.log('Seeding Capabilities case study...')

  // 1. Upsert the case-study doc at slug `capabilities`.
  const where = {
    and: [{ slug: { equals: 'capabilities' } }, { brand: { contains: 'personal' } }],
  }
  const data = {
    title: 'Capabilities',
    slug: 'capabilities',
    brand: ['personal'],
    status: 'published',
    featured: false,
    client: 'Selected clients',
    role: 'Lead & Art Director — strategy through shipped experience',
    dates: { start: '2013', end: '2026' },
    oneLineOutcome:
      'Every stage of the design process — strategy, brand, product, design systems, art direction, motion, web, and AI prototyping — shipped for Panda Express, Wingstop, Samsung, Mindbody, Baserate, and more.',
    blocks: [{ blockType: 'capabilitiesPage' }],
    publishedAt: new Date().toISOString(),
  }

  const existing = await payload.find({ collection: 'case-studies', where, limit: 1, depth: 0 })
  if (existing.docs[0]) {
    const doc = await payload.update({ collection: 'case-studies', id: existing.docs[0].id, data })
    console.log(`  updated capabilities (case-studies#${doc.id})`)
  } else {
    const doc = await payload.create({ collection: 'case-studies', data })
    console.log(`  created capabilities (case-studies#${doc.id})`)
  }

  // 2. Remove the old standalone pages doc (v1 of this page), if present.
  const oldPages = await payload.find({
    collection: 'pages',
    where: { and: [{ slug: { equals: 'capabilities' } }, { brand: { contains: 'personal' } }] },
    limit: 10,
    depth: 0,
  })
  for (const p of oldPages.docs) {
    await payload.delete({ collection: 'pages', id: p.id })
    console.log(`  removed stale pages#${p.id} (old /capabilities route)`)
  }

  console.log('Done. Visit /personal/work/capabilities')
  process.exit(0)
}

// Top-level await is required: `payload run` process.exit(0)s as soon as the
// module import resolves, so an un-awaited run() gets killed mid-flight.
await run().catch((err) => {
  console.error('Seed failed:', err)
  process.exit(1)
})
