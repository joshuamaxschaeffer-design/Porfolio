'use client'

import { useState } from 'react'

/**
 * PageStack — a single stack of pages (e.g. the multiple pages of one brand's
 * toolkit). The active page sits on top; the others peek behind it, offset +
 * scaled. Numbered pills (1, 2, 3…) below swap which page is on top on hover/tap.
 * Used to show a multi-page toolkit as ONE stack instead of N separate tiles.
 */
export function PageStack({
  pages,
  label,
  ratio = '3 / 4',
  dark = false,
}: {
  pages: string[]
  label?: string
  /** CSS aspect-ratio for the card. */
  ratio?: string
  dark?: boolean
}) {
  const [active, setActive] = useState(0)
  const n = pages.length
  const gold = dark ? 'var(--br-gold-soft)' : 'var(--br-gold)'

  return (
    <figure className="flex flex-col">
      <div className="relative w-full" style={{ aspectRatio: ratio }}>
        {pages.map((src, i) => {
          const depth = (i - active + n) % n // 0 = front
          const behind = Math.min(depth, 3)
          const isFront = depth === 0
          return (
            <div
              key={src}
              className={`absolute inset-0 overflow-hidden rounded-[12px] border bg-white ${dark ? 'border-white/10' : 'border-[var(--br-line)]'}`}
              style={{
                transform: `translate(${behind * 10}px, ${behind * 8}px) scale(${1 - behind * 0.03})`,
                opacity: depth > 3 ? 0 : 1,
                zIndex: n - depth,
                boxShadow: isFront ? '0 20px 44px -24px rgba(7,14,44,0.5)' : '0 10px 24px -16px rgba(7,14,44,0.3)',
                transition: 'transform 360ms cubic-bezier(0.22,1,0.36,1), opacity 360ms ease',
              }}
              aria-hidden={!isFront}
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={src} alt={isFront ? label ?? '' : ''} className="h-full w-full object-cover object-top" loading="lazy" />
            </div>
          )
        })}
      </div>

      <figcaption className="mt-3 flex items-center justify-between gap-2">
        <span className={`br-data text-[10px] uppercase tracking-[0.07em] ${dark ? 'text-white/55' : 'text-[var(--br-muted-2)]'}`}>{label}</span>
        {n > 1 && (
          <span className="flex gap-1.5">
            {pages.map((_, i) => (
              <button
                key={i}
                type="button"
                onMouseEnter={() => setActive(i)}
                onClick={() => setActive(i)}
                aria-label={`Page ${i + 1}`}
                aria-current={i === active}
                className="br-data flex h-5 w-5 items-center justify-center rounded-full border text-[10px] transition-colors"
                style={
                  i === active
                    ? { borderColor: gold, color: dark ? '#fff' : 'var(--br-ink)', background: dark ? 'rgba(255,255,255,0.06)' : 'rgba(0,0,0,0.03)' }
                    : { borderColor: dark ? 'rgba(255,255,255,0.2)' : 'var(--br-line)', color: dark ? 'rgba(255,255,255,0.5)' : 'var(--br-muted-2)' }
                }
              >
                {i + 1}
              </button>
            ))}
          </span>
        )}
      </figcaption>
    </figure>
  )
}
