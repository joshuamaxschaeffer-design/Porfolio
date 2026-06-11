'use client'

import Link from 'next/link'
import { type ReactNode } from 'react'

/**
 * Desktop nav item: an icon whose text label expands on hover, forming a glass
 * pill that grows OUTWARD FROM ITS CENTER in both directions.
 *
 * Layout trick for minimal displacement: the item reserves a fixed-width icon
 * SLOT in the flex row (so the row never reflows), and the actual pill is
 * absolutely positioned and horizontally centered on that slot
 * (left-1/2 + -translate-x-1/2). Because it's center-anchored, revealing the
 * label makes the pill expand symmetrically left and right, floating ABOVE the
 * neighbors (higher z-index) — so the other items don't move at all.
 * Colors inherit the per-brand --nav-* / --glass-* vars set on the header.
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
    // Fixed slot keeps the row layout stable; the pill overflows it centered.
    <span className="relative grid h-9 w-9 place-items-center">
      <Link
        href={href}
        aria-label={label}
        className="group/icon absolute left-1/2 top-1/2 z-10 flex h-9 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full border border-transparent px-2.5 transition-[background-color,border-color,color] duration-300 hover:z-20 hover:border-[var(--glass-border)] hover:bg-[var(--glass-fill)] hover:text-[var(--nav-fg-hover)] focus-visible:z-20 focus-visible:border-[var(--glass-border)] focus-visible:bg-[var(--glass-fill)]"
        style={{ color: 'var(--nav-fg)' }}
      >
        <span className="grid place-items-center [&>svg]:block">{icon}</span>
        {/* Label reveals via max-width 0 → its natural width (group-hover). The
            centered pill therefore grows equally to both sides. */}
        <span className="ml-0 max-w-0 overflow-hidden whitespace-nowrap transition-[max-width,margin] duration-300 ease-out group-hover/icon:ml-1.5 group-hover/icon:max-w-[160px] group-focus-visible/icon:ml-1.5 group-focus-visible/icon:max-w-[160px]">
          <span
            className="inline-block pr-0.5 text-[13px] uppercase tracking-[0.08em]"
            style={{ fontFamily: 'var(--font-heading)', fontWeight: 500 }}
          >
            {label}
          </span>
        </span>
      </Link>
    </span>
  )
}
