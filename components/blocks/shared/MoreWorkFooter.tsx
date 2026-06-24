'use client'

import Image from 'next/image'
import Link from 'next/link'
import { useCallback, useEffect, useRef, useState } from 'react'
import { BrandingScene } from '../baserate/branding/BrandingScene'
import { RewardsStage } from '../panda/PremiumRewardsSection'
import { BaserateLogo } from '../baserate/BaserateLogo'

/* ───────────────────────────────────────────────────────────────────────────
 * MoreWorkFooter — the shared "More Work" footer that sits at the bottom of
 * every case study (Figma 367-1188). It renders the SAME five project cards
 * across the board (Panda Express, Baserate, Wingstop, Samsung, Full
 * Capabilities), filters out whichever case study the visitor is currently on,
 * and keeps the canonical order. Cards always live in a horizontal, snap +
 * drag carousel (matching the Figma 570-wide row); arrows page through when
 * the cards overflow the viewport.
 *
 * Media reuse: the Panda + Baserate cards reuse the live home-page scene
 * components (RewardsStage / BrandingScene) so the art stays identical to the
 * site — but with their scroll parallax inert (hovered=false, no scroll
 * listeners) since a re-animating scene inside a small card would just thrash.
 * Wingstop (phone screen + scattered flavor chips), Samsung (interactive
 * table) and Capabilities (3 staggered phones) mirror the home SecondaryRow.
 * ─────────────────────────────────────────────────────────────────────────── */

const FW = 570 // figma card width
const FH = 720 // figma card height
const pctX = (px: number) => `${(px / FW) * 100}%`
const pctY = (px: number) => `${(px / FH) * 100}%`

type CardKey = 'panda-express' | 'baserate' | 'wingstop' | 'samsung' | 'capabilities'

interface MoreWorkFooterProps {
  /** Slug of the case study currently being viewed; that card is removed. */
  currentSlug?: string
  heading?: string
}

/* --- shared label card (Figma: left 24, top 423, 522×270, white border) ----- */

function LabelCard({
  logo,
  title,
  pills,
  bg,
  border = 'white',
  text = 'white',
}: {
  logo: React.ReactNode
  title: string
  pills: string[]
  bg: string
  border?: string
  text?: string
}) {
  return (
    <div
      className="absolute flex origin-center flex-col items-center overflow-hidden rounded-[4px] border transition-transform duration-500 ease-out will-change-transform group-hover:scale-[0.94]"
      style={{
        left: pctX(24),
        top: pctY(423),
        width: pctX(522),
        height: pctY(270),
        backgroundColor: bg,
        borderColor: border,
        color: text,
      }}
    >
      <div className="flex h-[52%] w-full items-center justify-center pt-[4%]">{logo}</div>
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
              className="rounded-[2px] border px-[8px] py-[6px] leading-none"
              style={{ fontFamily: 'var(--font-body)', fontSize: 'clamp(11px, 2.4vw, 22px)', borderColor: border }}
            >
              {pill}
            </li>
          ))}
        </ul>
      </div>
    </div>
  )
}

/* --- card frame: the 570:720 aspect box every simple card shares ------------- */

function CardFrame({
  href,
  bg,
  border,
  children,
}: {
  href: string
  bg: string
  border?: string
  children: React.ReactNode
}) {
  return (
    <Link href={href} className="group block">
      <div
        className="relative aspect-[570/720] w-full overflow-hidden rounded-[4px]"
        style={{ backgroundColor: bg, border: border ? `1px solid ${border}` : undefined, containerType: 'inline-size' }}
      >
        {children}
      </div>
    </Link>
  )
}

/* --- Panda Express (red, reuses the live RewardsStage scene) ----------------- */

function PandaCard() {
  return (
    <CardFrame href="/work/panda-express" bg="#d1282e">
      {/* live rewards stage (firework + two reward phones), parallax inert.
          Scaled/positioned to read as the card's hero above the label. */}
      <div className="pointer-events-none absolute inset-x-0 top-0 h-[62%] overflow-hidden">
        <RewardsStage
          hovered={false}
          className="absolute left-1/2 top-[6%] w-[128%] max-w-none -translate-x-1/2 origin-top scale-[1.02]"
        />
      </div>
      <LabelCard
        bg="#d1282e"
        logo={
          <span className="flex h-[clamp(56px,16cqw,116px)] w-[clamp(56px,16cqw,116px)] items-center justify-center rounded-full bg-white shadow-lg">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="/panda/panda-logo.svg" alt="Panda Express" className="h-[62%] w-[62%] object-contain" />
          </span>
        }
        title="Panda Express App"
        pills={['Lead Design', 'Art Director', 'UX', 'UI']}
      />
    </CardFrame>
  )
}

/* --- Baserate (black, reuses the live BrandingScene) ------------------------- */

function BaserateCard() {
  return (
    <CardFrame href="/work/baserate" bg="#000000" border="#d6d6d6">
      {/* live brand & marketing scene (devices + swatches + chips), inert. */}
      <div className="pointer-events-none absolute inset-x-0 top-0 flex h-[62%] items-center justify-center overflow-hidden">
        <BrandingScene hovered={false} className="w-[150%] max-w-none origin-center scale-[0.92]" />
      </div>
      <LabelCard
        bg="#000000"
        logo={<BaserateLogo className="h-[clamp(26px,7cqw,45px)] w-auto" />}
        title="Full Stack Design"
        pills={['Branding', 'Lead', 'UX', 'UI', 'Strategy']}
      />
    </CardFrame>
  )
}

/* --- Wingstop (green, phone screen + scattered flavor chips) ----------------- */

interface Chip {
  src: string
  boxLeft: number
  boxTop: number
  boxSize: number
  imgPct: number
  rot: number
  shadow: string
}

// px values lifted verbatim from the Figma dev code (367:1190 region).
const CHIPS: Chip[] = [
  { src: '/home/wingstop/chip-lemon-garlic.webp', boxLeft: 25, boxTop: -65, boxSize: 191.81, imgPct: 72.18, rot: 33.44, shadow: '4px 14px 12px rgba(0,0,0,0.25)' },
  { src: '/home/wingstop/chip-dragon-breath.webp', boxLeft: -43.53, boxTop: 90.47, boxSize: 163.57, imgPct: 76.89, rot: -21.88, shadow: '4px 14px 12px rgba(0,0,0,0.25)' },
  { src: '/home/wingstop/chip-atomic-bbq.webp', boxLeft: -48, boxTop: 249, boxSize: 224.5, imgPct: 76.89, rot: -21.88, shadow: '10px 34px 14px rgba(0,0,0,0.25)' },
  { src: '/home/wingstop/chip-bayou-bbq.webp', boxLeft: 335, boxTop: 221, boxSize: 224.5, imgPct: 76.89, rot: -21.88, shadow: '10px 34px 14px rgba(0,0,0,0.25)' },
  { src: '/home/wingstop/chip-hot-lemon.webp', boxLeft: 452, boxTop: 416, boxSize: 222.85, imgPct: 76.89, rot: -21.88, shadow: '10px 34px 14px rgba(0,0,0,0.25)' },
  { src: '/home/wingstop/chip-mango-volcano.webp', boxLeft: 455, boxTop: 8, boxSize: 184.89, imgPct: 93.36, rot: -4.24, shadow: '10px 34px 14px rgba(0,0,0,0.25)' },
]

function WingstopCard() {
  const renderChip = (c: Chip, i: number) => (
    <div
      key={i}
      className="pointer-events-none absolute"
      style={{ left: pctX(c.boxLeft), top: pctY(c.boxTop), width: pctX(c.boxSize), aspectRatio: '1' }}
    >
      <div className="flex h-full w-full items-center justify-center" style={{ transform: `rotate(${c.rot}deg)` }}>
        <div style={{ width: `${c.imgPct}%`, aspectRatio: '1', filter: `drop-shadow(${c.shadow})` }}>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={c.src} alt="" aria-hidden className="h-full w-full object-contain" />
        </div>
      </div>
    </div>
  )

  const [topChip, ...innerChips] = CHIPS

  return (
    <Link href="/work/wingstop" className="group block">
      <div className="relative aspect-[570/720] w-full">
        <div className="absolute inset-0 overflow-hidden rounded-[4px] bg-[#00a653]">
          <div
            className="absolute origin-top transition-transform duration-500 ease-out will-change-transform group-hover:[transform:translateY(20px)_scale(1.06)]"
            style={{ left: pctX(124), top: pctY(28), width: pctX(323), height: pctY(551) }}
          >
            <Image
              src="/home/wingstop/screen.webp"
              alt="Wingstop app — flavor quantities"
              fill
              sizes="(min-width: 768px) 27vw, 90vw"
              className="object-contain object-top"
            />
          </div>
          {innerChips.map((c, i) => renderChip(c, i + 1))}
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
        {renderChip(topChip, 0)}
      </div>
    </Link>
  )
}

/* --- Samsung (black, interactive table bleeding top-left) -------------------- */

function SamsungCard() {
  return (
    <Link href="/work/samsung" className="group block">
      <div className="relative aspect-[570/720] w-full overflow-hidden rounded-[4px] border border-white bg-black">
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

/* --- Full Capabilities (white, 3 staggered phone mockups + white text card) -- */

const CAP_PHONES = [
  { src: '/capabilities/cbtl/ui-2.webp', alt: 'Coffee Bean & Tea Leaf app', w: 560, h: 1197 },
  { src: '/capabilities/dnb/app-1.webp', alt: 'Dave & Buster’s rewards app', w: 560, h: 1213 },
  { src: '/capabilities/trees/ui-1.webp', alt: 'Trees goal-setting app', w: 560, h: 1212 },
]

function CapabilitiesCard() {
  return (
    <Link href="/work/capabilities" className="group block">
      <div className="relative aspect-[570/720] w-full overflow-hidden rounded-[4px] border border-[#d6d6d6] bg-white">
        {/* 3 staggered phones filling the upper ~62% (clip at the label card) */}
        <div className="pointer-events-none absolute inset-x-0 top-0 h-[62%] overflow-hidden">
          {CAP_PHONES.map((ph, i) => (
            <div
              key={ph.src}
              className="absolute w-[44%] overflow-hidden rounded-[1.4rem] border-[5px] border-[#1a1a1a] bg-[#1a1a1a] shadow-[0_20px_40px_rgba(0,0,0,0.22)] transition-transform duration-300 group-hover:-translate-y-1 will-change-transform"
              style={{ left: `${10 + i * 22}%`, top: `${8 + i * 12}%`, zIndex: CAP_PHONES.length - i }}
            >
              <Image
                src={ph.src}
                alt={ph.alt}
                width={ph.w}
                height={ph.h}
                sizes="(min-width: 768px) 130px, 26vw"
                className="h-auto w-full"
              />
            </div>
          ))}
        </div>
        {/* white text card — keeps the home capabilities styling */}
        <div
          className="absolute flex origin-center flex-col items-center justify-center overflow-hidden rounded-[4px] border border-[#d6d6d6] bg-white px-[6%] text-center text-[#070e2c] transition-transform duration-500 ease-out will-change-transform group-hover:scale-[0.94]"
          style={{ left: pctX(24), top: pctY(423), width: pctX(522), height: pctY(270) }}
        >
          <p
            className="uppercase leading-none"
            style={{ fontFamily: 'var(--font-heading)', fontWeight: 500, fontSize: 'clamp(18px, 3.6vw, 38px)' }}
          >
            Full Capabilities
          </p>
          <p
            className="mt-[6%] max-w-[80%]"
            style={{ fontFamily: 'var(--font-body)', fontSize: 'clamp(12px, 2vw, 18px)', lineHeight: 1.5 }}
          >
            Countless clients and consistent deliverables across design disciplines, form factors, and use cases.
          </p>
          <span className="mt-[6%] inline-flex items-center gap-2 text-[clamp(11px,1.8vw,15px)] font-medium">
            See the full range
            <span aria-hidden className="transition-transform group-hover:translate-x-0.5">→</span>
          </span>
        </div>
      </div>
    </Link>
  )
}

/* --- ordered card registry -------------------------------------------------- */

const CARDS: { key: CardKey; node: React.ReactNode }[] = [
  { key: 'panda-express', node: <PandaCard /> },
  { key: 'baserate', node: <BaserateCard /> },
  { key: 'wingstop', node: <WingstopCard /> },
  { key: 'samsung', node: <SamsungCard /> },
  { key: 'capabilities', node: <CapabilitiesCard /> },
]

/* --- the carousel shell ----------------------------------------------------- */

export function MoreWorkFooter({ currentSlug, heading = 'More Work' }: MoreWorkFooterProps) {
  const cards = CARDS.filter((c) => c.key !== currentSlug)
  const trackRef = useRef<HTMLUListElement>(null)
  const [canLeft, setCanLeft] = useState(false)
  const [canRight, setCanRight] = useState(false)

  const updateArrows = useCallback(() => {
    const el = trackRef.current
    if (!el) return
    const overflow = el.scrollWidth - el.clientWidth
    setCanLeft(el.scrollLeft > 8)
    setCanRight(el.scrollLeft < overflow - 8)
  }, [])

  useEffect(() => {
    updateArrows()
    const el = trackRef.current
    if (!el) return
    el.addEventListener('scroll', updateArrows, { passive: true })
    window.addEventListener('resize', updateArrows)
    return () => {
      el.removeEventListener('scroll', updateArrows)
      window.removeEventListener('resize', updateArrows)
    }
  }, [updateArrows])

  const page = (dir: -1 | 1) => {
    const el = trackRef.current
    if (!el) return
    // page by roughly one card + gap
    const card = el.querySelector('li')
    const step = card ? (card as HTMLElement).offsetWidth + 24 : el.clientWidth * 0.8
    el.scrollBy({ left: dir * step, behavior: 'smooth' })
  }

  if (cards.length === 0) return null

  return (
    <section
      className="relative w-screen max-w-[100vw] overflow-x-clip bg-black py-16 text-white md:py-20"
      style={{ marginLeft: 'calc(50% - 50vw)', marginRight: 'calc(50% - 50vw)' }}
    >
      <div className="home-container">
        <div className="mb-8 flex items-end justify-between gap-4">
          <h2
            className="uppercase"
            style={{ fontFamily: 'var(--font-heading)', fontWeight: 500, fontSize: 'clamp(26px, 4vw, 40px)' }}
          >
            {heading}
          </h2>
          {/* arrow controls — only meaningful while the track overflows */}
          <div className="hidden shrink-0 gap-2 sm:flex">
            <button
              type="button"
              aria-label="Previous projects"
              onClick={() => page(-1)}
              disabled={!canLeft}
              className="flex h-10 w-10 items-center justify-center rounded-full border border-white/40 text-white transition-colors hover:bg-white hover:text-black disabled:cursor-default disabled:opacity-30 disabled:hover:bg-transparent disabled:hover:text-white"
            >
              ←
            </button>
            <button
              type="button"
              aria-label="More projects"
              onClick={() => page(1)}
              disabled={!canRight}
              className="flex h-10 w-10 items-center justify-center rounded-full border border-white/40 text-white transition-colors hover:bg-white hover:text-black disabled:cursor-default disabled:opacity-30 disabled:hover:bg-transparent disabled:hover:text-white"
            >
              →
            </button>
          </div>
        </div>
      </div>

      {/* the carousel track: horizontal snap, drag/swipe, edge-faded gutters.
          Each card holds a fixed width and never shrinks. The left padding
          matches the home-container gutter so card 1 lines up with the H2. */}
      <ul
        ref={trackRef}
        className="flex snap-x snap-mandatory gap-6 overflow-x-auto scroll-smooth px-[max(1.5rem,calc((100vw-1200px)/2+1.5rem))] pb-2 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
      >
        {cards.map((c) => (
          <li key={c.key} className="w-[clamp(280px,82vw,420px)] shrink-0 snap-start">
            {c.node}
          </li>
        ))}
      </ul>
    </section>
  )
}
