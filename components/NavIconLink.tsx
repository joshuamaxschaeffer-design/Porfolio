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
export const NAV_BOX = 'w-[104px]'

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
        className={`grid h-9 ${NAV_BOX} place-items-center rounded-full border border-transparent text-[var(--nav-fg)] transition-colors duration-[250ms] group-hover/icon:border-[var(--glass-border)] group-hover/icon:bg-[var(--glass-fill)] group-hover/icon:text-[var(--nav-fg-hover)] group-focus-visible/icon:border-[var(--glass-border)] group-focus-visible/icon:bg-[var(--glass-fill)]`}
      >
        {/* icon — fades out on hover/focus */}
        <span className="col-start-1 row-start-1 grid place-items-center transition-opacity duration-[250ms] [&>svg]:block group-hover/icon:opacity-0 group-focus-visible/icon:opacity-0">
          {icon}
        </span>
        {/* label — fades in on hover/focus */}
        <span
          className="col-start-1 row-start-1 whitespace-nowrap text-[13px] uppercase tracking-[0.08em] opacity-0 transition-opacity duration-[250ms] group-hover/icon:opacity-100 group-focus-visible/icon:opacity-100"
          style={{ fontFamily: 'var(--font-heading)', fontWeight: 500 }}
        >
          {label}
        </span>
      </span>
    </Link>
  )
}
