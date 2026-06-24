'use client'

import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import {
  mvp as defaults,
  MVP_VBW,
  MVP_VBH,
  type MvpNode,
  type MvpEdge,
  type MvpColor,
  type MvpScreen,
} from './data'
import { ComponentLibrariesSection } from './ComponentLibrariesSection'

/**
 * Section 4 — MVP Fast-Launch / Core UX.
 *
 * 1:1 rebuild of the original UX flow (Figma 311-26243). The whole flow is
 * drawn once as colour-coded vector cards + connectors (a 2862×1750 viewBox
 * scaled to fit); picking a scenario lights its path in that path's colour and
 * reveals the connectors step by step. Colours are swapped from the source
 * legend: main spine / Add-a-Product = grey, Add-a-Promotion = gold,
 * Add-from-Category = red, Choose-Location = blue.
 *
 * Each node is a coloured CARD with the device screen on top and the screen
 * name as text inside the card. Auto-cycles through scenarios when in view;
 * pauses on hover/focus; honours prefers-reduced-motion.
 */

// path colours — matched to the Figma legend
const COLOR: Record<MvpColor, string> = {
  green: '#4CB050',  // Add a Promotion
  blue: '#29A9E0',   // Add a Product (main spine)
  purple: '#9356C4', // Add from Category
  orange: '#E8941C', // Choose Location
}

/* ── one-shot in-view detector ───────────────────────────────────────────── */
function useInViewOnce<T extends HTMLElement>(threshold = 0.2) {
  const ref = useRef<T>(null)
  const [inView, setInView] = useState(false)
  useEffect(() => {
    const el = ref.current
    if (!el) return
    const io = new IntersectionObserver(
      (entries) => {
        if (entries.some((e) => e.isIntersecting)) {
          setInView(true)
          io.disconnect()
        }
      },
      { threshold },
    )
    io.observe(el)
    return () => io.disconnect()
  }, [threshold])
  return { ref, inView }
}

function prefersReducedMotion() {
  return (
    typeof window !== 'undefined' &&
    window.matchMedia('(prefers-reduced-motion: reduce)').matches
  )
}

/* ── geometry helpers (Figma px) ─────────────────────────────────────────── */
type Pt = [number, number]
const nodeById = new Map<string, MvpNode>(defaults.nodes.map((n) => [n.id, n]))

type Side = 'top' | 'right' | 'bottom' | 'left'

/** Anchor point ON a card's edge. Slots are evenly spaced along the side
 *  (slot 1..of; left→right on top/bottom, top→bottom on left/right). Internal
 *  only — not visibly numbered. Default = centered. */
function anchor(id: string, side: Side, slot = 1, of = 1): Pt {
  const n = nodeById.get(id)
  if (!n) return [0, 0]
  const [x, y, w, h] = n.box
  const f = of <= 1 ? 0.5 : slot / (of + 1)
  switch (side) {
    case 'top': return [x + w * f, y]
    case 'bottom': return [x + w * f, y + h]
    case 'left': return [x, y + h * f]
    case 'right': return [x + w, y + h * f]
  }
}
function outDir(side: Side): Pt {
  return side === 'top' ? [0, -1] : side === 'bottom' ? [0, 1] : side === 'left' ? [-1, 0] : [1, 0]
}

/** Build an edge's polyline from its from/to slot anchors (+ optional manual
 *  `via` waypoints). The endpoints are derived from the CARDS, so lines always
 *  start/end exactly on a card edge. Auto-routes one orthogonal elbow when no
 *  via is given. */
/** Snap a polyline so EVERY segment is purely horizontal or vertical (no
 *  diagonals). Where two consecutive points differ in both x and y, insert an
 *  L-corner. The corner direction follows the incoming segment's axis. */
function orthogonalize(pts: Pt[]): Pt[] {
  const out: Pt[] = [pts[0]]
  for (let i = 1; i < pts.length; i++) {
    const p = out[out.length - 1]
    const q = pts[i]
    const dx = Math.abs(q[0] - p[0]), dy = Math.abs(q[1] - p[1])
    if (dx > 0.5 && dy > 0.5) {
      // decide corner: keep moving along the previous segment's axis first
      const prev = out.length >= 2 ? out[out.length - 2] : null
      const prevVertical = prev ? Math.abs(prev[0] - p[0]) < 0.5 : false
      const corner: Pt = prevVertical ? [p[0], q[1]] : [q[0], p[1]]
      out.push(corner)
    }
    out.push(q)
  }
  return out
}

function resolvePts(e: MvpEdge): Pt[] {
  const a: Pt = e.fromPoint ?? anchor(e.from, e.fromSide, e.fromSlot, e.fromOf)
  const b: Pt = e.toPoint ?? anchor(e.to, e.toSide, e.toSlot, e.toOf)
  let pts: Pt[]
  if (e.via && e.via.length) {
    pts = [a, ...(e.via as Pt[]), b]
  } else if (Math.abs(a[0] - b[0]) < 1 || Math.abs(a[1] - b[1]) < 1) {
    pts = [a, b]
  } else {
    const [aox, aoy] = outDir(e.fromSide)
    const STUB = 26
    const a1: Pt = [a[0] + aox * STUB, a[1] + aoy * STUB]
    // route along the source axis first, then into the target
    pts = e.fromSide === 'top' || e.fromSide === 'bottom'
      ? [a, a1, [b[0], a1[1]], b]
      : [a, a1, [a1[0], b[1]], b]
  }
  return orthogonalize(pts)
}

/** Arrow geometry shared by line + triangle so they meet cleanly:
 *  INSET = gap from target card to the arrow TIP.
 *  ARROW = triangle length (the LINE stops here, at the triangle base). */
const INSET = 3
const ARROW = 22
const ARROW_W = 12
function lastDir(pts: Pt[]): { ux: number; uy: number } {
  const a = pts[pts.length - 2], b = pts[pts.length - 1]
  const dx = b[0] - a[0], dy = b[1] - a[1]
  const len = Math.hypot(dx, dy) || 1
  return { ux: dx / len, uy: dy / len }
}
function arrowTip(pts: Pt[]): Pt {
  const b = pts[pts.length - 1]
  const { ux, uy } = lastDir(pts)
  return [b[0] - ux * INSET, b[1] - uy * INSET]
}
/** polyline `d` — ends exactly at the arrow BASE (no overshoot past the head) */
function edgeD(pts: Pt[]): string {
  const tip = arrowTip(pts)
  const { ux, uy } = lastDir(pts)
  const base: Pt = [tip[0] - ux * ARROW, tip[1] - uy * ARROW]
  const all = [...pts.slice(0, -1), base]
  return 'M ' + all.map((p) => `${p[0]} ${p[1]}`).join(' L ')
}
/** solid triangle arrowhead — tip at arrowTip, base ARROW behind it */
function arrowPoly(pts: Pt[]): string {
  const tip = arrowTip(pts)
  const { ux, uy } = lastDir(pts)
  const baseX = tip[0] - ux * ARROW, baseY = tip[1] - uy * ARROW
  const px = -uy, py = ux
  return `${tip[0].toFixed(1)},${tip[1].toFixed(1)} ${(baseX + px * ARROW_W).toFixed(1)},${(baseY + py * ARROW_W).toFixed(1)} ${(baseX - px * ARROW_W).toFixed(1)},${(baseY - py * ARROW_W).toFixed(1)}`
}
/** midpoint of the longest segment — default pill anchor */
function edgeMid(pts: Pt[]): Pt {
  let best = 0, bi = 0
  for (let i = 0; i < pts.length - 1; i++) {
    const l = Math.hypot(pts[i + 1][0] - pts[i][0], pts[i + 1][1] - pts[i][1])
    if (l > best) { best = l; bi = i }
  }
  return [(pts[bi][0] + pts[bi + 1][0]) / 2, (pts[bi][1] + pts[bi + 1][1]) / 2]
}

/* ── device screen UI, drawn at absolute coords inside a sx/sy/sw/sh box.
 *    (No nested <svg>/percent sizing — keeps it robust across renderers.) ── */
function ScreenUI({ screen, sx, sy, sw, sh }: { screen: MvpScreen; sx: number; sy: number; sw: number; sh: number }) {
  const blue = '#3BA9E8'        // tile fill (Figma light blue)
  const dark = '#1577C2'        // header bar (darker blue)
  // logical 100×150 screen → absolute
  const X = (lx: number) => sx + (lx / 100) * sw
  const Y = (ly: number) => sy + (ly / 150) * sh
  const W = (lw: number) => (lw / 100) * sw
  const H = (lh: number) => (lh / 150) * sh
  const R = (lx: number, ly: number, lw: number, lh: number, f = blue, rad = 3) => (
    <rect x={X(lx)} y={Y(ly)} width={W(lw)} height={H(lh)} rx={rad} fill={f} key={`${lx}-${ly}-${lw}-${f}`} />
  )
  // GRID screens (Homepage / Menu / Product / Category):
  // dark header bar, wide banner, then a 3×3 tile grid.
  if (screen === 'home' || screen === 'menu' || screen === 'product' || screen === 'category') {
    const tiles: React.ReactNode[] = []
    const gx0 = 12, gy0 = 58, cell = 22, gap = 5
    for (let r = 0; r < 3; r++) for (let c = 0; c < 3; c++) {
      tiles.push(R(gx0 + c * (cell + gap), gy0 + r * (cell + gap), cell, cell, blue, 3))
    }
    return (
      <>
        {R(12, 12, 76, 14, dark, 3)}{/* dark header */}
        {R(12, 32, 76, 18, blue, 3)}{/* banner */}
        {tiles}
      </>
    )
  }
  // POPUP / ITEM screens (Product-with-item / Restaurant / Quantity):
  // big image block up top, then a couple of lines + a button.
  if (screen === 'productSel' || screen === 'popup' || screen === 'quantity') {
    return (
      <>
        {R(12, 12, 76, 56, blue, 4)}{/* image */}
        {R(12, 76, 50, 7, dark, 3)}
        {R(12, 90, 76, 7, blue, 3)}
        {R(12, 104, 76, 7, blue, 3)}
        {R(12, 124, 76, 14, dark, 4)}{/* button */}
      </>
    )
  }
  // LIST screens (My Bag / Checkout / Confirmation / Location):
  // stacked wide bars + smaller rows.
  return (
    <>
      {R(12, 14, 76, 14, blue, 3)}
      {R(12, 34, 76, 14, blue, 3)}
      {R(12, 56, 50, 8, dark, 3)}
      {R(12, 70, 50, 8, blue, 3)}
      {R(12, 86, 76, 16, dark, 4)}
    </>
  )
}

/* ── one node = card, device on top, label inside.
 *    Highlighted: card filled in path colour, white device, white label.
 *    Unhighlighted: WHITE card + hairline outline, light device, ink label. ── */
function NodeCard({ node, lit }: { node: MvpNode; lit: boolean }) {
  const [x, y, w, h] = node.box
  const cardFill = lit ? COLOR[node.color] : '#ffffff'
  const cardStroke = lit ? 'none' : '#e2e3e8'
  // lit cards: white label on the colour fill. dim cards: grey label (white is
  // invisible on the white card) — readable but clearly de-emphasised.
  const labelColor = lit ? '#ffffff' : '#8a9099'
  // device: tall phone (~0.6 ratio), centered, upper area
  const dw = w * 0.46
  const dh = dw * 1.5
  const dx = x + (w - dw) / 2, dy = y + h * 0.085
  // screen sits inside the phone body with chrome around it; home button below
  const sPad = dw * 0.12
  const ssx = dx + sPad, ssw = dw - sPad * 2
  const ssy = dy + dh * 0.07, ssh = dh * 0.80
  const labelCy = y + h * 0.80
  const words = node.label.split(' ')
  const lines: string[] = []
  let cur = ''
  for (const wd of words) {
    if ((cur + ' ' + wd).trim().length > 13) { if (cur) lines.push(cur); cur = wd }
    else cur = (cur + ' ' + wd).trim()
  }
  if (cur) lines.push(cur)
  // width-aware font: shrink so the widest line fits inside the card (with pad)
  const maxChars = Math.max(...lines.map((l) => l.length))
  const avail = w - 24
  let fs = lines.length >= 3 ? 19 : 21
  if (maxChars * (fs * 0.56) > avail) fs = Math.max(15, Math.floor(avail / (maxChars * 0.56)))
  const lineH = fs + 4
  const y0 = labelCy - ((lines.length - 1) * lineH) / 2
  const phoneBody = lit ? '#ffffff' : '#f1f2f4'
  return (
    <g style={{ transition: 'opacity .35s' }}>
      <rect x={x} y={y} width={w} height={h} rx={22} fill={cardFill} stroke={cardStroke} strokeWidth={1.5} />
      {/* phone body + screen UI + home button */}
      <rect x={dx} y={dy} width={dw} height={dh} rx={12} fill={phoneBody} />
      <ScreenUI screen={node.screen} sx={ssx} sy={ssy} sw={ssw} sh={ssh} />
      <circle cx={x + w / 2} cy={dy + dh - dh * 0.05} r={dw * 0.05} fill="#d7dadf" />
      {/* clip stray fills from rounding — none expected now */}
      {lines.map((l, i) => (
        <text
          key={i}
          x={x + w / 2}
          y={y0 + i * lineH}
          fontSize={fs}
          fontWeight={700}
          fill={labelColor}
          textAnchor="middle"
          dominantBaseline="central"
          fontFamily="var(--br-font-body)"
        >
          {l}
        </text>
      ))}
    </g>
  )
}

/* ── pill (edge label) ───────────────────────────────────────────────────── */
function Pill({ x, y, lines, color, lit }: { x: number; y: number; lines: string[]; color: MvpColor; lit: boolean }) {
  const fill = lit ? COLOR[color] : '#ffffff'
  const txt = lit ? '#ffffff' : 'var(--br-muted)'
  const stroke = lit ? 'none' : 'var(--br-line)'
  const fs = 21, lineH = 25
  const w = Math.max(...lines.map((l) => l.length)) * 11 + 34
  const h = lines.length * lineH + 18
  const y0 = y - ((lines.length - 1) * lineH) / 2
  return (
    <g style={{ transition: 'opacity .3s' }}>
      <rect x={x - w / 2} y={y - h / 2} width={w} height={h} rx={h / 2} fill={fill} stroke={stroke} strokeWidth={1.5} />
      {lines.map((l, i) => (
        <text key={i} x={x} y={y0 + i * lineH} fontSize={fs} fontWeight={700} fill={txt} textAnchor="middle" dominantBaseline="central" fontFamily="var(--br-font-body)">
          {l}
        </text>
      ))}
    </g>
  )
}

interface DiagramProps {
  activeId: string
  progress: number
  reduced: boolean
}

/** the directed edge keys revealed for the active scenario, in order */
function activeEdgeKeys(path: string[]): string[] {
  const keys: string[] = []
  for (let i = 0; i < path.length - 1; i++) keys.push(`${path[i]}->${path[i + 1]}`)
  return keys
}

/** second-pill anchor: offset from the first along the edge's local direction
 *  (to the right on a horizontal segment, downward otherwise). */
function secondAnchor(a: Pt, label: string): Pt {
  // chained pills always sit to the right on the horizontal rails in the source
  const gap = label.length * 11 + 34
  return [a[0] + gap / 2 + 130, a[1]]
}

function DesktopDiagram({ activeId, progress, reduced }: DiagramProps) {
  const { nodes, edges, scenarios } = defaults
  const isAll = activeId === 'all'
  const scenario = scenarios.find((s) => s.id === activeId) ?? scenarios[0]
  const keys = useMemo(() => activeEdgeKeys(scenario.path), [scenario.path])
  const revealed = reduced || isAll ? keys.length : progress
  const reachedNodeIds = useMemo(() => {
    if (isAll) return new Set(nodes.map((n) => n.id))
    const s = new Set<string>([scenario.path[0]])
    for (let i = 0; i < revealed && i < keys.length; i++) s.add(scenario.path[i + 1])
    return s
  }, [isAll, nodes, scenario.path, keys.length, revealed])

  const edgeByKey = useMemo(() => {
    const m = new Map<string, MvpEdge>()
    edges.forEach((e) => m.set(`${e.from}->${e.to}`, e))
    return m
  }, [edges])

  // is an edge lit? (All → always, in its own colour; scenario → on the path & revealed)
  const edgeState = (ed: MvpEdge): { lit: boolean; color: string } => {
    if (isAll) return { lit: true, color: COLOR[ed.color] }
    const idx = keys.indexOf(`${ed.from}->${ed.to}`)
    return { lit: idx >= 0 && idx < revealed, color: COLOR[scenario.color] }
  }

  return (
    <svg viewBox={`0 0 ${MVP_VBW} ${MVP_VBH}`} className="h-auto w-full" role="img" aria-label="Panda Express ordering UX flow">
      {/* layer 1 — dim base for edges that are NOT lit (white w/ hairline) */}
      <g>
        {edges.map((ed, i) => {
          if (edgeState(ed).lit) return null
          const pts = resolvePts(ed)
          return (
            <g key={`dim-${i}`}>
              <path d={edgeD(pts)} fill="none" stroke="#e4e5ea" strokeWidth={5} strokeLinecap="round" strokeLinejoin="round" />
              <polygon points={arrowPoly(pts)} fill="#e4e5ea" />
            </g>
          )
        })}
      </g>

      {/* layer 2 — lit edges in colour (All = own colour; scenario = path colour) */}
      <g>
        {edges.map((ed, i) => {
          const { lit, color } = edgeState(ed)
          if (!lit) return null
          const pts = resolvePts(ed)
          return (
            <g key={`lit-${i}`} style={{ transition: reduced ? 'none' : 'opacity .26s ease-in-out' }}>
              <path d={edgeD(pts)} fill="none" stroke={color} strokeWidth={6} strokeLinecap="round" strokeLinejoin="round" />
              <polygon points={arrowPoly(pts)} fill={color} />
            </g>
          )
        })}
      </g>

      {/* layer 3 — nodes (white when unhighlighted, colour when reached) */}
      <g>
        {nodes.map((n) => (
          <NodeCard key={n.id} node={n} lit={reachedNodeIds.has(n.id)} />
        ))}
      </g>

      {/* layer 4 — pills + captions. Two-part labels = TWO separate pills. */}
      <g>
        {edges.map((ed, i) => {
          const { lit } = edgeState(ed)
          const pillPos = ed.labelAt ? ([ed.labelAt.x, ed.labelAt.y] as Pt) : edgeMid(resolvePts(ed))
          const els: React.ReactNode[] = []
          const pillColor = ed.labelColor ?? ed.color
          if (ed.label) els.push(<Pill key={`p-${i}`} x={pillPos[0]} y={pillPos[1]} lines={ed.label.split('\n')} color={pillColor} lit={lit} />)
          if (ed.label2) {
            const a2: Pt = ed.label2At ? [ed.label2At.x, ed.label2At.y] : secondAnchor(pillPos, ed.label ?? '')
            els.push(<Pill key={`p2-${i}`} x={a2[0]} y={a2[1]} lines={[ed.label2]} color={pillColor} lit={lit} />)
          }
          if (ed.caption) {
            els.push(
              <text key={`c-${i}`} x={ed.caption.x} y={ed.caption.y} fontSize={20} fontWeight={700} fill={lit ? COLOR[ed.color] : 'var(--br-muted-2)'} textAnchor="middle" dominantBaseline="central" fontFamily="var(--br-font-body)">
                {ed.caption.text}
              </text>,
            )
          }
          return <g key={`lbl-${i}`}>{els}</g>
        })}
      </g>
    </svg>
  )
}

/* (MobileFlow — the old vertical step-list mobile fallback — was removed: mobile
    now renders the full diagram scaled down, same as desktop's 'all' state.) */

/* ── scenario selector chips: "All" (shows every flow) + one per scenario ─── */
function ScenarioChips({ activeId, onPick }: { activeId: string; onPick: (id: string) => void }) {
  const chips: { id: string; title: string; color: MvpColor | 'ink' }[] = [
    { id: 'all', title: 'All', color: 'ink' },
    ...defaults.scenarios.map((s) => ({ id: s.id, title: s.title, color: s.color })),
  ]
  return (
    <div className="flex flex-wrap gap-2.5" role="tablist" aria-label="Ordering scenarios">
      {chips.map((c) => {
        const active = c.id === activeId
        const col = c.color === 'ink' ? 'var(--br-ink)' : COLOR[c.color]
        return (
          <button
            key={c.id}
            role="tab"
            aria-selected={active}
            onClick={() => onPick(c.id)}
            onMouseEnter={() => onPick(c.id)}
            onFocus={() => onPick(c.id)}
            className="group flex items-center gap-2 rounded-full border px-4 py-2 text-[14px] font-medium leading-none transition-colors duration-200 md:text-[15px]"
            style={{
              borderColor: active ? col : 'var(--br-line)',
              background: active ? col : 'white',
              color: active ? 'white' : 'var(--br-muted)',
            }}
          >
            {c.id !== 'all' && (
              <span className="h-2.5 w-2.5 rounded-full" style={{ background: active ? 'rgba(255,255,255,0.7)' : col }} />
            )}
            {c.title}
          </button>
        )
      })}
    </div>
  )
}

/* ═════════════════════════════════════════════════════════════════════════
 * MvpFlowSection — header + Core UX + the interactive flow + Component Libs
 * ═════════════════════════════════════════════════════════════════════════ */
export function MvpFlowSection({ intro }: { intro?: string } = {}) {
  const data = defaults
  const { ref, inView } = useInViewOnce<HTMLDivElement>()
  const [reduced, setReduced] = useState(false)
  // default view = "all" (every flow shown in full colour); chips drill in.
  const [activeId, setActiveId] = useState<string>('all')
  const [progress, setProgress] = useState(0)

  const scenarios = data.scenarios
  const scenario = scenarios.find((s) => s.id === activeId)
  const steps = scenario ? scenario.path.length - 1 : 0 // edges to reveal

  useEffect(() => setReduced(prefersReducedMotion()), [])

  // No step-by-step reveal: the active scenario's whole path is shown instantly
  // in its final state. (progress is kept = steps so the diagram lights the full
  // path; the colour cross-fade between scenarios still reads cleanly.)
  useEffect(() => {
    setProgress(steps)
  }, [steps, activeId])

  const pick = useCallback((id: string) => {
    setActiveId(id)
  }, [])

  const lead = intro ?? data.intro

  return (
    <section id="mvp" className="bg-white text-[var(--br-body)]">
      {/* faint full-width hairline marking the top of section 4 */}
      <div className="h-px w-full bg-[var(--br-line)]" aria-hidden />
      <div className="br-container pt-16 pb-20 md:pt-24 md:pb-[120px]">
        <h2 className="text-[32px] font-medium uppercase leading-none text-[var(--br-ink)] md:text-[40px]">
          {data.heading}
        </h2>
        <p className="mt-5 max-w-3xl text-lg leading-snug text-[var(--br-muted)] md:text-[22px]">{lead}</p>

        {/* Core UX: headline → one line of body → scenario chips.
            On mobile the chips are hidden (no room to drive the flow); the whole
            diagram just renders in its 'all' state, scaled tiny. */}
        <div className="mt-10 flex flex-col gap-4 md:mt-12">
          <h3 className="text-[20px] font-semibold uppercase leading-none text-[var(--br-ink)] md:text-[22px]">
            {data.callout.title}
          </h3>
          <p className="text-[15px] leading-snug text-[var(--br-muted)] md:text-base">{data.callout.body}</p>
          <div className="hidden lg:block">
            <ScenarioChips activeId={activeId} onPick={pick} />
          </div>
        </div>

        {/* the flow. Desktop: carded interactive diagram. Mobile: the SAME full
            diagram (every path lit in its 'all' state) shown bare — no card —
            scaled down to fit the column; in-diagram text is hidden because it's
            far too small to read (the shape of the flow is the point here). */}
        <div
          ref={ref}
          className="pxmvp-flow relative mt-8 overflow-hidden lg:rounded-[var(--br-card-radius)] lg:border lg:border-[var(--br-line)] lg:bg-white lg:p-6 lg:shadow-[var(--br-card-shadow)] md:mt-10"
        >
          {/* Desktop stays fully interactive (chips drive activeId). On mobile
              the chips are hidden, so activeId holds its default 'all' and the
              whole flow shows lit. */}
          <DesktopDiagram activeId={activeId} progress={progress} reduced={reduced} />
        </div>
        {/* mobile: blank out the tiny, unreadable in-diagram text */}
        <style>{`@media (max-width:1023px){.pxmvp-flow svg text{display:none}}`}</style>

        {/* Component Libraries — nested module in this section */}
        <ComponentLibrariesSection />
      </div>
    </section>
  )
}
