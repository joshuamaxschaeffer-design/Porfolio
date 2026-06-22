'use client'

import Image from 'next/image'
import Link from 'next/link'
import { useReducedMotion } from 'motion/react'
import { useEffect, useRef, useState } from 'react'

export interface SecondaryRowProps {
  heading?: string
}

/* ───────────────────────────────────────────────────────────────────────────
 * Home secondary row — 1:1 from Figma 335-73147. Each card is the Figma's
 * 570×720 frame reproduced as an aspect-ratio box; every child is positioned
 * with the EXACT Figma px expressed as % of 570×720 so it scales perfectly at
 * any width. Wingstop = green #00a653 (phone screen + 5 scattered flavor chips
 * + bottom label card the phone bleeds behind). Samsung = black (interactive
 * table bleeding top-left + bottom label card). Then the Full Capabilities card.
 * ─────────────────────────────────────────────────────────────────────────── */

const FW = 570 // figma frame width
const FH = 720 // figma frame height
const pctX = (px: number) => `${(px / FW) * 100}%`
const pctY = (px: number) => `${(px / FH) * 100}%`

/** A flavor chip exactly as Figma: a square centering box (rotated) holding the
 *  art at `imgPct` of the box. `phase` staggers the scroll parallax. */
interface Chip {
  src: string
  boxLeft: number
  boxTop: number
  boxSize: number // px (square)
  imgPct: number // art size as % of box
  rot: number
  shadow: string
  phase: number
}

// px values lifted verbatim from the Figma dev code (node 335:73168).
const CHIPS: Chip[] = [
  { src: '/home/wingstop/chip-lemon-garlic.webp', boxLeft: 25, boxTop: -65, boxSize: 191.81, imgPct: 72.18, rot: 33.44, shadow: '4px 14px 12px rgba(0,0,0,0.25)', phase: 0.0 },
  { src: '/home/wingstop/chip-dragon-breath.webp', boxLeft: -43.53, boxTop: 90.47, boxSize: 163.57, imgPct: 76.89, rot: -21.88, shadow: '4px 14px 12px rgba(0,0,0,0.25)', phase: 0.25 },
  { src: '/home/wingstop/chip-atomic-bbq.webp', boxLeft: -48, boxTop: 249, boxSize: 224.5, imgPct: 76.89, rot: -21.88, shadow: '10px 34px 14px rgba(0,0,0,0.25)', phase: 0.5 },
  { src: '/home/wingstop/chip-bayou-bbq.webp', boxLeft: 335, boxTop: 221, boxSize: 224.5, imgPct: 76.89, rot: -21.88, shadow: '10px 34px 14px rgba(0,0,0,0.25)', phase: 0.7 },
  { src: '/home/wingstop/chip-hot-lemon.webp', boxLeft: 452, boxTop: 416, boxSize: 222.85, imgPct: 76.89, rot: -21.88, shadow: '10px 34px 14px rgba(0,0,0,0.25)', phase: 0.9 },
]

export function SecondaryRow(_props: SecondaryRowProps) {
  return (
    <section className="home-container py-16 md:py-20">
      {/* two 570:720 cards, equal — match the Figma 24px gap (~4% of 570) */}
      <div className="grid gap-5 md:grid-cols-2 md:gap-6">
        <WingstopCard />
        <SamsungCard />
      </div>
      <CapabilitiesCard />
    </section>
  )
}

/* --- Wingstop -------------------------------------------------------------- */

function WingstopCard() {
  const reduce = useReducedMotion()
  const ref = useRef<HTMLAnchorElement>(null)
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
    <Link ref={ref} href="/work/wingstop" className="group block">
      <div className="relative aspect-[570/720] w-full overflow-hidden rounded-[4px] bg-[#00a653]">
        {/* phone screen — exact Figma box; bleeds down behind the label card */}
        <div
          className="absolute"
          style={{ left: pctX(124), top: pctY(28), width: pctX(323), height: pctY(551) }}
        >
          <Image
            src="/home/wingstop/screen.webp"
            alt="Wingstop app — flavor quantities"
            fill
            sizes="(max-width: 768px) 56vw, 290px"
            className="object-contain object-top"
          />
        </div>

        {/* scattered flavor chips — bob + rotate on scroll (parallax) */}
        {CHIPS.map((c, i) => {
          const wave = Math.sin(p * Math.PI + c.phase * Math.PI * 2)
          const bob = reduce ? 0 : wave * 6
          const spin = reduce ? c.rot : c.rot + wave * 6
          return (
            <div
              key={i}
              className="pointer-events-none absolute"
              style={{ left: pctX(c.boxLeft), top: pctY(c.boxTop), width: pctX(c.boxSize), aspectRatio: '1' }}
            >
              <div
                className="flex h-full w-full items-center justify-center"
                style={{ transform: `translateY(${bob}px) rotate(${spin}deg)` }}
              >
                <div style={{ width: `${c.imgPct}%`, aspectRatio: '1', filter: `drop-shadow(${c.shadow})` }}>
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={c.src} alt="" aria-hidden className="h-full w-full object-contain" />
                </div>
              </div>
            </div>
          )
        })}

        {/* label card — bottom inset, white border, green bg (phone bleeds behind) */}
        <LabelCard
          logo={
            // eslint-disable-next-line @next/next/no-img-element
            <img src="/home/wingstop/wingd-logo.webp" alt="Wingstop" className="w-[53%] object-contain" />
          }
          title="App + Digital"
          pills={['Lead Design', 'Art Director', 'UX', 'UI']}
        />
      </div>
    </Link>
  )
}

/* --- Samsung --------------------------------------------------------------- */

function SamsungCard() {
  return (
    <Link href="/work/samsung" className="group block">
      <div className="relative aspect-[570/720] w-full overflow-hidden rounded-[4px] bg-black">
        {/* interactive table device — exact Figma box, bleeds off top-left */}
        <div
          className="absolute"
          style={{ left: pctX(-154), top: pctY(-259), width: pctX(1180), height: pctY(1091) }}
        >
          <Image
            src="/home/samsung/table.webp"
            alt="Samsung Galaxy interactive retail table"
            fill
            sizes="(max-width: 768px) 110vw, 600px"
            className="object-contain object-left-top"
          />
        </div>

        <LabelCard
          logo={
            // eslint-disable-next-line @next/next/no-img-element
            <img src="/samsung/brand/samsung-wordmark-white.png" alt="Samsung" className="w-[62%] object-contain" />
          }
          title="Digital + Social"
          pills={['Design', 'UI', 'UX', 'Social Posts']}
        />
      </div>
    </Link>
  )
}

/* --- shared label card (Figma: left 24, top 423, 522×270, white border) ----- */

function LabelCard({
  logo,
  title,
  pills,
}: {
  logo: React.ReactNode
  title: string
  pills: string[]
}) {
  return (
    <div
      className="absolute flex flex-col items-center overflow-hidden rounded-[4px] border border-white text-white transition-transform duration-300 group-hover:-translate-y-1"
      style={{ left: pctX(24), top: pctY(423), width: pctX(522), height: pctY(270) }}
    >
      {/* logo zone — top ~52% of the card */}
      <div className="flex h-[52%] w-full items-center justify-center pt-[4%]">{logo}</div>
      {/* title + pills */}
      <div className="flex w-full flex-col items-center gap-[clamp(8px,1.6vw,18px)] px-[6%]">
        <p
          className="uppercase leading-none"
          style={{ fontFamily: 'var(--font-heading)', fontWeight: 500, fontSize: 'clamp(15px, 3.4vw, 28px)' }}
        >
          {title}
        </p>
        <ul className="flex flex-wrap justify-center gap-[clamp(6px,1.4vw,16px)]">
          {pills.map((pill) => (
            <li
              key={pill}
              className="rounded-[2px] border border-white px-[8px] py-[6px] leading-none"
              style={{ fontFamily: 'var(--font-body)', fontSize: 'clamp(11px, 2.4vw, 22px)' }}
            >
              {pill}
            </li>
          ))}
        </ul>
      </div>
    </div>
  )
}

/* --- Full Capabilities: 3 staggered phone screens (Figma 335:73171) -------- */

const CAP_PHONES = [
  { src: '/capabilities/cbtl/ui-1.webp', alt: 'Coffee Bean & Tea Leaf app', w: 560, h: 996 },
  { src: '/capabilities/dnb/app-1.webp', alt: 'Dave & Buster’s rewards app', w: 560, h: 1213 },
  { src: '/capabilities/trees/ui-1.webp', alt: 'Trees goal-setting app', w: 560, h: 1212 },
]

function CapabilitiesCard() {
  return (
    <Link href="/work/capabilities" className="group mt-5 block md:mt-6">
      <div className="relative overflow-hidden rounded-[4px] border border-[#dcdce1] bg-[#f3f3f3]">
        <div className="grid items-center gap-8 p-8 md:grid-cols-[minmax(0,360px)_minmax(0,1fr)] md:p-12">
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

          <div className="relative h-[300px] md:h-[380px]">
            {CAP_PHONES.map((ph, i) => (
              <div
                key={ph.src}
                className="absolute w-[34%] max-w-[190px] overflow-hidden rounded-[1.5rem] border-[5px] border-[#1a1a1a] bg-[#1a1a1a] shadow-[0_22px_44px_rgba(0,0,0,0.22)] transition-transform duration-300 group-hover:-translate-y-1"
                style={{ left: `${i * 30}%`, top: `${i * 34}px`, zIndex: i, transitionDelay: `${i * 40}ms` }}
              >
                <Image
                  src={ph.src}
                  alt={ph.alt}
                  width={ph.w}
                  height={ph.h}
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
