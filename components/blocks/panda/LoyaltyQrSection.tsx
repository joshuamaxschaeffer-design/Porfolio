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
      <div className="mx-auto w-full max-w-[1600px] px-5 py-14 md:px-10 md:py-20">
        {/* header */}
        <div className="max-w-[64ch]">
          <p className="text-[12px] font-bold uppercase tracking-[0.14em] text-white/70">Panda Rewards · Loyalty Pilot</p>
          <h2 className="mt-3 whitespace-nowrap text-[clamp(22px,5.2vw,38px)] font-semibold uppercase leading-none tracking-tight text-white">
            {copy.heading}
          </h2>
          <p className="mt-4 text-[15px] leading-snug text-white/90 md:text-[19px] md:leading-snug">{intro ?? copy.intro}</p>
        </div>

        {/* proof chips */}
        <ul className="mt-7 flex flex-wrap gap-2.5 md:mt-8 md:gap-3">
          {copy.chips.map((c) => (
            <li key={c} className="rounded-full border border-white/30 bg-white/10 px-3.5 py-1.5 text-[12.5px] font-semibold text-white md:text-[13.5px]">{c}</li>
          ))}
        </ul>

        {/* legend */}
        <div className="mt-8 flex flex-wrap items-center gap-x-5 gap-y-2 text-[11.5px] text-white/70 md:mt-9">
          {(['entry', 'screen', 'event', 'api'] as const).map((t) => (
            <span key={t} className="inline-flex items-center gap-1.5">
              <span className="inline-flex h-6 w-6 items-center justify-center rounded-[6px]" style={{ boxShadow: `inset 0 0 0 1px ${tone(t).ring}`, background: tone(t).glow }}>
                <NodeGlyph type={t} device={deviceOf(flow)} className="h-4 w-4 text-white" />
              </span>
              {TYPE_LABEL[t]}
            </span>
          ))}
        </div>

        {/* tabs */}
        <div role="tablist" aria-label="Enrollment flows" className="mt-8 flex flex-wrap gap-2 md:mt-10">
          {FLOWS.map((f) => {
            const active = f.id === tab
            return (
              <button
                key={f.id}
                role="tab"
                aria-selected={active}
                aria-controls={`panel-${f.id}`}
                id={`tab-${f.id}`}
                onClick={() => setTab(f.id)}
                className={`rounded-full border px-3.5 py-2 text-[12.5px] font-semibold outline-none transition-colors focus-visible:ring-2 focus-visible:ring-white md:text-[13px] ${
                  active ? 'border-white bg-white text-[var(--px-red)]' : 'border-white/30 bg-white/10 text-white hover:bg-white/20'
                }`}
              >
                {f.title.replace(/^Flow \d+ · /, '')}
                <span className="ml-1.5 opacity-60">{f.nodes.filter((n) => n.type === 'screen').length}</span>
              </button>
            )
          })}
        </div>

        {/* active flow panel */}
        <div role="tabpanel" id={`panel-${flow.id}`} aria-labelledby={`tab-${flow.id}`} className="mt-5 md:mt-6">
          <FlowDetail flow={flow} />
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
  let seeds = flow.nodes.filter((n) => n.type === 'entry').map((n) => n.id)
  if (!seeds.length) seeds = ids.filter((id) => indeg[id] === 0)
  if (!seeds.length) seeds = [ids[0]]
  const depth: Record<string, number> = {}; ids.forEach((id) => (depth[id] = 0)); seeds.forEach((s) => (depth[s] = 0))
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

function FlowDetail({ flow }: { flow: Flow }) {
  const [active, setActive] = useState<string | null>(null)
  const nById = useMemo(() => Object.fromEntries(flow.nodes.map((n) => [n.id, n])), [flow])
  const act = active ? nById[active] : null
  const device = deviceOf(flow)
  const { pos, cols, maxRows } = useMemo(() => computeLayout(flow), [flow])
  const PADX = 52, PADY = 40
  const colW = cols > 1 ? (VBW - 2 * PADX) / (cols - 1) : 0
  const rowPitch = maxRows > 1 ? (VBH - 2 * PADY) / (maxRows - 1) : 0
  const px = (id: string) => PADX + pos[id].col * colW
  const py = (id: string) => { const r = pos[id]; const span = (r.rows - 1) * rowPitch; return VBH / 2 - span / 2 + r.row * rowPitch }

  return (
    <div>
      <div className="mb-3">
        <h3 className="text-[16px] font-semibold text-white md:text-[18px]">{flow.title}</h3>
        <p className="text-[12.5px] text-white/60">{flow.blurb}</p>
      </div>

      {/* graph — always fits the width */}
      <div className="relative w-full" style={{ aspectRatio: `${VBW} / ${VBH}` }} onMouseLeave={() => setActive(null)}>
        <svg viewBox={`0 0 ${VBW} ${VBH}`} className="absolute inset-0 h-full w-full" aria-hidden="true" preserveAspectRatio="xMidYMid meet">
          <defs>
            <marker id="lqfa2" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse"><path d="M0,0 L10,5 L0,10 z" fill="rgba(255,255,255,0.6)" /></marker>
          </defs>
          {flow.edges.map((e, i) => {
            const a = nById[e.from], b = nById[e.to]
            if (!a || !b || !pos[e.from] || !pos[e.to]) return null
            const ax = px(e.from), ay = py(e.from), bx = px(e.to), by = py(e.to)
            const mx = (ax + bx) / 2
            const related = active && (e.from === active || e.to === active)
            const op = active ? (related ? 1 : 0.1) : e.api ? 0.32 : 0.5
            return (
              <path key={i} d={`M ${ax} ${ay} C ${mx} ${ay}, ${mx} ${by}, ${bx} ${by}`} fill="none" stroke="rgba(255,255,255,0.65)" strokeWidth={related ? 2.2 : 1.3} strokeDasharray={e.api ? '4 4' : undefined} markerEnd="url(#lqfa2)" style={{ transition: 'opacity .2s, stroke-width .2s' }} opacity={op} />
            )
          })}
        </svg>

        {flow.nodes.map((n) => {
          const isActive = active === n.id
          const dim = active && !isActive
          const isScreen = n.type === 'screen'
          // screens render bigger than events/api
          const w = isScreen ? T.w * 1.18 : T.w
          const leftPct = ((px(n.id) - w / 2) / VBW) * 100
          const topPct = ((py(n.id) - (isScreen ? w * 1.5 : w) / 2) / VBH) * 100
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
              className="absolute flex items-center justify-center outline-none focus-visible:ring-2 focus-visible:ring-white"
              style={{
                left: `${leftPct}%`,
                top: `${topPct}%`,
                width: `${wPct}%`,
                aspectRatio: isScreen ? '2 / 3' : '1 / 1',
                zIndex: isActive ? 50 : isScreen ? 20 : 10,
                borderRadius: isScreen ? '6px' : '7px',
                background: tn.glow,
                boxShadow: `inset 0 0 0 ${n.type === 'entry' || isScreen ? 1.8 : 1.4}px ${tn.ring}`,
                transform: isActive ? 'scale(1.2)' : 'scale(1)',
                transition: 'transform .15s, opacity .2s',
                opacity: dim ? 0.3 : 1,
                cursor: 'pointer',
              }}
            >
              <NodeGlyph type={n.type} device={device} className={`${isScreen ? 'h-[62%] w-[62%]' : 'h-1/2 w-1/2'} text-white`} />
            </button>
          )
        })}

        {/* floating card next to the active node */}
        {act && (() => {
          const leftPctC = (px(act.id) / VBW) * 100
          const onRight = leftPctC > 52
          const topPctC = Math.min(86, Math.max(10, (py(act.id) / VBH) * 100))
          return (
            <div className="pointer-events-none absolute z-[60] w-[230px] md:w-[260px]" style={{ top: `${topPctC}%`, ...(onRight ? { right: `${100 - leftPctC + 2.4}%` } : { left: `${leftPctC + 2.4}%` }), transform: 'translateY(-50%)' }}>
              <div className="overflow-hidden rounded-[12px] border border-white/25 bg-[#7a1418]/95 shadow-[0_16px_40px_rgba(0,0,0,0.45)] backdrop-blur-sm">
                {act.thumb && (
                  <div className="flex h-[300px] items-center justify-center border-b border-white/15 bg-[#5e1015] p-4">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={`${THUMB}/${act.thumb}@2x.webp`} alt={act.label} className="h-full w-auto rounded-[6px] shadow-[0_10px_26px_rgba(0,0,0,0.5)]" />
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

      {!act && <p className="mt-4 text-[13px] leading-snug text-white/55 md:text-[14px]">{copy.detailHint}</p>}
    </div>
  )
}
