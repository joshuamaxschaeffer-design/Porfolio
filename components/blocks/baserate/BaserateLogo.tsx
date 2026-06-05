/**
 * Brand marks for the Baserate case study.
 * These are the real vector logos exported from the Figma source
 * (public/baserate/logos/*.svg) — true vectors, crisp at any size.
 *
 *   baserate-logo.svg      270×36  (mark + BASERATE wordmark)
 *   baserate-app.svg       100×100 (black app badge)
 *   journalytic-logo.svg   300×57  (mark + Journalytic wordmark)
 *   journalytic-app.svg    100×100 (app badge)
 */

const L = '/baserate/logos'

/** Baserate full wordmark (mark + BASERATE), exact vector. 270:36 ratio. */
export function BaserateWordmark({ className }: { className?: string }) {
  // eslint-disable-next-line @next/next/no-img-element
  return <img src={`${L}/baserate-logo.svg`} alt="Baserate" className={className} />
}

/** Full lockup used in the Overview header. */
export function BaserateLogo({ className }: { className?: string }) {
  return <BaserateWordmark className={`h-8 w-auto ${className || ''}`} />
}

/** Baserate app badge (black rounded square w/ mark) — exact vector. */
export function BaserateBadge({ className }: { className?: string }) {
  return (
    <span className={`inline-flex items-center justify-center ${className || ''}`}>
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img src={`${L}/baserate-app.svg`} alt="" aria-hidden className="h-full w-full object-contain" />
    </span>
  )
}

/** Journalytic full wordmark (mark + Journalytic), exact vector. 300:57 ratio. */
export function JournalyticWordmark({ className }: { className?: string }) {
  // eslint-disable-next-line @next/next/no-img-element
  return <img src={`${L}/journalytic-logo.svg`} alt="Journalytic" className={className} />
}

/** Journalytic app badge — exact vector. */
export function JournalyticBadge({ className }: { className?: string }) {
  return (
    <span className={`inline-flex items-center justify-center ${className || ''}`}>
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img src={`${L}/journalytic-app.svg`} alt="" aria-hidden className="h-full w-full object-contain" />
    </span>
  )
}
