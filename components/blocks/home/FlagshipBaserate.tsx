'use client'

import Image from 'next/image'
import Link from 'next/link'
import { useReducedMotion } from 'motion/react'
import { useEffect, useRef, useState } from 'react'
import { BaserateLogo } from '../baserate/BaserateLogo'

export interface FlagshipBaserateProps {
  title?: string
  oneLine?: string
  meta?: string
  href?: string
}

/**
 * Home flagship #1 — Baserate (Figma 335-45893). A full-bleed navy field. The
 * Figma frame is just the white "FULL STACK DESIGN" card + gold pills; per the
 * build decision we reuse the Baserate case-study device render as the media so
 * it reads finished. Card sits left, the angled product device floats right
 * with a gentle scroll parallax (disabled under reduced motion).
 */
const PILLS = ['Branding', 'Lead', 'UX', 'UI', 'Strategy']

export function FlagshipBaserate({
  oneLine = 'The investment operating system for family offices — brand, UI, and marketing site, designed end to end. 70+ features.',
  meta = 'Lead Product & Brand Designer · 2022–2024',
  href = '/work/baserate',
}: FlagshipBaserateProps) {
  const reduce = useReducedMotion()
  const wrap = useRef<HTMLDivElement>(null)
  const [shift, setShift] = useState(0)

  useEffect(() => {
    if (reduce) return
    const el = wrap.current
    if (!el) return
    let raf = 0
    const onScroll = () => {
      cancelAnimationFrame(raf)
      raf = requestAnimationFrame(() => {
        const r = el.getBoundingClientRect()
        // progress: -1 (below viewport) → 1 (above). Drives a small float.
        const p = (window.innerHeight / 2 - (r.top + r.height / 2)) / window.innerHeight
        setShift(Math.max(-1, Math.min(1, p)))
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
      data-flagship="Baserate"
      className="relative isolate w-screen left-1/2 right-1/2 -mx-[50vw] overflow-hidden bg-[#070e2c] text-white"
    >
      {/* deep navy radial field */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 -z-10"
        style={{
          background:
            'radial-gradient(120% 100% at 72% 8%, #15336e 0%, #0c1c44 42%, #050a1e 100%)',
        }}
      />
      <div ref={wrap} className="home-container py-24 md:py-36">
        <div className="grid items-center gap-12 lg:grid-cols-[minmax(0,440px)_minmax(0,1fr)] lg:gap-16">
          {/* CARD — logo + FULL STACK DESIGN + gold pills (Figma) */}
          <div className="order-2 lg:order-1">
            <div className="inline-flex w-full max-w-[440px] flex-col gap-[22px] rounded-[8px] border border-white/12 bg-white px-8 py-10 shadow-[0_24px_60px_rgba(0,0,0,0.35)]">
              <BaserateLogo className="h-[42px] w-auto" />
              <div className="flex flex-col gap-5">
                <p
                  className="uppercase text-[#070e2c]"
                  style={{
                    fontFamily: 'var(--font-heading)',
                    fontWeight: 500,
                    fontSize: 'clamp(20px, 2.2vw, 28px)',
                  }}
                >
                  Full Stack Design
                </p>
                <ul className="flex flex-wrap gap-3">
                  {PILLS.map((p) => (
                    <li
                      key={p}
                      className="rounded-[2px] border border-[#ae7d00] px-2 py-1.5 text-[#ae7d00]"
                      style={{ fontFamily: 'var(--font-body)', fontSize: '16px' }}
                    >
                      {p}
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            {/* one-line + meta + link, under the card */}
            <p
              className="mt-8 max-w-md text-white/80"
              style={{ fontFamily: 'var(--font-body)', fontSize: '17px', lineHeight: 1.5 }}
            >
              {oneLine}
            </p>
            <p
              className="mt-4 uppercase tracking-[0.12em] text-white/45"
              style={{ fontFamily: 'var(--font-data)', fontSize: '12px' }}
            >
              {meta}
            </p>
            <Link
              href={href}
              className="group mt-7 inline-flex items-center gap-2 rounded-full border border-white/40 px-6 py-3 text-sm font-medium text-white transition-colors hover:bg-white hover:text-[#070e2c]"
            >
              Read the case study
              <span aria-hidden className="transition-transform group-hover:translate-x-0.5">→</span>
            </Link>
          </div>

          {/* MEDIA — angled Baserate device render, floats on scroll */}
          <div className="relative order-1 lg:order-2">
            <div
              className="relative mx-auto w-full max-w-[640px] will-change-transform"
              style={{ transform: reduce ? undefined : `translateY(${shift * -26}px)` }}
            >
              <Image
                src="/baserate/branding/devices/desktop/poster-v2.webp"
                alt="Baserate — the investment operating system, shown on a tablet"
                width={1478}
                height={1612}
                sizes="(max-width: 1024px) 90vw, 600px"
                className="h-auto w-full drop-shadow-[0_40px_80px_rgba(0,0,0,0.45)]"
                priority={false}
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
