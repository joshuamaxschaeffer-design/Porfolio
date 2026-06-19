'use client'

import { useEffect, useRef, useState } from 'react'
import { flavorPages as defaults } from './data'

/**
 * SECTION 4 — FLAVOR PAGES. Cinematic BLACK section. Three flavor pages laid
 * down in perspective (Samsung "Product and landing pages" style), then a
 * module with the Lemon Pepper flavor video AUTOPLAYING once it's in view.
 */
export function FlavorPagesSection() {
  return (
    <section
      id="flavor-pages"
      className="ws-dark relative w-full overflow-hidden bg-[#0a0a0b] text-white"
      style={
        {
          '--br-ink': '#f6f7f8',
          '--br-body': '#d4d7dd',
          '--br-muted': '#9aa0aa',
          '--br-muted-2': '#7c828d',
          '--ws-green': '#23c265',
        } as React.CSSProperties
      }
    >
      <div className="br-container pt-16 md:pt-24">
        <p className="br-data text-[14px] uppercase tracking-[0.12em] text-[var(--ws-green)]">4. {defaults.eyebrow}</p>
        <h2 className="mt-3 text-[32px] font-medium leading-[1.05] text-white md:text-[40px]">{defaults.heading}</h2>
        <p className="mt-3 max-w-3xl text-lg text-white/80 md:text-[22px]">{defaults.intro}</p>
      </div>

      {/* 3 flavor pages in perspective */}
      <div className="relative mx-auto mt-10 max-w-[1200px] px-6 md:mt-16" style={{ perspective: '1800px' }}>
        <div className="relative h-[58vw] max-h-[680px] min-h-[420px]" style={{ transformStyle: 'preserve-3d' }}>
          {defaults.pages.map((p, i) => (
            <div
              key={p}
              className="absolute overflow-hidden rounded-xl border border-white/12 bg-white/5"
              style={{
                left: `${6 + i * 26}%`,
                top: `${i * 6}%`,
                width: '46%',
                transform: `rotateX(8deg) rotateY(-22deg) rotateZ(2deg) translateZ(${-i * 90}px)`,
                transformOrigin: 'center',
                zIndex: defaults.pages.length - i,
                boxShadow: '0 30px 70px rgba(0,0,0,0.6)',
                filter: i > 0 ? `brightness(${1 - i * 0.12})` : 'none',
              }}
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={p} alt="" loading="lazy" className="block w-full object-cover object-top" />
            </div>
          ))}
        </div>
      </div>

      {/* Autoplay flavor video */}
      <div className="br-container pb-20 pt-14 md:pb-[120px] md:pt-24">
        <div className="grid grid-cols-1 items-center gap-8 lg:grid-cols-[minmax(0,1fr)_minmax(0,420px)] lg:gap-[60px]">
          <div>
            <span className="br-data text-xs font-semibold uppercase tracking-[0.18em] text-[var(--ws-green)]">
              {defaults.video.eyebrow}
            </span>
            <h3 className="mt-2 text-2xl font-semibold text-white sm:text-[28px]">{defaults.video.title}</h3>
            <p className="mt-2 max-w-[52ch] text-[15px] leading-relaxed text-white/80 sm:text-base">{defaults.video.body}</p>
          </div>
          <AutoplayVideo src={defaults.video.src} poster={defaults.video.poster} />
        </div>
      </div>
    </section>
  )
}

/** Muted, looping video that starts when scrolled into view (autoplay-safe). */
function AutoplayVideo({ src, poster }: { src: string; poster?: string }) {
  const ref = useRef<HTMLVideoElement>(null)
  const [inView, setInView] = useState(false)

  useEffect(() => {
    const el = ref.current
    if (!el) return
    const io = new IntersectionObserver(
      (entries) => {
        for (const e of entries) {
          if (e.isIntersecting) {
            setInView(true)
            el.play().catch(() => {})
          } else {
            el.pause()
          }
        }
      },
      { threshold: 0.4 },
    )
    io.observe(el)
    return () => io.disconnect()
  }, [])

  return (
    <div className="mx-auto w-[64%] max-w-[300px] overflow-hidden rounded-[14%/6.5%] bg-black shadow-[0_24px_60px_-12px_rgba(0,0,0,0.7)] ring-1 ring-white/10 lg:mx-0 lg:ml-auto">
      <video
        ref={ref}
        className="block aspect-[750/1624] w-full object-cover"
        src={src}
        poster={poster}
        muted
        loop
        playsInline
        preload={inView ? 'auto' : 'metadata'}
        controls={false}
      />
    </div>
  )
}
