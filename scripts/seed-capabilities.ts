/**
 * Seed ONLY the Capabilities page.
 * Run with: pnpm payload run scripts/seed-capabilities.ts
 *
 * Deliberately narrow (like scripts/seed-panda.ts) so re-running can never touch
 * settings / home / case studies. Idempotent: matched by slug+brand, updates in
 * place. The capabilitiesPage block carries all its content as defaults, so the
 * page just needs the one block.
 *
 * NOTE: the page lives in the `pages` collection → it renders at /capabilities
 * (brand-prefixed route: /personal/capabilities).
 */
import { getPayload } from 'payload'
import config from '@payload-config'

const run = async () => {
  const payload = await getPayload({ config })
  console.log('Seeding Capabilities page...')

  const where = {
    and: [{ slug: { equals: 'capabilities' } }, { brand: { contains: 'personal' } }],
  }
  const data = {
    title: 'Capabilities',
    slug: 'capabilities',
    brand: ['personal'],
    status: 'published',
    blocks: [{ blockType: 'capabilitiesPage' }],
    seo: {
      title: 'Capabilities — Joshua Schaeffer',
      description:
        'Every stage of the design process — strategy, brand, product, design systems, art direction, motion, web, and AI prototyping — shipped for Panda Express, Wingstop, Samsung, Mindbody, Baserate, and more.',
    },
    publishedAt: new Date().toISOString(),
  }

  const existing = await payload.find({ collection: 'pages', where, limit: 1, depth: 0 })
  if (existing.docs[0]) {
    const doc = await payload.update({ collection: 'pages', id: existing.docs[0].id, data })
    console.log(`  updated capabilities (pages#${doc.id})`)
  } else {
    const doc = await payload.create({ collection: 'pages', data })
    console.log(`  created capabilities (pages#${doc.id})`)
  }

  console.log('Done. Visit /personal/capabilities')
  process.exit(0)
}

// Top-level await is required: `payload run` process.exit(0)s as soon as the
// module import resolves, so an un-awaited run() gets killed mid-flight.
await run().catch((err) => {
  console.error('Seed failed:', err)
  process.exit(1)
})
