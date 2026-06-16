'use client'

import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { mvp as defaults, type MvpGlyph, type MvpNode } from './data'

/**
 * Section 4 — MVP Fast-Launch / Core UX.
 *
 * The Figma source (node 278:73637) was a flat screenshot of the original UX
 * flowchart plus a "Core UX" text box. Joshua originally PRESENTED that flow by
 * dimming the whole diagram and lighting one color-coded path at a time. This
 * recreates that as the interaction: the full flow is drawn once as live vector
 * nodes + SVG connectors, dimmed to light grey; selecting a scenario lights its
 * path in Panda red and draws the connectors in sequence. Every path converges
 * on the same checkout spine — the point of the section.
 *
 * Palette stays on-brand (white field, grey diagram, single red accent — not
 * the multi-color slide legend). Desktop renders the positioned diagram;
 * narrow screens fall back to a vertical step list of the selected path.
 *
 * Conventions: br-* editorial system + --px-red accent (set on the article
 * root). Auto-advances through scenarios when in view; pauses on hover/focus;
 * honors prefers-reduced-motion (no autoplay, connectors drawn instantly).
 */

const RED = 'var(--px-red)'
const AUTOPLAY_MS = 4200

/* normalized grid → viewBox units */
const COLS = 12
const ROWS = 5
const VBW = 1200
const VBH = 500
const colX = (c: number) => ((c + 0.5) / COLS) * VBW
const rowY = (r: number) => ((r + 0.5) / ROWS) * VBH
const NODE_W = 78
const NODE_H = 96

/* ── one-shot in-view detector (mirrors OutcomesSection) ─────────────────── */
function useInViewOnce<T extends HTMLElement>(threshold = 0.25) {
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

/* ─────────────────────────────────────────────────────────────────────────
 * NodeGlyph — the tiny schematic screen drawn inside each node's phone.
 * Pure SVG primitives. `lit` recolors the accent bits to red; otherwise grey.
 * Drawn in a 30×46 local box (the phone's inner screen).
 * ───────────────────────────────────────────────────────────────────────── */
function NodeGlyph({ glyph, lit }: { glyph: MvpGlyph; lit: boolean }) {
  const accent = lit ? RED : '#c4c4cc'
  const soft = lit ? 'rgba(208,43,46,0.18)' : '#e8e8ee'
  const line = '#d4d4db'
  const r = (x: number, y: number, w: number, h: number, fill: string, rad = 1.5) =>
    <rect x={x} y={y} width={w} height={h} rx={rad} fill={fill} />
  switch (glyph) {
    case 'home':
      return <g>{r(3, 3, 24, 9, soft)}{r(3, 15, 11, 12, line)}{r(16, 15, 11, 12, line)}{r(3, 30, 11, 12, line)}{r(16, 30, 11, 12, line)}</g>
    case 'menu':
      return <g>{r(3, 3, 9, 4, accent)}{r(14, 3, 7, 4, line)}{r(3, 10, 11, 13, line)}{r(16, 10, 11, 13, line)}{r(3, 26, 11, 13, line)}{r(16, 26, 11, 13, line)}</g>
    case 'product':
      return <g>{r(3, 3, 24, 16, line)}{r(3, 22, 18, 3, line)}{r(3, 28, 22, 3, line)}{r(3, 38, 24, 5, accent, 2.5)}</g>
    case 'productSel':
      return <g>{r(3, 3, 24, 16, soft)}<rect x="3" y="3" width="24" height="16" rx="1.5" fill="none" stroke={accent} strokeWidth="1.4" />{r(3, 22, 18, 3, line)}{r(3, 28, 22, 3, line)}{r(3, 38, 24, 5, accent, 2.5)}</g>
    case 'bag':
      return <g>{r(3, 4, 24, 8, accent, 2)}{r(3, 15, 24, 7, line)}{r(3, 24, 24, 7, line)}{r(3, 36, 13, 5, line, 2.5)}{r(18, 36, 9, 5, accent, 2.5)}</g>
    case 'checkout':
      return <g>{r(3, 4, 24, 6, line)}{r(3, 13, 24, 6, line)}{r(3, 24, 16, 4, line)}{r(21, 24, 6, 4, accent)}{r(3, 36, 24, 5, accent, 2.5)}</g>
    case 'confirmation':
      return (
        <g>
          <circle cx="15" cy="17" r="9" fill={lit ? RED : '#d8d8de'} />
          <path d="M11 17.5l3 3 5-6" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
          {r(7, 31, 16, 3, line)}{r(10, 37, 10, 3, line)}
        </g>
      )
    case 'promo':
      return <g>{r(3, 3, 24, 9, accent, 2)}{r(3, 15, 11, 12, line)}{r(16, 15, 11, 12, line)}<circle cx="7" cy="7.5" r="2.5" fill="white" /></g>
    case 'popup':
      return <g><rect x="0" y="0" width="30" height="46" fill={soft} />{r(3, 18, 24, 25, '#ffffff', 3)}<rect x="3" y="18" width="24" height="25" rx="3" fill="none" stroke={accent} strokeWidth="1.2" />{r(6, 22, 14, 3, line)}{r(6, 28, 18, 5, line, 2.5)}{r(6, 35, 18, 4, accent, 2)}</g>
    case 'category':
      return <g>{r(3, 3, 9, 4, accent)}{r(3, 10, 24, 8, line)}{r(3, 20, 24, 8, line)}{r(3, 30, 24, 8, line)}</g>
    case 'quantity':
      return <g><rect x="0" y="0" width="30" height="46" fill={soft} />{r(4, 16, 22, 26, '#ffffff', 3)}<rect x="4" y="16" width="22" height="26" rx="3" fill="none" stroke={accent} strokeWidth="1.2" /><circle cx="9" cy="30" r="3.2" fill={line} /><circle cx="21" cy="30" r="3.2" fill={accent} /><rect x="13.5" y="28.5" width="3" height="3" fill={accent} /></g>
    case 'location':
      return (
        <g>
          {r(3, 3, 24, 26, line)}
          <path d="M15 9c2.6 0 4.7 2.1 4.7 4.7 0 3.3-4.7 9-4.7 9s-4.7-5.7-4.7-9C10.3 11.1 12.4 9 15 9z" fill={lit ? RED : '#bcbcc4'} />
          <circle cx="15" cy="13.7" r="1.7" fill="white" />
          {r(3, 33, 24, 4, accent, 2)}
        </g>
      )
    case 'handoff':
      // a settings/handoff card: pin + two toggle rows (pickup / delivery)
      return (
        <g>
          {r(3, 3, 24, 7, soft, 2)}
          <path d="M9 4.2c1.7 0 3 1.3 3 3 0 2-3 4.6-3 4.6S6 9.2 6 7.2c0-1.7 1.3-3 3-3z" fill={lit ? RED : '#bcbcc4'} />
          {r(3, 15, 18, 4, line)}<circle cx="25" cy="17" r="2.6" fill={accent} />
          {r(3, 23, 18, 4, line)}<circle cx="25" cy="25" r="2.6" fill={line} />
          {r(3, 33, 24, 5, accent, 2.5)}
        </g>
      )
  }
}

/* phone frame around a glyph, used by both desktop nodes and mobile list */
function PhoneTile({ node, lit, w = NODE_W }: { node: MvpNode; lit: boolean; w?: number }) {
  const h = (w / NODE_W) * NODE_H
  return (
    <div
      className="relative shrink-0 rounded-[12px] border bg-white transition-[border-color,box-shadow,transform] duration-300"
      style={{
        width: w,
        height: h,
        borderColor: lit ? RED : '#e4e4ea',
        boxShadow: lit
          ? '0 10px 22px rgba(208,43,46,0.18), 0 2px 6px rgba(208,43,46,0.10)'
          : '0 2px 6px rgba(7,14,44,0.05)',
        transform: lit ? 'translateY(-2px)' : 'none',
      }}
    >
      <svg viewBox="0 0 30 46" className="absolute inset-0 m-auto" style={{ width: '80%', height: '82%' }} aria-hidden>
        <NodeGlyph glyph={node.glyph} lit={lit} />
      </svg>
    </div>
  )
}

/* ── edge geometry ───────────────────────────────────────────────────────
 * Build an orthogonal-ish connector between two node anchors in viewBox units.
 * Anchors are taken from each node's bounding box (half NODE_W/H around its
 * grid centre). `kind` chooses the routing so branches read like the source. */
type Pt = { x: number; y: number }
const hw = NODE_W / 2
const hh = NODE_H / 2

function nodeCenter(n: MvpNode): Pt {
  return { x: colX(n.col), y: rowY(n.row) }
}

/** Extra vertical room below the spine (viewBox units) for the two return
 *  rails. Must clear the bottom-row nodes (category/quantity) and their labels. */
const RETURN_PAD = 70
/** depth of a return edge's bottom rail, keyed so the two loops don't overlap. */
function returnRail(from: MvpNode): number {
  return from.id === 'confirmation' ? VBH + RETURN_PAD - 12 : VBH + RETURN_PAD - 32
}

function buildPath(from: MvpNode, to: MvpNode, kind?: string): string {
  const a = nodeCenter(from)
  const b = nodeCenter(to)
  if (kind === 'return') {
    // drop out the bottom of `from`, run along a low rail, rise into the
    // bottom of `to` (used for the Add-more / scrolled-location loops).
    const ay = a.y + hh
    const by = b.y + hh
    const railY = returnRail(from)
    return `M ${a.x} ${ay} L ${a.x} ${railY} L ${b.x} ${railY} L ${b.x} ${by}`
  }
  if (kind === 'h' || (!kind && Math.abs(a.y - b.y) < 1)) {
    // straight horizontal between facing edges
    const dir = b.x > a.x ? 1 : -1
    const x1 = a.x + dir * hw
    const x2 = b.x - dir * hw
    return `M ${x1} ${a.y} L ${x2} ${b.y}`
  }
  if (kind === 'elbow-up' || kind === 'elbow-down') {
    // leave from top/bottom of `from`, run vertically, then into the side or
    // top/bottom of `to` with a midpoint elbow.
    const up = kind === 'elbow-up'
    const ay = up ? a.y - hh : a.y + hh
    const by = up ? b.y + hh : b.y - hh
    const sameColish = Math.abs(a.x - b.x) < NODE_W
    if (sameColish) {
      // mostly vertical: small S so it doesn't overlap the node centers
      const midY = (ay + by) / 2
      return `M ${a.x} ${ay} L ${a.x} ${midY} L ${b.x} ${midY} L ${b.x} ${by}`
    }
    // dog-leg: up/down out of `from`, across, then down/up into `to`
    const reach = up ? Math.min(ay, by) : Math.max(ay, by)
    const railY = up ? reach - 6 : reach + 6
    return `M ${a.x} ${ay} L ${a.x} ${railY} L ${b.x} ${railY} L ${b.x} ${by}`
  }
  // fallback straight
  return `M ${a.x} ${a.y} L ${b.x} ${b.y}`
}

/* midpoint of a path's bounding span — used to anchor the edge label pill */
function edgeLabelPos(from: MvpNode, to: MvpNode, kind?: string): Pt {
  const a = nodeCenter(from)
  const b = nodeCenter(to)
  if (kind === 'return') {
    return { x: (a.x + b.x) / 2, y: returnRail(from) }
  }
  if (kind === 'h' || (!kind && Math.abs(a.y - b.y) < 1)) {
    return { x: (a.x + b.x) / 2, y: a.y - 14 }
  }
  const up = kind === 'elbow-up'
  const ay = up ? a.y - hh : a.y + hh
  const by = up ? b.y + hh : b.y - hh
  const reach = up ? Math.min(ay, by) : Math.max(ay, by)
  const railY = up ? reach - 6 : reach + 6
  return { x: (a.x + b.x) / 2, y: railY }
}

/* set of "from→to" keys for the active scenario path (consecutive pairs) */
function pathEdgeKeys(path: string[]): Set<string> {
  const s = new Set<string>()
  for (let i = 0; i < path.length - 1; i++) s.add(`${path[i]}->${path[i + 1]}`)
  return s
}

interface DiagramProps {
  activeId: string
  /** how many path-steps have been "drawn" so far (for the sequential reveal) */
  progress: number
  reduced: boolean
}

function DesktopDiagram({ activeId, progress, reduced }: DiagramProps) {
  const { nodes, edges, scenarios } = defaults
  const scenario = scenarios.find((s) => s.id === activeId) ?? scenarios[0]
  const nodeById = useMemo(() => {
    const m = new Map<string, MvpNode>()
    nodes.forEach((n) => m.set(n.id, n))
    return m
  }, [nodes])
  const activeKeys = useMemo(() => pathEdgeKeys(scenario.path), [scenario.path])
  const activeNodeIds = useMemo(() => new Set(scenario.path), [scenario.path])

  // Which step indices are revealed yet (sequential draw). reduced = all at once.
  const revealedStep = reduced ? scenario.path.length : progress

  // is this directed edge part of the active path, and has it been drawn yet?
  const edgeStep = (fromId: string, toId: string): number => {
    for (let i = 0; i < scenario.path.length - 1; i++) {
      if (scenario.path[i] === fromId && scenario.path[i + 1] === toId) return i
    }
    return -1
  }

  return (
    // extra bottom room (RETURN_PAD) holds the two return rails below the diagram
    <div className="relative w-full" style={{ aspectRatio: `${VBW} / ${VBH + RETURN_PAD}` }}>
      <svg viewBox={`0 0 ${VBW} ${VBH + RETURN_PAD}`} className="absolute inset-0 h-full w-full" aria-hidden>
        <defs>
          <marker id="mvp-arrow-dim" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
            <path d="M0 1L8 5L0 9" fill="none" stroke="#cfcfd6" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
          </marker>
          <marker id="mvp-arrow-lit" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="6.5" markerHeight="6.5" orient="auto-start-reverse">
            <path d="M0 1L8 5L0 9" fill="none" stroke="#D02B2E" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
          </marker>
        </defs>

        {/* layer 1 — every edge, dim (alt branches dashed + fainter) */}
        <g>
          {edges.map((e, i) => (
            <path
              key={`dim-${i}`}
              d={buildPath(nodeById.get(e.from)!, nodeById.get(e.to)!, e.kind)}
              fill="none"
              stroke={e.alt ? '#e7e7ec' : '#dadae1'}
              strokeWidth="2"
              strokeDasharray={e.alt ? '5 5' : undefined}
              strokeLinecap="round"
              strokeLinejoin="round"
              markerEnd="url(#mvp-arrow-dim)"
            />
          ))}
        </g>

        {/* layer 2 — active path edges, red, drawn sequentially */}
        <g>
          {scenario.path.slice(0, -1).map((fromId, stepIdx) => {
            const toId = scenario.path[stepIdx + 1]
            const edge =
              edges.find((e) => e.from === fromId && e.to === toId) ??
              ({ from: fromId, to: toId } as (typeof edges)[number])
            const drawn = stepIdx < revealedStep
            return (
              <path
                key={`lit-${stepIdx}`}
                d={buildPath(nodeById.get(fromId)!, nodeById.get(toId)!, edge.kind)}
                fill="none"
                stroke={RED}
                strokeWidth="3"
                strokeLinecap="round"
                strokeLinejoin="round"
                markerEnd="url(#mvp-arrow-lit)"
                pathLength={1}
                style={{
                  strokeDasharray: 1,
                  strokeDashoffset: drawn ? 0 : 1,
                  transition: reduced ? 'none' : 'stroke-dashoffset 520ms ease-in-out',
                  opacity: drawn ? 1 : 0,
                }}
              />
            )
          })}
        </g>
      </svg>

      {/* EDGE LABELS — every label always rendered as a readable pill.
          Dim = white pill + hairline border; on the active (drawn) path = solid
          red. label2 is nudged further along the edge so the two never stack. */}
      {edges.map((e, i) => {
        if (!e.label && !e.label2) return null
        const from = nodeById.get(e.from)!
        const to = nodeById.get(e.to)!
        const pos = edgeLabelPos(from, to, e.kind)
        const step = edgeStep(e.from, e.to)
        const onPath = step >= 0
        const active = onPath && step < revealedStep
        const horizontal = e.kind === 'h' || e.kind === 'return'
        const pill = (text: string, k: string, shift: number) => (
          <span
            key={`${i}-${k}`}
            className="br-data pointer-events-none absolute z-20 -translate-x-1/2 -translate-y-1/2 whitespace-nowrap rounded-full px-2 py-[3px] text-[10px] font-medium leading-none transition-colors duration-300"
            style={{
              left: `${((pos.x + (horizontal ? 0 : shift)) / VBW) * 100}%`,
              top: `${((pos.y + (horizontal ? shift : 0)) / (VBH + RETURN_PAD)) * 100}%`,
              background: active ? RED : '#ffffff',
              color: active ? '#ffffff' : 'var(--br-muted)',
              border: active ? '1px solid transparent' : '1px solid var(--br-line)',
              boxShadow: '0 1px 3px rgba(7,14,44,0.06)',
            }}
          >
            {text}
          </span>
        )
        return (
          <span key={`lbl-${i}`}>
            {e.label ? pill(e.label, 'a', e.label2 ? -10 : 0) : null}
            {e.label2 ? pill(e.label2, 'b', 12) : null}
          </span>
        )
      })}

      {/* NODES, positioned over the SVG */}
      {nodes.map((n) => {
        const lit = activeNodeIds.has(n.id)
        const arrivalIdx = scenario.path.indexOf(n.id)
        const reached = lit && arrivalIdx <= revealedStep
        return (
          <div
            key={n.id}
            className="absolute z-10 flex -translate-x-1/2 -translate-y-1/2 flex-col items-center"
            style={{ left: `${(colX(n.col) / VBW) * 100}%`, top: `${(rowY(n.row) / (VBH + RETURN_PAD)) * 100}%` }}
          >
            <div style={{ width: NODE_W }}>
              <PhoneTile node={n} lit={reached} />
            </div>
            {/* label gets its own backing pill so it reads over any line */}
            <span
              className="mt-1.5 max-w-[100px] rounded-[5px] px-1.5 py-0.5 text-center text-[10.5px] font-medium leading-tight transition-colors duration-300"
              style={{
                color: reached ? '#ffffff' : 'var(--br-muted)',
                background: reached ? RED : 'var(--br-bg-2)',
              }}
            >
              {n.label}
            </span>
          </div>
        )
      })}
    </div>
  )
}

/* ── mobile fallback — vertical step list of the active path ─────────────── */
function MobileFlow({ activeId, progress, reduced }: DiagramProps) {
  const { nodes, edges, scenarios } = defaults
  const scenario = scenarios.find((s) => s.id === activeId) ?? scenarios[0]
  const nodeById = useMemo(() => {
    const m = new Map<string, MvpNode>()
    nodes.forEach((n) => m.set(n.id, n))
    return m
  }, [nodes])
  const revealedStep = reduced ? scenario.path.length : progress

  return (
    <ol className="relative mx-auto flex max-w-[420px] list-none flex-col gap-0">
      {scenario.path.map((id, i) => {
        const node = nodeById.get(id)!
        const reached = i <= revealedStep
        const nextId = scenario.path[i + 1]
        const edge = nextId ? edges.find((e) => e.from === id && e.to === nextId) : undefined
        const connectorDrawn = i < revealedStep
        return (
          <li key={`${id}-${i}`} className="flex gap-4">
            {/* rail: tile + connector */}
            <div className="flex flex-col items-center">
              <div style={{ width: 56 }}>
                <PhoneTile node={node} lit={reached} w={56} />
              </div>
              {nextId && (
                <span
                  aria-hidden
                  className="my-1 w-[2px] flex-1 rounded-full transition-colors duration-300"
                  style={{ minHeight: 34, background: connectorDrawn ? RED : '#e2e2e8' }}
                />
              )}
            </div>
            {/* label + action */}
            <div className={nextId ? 'pb-3 pt-2' : 'pt-2'}>
              <p
                className="text-[15px] font-medium leading-tight transition-colors duration-300"
                style={{ color: reached ? 'var(--br-ink)' : '#aeaeb6' }}
              >
                {node.label}
              </p>
              {edge?.label && (
                <p
                  className="br-data mt-1 text-[12px] leading-none transition-colors duration-300"
                  style={{ color: connectorDrawn ? 'var(--px-red)' : '#bcbcc4' }}
                >
                  ↓ {edge.label}
                </p>
              )}
            </div>
          </li>
        )
      })}
    </ol>
  )
}

/* ── scenario selector chips ─────────────────────────────────────────────── */
function ScenarioChips({
  activeId,
  onPick,
}: {
  activeId: string
  onPick: (id: string) => void
}) {
  return (
    <div className="flex flex-wrap gap-2.5" role="tablist" aria-label="Ordering scenarios">
      {defaults.scenarios.map((s, i) => {
        const active = s.id === activeId
        return (
          <button
            key={s.id}
            role="tab"
            aria-selected={active}
            onClick={() => onPick(s.id)}
            className="group flex items-center gap-2 rounded-full border px-4 py-2 text-[14px] font-medium leading-none transition-colors duration-200 md:text-[15px]"
            style={{
              borderColor: active ? 'white' : 'rgba(255,255,255,0.5)',
              background: active ? 'white' : 'rgba(255,255,255,0.10)',
              color: active ? 'var(--px-red)' : 'white',
            }}
          >
            <span
              className="br-data grid h-5 w-5 place-items-center rounded-full text-[11px] transition-colors duration-200"
              style={{
                background: active ? 'var(--px-red)' : 'rgba(255,255,255,0.18)',
                color: 'white',
              }}
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

/* ─────────────────────────────────────────────────────────────────────────
 * MvpFlowSection — header + Core UX callout + the interactive flow.
 * ───────────────────────────────────────────────────────────────────────── */
export function MvpFlowSection({ intro }: { intro?: string } = {}) {
  const data = defaults
  const { ref, inView } = useInViewOnce<HTMLDivElement>()
  const [reduced, setReduced] = useState(false)
  const [activeIdx, setActiveIdx] = useState(0)
  const [progress, setProgress] = useState(0)
  const [paused, setPaused] = useState(false)
  /** once the user picks a chip, stop auto-cycling between scenarios */
  const [userPicked, setUserPicked] = useState(false)

  const scenarios = data.scenarios
  const activeId = scenarios[activeIdx].id
  const pathLen = scenarios[activeIdx].path.length

  useEffect(() => {
    setReduced(prefersReducedMotion())
  }, [])

  // Sequential draw of the active path's steps, then (if auto) advance scenario.
  useEffect(() => {
    if (!inView) return
    if (reduced) {
      setProgress(pathLen) // show the whole path immediately
      return
    }
    if (paused) return

    // still drawing this path?
    if (progress < pathLen - 1) {
      const t = setTimeout(() => setProgress((p) => p + 1), 560)
      return () => clearTimeout(t)
    }
    // path fully drawn — hold, then move to next scenario (unless user-driven)
    if (!userPicked) {
      const t = setTimeout(() => {
        setActiveIdx((i) => (i + 1) % scenarios.length)
        setProgress(0)
      }, AUTOPLAY_MS)
      return () => clearTimeout(t)
    }
  }, [inView, reduced, paused, progress, pathLen, userPicked, scenarios.length])

  const pick = useCallback(
    (id: string) => {
      const idx = scenarios.findIndex((s) => s.id === id)
      if (idx < 0) return
      setUserPicked(true)
      setActiveIdx(idx)
      setProgress(reduced ? scenarios[idx].path.length : 0)
    },
    [scenarios, reduced],
  )

  const lead = intro ?? data.intro

  return (
    <section id="mvp" className="bg-[var(--px-red)] text-white">
      <div className="br-container pt-16 pb-20 md:pt-24 md:pb-[120px]">
        {/* ── header ─────────────────────────────────────────────── */}
        <h2 className="text-[32px] font-medium uppercase leading-none text-white md:text-[40px]">
          4. {data.heading}
        </h2>
        <p className="mt-5 max-w-3xl text-lg leading-snug text-white/90 md:text-[22px]">
          {lead}
        </p>

        {/* ── Core UX callout + scenario chips ───────────────────── */}
        <div className="mt-10 grid grid-cols-1 gap-8 lg:grid-cols-[minmax(0,360px)_minmax(0,1fr)] lg:items-end md:mt-12">
          <div className="rounded-[var(--br-card-radius)] border border-white/40 bg-white/10 p-6 md:p-7">
            <div className="flex items-center gap-2.5">
              <span className="grid h-7 w-7 place-items-center rounded-full bg-white">
                <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="var(--px-red)" strokeWidth="2.4" aria-hidden>
                  <path d="M4 7h16M4 12h16M4 17h10" strokeLinecap="round" />
                </svg>
              </span>
              <h3 className="text-[20px] font-semibold uppercase leading-none text-white md:text-[22px]">
                {data.callout.title}
              </h3>
            </div>
            <p className="mt-3 text-[15px] leading-snug text-white/90 md:text-base">
              {data.callout.body}
            </p>
          </div>

          <div className="flex flex-col gap-3">
            <ScenarioChips activeId={activeId} onPick={pick} />
            <p className="br-data text-[13px] leading-snug text-white/75">
              {data.scenarios[activeIdx].blurb}
            </p>
          </div>
        </div>

        {/* ── the flow — white card on the red field so the highlight reads ── */}
        <div
          ref={ref}
          className="relative mt-8 overflow-hidden rounded-[var(--br-card-radius)] bg-white p-5 shadow-[0_18px_40px_rgba(0,0,0,0.18)] md:mt-10 md:p-8"
          onMouseEnter={() => setPaused(true)}
          onMouseLeave={() => setPaused(false)}
          onFocusCapture={() => setPaused(true)}
          onBlurCapture={() => setPaused(false)}
        >
          {/* desktop positioned diagram */}
          <div className="hidden lg:block">
            <DesktopDiagram activeId={activeId} progress={progress} reduced={reduced} />
          </div>
          {/* mobile / tablet vertical list */}
          <div className="lg:hidden">
            <MobileFlow activeId={activeId} progress={progress} reduced={reduced} />
          </div>
        </div>

        {/* converge note + autoplay legend */}
        <p className="mt-5 flex items-center gap-2 text-[14px] leading-snug text-white/85 md:text-[15px]">
          <span className="h-1.5 w-1.5 shrink-0 rounded-full bg-white" aria-hidden />
          {data.hint}
        </p>
      </div>
    </section>
  )
}
