'use client'

import { useEffect, useRef, useState } from 'react'

const W = '/samsung/work'

/**
 * StoreLocatorPopout — the S7 store locator the way Joshua's Behance comp shows
 * it (2nd feedback, 2026-06-19): the larger Galaxy S6 store PAGE sits behind on
 * a light-grey backdrop, and the "FIND A STORE NEAR YOU" panel POPS OUT over it
 * at an angle with a drop shadow. The popout scales up slightly as it scrolls
 * into view so it feels like it's coming toward the viewer. Sharp corners only.
 */
export function StoreLocatorPopout() {
  const ref = useRef<HTMLDivElement>(null)
  const [t, setT] = useState(0)
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
        const v = 1 - Math.max(0, Math.min(1, (r.top - vh * 0.12) / (vh * 0.7)))
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

  const scale = reduce.current ? 1 : 1 + t * 0.07
  const lift = reduce.current ? 0 : (1 - t) * 30

  return (
    // light-grey backdrop, just behind this block (matches the Behance grey)
    <div ref={ref} className="relative overflow-hidden bg-[#dfe2e7]">
      <div
        className="relative mx-auto min-h-[560px] max-w-[1180px] px-4 py-16 md:min-h-[680px] md:py-24"
        style={{ perspective: '2000px', perspectiveOrigin: '50% 40%' }}
      >
        {/* BEHIND: the larger S6 store page, angled, anchored top-left */}
        <figure
          className="absolute left-[2%] top-[8%] w-[68%] overflow-hidden ring-1 ring-black/10"
          style={{
            transform: 'rotateX(6deg) rotateZ(-2deg)',
            transformStyle: 'preserve-3d',
            boxShadow: '0 30px 60px -28px rgba(20,30,50,0.4)',
          }}
        >
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={`${W}/store-locator-full.webp`}
            alt="Samsung Galaxy S6 store page with the find-a-store locator"
            loading="lazy"
            draggable={false}
            className="block w-full"
          />
        </figure>

        {/* IN FRONT: the FIND A STORE panel popping out, overlapping, scroll-grows */}
        <figure
          className="absolute right-[3%] top-1/2 w-[62%] overflow-hidden ring-1 ring-black/10"
          style={{
            transform: `translateY(-50%) rotateX(10deg) rotateZ(-3deg) scale(${scale}) translateY(${lift}px)`,
            transformStyle: 'preserve-3d',
            boxShadow: '0 60px 110px -30px rgba(20,30,50,0.55), 0 20px 50px -18px rgba(20,30,50,0.4)',
          }}
        >
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={`${W}/store-locator-module.webp`}
            alt="S7 find-a-store locator panel"
            loading="lazy"
            draggable={false}
            className="block w-full"
          />
        </figure>
      </div>
    </div>
  )
}
