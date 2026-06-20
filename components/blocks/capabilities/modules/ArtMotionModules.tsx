'use client'

import { Reveal } from '../../../animation/Reveal'
import { AnchorHeader, ModuleCaption } from './primitives'

/** Autoplaying, muted, looping web video (the reel). */
function LoopVideo({
  src,
  poster,
  className = '',
}: {
  src: string
  poster?: string
  className?: string
}) {
  return (
    <video
      className={className}
      src={src}
      poster={poster}
      autoPlay
      muted
      loop
      playsInline
      preload="metadata"
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
              poster="/capabilities/motion/cbtl-film-poster.jpg"
              className="aspect-video w-full object-cover"
            />
          </div>
        </Reveal>
        <div className="mt-4 grid grid-cols-2 gap-4 md:grid-cols-3 md:gap-5">
          <Reveal>
            <figure className="overflow-hidden rounded-[var(--br-card-radius)] border border-[var(--br-line)] bg-black">
              <LoopVideo src="/capabilities/motion/mb-motion.mp4" poster="/capabilities/motion/mb-motion-poster.jpg" className="aspect-video w-full object-cover" />
              <figcaption className="br-data bg-white px-4 py-2.5 text-[11px] uppercase tracking-[0.08em] text-[var(--br-muted-2)]">Mindbody — interface motion</figcaption>
            </figure>
          </Reveal>
          <Reveal delay={60}>
            <figure className="overflow-hidden rounded-[var(--br-card-radius)] border border-[var(--br-line)] bg-black">
              <LoopVideo src="/capabilities/motion/pepsi-motion.mp4" poster="/capabilities/motion/pepsi-motion-poster.jpg" className="aspect-video w-full object-cover" />
              <figcaption className="br-data bg-white px-4 py-2.5 text-[11px] uppercase tracking-[0.08em] text-[var(--br-muted-2)]">Pepsi — product / AR</figcaption>
            </figure>
          </Reveal>
          <Reveal delay={120}>
            <figure className="overflow-hidden rounded-[var(--br-card-radius)] border border-[var(--br-line)] bg-black">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src="/capabilities/motion/cbtl-film-poster.jpg" alt="CBTL brand film still" className="aspect-video w-full object-cover" loading="lazy" />
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
            <img src="/capabilities/motion/mb-illustrations.jpg" alt="Mindbody illustration system applied in-product" className="w-full object-cover" loading="lazy" />
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
            { src: '/capabilities/motion/anim-Octopus.gif', label: 'Octopus' },
            { src: '/capabilities/motion/anim-Fire.gif', label: 'Fire' },
            { src: '/capabilities/motion/anim-Whale.gif', label: 'Whale' },
            { src: '/capabilities/motion/anim-Monkey.gif', label: 'Monkey' },
            { src: '/capabilities/motion/anim-lion.gif', label: 'Lion' },
            { src: '/capabilities/motion/anim-Bird.gif', label: 'Bird' },
          ].map((a, i) => (
            <Reveal key={a.label} delay={i * 30}>
              <figure className="overflow-hidden rounded-[var(--br-card-radius)] border border-[var(--br-line)] bg-white">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={a.src} alt={`${a.label} animation`} className="aspect-square w-full object-cover" loading="lazy" />
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
