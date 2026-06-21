'use client'
'use client'

import { useEffect, useRef } from 'react'
import { Reveal } from '../../../animation/Reveal'
import { AnchorHeader, ModuleCaption } from './primitives'

/**
 * Autoplaying, muted, looping web video. Plays only while in view (robust with
 * smooth-scroll / many simultaneous videos); always shows its poster otherwise.
 */
function LoopVideo({
  src,
  poster,
  className = '',
  label,
}: {
  src: string
  poster?: string
  className?: string
  label?: string
}) {
  const ref = useRef<HTMLVideoElement>(null)
  useEffect(() => {
    const v = ref.current
    if (!v) return
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    if (reduce) return // honor reduced-motion: poster stays, no playback
    const io = new IntersectionObserver(
      ([e]) => {
        if (e.isIntersecting) {
          v.play().catch(() => {})
        } else {
          v.pause()
        }
      },
      { threshold: 0.2 },
    )
    io.observe(v)
    return () => io.disconnect()
  }, [])
  return (
    <video
      ref={ref}
      className={className}
      src={src}
      poster={poster}
      muted
      loop
      playsInline
      preload="metadata"
      aria-label={label}
    />
  )
}

/**
 * Section 04 — Motion & Illustration (GREY section, light tone).
 * Real media: autoplay brand-film reel + motion posters, the real Mindbody
 * illustration board, and a rail of real looping animation GIFs.
 */
export function ArtMotionModules({ dark = false }: { dark?: boolean }) {
  return (
    <div className="space-y-16 md:space-y-24">
      {/* Reel hero (real CBTL brand film) + motion filmstrip */}
      <div>
        <AnchorHeader
          dark={dark}
          kicker="Motion · reel"
          title="Motion that reads, even paused"
          blurb="Interface motion and brand film — a looping reel with stills pulled from it, so the work lands whether or not it’s playing."
        />
        {/* mb-motion is landscape (1280×746); pepsi is tall phone (750×1750).
            Each at its native aspect — no letterbox, no caption. The pepsi phone
            is sized so its height matches the landscape video's height. */}
        <div className="flex flex-col items-start gap-5 md:flex-row md:gap-6">
          <Reveal className="w-full md:flex-1">
            <div className="overflow-hidden rounded-[var(--br-card-radius)] border border-[var(--br-line)]">
              <LoopVideo src="/capabilities/motion/mb-motion.mp4" poster="/capabilities/motion/mb-motion-poster.webp" className="aspect-[1280/746] w-full object-cover" />
            </div>
          </Reveal>
          <Reveal delay={60} className="w-[150px] shrink-0 md:w-[180px]">
            <div className="overflow-hidden rounded-[20px] border border-[var(--br-line)]">
              <LoopVideo src="/capabilities/motion/pepsi-motion.mp4" poster="/capabilities/motion/pepsi-motion-poster.webp" className="aspect-[750/1750] w-full object-cover" />
            </div>
          </Reveal>
        </div>
      </div>

      {/* CBTL interface motion — real screen-recordings of the app in motion */}
      <div>
        <AnchorHeader
          dark={dark}
          kicker="Interface motion · CBTL"
          title="Motion designed into the product"
          role="Coffee Bean & Tea Leaf"
          blurb="The CBTL app shipped with motion as a feature — a time-of-day theming system, an animated scan-to-pay pulse, and transitions designed alongside the UI. Real screen recordings."
        />
        <div className="grid grid-cols-2 gap-4 md:grid-cols-4 md:gap-5">
          {[
            { src: '/capabilities/cbtl/vid-onboarding.mp4', label: 'Onboarding' },
            { src: '/capabilities/cbtl/vid-menu.mp4', label: 'Menu' },
            { src: '/capabilities/cbtl/vid-daypart.mp4', label: 'Dayparting' },
            { src: '/capabilities/cbtl/vid-scan.mp4', label: 'Scan to pay' },
          ].map((v, i) => (
            <Reveal key={v.label} delay={i * 50}>
              <figure className="overflow-hidden rounded-[12px] border border-[var(--br-line)] bg-black">
                <LoopVideo
                  src={v.src}
                  poster={v.src.replace('.mp4', '-poster.webp')}
                  label={`CBTL ${v.label}`}
                  className="aspect-[540/960] w-full object-cover"
                />
              </figure>
            </Reveal>
          ))}
        </div>
      </div>

      {/* Icon systems — CBTL + Mindbody libraries */}
      <div>
        <AnchorHeader
          dark={dark}
          kicker="Iconography"
          title="Icon systems, designed and directed"
          role="Mindbody · CBTL"
          blurb="At Mindbody I designed and directed other designers to build a large product icon library; for CBTL I drew a bespoke, characterful set. Two ends of the icon spectrum."
        />
        <div className="grid grid-cols-1 gap-5 md:grid-cols-12 md:gap-6 md:items-start">
          <div className="md:col-span-7">
            <figure className="overflow-hidden rounded-[var(--br-card-radius)] border border-[var(--br-line)] bg-white">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src="/capabilities/mindbody-new/icons-1.webp" alt="Mindbody product icon library" className="w-full object-cover" loading="lazy" />
            </figure>
          </div>
          <div className="md:col-span-5">
            <figure className="overflow-hidden rounded-[var(--br-card-radius)] border border-[var(--br-line)] bg-white">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src="/capabilities/cbtl/icons-1.webp" alt="CBTL bespoke icon set" className="w-full object-contain p-4" loading="lazy" />
            </figure>
          </div>
        </div>
      </div>

      {/* Illustration language — real Mindbody board */}
      <div>
        <AnchorHeader
          dark={dark}
          kicker="Languages"
          title="Documented visual languages"
          role="Mindbody · CBTL"
          blurb="Mindbody’s illustration program — “2 Pillars: Relatable, Purposeful” — that I pitched (analysis + proposal) and then defined as a usable style guide, plus a documented motion language."
        />
        {/* the actual spot illustrations from the style guide (not the full pages) */}
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-6 md:gap-5">
          {[
            '/capabilities/mindbody-new/illo-art-1.webp',
            '/capabilities/mindbody-new/illo-art-2.webp',
            '/capabilities/mindbody-new/illo-art-3.webp',
            '/capabilities/mindbody-new/illo-art-4.webp',
            '/capabilities/mindbody-new/illo-art-5.webp',
            '/capabilities/mindbody-new/illo-art-6.webp',
          ].map((src, i) => (
            <Reveal key={src} delay={i * 30}>
              <figure className="flex aspect-square items-center justify-center overflow-hidden rounded-[var(--br-card-radius)] border border-[var(--br-line)] bg-white p-3">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={src} alt="Mindbody illustration" className="max-h-full max-w-full object-contain" loading="lazy" />
              </figure>
            </Reveal>
          ))}
        </div>
        <ModuleCaption dark={dark}>
          From research and a written proposal to a usable style guide — and a parallel motion language (“Calming, Reactive, Guiding”).
        </ModuleCaption>
      </div>
    </div>
  )
}
