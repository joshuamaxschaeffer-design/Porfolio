'use client'

import { useRef, useState } from 'react'

/**
 * Marketing content — the marketing/MCP demo video. Unlike the silent product
 * carousels, this one has SOUND and a custom play/pause control. Starts paused
 * on its poster; the user opts in to audio by pressing play.
 */
export function MarketingContent() {
  const ref = useRef<HTMLVideoElement>(null)
  const [playing, setPlaying] = useState(false)
  const [muted, setMuted] = useState(false)

  const toggle = () => {
    const v = ref.current
    if (!v) return
    if (v.paused) { v.play().catch(() => {}); setPlaying(true) }
    else { v.pause(); setPlaying(false) }
  }

  const toggleMute = () => {
    const v = ref.current
    if (!v) return
    v.muted = !v.muted
    setMuted(v.muted)
  }

  return (
    <section className="bg-black py-20 md:py-[120px]">
      <div className="br-container text-center">
        <h3 className="text-[19px] font-semibold uppercase tracking-[0.05em] text-white md:text-[24px]">
          Marketing Content
        </h3>
        <p className="mx-auto mt-3 max-w-[560px] text-[15px] leading-relaxed text-white/85 md:text-[17px]">
          Created full web marketing pages, presentations, emails, a help center, and brand videos like the one below.
        </p>

        <div className="group relative mx-auto mt-10 max-w-[1100px] overflow-hidden rounded-2xl bg-black shadow-[0_30px_70px_-30px_rgba(0,0,0,0.9)]">
          <video
            ref={ref}
            className="block w-full"
            playsInline
            preload="metadata"
            poster="/baserate/branding/mcp-cover.jpg"
            onClick={toggle}
            onPlay={() => setPlaying(true)}
            onPause={() => setPlaying(false)}
            onEnded={() => setPlaying(false)}
          >
            <source src="/baserate/branding/mcp-video.mp4" type="video/mp4" />
          </video>

          {/* No big play overlay (Joshua 2026-06-10: it obscured the poster) —
              clicking/tapping the video itself toggles playback, and the
              bottom bar carries play/pause + mute. */}

          {/* Bottom control bar — appears on hover or while playing */}
          <div
            className={`pointer-events-none absolute inset-x-0 bottom-0 flex items-center gap-3 bg-gradient-to-t from-black/60 to-transparent p-4 transition-opacity ${
              playing ? 'opacity-100 group-hover:opacity-100' : 'opacity-0 group-hover:opacity-100'
            }`}
          >
            <button
              type="button"
              onClick={toggle}
              aria-label={playing ? 'Pause' : 'Play'}
              className="pointer-events-auto flex h-9 w-9 items-center justify-center rounded-full bg-white/90 text-[var(--br-ink)] transition-colors hover:bg-white"
            >
              {playing ? (
                <svg viewBox="0 0 24 24" className="h-4 w-4 fill-current"><path d="M6 5h4v14H6zm8 0h4v14h-4z" /></svg>
              ) : (
                <svg viewBox="0 0 24 24" className="ml-0.5 h-4 w-4 fill-current"><path d="M8 5v14l11-7z" /></svg>
              )}
            </button>
            {/* Icon shows the ACTION (per Joshua): sound ON -> mute icon
                (speaker with a line through it); muted -> plain speaker. */}
            <button
              type="button"
              onClick={toggleMute}
              aria-label={muted ? 'Unmute' : 'Mute'}
              className="pointer-events-auto flex h-9 w-9 items-center justify-center rounded-full bg-white/90 text-[var(--br-ink)] transition-colors hover:bg-white"
            >
              {muted ? (
                /* volume up — click to unmute */
                <svg viewBox="0 0 24 24" className="h-4 w-4 fill-current">
                  <path d="M3 9v6h4l5 5V4L7 9H3zm13.5 3c0-1.77-1.02-3.29-2.5-4.03v8.05c1.48-.73 2.5-2.25 2.5-4.02zM14 3.23v2.06c2.89.86 5 3.54 5 6.71s-2.11 5.85-5 6.71v2.06c4.01-.91 7-4.49 7-8.77s-2.99-7.86-7-8.77z" />
                </svg>
              ) : (
                /* volume off (slashed speaker) — click to mute */
                <svg viewBox="0 0 24 24" className="h-4 w-4 fill-current">
                  <path d="M16.5 12c0-1.77-1.02-3.29-2.5-4.03v2.21l2.45 2.45c.03-.2.05-.41.05-.63zm2.5 0c0 .94-.2 1.82-.54 2.64l1.51 1.51C20.63 14.91 21 13.5 21 12c0-4.28-2.99-7.86-7-8.77v2.06c2.89.86 5 3.54 5 6.71zM4.27 3 3 4.27 7.73 9H3v6h4l5 5v-6.73l4.25 4.25c-.67.52-1.42.93-2.25 1.18v2.06c1.38-.31 2.63-.95 3.69-1.81L19.73 21 21 19.73l-9-9L4.27 3zM12 4 9.91 6.09 12 8.18V4z" />
                </svg>
              )}
            </button>
          </div>
        </div>
      </div>
    </section>
  )
}
