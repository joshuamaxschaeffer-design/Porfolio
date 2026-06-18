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

const AUTOPLAY_MS = 2200

// path colours
const COLOR: Record<MvpColor, string> = {
  grey: '#8A8F9A',
  gold: '#C79016',
  red: '#D02B2E',
  blue: '#2E86DE',
}
// dim (unselected) line + card colour
const DIM_LINE = '#d8d8de'
const DIM_CARD = '#c9ccd2'

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

/** polyline `d`, with the final point pulled back by INSET so the arrow sits
 *  just off the target card. */
const INSET = 14
function edgeD(pts: Pt[]): string {
  const a = pts[pts.length - 2]
  const b = pts[pts.length - 1]
  const dx = b[0] - a[0], dy = b[1] - a[1]
  const len = Math.hypot(dx, dy) || 1
  const bb: Pt = [b[0] - (dx / len) * INSET, b[1] - (dy / len) * INSET]
  const all = [...pts.slice(0, -1), bb]
  return 'M ' + all.map((p) => `${p[0]} ${p[1]}`).join(' L ')
}
/** solid triangle arrowhead at the (inset) end of a polyline */
function arrowPoly(pts: Pt[]): string {
  const a = pts[pts.length - 2]
  const b = pts[pts.length - 1]
  const dx = b[0] - a[0], dy = b[1] - a[1]
  const len = Math.hypot(dx, dy) || 1
  const ux = dx / len, uy = dy / len
  const tipX = b[0] - ux * INSET, tipY = b[1] - uy * INSET
  const s = 26, w = 15
  const baseX = tipX - ux * s, baseY = tipY - uy * s
  const px = -uy, py = ux
  return `${tipX.toFixed(1)},${tipY.toFixed(1)} ${(baseX + px * w).toFixed(1)},${(baseY + py * w).toFixed(1)} ${(baseX - px * w).toFixed(1)},${(baseY - py * w).toFixed(1)}`
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
  const blue = '#2BA7E0'
  // logical 70×62 → absolute
  const X = (lx: number) => sx + (lx / 70) * sw
  const Y = (ly: number) => sy + (ly / 62) * sh
  const W = (lw: number) => (lw / 70) * sw
  const H = (lh: number) => (lh / 62) * sh
  const R = (lx: number, ly: number, lw: number, lh: number, rad = 2) => (
    <rect x={X(lx)} y={Y(ly)} width={W(lw)} height={H(lh)} rx={rad} fill={blue} key={`${lx}-${ly}-${lw}`} />
  )
  if (screen === 'home' || screen === 'menu' || screen === 'product' || screen === 'category') {
    return (<>{R(6, 4, 58, 8)}{R(6, 18, 26, 18)}{R(38, 18, 26, 18)}{R(6, 40, 26, 18)}{R(38, 40, 26, 18)}</>)
  }
  if (screen === 'productSel' || screen === 'popup' || screen === 'quantity') {
    return (<>{R(6, 4, 58, 30)}{R(6, 40, 40, 6)}{R(6, 50, 58, 6)}</>)
  }
  return (<>{R(6, 4, 58, 8)}{R(6, 18, 58, 7)}{R(6, 30, 58, 7)}{R(6, 42, 36, 7)}</>)
}

/* ── one node = colored card, device on top, label inside ────────────────── */
function NodeCard({ node, lit }: { node: MvpNode; lit: boolean }) {
  const [x, y, w, h] = node.box
  const fill = lit ? COLOR[node.color] : DIM_CARD
  // device zone (upper ~52%), label zone (lower)
  const dw = w * 0.40, dh = h * 0.40
  const dx = x + (w - dw) / 2, dy = y + h * 0.10
  const labelCy = y + h * 0.78
  const words = node.label.split(' ')
  const lines: string[] = []
  let cur = ''
  for (const wd of words) {
    if ((cur + ' ' + wd).trim().length > 15) { if (cur) lines.push(cur); cur = wd }
    else cur = (cur + ' ' + wd).trim()
  }
  if (cur) lines.push(cur)
  const fs = lines.length >= 3 ? 19 : 21
  const lineH = 25
  const y0 = labelCy - ((lines.length - 1) * lineH) / 2
  return (
    <g style={{ transition: 'opacity .35s' }}>
      <rect x={x} y={y} width={w} height={h} rx={22} fill={fill} />
      {/* white device + UI drawn at absolute coords */}
      <rect x={dx} y={dy} width={dw} height={dh} rx={10} fill="#ffffff" />
      <ScreenUI screen={node.screen} sx={dx + dw * 0.12} sy={dy + dh * 0.12} sw={dw * 0.76} sh={dh * 0.76} />
      {/* clip stray fills from rounding — none expected now */}
      {lines.map((l, i) => (
        <text
          key={i}
          x={x + w / 2}
          y={y0 + i * lineH}
          fontSize={fs}
          fontWeight={700}
          fill="#ffffff"
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

function DesktopDiagram({ activeId, progress, reduced }: DiagramProps) {
  const { nodes, edges, scenarios } = defaults
  const scenario = scenarios.find((s) => s.id === activeId) ?? scenarios[0]
  const keys = useMemo(() => activeEdgeKeys(scenario.path), [scenario.path])
  const litNodeIds = useMemo(() => new Set(scenario.path), [scenario.path])
  const revealed = reduced ? keys.length : progress
  // node is "reached" once an edge arriving at it is revealed (or it's the start)
  const reachedNodeIds = useMemo(() => {
    const s = new Set<string>([scenario.path[0]])
    for (let i = 0; i < revealed && i < keys.length; i++) s.add(scenario.path[i + 1])
    return s
  }, [scenario.path, keys.length, revealed])

  // map edge key -> edge for active lookup
  const edgeByKey = useMemo(() => {
    const m = new Map<string, MvpEdge>()
    edges.forEach((e) => m.set(`${e.from}->${e.to}`, e))
    return m
  }, [edges])

  return (
    <svg viewBox={`0 0 ${MVP_VBW} ${MVP_VBH}`} className="h-auto w-full" role="img" aria-label="Panda Express ordering UX flow">
      {/* layer 1 — ALL edges dim */}
      <g>
        {edges.map((ed, i) => (
          <g key={`dim-${i}`}>
            <path d={edgeD(ed.pts)} fill="none" stroke={DIM_LINE} strokeWidth={6} strokeLinecap="round" strokeLinejoin="round" />
            <polygon points={arrowPoly(ed.pts)} fill={DIM_LINE} />
          </g>
        ))}
      </g>

      {/* layer 2 — active path edges, in scenario colour, revealed in order */}
      <g>
        {keys.map((k, i) => {
          const ed = edgeByKey.get(k)
          if (!ed) return null
          const on = i < revealed
          const col = COLOR[scenario.color]
          return (
            <g key={`lit-${i}`} style={{ opacity: on ? 1 : 0, transition: reduced ? 'none' : 'opacity .26s ease-in-out' }}>
              <path d={edgeD(ed.pts)} fill="none" stroke={col} strokeWidth={7} strokeLinecap="round" strokeLinejoin="round" />
              <polygon points={arrowPoly(ed.pts)} fill={col} />
            </g>
          )
        })}
      </g>

      {/* layer 3 — nodes (dim, then lit when reached) */}
      <g>
        {nodes.map((n) => (
          <g key={n.id} style={{ opacity: 1 }}>
            <NodeCard node={n} lit={reachedNodeIds.has(n.id)} />
          </g>
        ))}
      </g>

      {/* layer 4 — pills + captions (dim, lit on active path) */}
      <g>
        {edges.map((ed, i) => {
          const k = `${ed.from}->${ed.to}`
          const onPathIdx = keys.indexOf(k)
          const lit = onPathIdx >= 0 && onPathIdx < revealed
          const anchor = ed.labelAt ? [ed.labelAt.x, ed.labelAt.y] as Pt : edgeMid(ed.pts)
          const els: React.ReactNode[] = []
          if (ed.label) {
            const lines = ed.label2 ? [ed.label, ed.label2] : [ed.label]
            els.push(<Pill key={`p-${i}`} x={anchor[0]} y={anchor[1]} lines={lines} color={ed.color} lit={lit} />)
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

/* ── mobile fallback — vertical step list of the active path ──────────────── */
function MobileFlow({ activeId, progress, reduced }: DiagramProps) {
  const { edges, scenarios } = defaults
  const scenario = scenarios.find((s) => s.id === activeId) ?? scenarios[0]
  const col = COLOR[scenario.color]
  const revealed = reduced ? scenario.path.length : progress + 1
  const edgeByKey = useMemo(() => {
    const m = new Map<string, MvpEdge>()
    edges.forEach((e) => m.set(`${e.from}->${e.to}`, e))
    return m
  }, [edges])
  // de-dupe consecutive repeats (e.g. product appears twice in location path)
  return (
    <ol className="mx-auto flex max-w-[420px] list-none flex-col">
      {scenario.path.map((id, i) => {
        const node = nodeById.get(id)!
        const reached = i < revealed
        const nextId = scenario.path[i + 1]
        const ed = nextId ? edgeByKey.get(`${id}->${nextId}`) : undefined
        const connOn = i + 1 < revealed
        return (
          <li key={`${id}-${i}`} className="flex gap-4">
            <div className="flex flex-col items-center">
              <div
                className="grid h-[54px] w-[54px] shrink-0 place-items-center rounded-[12px] transition-colors duration-300"
                style={{ background: reached ? col : DIM_CARD }}
              >
                <div className="h-[34px] w-[26px] rounded-[5px] bg-white">
                  <svg viewBox="0 0 70 62" className="h-full w-full" aria-hidden>
                    <ScreenUI screen={node.screen} sx={4} sy={4} sw={62} sh={54} />
                  </svg>
                </div>
              </div>
              {nextId && (
                <span className="my-1 w-[2px] flex-1 rounded-full transition-colors duration-300" style={{ minHeight: 30, background: connOn ? col : DIM_LINE }} />
              )}
            </div>
            <div className={nextId ? 'pb-3 pt-2' : 'pt-2'}>
              <p className="text-[15px] font-medium leading-tight transition-colors duration-300" style={{ color: reached ? 'var(--br-ink)' : '#aeaeb6' }}>
                {node.label}
              </p>
              {ed?.label && (
                <p className="br-data mt-1 text-[12px] leading-none transition-colors duration-300" style={{ color: connOn ? col : '#bcbcc4' }}>
                  ↓ {ed.label}
                </p>
              )}
            </div>
          </li>
        )
      })}
    </ol>
  )
}

/* ── scenario selector chips (active = its path colour) ──────────────────── */
function ScenarioChips({ activeId, onPick }: { activeId: string; onPick: (id: string) => void }) {
  return (
    <div className="flex flex-wrap gap-2.5" role="tablist" aria-label="Ordering scenarios">
      {defaults.scenarios.map((s, i) => {
        const active = s.id === activeId
        const col = COLOR[s.color]
        return (
          <button
            key={s.id}
            role="tab"
            aria-selected={active}
            onClick={() => onPick(s.id)}
            className="group flex items-center gap-2 rounded-full border px-4 py-2 text-[14px] font-medium leading-none transition-colors duration-200 md:text-[15px]"
            style={{
              borderColor: active ? col : 'var(--br-line)',
              background: active ? col : 'white',
              color: active ? 'white' : 'var(--br-muted)',
            }}
          >
            <span
              className="br-data grid h-5 w-5 place-items-center rounded-full text-[11px] transition-colors duration-200"
              style={{ background: active ? 'rgba(255,255,255,0.24)' : 'var(--br-bg-2)', color: active ? 'white' : col }}
            >
              {i + 1}
            </span>
            {s.title}
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
  const [activeIdx, setActiveIdx] = useState(0)
  const [progress, setProgress] = useState(0)
  const [paused, setPaused] = useState(false)
  const [userPicked, setUserPicked] = useState(false)

  const scenarios = data.scenarios
  const activeId = scenarios[activeIdx].id
  const steps = scenarios[activeIdx].path.length - 1 // edges to reveal

  useEffect(() => setReduced(prefersReducedMotion()), [])

  useEffect(() => {
    if (!inView) return
    if (reduced) { setProgress(steps); return }
    if (paused) return
    if (progress < steps) {
      const t = setTimeout(() => setProgress((p) => p + 1), 300)
      return () => clearTimeout(t)
    }
    if (!userPicked) {
      const t = setTimeout(() => {
        setActiveIdx((i) => (i + 1) % scenarios.length)
        setProgress(0)
      }, AUTOPLAY_MS)
      return () => clearTimeout(t)
    }
  }, [inView, reduced, paused, progress, steps, userPicked, scenarios.length])

  const pick = useCallback(
    (id: string) => {
      const idx = scenarios.findIndex((s) => s.id === id)
      if (idx < 0) return
      setUserPicked(true)
      setActiveIdx(idx)
      setProgress(reduced ? scenarios[idx].path.length - 1 : 0)
    },
    [scenarios, reduced],
  )

  const lead = intro ?? data.intro

  return (
    <section id="mvp" className="bg-white text-[var(--br-body)]">
      {/* 2px full-width red divider marking the top of section 4 */}
      <div className="h-[2px] w-full bg-[var(--px-red)]" aria-hidden />
      <div className="br-container pt-16 pb-20 md:pt-24 md:pb-[120px]">
        <h2 className="text-[32px] font-medium uppercase leading-none text-[var(--br-ink)] md:text-[40px]">
          {data.heading}
        </h2>
        <p className="mt-5 max-w-3xl text-lg leading-snug text-[var(--br-muted)] md:text-[22px]">{lead}</p>

        {/* Core UX: headline → one line of body → scenario chips */}
        <div className="mt-10 flex flex-col gap-4 md:mt-12">
          <h3 className="text-[20px] font-semibold uppercase leading-none text-[var(--br-ink)] md:text-[22px]">
            {data.callout.title}
          </h3>
          <p className="text-[15px] leading-snug text-[var(--br-muted)] md:text-base">{data.callout.body}</p>
          <ScenarioChips activeId={activeId} onPick={pick} />
        </div>

        {/* the flow */}
        <div
          ref={ref}
          className="relative mt-8 overflow-hidden rounded-[var(--br-card-radius)] border border-[var(--br-line)] bg-white p-4 shadow-[var(--br-card-shadow)] md:mt-10 md:p-6"
          onMouseEnter={() => setPaused(true)}
          onMouseLeave={() => setPaused(false)}
          onFocusCapture={() => setPaused(true)}
          onBlurCapture={() => setPaused(false)}
        >
          <div className="hidden lg:block">
            <DesktopDiagram activeId={activeId} progress={progress} reduced={reduced} />
          </div>
          <div className="lg:hidden">
            <MobileFlow activeId={activeId} progress={progress} reduced={reduced} />
          </div>
        </div>

        {/* Component Libraries — nested module in this section */}
        <ComponentLibrariesSection />
      </div>
    </section>
  )
}
