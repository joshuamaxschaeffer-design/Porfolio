'use client'

import Image from 'next/image'
import Link from 'next/link'
import { useReducedMotion } from 'motion/react'
import { useEffect, useRef, useState } from 'react'

export interface SecondaryRowProps {
  heading?: string
}

/* --- Wingstop flavor chips: scattered around the phone ------------------- *
 * Positions/rotations mirror the Figma scatter. Each chip gets a parallax
 * phase so it bobs up/down a few px and rotates ±~20° as the section scrolls.
 */
interface Chip {
  src: string
  /** % left/top within the green panel */
  left: number
  top: number
  /** rendered width in px (desktop) */
  size: number
  /** base rotation (deg) */
  rot: number
  /** parallax phase 0..1 — staggers motion between chips */
  phase: number
}

const CHIPS: Chip[] = [
  { src: '/wingstop/flavor-chips/dragon-breath.png', left: -4, top: 12, size: 92, rot: 14, phase: 0.0 },
  { src: '/wingstop/flavor-chips/lemon-garlic.png', left: 10, top: -7, size: 120, rot: 33, phase: 0.2 },
  { src: '/wingstop/flavor-chips/atomic-bbq.png', left: -7, top: 44, size: 150, rot: -18, phase: 0.45 },
  { src: '/wingstop/flavor-chips/bayou-bbq.png', left: 58, top: 30, size: 150, rot: -22, phase: 0.65 },
  { src: '/wingstop/flavor-chips/mango-volcano.png', left: 74, top: 8, size: 120, rot: -4, phase: 0.8 },
  { src: '/wingstop/flavor-chips/hot-lemon.png', left: 70, top: 58, size: 150, rot: -22, phase: 1.0 },
]

/**
 * Home secondary row (Figma 335-73147): Wingstop (green) + Samsung (black) side
 * by side, then the Full Capabilities card (3 staggered phone screens) below.
 */
export function SecondaryRow(_props: SecondaryRowProps) {
  return (
    <section className="home-container py-20 md:py-28">
      <div className="grid gap-7 lg:grid-cols-2">
        <WingstopCard />
        <SamsungCard />
      </div>
      <CapabilitiesCard />
    </section>
  )
}

/* --- Wingstop --------------------------------------------------------------*/

function WingstopCard() {
  const reduce = useReducedMotion()
  const ref = useRef<HTMLDivElement>(null)
  const [p, setP] = useState(0)

  useEffect(() => {
    if (reduce) return
    const el = ref.current
    if (!el) return
    let raf = 0
    const onScroll = () => {
      cancelAnimationFrame(raf)
      raf = requestAnimationFrame(() => {
        const r = el.getBoundingClientRect()
        // 0 when section centered in viewport; ±1 toward the edges.
        const prog = (window.innerHeight / 2 - (r.top + r.height / 2)) / (window.innerHeight || 1)
        setP(Math.max(-1.2, Math.min(1.2, prog)))
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
    <Link href="/work/wingstop" className="group block">
      <div
        ref={ref}
        className="relative h-[560px] overflow-hidden rounded-[10px] bg-[#00a653] md:h-[600px]"
      >
        {/* phone, centered (sits high so chips + label have room) */}
        <div className="absolute left-1/2 top-[3%] w-[40%] max-w-[230px] -translate-x-1/2">
          <div className="overflow-hidden rounded-[1.6rem] border-[5px] border-black/85 bg-black shadow-[0_24px_44px_rgba(0,0,0,0.3)]">
            <Image
              src="/wingstop/mobileapp/m-flavor-customize.webp"
              alt="Wingstop app — flavor customization"
              width={750}
              height={1624}
              sizes="(max-width: 1024px) 40vw, 220px"
              className="h-auto w-full"
            />
          </div>
        </div>

        {/* scattered flavor chips — bob + rotate on scroll (parallax) */}
        {CHIPS.map((c, i) => {
          // smooth phase-offset oscillation; amplitude scales with chip size.
          const wave = Math.sin((p * Math.PI) + c.phase * Math.PI * 2)
          const bob = reduce ? 0 : wave * (10 + c.size * 0.05)
          const spin = reduce ? c.rot : c.rot + wave * 20
          return (
            <div
              key={i}
              className="pointer-events-none absolute will-change-transform"
              style={{
                left: `${c.left}%`,
                top: `${c.top}%`,
                width: `clamp(${c.size * 0.6}px, ${c.size / 6}vw, ${c.size}px)`,
                transform: `translateY(${bob}px) rotate(${spin}deg)`,
                filter: 'drop-shadow(6px 18px 12px rgba(0,0,0,0.28))',
              }}
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={c.src} alt="" aria-hidden className="h-auto w-full" />
            </div>
          )
        })}

        {/* label card */}
        <LabelCard
          className="border-white text-white"
          logo={
            // eslint-disable-next-line @next/next/no-img-element
            <img src="/wingstop/logo/wingstop-white.svg" alt="Wingstop" className="h-[60px] w-auto" />
          }
          title="App + Digital"
          pills={['Lead Design', 'Art Director', 'UX', 'UI']}
        />
      </div>
    </Link>
  )
}

/* --- Samsung ---------------------------------------------------------------*/

function SamsungCard() {
  return (
    <Link href="/work/samsung" className="group block">
      <div className="relative h-[560px] overflow-hidden rounded-[10px] bg-black md:h-[600px]">
        {/* interactive table device, bleeding off the top */}
        <div className="absolute -left-[14%] -top-[18%] w-[120%]">
          <Image
            src="/samsung/work/table-device.webp"
            alt="Samsung Galaxy interactive retail table"
            width={3226}
            height={2985}
            sizes="(max-width: 1024px) 90vw, 600px"
            className="h-auto w-full"
          />
        </div>

        <LabelCard
          className="border-white text-white"
          logo={
            // eslint-disable-next-line @next/next/no-img-element
            <img src="/samsung/brand/samsung-wordmark-white.png" alt="Samsung" className="h-[26px] w-auto" />
          }
          title="Digital + Social"
          pills={['Design', 'UI', 'UX', 'Social Posts']}
        />
      </div>
    </Link>
  )
}

/* --- shared inset label card ---------------------------------------------- */

function LabelCard({
  logo,
  title,
  pills,
  className,
}: {
  logo: React.ReactNode
  title: string
  pills: string[]
  className?: string
}) {
  return (
    <div
      className={`absolute inset-x-5 bottom-5 flex flex-col items-center gap-4 rounded-[6px] border bg-transparent px-6 py-7 text-center backdrop-blur-[2px] transition-transform duration-300 group-hover:-translate-y-1 ${className || ''}`}
    >
      <span className="flex h-[64px] items-center justify-center">{logo}</span>
      <p
        className="uppercase"
        style={{ fontFamily: 'var(--font-heading)', fontWeight: 500, fontSize: 'clamp(18px, 1.8vw, 26px)' }}
      >
        {title}
      </p>
      <ul className="flex flex-wrap justify-center gap-2.5">
        {pills.map((p) => (
          <li
            key={p}
            className="rounded-[2px] border border-current px-2 py-1"
            style={{ fontFamily: 'var(--font-body)', fontSize: '14px' }}
          >
            {p}
          </li>
        ))}
      </ul>
    </div>
  )
}

/* --- Full Capabilities: 3 staggered phone screens ------------------------- */

const CAP_PHONES = [
  { src: '/capabilities/cbtl/ui-1.webp', alt: 'Coffee Bean & Tea Leaf app', w: 560, h: 996 },
  { src: '/capabilities/dnb/app-1.webp', alt: 'Dave & Buster’s rewards app', w: 560, h: 1213 },
  { src: '/capabilities/trees/ui-1.webp', alt: 'Trees goal-setting app', w: 560, h: 1212 },
]

function CapabilitiesCard() {
  return (
    <Link href="/work/capabilities" className="group mt-7 block">
      <div className="relative overflow-hidden rounded-[10px] border border-[#dcdce1] bg-[#f3f3f3]">
        <div className="grid items-center gap-8 p-8 md:grid-cols-[minmax(0,360px)_minmax(0,1fr)] md:p-12">
          {/* copy */}
          <div>
            <p
              className="uppercase text-[#070e2c]"
              style={{ fontFamily: 'var(--font-heading)', fontWeight: 500, fontSize: 'clamp(20px, 2vw, 28px)' }}
            >
              Full Capabilities
            </p>
            <p
              className="mt-5 max-w-sm text-[#242627]"
              style={{ fontFamily: 'var(--font-body)', fontSize: '17px', lineHeight: 1.5 }}
            >
              Countless clients and consistent deliverables across design
              disciplines, form factors, and use cases.
            </p>
            <span className="mt-6 inline-flex items-center gap-2 text-sm font-medium text-[#070e2c]">
              See the full range
              <span aria-hidden className="transition-transform group-hover:translate-x-0.5">→</span>
            </span>
          </div>

          {/* three phones, staggered down left→right */}
          <div className="relative h-[320px] md:h-[400px]">
            {CAP_PHONES.map((p, i) => (
              <div
                key={p.src}
                className="absolute w-[34%] max-w-[190px] overflow-hidden rounded-[1.5rem] border-[5px] border-[#1a1a1a] bg-[#1a1a1a] shadow-[0_22px_44px_rgba(0,0,0,0.22)] transition-transform duration-300 group-hover:-translate-y-1"
                style={{
                  left: `${i * 30}%`,
                  top: `${i * 34}px`,
                  zIndex: i,
                  transitionDelay: `${i * 40}ms`,
                }}
              >
                <Image
                  src={p.src}
                  alt={p.alt}
                  width={p.w}
                  height={p.h}
                  sizes="(max-width: 1024px) 30vw, 160px"
                  className="h-auto w-full"
                />
              </div>
            ))}
          </div>
        </div>
      </div>
    </Link>
  )
}
