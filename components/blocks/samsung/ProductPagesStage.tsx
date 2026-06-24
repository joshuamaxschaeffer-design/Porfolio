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

      {/* Two-column at lg+ (pages left, copy right). Below lg it stacks: copy
          on top, then the pages fan in its own bounded height so it never
          overlaps the copy. */}
      <div className="relative grid grid-cols-1 items-center gap-8 lg:min-h-[1020px] lg:grid-cols-[1.55fr_1fr]">
        {/* LEFT: the angled, receding page fan. NO horizontal clip — the fan
            fills the whole left background and bleeds off the left edge; it may
            sit slightly under the copy (per Joshua). Bounded height at sub-lg so
            the absolutely-positioned fan has room and can't cover the copy. */}
        <div
          className="relative order-2 h-[260px] sm:h-[320px] lg:order-1 lg:h-full"
          style={{ perspective: '2200px', perspectiveOrigin: '50% 50%' }}
        >
          {/* Right-anchored, rendered Note→Tab→Gear left-to-right so the GEAR
              page lands FARTHEST RIGHT and largest/nearest; the others recede
              and bleed off the left.
              Narrow view (per Joshua, 2026-06-24): the fan was pushed off the
              LEFT edge and clipped, so on sub-lg it's nudged in from the right
              (right-[6%]) and the pages are halved (see --pp-w below) so the
              whole fan reads inside the band. lg+ restores right-[2%]. */}
          <div
            className="absolute right-[6%] top-1/2 flex items-center gap-3 [--pp-w:clamp(150px,18vw,260px)] [--pp-x:20vw] sm:gap-4 lg:right-[2%] lg:gap-7 lg:[--pp-w:clamp(300px,32vw,520px)] lg:[--pp-x:0px]"
            style={{
              // --pp-x shifts the whole fan rightward on narrow screens so it
              // stops bleeding off the left edge and reads inside the band; 0 at
              // lg+ where the two-column layout already places it (2026-06-24).
              transform:
                'translateY(-50%) translateX(var(--pp-x, 0px)) rotateX(10deg) rotateY(-32deg) rotateZ(8deg)',
              transformStyle: 'preserve-3d',
            }}
          >
            {[...webPages.shots].reverse().map((s, i, arr) => {
              const dir = i % 2 === 0 ? 1 : -1
              // i=0 (leftmost, Note) = farthest/smallest; last (Gear) = nearest/largest
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

        {/* RIGHT: copy. On mobile the angled pages fill the background and can
            climb over this text, so the copy sits on an OPAQUE card that matches
            the section's background (teal) — it can't be seen through, so the
            text always reads on top of the mockups (#2, 2026-06-20). At lg+ the
            two-column layout keeps them apart, so the card backing is dropped. */}
        <div className="relative z-20 order-1 lg:order-2 lg:pt-0">
          <div className="mx-6 mt-6 border border-white/70 bg-[#1c8aa6] bg-[linear-gradient(105deg,rgba(55,192,144,0.55)_0%,rgba(43,152,160,0.35)_55%,rgba(39,102,176,0.45)_100%)] px-5 py-6 sm:mx-10 lg:mx-0 lg:mt-0 lg:border-0 lg:bg-transparent lg:bg-none lg:p-0 lg:pr-[8%]">
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
        // Width is driven by the --pp-w CSS var set on the fan wrapper so it can
        // be halved on narrow viewports and restored at lg+ (Joshua, 2026-06-24).
        width: 'var(--pp-w, clamp(300px, 32vw, 520px))',
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
