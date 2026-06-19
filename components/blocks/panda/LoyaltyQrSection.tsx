'use client'

import { useMemo, useState } from 'react'
import { loyaltyQr as copy } from './data'
import { FLOWS, type Flow, type FlowNode } from './loyaltyFlowData'
import { NodeGlyph, TYPE_LABEL } from './loyaltyFlowIcons'

const THUMB = '/panda/loyalty/flow'

/* Tone per node type (on the red field). */
function nodeTone(t: FlowNode['type']) {
  switch (t) {
    case 'entry': return { ring: 'rgba(255,255,255,0.9)', glow: 'rgba(255,255,255,0.16)' }
    case 'screen': return { ring: 'rgba(255,255,255,0.55)', glow: 'rgba(255,255,255,0.10)' }
    case 'decision': return { ring: 'rgba(255,220,180,0.7)', glow: 'rgba(255,200,140,0.12)' }
    case 'api': return { ring: 'rgba(150,200,255,0.8)', glow: 'rgba(120,180,255,0.16)' }
    case 'note': return { ring: 'rgba(255,255,255,0.4)', glow: 'rgba(255,255,255,0.06)' }
  }
}

export function LoyaltyQrSection({ intro }: { intro?: string } = {}) {
  const [openFlow, setOpenFlow] = useState<string | null>(null)
  const flow = FLOWS.find((f) => f.id === openFlow) || null

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
          <h2 className="mt-3 whitespace-nowrap text-[clamp(22px,5.2vw,38px)] font-semibold uppercase leading-none tracking-tight text-white">
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

        {/* legend */}
        <div className="mt-8 flex flex-wrap items-center gap-x-5 gap-y-2 text-[11.5px] text-white/70 md:mt-10">
          {(['entry', 'screen', 'decision', 'api', 'note'] as const).map((t) => (
            <span key={t} className="inline-flex items-center gap-1.5">
              <span
                className="inline-flex h-5 w-5 items-center justify-center rounded-[5px]"
                style={{ boxShadow: `inset 0 0 0 1px ${nodeTone(t).ring}`, background: nodeTone(t).glow }}
              >
                <NodeGlyph type={t} className="h-3.5 w-3.5 text-white" />
              </span>
              {TYPE_LABEL[t]}
            </span>
          ))}
        </div>

        {/* OVERVIEW or DETAIL */}
        <div className="mt-7 md:mt-9">
          {flow ? (
            <FlowDetail flow={flow} onBack={() => setOpenFlow(null)} />
          ) : (
            <Overview onOpen={setOpenFlow} />
          )}
        </div>
      </div>
    </section>
  )
}

/* ── OVERVIEW: the 6 prototype flows as glass cards (connected mini-journeys) ── */
function Overview({ onOpen }: { onOpen: (id: string) => void }) {
  return (
    <div>
      <div className="grid grid-cols-1 gap-3.5 md:grid-cols-2 lg:grid-cols-3">
        {FLOWS.map((f) => (
          <FlowCard key={f.id} flow={f} onOpen={() => onOpen(f.id)} />
        ))}
      </div>
    </div>
  )
}

function FlowCard({ flow, onOpen }: { flow: Flow; onOpen: () => void }) {
  const counts = useMemo(() => {
    const c: Record<string, number> = {}
    flow.nodes.forEach((n) => (c[n.type] = (c[n.type] || 0) + 1))
    return c
  }, [flow])
  // ordered connected journey (first ~13 nodes), shown as icons joined by connectors
  const strip = flow.nodes.slice(0, 13)
  const more = flow.nodes.length - strip.length
  return (
    <button
      type="button"
      onClick={onOpen}
      className="group flex flex-col rounded-[18px] border border-white/15 bg-white/[0.07] p-5 text-left outline-none backdrop-blur-[6px] transition-all [box-shadow:0_6px_18px_rgba(0,0,0,0.16)] hover:-translate-y-0.5 hover:border-white/30 hover:bg-white/[0.11] hover:[box-shadow:0_12px_30px_rgba(0,0,0,0.24)] focus-visible:border-white"
    >
      <div className="flex items-start justify-between gap-3">
        <h3 className="text-[15.5px] font-semibold leading-snug text-white md:text-[16.5px]">{flow.title}</h3>
        <span className="shrink-0 rounded-full border border-white/20 bg-white/10 px-2.5 py-0.5 text-[11px] font-semibold text-white/80">
          {flow.nodes.length}
        </span>
      </div>
      <p className="mt-2 text-[13px] leading-snug text-white/70">{flow.blurb}</p>

      {/* connected mini-journey — icons joined by connector segments */}
      <div className="mt-4 flex flex-wrap items-center gap-y-2">
        {strip.map((n, i) => (
          <span key={n.id} className="inline-flex items-center">
            <span
              className="inline-flex h-7 w-7 items-center justify-center rounded-[7px]"
              style={{ boxShadow: `inset 0 0 0 1px ${nodeTone(n.type).ring}`, background: nodeTone(n.type).glow }}
            >
              <NodeGlyph type={n.type} className="h-4 w-4 text-white" />
            </span>
            {i < strip.length - 1 && <span className="h-px w-2.5 bg-white/35" />}
          </span>
        ))}
        {more > 0 && (
          <span className="ml-1.5 inline-flex items-center text-[11px] font-medium text-white/55">
            <span className="mr-1 h-px w-2.5 bg-white/35" />+{more}
          </span>
        )}
      </div>

      <div className="mt-4 flex items-center gap-3 text-[11px] text-white/50">
        <span>{counts.screen || 0} screens</span>
        <span>{counts.decision || 0} decisions</span>
        {(counts.api || counts.note) ? (
          <span>{(counts.api || 0) + (counts.note || 0)} notes / APIs</span>
        ) : null}
        <span className="ml-auto font-semibold text-white/75 transition-colors group-hover:text-white">Open →</span>
      </div>
    </button>
  )
}

/* ── DETAIL: one flow's full node graph + hover popovers ── */
const VBW = 1080
const VBH = 460
const T = { w: 30, h: 30 } // icon node footprint (design px)

/* Layered DAG layout: column = longest-path depth from an entry; within each
 * column, rows are spread evenly across the height. Produces clean left-to-right
 * lanes with no dead middle / no overlap, instead of the raw Figma clustering. */
function computeLayout(flow: Flow) {
  const ids = flow.nodes.map((n) => n.id)
  const idset = new Set(ids)
  const outAdj: Record<string, string[]> = {}
  const indeg: Record<string, number> = {}
  ids.forEach((id) => { outAdj[id] = []; indeg[id] = 0 })
  flow.edges.forEach((e) => {
    if (idset.has(e.from) && idset.has(e.to) && e.from !== e.to) {
      outAdj[e.from].push(e.to); indeg[e.to]++
    }
  })
  // seeds = entry-type nodes, else any node with indegree 0, else first node
  let seeds = flow.nodes.filter((n) => n.type === 'entry').map((n) => n.id)
  if (!seeds.length) seeds = ids.filter((id) => indeg[id] === 0)
  if (!seeds.length) seeds = [ids[0]]
  // longest-path depth via relaxation (graph may have cycles → cap iterations)
  const depth: Record<string, number> = {}
  ids.forEach((id) => (depth[id] = 0))
  seeds.forEach((s) => (depth[s] = 0))
  for (let iter = 0; iter < ids.length; iter++) {
    let changed = false
    for (const id of ids) {
      for (const nx of outAdj[id]) {
        if (depth[nx] < depth[id] + 1) { depth[nx] = depth[id] + 1; changed = true }
      }
    }
    if (!changed) break
  }
  // group by column
  const colMap: Record<number, string[]> = {}
  ids.forEach((id) => { (colMap[depth[id]] = colMap[depth[id]] || []).push(id) })
  const cols = Math.max(...ids.map((id) => depth[id])) + 1
  // order rows within a column to reduce crossings: by average depth-position of
  // neighbors in the previous column (barycenter), fallback to stable order.
  const pos: Record<string, { col: number; row: number; rows: number }> = {}
  const rowOf: Record<string, number> = {}
  for (let c = 0; c < cols; c++) {
    const colIds = colMap[c] || []
    // barycenter using already-placed previous column
    const score = (id: string) => {
      const preds = flow.edges.filter((e) => e.to === id && depth[e.from] === c - 1 && rowOf[e.from] != null)
      if (!preds.length) return Number.MAX_SAFE_INTEGER // keep new branches stable at end
      return preds.reduce((a, e) => a + rowOf[e.from], 0) / preds.length
    }
    const ordered = colIds
      .map((id, i) => ({ id, s: score(id), i }))
      .sort((a, b) => (a.s - b.s) || (a.i - b.i))
      .map((o) => o.id)
    const rows = ordered.length
    ordered.forEach((id, r) => {
      // center shorter columns: if fewer rows than max, offset so they sit mid-height
      pos[id] = { col: c, row: r, rows }
      rowOf[id] = r
    })
  }
  const maxRows = Math.max(1, ...Object.values(colMap).map((a) => a.length))
  return { pos, cols, maxRows }
}

function FlowDetail({ flow, onBack }: { flow: Flow; onBack: () => void }) {
  const [active, setActive] = useState<string | null>(null)
  const nById = useMemo(() => Object.fromEntries(flow.nodes.map((n) => [n.id, n])), [flow])
  const act = active ? nById[active] : null

  // ── Computed layered layout (replaces raw Figma coords, which clustered the
  //    nodes into two bands with a dead middle). Column = longest-path depth from
  //    an entry; rows are spread evenly to fill the height. ──
  const { pos, cols, maxRows } = useMemo(() => computeLayout(flow), [flow])
  const PADX = 56
  const PADY = 44
  const colW = cols > 1 ? (VBW - 2 * PADX) / (cols - 1) : 0
  // consistent vertical pitch across columns; each column is centered.
  const rowPitch = maxRows > 1 ? (VBH - 2 * PADY) / (maxRows - 1) : 0
  const px = (id: string) => PADX + pos[id].col * colW
  const py = (id: string) => {
    const r = pos[id]
    const span = (r.rows - 1) * rowPitch
    const top = VBH / 2 - span / 2
    return top + r.row * rowPitch
  }

  return (
    <div>
      <div className="mb-3 flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={onBack}
            className="rounded-full border border-white/30 bg-white/10 px-3 py-1.5 text-[12.5px] font-semibold text-white outline-none transition-colors hover:bg-white/20 focus-visible:border-white"
          >
            ← All flows
          </button>
          <div>
            <h3 className="text-[17px] font-semibold text-white md:text-[19px]">{flow.title}</h3>
            <p className="text-[12px] text-white/55">{flow.blurb}</p>
          </div>
        </div>
        <p className="text-[11px] text-white/45 md:hidden">scroll to explore →</p>
      </div>

      {/* graph */}
      <div className="-mx-5 overflow-x-auto px-5 pb-2 md:mx-0 md:px-0">
        <div
          className="relative mx-auto"
          style={{ width: '100%', minWidth: 760, aspectRatio: `${VBW} / ${VBH}` }}
          onMouseLeave={() => setActive(null)}
        >
          {/* edges */}
          <svg viewBox={`0 0 ${VBW} ${VBH}`} className="absolute inset-0 h-full w-full" aria-hidden="true" preserveAspectRatio="xMidYMid meet">
            <defs>
              <marker id="lqfa" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
                <path d="M0,0 L10,5 L0,10 z" fill="rgba(255,255,255,0.6)" />
              </marker>
            </defs>
            {flow.edges.map((e, i) => {
              const a = nById[e.from], b = nById[e.to]
              if (!a || !b || !pos[e.from] || !pos[e.to]) return null
              const ax = px(e.from), ay = py(e.from), bx = px(e.to), by = py(e.to)
              const mx = (ax + bx) / 2
              const related = active && (e.from === active || e.to === active)
              const op = active ? (related ? 1 : 0.12) : 0.5
              return (
                <path
                  key={i}
                  d={`M ${ax} ${ay} C ${mx} ${ay}, ${mx} ${by}, ${bx} ${by}`}
                  fill="none"
                  stroke="rgba(255,255,255,0.65)"
                  strokeWidth={related ? 2.2 : 1.3}
                  markerEnd="url(#lqfa)"
                  style={{ transition: 'opacity .2s, stroke-width .2s' }}
                  opacity={op}
                />
              )
            })}
          </svg>

          {/* nodes */}
          {flow.nodes.map((n) => {
            const isActive = active === n.id
            const dim = active && !isActive
            const leftPct = ((px(n.id) - T.w / 2) / VBW) * 100
            const topPct = ((py(n.id) - T.h / 2) / VBH) * 100
            const wPct = (T.w / VBW) * 100
            const tone = nodeTone(n.type)
            return (
              <button
                key={n.id}
                type="button"
                onMouseEnter={() => setActive(n.id)}
                onFocus={() => setActive(n.id)}
                onClick={() => setActive(isActive ? null : n.id)}
                aria-label={`${n.label} — ${TYPE_LABEL[n.type]}`}
                className="absolute flex items-center justify-center rounded-[7px] outline-none focus-visible:ring-2 focus-visible:ring-white"
                style={{
                  left: `${leftPct}%`,
                  top: `${topPct}%`,
                  width: `${wPct}%`,
                  aspectRatio: '1 / 1',
                  zIndex: isActive ? 50 : 10,
                  background: tone.glow,
                  boxShadow: `inset 0 0 0 ${n.type === 'entry' ? 2 : 1.4}px ${tone.ring}`,
                  transform: isActive ? 'scale(1.25)' : 'scale(1)',
                  transition: 'transform .15s, opacity .2s',
                  opacity: dim ? 0.3 : 1,
                  cursor: 'pointer',
                }}
              >
                <NodeGlyph type={n.type} className="h-1/2 w-1/2 text-white" />
              </button>
            )
          })}

          {/* floating detail card — appears beside the active node (flips L/R) */}
          {act && (() => {
            const nodeLeftPct = (px(act.id) / VBW) * 100
            const onRightHalf = nodeLeftPct > 52
            const nodeTopPct = (py(act.id) / VBH) * 100
            // clamp vertical so the card stays in view
            const topClamped = Math.min(86, Math.max(8, nodeTopPct))
            return (
              <div
                className="pointer-events-none absolute z-[60] w-[248px] md:w-[280px]"
                style={{
                  top: `${topClamped}%`,
                  ...(onRightHalf
                    ? { right: `${100 - nodeLeftPct + 2.4}%` }
                    : { left: `${nodeLeftPct + 2.4}%` }),
                  transform: 'translateY(-50%)',
                }}
              >
                <div className="overflow-hidden rounded-[12px] border border-white/25 bg-[#7a1418]/95 shadow-[0_16px_40px_rgba(0,0,0,0.45)] backdrop-blur-sm">
                  {act.thumb && (
                    <div className="flex h-[300px] items-center justify-center border-b border-white/15 bg-[#5e1015] p-4">
                      {/* whole screen, scaled to fit by height (never cropped), with a shadow */}
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src={`${THUMB}/${act.thumb}@2x.webp`}
                        alt={act.label}
                        className="h-full w-auto rounded-[6px] shadow-[0_10px_26px_rgba(0,0,0,0.5)]"
                      />
                    </div>
                  )}
                  <div className="p-3.5">
                    <div className="flex flex-wrap items-center gap-1.5">
                      <span
                        className="inline-flex h-5 w-5 items-center justify-center rounded-[5px]"
                        style={{ boxShadow: `inset 0 0 0 1px ${nodeTone(act.type).ring}`, background: nodeTone(act.type).glow }}
                      >
                        <NodeGlyph type={act.type} className="h-3.5 w-3.5 text-white" />
                      </span>
                      <h4 className="text-[15px] font-semibold text-white">{act.label}</h4>
                      <span className="rounded-full bg-white/12 px-1.5 py-0.5 text-[9.5px] font-bold uppercase tracking-wide text-white/80">
                        {TYPE_LABEL[act.type]}
                      </span>
                    </div>
                    {act.role && <p className="mt-2 text-[12.5px] leading-snug text-white/85">{act.role}</p>}
                    {act.detail && <p className="mt-1.5 text-[11.5px] leading-snug text-white/70">{act.detail}</p>}
                    {act.notes && act.notes.length > 0 && (
                      <div className="mt-2.5 flex flex-col gap-1.5">
                        {act.notes.map((nt, i) => (
                          <p key={i} className="flex items-start gap-1.5 text-[11px] leading-snug text-white/75">
                            <span
                              className="mt-[1px] shrink-0 rounded px-1.5 py-[1px] text-[9px] font-bold uppercase tracking-wide"
                              style={{
                                color: nt.kind === 'api' ? 'rgb(190,220,255)' : 'rgba(255,255,255,0.9)',
                                background: nt.kind === 'api' ? 'rgba(120,180,255,0.18)' : 'rgba(255,255,255,0.14)',
                              }}
                            >
                              {nt.kind === 'api' ? nt.label : 'Note'}
                            </span>
                            <span>{nt.detail}</span>
                          </p>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            )
          })()}
        </div>
      </div>

      {/* rest hint (only when nothing hovered) */}
      {!act && (
        <p className="mt-4 text-[13px] leading-snug text-white/55 md:text-[14px]">
          {copy.detailHint}
        </p>
      )}
    </div>
  )
}
