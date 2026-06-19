'use client'

import { useEffect, useRef, useState } from 'react'
import { webPages } from './data'

const W = '/samsung/work'

/**
 * ProductPagesStage — the signature Behance "Product Pages" moment, rebuilt for
 * web (per Joshua, 2026-06-19):
 *  - the multi-color gradient fills the WHOLE section with SHARP top/bottom
 *    edges (no fuzzy mask, no grey gaps) — the blurred wash lives only INSIDE
 *    the band, clipped by overflow-hidden.
 *  - the FULL landing pages (not clipped windows) are shown at a sharp
 *    perspective angle, tilted like the reference.
 *  - each page PARALLAXES on scroll in the direction it's tilted, and adjacent
 *    pages ALTERNATE (one drifts up, the next down). Subtle (~50px).
 *
 * Parallax is driven from a scroll handler reading getBoundingClientRect (Lenis
 * smooth-scroll updates real scroll position, so rect-based math tracks it;
 * window 'scroll' fires on Lenis ticks). rAF-throttled, reduced-motion safe.
 */
export function ProductPagesStage() {
  const ref = useRef<HTMLDivElement>(null)
  const [progress, setProgress] = useState(0) // -1 (below) .. 0 (centered) .. 1 (above)
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
        // 0 when the section center is at viewport center; ±1 as it leaves.
        const center = r.top + r.height / 2
        const p = (vh / 2 - center) / (vh / 2 + r.height / 2)
        setProgress(Math.max(-1, Math.min(1, p)))
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

  const amp = reduce.current ? 0 : 56 // px of drift

  return (
    <div ref={ref} className="relative overflow-hidden bg-[#1c8aa6]">
      {/* the blurred multi-color wash — fills the band, clipped to sharp edges */}
      <div
        aria-hidden
        className="pointer-events-none absolute"
        style={{ inset: '-20%', filter: 'blur(80px)', WebkitFilter: 'blur(80px)' }}
      >
        <div
          className="absolute inset-0"
          style={{
            filter: 'blur(55px)',
            WebkitFilter: 'blur(55px)',
            backgroundColor: '#1c8aa6',
            backgroundImage: [
              'linear-gradient(105deg, #37c090 0%, #2b98a0 32%, #1f84a9 60%, #2766b0 100%)',
              'radial-gradient(60% 80% at 12% 26%, rgba(74,222,150,0.95) 0%, rgba(74,222,150,0) 60%)',
              'radial-gradient(55% 75% at 80% 18%, rgba(80,150,210,0.85) 0%, rgba(80,150,210,0) 58%)',
              'radial-gradient(70% 90% at 92% 84%, rgba(31,132,169,0.95) 0%, rgba(31,132,169,0) 62%)',
              'radial-gradient(50% 70% at 42% 96%, rgba(43,200,160,0.7) 0%, rgba(43,200,160,0) 60%)',
            ].join(','),
          }}
        />
      </div>

      <div className="br-container relative py-20 md:py-28">
        <div className="max-w-xl">
          <p className="br-data text-[12px] font-semibold uppercase tracking-[0.2em] text-white/90">
            {webPages.tag}
          </p>
          <h3 className="mt-3 text-[28px] font-semibold leading-tight text-white md:text-[36px]">
            {webPages.title}
          </h3>
          <p className="mt-3 max-w-md text-[15px] leading-normal text-white/85 md:text-base">
            {webPages.body}
          </p>
        </div>

        {/* angled full-page fan with alternating parallax */}
        <div
          className="mt-14 flex items-start justify-center gap-6 md:mt-20 md:gap-10"
          style={{ perspective: '2400px', perspectiveOrigin: '50% 45%' }}
        >
          {webPages.shots.map((s, i) => {
            const dir = i % 2 === 0 ? 1 : -1 // alternate up/down
            return (
              <ParallaxPage
                key={s.file}
                file={s.file}
                alt={s.alt}
                offset={progress * amp * dir}
              />
            )
          })}
        </div>
      </div>
    </div>
  )
}

/** One full landing page, tilted in perspective, drifting on scroll. The drift
 *  is applied along the page's tilt (slight x with the y) so it reads as moving
 *  "in the direction it's angled." */
function ParallaxPage({ file, alt, offset }: { file: string; alt: string; offset: number }) {
  return (
    <figure
      className="relative w-[31%] max-w-[330px] shrink-0 overflow-hidden rounded-[14px] ring-1 ring-white/20"
      style={{
        transform: `translateY(${offset}px) rotateX(8deg) rotateY(-20deg) rotateZ(5deg)`,
        transformStyle: 'preserve-3d',
        boxShadow: '0 40px 70px -24px rgba(0,0,0,0.55), 0 10px 24px -10px rgba(0,0,0,0.5)',
        willChange: 'transform',
      }}
    >
      {/* full page — shown entire, scaled to the column width */}
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img src={`${W}/${file}`} alt={alt} loading="lazy" draggable={false} className="block w-full" />
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0"
        style={{ background: 'linear-gradient(120deg, rgba(255,255,255,0.16) 0%, rgba(255,255,255,0) 32%)' }}
      />
    </figure>
  )
}
