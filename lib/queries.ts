import 'server-only'
import { getPayloadClient } from './payload'
import type { Brand } from './brand'

/**
 * Neon's free-tier compute autosuspends after idle. The first DB call after a
 * sleep can fail while the compute is still waking ("Failed query: select ...",
 * connection timeouts, ECONNRESET). That surfaced as intermittent 500s on the
 * site. Retry such failures a couple of times with a short backoff — by the
 * second or third attempt Neon is awake and the query succeeds. Real errors
 * (bad SQL, etc.) still fail after the retries are exhausted.
 */
const RETRYABLE = /failed query|timeout|ECONNRESET|ETIMEDOUT|ENOTFOUND|EAI_AGAIN|connection terminated|terminating connection|Connection terminated|server closed the connection/i

async function withDbRetry<T>(fn: () => Promise<T>, attempts = 3): Promise<T> {
  let lastErr: unknown
  for (let i = 0; i < attempts; i++) {
    try {
      return await fn()
    } catch (err) {
      lastErr = err
      const msg = err instanceof Error ? err.message : String(err)
      if (i === attempts - 1 || !RETRYABLE.test(msg)) throw err
      // 400ms, 800ms — enough for a Neon cold start without stalling the request.
      await new Promise((r) => setTimeout(r, 400 * (i + 1)))
    }
  }
  throw lastErr
}

/** Fetch a page by slug, filtered to a specific brand. */
export async function getPageBySlug(slug: string, brand: Brand) {
  const payload = await getPayloadClient()
  const result = await withDbRetry(() => payload.find({
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
  }))
  return result.docs[0] || null
}

/** Fetch a case study by slug, filtered to a specific brand. */
export async function getCaseStudyBySlug(slug: string, brand: Brand) {
  const payload = await getPayloadClient()
  const result = await withDbRetry(() => payload.find({
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
  }))
  return result.docs[0] || null
}

/** All case studies visible to a brand, newest first. */
export async function getAllCaseStudies(brand: Brand) {
  const payload = await getPayloadClient()
  const result = await withDbRetry(() => payload.find({
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
  }))
  return result.docs
}

/** Per-brand settings document. */
export async function getSettings(brand: Brand) {
  const payload = await getPayloadClient()
  const result = await withDbRetry(() => payload.find({
    collection: 'settings',
    where: { brand: { equals: brand } },
    limit: 1,
    depth: 2,
  }))
  return result.docs[0] || null
}

/** Per-brand navigation document. */
export async function getNavigation(brand: Brand) {
  const payload = await getPayloadClient()
  const result = await withDbRetry(() => payload.find({
    collection: 'navigation',
    where: { brand: { equals: brand } },
    limit: 1,
    depth: 2,
  }))
  return result.docs[0] || null
}

/** All published page slugs for a brand. Used by generateStaticParams. */
export async function getAllPageSlugsForBrand(brand: Brand): Promise<string[]> {
  const payload = await getPayloadClient()
  const result = await withDbRetry(() => payload.find({
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
  }))
  return result.docs.map((p: any) => p.slug).filter(Boolean)
}

/** All published case study slugs for a brand. Used by generateStaticParams. */
export async function getAllCaseStudySlugsForBrand(brand: Brand): Promise<string[]> {
  const payload = await getPayloadClient()
  const result = await withDbRetry(() => payload.find({
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
  }))
  return result.docs.map((cs: any) => cs.slug).filter(Boolean)
}

/** Per-brand footer document. */
export async function getFooter(brand: Brand) {
  const payload = await getPayloadClient()
  const result = await withDbRetry(() => payload.find({
    collection: 'footer',
    where: { brand: { equals: brand } },
    limit: 1,
    depth: 2,
  }))
  return result.docs[0] || null
}
