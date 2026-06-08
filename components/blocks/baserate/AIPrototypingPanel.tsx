'use client'

import { useEffect, useRef } from 'react'

/**
 * AI PROTOTYPING — the closing panel of the Design Systems section.
 *
 * A video of the real Claude-made Baserate prototype plays in the back; a
 * recreated Claude desktop UI (sidebar + chat + context) sits on top as though
 * the prototype is being built live. The Claude UI deliberately overlaps and
 * covers most of the video.
 *
 * Video protection: the <video> has no controls, download is disabled, right-
 * click / picture-in-picture are blocked, and it's pointer-events:none with the
 * Claude UI layered above — so it can't be saved or scrubbed from the page.
 */

export function AIPrototypingPanel({
  title = 'AI PROTOTYPING',
  body = 'Faster handoff with functional high-fidelity prototype.',
  video = '/baserate/videos/claude-prototype.mp4',
}: {
  title?: string
  body?: string
  video?: string
}) {
  const ref = useRef<HTMLVideoElement>(null)

  // Force muted autoplay (browsers are unreliable with the attribute alone).
  useEffect(() => {
    const v = ref.current
    if (!v) return
    v.muted = true
    const play = () => {
      const p = v.play()
      if (p && typeof p.catch === 'function') p.catch(() => {})
    }
    play()
    v.addEventListener('canplay', play)
    return () => v.removeEventListener('canplay', play)
  }, [])

  return (
    <div className="br-container mt-28 md:mt-40">
      <h3 className="text-[20px] font-semibold uppercase leading-tight text-white md:text-[24px]">{title}</h3>
      <p className="br-body mt-3 text-[16px] leading-relaxed text-white/60 md:text-[18px]">{body}</p>

      {/* Stage: prototype video behind, Claude UI overlapping on top. */}
      <div className="relative mt-10 hidden aspect-[1283/720] w-full md:block">
        {/* ----- prototype video (top-right), protected ----- */}
        <div
          className="absolute overflow-hidden rounded-xl border border-white/10 bg-[#0d0f15] shadow-[0_30px_70px_-30px_rgba(0,0,0,0.8)]"
          style={{ left: '36%', top: '8%', width: '60%', aspectRatio: '16 / 9' }}
        >
          <video
            ref={ref}
            className="pointer-events-none h-full w-full object-cover select-none"
            src={video}
            muted
            autoPlay
            loop
            playsInline
            preload="auto"
            controls={false}
            disablePictureInPicture
            controlsList="nodownload noplaybackrate noremoteplayback"
            onContextMenu={(e) => e.preventDefault()}
          />
          {/* invisible shield so even a determined right-click hits this, not the video */}
          <div className="absolute inset-0" onContextMenu={(e) => e.preventDefault()} />
        </div>

        {/* ----- Claude desktop UI overlay (lower-left, covers most of the video) ----- */}
        <div
          className="absolute overflow-hidden rounded-xl border border-black/10 bg-white shadow-[0_40px_90px_-30px_rgba(0,0,0,0.9)]"
          style={{ left: '4%', top: '26%', width: '70%', aspectRatio: '885 / 515' }}
        >
          <ScaledClaudeUI />
        </div>
      </div>

      {/* ----- Mobile fallback: stacked, UI under the video ----- */}
      <div className="mt-8 flex flex-col gap-4 md:hidden">
        <div className="overflow-hidden rounded-xl border border-white/10 bg-[#0d0f15]" style={{ aspectRatio: '16 / 9' }}>
          {/* eslint-disable-next-line jsx-a11y/media-has-caption */}
          <video
            className="pointer-events-none h-full w-full object-cover"
            src={video}
            muted
            autoPlay
            loop
            playsInline
            preload="metadata"
            controls={false}
            disablePictureInPicture
            controlsList="nodownload"
            onContextMenu={(e) => e.preventDefault()}
          />
        </div>
        <div className="overflow-hidden rounded-xl border border-black/10 bg-white" style={{ aspectRatio: '885 / 560' }}>
          <ScaledClaudeUI />
        </div>
      </div>
    </div>
  )
}

/**
 * Renders ClaudeUI at a fixed 885×515 design size and scales it to fill its
 * parent. Fixed-px sizing means every font/gap is exact (no fragile vw units);
 * the scale just maps the whole UI to whatever box it sits in.
 */
function ScaledClaudeUI() {
  const wrapRef = useRef<HTMLDivElement>(null)
  const DESIGN_W = 885
  const DESIGN_H = 515

  useEffect(() => {
    const el = wrapRef.current
    if (!el) return
    const parent = el.parentElement
    if (!parent) return
    const fit = () => {
      const r = parent.getBoundingClientRect()
      const s = r.width / DESIGN_W
      el.style.transform = `scale(${s})`
    }
    fit()
    const ro = new ResizeObserver(fit)
    ro.observe(parent)
    return () => ro.disconnect()
  }, [])

  return (
    <div
      ref={wrapRef}
      style={{ width: DESIGN_W, height: DESIGN_H, transformOrigin: 'top left' }}
    >
      <ClaudeUI />
    </div>
  )
}


/* ============================================================
 * ClaudeUI — a recreated Claude desktop interface (sidebar + chat + context),
 * generic "building the Baserate prototype live" content. Pure presentational.
 * ============================================================ */

const SIDEBAR = [
  { icon: '+', label: 'New task', muted: true },
  { icon: '◳', label: 'Projects' },
  { icon: '◷', label: 'Scheduled' },
  { icon: '✦', label: 'Live artifacts', badge: 'Beta' },
  { icon: '⤳', label: 'Dispatch' },
  { icon: '⚙', label: 'Customize' },
]

const RECENTS = [
  'Design Systems section',
  'Baserate portfolio page',
  'Project setup review',
  'Build professional design portfolio',
  'Access Google Sheets account',
  'Scalability timeline motion',
  'Continue previous conversation',
  'Convert image to text',
  'Handoff section components',
]

export function ClaudeUI() {
  return (
    <div className="grid h-full w-full grid-cols-[26%_1fr_28%] bg-white text-[#1f1f1f]" style={{ fontFamily: 'ui-sans-serif, system-ui, sans-serif' }}>
      {/* ---- Left sidebar ---- */}
      <div className="flex h-full flex-col border-r border-black/8 bg-[#f7f6f4] text-[11px] leading-tight">
        {/* tabs */}
        <div className="flex items-center gap-1 px-[6%] pt-[6%]">
          <span className="rounded-md px-2 py-1 text-black/55">Chat</span>
          <span className="rounded-md bg-[#e9633b]/12 px-2 py-1 font-semibold text-[#cc5533]">Cowork</span>
          <span className="rounded-md px-2 py-1 text-black/55">Code</span>
        </div>
        <div className="mt-[5%] flex flex-col gap-[3%] px-[6%]">
          {SIDEBAR.map((s) => (
            <div key={s.label} className="flex items-center gap-2 text-black/70">
              <span className="w-3 text-center text-black/45">{s.icon}</span>
              <span className={s.muted ? 'text-black/55' : ''}>{s.label}</span>
              {s.badge && <span className="ml-1 rounded bg-black/8 px-1 text-[8px] text-black/45">{s.badge}</span>}
            </div>
          ))}
        </div>
        {/* recents */}
        <div className="mt-[6%] px-[6%] text-[9px] uppercase tracking-wide text-black/35">Recents</div>
        <div className="mt-[2%] flex min-h-0 flex-1 flex-col gap-[2.5%] overflow-hidden px-[6%]">
          {RECENTS.map((r, i) => (
            <div key={r} className="flex items-center gap-1.5 truncate text-black/65">
              {i === 5 && <span className="h-1 w-1 shrink-0 rounded-full bg-[#3b82f6]" />}
              <span className="truncate">{r}</span>
            </div>
          ))}
        </div>
        {/* account */}
        <div className="mt-auto flex items-center gap-2 border-t border-black/8 px-[6%] py-[4%] text-black/70">
          <span className="flex h-4 w-4 items-center justify-center rounded-full bg-[#7a5d5c] text-[8px] font-bold text-white">J</span>
          <span>Joshua</span>
          <span className="ml-auto rounded bg-black/8 px-1 text-[8px] text-black/50">Max</span>
        </div>
      </div>

      {/* ---- Center chat ---- */}
      <div className="flex h-full flex-col">
        {/* breadcrumb */}
        <div className="flex items-center gap-2 border-b border-black/8 px-[4%] py-[3%] text-[11px] text-black/55">
          <span className="font-semibold text-black/80">Baserate Figma</span>
          <span className="text-black/30">/</span>
          <span>Scalability timeline motion</span>
        </div>
        {/* conversation */}
        <div className="min-h-0 flex-1 overflow-hidden px-[5%] py-[4%] text-[11px] leading-[1.6] text-black/80">
          <p className="text-black/60">
            Reworked the Scalability timeline to a zoom-out: cards start clustered near the front, then dolly back and
            blur as you scroll. The rail of dots + ticker lines sits behind the cards and recedes with the same camera.
          </p>
          <p className="mt-[4%]">
            <span className="font-semibold">Geometry</span> lives in one <code className="rounded bg-black/6 px-1 text-[#b1442e]">depthProps()</code> helper —
            position, scale, blur and darken all derive from a single effective depth, so the rail always lines up under each card.
          </p>
          <p className="mt-[4%] font-semibold">Deployed this round:</p>
          <ul className="mt-[2%] space-y-[1.5%]">
            <li className="flex gap-2"><span className="text-[#b1442e]">2f3cbd5</span><span className="text-black/55">— zoom-out dolly + future dates</span></li>
            <li className="flex gap-2"><span className="text-[#b1442e]">322d24a</span><span className="text-black/55">— HD components + push-back tilt</span></li>
            <li className="flex gap-2"><span className="text-[#b1442e]">2ce0087</span><span className="text-black/55">— ticker rail + opaque cards</span></li>
          </ul>
          <p className="mt-[4%]">
            All live on <span className="text-[#b1442e]">https://schaeffer.design</span>. Refresh to see the changes.
          </p>
          <div className="mt-[3%] flex items-center gap-3 text-black/35">
            <span>⧉</span><span>▷</span><span>↻</span><span className="text-[9px]">Just now</span>
          </div>
          <div className="mt-[3%] text-[#e9633b]">✳</div>
        </div>
        {/* composer */}
        <div className="mx-[4%] mb-[4%] rounded-lg border border-black/12 px-[3%] py-[2.5%] text-[11px] text-black/45 shadow-sm">
          <div>Write a message…</div>
          <div className="mt-[3%] flex items-center gap-2 text-black/55">
            <span className="flex h-4 w-4 items-center justify-center rounded border border-black/15">+</span>
            <span className="flex items-center gap-1 rounded border border-black/15 px-1.5">⏵ Act ▾</span>
            <span className="ml-auto">Opus 4.7 ▾</span>
            <span>🎤</span>
          </div>
        </div>
        <div className="pb-[2%] text-center text-[8px] text-black/30">Claude is AI and can make mistakes. Please double-check responses.</div>
      </div>

      {/* ---- Right context panel ---- */}
      <div className="flex h-full flex-col border-l border-black/8 bg-[#fbfbfa] px-[7%] py-[5%] text-[10px] leading-tight text-black/70">
        <Row label="Progress" chevron />
        <div className="mt-[5%] font-semibold text-black/80">Working folders</div>
        <div className="mt-[2%] space-y-[2%] pl-[4%] text-black/60">
          <div>⌄ Baserate Claude Figma Prototype</div>
          <div className="pl-[6%]">▤ Instructions · CLAUDE.md</div>
          <div className="pl-[6%] truncate">▤ Baserate-Prototype-Refere…</div>
          <div>› Baserate Claude Functional App</div>
          <div>› Baserate Pro</div>
          <div>› Scratchpad</div>
        </div>
        <div className="mt-[6%] font-semibold text-black/80">Context</div>
        <div className="mt-[2%] text-[8px] uppercase tracking-wide text-black/35">Connectors</div>
        <div className="mt-[2%] space-y-[2.5%] text-black/65">
          <div className="flex items-center gap-1.5"><Dot c="#111" /> Desktop Commander</div>
          <div className="flex items-center gap-1.5"><Dot c="#3ecf8e" /> Supabase</div>
          <div className="flex items-center justify-between"><span className="flex items-center gap-1.5"><Dot c="#4285F4" /> Chrome — Browser 1</span><span className="text-black/30">⤢</span></div>
        </div>
        <div className="mt-[5%] text-[8px] uppercase tracking-wide text-black/35">Memory</div>
        <div className="mt-[2%] space-y-[2%] text-black/60">
          <div>▤ Portfolio build status</div>
          <div>▤ Design Systems section</div>
        </div>
      </div>
    </div>
  )
}

function Row({ label, chevron }: { label: string; chevron?: boolean }) {
  return (
    <div className="flex items-center justify-between font-semibold text-black/80">
      <span>{label}</span>
      {chevron && <span className="text-black/30">›</span>}
    </div>
  )
}

function Dot({ c }: { c: string }) {
  return <span className="h-1.5 w-1.5 rounded-[3px]" style={{ background: c }} />
}
