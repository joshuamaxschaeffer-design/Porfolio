'use client'

import { useEffect, useRef, useState } from 'react'
import { flavorPages as defaults } from './data'

/** Tilt of the receding page fan (Samsung ProductPagesStage model). */
const FAN_TRANSFORM = 'rotateX(9deg) rotateY(-26deg) rotateZ(7deg)'

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
      {/* Heading on the LEFT (vertically centered), the receding perspective
          fan on the RIGHT. The whole beat is cut off by a hairline divider so
          the tilted pages never bleed into the "In motion" video module below. */}
      <div className="border-b border-white/12">
        {/* DESKTOP / TABLET: two columns — text left & centered, fan right. */}
        <div className="mx-auto hidden w-full max-w-[1600px] grid-cols-[minmax(280px,360px)_minmax(0,1fr)] items-center gap-6 lg:grid">
          <div className="py-20 pl-6 md:pl-12">
            <p className="br-data text-[14px] uppercase tracking-[0.12em] text-[var(--ws-green)]">4. {defaults.eyebrow}</p>
            <h2 className="mt-3 text-[34px] font-medium leading-[1.05] text-white md:text-[42px]">{defaults.heading}</h2>
            <p className="mt-4 max-w-[42ch] text-lg text-white/80">{defaults.intro}</p>
          </div>
          <FlavorPageFan pages={defaults.pages} />
        </div>

        {/* MOBILE: heading stacked above the calmer fan. */}
        <div className="lg:hidden">
          <div className="br-container pt-16">
            <p className="br-data text-[14px] uppercase tracking-[0.12em] text-[var(--ws-green)]">4. {defaults.eyebrow}</p>
            <h2 className="mt-3 text-[32px] font-medium leading-[1.05] text-white">{defaults.heading}</h2>
            <p className="mt-3 max-w-3xl text-lg text-white/80">{defaults.intro}</p>
          </div>
          <FlavorPageFan pages={defaults.pages} mobileOnly />
        </div>
      </div>

      {/* Autoplay flavor video */}
      <div className="br-container pb-20 pt-14 md:pb-[120px] md:pt-24">
        <div className="grid grid-cols-1 items-center gap-8 lg:grid-cols-[minmax(0,360px)_minmax(0,1fr)] lg:gap-[50px]">
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

/** Three flavor pages in a receding 3D perspective fan (Samsung model). The row
 *  tilts back as one preserve-3d group; each successive page steps nearer +
 *  larger; alternating pages drift opposite directions on scroll. Pages bleed
 *  off the top/bottom of the band for a cinematic feel. */
function FlavorPageFan({ pages, mobileOnly = false }: { pages: string[]; mobileOnly?: boolean }) {
  const ref = useRef<HTMLDivElement>(null)
  const [progress, setProgress] = useState(0)
  const reduce = useRef(false)

  useEffect(() => {
    reduce.current = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    let raf = 0
    const onScroll = () => {
      if (raf) return
      raf = requestAnimationFrame(() => {
        raf = 0
        const el = ref.current
        if (!el) return
        const r = el.getBoundingClientRect()
        const vh = window.innerHeight
        const center = r.top + r.height / 2
        const p = (vh / 2 - center) / (vh / 2 + r.height / 2)
        setProgress(Math.max(-1, Math.min(1, p)))
      })
    }
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    window.addEventListener('resize', onScroll)
    return () => {
      window.removeEventListener('scroll', onScroll)
      window.removeEventListener('resize', onScroll)
      if (raf) cancelAnimationFrame(raf)
    }
  }, [])

  const amp = reduce.current ? 0 : 56

  return (
    <>
      {/* DESKTOP / TABLET: the perspective fan. Lives in the RIGHT grid column,
          so it fills that column and the pages sit right-of-center (the left
          column holds the heading). Not rendered in the mobile pass. */}
      {!mobileOnly && (
      <div
        ref={ref}
        className="relative hidden h-[640px] w-full pr-4 md:pr-8 lg:block"
        style={{ perspective: '2200px', perspectiveOrigin: '60% 50%' }}
      >
        <div
          className="absolute left-1/2 top-1/2 flex items-center gap-8 md:gap-12"
          style={{ transform: `translate(-50%, -50%) ${FAN_TRANSFORM}`, transformStyle: 'preserve-3d' }}
        >
          {pages.map((p, i) => {
            const dir = i % 2 === 0 ? 1 : -1
            const near = i // 0 = far/small ... n-1 = near/large
            const scale = 0.84 + near * 0.14
            return (
              <figure
                key={p}
                className="relative shrink-0 overflow-hidden rounded-[14px] ring-1 ring-white/15"
                style={{
                  width: 'clamp(280px, 26vw, 440px)',
                  transform: `translateY(${progress * amp * dir}px) translateZ(${(near - 1) * 150}px) scale(${scale})`,
                  transformOrigin: 'center center',
                  boxShadow: '0 50px 90px -28px rgba(0,0,0,0.75), 0 12px 28px -10px rgba(0,0,0,0.6)',
                  willChange: 'transform',
                }}
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={p} alt="Wingstop flavor landing page" loading="lazy" draggable={false} className="block w-full" />
                <div
                  aria-hidden
                  className="pointer-events-none absolute inset-0"
                  style={{ background: 'linear-gradient(120deg, rgba(255,255,255,0.14) 0%, rgba(255,255,255,0) 34%)' }}
                />
              </figure>
            )
          })}
        </div>
      </div>
      )}

      {/* MOBILE: a calmer single-tilt overlap (the wide fan is illegible small) */}
      {mobileOnly && (
      <div className="relative mx-auto mt-10 mb-16 w-full max-w-[460px] px-5 lg:hidden" style={{ perspective: '1400px' }}>
        <div className="flex items-center justify-center" style={{ transform: 'rotateY(-16deg) rotateZ(5deg)', transformStyle: 'preserve-3d' }}>
          {pages.slice(0, 3).map((p, i) => (
            <figure
              key={p}
              className="relative -ml-10 first:ml-0 overflow-hidden rounded-[12px] ring-1 ring-white/15"
              style={{
                width: '62%',
                transform: `translateZ(${i * 60}px) scale(${0.9 + i * 0.06})`,
                boxShadow: '0 30px 60px -20px rgba(0,0,0,0.7)',
                zIndex: i,
              }}
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={p} alt="Wingstop flavor landing page" loading="lazy" className="block w-full" />
            </figure>
          ))}
        </div>
      </div>
      )}
    </>
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
    // The flavor-page video is a LANDSCAPE desktop recording (1080x608), so it
    // lives in a browser-style frame, not a phone.
    <div className="w-full overflow-hidden rounded-xl border border-white/12 bg-black shadow-[0_24px_60px_-12px_rgba(0,0,0,0.7)]">
      <div className="flex items-center gap-1.5 border-b border-white/8 bg-white/[0.03] px-3 py-2">
        <span className="h-2.5 w-2.5 rounded-full bg-white/20" />
        <span className="h-2.5 w-2.5 rounded-full bg-white/20" />
        <span className="h-2.5 w-2.5 rounded-full bg-white/20" />
      </div>
      <video
        ref={ref}
        className="block aspect-[1080/608] w-full object-cover"
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
