import Link from 'next/link'
import type { ReactNode } from 'react'

/**
 * Desktop nav item. By default it's just the icon; on hover/focus the icon is
 * swapped for the text label inside a glass pill. Simple in-place swap — no
 * width animation, no measuring, nothing that can glitch. Colors inherit the
 * per-brand --nav-* / --glass-* vars set on the header.
 */
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
      className="group/icon flex h-9 items-center justify-center rounded-full border border-transparent px-3 text-[var(--nav-fg)] transition-colors duration-150 hover:border-[var(--glass-border)] hover:bg-[var(--glass-fill)] hover:text-[var(--nav-fg-hover)] focus-visible:border-[var(--glass-border)] focus-visible:bg-[var(--glass-fill)]"
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
