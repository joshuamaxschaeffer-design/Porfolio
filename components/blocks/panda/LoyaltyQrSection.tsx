'use client'

import { useState } from 'react'
import { loyaltyQr as copy } from './data'

const P = '/panda/loyalty/flow'

/* ─────────────────────────────────────────────────────────────────────────
 * Design space. Nodes are placed in a fixed 1240 × 720 coordinate system; the
 * whole map scales to fit (and scrolls horizontally on narrow screens). Screen
 * tiles are absolutely-positioned <img>s ON TOP of an SVG edge layer so the
 * connectors sit behind the screens. Hover/tap a tile → it lifts + the detail
 * panel shows its role + backend note; the rest dim.
 * ───────────────────────────────────────────────────────────────────────── */
const VBW = 1240
const VBH = 720

type Node = {
  id: string
  x: number // centre, design px
  y: number
  img?: string // screen thumbnail (omit for the illustrative entry)
  title: string
  role: string
  backend?: string
  goal?: boolean
}

// tile footprint
const TW = 66
const TH = 132

const NODES: Node[] = [
  { id: 'scan', x: 40, y: 360, title: 'Scan receipt QR', role: 'Entry — at a pilot store, the diner scans the receipt QR.', backend: 'Cache holds the receipt’s transaction ID for later.' },
  { id: 'loading', x: 150, y: 360, img: 'loading', title: 'Loading', role: 'A “Good Fortune Awaits” splash while channel, location and auth resolve.' },
  { id: 'intro', x: 470, y: 300, img: 'intro', title: 'Panda Rewards welcome', role: 'The hook — “Great news! …testing our new rewards program.” CTA flexes by auth state.' },
  { id: 'introSignin', x: 470, y: 150, img: 'introSignin', title: 'Welcome (Sign-in)', role: 'Logged-out CTA variant of the welcome — leads to sign in.' },
  { id: 'signin', x: 620, y: 150, img: 'signin', title: 'Sign in / Sign up', role: 'Facebook · Google · Apple · email.', backend: 'Azure authenticates; a ?loyalty param sets loyaltyFlag = true. mParticle logs the sign-in.' },
  { id: 'howitworks', x: 620, y: 20, img: 'howitworks', title: 'How It Works', role: 'Benefits explainer reached from “Explore Benefits.” An aside — no onward link in the prototype.' },
  { id: 'thanks', x: 770, y: 360, img: 'thanks', title: 'Thanks for scanning', role: 'Post-scan confirmation — “points will be added shortly.”', backend: 'Punchh ties the cached transaction to the account so the points land.' },
  { id: 'joingate', x: 920, y: 360, img: 'joingate', title: 'Join Panda Rewards', role: 'Loyalty-flag gate — join to continue, or “continue as guest” (logs out).' },
  { id: 'loggedout', x: 920, y: 540, img: 'loggedout', title: 'Logged-out fallback', role: 'Declining drops the guest to the menu — they can still browse and order.' },
  { id: 'earnpanda', x: 770, y: 150, img: 'earnpanda', title: 'Earn Points, Get Panda', role: 'Marketing join hero — the value pitch on the way in.' },
  { id: 'rewards', x: 1120, y: 300, img: 'rewards', title: 'Rewards dashboard', role: 'The payoff — Good Fortune Points, the monthly surprise, a persistent Scan tab.', goal: true },
  { id: 'educational', x: 1120, y: 150, img: 'educational', title: 'Rewards education', role: 'How to Collect / Easy Ways to Redeem / Get the App.' },
  // lower lane — location + pilot gating (tabletop entry)
  { id: 'confirm', x: 300, y: 540, img: 'confirm', title: 'Confirm location', role: 'Share GPS or type a ZIP — decides whether this store is in the pilot.' },
  { id: 'geoperm', x: 190, y: 540, img: 'geoperm', title: 'Location permission', role: 'The native location prompt.' },
  { id: 'comingsoon', x: 470, y: 560, img: 'comingsoon', title: 'Rewards Coming Soon', role: 'Non-pilot store — capture an email, or try another ZIP. A dead-end turned into a lead.' },
  { id: 'zipmodal', x: 600, y: 560, img: 'zipmodal', title: 'Enter ZIP', role: 'Find another participating location.' },
]

type Edge = { from: string; to: string; label?: string; dim?: boolean }

const EDGES: Edge[] = [
  { from: 'scan', to: 'loading' },
  { from: 'loading', to: 'intro', label: 'logged in' },
  { from: 'loading', to: 'signin', label: 'guest' },
  { from: 'intro', to: 'howitworks', label: 'benefits', dim: true },
  { from: 'intro', to: 'thanks', label: 'not a member' },
  { from: 'intro', to: 'rewards', label: 'member', dim: true },
  { from: 'introSignin', to: 'signin' },
  { from: 'signin', to: 'rewards' },
  { from: 'signin', to: 'educational', dim: true },
  { from: 'thanks', to: 'joingate' },
  { from: 'joingate', to: 'rewards', label: 'join' },
  { from: 'joingate', to: 'loggedout', label: 'decline' },
  { from: 'intro', to: 'earnpanda', dim: true },
  { from: 'earnpanda', to: 'rewards', dim: true },
  // location lane
  { from: 'loading', to: 'confirm', label: 'no location', dim: true },
  { from: 'confirm', to: 'geoperm', dim: true },
  { from: 'confirm', to: 'comingsoon', label: 'not pilot', dim: true },
  { from: 'comingsoon', to: 'zipmodal', dim: true },
  { from: 'zipmodal', to: 'introSignin', label: 'correct ZIP', dim: true },
]

const byId = (id: string) => NODES.find((n) => n.id === id)!

/** Edge path between two tiles — exits the right edge of `from`, enters the
 *  left edge of `to`, with a simple orthogonal-ish curve. */
function edgePath(a: Node, b: Node) {
  const ax = a.x + TW / 2
  const ay = a.y
  const bx = b.x - TW / 2
  const by = b.y
  const mx = (ax + bx) / 2
  return `M ${ax} ${ay} C ${mx} ${ay}, ${mx} ${by}, ${bx} ${by}`
}

export function LoyaltyQrSection({ intro }: { intro?: string } = {}) {
  const [active, setActive] = useState<string | null>(null)
  const act = active ? byId(active) : null

  return (
    <section
      id="loyalty-qr"
      aria-label="Loyalty QR Enrollment"
      data-anim="loyalty-qr-section"
      className="relative isolate w-full overflow-hidden border-y border-white/20 bg-[var(--px-red)]"
    >
      <div className="mx-auto w-full max-w-[1600px] px-5 py-14 md:px-10 md:py-20">
        {/* header */}
        <div className="max-w-[64ch]">
          <p className="text-[12px] font-bold uppercase tracking-[0.14em] text-white/70">
            Panda Rewards · Loyalty Pilot
          </p>
          <h2 className="mt-3 text-[30px] font-semibold uppercase leading-none tracking-wide text-white md:text-[44px]">
            {copy.heading}
          </h2>
          <p className="mt-4 text-[15px] leading-snug text-white/90 md:text-[19px] md:leading-snug">
            {intro ?? copy.intro}
          </p>
        </div>

        {/* proof chips */}
        <ul className="mt-7 flex flex-wrap gap-2.5 md:mt-8 md:gap-3">
          {copy.chips.map((c) => (
            <li
              key={c}
              className="rounded-full border border-white/30 bg-white/10 px-3.5 py-1.5 text-[12.5px] font-semibold text-white md:text-[13.5px]"
            >
              {c}
            </li>
          ))}
        </ul>

        {/* the full UX map */}
        <div className="mt-9 md:mt-12">
          <div className="mb-3 flex items-center justify-between gap-3">
            <p className="text-[12px] font-bold uppercase tracking-[0.12em] text-white/60">
              The full flow — hover a screen to expand
            </p>
            <p className="text-[11px] text-white/45 md:hidden">scroll to explore →</p>
          </div>

          {/* scroll container (pan on mobile) */}
          <div className="-mx-5 overflow-x-auto px-5 pb-2 md:mx-0 md:px-0">
            <div
              className="relative mx-auto"
              style={{ width: '100%', minWidth: 940, aspectRatio: `${VBW} / ${VBH}` }}
              onMouseLeave={() => setActive(null)}
            >
              {/* edge layer */}
              <svg
                viewBox={`0 0 ${VBW} ${VBH}`}
                className="absolute inset-0 h-full w-full"
                aria-hidden="true"
                preserveAspectRatio="xMidYMid meet"
              >
                <defs>
                  <marker id="lqa" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
                    <path d="M0,0 L10,5 L0,10 z" fill="rgba(255,255,255,0.65)" />
                  </marker>
                </defs>
                {EDGES.map((e, i) => {
                  const a = byId(e.from)
                  const b = byId(e.to)
                  const related = active && (e.from === active || e.to === active)
                  const op = active ? (related ? 1 : 0.12) : e.dim ? 0.4 : 0.7
                  const mid = { x: (a.x + b.x) / 2, y: (a.y + b.y) / 2 - 8 }
                  return (
                    <g key={i} style={{ transition: 'opacity .25s' }} opacity={op}>
                      <path
                        d={edgePath(a, b)}
                        fill="none"
                        stroke="rgba(255,255,255,0.7)"
                        strokeWidth={related ? 2.4 : 1.5}
                        strokeDasharray={e.dim && !related ? '5 4' : undefined}
                        markerEnd="url(#lqa)"
                      />
                      {e.label && (
                        <text
                          x={mid.x}
                          y={mid.y}
                          textAnchor="middle"
                          fontSize="11"
                          fontWeight={700}
                          fill="#fff"
                          style={{ paintOrder: 'stroke', stroke: 'var(--px-red)', strokeWidth: 3 }}
                        >
                          {e.label}
                        </text>
                      )}
                    </g>
                  )
                })}
              </svg>

              {/* screen tiles */}
              {NODES.map((n) => {
                const isActive = active === n.id
                const dim = active && !isActive
                const leftPct = ((n.x - TW / 2) / VBW) * 100
                const topPct = ((n.y - TH / 2) / VBH) * 100
                const wPct = (TW / VBW) * 100
                return (
                  <button
                    key={n.id}
                    type="button"
                    onMouseEnter={() => setActive(n.id)}
                    onFocus={() => setActive(n.id)}
                    onClick={() => setActive(isActive ? null : n.id)}
                    aria-label={`${n.title} — ${n.role}`}
                    className="absolute -translate-x-0 cursor-pointer rounded-[8px] outline-none"
                    style={{
                      left: `${leftPct}%`,
                      top: `${topPct}%`,
                      width: `${wPct}%`,
                      aspectRatio: `${TW} / ${TH}`,
                      zIndex: isActive ? 40 : 10,
                      transform: isActive ? 'scale(1.9)' : 'scale(1)',
                      transformOrigin:
                        n.x > VBW * 0.7 ? 'top right' : n.x < VBW * 0.3 ? 'top left' : 'top center',
                      transition: 'transform .2s ease, opacity .2s ease',
                      opacity: dim ? 0.32 : 1,
                    }}
                  >
                    <span
                      className={`block h-full w-full overflow-hidden rounded-[7px] border bg-black/20 ${
                        n.goal ? 'border-white' : 'border-white/35'
                      }`}
                      style={{
                        boxShadow: isActive
                          ? '0 14px 34px rgba(0,0,0,0.45)'
                          : n.goal
                            ? '0 0 0 2px rgba(255,255,255,0.5), 0 6px 16px rgba(0,0,0,0.3)'
                            : '0 4px 12px rgba(0,0,0,0.25)',
                      }}
                    >
                      {n.img ? (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img
                          src={`${P}/${isActive ? n.img + '@2x' : n.img}.webp`}
                          alt={n.title}
                          loading="lazy"
                          className="block w-full"
                        />
                      ) : (
                        <QrTile />
                      )}
                    </span>
                    {/* tiny always-on label under each tile */}
                    <span
                      className="pointer-events-none absolute left-1/2 top-full mt-1 -translate-x-1/2 whitespace-nowrap text-[8.5px] font-semibold text-white/75"
                      style={{ opacity: isActive ? 0 : 1, transition: 'opacity .15s' }}
                    >
                      {n.title}
                    </span>
                  </button>
                )
              })}
            </div>
          </div>

          {/* detail panel — fills from the active tile (or a hint at rest) */}
          <div className="mt-5 min-h-[92px] rounded-[14px] border border-white/20 bg-black/15 px-5 py-4 md:mt-6 md:min-h-[84px]">
            {act ? (
              <div>
                <div className="flex flex-wrap items-baseline gap-x-3 gap-y-1">
                  <h3 className="text-[17px] font-semibold text-white md:text-[19px]">{act.title}</h3>
                  {act.goal && (
                    <span className="rounded-full bg-white px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide text-[var(--px-red)]">
                      Destination
                    </span>
                  )}
                </div>
                <p className="mt-1.5 text-[14px] leading-snug text-white/85 md:text-[15px]">{act.role}</p>
                {act.backend && (
                  <p className="mt-2 inline-flex items-start gap-1.5 text-[12.5px] leading-snug text-white/70">
                    <span className="mt-[1px] rounded bg-white/15 px-1.5 py-[1px] text-[10px] font-bold uppercase tracking-wide text-white/90">
                      Behind it
                    </span>
                    <span>{act.backend}</span>
                  </p>
                )}
              </div>
            ) : (
              <p className="text-[14px] leading-snug text-white/65 md:text-[15px]">
                {copy.mapHint}
              </p>
            )}
          </div>
        </div>

        <p className="mt-7 text-[12.5px] leading-normal text-white/55 md:mt-9 md:max-w-[82ch]">
          {copy.footnote}
        </p>
      </div>
    </section>
  )
}

/** Illustrative receipt-QR tile (the entry has no screenshot). */
function QrTile() {
  return (
    <span className="flex h-full w-full flex-col items-center justify-center gap-1.5 bg-white/12 p-1">
      <svg viewBox="0 0 40 40" className="w-1/2" aria-hidden="true" fill="none">
        <rect x="2" y="2" width="13" height="13" rx="1.5" stroke="#fff" strokeWidth="2.4" />
        <rect x="25" y="2" width="13" height="13" rx="1.5" stroke="#fff" strokeWidth="2.4" />
        <rect x="2" y="25" width="13" height="13" rx="1.5" stroke="#fff" strokeWidth="2.4" />
        <rect x="7" y="7" width="3" height="3" fill="#fff" />
        <rect x="30" y="7" width="3" height="3" fill="#fff" />
        <rect x="7" y="30" width="3" height="3" fill="#fff" />
        <path d="M25 25h4v4h-4zM33 25h5v4M25 33h4v5M33 33h5v5" stroke="#fff" strokeWidth="2.4" />
      </svg>
    </span>
  )
}
