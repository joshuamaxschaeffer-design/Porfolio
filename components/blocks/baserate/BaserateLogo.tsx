/**
 * Brand marks for the Baserate case study.
 * The Baserate mark is a crisp inline SVG (true vector, scales infinitely);
 * the wordmark is live text in the heading font. Journalytic uses the exact
 * SVG exports from Figma.
 */

const L = '/baserate/logos'

/** Baserate double-mountain mark — inline SVG, scales to any size. */
export function BaserateMark({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 34 24" className={className} fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
      {/* back peak (lighter) */}
      <path d="M20.5 2 33 22H21l-6.2-9.9L20.5 2Z" fill="currentColor" opacity="0.45" />
      {/* front peak (solid) with a notch */}
      <path d="M9.5 6 19 22H0L9.5 6Zm0 5.8L5.3 19h8.4L9.5 11.8Z" fill="currentColor" />
    </svg>
  )
}

/** Baserate wordmark: mark + "BASE" (bold) + "RATE" (light), live text. */
export function BaserateWordmark({ className }: { className?: string }) {
  return (
    <span className={`inline-flex items-center gap-2 leading-none ${className || ''}`}>
      <BaserateMark className="h-[0.8em] w-auto" />
      <span className="tracking-[-0.01em]" style={{ fontFamily: 'var(--br-font-heading)' }}>
        <span className="font-bold">BASE</span>
        <span className="font-light">RATE</span>
      </span>
    </span>
  )
}

/** Full lockup used in the Overview header. */
export function BaserateLogo({ className }: { className?: string }) {
  return <BaserateWordmark className={`text-[28px] text-[var(--br-ink)] md:text-[32px] ${className || ''}`} />
}

/** App badge: black rounded square with the white mark — used on the product card. */
export function BaserateBadge({ className }: { className?: string }) {
  return (
    <span
      className={`inline-flex items-center justify-center rounded-[20px] bg-black text-white shadow-[var(--br-card-shadow)] ${className || ''}`}
    >
      <BaserateMark className="h-[44%] w-auto" />
    </span>
  )
}

/** Journalytic wordmark (book + chart mark + text) — exact SVG from Figma. */
export function JournalyticWordmark({ className }: { className?: string }) {
  // eslint-disable-next-line @next/next/no-img-element
  return <img src={`${L}/journalytic-wordmark.png`} alt="Journalytic" className={className} />
}

/** Journalytic app badge — exact SVG from Figma. */
export function JournalyticBadge({ className }: { className?: string }) {
  return (
    <span className={`inline-flex items-center justify-center ${className || ''}`}>
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img src={`${L}/journalytic-badge.png`} alt="" aria-hidden className="h-full w-full object-contain" />
    </span>
  )
}
