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

        <p className="mt-8 text-[12.5px] leading-normal text-white/55 md:mt-10 md:max-w-[82ch]">
          {copy.footnote}
        </p>
      </div>
    </section>
  )
}

/* ── OVERVIEW: 5 flow cards, each a compact icon strip + screen peek ── */
function Overview({ onOpen }: { onOpen: (id: string) => void }) {
  return (
    <div>
      <div className="mb-4 flex items-baseline justify-between gap-3">
        <p className="text-[12px] font-bold uppercase tracking-[0.12em] text-white/60">
          The whole board — {FLOWS.length} prototype flows · {FLOWS.reduce((a, f) => a + f.nodes.length, 0)} screens &amp; steps
        </p>
        <p className="text-[11px] text-white/45">click a flow to open it →</p>
      </div>
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
  // a few key screen thumbs to peek
  const peeks = flow.nodes.filter((n) => n.type === 'screen' && n.thumb).slice(0, 4)
  // ordered icon strip (first ~14 nodes)
  const strip = flow.nodes.slice(0, 16)
  return (
    <button
      type="button"
      onClick={onOpen}
      className="group flex flex-col rounded-[14px] border border-white/20 bg-black/15 p-4 text-left outline-none transition-colors hover:border-white/45 hover:bg-black/25 focus-visible:border-white"
    >
      <div className="flex items-start justify-between gap-2">
        <div>
          <h3 className="text-[16px] font-semibold text-white md:text-[17px]">{flow.title}</h3>
          <p className="mt-0.5 text-[12px] capitalize text-white/55">{flow.platform.replace('-', ' ')}</p>
        </div>
        <span className="rounded-full bg-white/12 px-2 py-0.5 text-[11px] font-semibold text-white/80">
          {flow.nodes.length} nodes
        </span>
      </div>
      <p className="mt-2 text-[13px] leading-snug text-white/75">{flow.blurb}</p>

      {/* icon strip */}
      <div className="mt-3 flex flex-wrap items-center gap-1">
        {strip.map((n, i) => (
          <span key={n.id} className="inline-flex items-center">
            <span
              className="inline-flex h-6 w-6 items-center justify-center rounded-[6px]"
              style={{ boxShadow: `inset 0 0 0 1px ${nodeTone(n.type).ring}`, background: nodeTone(n.type).glow }}
            >
              <NodeGlyph type={n.type} className="h-3.5 w-3.5 text-white" />
            </span>
            {i < strip.length - 1 && <span className="mx-[1px] h-px w-1.5 bg-white/30" />}
          </span>
        ))}
        {flow.nodes.length > strip.length && (
          <span className="ml-1 text-[11px] text-white/55">+{flow.nodes.length - strip.length}</span>
        )}
      </div>

      {/* screen peek */}
      <div className="mt-3 flex gap-1.5">
        {peeks.map((n) => (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            key={n.id}
            src={`${THUMB}/${n.thumb}.webp`}
            alt=""
            loading="lazy"
            className="h-16 w-auto rounded-[5px] border border-white/15 opacity-80 transition-opacity group-hover:opacity-100"
          />
        ))}
      </div>

      <div className="mt-3 flex items-center gap-3 text-[11px] text-white/50">
        <span>{counts.screen || 0} screens</span>
        <span>{counts.decision || 0} decisions</span>
        {(counts.api || counts.note) && (
          <span>{(counts.api || 0) + (counts.note || 0)} notes/APIs</span>
        )}
        <span className="ml-auto font-semibold text-white/75 group-hover:text-white">Open →</span>
      </div>
    </button>
  )
}

/* ── DETAIL: one flow's full node graph + hover popovers ── */
const VBW = 1000
const VBH = 560
const T = { w: 30, h: 30 } // icon node footprint (design px)

function FlowDetail({ flow, onBack }: { flow: Flow; onBack: () => void }) {
  const [active, setActive] = useState<string | null>(null)
  const nById = useMemo(() => Object.fromEntries(flow.nodes.map((n) => [n.id, n])), [flow])
  const act = active ? nById[active] : null

  // place nodes from normalized coords with padding
  const PAD = 60
  const px = (nx: number) => PAD + nx * (VBW - 2 * PAD)
  const py = (ny: number) => PAD + ny * (VBH - 2 * PAD)

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
              if (!a || !b) return null
              const ax = px(a.nx), ay = py(a.ny), bx = px(b.nx), by = py(b.ny)
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
            const leftPct = ((px(n.nx) - T.w / 2) / VBW) * 100
            const topPct = ((py(n.ny) - T.h / 2) / VBH) * 100
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
        </div>
      </div>

      {/* detail popover panel */}
      <div className="mt-5 min-h-[120px] rounded-[14px] border border-white/20 bg-black/15 p-5 md:mt-6">
        {act ? (
          <div className="flex flex-col gap-3 md:flex-row md:gap-5">
            {act.thumb && (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={`${THUMB}/${act.thumb}@2x.webp`}
                alt={act.label}
                className="h-44 w-auto self-start rounded-[8px] border border-white/25 bg-black/20 md:h-52"
              />
            )}
            <div className="min-w-0">
              <div className="flex flex-wrap items-center gap-2">
                <span
                  className="inline-flex h-6 w-6 items-center justify-center rounded-[5px]"
                  style={{ boxShadow: `inset 0 0 0 1px ${nodeTone(act.type).ring}`, background: nodeTone(act.type).glow }}
                >
                  <NodeGlyph type={act.type} className="h-4 w-4 text-white" />
                </span>
                <h4 className="text-[18px] font-semibold text-white">{act.label}</h4>
                <span className="rounded-full bg-white/12 px-2 py-0.5 text-[10.5px] font-bold uppercase tracking-wide text-white/80">
                  {TYPE_LABEL[act.type]}
                </span>
              </div>
              {act.role && <p className="mt-2 text-[14.5px] leading-snug text-white/85">{act.role}</p>}
              {act.detail && (
                <p className="mt-2 text-[13px] leading-snug text-white/70">{act.detail}</p>
              )}
              {act.notes && act.notes.length > 0 && (
                <div className="mt-3 flex flex-col gap-2">
                  {act.notes.map((nt, i) => (
                    <p key={i} className="inline-flex items-start gap-1.5 text-[12.5px] leading-snug text-white/70">
                      <span
                        className="mt-[1px] shrink-0 rounded px-1.5 py-[1px] text-[10px] font-bold uppercase tracking-wide"
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
        ) : (
          <p className="text-[14px] leading-snug text-white/65 md:text-[15px]">
            {copy.detailHint}
          </p>
        )}
      </div>
    </div>
  )
}
