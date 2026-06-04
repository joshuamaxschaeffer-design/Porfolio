import 'server-only'
import { getPayloadClient } from './payload'
import type { Brand } from './brand'

/** Fetch a page by slug, filtered to a specific brand. */
export async function getPageBySlug(slug: string, brand: Brand) {
  const payload = await getPayloadClient()
  const result = await payload.find({
    collection: 'pages',
    where: {
      and: [
        { slug: { equals: slug } },
        { brand: { contains: brand } },
        { status: { equals: 'published' } },
      ],
    },
    limit: 1,
    depth: 3,
  })
  return result.docs[0] || null
}

/** Fetch a case study by slug, filtered to a specific brand. */
export async function getCaseStudyBySlug(slug: string, brand: Brand) {
  const payload = await getPayloadClient()
  const result = await payload.find({
    collection: 'case-studies',
    where: {
      and: [
        { slug: { equals: slug } },
        { brand: { contains: brand } },
        { status: { equals: 'published' } },
      ],
    },
    limit: 1,
    depth: 3,
  })
  return result.docs[0] || null
}

/** All case studies visible to a brand, newest first. */
export async function getAllCaseStudies(brand: Brand) {
  const payload = await getPayloadClient()
  const result = await payload.find({
    collection: 'case-studies',
    where: {
      and: [
        { brand: { contains: brand } },
        { status: { equals: 'published' } },
      ],
    },
    sort: '-publishedAt',
    depth: 2,
    limit: 50,
  })
  return result.docs
}

/** Per-brand settings document. */
export async function getSettings(brand: Brand) {
  const payload = await getPayloadClient()
  const result = await payload.find({
    collection: 'settings',
    where: { brand: { equals: brand } },
    limit: 1,
    depth: 2,
  })
  return result.docs[0] || null
}

/** Per-brand navigation document. */
export async function getNavigation(brand: Brand) {
  const payload = await getPayloadClient()
  const result = await payload.find({
    collection: 'navigation',
    where: { brand: { equals: brand } },
    limit: 1,
    depth: 2,
  })
  return result.docs[0] || null
}

/** All published page slugs for a brand. Used by generateStaticParams. */
export async function getAllPageSlugsForBrand(brand: Brand): Promise<string[]> {
  const payload = await getPayloadClient()
  const result = await payload.find({
    collection: 'pages',
    where: {
      and: [
        { brand: { contains: brand } },
        { status: { equals: 'published' } },
      ],
    },
    limit: 200,
    depth: 0,
    pagination: false,
  })
  return result.docs.map((p: any) => p.slug).filter(Boolean)
}

/** All published case study slugs for a brand. Used by generateStaticParams. */
export async function getAllCaseStudySlugsForBrand(brand: Brand): Promise<string[]> {
  const payload = await getPayloadClient()
  const result = await payload.find({
    collection: 'case-studies',
    where: {
      and: [
        { brand: { contains: brand } },
        { status: { equals: 'published' } },
      ],
    },
    limit: 200,
    depth: 0,
    pagination: false,
  })
  return result.docs.map((cs: any) => cs.slug).filter(Boolean)
}

/** Per-brand footer document. */
export async function getFooter(brand: Brand) {
  const payload = await getPayloadClient()
  const result = await payload.find({
    collection: 'footer',
    where: { brand: { equals: brand } },
    limit: 1,
    depth: 2,
  })
  return result.docs[0] || null
}
