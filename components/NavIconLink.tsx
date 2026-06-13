import Link from 'next/link'
import type { ReactNode } from 'react'

/**
 * Desktop nav item: a full-bar-height hover target containing the visible
 * pill — a FIXED-WIDTH box (same width for every item, see NAV_BOX) with the
 * icon dead-center. Hover/focus CROSSFADES icon → label (250ms opacity, both
 * stacked in the same grid cell); the pill bg/border fade on the same clock.
 * Boxes sit flush in the bar (no gap) so the hover targets tile edge-to-edge.
 * Colors inherit the per-brand --nav-* / --glass-* vars set on the header.
 */
export const NAV_BOX = 'w-[76px]'

export function NavIconLink({
  href,
  label,
  icon,
}: {
  href: string
  label: string
  icon: ReactNode
}) {
  return (
    <Link
      href={href}
      aria-label={label}
      className="group/icon flex h-full items-center justify-center"
    >
      <span
        className={`grid h-9 ${NAV_BOX} place-items-center text-[var(--nav-fg)] transition-colors duration-[250ms] group-hover/icon:text-[var(--nav-fg-hover)] group-focus-visible/icon:text-[var(--nav-fg-hover)]`}
      >
        {/* Asymmetric crossfade: the OUTGOING glyph exits fast (100ms), the
            INCOMING one eases in slow (600ms after a 75ms head start) — in
            BOTH directions. CSS applies the transition of the state being
            entered, so each span sets its hover-direction timing on the
            group-hover variant and its leave-direction timing on base. */}
        {/* icon — out fast on hover (100ms), back in slow (600ms @75ms) */}
        <span className="col-start-1 row-start-1 grid place-items-center transition-opacity delay-[75ms] duration-[600ms] [&>svg]:block group-hover/icon:opacity-0 group-hover/icon:delay-[0ms] group-hover/icon:duration-[100ms] group-focus-visible/icon:opacity-0 group-focus-visible/icon:delay-[0ms] group-focus-visible/icon:duration-[100ms]">
          {icon}
        </span>
        {/* label — in slow on hover (600ms @75ms), out fast (100ms) */}
        <span
          className="col-start-1 row-start-1 whitespace-nowrap text-[13px] uppercase tracking-[0.08em] opacity-0 transition-opacity duration-[100ms] group-hover/icon:opacity-100 group-hover/icon:delay-[75ms] group-hover/icon:duration-[600ms] group-focus-visible/icon:opacity-100 group-focus-visible/icon:delay-[75ms] group-focus-visible/icon:duration-[600ms]"
          style={{ fontFamily: 'var(--font-heading)', fontWeight: 500 }}
        >
          {label}
        </span>
      </span>
    </Link>
  )
}
