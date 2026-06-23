'use client'

/**
 * Trees UX architecture - TOP-DOWN hub-and-spoke DAG renderer.
 *
 * Same engine as the Wingstop WsUxFlow / Panda LoyaltyQrSection layered-DAG
 * renderer (auto-laid-out nodes, curved SVG connectors, Flow jump-pills, a
 * legend and a floating screen card on hover), but rotated 90deg so the flow
 * reads TOP-TO-BOTTOM instead of left-to-right: depth maps to the y-axis and a
 * column's siblings spread across the x-axis. Themed for the WHITE Capabilities
 * section in Trees green. Node glyphs + type labels reuse the Panda icon set
 * (they draw with currentColor, so colour is set here).
 */
import { useMemo, useState } from 'react'
import { TREES_FLOWS, type TreesFlow, type TreesFlowNode } from './treesUxFlowData'
import { NodeGlyph, TYPE_LABEL, type DeviceKind } from '../../panda/loyaltyFlowIcons'

const GREEN = '#2e7d32'

function tone(t: TreesFlowNode['type']) {
  switch (t) {
    case 'entry': return { ring: GREEN, glow: 'rgba(46,125,50,0.08)', glyph: GREEN }
    case 'screen': return { ring: 'rgba(7,14,44,0.55)', glow: 'rgba(7,14,44,0.03)', glyph: '#070e2c' }
    case 'event': return { ring: 'rgba(214,138,0,0.7)', glow: 'rgba(214,138,0,0.07)', glyph: '#b9760a' }
    case 'api': return { ring: 'rgba(37,99,235,0.65)', glow: 'rgba(37,99,235,0.06)', glyph: '#2563eb' }
  }
}
const deviceOf = (f: TreesFlow): DeviceKind => (f.platform === 'desktop' ? 'desktop' : 'mobile')

export function TreesUxFlow() {
  const [tab, setTab] = useState(TREES_FLOWS[0].id)
  const flow = TREES_FLOWS.find((f) => f.id === tab) || TREES_FLOWS[0]
  return (
    <div role="tabpanel" id={`trees-panel-${flow.id}`} aria-labelledby={`trees-tab-${flow.id}`}>
      <FlowDetail flow={flow} tab={tab} setTab={setTab} />
    </div>
  )
}

/* -- Flow graph (always fits; layered DAG layout, rotated to top-down) -- */
// Portrait viewBox: depth runs DOWN the long (y) axis, siblings spread across x.
const VBW = 920
const VBH = 760
const T = { w: 40, h: 40 }

function computeLayout(flow: TreesFlow) {
  const ids = flow.nodes.map((n) => n.id)
  const idset = new Set(ids)
  const out: Record<string, string[]> = {}; const indeg: Record<string, number> = {}
  ids.forEach((id) => { out[id] = []; indeg[id] = 0 })
  // "back" edges (returns) do NOT contribute to depth.
  flow.edges.forEach((e) => { if (idset.has(e.from) && idset.has(e.to) && e.from !== e.to && !e.back) { out[e.from].push(e.to); indeg[e.to]++ } })
  const entryIds = new Set(flow.nodes.filter((n) => n.type === 'entry').map((n) => n.id))
  let seeds = [...entryIds]
  if (!seeds.length) seeds = ids.filter((id) => indeg[id] === 0)
  if (!seeds.length) seeds = [ids[0]]
  const orphan = (id: string) => indeg[id] === 0 && !entryIds.has(id)
  const depth: Record<string, number> = {}; ids.forEach((id) => (depth[id] = 0)); seeds.forEach((s) => (depth[s] = 0))
  for (let it = 0; it < ids.length; it++) {
    let ch = false
    for (const id of ids) { if (orphan(id)) continue; for (const nx of out[id]) if (!orphan(nx) && depth[nx] < depth[id] + 1) { depth[nx] = depth[id] + 1; ch = true } }
    if (!ch) break
  }
  const maxConnected = Math.max(0, ...ids.filter((id) => !orphan(id)).map((id) => depth[id]))
  ids.forEach((id) => { if (orphan(id)) depth[id] = maxConnected })
  entryIds.forEach((id) => (depth[id] = 0))
  const minD = Math.min(...ids.map((id) => depth[id]))
  if (minD > 0) ids.forEach((id) => (depth[id] -= minD))
  const colMap: Record<number, string[]> = {}; ids.forEach((id) => { (colMap[depth[id]] = colMap[depth[id]] || []).push(id) })
  const cols = Math.max(...ids.map((id) => depth[id])) + 1
  const pos: Record<string, { col: number; row: number; rows: number }> = {}; const rowOf: Record<string, number> = {}
  for (let c = 0; c < cols; c++) {
    const colIds = colMap[c] || []
    const score = (id: string) => { const preds = flow.edges.filter((e) => !e.back && e.to === id && depth[e.from] === c - 1 && rowOf[e.from] != null); if (!preds.length) return Number.MAX_SAFE_INTEGER; return preds.reduce((a, e) => a + rowOf[e.from], 0) / preds.length }
    const ordered = colIds.map((id, i) => ({ id, s: score(id), i })).sort((a, b) => a.s - b.s || a.i - b.i).map((o) => o.id)
    ordered.forEach((id, r) => { pos[id] = { col: c, row: r, rows: ordered.length }; rowOf[id] = r })
  }
  const maxRows = Math.max(1, ...Object.values(colMap).map((a) => a.length))
  return { pos, cols, maxRows }
}

function FlowDetail({ flow, tab, setTab }: { flow: TreesFlow; tab: string; setTab: (id: string) => void }) {
  const [active, setActive] = useState<string | null>(null)
  const nById = useMemo(() => Object.fromEntries(flow.nodes.map((n) => [n.id, n])), [flow])
  const act = active ? nById[active] : null
  const device = deviceOf(flow)
  const { pos, cols, maxRows } = useMemo(() => computeLayout(flow), [flow])
  const PADX = 60, PADY = 52
  // ROTATED: depth (col) drives the VERTICAL position; siblings (row) spread horizontally.
  const rowPitch = cols > 1 ? (VBH - 2 * PADY) / (cols - 1) : 0
  const colSpread = maxRows > 1 ? (VBW - 2 * PADX) / (maxRows - 1) : 0
  const px = (id: string) => { const r = pos[id]; const span = (r.rows - 1) * colSpread; return VBW / 2 - span / 2 + r.row * colSpread }
  const py = (id: string) => PADY + pos[id].col * rowPitch
  const NR = 20 // node radius (design units) used to inset edge ends

  return (
    <div>
      {/* header: flow title (left) + Flow jump-pills (top-right) */}
      <div className="mb-4 flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
        <h3 className="shrink-0 text-[16px] font-semibold text-[var(--br-ink)] md:text-[19px]">{flow.title}</h3>
        <div role="tablist" aria-label="UX flows" className="flex flex-wrap gap-2 md:justify-end">
          {TREES_FLOWS.map((f, i) => {
            const isActive = f.id === tab
            return (
              <button
                key={f.id}
                role="tab"
                aria-selected={isActive}
                aria-controls={`trees-panel-${f.id}`}
                id={`trees-tab-${f.id}`}
                onClick={() => setTab(f.id)}
                className={`shrink-0 whitespace-nowrap rounded-full border px-3.5 py-1.5 text-[12.5px] transition-colors outline-none focus-visible:ring-2 ${
                  isActive ? 'border-transparent font-medium text-white' : 'border-[var(--br-line)] text-[var(--br-muted)] hover:border-[#2e7d32] hover:text-[var(--br-ink)]'
                }`}
                style={isActive ? { backgroundColor: GREEN } : undefined}
              >
                {`Flow ${i + 1}`}
              </button>
            )
          })}
        </div>
      </div>

      {/* legend */}
      <div className="mb-6 flex flex-wrap items-center gap-x-5 gap-y-2 text-[11.5px] text-[var(--br-muted)] md:mb-7">
        {(['entry', 'screen', 'event', 'api'] as const).map((t) => (
          <span key={t} className="inline-flex items-center gap-1.5">
            <span className="inline-flex h-6 w-6 items-center justify-center rounded-[6px]" style={{ boxShadow: `inset 0 0 0 1px ${tone(t).ring}`, background: tone(t).glow, color: tone(t).glyph }}>
              <NodeGlyph type={t} device={device} className="h-4 w-4" />
            </span>
            <span style={{ color: tone(t).glyph }} className="font-medium">{TYPE_LABEL[t]}</span>
          </span>
        ))}
        <span className="inline-flex items-center gap-1.5">
          <svg width="26" height="10" viewBox="0 0 26 10" aria-hidden><path d="M1 5h22" stroke="rgba(7,14,44,0.45)" strokeWidth="1.4" strokeDasharray="4 4" strokeLinecap="round" /></svg>
          returns
        </span>
      </div>

      {/* graph - portrait, always fits the width */}
      <div className="relative mx-auto w-full max-w-[760px]" style={{ aspectRatio: `${VBW} / ${VBH}` }} onMouseLeave={() => setActive(null)}>
        <svg viewBox={`0 0 ${VBW} ${VBH}`} className="absolute inset-0 h-full w-full" aria-hidden="true" preserveAspectRatio="xMidYMid meet">
          <defs>
            <marker id="trfa" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="3" markerHeight="3" orient="auto-start-reverse"><path d="M0,0 L10,5 L0,10 z" fill="rgba(7,14,44,0.5)" /></marker>
          </defs>
          {flow.edges.map((e, i) => {
            const a = nById[e.from], b = nById[e.to]
            if (!a || !b || !pos[e.from] || !pos[e.to]) return null
            let ax = px(e.from), ay = py(e.from)
            let bx = px(e.to), by = py(e.to)
            const tIsScreen = b.type === 'screen'
            const sIsScreen = a.type === 'screen'
            const dx0 = bx - ax, dy0 = by - ay, len = Math.hypot(dx0, dy0) || 1
            const ux = dx0 / len, uy = dy0 / len
            const tInset = (tIsScreen ? NR * 1.15 : NR) + 4
            const sInset = (sIsScreen ? NR * 1.15 : NR) + 2
            ax += ux * sInset; ay += uy * sInset
            bx -= ux * tInset; by -= uy * tInset
            // ROTATED Bezier: vertical S-curve (control points share the midpoint Y).
            const my = (ay + by) / 2
            const related = active && (e.from === active || e.to === active)
            const op = active ? (related ? 1 : 0.12) : e.back ? 0.28 : 0.5
            return (
              <path
                key={i}
                d={`M ${ax} ${ay} C ${ax} ${my}, ${bx} ${my}, ${bx} ${by}`}
                fill="none"
                stroke="rgba(7,14,44,0.5)"
                strokeWidth={related ? 2 : 1.3}
                strokeDasharray={e.back ? '4 4' : undefined}
                markerEnd="url(#trfa)"
                style={{ transition: 'opacity .2s, stroke-width .2s' }}
                opacity={op}
              />
            )
          })}
        </svg>

        {flow.nodes.map((n) => {
          const isActive = active === n.id
          const dim = active && !isActive
          const isScreen = n.type === 'screen'
          const w = isScreen ? T.w * 1.28 : T.w
          const leftPct = ((px(n.id) - w / 2) / VBW) * 100
          const topPct = ((py(n.id) - w / 2) / VBH) * 100
          const wPct = (w / VBW) * 100
          const tn = tone(n.type)
          return (
            <button
              key={n.id}
              type="button"
              onMouseEnter={() => setActive(n.id)}
              onFocus={() => setActive(n.id)}
              onClick={() => setActive(isActive ? null : n.id)}
              aria-label={`${n.label} - ${TYPE_LABEL[n.type]}`}
              className="absolute flex aspect-square items-center justify-center outline-none focus-visible:ring-2"
              style={{
                left: `${leftPct}%`,
                top: `${topPct}%`,
                width: `${wPct}%`,
                zIndex: isActive ? 50 : isScreen ? 20 : 10,
                borderRadius: '8px',
                background: '#fff',
                boxShadow: `inset 0 0 0 ${n.type === 'entry' || isScreen ? 1.9 : 1.4}px ${tn.ring}, 0 4px 12px rgba(7,14,44,0.06)`,
                transform: isActive ? 'scale(1.18)' : 'scale(1)',
                transition: 'transform .15s, opacity .2s',
                opacity: dim ? 0.32 : 1,
                cursor: 'pointer',
              }}
            >
              <span style={{ color: tn.glyph }} className="inline-flex h-full w-full items-center justify-center">
                <NodeGlyph type={n.type} device={device} className={isScreen ? 'h-[64%] w-[64%]' : 'h-1/2 w-1/2'} />
              </span>
            </button>
          )
        })}

        {/* node labels - sit just beside each node so the top-down map is readable at a glance */}
        {flow.nodes.map((n) => {
          if (active && active !== n.id) return null
          const w = (n.type === 'screen' ? T.w * 1.28 : T.w)
          const leftPct = (px(n.id) / VBW) * 100
          const topPct = ((py(n.id) + w / 2 + 7) / VBH) * 100
          return (
            <span
              key={`lbl-${n.id}`}
              className="pointer-events-none absolute -translate-x-1/2 whitespace-nowrap text-center text-[10.5px] font-medium leading-tight text-[var(--br-muted)] md:text-[11.5px]"
              style={{ left: `${leftPct}%`, top: `${topPct}%`, zIndex: 5 }}
            >
              {n.label}
            </span>
          )
        })}

        {/* floating card next to the active node */}
        {act && (() => {
          const leftPctC = (px(act.id) / VBW) * 100
          const onRight = leftPctC > 50
          const topPctC = Math.min(80, Math.max(12, (py(act.id) / VBH) * 100))
          const tn = tone(act.type)
          return (
            <div className={`pointer-events-none absolute z-[60] w-[212px] md:w-[236px]`} style={{ top: `${topPctC}%`, ...(onRight ? { right: `${100 - leftPctC + 3}%` } : { left: `${leftPctC + 3}%` }), transform: 'translateY(-50%)' }}>
              <div className="overflow-hidden rounded-[12px] border border-[var(--br-line)] bg-white shadow-[0_16px_40px_rgba(7,14,44,0.18)]">
                {act.thumb && (
                  <div className="flex h-[290px] items-center justify-center border-b border-[var(--br-line)] bg-[#f6f6f8] p-3.5">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={act.thumb} alt={act.label} className="max-h-full max-w-full rounded-[6px] object-contain shadow-[0_10px_26px_rgba(7,14,44,0.18)]" />
                  </div>
                )}
                <div className="p-3.5">
                  <div className="flex flex-wrap items-center gap-1.5">
                    <span className="inline-flex h-5 w-5 items-center justify-center rounded-[5px]" style={{ boxShadow: `inset 0 0 0 1px ${tn.ring}`, background: tn.glow, color: tn.glyph }}>
                      <NodeGlyph type={act.type} device={device} className="h-3.5 w-3.5" />
                    </span>
                    <h4 className="text-[15px] font-semibold text-[var(--br-ink)]">{act.label}</h4>
                    <span className="rounded-full bg-[var(--br-ink)]/[0.07] px-1.5 py-0.5 text-[9.5px] font-bold uppercase tracking-wide text-[var(--br-muted)]">{TYPE_LABEL[act.type]}</span>
                  </div>
                  {act.role && <p className="mt-2 text-[12.5px] leading-snug text-[var(--br-muted)]">{act.role}</p>}
                </div>
              </div>
            </div>
          )
        })()}
      </div>
    </div>
  )
}
