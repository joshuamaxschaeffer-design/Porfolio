'use client'

import { useEffect, useRef, useState } from 'react'
import { inStore } from './data'

const W = '/samsung/work'

/**
 * StoreLocatorPopout — the S7 store-locator presented as an angled panel
 * "popping out" of the page (Behance-style), that scales up slightly as it
 * scrolls into view so it feels like it's coming toward the viewer (per Joshua,
 * 2026-06-19). Scroll-driven scale (1.0 → ~1.08), rAF-throttled, reduced-motion
 * safe. Lives on the dark field.
 */
export function StoreLocatorPopout() {
  const ref = useRef<HTMLDivElement>(null)
  const [t, setT] = useState(0) // 0 (just entered) .. 1 (centered)
  const reduce = useRef(false)

  useEffect(() => {
    reduce.current = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    let raf = 0
    const onScroll = () => {
      if (raf) return
      raf = requestAnimationFrame(() => {
        raf = 0
        const el = ref.current
        if (!el) return
        const r = el.getBoundingClientRect()
        const vh = window.innerHeight
        // 0 as the top enters from the bottom, 1 once it's reached center.
        const v = 1 - Math.max(0, Math.min(1, (r.top - vh * 0.15) / (vh * 0.7)))
        setT(v)
      })
    }
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    window.addEventListener('resize', onScroll)
    return () => {
      window.removeEventListener('scroll', onScroll)
      window.removeEventListener('resize', onScroll)
      if (raf) cancelAnimationFrame(raf)
    }
  }, [])

  const scale = reduce.current ? 1 : 1 + t * 0.08
  const lift = reduce.current ? 0 : (1 - t) * 26

  return (
    <div ref={ref} className="relative" style={{ perspective: '1800px', perspectiveOrigin: '50% 40%' }}>
      <figure
        className="relative mx-auto max-w-[1000px] overflow-hidden rounded-2xl ring-1 ring-white/15"
        style={{
          transform: `rotateX(12deg) rotateZ(-3deg) scale(${scale}) translateY(${lift}px)`,
          transformStyle: 'preserve-3d',
          boxShadow: '0 50px 90px -30px rgba(0,0,0,0.7), 0 16px 40px -16px rgba(0,0,0,0.55)',
          willChange: 'transform',
        }}
      >
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={`${W}/${inStore.locator.file}`}
          alt={inStore.locator.alt}
          loading="lazy"
          draggable={false}
          className="block w-full"
        />
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0"
          style={{ background: 'linear-gradient(120deg, rgba(255,255,255,0.12) 0%, rgba(255,255,255,0) 30%)' }}
        />
      </figure>
    </div>
  )
}
