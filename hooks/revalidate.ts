import type { CollectionAfterChangeHook, CollectionAfterDeleteHook } from 'payload'

/**
 * Generic revalidation hook for any collection. Sends a POST to /api/revalidate
 * with the paths that should be regenerated. Wire this into a collection's
 * `hooks.afterChange` and `hooks.afterDelete` arrays.
 *
 * Example (collections/Pages.ts):
 *   hooks: {
 *     afterChange: [revalidatePageHook],
 *     afterDelete: [revalidatePageHook],
 *   }
 */

function getRevalidateUrl(): string {
  const base = process.env.NEXT_PUBLIC_SERVER_URL || 'http://localhost:3000'
  return `${base}/api/revalidate`
}

/**
 * Expand a brand-agnostic path into the brand-prefixed internal paths that
 * Next actually caches. Pages live under `/[brand]/...` (the middleware
 * rewrites public URLs to these), so `/about` must be revalidated as
 * `/personal/about` and/or `/practice/about` depending on which sites the
 * document belongs to. `brand` on a doc is a `hasMany` select → string[].
 */
function brandsOf(doc: any): Array<'personal' | 'practice'> {
  const raw = doc?.brand
  const list = Array.isArray(raw) ? raw : raw ? [raw] : []
  const valid = list.filter(
    (b: string) => b === 'personal' || b === 'practice',
  ) as Array<'personal' | 'practice'>
  // Fall back to revalidating both if a doc somehow has no brand set.
  return valid.length ? valid : ['personal', 'practice']
}

function prefixPaths(paths: string[], brands: Array<'personal' | 'practice'>): string[] {
  const out: string[] = []
  for (const brand of brands) {
    for (const p of paths) {
      out.push(p === '/' ? `/${brand}` : `/${brand}${p}`)
    }
  }
  return out
}

async function callRevalidate(paths: string[], tags: string[] = []) {
  try {
    await fetch(getRevalidateUrl(), {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-revalidate-secret': process.env.PAYLOAD_SECRET || '',
      },
      body: JSON.stringify({ paths, tags }),
    })
  } catch (err) {
    // Don't block the CMS save if revalidation fails — just log.
    console.warn('[revalidate] failed', err)
  }
}

/** Revalidate a Page after change/delete. */
export const revalidatePageHook: CollectionAfterChangeHook = async ({ doc }) => {
  const slug = doc?.slug as string
  if (!slug) return doc
  const base = slug === 'home' ? ['/'] : [`/${slug}`, '/']
  await callRevalidate(prefixPaths(base, brandsOf(doc)), ['pages'])
  return doc
}

/** Revalidate a CaseStudy after change/delete. */
export const revalidateCaseStudyHook: CollectionAfterChangeHook = async ({ doc }) => {
  const slug = doc?.slug as string
  if (!slug) return doc
  const base = [`/work/${slug}`, '/work', '/']
  await callRevalidate(prefixPaths(base, brandsOf(doc)), ['case-studies'])
  return doc
}

/** Revalidate everything when a Global (Settings/Nav/Footer) changes. */
export const revalidateGlobalHook: CollectionAfterChangeHook = async ({ doc }) => {
  // Settings/Nav/Footer use a single-value `brand` select → brandsOf still works.
  await callRevalidate(prefixPaths(['/'], brandsOf(doc)), ['globals'])
  return doc
}

/** Delete variant (same shape, different function type). */
export const revalidatePageDelete: CollectionAfterDeleteHook = async ({ doc }) => {
  const slug = doc?.slug as string
  if (slug) {
    const base = slug === 'home' ? ['/'] : [`/${slug}`, '/']
    await callRevalidate(prefixPaths(base, brandsOf(doc)), ['pages'])
  }
  return doc
}

export const revalidateCaseStudyDelete: CollectionAfterDeleteHook = async ({ doc }) => {
  const slug = doc?.slug as string
  if (slug) {
    const base = [`/work/${slug}`, '/work', '/']
    await callRevalidate(prefixPaths(base, brandsOf(doc)), ['case-studies'])
  }
  return doc
}
