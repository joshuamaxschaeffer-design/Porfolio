/**
 * Seed ONLY the personal-brand home page block list — the full layout pass
 * (see Dropbox Home-Page-Layout.md):
 *   hero → homeFlagshipBaserate → homeFlagshipPanda → homeSecondaryRow
 *        → [logoWall if logos exist] → capabilities → values → cta
 *
 * Narrow + idempotent (matched by slug+brand, updated in place) so re-running
 * never touches settings or case-study docs. Flagship/secondary/capabilities/
 * values/cta all carry their own copy, so the page renders immediately; the
 * logo wall is only added if the Logos collection has records (else it would
 * render empty).
 *
 * Run: pnpm payload run scripts/seed-home.ts
 */
import { getPayload } from 'payload'
import config from '@payload-config'

const run = async () => {
  const payload = await getPayload({ config })
  console.log('Seeding personal home page block list...')

  // Logo wall only if there are logos to show.
  const logosRes = await payload.find({ collection: 'logos', limit: 50, depth: 0 })
  const logoIds = logosRes.docs.map((d: any) => d.id)
  console.log(`  found ${logoIds.length} logos`)

  const blocks: any[] = [
    {
      blockType: 'hero',
      eyebrow: 'Product + Brand Design Lead',
      headline: 'Product and brand, built by one operator.',
      subhead:
        'End-to-end product systems across fintech, enterprise, and consumer platforms. 13 years for Samsung, Panda Express, Wingstop, Mindbody, and Baserate.',
      background: 'none',
      cta: { label: 'View work', url: '/work/baserate' },
    },
    { blockType: 'homeFlagshipBaserate' },
    { blockType: 'homeFlagshipPanda' },
    { blockType: 'homeSecondaryRow' },
  ]

  if (logoIds.length) {
    blocks.push({ blockType: 'logoWall', logos: logoIds, maxCount: 9, randomize: false })
  }

  blocks.push(
    {
      blockType: 'capabilities',
      heading: 'Capabilities',
      style: 'inline',
      items: [
        { label: 'Product Design' },
        { label: 'UX Strategy' },
        { label: 'Brand Systems' },
        { label: 'Design Direction' },
        { label: 'Motion & Interaction' },
        { label: 'AI Product Prototyping' },
        { label: 'Cross-functional Leadership' },
      ],
    },
    {
      blockType: 'values',
      heading: 'How I work',
      values: [
        {
          title: 'Systems Over Screens',
          description:
            'Long-term thinking and scalable architecture. Design as infrastructure, not decoration.',
        },
        {
          title: 'Strategy Through Execution',
          description: 'Leadership backed by shipped product, not concept-only work.',
        },
        {
          title: 'Clarity Builds Trust',
          description:
            'A UX philosophy tuned for fintech, enterprise, and high-stakes interfaces.',
        },
      ],
    },
    {
      blockType: 'cta',
      heading: 'Currently available for select engagements.',
      body: 'Senior product design, brand systems, and strategic consulting.',
      ctaLabel: 'Get in touch',
      ctaUrl: '/contact',
      align: 'center',
    },
  )

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
