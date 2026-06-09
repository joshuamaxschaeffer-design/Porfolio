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
        <span className="br-data mb-5 inline-block rounded-[var(--br-tag-radius)] border border-white/40 px-3 py-1.5 text-[14px] uppercase text-white">
          Marketing Content
        </span>
        <h3 className="text-[28px] font-semibold uppercase tracking-tight text-white md:text-[40px]">
          Marketing Content
        </h3>
        <p className="mx-auto mt-3 max-w-2xl text-white/75 md:text-lg">
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

          {/* Center play button — shown when paused */}
          {!playing && (
            <button
              type="button"
              onClick={toggle}
              aria-label="Play video"
              className="absolute inset-0 flex items-center justify-center bg-black/15 transition-colors hover:bg-black/25"
            >
              <span className="flex h-16 w-16 items-center justify-center rounded-full bg-white/95 shadow-lg md:h-20 md:w-20">
                <svg viewBox="0 0 24 24" className="ml-1 h-7 w-7 fill-[var(--br-ink)] md:h-9 md:w-9">
                  <path d="M8 5v14l11-7z" />
                </svg>
              </span>
            </button>
          )}

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
            <button
              type="button"
              onClick={toggleMute}
              aria-label={muted ? 'Unmute' : 'Mute'}
              className="pointer-events-auto flex h-9 w-9 items-center justify-center rounded-full bg-white/90 text-[var(--br-ink)] transition-colors hover:bg-white"
            >
              {muted ? (
                <svg viewBox="0 0 24 24" className="h-4 w-4 fill-current"><path d="M16.5 12A4.5 4.5 0 0014 8v2.18l2.45 2.45c.03-.2.05-.41.05-.63zM3 4.27l2.1 2.1L4 6.5v3l4 4 .73.73L3.27 18 4.7 19.4 19.73 4.36 18.3 3zM12 4L9.91 6.09 12 8.18z" /></svg>
              ) : (
                <svg viewBox="0 0 24 24" className="h-4 w-4 fill-current"><path d="M3 9v6h4l5 5V4L7 9zm13.5 3A4.5 4.5 0 0014 8v8a4.5 4.5 0 002.5-4z" /></svg>
              )}
            </button>
          </div>
        </div>
      </div>
    </section>
  )
}
