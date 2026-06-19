'use client'

import { useEffect, useRef, useState } from 'react'
import { webPages } from './data'

const W = '/samsung/work'

/**
 * ProductPagesStage — the signature Behance "Product Pages" moment (rebuilt per
 * Joshua's 2nd feedback, 2026-06-19):
 *  - gradient fills the WHOLE section, SHARP edges (blur clipped by overflow).
 *  - the full landing pages sit on the LEFT, copy on the RIGHT.
 *  - BIG — the pages overflow the top and bottom of the band (intentionally
 *    cropped) for a cinematic, immersive feel.
 *  - PRONOUNCED perspective: the row is rotated harder (~ +15° more than before)
 *    and each successive page recedes (scales down) to the left so the
 *    left-most reads farthest away.
 *  - alternating up/down parallax on scroll, in the tilt direction.
 *  - NO rounded corners anywhere.
 */
export function ProductPagesStage() {
  const ref = useRef<HTMLDivElement>(null)
  const [progress, setProgress] = useState(0)
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

  const amp = reduce.current ? 0 : 64

  return (
    <div ref={ref} className="relative overflow-hidden bg-[#1c8aa6]">
      {/* blurred multi-color wash, clipped to the band (sharp top/bottom) */}
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

      {/* tall band so the big pages can overflow top + bottom */}
      <div className="relative grid min-h-[720px] grid-cols-1 items-center gap-8 lg:min-h-[1020px] lg:grid-cols-[1.55fr_1fr]">
        {/* LEFT: the angled, receding page fan (clipped by the band). Its own
            column clips horizontally so the big pages never run under the copy. */}
        <div
          className="relative order-2 h-full overflow-hidden lg:order-1"
          style={{ perspective: '2200px', perspectiveOrigin: '40% 50%' }}
        >
          <div
            className="absolute left-[3%] top-1/2 flex items-center gap-2 md:gap-3"
            style={{
              transform: 'translateY(-50%) rotateX(10deg) rotateY(-32deg) rotateZ(8deg)',
              transformStyle: 'preserve-3d',
            }}
          >
            {webPages.shots.map((s, i) => {
              const dir = i % 2 === 0 ? 1 : -1
              // far-left (i=0) sits farthest back + smallest; near (last) largest
              // leftmost (Gear, i=0) sits FARTHEST back + smallest; phone nearest.
              const near = i // 0 = far/small ... n-1 = near/large
              const scale = 0.82 + near * 0.16
              return (
                <ParallaxPage
                  key={s.file}
                  file={s.file}
                  alt={s.alt}
                  offset={progress * amp * dir}
                  scale={scale}
                  z={(near - 1) * 150}
                />
              )
            })}
          </div>
        </div>

        {/* RIGHT: copy */}
        <div className="relative order-1 px-6 pt-14 sm:px-10 lg:order-2 lg:pr-[8%] lg:pt-0">
          <p className="br-data text-[12px] font-semibold uppercase tracking-[0.2em] text-white/90">
            {webPages.tag}
          </p>
          <h3 className="mt-3 text-[26px] font-semibold leading-tight text-white sm:text-[30px] md:text-[40px]">
            {webPages.title}
          </h3>
          <p className="mt-4 max-w-md text-[15px] leading-normal text-white/85 md:text-base">
            {webPages.body}
          </p>
        </div>
      </div>
    </div>
  )
}

/** One full landing page, tilted, receding, drifting on scroll. Sharp corners. */
function ParallaxPage({
  file,
  alt,
  offset,
  scale,
  z,
}: {
  file: string
  alt: string
  offset: number
  scale: number
  z: number
}) {
  return (
    <figure
      className="relative shrink-0 overflow-hidden ring-1 ring-white/20"
      style={{
        width: 'clamp(300px, 32vw, 520px)',
        transform: `translateY(${offset}px) translateZ(${z}px) scale(${scale})`,
        transformOrigin: 'center center',
        boxShadow: '0 50px 90px -28px rgba(0,0,0,0.6), 0 12px 28px -10px rgba(0,0,0,0.5)',
        willChange: 'transform',
      }}
    >
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
