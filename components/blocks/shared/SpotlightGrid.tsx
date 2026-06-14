'use client'

import { useRef } from 'react'

export interface SpotlightItem {
  title: string
  body?: string
  tag?: string
}

/**
 * SpotlightGrid — a grid of bordered cells where a soft radial "spotlight"
 * follows the cursor across the whole grid, lighting each card's border + a
 * faint fill as the pointer passes. The interactive feature-grid look
 * (linear.app-style). CSS variables driven by a single pointer handler on the
 * wrapper, so it scales to many cells cheaply. Degrades to a static grid (the
 * spotlight just never shows) on touch.
 */
export function SpotlightGrid({
  items,
  className,
  accent = 'var(--br-gold)',
}: {
  items: SpotlightItem[]
  className?: string
  accent?: string
}) {
  const ref = useRef<HTMLDivElement>(null)

  const onMove = (e: React.MouseEvent) => {
    const host = ref.current
    if (!host) return
    for (const card of Array.from(host.querySelectorAll<HTMLElement>('[data-spot]'))) {
      const r = card.getBoundingClientRect()
      card.style.setProperty('--mx', `${e.clientX - r.left}px`)
      card.style.setProperty('--my', `${e.clientY - r.top}px`)
    }
  }

  return (
    <div
      ref={ref}
      onMouseMove={onMove}
      className={`grid grid-cols-1 gap-px overflow-hidden rounded-[var(--br-card-radius)] border border-[var(--br-line)] bg-[var(--br-line)] sm:grid-cols-2 lg:grid-cols-3 ${className ?? ''}`}
    >
      {items.map((it, i) => (
        <div
          key={i}
          data-spot
          className="group relative min-h-[180px] overflow-hidden bg-white p-7 md:min-h-[210px]"
          style={
            {
              // the spotlight: a radial that lives at the pointer, revealed via opacity on hover
              '--spot': accent,
            } as React.CSSProperties
          }
        >
          {/* spotlight fill */}
          <div
            aria-hidden
            className="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-300 group-hover:opacity-100"
            style={{ background: 'radial-gradient(220px circle at var(--mx) var(--my), color-mix(in srgb, var(--spot) 12%, transparent), transparent 60%)' }}
          />
          {/* spotlight border accent */}
          <div
            aria-hidden
            className="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-300 group-hover:opacity-100"
            style={{
              background: 'radial-gradient(200px circle at var(--mx) var(--my), color-mix(in srgb, var(--spot) 50%, transparent), transparent 55%)',
              WebkitMask: 'linear-gradient(#000 0 0) content-box, linear-gradient(#000 0 0)',
              WebkitMaskComposite: 'xor',
              maskComposite: 'exclude',
              padding: 1,
            }}
          />
          <div className="relative">
            {it.tag ? (
              <p className="br-data text-[12px] font-semibold uppercase tracking-[0.14em]" style={{ color: accent }}>{it.tag}</p>
            ) : null}
            <h3 className="mt-2 text-[20px] font-medium leading-snug tracking-[-0.01em] text-[var(--br-ink)] md:text-[23px]">{it.title}</h3>
            {it.body ? <p className="mt-2 text-[14px] leading-relaxed text-[var(--br-muted)] md:text-[15px]">{it.body}</p> : null}
          </div>
        </div>
      ))}
    </div>
  )
}
