/**
 * Brand marks for the Baserate case study.
 * These are the real logo assets exported from the Figma source
 * (public/baserate/logos/*), not recreations.
 */

const L = '/baserate/logos'

/** Baserate mountain mark (the glyph, on transparent bg). */
export function BaserateMark({ className }: { className?: string }) {
  // eslint-disable-next-line @next/next/no-img-element
  return <img src={`${L}/baserate-mark.png`} alt="" aria-hidden className={className} />
}

/** Baserate full wordmark (BASE bold + RATE light + mark), exact from Figma. */
export function BaserateWordmark({ className }: { className?: string }) {
  // eslint-disable-next-line @next/next/no-img-element
  return <img src={`${L}/baserate-wordmark.png`} alt="Baserate" className={className} />
}

/** Full lockup used in the Overview header — the Figma wordmark already
 *  includes the mark, so this is just the wordmark at a readable height. */
export function BaserateLogo({ className }: { className?: string }) {
  return <BaserateWordmark className={`h-7 w-auto md:h-8 ${className || ''}`} />
}

/** App badge: black rounded square with the white mark — used on the product card. */
export function BaserateBadge({ className }: { className?: string }) {
  return (
    <span
      className={`inline-flex items-center justify-center rounded-[20px] bg-black shadow-[var(--br-card-shadow)] ${className || ''}`}
    >
      <BaserateMark className="h-1/2 w-auto" />
    </span>
  )
}

/** Journalytic wordmark (book + chart mark + text), exact from Figma. */
export function JournalyticWordmark({ className }: { className?: string }) {
  // eslint-disable-next-line @next/next/no-img-element
  return <img src={`${L}/journalytic-wordmark.png`} alt="Journalytic" className={className} />
}

/** Journalytic app badge. */
export function JournalyticBadge({ className }: { className?: string }) {
  return (
    <span className={`inline-flex items-center justify-center ${className || ''}`}>
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img src={`${L}/journalytic-badge.png`} alt="" aria-hidden className="h-full w-full object-contain" />
    </span>
  )
}
