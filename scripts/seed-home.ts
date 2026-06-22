/**
 * Seed ONLY the personal-brand home page block list — the Figma home pass
 * (Figma DMLeSgqznAgiYMx6N3QXc4):
 *   homeHero → homeFlagshipBaserate → homeFlagshipPanda → homeSecondaryRow
 *            → homeAboutCta
 *
 * Narrow + idempotent (matched by slug+brand, updated in place) so re-running
 * never touches settings or case-study docs. Every block carries its own copy
 * defaults, so the page renders immediately with no extra fields.
 *
 * Run: pnpm payload run scripts/seed-home.ts
 */
import { getPayload } from 'payload'
import config from '@payload-config'

const run = async () => {
  const payload = await getPayload({ config })
  console.log('Seeding personal home page block list...')

  const blocks: any[] = [
    { blockType: 'homeHero' },
    { blockType: 'homeFlagshipBaserate' },
    { blockType: 'homeFlagshipPanda' },
    { blockType: 'homeSecondaryRow' },
    { blockType: 'homeAboutCta' },
  ]

  const where = {
    and: [{ slug: { equals: 'home' } }, { brand: { contains: 'personal' } }],
  }
  const data = {
    title: 'Home',
    slug: 'home',
    brand: ['personal'],
    status: 'published',
    blocks,
    publishedAt: new Date().toISOString(),
  }

  const existing = await payload.find({ collection: 'pages', where, limit: 1, depth: 0 })
  if (existing.docs[0]) {
    const doc = await payload.update({ collection: 'pages', id: existing.docs[0].id, data })
    console.log(`  updated home (pages#${doc.id}) — ${blocks.length} blocks`)
  } else {
    const doc = await payload.create({ collection: 'pages', data })
    console.log(`  created home (pages#${doc.id}) — ${blocks.length} blocks`)
  }

  console.log('Done. Visit /personal (home).')
  process.exit(0)
}

// Top-level await: `payload run` exits as soon as the import resolves, so an
// un-awaited run() gets killed mid-flight.
await run().catch((err) => {
  console.error('Seed failed:', err)
  process.exit(1)
})
