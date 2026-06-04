/**
 * Brand marks for the Baserate case study.
 * Recreated as inline SVG so they stay crisp at any size and theme with currentColor.
 */

export function BaserateMark({ className }: { className?: string }) {
  // Double-mountain mark (the glyph inside the black app badge).
  return (
    <svg viewBox="0 0 32 24" className={className} fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
      <path d="M10.5 3.5 19 19H2L10.5 3.5Z" fill="currentColor" />
      <path d="M21 8.5 30 24H12L21 8.5Z" fill="currentColor" opacity="0.55" />
    </svg>
  )
}

export function BaserateWordmark({ className }: { className?: string }) {
  return (
    <span className={className}>
      <span className="font-extrabold tracking-tight">BASE</span>
      <span className="font-light tracking-tight">RATE</span>
    </span>
  )
}

/** Full lockup: mark + wordmark, used in the Overview header. */
export function BaserateLogo({ className }: { className?: string }) {
  return (
    <span className={`inline-flex items-center gap-2.5 ${className || ''}`}>
      <BaserateMark className="h-6 w-8 text-current" />
      <BaserateWordmark className="text-2xl md:text-3xl" />
    </span>
  )
}

/** App badge: black rounded square with white mark — used on the product card. */
export function BaserateBadge({ className }: { className?: string }) {
  return (
    <span
      className={`inline-flex items-center justify-center rounded-2xl bg-[#0a0a0a] text-white shadow-lg ${className || ''}`}
    >
      <BaserateMark className="h-1/2 w-1/2" />
    </span>
  )
}

export function JournalyticMark({ className }: { className?: string }) {
  // Open book with a small rising chart line above it.
  return (
    <svg viewBox="0 0 28 24" className={className} fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
      <path
        d="M14 7c-2.2-1.5-4.6-2-7-1.6v11.2c2.4-.4 4.8.1 7 1.6 2.2-1.5 4.6-2 7-1.6V5.4c-2.4-.4-4.8.1-7 1.6Z"
        fill="currentColor"
      />
      <path d="M14 7v11.2" stroke="#fff" strokeWidth="1.1" />
      <path d="M16 4.2l2.4 2.1 1.8-2.4 2.6 1.4" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  )
}

export function JournalyticBadge({ className }: { className?: string }) {
  return (
    <span
      className={`inline-flex items-center justify-center rounded-2xl bg-white text-[#0a0a0a] ring-1 ring-neutral-200 shadow-lg ${className || ''}`}
    >
      <JournalyticMark className="h-1/2 w-1/2" />
    </span>
  )
}
