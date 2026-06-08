'use client'

import { useEffect, useRef, useState } from 'react'

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

      {/* ----- Mobile: video leads (it's the actual deliverable); below it, a
          single-column CHAT-ONLY recreation of the Claude UI at full width so
          the text stays legible. Scaling the full 3-column 885px canvas to a
          ~358px column makes text ~4px (Baserate Mobile Spec §9) — so we show
          the representative region (the chat that builds the Pairwise feature)
          rather than shrinking the whole interface. ----- */}
      <div className="mt-8 flex flex-col gap-4 md:hidden">
        <div className="overflow-hidden rounded-xl border border-white/10 bg-[#0d0f15] shadow-[0_24px_60px_-30px_rgba(0,0,0,0.8)]" style={{ aspectRatio: '16 / 9' }}>
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
        <div className="h-[460px] overflow-hidden rounded-xl border border-black/10 bg-white shadow-[0_24px_60px_-30px_rgba(0,0,0,0.6)]">
          <ClaudeUI mobile />
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
  'Conviction slider component',
  'Decision modal — Create flow',
  'Checklist scoring logic',
  'Pre-mortem + self-contract',
  'Ranking poll drag-to-rank',
  'Comment threads + mentions',
  'Continue previous conversation',
  'Tiptap doc editor toolbar',
  'Supabase realtime sync',
]

export function ClaudeUI({ mobile = false }: { mobile?: boolean }) {
  // Mobile: a single full-width column showing just the chat — the
  // representative region of the interface — at legible, unscaled text sizes.
  if (mobile) {
    return (
      <div
        className="flex h-full w-full flex-col bg-white text-[13px] text-[#1f1f1f] select-none"
        style={{ fontFamily: 'ui-sans-serif, system-ui, sans-serif', WebkitUserSelect: 'none', userSelect: 'none' }}
        onMouseDown={(e) => e.preventDefault()}
      >
        <ChatColumn mobile />
      </div>
    )
  }

  return (
    <div
      className="grid h-full w-full grid-cols-[26%_1fr_28%] bg-white text-[#1f1f1f] select-none"
      style={{ fontFamily: 'ui-sans-serif, system-ui, sans-serif', WebkitUserSelect: 'none', userSelect: 'none' }}
      onMouseDown={(e) => e.preventDefault()}
    >
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

      {/* ---- Center chat (animated typing → send → reply loop) ---- */}
      <ChatColumn />

      {/* ---- Right context panel ---- */}
      <div className="flex h-full flex-col border-l border-black/8 bg-[#fbfbfa] px-[7%] py-[5%] text-[10px] leading-tight text-black/70">
        <Row label="Progress" chevron />
        <div className="mt-[5%] font-semibold text-black/80">Working folders</div>
        <div className="mt-[2%] space-y-[2%] pl-[4%] text-black/60">
          <div>⌄ Baserate Toolkit Prototype</div>
          <div className="pl-[6%]">▤ Instructions · CLAUDE.md</div>
          <div className="pl-[6%] truncate">▤ investor-toolkit-prototype…</div>
          <div className="pl-[6%]">▤ sliders.tsx</div>
          <div>› Baserate Functional App</div>
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
          <div>▤ Baserate design tokens</div>
          <div>▤ Decision toolkit spec</div>
        </div>
      </div>
    </div>
  )
}

/* The animated center chat: types a request into the composer, "sends" it,
 * then shows a short Claude reply — then loops. Send button replaces the mic. */

type ChatMsg = { who: 'user' | 'claude'; text: string }

const SEED_CHAT: ChatMsg[] = [
  {
    who: 'claude',
    text:
      'Conviction slider is in and shared with FeelingSlider via sliders.tsx. Ready for the next one whenever you are.',
  },
]

// The long "here's everything you need" spec the user sends to pull the next
// feature (Pairwise) in from Figma.
const PROMPT =
  "Pull in the next feature from the Figma — the Pairwise tool (node Pairwise/Flow). Build it as CreatePairwiseRankModal + the voting flow. Setup: pick a default question (\"Which company has a wider moat?\", \"better management team\", \"stronger balance sheet\") or write a custom one, choose the ideas to compare, and toggle \"all possible pairs\" vs a custom vote budget; individual or send-to-team mode. Voting is one pair at a time — two idea cards side by side with their tickers/logos, click to pick a winner, progress shows pair X of N. Score with the Bayesian-adjusted ranking from the prototype, not raw win counts. Results modal: a ranked table with each idea's score + win-rate and the comment/reply thread per row; in team mode, until everyone's voted show the current user's own scores and blur the rest with a \"pending\" overlay. Match the design tokens and reuse Ticker + CommentSystem."
const REPLY =
  'Got it — built CreatePairwiseRankModal with the question picker + all-pairs/budget toggle, the one-pair-at-a-time voting flow, Bayesian-adjusted scoring, and the results table with per-row threads (others blurred until everyone votes). Reuses Ticker + CommentSystem. Live in the prototype.'

function ChatColumn({ mobile = false }: { mobile?: boolean }) {
  const [msgs, setMsgs] = useState<ChatMsg[]>(SEED_CHAT)
  const [typed, setTyped] = useState('')
  const [phase, setPhase] = useState<'idle' | 'typing' | 'thinking' | 'reply'>('idle')

  // One loop: wait → type the prompt → send → think → reply → reset.
  useEffect(() => {
    let timers: ReturnType<typeof setTimeout>[] = []
    let cancelled = false
    const run = () => {
      // type out the prompt char by char
      setPhase('typing')
      setTyped('')
      let i = 0
      const typeNext = () => {
        if (cancelled) return
        // type ~5 chars/tick so the long spec types in ~2s (whole run ≈ 4s).
        i += 5 + Math.floor(Math.random() * 3)
        setTyped(PROMPT.slice(0, i))
        if (i < PROMPT.length) {
          timers.push(setTimeout(typeNext, 12 + Math.random() * 14))
        } else {
          setTyped(PROMPT)
          // send
          timers.push(
            setTimeout(() => {
              if (cancelled) return
              setMsgs((m) => [...m, { who: 'user', text: PROMPT }])
              setTyped('')
              setPhase('thinking')
              // think, then reply — then STOP (no loop, leave at final state).
              timers.push(
                setTimeout(() => {
                  if (cancelled) return
                  setMsgs((m) => [...m, { who: 'claude', text: REPLY }])
                  setPhase('reply')
                }, 850),
              )
            }, 350),
          )
        }
      }
      timers.push(setTimeout(typeNext, 300))
    }
    // run once, shortly after mount
    timers.push(setTimeout(run, 600))
    return () => {
      cancelled = true
      timers.forEach(clearTimeout)
    }
  }, [])

  const canSend = typed.trim().length > 0

  return (
    <div className="flex h-full flex-col">
      {/* breadcrumb */}
      <div className={`flex items-center gap-2 border-b border-black/8 ${mobile ? 'px-4 py-3 text-[12px]' : 'px-[4%] py-[3%] text-[11px]'} text-black/55`}>
        <span className="font-semibold text-black/80">Baserate Toolkit</span>
        <span className="text-black/30">/</span>
        <span>Pairwise tool — Figma import</span>
      </div>

      {/* conversation */}
      <div className={`flex min-h-0 flex-1 flex-col justify-end overflow-hidden leading-[1.55] ${mobile ? 'gap-3 px-4 py-4 text-[13px]' : 'gap-[3%] px-[5%] py-[4%] text-[11px]'}`}>
        {msgs.map((m, i) =>
          m.who === 'claude' ? (
            <div key={i} className="text-black/75">
              <span className="mr-1 text-[#e9633b]">✳</span>
              {m.text}
            </div>
          ) : (
            <div key={i} className="flex justify-end">
              <div className="max-h-[150px] max-w-[88%] overflow-hidden rounded-2xl rounded-br-sm bg-[#f0eee9] px-3 py-2 leading-[1.5] text-black/80">
                {m.text}
              </div>
            </div>
          ),
        )}
        {phase === 'thinking' && (
          <div className="text-[#e9633b]">
            <span className="inline-block animate-pulse">✳ thinking…</span>
          </div>
        )}
      </div>

      {/* composer with live-typed text + send button (mic swapped out) */}
      <div className={`rounded-lg border border-black/12 shadow-sm ${mobile ? 'mx-4 mb-3 px-3 py-2.5 text-[12px]' : 'mx-[4%] mb-[4%] px-[3%] py-[2.5%] text-[11px]'}`}>
        <div
          className={`overflow-hidden leading-[1.5] ${mobile ? 'max-h-[88px]' : 'max-h-[64px]'} ${canSend ? 'text-black/80' : 'text-black/40'}`}
          style={{ whiteSpace: 'pre-wrap', wordBreak: 'break-word' }}
        >
          {canSend ? (
            <>
              {typed}
              <span className="ml-0.5 inline-block h-3 w-px translate-y-0.5 animate-pulse bg-black/60 align-middle" />
            </>
          ) : (
            'Write a message…'
          )}
        </div>
        <div className="mt-[3%] flex items-center gap-2 text-black/55">
          <span className="flex h-4 w-4 items-center justify-center rounded border border-black/15">+</span>
          <span className="flex items-center gap-1 rounded border border-black/15 px-1.5">⏵ Act ▾</span>
          <span className="ml-auto">Opus 4.7 ▾</span>
          {/* send button (replaces mic) */}
          <span
            className="flex h-5 w-5 items-center justify-center rounded-md text-white transition-colors"
            style={{ background: canSend ? '#cc5533' : '#d8d6d2' }}
          >
            <svg width="11" height="11" viewBox="0 0 24 24" fill="none">
              <path d="M4 12L20 4L14 20L11 13L4 12Z" fill="currentColor" />
            </svg>
          </span>
        </div>
      </div>
      <div className="pb-[2%] text-center text-[8px] text-black/30">Claude is AI and can make mistakes. Please double-check responses.</div>
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
