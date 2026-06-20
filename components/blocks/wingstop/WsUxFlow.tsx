'use client'

/**
 * Wingstop §7 UX flows — hub-and-spoke DAG renderer.
 *
 * Adapted from Panda's LoyaltyQrSection FlowDetail + computeLayout (the auto-laid
 * layered-DAG renderer with curved SVG arrows, Flow jump-pills, a legend, and a
 * floating screen card on hover). Re-themed for the WHITE §7 section: nodes read
 * as dark/green outlines on white instead of white outlines on red, edges are
 * grey, and the hover card is a light card. Node glyphs + type labels are reused
 * from the Panda icon set (they draw with currentColor, so colour is set here).
 */
import { useMemo, useState } from 'react'
import { WS_FLOWS, type WsFlow, type WsFlowNode } from './uxFlowData'
import { NodeGlyph, TYPE_LABEL, type DeviceKind } from '../panda/loyaltyFlowIcons'

const GREEN = '#00843D'

function tone(t: WsFlowNode['type']) {
  switch (t) {
    case 'entry': return { ring: GREEN, glow: 'rgba(0,132,61,0.08)', glyph: GREEN }
    case 'screen': return { ring: 'rgba(7,14,44,0.55)', glow: 'rgba(7,14,44,0.03)', glyph: '#070e2c' }
    case 'event': return { ring: 'rgba(214,138,0,0.7)', glow: 'rgba(214,138,0,0.07)', glyph: '#b9760a' }
    case 'api': return { ring: 'rgba(37,99,235,0.65)', glow: 'rgba(37,99,235,0.06)', glyph: '#2563eb' }
  }
}
const deviceOf = (f: WsFlow): DeviceKind => (f.platform === 'desktop' ? 'desktop' : 'mobile')

export function WsUxFlow() {
  const [tab, setTab] = useState(WS_FLOWS[0].id)
  const flow = WS_FLOWS.find((f) => f.id === tab) || WS_FLOWS[0]
  return (
    <div role="tabpanel" id={`ws-panel-${flow.id}`} aria-labelledby={`ws-tab-${flow.id}`}>
      <FlowDetail flow={flow} tab={tab} setTab={setTab} />
    </div>
  )
}

/* ── Flow graph (always fits; layered DAG layout) ── */
const VBW = 1180
const VBH = 470
const T = { w: 34, h: 34 }

function computeLayout(flow: WsFlow) {
  const ids = flow.nodes.map((n) => n.id)
  const idset = new Set(ids)
  const out: Record<string, string[]> = {}; const indeg: Record<string, number> = {}
  ids.forEach((id) => { out[id] = []; indeg[id] = 0 })
  // "back" edges (return-to-hub) do NOT contribute to depth — otherwise the hub
  // would be pushed to the far right by its own returning spokes.
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

function FlowDetail({ flow, tab, setTab }: { flow: WsFlow; tab: string; setTab: (id: string) => void }) {
  const [active, setActive] = useState<string | null>(null)
  const nById = useMemo(() => Object.fromEntries(flow.nodes.map((n) => [n.id, n])), [flow])
  const act = active ? nById[active] : null
  const device = deviceOf(flow)
  const { pos, cols, maxRows } = useMemo(() => computeLayout(flow), [flow])
  const PADX = 54, PADY = 44
  const colW = cols > 1 ? (VBW - 2 * PADX) / (cols - 1) : 0
  const rowPitch = maxRows > 1 ? (VBH - 2 * PADY) / (maxRows - 1) : 0
  const px = (id: string) => PADX + pos[id].col * colW
  const py = (id: string) => { const r = pos[id]; const span = (r.rows - 1) * rowPitch; return VBH / 2 - span / 2 + r.row * rowPitch }
  const NR = 17 // node radius (design units) used to inset edge ends

  return (
    <div>
      {/* header: flow title (left) + Flow 1-4 jump-pills (top-right) */}
      <div className="mb-4 flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
        <h3 className="shrink-0 text-[16px] font-semibold text-[var(--br-ink)] md:text-[19px]">{flow.title}</h3>
        <div role="tablist" aria-label="UX flows" className="flex flex-wrap gap-2 md:justify-end">
          {WS_FLOWS.map((f, i) => {
            const isActive = f.id === tab
            return (
              <button
                key={f.id}
                role="tab"
                aria-selected={isActive}
                aria-controls={`ws-panel-${f.id}`}
                id={`ws-tab-${f.id}`}
                onClick={() => setTab(f.id)}
                className={`shrink-0 whitespace-nowrap rounded-full border px-3.5 py-1.5 text-[12.5px] transition-colors outline-none focus-visible:ring-2 focus-visible:ring-[var(--ws-green)] ${
                  isActive ? 'border-transparent font-medium text-white' : 'border-[var(--br-line)] text-[var(--br-muted)] hover:border-[var(--ws-green)] hover:text-[var(--br-ink)]'
                }`}
                style={isActive ? { backgroundColor: GREEN } : undefined}
              >
                {`Flow ${i + 1}`}
              </button>
            )
          })}
        </div>
      </div>

      {/* legend — sits below the flow title, above the graph */}
      <div className="mb-6 flex flex-wrap items-center gap-x-5 gap-y-2 text-[11.5px] text-[var(--br-muted)] md:mb-7">
        {(['entry', 'screen', 'event'] as const).map((t) => (
          <span key={t} className="inline-flex items-center gap-1.5">
            <span className="inline-flex h-6 w-6 items-center justify-center rounded-[6px]" style={{ boxShadow: `inset 0 0 0 1px ${tone(t).ring}`, background: tone(t).glow, color: tone(t).glyph }}>
              <NodeGlyph type={t} device={device} className="h-4 w-4" />
            </span>
            <span style={{ color: tone(t).glyph }} className="font-medium">{TYPE_LABEL[t]}</span>
          </span>
        ))}
        <span className="inline-flex items-center gap-1.5">
          <svg width="26" height="10" viewBox="0 0 26 10" aria-hidden><path d="M1 5h22" stroke="rgba(7,14,44,0.45)" strokeWidth="1.4" strokeDasharray="4 4" strokeLinecap="round" /></svg>
          returns to hub
        </span>
      </div>

      {/* graph — always fits the width */}
      <div className="relative w-full" style={{ aspectRatio: `${VBW} / ${VBH}` }} onMouseLeave={() => setActive(null)}>
        <svg viewBox={`0 0 ${VBW} ${VBH}`} className="absolute inset-0 h-full w-full" aria-hidden="true" preserveAspectRatio="xMidYMid meet">
          <defs>
            <marker id="wsfa" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="3" markerHeight="3" orient="auto-start-reverse"><path d="M0,0 L10,5 L0,10 z" fill="rgba(7,14,44,0.5)" /></marker>
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
            const mx = (ax + bx) / 2
            const related = active && (e.from === active || e.to === active)
            const op = active ? (related ? 1 : 0.12) : e.back ? 0.28 : 0.5
            return (
              <path
                key={i}
                d={`M ${ax} ${ay} C ${mx} ${ay}, ${mx} ${by}, ${bx} ${by}`}
                fill="none"
                stroke="rgba(7,14,44,0.5)"
                strokeWidth={related ? 2 : 1.3}
                strokeDasharray={e.back ? '4 4' : undefined}
                markerEnd="url(#wsfa)"
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
              aria-label={`${n.label} — ${TYPE_LABEL[n.type]}`}
              className="absolute flex aspect-square items-center justify-center bg-white outline-none focus-visible:ring-2 focus-visible:ring-[var(--ws-green)]"
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

        {/* floating card next to the active node */}
        {act && (() => {
          const leftPctC = (px(act.id) / VBW) * 100
          const onRight = leftPctC > 52
          const topPctC = Math.min(86, Math.max(10, (py(act.id) / VBH) * 100))
          const wide = act.thumb && device === 'desktop'
          const tn = tone(act.type)
          return (
            <div className={`pointer-events-none absolute z-[60] ${wide ? 'w-[300px] md:w-[340px]' : 'w-[212px] md:w-[236px]'}`} style={{ top: `${topPctC}%`, ...(onRight ? { right: `${100 - leftPctC + 2.4}%` } : { left: `${leftPctC + 2.4}%` }), transform: 'translateY(-50%)' }}>
              <div className="overflow-hidden rounded-[12px] border border-[var(--br-line)] bg-white shadow-[0_16px_40px_rgba(7,14,44,0.18)]">
                {act.thumb && (
                  <div className={`flex items-center justify-center border-b border-[var(--br-line)] bg-[#f6f6f8] p-3.5 ${wide ? 'h-[200px]' : 'h-[290px]'}`}>
                    {/* whole screen, never cropped — fit inside the window */}
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
