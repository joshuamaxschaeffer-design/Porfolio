'use client'

import Image from 'next/image'
import Link from 'next/link'
import { useReducedMotion } from 'motion/react'
import { useEffect, useRef, useState } from 'react'

export interface FlagshipPandaProps {
  title?: string
  oneLine?: string
  meta?: string
  href?: string
}

const PILLS = ['Lead Design', 'Art Director', 'UX', 'UI']

/** Phone screen in a thin dark bezel — reuses the case-study app screenshots. */
function PhoneScreen({
  src,
  alt,
  className,
  priority,
}: {
  src: string
  alt: string
  className?: string
  priority?: boolean
}) {
  return (
    <div
      className={`relative overflow-hidden rounded-[2rem] border-[5px] border-[#1a1a1a] bg-[#1a1a1a] shadow-[0_30px_60px_rgba(120,0,0,0.35)] ${className || ''}`}
    >
      <Image
        src={src}
        alt={alt}
        width={1240}
        height={2684}
        sizes="(max-width: 1024px) 44vw, 270px"
        className="h-auto w-full"
        priority={priority}
      />
    </div>
  )
}

/**
 * Home flagship #2 — Panda Express (Figma 335-72807). Full-bleed red field with
 * a baked CSS sunburst, two overlapping tilted phones (reusing the case-study
 * app screens), the Panda badge, and white-outline pills. Phones drift apart
 * slightly on scroll (parallax), static under reduced motion.
 */
export function FlagshipPanda({
  oneLine = 'Lead designer on the app for America’s largest Asian-dining brand — 4.8★, 16M+ rewards members.',
  meta = 'Lead Designer & Art Director · 2020–2022',
  href = '/work/panda-express',
}: FlagshipPandaProps) {
  const reduce = useReducedMotion()
  const wrap = useRef<HTMLDivElement>(null)
  const [p, setP] = useState(0)

  useEffect(() => {
    if (reduce) return
    const el = wrap.current
    if (!el) return
    let raf = 0
    const onScroll = () => {
      cancelAnimationFrame(raf)
      raf = requestAnimationFrame(() => {
        const r = el.getBoundingClientRect()
        const prog = (window.innerHeight / 2 - (r.top + r.height / 2)) / window.innerHeight
        setP(Math.max(-1, Math.min(1, prog)))
      })
    }
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    window.addEventListener('resize', onScroll)
    return () => {
      cancelAnimationFrame(raf)
      window.removeEventListener('scroll', onScroll)
      window.removeEventListener('resize', onScroll)
    }
  }, [reduce])

  return (
    <section
      data-flagship="Panda Express"
      className="relative isolate w-screen left-1/2 right-1/2 -mx-[50vw] overflow-hidden bg-[#d1282e] text-white"
    >
      {/* deeper red wash + baked sunburst rays */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 -z-10"
        style={{ background: 'radial-gradient(120% 90% at 50% 18%, #e23b35 0%, #c81f25 55%, #9c1418 100%)' }}
      />
      <div aria-hidden className="home-panda-rays pointer-events-none absolute inset-0 -z-10" />

      <div ref={wrap} className="home-container py-24 md:py-32">
        <div className="grid items-center gap-12 lg:grid-cols-2 lg:gap-10">
          {/* PHONES — two overlapping, tilted */}
          <div className="relative order-1 mx-auto h-[420px] w-full max-w-[520px] md:h-[520px]">
            {/* back phone */}
            <div
              className="absolute left-[8%] top-[6%] w-[46%] will-change-transform"
              style={{
                transform: reduce
                  ? 'rotate(-9deg)'
                  : `rotate(-9deg) translate(${p * -14}px, ${p * -10}px)`,
              }}
            >
              <PhoneScreen src="/panda/appstore/appstore-1.webp" alt="Panda Express app — rewards" />
            </div>
            {/* front phone */}
            <div
              className="absolute right-[6%] top-[16%] w-[48%] will-change-transform"
              style={{
                transform: reduce
                  ? 'rotate(6deg)'
                  : `rotate(6deg) translate(${p * 14}px, ${p * 12}px)`,
              }}
            >
              <PhoneScreen
                src="/panda/appstore/appstore-2.webp"
                alt="Panda Express app — menu"
                priority
              />
            </div>
          </div>

          {/* CARD — Panda badge + PANDA EXPRESS APP + white pills */}
          <div className="order-2">
            <div className="flex w-full max-w-[440px] flex-col items-center gap-6 rounded-[8px] border border-white/35 bg-white/[0.07] px-8 py-10 text-center backdrop-blur-sm">
              <span className="flex h-[120px] w-[120px] items-center justify-center rounded-full bg-white shadow-lg">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src="/panda/panda-logo.svg"
                  alt="Panda Express"
                  className="h-[78px] w-[78px] object-contain"
                />
              </span>
              <p
                className="uppercase"
                style={{ fontFamily: 'var(--font-heading)', fontWeight: 500, fontSize: 'clamp(20px, 2.2vw, 28px)' }}
              >
                Panda Express App
              </p>
              <ul className="flex flex-wrap justify-center gap-3">
                {PILLS.map((t) => (
                  <li
                    key={t}
                    className="rounded-[2px] border border-white px-2 py-1.5"
                    style={{ fontFamily: 'var(--font-body)', fontSize: '15px' }}
                  >
                    {t}
                  </li>
                ))}
              </ul>
            </div>

            <p
              className="mx-auto mt-8 max-w-md text-center text-white/90 lg:mx-0 lg:text-left"
              style={{ fontFamily: 'var(--font-body)', fontSize: '17px', lineHeight: 1.5 }}
            >
              {oneLine}
            </p>
            <p
              className="mx-auto mt-4 max-w-md text-center uppercase tracking-[0.12em] text-white/60 lg:mx-0 lg:text-left"
              style={{ fontFamily: 'var(--font-data)', fontSize: '12px' }}
            >
              {meta}
            </p>
            <div className="mt-7 flex justify-center lg:justify-start">
              <Link
                href={href}
                className="group inline-flex items-center gap-2 rounded-full border border-white/60 px-6 py-3 text-sm font-medium text-white transition-colors hover:bg-white hover:text-[#c81f25]"
              >
                Read the case study
                <span aria-hidden className="transition-transform group-hover:translate-x-0.5">→</span>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
