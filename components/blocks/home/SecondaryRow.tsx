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
  // mango-volcano — top-right, bleeds off the right edge (Figma parent-group chip)
  { src: '/home/wingstop/chip-mango-volcano.webp', boxLeft: 455, boxTop: 8, boxSize: 184.89, imgPct: 93.36, rot: -4.24, shadow: '10px 34px 14px rgba(0,0,0,0.25)', phase: 0.35 },
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

  // SCROLL transform for parallax — noticeably rotates + drifts (instant, no
  // transition so it tracks the scroll position 1:1).
  const chipScroll = (c: Chip) => {
    const wave = Math.sin(p * Math.PI + c.phase * Math.PI * 2)
    const wave2 = Math.cos(p * Math.PI + c.phase * Math.PI * 2)
    const bob = reduce ? 0 : wave * 16
    const drift = reduce ? 0 : wave2 * 8
    const spin = reduce ? c.rot : c.rot + wave * 16
    return `translate(${drift}px, ${bob}px) rotate(${spin}deg)`
  }

  // HOVER spread vector: push each chip away from the panel centre (570×720 →
  // centre 285,360). Baked as CSS vars so the INNER layer eases on group-hover,
  // composing with the OUTER scroll transform (nested transforms multiply).
  const FRAME_CX = 285, FRAME_CY = 360
  const spreadVec = (c: Chip) => {
    const cx = c.boxLeft + c.boxSize / 2
    const cy = c.boxTop + c.boxSize / 2
    let dx = cx - FRAME_CX, dy = cy - FRAME_CY
    const len = Math.hypot(dx, dy) || 1
    const PUSH = 26 // px of outward spread on hover
    return { x: (dx / len) * PUSH, y: (dy / len) * PUSH }
  }

  const renderChip = (c: Chip, i: number) => {
    const s = spreadVec(c)
    return (
      <div
        key={i}
        className="pointer-events-none absolute will-change-transform"
        style={{ left: pctX(c.boxLeft), top: pctY(c.boxTop), width: pctX(c.boxSize), aspectRatio: '1' }}
      >
        {/* OUTER = live scroll transform (instant) */}
        <div className="h-full w-full will-change-transform" style={{ transform: chipScroll(c) }}>
          {/* INNER = hover spread + scale (CSS-transitioned, composes w/ scroll) */}
          <div
            className="flex h-full w-full items-center justify-center transition-transform duration-500 ease-out [transform:translate(0,0)_scale(1)] group-hover:[transform:translate(var(--sx),var(--sy))_scale(1.14)]"
            style={{ ['--sx' as string]: `${s.x}px`, ['--sy' as string]: `${s.y}px` }}
          >
            <div style={{ width: `${c.imgPct}%`, aspectRatio: '1', filter: `drop-shadow(${c.shadow})` }}>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={c.src} alt="" aria-hidden className="h-full w-full object-contain" />
            </div>
          </div>
        </div>
      </div>
    )
  }

  // CHIPS[0] (lemon-garlic, top) sits ON TOP of the card, NOT clipped — it pops
  // above the panel edge (per the Figma) so the composition feels dynamic. The
  // rest are clipped inside the green panel.
  const [topChip, ...innerChips] = CHIPS

  return (
    <Link ref={ref} href="/work/wingstop" className="group block">
      {/* outer wrapper is NOT clipped, so the top chip can overflow the panel.
          Container stays a fixed size; only the inner label box grows on hover. */}
      <div className="relative aspect-[570/720] w-full">
        {/* the green panel — clips the phone + inner chips */}
        <div className="absolute inset-0 overflow-hidden rounded-[4px] bg-[#00a653]">
          {/* phone screen — exact Figma box; bleeds down behind the label card.
              On hover it scales up + drifts DOWN to make room for the spreading
              chips (transform-origin top so it grows downward). */}
          <div
            className="absolute origin-top transition-transform duration-500 ease-out will-change-transform group-hover:[transform:translateY(26px)_scale(1.08)]"
            style={{ left: pctX(124), top: pctY(28), width: pctX(323), height: pctY(551) }}
          >
            <Image
              src="/home/wingstop/screen.webp"
              alt="Wingstop app — flavor quantities"
              fill
              sizes="(min-width: 768px) 27vw, 56vw"
              className="object-contain object-top"
            />
          </div>

          {/* scattered flavor chips (clipped to panel) — drift + rotate on scroll */}
          {innerChips.map((c, i) => renderChip(c, i + 1))}

          {/* label card — bottom inset, white border, SOLID green (phone bleeds behind) */}
          <LabelCard
            bg="#00a653"
            logo={
              // eslint-disable-next-line @next/next/no-img-element
              <img src="/home/wingstop/wingd-logo.webp" alt="Wingstop" className="w-[53%] object-contain" />
            }
            title="App + Digital"
            pills={['Lead Design', 'Art Director', 'UX', 'UI']}
          />
        </div>

        {/* the one chip that pops OUT on top (not clipped) */}
        {renderChip(topChip, 0)}
      </div>
    </Link>
  )
}

/* --- Samsung --------------------------------------------------------------- */

function SamsungCard() {
  return (
    <Link href="/work/samsung" className="group block">
      {/* container stays fixed; only the inner label box grows on hover */}
      <div className="relative aspect-[570/720] w-full overflow-hidden rounded-[4px] bg-black">
        {/* interactive table device — exact Figma box, bleeds off top-left.
            Scales up on hover (origin at the table's visible centre). */}
        <div
          className="absolute origin-[60%_45%] transition-transform duration-500 ease-out will-change-transform group-hover:scale-[1.07]"
          style={{ left: pctX(-154), top: pctY(-259), width: pctX(1180), height: pctY(1091) }}
        >
          <Image
            src="/home/samsung/table.webp"
            alt="Samsung Galaxy interactive retail table"
            fill
            sizes="(min-width: 768px) 99vw, 207vw"
            className="object-contain object-left-top"
          />
        </div>

        <LabelCard
          bg="#000000"
          logo={
            // eslint-disable-next-line @next/next/no-img-element
            <img src="/samsung/brand/samsung-wordmark-white.svg" alt="Samsung" className="w-[62%] object-contain" />
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
  bg,
}: {
  logo: React.ReactNode
  title: string
  pills: string[]
  /** solid card background so the bleeding phone/table doesn't show through */
  bg: string
}) {
  return (
    <div
      className="absolute flex origin-center flex-col items-center overflow-hidden rounded-[4px] border border-white text-white transition-transform duration-500 ease-out will-change-transform group-hover:scale-[0.94]"
      style={{ left: pctX(24), top: pctY(423), width: pctX(522), height: pctY(270), backgroundColor: bg }}
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
  { src: '/capabilities/cbtl/ui-2.webp', alt: 'Coffee Bean & Tea Leaf app', w: 560, h: 1197 },
  { src: '/capabilities/dnb/app-1.webp', alt: 'Dave & Buster’s rewards app', w: 560, h: 1213 },
  { src: '/capabilities/trees/ui-1.webp', alt: 'Trees goal-setting app', w: 560, h: 1212 },
]

function CapabilitiesCard() {
  const reduce = useReducedMotion()
  const ref = useRef<HTMLDivElement>(null)
  const [p, setP] = useState(0)

  // scroll progress through the card: 0 when its top enters the viewport bottom,
  // 1 when it's scrolled to the viewport middle — drives the rightward spread.
  useEffect(() => {
    if (reduce) return
    const el = ref.current
    if (!el) return
    let raf = 0
    const onScroll = () => {
      cancelAnimationFrame(raf)
      raf = requestAnimationFrame(() => {
        const r = el.getBoundingClientRect()
        const vh = window.innerHeight || 1
        // 0 as the card rises from the bottom, → 1 once it passes the middle.
        const prog = (vh - r.top) / (vh * 0.9)
        setP(Math.max(0, Math.min(1, prog)))
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

          {/* phones ~2x bigger; the row is a fixed height so the bottoms clip
              against the card edge (intentional). They start clustered and
              SPREAD OUT to the right as the card scrolls into view (each phone
              fans further than the last); static under reduced motion. */}
          <div ref={ref} className="relative h-[300px] md:h-[360px]">
            {CAP_PHONES.map((ph, i) => {
              // base stagger + scroll-driven rightward spread (grows per phone).
              // The spread is CAPPED (progress clamped to SPREAD_MAX) so it stops
              // expanding once it reaches this fanned-out state, and a strong
              // cubic EASE-OUT is applied so the fan-out lands softly/smoothly.
              const SPREAD_MAX = 0.6
              const pc = Math.min(p, SPREAD_MAX) / SPREAD_MAX // 0..1 within the cap
              const eased = 1 - Math.pow(1 - pc, 3) // cubic ease-out (soft landing)
              const baseLeft = i * 14
              const spread = reduce ? i * 8 : i * (8 + eased * (16 * SPREAD_MAX))
              return (
              <div
                key={ph.src}
                className="absolute w-[58%] max-w-[300px] overflow-hidden rounded-[2rem] border-[6px] border-[#1a1a1a] bg-[#1a1a1a] shadow-[0_26px_50px_rgba(0,0,0,0.24)] transition-transform duration-300 group-hover:-translate-y-1.5 will-change-transform"
                style={{ left: `${baseLeft + spread}%`, top: `${i * 52}px`, zIndex: CAP_PHONES.length - i, transitionDelay: `${i * 40}ms` }}
              >
                <Image
                  src={ph.src}
                  alt={ph.alt}
                  width={ph.w}
                  height={ph.h}
                  sizes="(min-width: 1024px) 300px, 56vw"
                  className="h-auto w-full"
                />
              </div>
              )
            })}
          </div>
        </div>
      </div>
    </Link>
  )
}
