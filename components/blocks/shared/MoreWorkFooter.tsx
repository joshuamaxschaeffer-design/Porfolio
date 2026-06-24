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
 * and keeps the canonical order.
 *
 * Carousel mechanics are lifted verbatim from the Wingstop ScopeCarousel (which
 * came from the Panda RewardsPlatform / Baserate problems carousel): a native
 * scroll track (momentum + snap on touch), JS 1:1 mouse drag + flick momentum
 * (Lenis-safe rAF), and a JS-measured trailing spacer. The track's left pad
 * matches the .home-container gutter so card 1 lines up with the H2.
 *
 * Media reuse: the Panda + Baserate cards reuse the live home-page scene
 * components (RewardsStage / BrandingScene) so the art stays identical to the
 * site — parallax inert (hovered driven by the card's own hover). Wingstop,
 * Samsung and Capabilities mirror the home SecondaryRow.
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

/* --- shared label card (Figma: left 24, top 423, 522×270, white border) -----
 * Fonts are calibrated to the SMALLER card the carousel now uses (~clamp
 * 280-420px wide), driven by container queries (cqw) so they track the card,
 * not the viewport. Pills are a fixed 12px and the row is tightened (small gap,
 * no wrap) so every tag sits on a single line. */

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
      <div className="flex w-full flex-col items-center gap-[clamp(7px,2.2cqw,12px)] px-[5%]">
        <p
          className="uppercase leading-none"
          style={{ fontFamily: 'var(--font-heading)', fontWeight: 500, fontSize: 'clamp(13px, 4.4cqw, 19px)' }}
        >
          {title}
        </p>
        <ul className="flex flex-nowrap justify-center gap-[clamp(4px,1.4cqw,7px)] whitespace-nowrap">
          {pills.map((pill) => (
            <li
              key={pill}
              className="shrink-0 rounded-[2px] border px-[6px] py-[5px] leading-none"
              style={{ fontFamily: 'var(--font-body)', fontSize: '12px', borderColor: border }}
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
    <Link href={href} className="group block" draggable={false}>
      <div
        className="relative aspect-[570/720] w-full overflow-hidden rounded-[4px]"
        style={{ backgroundColor: bg, border: border ? `1px solid ${border}` : undefined, containerType: 'inline-size' }}
      >
        {children}
      </div>
    </Link>
  )
}

/* --- Panda Express (red, reuses the live RewardsStage scene) -----------------
 * The rewards stage sits LOWER in the card (~150px lower than before, ~21% of
 * the 720 card height) and zooms in on card hover, mirroring the other cards. */

function PandaCard() {
  return (
    <CardFrame href="/work/panda-express" bg="#d1282e">
      <div className="pointer-events-none absolute inset-x-0 top-0 h-[62%] overflow-hidden">
        <div className="absolute inset-x-0 top-[27%] origin-top transition-transform duration-500 ease-out will-change-transform group-hover:scale-[1.07]">
          <RewardsStage
            hovered={false}
            className="absolute left-1/2 top-0 w-[128%] max-w-none -translate-x-1/2 origin-top scale-[1.02]"
          />
        </div>
      </div>
      <LabelCard
        bg="#d1282e"
        logo={
          <span className="flex h-[clamp(48px,15cqw,96px)] w-[clamp(48px,15cqw,96px)] items-center justify-center rounded-full bg-white shadow-lg">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="/panda/panda-logo.svg" alt="Panda Express" className="h-[62%] w-[62%] object-contain" draggable={false} />
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
      {/* device-focused scene matching the home page mobile treatment: just the
          phone + computer (no scattered swatches/chips), centered + grounded so
          their bottoms tuck under the label card below. */}
      <div className="pointer-events-none absolute inset-x-0 top-0 flex h-[62%] items-end justify-center overflow-hidden">
        <div className="w-full origin-bottom transition-transform duration-500 ease-out will-change-transform group-hover:scale-[1.06]">
          <BrandingScene compact devicesOnly hovered={false} className="w-full max-w-none origin-bottom mx-auto scale-[1.18]" />
        </div>
      </div>
      <LabelCard
        bg="#000000"
        logo={<BaserateLogo className="h-[clamp(22px,6.5cqw,38px)] w-auto [filter:brightness(0)_invert(1)]" />}
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
          <img src={c.src} alt="" aria-hidden draggable={false} className="h-full w-full object-contain" />
        </div>
      </div>
    </div>
  )

  const [topChip, ...innerChips] = CHIPS

  return (
    <Link href="/work/wingstop" className="group block" draggable={false}>
      <div className="relative aspect-[570/720] w-full" style={{ containerType: 'inline-size' }}>
        <div className="absolute inset-0 overflow-hidden rounded-[4px] bg-[#00a653]">
          <div
            className="absolute origin-top transition-transform duration-500 ease-out will-change-transform group-hover:[transform:translateY(20px)_scale(1.06)]"
            style={{ left: pctX(124), top: pctY(28), width: pctX(323), height: pctY(551) }}
          >
            <Image
              src="/home/wingstop/screen.webp"
              alt="Wingstop app — flavor quantities"
              fill
              draggable={false}
              sizes="(min-width: 768px) 27vw, 90vw"
              className="object-contain object-top"
            />
          </div>
          {innerChips.map((c, i) => renderChip(c, i + 1))}
          <LabelCard
            bg="#00a653"
            logo={
              // eslint-disable-next-line @next/next/no-img-element
              <img src="/home/wingstop/wingd-logo.webp" alt="Wingstop" className="w-[50%] object-contain" draggable={false} />
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
    <CardFrame href="/work/samsung" bg="#000000" border="#ffffff">
      <div
        className="absolute origin-[60%_45%] transition-transform duration-500 ease-out will-change-transform group-hover:scale-[1.07]"
        style={{ left: pctX(-154), top: pctY(-259), width: pctX(1180), height: pctY(1091) }}
      >
        <Image
          src="/home/samsung/table.webp"
          alt="Samsung Galaxy interactive retail table"
          fill
          draggable={false}
          sizes="(min-width: 768px) 99vw, 207vw"
          className="object-contain object-left-top"
        />
      </div>
      <LabelCard
        bg="#000000"
        logo={
          // eslint-disable-next-line @next/next/no-img-element
          <img src="/samsung/brand/samsung-wordmark-white.svg" alt="Samsung" className="w-[58%] object-contain" draggable={false} />
        }
        title="Digital + Social"
        pills={['Design', 'UI', 'UX', 'Social Posts']}
      />
    </CardFrame>
  )
}

/* --- Full Capabilities (white, 3 staggered phone mockups + white text card) --
 * The phones live in a z-0 layer clipped to the top 62%; the white text card is
 * z-20 so it always sits ABOVE the phones (the phones were overlapping the card
 * before because they shared the same stacking level). */

const CAP_PHONES = [
  { src: '/capabilities/cbtl/ui-2.webp', alt: 'Coffee Bean & Tea Leaf app', w: 560, h: 1197 },
  { src: '/capabilities/dnb/app-1.webp', alt: 'Dave & Buster’s rewards app', w: 560, h: 1213 },
  { src: '/capabilities/trees/ui-1.webp', alt: 'Trees goal-setting app', w: 560, h: 1212 },
]

function CapabilitiesCard() {
  return (
    <CardFrame href="/work/capabilities" bg="#ffffff" border="#d6d6d6">
      {/* 3 staggered phones filling the upper ~62% (clip at the label card) */}
      <div className="pointer-events-none absolute inset-x-0 top-0 z-0 h-[62%] overflow-hidden">
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
              draggable={false}
              sizes="(min-width: 768px) 130px, 26vw"
              className="h-auto w-full"
            />
          </div>
        ))}
      </div>
      {/* white text card — z-20 so it covers the phones; smaller type to match */}
      <div
        className="absolute z-20 flex origin-center flex-col items-center justify-center overflow-hidden rounded-[4px] border border-[#d6d6d6] bg-white px-[6%] text-center text-[#070e2c] transition-transform duration-500 ease-out will-change-transform group-hover:scale-[0.94]"
        style={{ left: pctX(24), top: pctY(423), width: pctX(522), height: pctY(270) }}
      >
        <p
          className="uppercase leading-none"
          style={{ fontFamily: 'var(--font-heading)', fontWeight: 500, fontSize: 'clamp(16px, 5cqw, 26px)' }}
        >
          Full Capabilities
        </p>
        <p
          className="mt-[5%] max-w-[82%]"
          style={{ fontFamily: 'var(--font-body)', fontSize: 'clamp(11px, 3cqw, 14px)', lineHeight: 1.5 }}
        >
          Countless clients and consistent deliverables across design disciplines, form factors, and use cases.
        </p>
        <span className="mt-[5%] inline-flex items-center gap-2 font-medium" style={{ fontSize: 'clamp(11px, 2.6cqw, 13px)' }}>
          See the full range
          <span aria-hidden className="transition-transform group-hover:translate-x-0.5">→</span>
        </span>
      </div>
    </CardFrame>
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

/* --- the carousel shell -----------------------------------------------------
 * Horizontal drag-with-physics carousel. Mechanism ported from the Wingstop
 * ScopeCarousel: native overflow-x track (touch momentum + snap), JS 1:1 mouse
 * drag with flick momentum on a Lenis-safe rAF loop, and a JS-measured trailing
 * spacer so the last card can still reach the left rail. RAIL_PAD matches the
 * .home-container gutter (max-width 1512, 5rem desktop / 1.5rem mobile) so the
 * FIRST card's left edge lines up with the "More Work" heading. */

export function MoreWorkFooter({ currentSlug, heading = 'More Work' }: MoreWorkFooterProps) {
  const cards = CARDS.filter((c) => c.key !== currentSlug)
  const trackRef = useRef<HTMLDivElement>(null)
  const [spacerW, setSpacerW] = useState(0)
  const [canLeft, setCanLeft] = useState(false)
  const [canRight, setCanRight] = useState(false)

  // Mirrors .home-container: padding-inline 1.5rem, or 5rem at >=768px, on a
  // max 1512px column. max() picks the gutter once the column is centered.
  const RAIL_PAD = 'max(1.5rem, calc((100vw - 1512px) / 2 + 5rem))'

  const drag = useRef({
    down: false,
    moved: false,
    startX: 0,
    startScroll: 0,
    targetScroll: 0,
    samples: [] as { x: number; t: number }[],
  })
  const momentumRaf = useRef<number | null>(null)
  const dragRaf = useRef<number | null>(null)
  const jumpRaf = useRef<number | null>(null)

  const stopMomentum = useCallback(() => {
    if (momentumRaf.current != null) {
      cancelAnimationFrame(momentumRaf.current)
      momentumRaf.current = null
    }
  }, [])

  const updateArrows = useCallback(() => {
    const el = trackRef.current
    if (!el) return
    const overflow = el.scrollWidth - el.clientWidth
    setCanLeft(el.scrollLeft > 8)
    setCanRight(el.scrollLeft < overflow - 8)
  }, [])

  const startMomentum = useCallback(
    (v0: number) => {
      const el = trackRef.current
      if (!el) return
      stopMomentum()
      let v = v0
      let last = performance.now()
      const DECAY = 0.0025
      const MIN_V = 0.015
      const stepFn = (now: number) => {
        const dt = Math.min(40, now - last)
        last = now
        el.scrollLeft -= v * dt
        v *= Math.exp(-DECAY * dt)
        const atEdge = el.scrollLeft <= 0 || el.scrollLeft >= el.scrollWidth - el.clientWidth - 1
        if (Math.abs(v) < MIN_V || atEdge) {
          momentumRaf.current = null
          return
        }
        momentumRaf.current = requestAnimationFrame(stepFn)
      }
      momentumRaf.current = requestAnimationFrame(stepFn)
    },
    [stopMomentum],
  )

  const measureSpacer = useCallback(() => {
    const el = trackRef.current
    if (!el) return
    const items = el.querySelectorAll<HTMLElement>('[data-card]')
    const last = items[items.length - 1]
    if (!last) return
    const cs = getComputedStyle(el)
    const padLeft = parseFloat(cs.paddingLeft) || 0
    const padRight = parseFloat(cs.paddingRight) || 0
    const gap = parseFloat(cs.columnGap) || 0
    const w = el.clientWidth - last.offsetWidth - gap - padLeft - padRight
    setSpacerW(Math.max(0, Math.round(w)))
  }, [])

  useEffect(() => {
    updateArrows()
    measureSpacer()
    const el = trackRef.current
    if (!el) return
    const onResize = () => {
      measureSpacer()
      updateArrows()
    }
    el.addEventListener('scroll', updateArrows, { passive: true })
    window.addEventListener('resize', onResize)
    const t = window.setTimeout(measureSpacer, 250)
    return () => {
      el.removeEventListener('scroll', updateArrows)
      window.removeEventListener('resize', onResize)
      window.clearTimeout(t)
    }
  }, [updateArrows, measureSpacer])

  useEffect(
    () => () => {
      stopMomentum()
      if (dragRaf.current != null) cancelAnimationFrame(dragRaf.current)
      if (jumpRaf.current != null) cancelAnimationFrame(jumpRaf.current)
    },
    [stopMomentum],
  )

  const dragTick = useCallback(() => {
    const el = trackRef.current
    if (el && drag.current.down) {
      el.scrollLeft = drag.current.targetScroll
      dragRaf.current = requestAnimationFrame(dragTick)
    } else {
      dragRaf.current = null
    }
  }, [])

  const onPointerDown = (e: React.PointerEvent) => {
    const el = trackRef.current
    if (!el) return
    if (e.pointerType !== 'mouse') return
    stopMomentum()
    const now = performance.now()
    drag.current = {
      down: true,
      moved: false,
      startX: e.clientX,
      startScroll: el.scrollLeft,
      targetScroll: el.scrollLeft,
      samples: [{ x: e.clientX, t: now }],
    }
    el.setPointerCapture(e.pointerId)
    if (dragRaf.current == null) dragRaf.current = requestAnimationFrame(dragTick)
  }
  const onPointerMove = (e: React.PointerEvent) => {
    if (!drag.current.down) return
    const dx = e.clientX - drag.current.startX
    if (Math.abs(dx) > 4) drag.current.moved = true
    drag.current.targetScroll = drag.current.startScroll - dx
    const now = performance.now()
    const s = drag.current.samples
    s.push({ x: e.clientX, t: now })
    while (s.length > 2 && now - s[0].t > 120) s.shift()
  }
  const endDrag = (e: React.PointerEvent) => {
    const el = trackRef.current
    if (el) {
      try {
        el.releasePointerCapture(e.pointerId)
      } catch {}
    }
    const wasDown = drag.current.down
    drag.current.down = false
    if (dragRaf.current != null) {
      cancelAnimationFrame(dragRaf.current)
      dragRaf.current = null
    }
    if (wasDown && el) {
      const s = drag.current.samples
      const now = performance.now()
      const first = s[0]
      const last = s[s.length - 1]
      const dt = last.t - first.t
      const vx = dt > 0 ? (last.x - first.x) / dt : 0
      if (now - last.t < 90 && Math.abs(vx) > 0.05) startMomentum(vx)
    }
  }
  // Swallow the click that follows a real drag so it doesn't open a card link.
  const onClickCapture = (e: React.MouseEvent) => {
    if (drag.current.moved) {
      e.preventDefault()
      e.stopPropagation()
      drag.current.moved = false
    }
  }

  const page = (dir: -1 | 1) => {
    const el = trackRef.current
    if (!el) return
    stopMomentum()
    if (jumpRaf.current != null) cancelAnimationFrame(jumpRaf.current)
    const card = el.querySelector<HTMLElement>('[data-card]')
    const step = card ? card.offsetWidth + 24 : el.clientWidth * 0.8
    const from = el.scrollLeft
    const maxLeft = el.scrollWidth - el.clientWidth
    const to = Math.max(0, Math.min(maxLeft, from + dir * step))
    const dist = to - from
    if (Math.abs(dist) < 1) return
    const dur = Math.min(620, 240 + Math.abs(dist) * 0.5)
    const start = performance.now()
    const ease = (t: number) => 1 - Math.pow(1 - t, 3)
    const stepFn = (nowT: number) => {
      const p = Math.min(1, (nowT - start) / dur)
      el.scrollLeft = from + dist * ease(p)
      if (p < 1) jumpRaf.current = requestAnimationFrame(stepFn)
      else jumpRaf.current = null
    }
    jumpRaf.current = requestAnimationFrame(stepFn)
  }

  if (cards.length === 0) return null

  return (
    <section
      className="relative w-screen max-w-[100vw] overflow-x-clip bg-black py-16 text-white md:py-20"
      style={{ marginLeft: 'calc(50% - 50vw)', marginRight: 'calc(50% - 50vw)' }}
    >
      <div className="mb-8 flex items-end justify-between gap-4" style={{ paddingInline: RAIL_PAD }}>
        <h2
          className="uppercase"
          style={{ fontFamily: 'var(--font-heading)', fontWeight: 500, fontSize: 'clamp(26px, 4vw, 40px)' }}
        >
          {heading}
        </h2>
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

      {/* drag track: native momentum on touch, JS drag + flick on mouse. The
          left padding matches the heading so card 1 aligns with "More Work". */}
      <div
        ref={trackRef}
        className="br-noscrollbar flex cursor-grab snap-x snap-mandatory gap-6 overflow-x-auto overscroll-x-contain pb-2 select-none active:cursor-grabbing lg:snap-none [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
        style={{ paddingInline: RAIL_PAD, scrollPaddingInline: RAIL_PAD, touchAction: 'pan-x pan-y' }}
        onPointerDown={onPointerDown}
        onPointerMove={onPointerMove}
        onPointerUp={endDrag}
        onPointerCancel={endDrag}
        onClickCapture={onClickCapture}
      >
        {cards.map((c) => (
          <div
            key={c.key}
            data-card
            className="w-[clamp(280px,82vw,420px)] shrink-0 snap-start lg:snap-align-none"
          >
            {c.node}
          </div>
        ))}
        <div aria-hidden className="shrink-0" style={{ width: spacerW }} />
      </div>
    </section>
  )
}
