'use client'

import { useMemo, useState } from 'react'
import { loyaltyQr as copy } from './data'
import { FLOWS, type Flow, type FlowNode } from './loyaltyFlowData'
import { NodeGlyph, TYPE_LABEL, type DeviceKind } from './loyaltyFlowIcons'

const THUMB = '/panda/loyalty/flow'

function tone(t: FlowNode['type']) {
  switch (t) {
    case 'entry': return { ring: 'rgba(255,255,255,0.92)', glow: 'rgba(255,255,255,0.16)' }
    case 'screen': return { ring: 'rgba(255,255,255,0.85)', glow: 'rgba(255,255,255,0.14)' }
    case 'event': return { ring: 'rgba(255,214,168,0.7)', glow: 'rgba(255,196,140,0.10)' }
    case 'api': return { ring: 'rgba(150,200,255,0.85)', glow: 'rgba(120,180,255,0.16)' }
  }
}
const deviceOf = (f: Flow): DeviceKind => (f.platform === 'desktop' ? 'desktop' : f.platform === 'mobile-web' ? 'mobile-web' : 'mobile')

export function LoyaltyQrSection({ intro }: { intro?: string } = {}) {
  const [tab, setTab] = useState(FLOWS[0].id)
  const flow = FLOWS.find((f) => f.id === tab) || FLOWS[0]

  return (
    <section
      id="loyalty-qr"
      aria-label="Loyalty QR Enrollment"
      data-anim="loyalty-qr-section"
      className="relative isolate w-full overflow-hidden border-y border-white/20 bg-[var(--px-red)]"
    >
      <div className="br-container py-14 md:py-20">
        {/* header */}
        <div className="max-w-[64ch]">
          <p className="text-[12px] font-bold uppercase tracking-[0.14em] text-white/70">Panda Rewards · Loyalty Pilot</p>
          <h2 className="mt-3 whitespace-nowrap text-[clamp(22px,5.2vw,38px)] font-semibold uppercase leading-none tracking-tight text-white">
            {copy.heading}
          </h2>
          <p className="mt-4 text-[15px] leading-snug text-white/90 md:text-[19px] md:leading-snug">{intro ?? copy.intro}</p>
        </div>

        {/* proof tags — Baserate informational-pill aesthetic (thin outline, 4px radius, uppercase) */}
        <ul className="mt-7 flex flex-wrap gap-2.5 md:mt-8 md:gap-3">
          {copy.chips.map((c) => (
            <li
              key={c}
              className="rounded-[4px] border border-white/40 px-3 py-1.5 text-[11.5px] font-semibold uppercase tracking-[0.06em] text-white/90 md:text-[12.5px]"
            >
              {c}
            </li>
          ))}
        </ul>

        {/* active flow panel (the tab row lives in the flow header, top-right) */}
        <div role="tabpanel" id={`panel-${flow.id}`} aria-labelledby={`tab-${flow.id}`} className="mt-8 md:mt-10">
          <FlowDetail flow={flow} tab={tab} setTab={setTab} />
        </div>
      </div>
    </section>
  )
}

/* ── Flow graph (always fits; layered DAG layout) ── */
const VBW = 1180
const VBH = 470
const T = { w: 34, h: 34 }

function computeLayout(flow: Flow) {
  const ids = flow.nodes.map((n) => n.id)
  const idset = new Set(ids)
  const out: Record<string, string[]> = {}; const indeg: Record<string, number> = {}
  ids.forEach((id) => { out[id] = []; indeg[id] = 0 })
  flow.edges.forEach((e) => { if (idset.has(e.from) && idset.has(e.to) && e.from !== e.to) { out[e.from].push(e.to); indeg[e.to]++ } })
  const entryIds = new Set(flow.nodes.filter((n) => n.type === 'entry').map((n) => n.id))
  let seeds = [...entryIds]
  if (!seeds.length) seeds = ids.filter((id) => indeg[id] === 0)
  if (!seeds.length) seeds = [ids[0]]
  const depth: Record<string, number> = {}; ids.forEach((id) => (depth[id] = 0)); seeds.forEach((s) => (depth[s] = 0))
  for (let it = 0; it < ids.length; it++) { let ch = false; for (const id of ids) for (const nx of out[id]) if (depth[nx] < depth[id] + 1) { depth[nx] = depth[id] + 1; ch = true }; if (!ch) break }
  // Push disconnected / orphan nodes (no incoming edge, not an entry) to the FAR RIGHT
  // instead of letting them pile up at column 0. (Floating screens + unattached APIs.)
  const maxReached = Math.max(0, ...ids.map((id) => depth[id]))
  ids.forEach((id) => { if (indeg[id] === 0 && !entryIds.has(id)) depth[id] = maxReached })
  // re-relax so any node attached to a moved orphan (e.g. an API on a floating screen) follows it
  for (let it = 0; it < ids.length; it++) { let ch = false; for (const id of ids) for (const nx of out[id]) if (depth[nx] < depth[id] + 1) { depth[nx] = depth[id] + 1; ch = true }; if (!ch) break }
  const colMap: Record<number, string[]> = {}; ids.forEach((id) => { (colMap[depth[id]] = colMap[depth[id]] || []).push(id) })
  const cols = Math.max(...ids.map((id) => depth[id])) + 1
  const pos: Record<string, { col: number; row: number; rows: number }> = {}; const rowOf: Record<string, number> = {}
  for (let c = 0; c < cols; c++) {
    const colIds = colMap[c] || []
    const score = (id: string) => { const preds = flow.edges.filter((e) => e.to === id && depth[e.from] === c - 1 && rowOf[e.from] != null); if (!preds.length) return Number.MAX_SAFE_INTEGER; return preds.reduce((a, e) => a + rowOf[e.from], 0) / preds.length }
    const ordered = colIds.map((id, i) => ({ id, s: score(id), i })).sort((a, b) => a.s - b.s || a.i - b.i).map((o) => o.id)
    ordered.forEach((id, r) => { pos[id] = { col: c, row: r, rows: ordered.length }; rowOf[id] = r })
  }
  const maxRows = Math.max(1, ...Object.values(colMap).map((a) => a.length))
  return { pos, cols, maxRows }
}

function FlowDetail({ flow, tab, setTab }: { flow: Flow; tab: string; setTab: (id: string) => void }) {
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
      {/* header: flow title (left) + Flow 1-6 jump-pills (top-right) */}
      <div className="mb-4 flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
        <h3 className="shrink-0 text-[16px] font-semibold text-white md:text-[19px]">{flow.title}</h3>
        <div role="tablist" aria-label="Enrollment flows" className="flex flex-wrap gap-2 md:justify-end">
          {FLOWS.map((f, i) => {
            const active2 = f.id === tab
            return (
              <button
                key={f.id}
                role="tab"
                aria-selected={active2}
                aria-controls={`panel-${f.id}`}
                id={`tab-${f.id}`}
                onClick={() => setTab(f.id)}
                className={`shrink-0 whitespace-nowrap rounded-full border px-3.5 py-1.5 text-[12.5px] transition-colors outline-none focus-visible:ring-2 focus-visible:ring-white ${
                  active2 ? 'border-transparent font-medium text-[var(--px-red)]' : 'border-white/35 text-white/75 hover:border-white/60 hover:text-white'
                }`}
                style={active2 ? { backgroundColor: '#E8B23A' } : undefined}
              >
                {`Flow ${i + 1}`}
              </button>
            )
          })}
        </div>
      </div>

      {/* legend — sits below the flow title, above the graph */}
      <div className="mb-6 flex flex-wrap items-center gap-x-5 gap-y-2 text-[11.5px] text-white/70 md:mb-7">
        {(['entry', 'screen', 'event', 'api'] as const).map((t) => (
          <span key={t} className="inline-flex items-center gap-1.5">
            <span className="inline-flex h-6 w-6 items-center justify-center rounded-[6px]" style={{ boxShadow: `inset 0 0 0 1px ${tone(t).ring}`, background: tone(t).glow }}>
              <NodeGlyph type={t} device={device} className="h-4 w-4 text-white" />
            </span>
            {TYPE_LABEL[t]}
          </span>
        ))}
      </div>

      {/* graph — always fits the width */}
      <div className="relative w-full" style={{ aspectRatio: `${VBW} / ${VBH}` }} onMouseLeave={() => setActive(null)}>
        <svg viewBox={`0 0 ${VBW} ${VBH}`} className="absolute inset-0 h-full w-full" aria-hidden="true" preserveAspectRatio="xMidYMid meet">
          <defs>
            <marker id="lqfa2" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="3" markerHeight="3" orient="auto-start-reverse"><path d="M0,0 L10,5 L0,10 z" fill="rgba(255,255,255,0.65)" /></marker>
          </defs>
          {flow.edges.map((e, i) => {
            const a = nById[e.from], b = nById[e.to]
            if (!a || !b || !pos[e.from] || !pos[e.to]) return null
            const ax = px(e.from), ay = py(e.from)
            let bx = px(e.to), by = py(e.to)
            // inset the end so the arrow stops just before the target node (not inside it)
            const tIsScreen = b.type === 'screen'
            const inset = (tIsScreen ? NR * 1.15 : NR) + 4
            const dx = bx - ax, dy = by - ay, len = Math.hypot(dx, dy) || 1
            bx -= (dx / len) * inset; by -= (dy / len) * inset
            const mx = (ax + bx) / 2
            const related = active && (e.from === active || e.to === active)
            const op = active ? (related ? 1 : 0.1) : e.api ? 0.32 : 0.5
            return (
              <path key={i} d={`M ${ax} ${ay} C ${mx} ${ay}, ${mx} ${by}, ${bx} ${by}`} fill="none" stroke="rgba(255,255,255,0.6)" strokeWidth={related ? 2 : 1.3} strokeDasharray={e.api ? '4 4' : undefined} markerEnd="url(#lqfa2)" style={{ transition: 'opacity .2s, stroke-width .2s' }} opacity={op} />
            )
          })}
        </svg>

        {flow.nodes.map((n) => {
          const isActive = active === n.id
          const dim = active && !isActive
          const isScreen = n.type === 'screen'
          // screens are a touch bigger; ALL nodes are square tiles (no aspect squashing)
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
              className="absolute flex aspect-square items-center justify-center outline-none focus-visible:ring-2 focus-visible:ring-white"
              style={{
                left: `${leftPct}%`,
                top: `${topPct}%`,
                width: `${wPct}%`,
                zIndex: isActive ? 50 : isScreen ? 20 : 10,
                borderRadius: '8px',
                background: tn.glow,
                boxShadow: `inset 0 0 0 ${n.type === 'entry' || isScreen ? 1.9 : 1.4}px ${tn.ring}`,
                transform: isActive ? 'scale(1.18)' : 'scale(1)',
                transition: 'transform .15s, opacity .2s',
                opacity: dim ? 0.3 : 1,
                cursor: 'pointer',
              }}
            >
              <NodeGlyph type={n.type} device={device} className={`${isScreen ? 'h-[64%] w-[64%]' : 'h-1/2 w-1/2'} text-white`} />
            </button>
          )
        })}

        {/* floating card next to the active node */}
        {act && (() => {
          const leftPctC = (px(act.id) / VBW) * 100
          const onRight = leftPctC > 52
          const topPctC = Math.min(86, Math.max(10, (py(act.id) / VBH) * 100))
          // wider card for landscape (desktop) screens so the whole screen shows undistorted
          const wide = act.thumb && device === 'desktop'
          return (
            <div className={`pointer-events-none absolute z-[60] ${wide ? 'w-[300px] md:w-[340px]' : 'w-[228px] md:w-[252px]'}`} style={{ top: `${topPctC}%`, ...(onRight ? { right: `${100 - leftPctC + 2.4}%` } : { left: `${leftPctC + 2.4}%` }), transform: 'translateY(-50%)' }}>
              <div className="overflow-hidden rounded-[12px] border border-white/25 bg-[#7a1418]/95 shadow-[0_16px_40px_rgba(0,0,0,0.45)] backdrop-blur-sm">
                {act.thumb && (
                  <div className={`flex items-center justify-center border-b border-white/15 bg-[#5e1015] p-3.5 ${wide ? 'h-[210px]' : 'h-[300px]'}`}>
                    {/* whole screen, never cropped — fit inside the window */}
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={`${THUMB}/${act.thumb}@2x.webp`} alt={act.label} className="max-h-full max-w-full rounded-[6px] object-contain shadow-[0_10px_26px_rgba(0,0,0,0.5)]" />
                  </div>
                )}
                <div className="p-3.5">
                  <div className="flex flex-wrap items-center gap-1.5">
                    <span className="inline-flex h-5 w-5 items-center justify-center rounded-[5px]" style={{ boxShadow: `inset 0 0 0 1px ${tone(act.type).ring}`, background: tone(act.type).glow }}>
                      <NodeGlyph type={act.type} device={device} className="h-3.5 w-3.5 text-white" />
                    </span>
                    <h4 className="text-[15px] font-semibold text-white">{act.label}</h4>
                    <span className="rounded-full bg-white/12 px-1.5 py-0.5 text-[9.5px] font-bold uppercase tracking-wide text-white/80">{TYPE_LABEL[act.type]}</span>
                  </div>
                  {act.role && <p className="mt-2 text-[12.5px] leading-snug text-white/85">{act.role}</p>}
                </div>
              </div>
            </div>
          )
        })()}
      </div>
    </div>
  )
}
