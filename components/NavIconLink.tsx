'use client'

import Link from 'next/link'
import { useEffect, useRef, useState, type ReactNode } from 'react'

/**
 * Desktop nav item: an icon whose text label expands INLINE on hover, forming a
 * pill that grows to the right.
 *
 * The label width animates via max-width (0 → measured content width). We
 * measure the label's natural width once after mount (into state) so it works
 * for any label length, and toggle between 0 and that width on hover/focus via
 * React state — driving the inline style through React (NOT direct DOM writes,
 * which React re-renders would clobber). Colors inherit the per-brand
 * --nav-* / --glass-* vars set on the header.
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
  const measureRef = useRef<HTMLSpanElement>(null)
  const [labelWidth, setLabelWidth] = useState(0)
  const [open, setOpen] = useState(false)

  useEffect(() => {
    if (measureRef.current) setLabelWidth(measureRef.current.scrollWidth)
  }, [label])

  return (
    <Link
      href={href}
      aria-label={label}
      onPointerEnter={(e) => e.pointerType !== 'touch' && setOpen(true)}
      onPointerLeave={(e) => e.pointerType !== 'touch' && setOpen(false)}
      onFocus={() => setOpen(true)}
      onBlur={() => setOpen(false)}
      className="group/icon flex h-9 items-center rounded-full border px-2.5 transition-[background-color,border-color,color] duration-300"
      style={{
        color: open ? 'var(--nav-fg-hover)' : 'var(--nav-fg)',
        backgroundColor: open ? 'var(--glass-fill)' : 'transparent',
        borderColor: open ? 'var(--glass-border)' : 'transparent',
      }}
    >
      <span className="grid place-items-center [&>svg]:block">{icon}</span>
      <span
        className="overflow-hidden whitespace-nowrap transition-[max-width] duration-300 ease-out"
        style={{ maxWidth: open ? labelWidth : 0 }}
      >
        <span
          ref={measureRef}
          className="inline-block pl-2 pr-0.5 text-[13px] uppercase tracking-[0.08em]"
          style={{ fontFamily: 'var(--font-heading)', fontWeight: 500 }}
        >
          {label}
        </span>
      </span>
    </Link>
  )
}
