import Link from 'next/link'
import type { ReactNode } from 'react'

/**
 * Desktop nav item: a FIXED-WIDTH invisible box (same width for every item,
 * see NAV_BOX) with the icon dead-center. On hover/focus the icon is swapped
 * for the text label instantly — no transitions, no motion, nothing moves.
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
      className={`group/icon flex h-9 ${NAV_BOX} items-center justify-center rounded-full border border-transparent text-[var(--nav-fg)] hover:border-[var(--glass-border)] hover:bg-[var(--glass-fill)] hover:text-[var(--nav-fg-hover)] focus-visible:border-[var(--glass-border)] focus-visible:bg-[var(--glass-fill)]`}
    >
      {/* icon: shown by default, hidden on hover/focus */}
      <span className="grid place-items-center [&>svg]:block group-hover/icon:hidden group-focus-visible/icon:hidden">
        {icon}
      </span>
      {/* label: hidden by default, shown on hover/focus (swap, no animation) */}
      <span
        className="hidden whitespace-nowrap text-[13px] uppercase tracking-[0.08em] group-hover/icon:inline group-focus-visible/icon:inline"
        style={{ fontFamily: 'var(--font-heading)', fontWeight: 500 }}
      >
        {label}
      </span>
    </Link>
  )
}
