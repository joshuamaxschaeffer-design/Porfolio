'use client'

import { useEffect, useRef, useState } from 'react'
import { loyaltyQr as defaults } from './data'

const P = '/panda/loyalty'

/**
 * "LOYALTY QR ENROLLMENT" — a full-bleed Panda-red band that communicates the
 * systems-design weight of the receipt-QR loyalty enrollment flow WITHOUT a wall
 * of detail. The point a recruiter takes away in three seconds: this person
 * architected a branching, multi-platform userflow that orchestrates four
 * backend systems behind a few calm screens.
 *
 * Visual: a schematic "blueprint" diagram (distinct from the PremiumRewards
 * phone/firework hero) — the enrollment path drawn as nodes + connectors, with
 * the Cache → Azure → mParticle → Punchh handoff broken out as the hard part.
 * Connector lines stroke-draw in on first view; reduced-motion → drawn at rest.
 * A short strip of real screens anchors the abstraction in the actual UI.
 *
 * Reconstructed + verified against the Figma prototype graph (REST API).
 */
export function LoyaltyQrSection({ intro }: { intro?: string } = {}) {
  return (
    <section
      id="loyalty-qr"
      aria-label="Loyalty QR Enrollment"
      data-anim="loyalty-qr-section"
      className="relative isolate w-full overflow-hidden border-y border-white/20 bg-[var(--px-red)]"
    >
      <div className="mx-auto w-full max-w-[1600px] px-5 py-14 md:px-10 md:py-20">
        {/* ── header ─────────────────────────────────────────────── */}
        <div className="max-w-[64ch]">
          <p className="text-[12px] font-bold uppercase tracking-[0.14em] text-white/70">
            Panda Rewards · Loyalty Pilot
          </p>
          <h2 className="mt-3 text-[30px] font-semibold uppercase leading-none tracking-wide text-white md:text-[44px]">
            {defaults.heading}
          </h2>
          <p className="mt-4 text-[15px] leading-snug text-white/90 md:text-[19px] md:leading-snug">
            {intro ?? defaults.intro}
          </p>
        </div>

        {/* ── proof chips ────────────────────────────────────────── */}
        <ul className="mt-7 flex flex-wrap gap-2.5 md:mt-8 md:gap-3">
          {defaults.chips.map((c) => (
            <li
              key={c}
              className="rounded-full border border-white/30 bg-white/10 px-3.5 py-1.5 text-[12.5px] font-semibold text-white md:text-[13.5px]"
            >
              {c}
            </li>
          ))}
        </ul>

        {/* ── the blueprint diagram ──────────────────────────────── */}
        <BlueprintDiagram />

        {/* ── real screens strip ─────────────────────────────────── */}
        <div className="mt-10 md:mt-14">
          <p className="text-[12px] font-bold uppercase tracking-[0.12em] text-white/60">
            A few of the screens
          </p>
          <div className="mt-4 grid grid-cols-2 gap-3.5 sm:grid-cols-4 md:gap-5">
            {defaults.screens.map((s) => (
              <figure key={s.src} className="group">
                <div className="overflow-hidden rounded-[14px] border border-white/20 bg-black/20 shadow-[0_12px_30px_rgba(0,0,0,0.22)]">
                  {/* a fixed window so the tall screens crop consistently */}
                  <div className="h-[230px] overflow-hidden md:h-[300px]">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={`${P}/${s.src}`}
                      alt={s.alt}
                      loading="lazy"
                      className="w-full"
                    />
                  </div>
                </div>
                <figcaption className="mt-2 text-[12px] font-semibold text-white/80 md:text-[13px]">
                  {s.cap}
                </figcaption>
              </figure>
            ))}
          </div>
        </div>

        <p className="mt-8 text-[12.5px] leading-normal text-white/55 md:mt-10 md:max-w-[80ch]">
          {defaults.footnote}
        </p>
      </div>
    </section>
  )
}

/* ─────────────────────────────────────────────────────────────────────────
 * BlueprintDiagram — schematic enrollment map drawn on the red band.
 * A normalized 1000×420 viewBox. Two rows:
 *   • top: the user-facing path (Scan → Loading → fork → Sign in / Confirm → Rewards)
 *   • the hard middle: the four backend systems wired in as a chain.
 * Connector paths stroke-draw in on first view; nodes fade up in sequence.
 * ───────────────────────────────────────────────────────────────────────── */
function BlueprintDiagram() {
  const ref = useRef<SVGSVGElement>(null)
  const [on, setOn] = useState(false)
  const [reduce, setReduce] = useState(false)

  useEffect(() => {
    const m = window.matchMedia('(prefers-reduced-motion: reduce)')
    setReduce(m.matches)
    const el = ref.current
    if (!el) return
    const io = new IntersectionObserver(
      (entries) => {
        if (entries.some((e) => e.isIntersecting)) {
          setOn(true)
          io.disconnect()
        }
      },
      { threshold: 0.3 },
    )
    io.observe(el)
    return () => io.disconnect()
  }, [])

  const lit = on || reduce

  // node helper
  const Node = ({
    x,
    y,
    w = 150,
    h = 52,
    title,
    sub,
    kind = 'step',
    delay = 0,
  }: {
    x: number
    y: number
    w?: number
    h?: number
    title: string
    sub?: string
    kind?: 'step' | 'dec' | 'goal'
    delay?: number
  }) => {
    const fill =
      kind === 'goal' ? 'rgba(255,255,255,0.96)' : 'rgba(255,255,255,0.12)'
    const stroke = kind === 'goal' ? '#fff' : 'rgba(255,255,255,0.55)'
    const tcol = kind === 'goal' ? '#CE202E' : '#fff'
    const scol = kind === 'goal' ? 'rgba(206,32,46,0.75)' : 'rgba(255,255,255,0.72)'
    return (
      <g
        style={{
          opacity: lit ? 1 : 0,
          transform: lit ? 'translateY(0)' : 'translateY(8px)',
          transition: reduce
            ? 'none'
            : `opacity .5s ease ${delay}s, transform .5s ease ${delay}s`,
        }}
      >
        <rect
          x={x}
          y={y}
          width={w}
          height={h}
          rx={10}
          fill={fill}
          stroke={stroke}
          strokeWidth={kind === 'dec' ? 1.5 : 1.2}
          strokeDasharray={kind === 'dec' ? '5 4' : undefined}
        />
        <text
          x={x + w / 2}
          y={sub ? y + h / 2 - 4 : y + h / 2 + 5}
          textAnchor="middle"
          fontSize={14}
          fontWeight={600}
          fill={tcol}
        >
          {title}
        </text>
        {sub && (
          <text
            x={x + w / 2}
            y={y + h / 2 + 13}
            textAnchor="middle"
            fontSize={11}
            fill={scol}
          >
            {sub}
          </text>
        )}
      </g>
    )
  }

  // API pill (the hard middle)
  const Api = ({
    x,
    title,
    sub,
    i,
  }: {
    x: number
    title: string
    sub: string
    i: number
  }) => (
    <g
      style={{
        opacity: lit ? 1 : 0,
        transition: reduce ? 'none' : `opacity .5s ease ${0.9 + i * 0.12}s`,
      }}
    >
      <rect
        x={x}
        y={300}
        width={196}
        height={66}
        rx={11}
        fill="rgba(0,0,0,0.16)"
        stroke="rgba(255,255,255,0.4)"
        strokeWidth={1.2}
      />
      <text x={x + 16} y={324} fontSize={11} fontWeight={800} letterSpacing="0.06em" fill="#fff">
        {`0${i + 1}`}
      </text>
      <text x={x + 16} y={342} fontSize={14} fontWeight={700} fill="#fff">
        {title}
      </text>
      <text x={x + 16} y={357} fontSize={10.5} fill="rgba(255,255,255,0.78)">
        {sub}
      </text>
    </g>
  )

  // drawn connector
  const Edge = ({
    d,
    delay,
    dash,
  }: {
    d: string
    delay: number
    dash?: boolean
  }) => (
    <path
      d={d}
      fill="none"
      stroke="rgba(255,255,255,0.6)"
      strokeWidth={1.6}
      strokeDasharray={dash ? '4 4' : '600'}
      strokeDashoffset={dash ? 0 : lit ? 0 : 600}
      markerEnd="url(#lqArrow)"
      style={{
        transition: reduce || dash ? 'none' : `stroke-dashoffset 1s ease ${delay}s`,
        opacity: dash ? (lit ? 1 : 0) : 1,
      }}
    />
  )

  return (
    <div className="mt-9 overflow-x-auto md:mt-12">
      <svg
        ref={ref}
        viewBox="0 0 1000 420"
        role="img"
        aria-label="Schematic of the enrollment flow: scan a receipt QR, resolve channel and location, then guest sign-in or logged-in join, landing on the rewards dashboard — with Cache, Azure, mParticle and Punchh handing off behind the scenes."
        className="w-full min-w-[760px]"
      >
        <defs>
          <marker
            id="lqArrow"
            viewBox="0 0 10 10"
            refX="9"
            refY="5"
            markerWidth="6.5"
            markerHeight="6.5"
            orient="auto-start-reverse"
          >
            <path d="M0,0 L10,5 L0,10 z" fill="rgba(255,255,255,0.7)" />
          </marker>
        </defs>

        {/* ── top row: user-facing path ── */}
        {/* edges */}
        <Edge d="M170,66 L210,66" delay={0.15} />
        <Edge d="M360,66 L400,66" delay={0.3} />
        <Edge d="M475,92 L475,150 L400,150 L400,182" delay={0.5} />
        {/* guest down-left to sign in */}
        <Edge d="M475,92 L475,150 L560,150 L560,182" delay={0.5} />
        {/* sign in -> rewards (down + across) */}
        <Edge d="M320,208 L320,250 L820,250 L820,196" delay={1.7} dash />
        {/* logged-in -> rewards */}
        <Edge d="M640,208 L640,250" delay={1.7} dash />

        {/* nodes */}
        <Node x={20} y={40} title="Scan receipt QR" sub="at a pilot store" delay={0.1} />
        <Node x={210} y={40} title="Resolve state" sub="channel · location" delay={0.25} />
        <Node x={400} y={40} w={150} h={52} title="Logged in?" kind="dec" delay={0.4} />

        <Node x={245} y={182} w={150} title="Guest → Sign in" sub="Azure auth" delay={0.6} />
        <Node x={485} y={182} w={150} title="Member? → Join" sub="confirm + gate" delay={0.6} />

        <Node x={745} y={144} w={170} h={56} title="Rewards" sub="Good Fortune Points" kind="goal" delay={1.0} />

        {/* ── the hard middle: backend chain ── */}
        <text x={20} y={288} fontSize={12} fontWeight={800} letterSpacing="0.08em" fill="rgba(255,255,255,0.6)">
          BEHIND THE GLASS — ONE SEAMLESS MOMENT
        </text>
        {/* chain edges */}
        <Edge d="M216,333 L236,333" delay={1.3} />
        <Edge d="M452,333 L472,333" delay={1.45} />
        <Edge d="M688,333 L708,333" delay={1.6} />
        <Api x={20} i={0} title="Cache" sub="hold receipt txn ID" />
        <Api x={236} i={1} title="Azure" sub="?loyalty → flag = true" />
        <Api x={472} i={2} title="mParticle" sub="log sign-in event" />
        <Api x={708} i={3} title="Punchh" sub="credit the points" />
      </svg>
    </div>
  )
}
