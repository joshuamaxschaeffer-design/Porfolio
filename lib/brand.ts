export type Brand = 'personal' | 'practice'

export const BRANDS: Brand[] = ['personal', 'practice']

export const BRAND_DOMAINS: Record<Brand, string[]> = {
  // schaeffer.design = personal/portfolio; schaeffer.studio = practice/studio.
  // (schaefferpractice.com kept as an alias in case it's pointed here later.)
  personal: ['schaeffer.design', 'localhost:3000', 'localhost:3001', 'localhost:3100'],
  practice: ['schaeffer.studio', 'schaefferpractice.com'],
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
  // Staging mirror: on Vercel *preview* deployments (the `staging` branch),
  // schaeffer.studio serves the PERSONAL portfolio as a private work-in-progress
  // copy of schaeffer.design. In production it keeps serving the practice site.
  // Fail-safe polarity: anything other than an explicit 'preview' env keeps
  // today's mapping.
  if (process.env.VERCEL_ENV === 'preview' && cleanHost === 'schaeffer.studio') {
    return 'personal'
  }
  if (BRAND_DOMAINS.practice.includes(cleanHost)) return 'practice'
  return 'personal'
}
