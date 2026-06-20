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
        <Reveal>
          <div className="overflow-hidden rounded-[var(--br-card-radius)] border border-[var(--br-line)] bg-black">
            <LoopVideo
              src="/capabilities/motion/cbtl-film.mp4"
              poster="/capabilities/motion/cbtl-film-poster.webp"
              className="aspect-video w-full object-cover"
            />
          </div>
        </Reveal>
        <div className="mt-4 grid grid-cols-2 gap-4 md:grid-cols-3 md:gap-5">
          <Reveal>
            <figure className="overflow-hidden rounded-[var(--br-card-radius)] border border-[var(--br-line)] bg-black">
              <LoopVideo src="/capabilities/motion/mb-motion.mp4" poster="/capabilities/motion/mb-motion-poster.webp" className="aspect-video w-full object-cover" />
              <figcaption className="br-data bg-white px-4 py-2.5 text-[11px] uppercase tracking-[0.08em] text-[var(--br-muted-2)]">Mindbody — interface motion</figcaption>
            </figure>
          </Reveal>
          <Reveal delay={60}>
            <figure className="overflow-hidden rounded-[var(--br-card-radius)] border border-[var(--br-line)] bg-black">
              <LoopVideo src="/capabilities/motion/pepsi-motion.mp4" poster="/capabilities/motion/pepsi-motion-poster.webp" className="aspect-video w-full object-cover" />
              <figcaption className="br-data bg-white px-4 py-2.5 text-[11px] uppercase tracking-[0.08em] text-[var(--br-muted-2)]">Pepsi — product / AR</figcaption>
            </figure>
          </Reveal>
          <Reveal delay={120}>
            <figure className="overflow-hidden rounded-[var(--br-card-radius)] border border-[var(--br-line)] bg-black">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src="/capabilities/motion/cbtl-film-poster.webp" alt="CBTL brand film still" className="aspect-video w-full object-cover" loading="lazy" />
              <figcaption className="br-data bg-white px-4 py-2.5 text-[11px] uppercase tracking-[0.08em] text-[var(--br-muted-2)]">CBTL — brand film (4K)</figcaption>
            </figure>
          </Reveal>
        </div>
        <ModuleCaption dark={dark}>Brand film, interface motion, and product/AR — autoplaying muted loops.</ModuleCaption>
      </div>

      {/* Illustration language — real Mindbody board */}
      <div>
        <AnchorHeader
          dark={dark}
          kicker="Languages"
          title="Documented visual languages"
          role="Mindbody · CBTL"
          blurb="Mindbody’s illustration (“2 Pillars: Relatable, Purposeful”) and motion (“3 Pillars: Calming, Reactive, Guiding”) — principles teams can follow."
        />
        <Reveal>
          <figure className="overflow-hidden rounded-[var(--br-card-radius)] border border-[var(--br-line)] bg-white">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="/capabilities/motion/mb-illustrations.webp" alt="Mindbody illustration system applied in-product" className="w-full object-cover" loading="lazy" />
            <figcaption className="br-data px-4 py-3 text-[11px] uppercase tracking-[0.08em] text-[var(--br-muted-2)]">Mindbody — illustration system, applied in-product</figcaption>
          </figure>
        </Reveal>
      </div>

      {/* Animated marks + character — real looping GIFs */}
      <div>
        <AnchorHeader
          dark={dark}
          kicker="Animated identity & character"
          title="Marks & characters in motion"
          blurb="Logo systems, loaders, and character loops built to move."
        />
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-6 md:gap-5">
          {[
            { src: '/capabilities/motion/anim-Octopus.mp4', label: 'Octopus' },
            { src: '/capabilities/motion/anim-Fire.mp4', label: 'Fire' },
            { src: '/capabilities/motion/anim-Whale.mp4', label: 'Whale' },
            { src: '/capabilities/motion/anim-Monkey.mp4', label: 'Monkey' },
            { src: '/capabilities/motion/anim-lion.mp4', label: 'Lion' },
            { src: '/capabilities/motion/anim-Bird.mp4', label: 'Bird' },
          ].map((a, i) => (
            <Reveal key={a.label} delay={i * 30}>
              <figure className="overflow-hidden rounded-[var(--br-card-radius)] border border-[var(--br-line)] bg-white">
                <LoopVideo
                  src={a.src}
                  poster={a.src.replace('.mp4', '-poster.webp')}
                  label={`${a.label} animation`}
                  className="aspect-square w-full object-cover"
                />
                <figcaption className="br-data px-3 py-2 text-center text-[10px] uppercase tracking-[0.08em] text-[var(--br-muted-2)]">{a.label}</figcaption>
              </figure>
            </Reveal>
          ))}
        </div>
        <ModuleCaption dark={dark}>Looping animation studies — interface loaders & characters.</ModuleCaption>
      </div>
    </div>
  )
}
