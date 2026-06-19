'use client'

import { useEffect, useRef, useState } from 'react'

const W = '/samsung/work'

/**
 * StoreLocatorPopout — the S7 store locator the way Joshua's Behance comp shows
 * it (3rd feedback, 2026-06-19): on a light-grey full-bleed band, the larger
 * Galaxy S6 store PAGE sits to the LEFT, rotated; the "FIND A STORE" panel pops
 * out OVER the locator area within that page, sitting further left + down, and
 * scales up slightly on scroll. Copy lives to the RIGHT of the visuals. The
 * band is tall so more of the full page shows. Sharp corners only.
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

  const scale = reduce.current ? 1 : 1 + t * 0.06
  const lift = reduce.current ? 0 : (1 - t) * 34

  return (
    <div ref={ref} className="relative overflow-hidden bg-[#dfe2e7] py-16 md:py-24">
      <div className="br-container">
        <div className="grid grid-cols-1 items-center gap-10 lg:grid-cols-[1.55fr_1fr]">
          {/* LEFT: the layered visuals, in a tall stage so the full page shows */}
          <div
            className="relative order-2 min-h-[560px] lg:order-1 lg:min-h-[760px]"
            style={{ perspective: '2200px', perspectiveOrigin: '45% 45%' }}
          >
            {/* BEHIND: the larger S6 store page, pushed further left, rotated more */}
            <figure
              className="absolute left-[-14%] top-[6%] w-[92%] overflow-hidden ring-1 ring-black/10"
              style={{
                transform: 'rotateX(8deg) rotateY(6deg) rotateZ(-5deg)',
                transformStyle: 'preserve-3d',
                boxShadow: '0 40px 70px -30px rgba(20,30,50,0.45)',
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

            {/* IN FRONT: the FIND A STORE panel pops out and FULLY COVERS the
                locator that lives on the back page (so the map reads once).
                Pushed further left + bigger to blanket the back page's locator
                region. scroll-grows. */}
            <figure
              className="absolute left-[2%] top-[38%] w-[102%] overflow-hidden ring-1 ring-black/10"
              style={{
                transform: `rotateX(10deg) rotateY(4deg) rotateZ(-5deg) scale(${scale}) translateY(${lift}px)`,
                transformOrigin: 'left center',
                transformStyle: 'preserve-3d',
                boxShadow: '0 70px 120px -30px rgba(20,30,50,0.6), 0 24px 56px -18px rgba(20,30,50,0.45)',
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

          {/* RIGHT: copy */}
          <div className="relative order-1 pt-14 lg:order-2 lg:pt-0">
            <p className="br-data text-[12px] font-semibold uppercase tracking-[0.2em] text-[#2f6aa0]">
              S7 Store Locator
            </p>
            <h3 className="mt-3 text-[26px] font-semibold leading-tight text-[#16181d] md:text-[34px]">
              Helping customers find a store
            </h3>
            <p className="mt-4 max-w-md text-[15px] leading-normal text-[#4b515c] md:text-base">
              Full-page design and UI for the S7 launch, locating a nearby store to buy the device.
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
