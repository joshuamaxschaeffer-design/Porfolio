export type Brand = 'personal' | 'practice'

export const BRANDS: Brand[] = ['personal', 'practice']

export const BRAND_DOMAINS: Record<Brand, string[]> = {
  personal: ['schaeffer.design', 'localhost:3000', 'localhost:3001'],
  practice: ['schaefferpractice.com'],
}

export const BRAND_LABELS: Record<Brand, string> = {
  personal: 'Joshua Schaeffer',
  practice: 'Schaeffer Practice',
}

/** Narrow an arbitrary string to a Brand, defaulting to 'personal'. */
export function asBrand(value: string | undefined | null): Brand {
  return value === 'practice' ? 'practice' : 'personal'
}

/**
 * Detect the brand from a hostname. Used by the middleware to decide which
 * internal `/[brand]/...` path to rewrite a request to.
 */
export function brandFromHostname(hostname: string): Brand {
  const cleanHost = hostname.toLowerCase().replace(/^www\./, '')
  if (BRAND_DOMAINS.practice.includes(cleanHost)) return 'practice'
  return 'personal'
}
