'use client'

import { motion, useReducedMotion } from 'motion/react'
import { useEffect, useRef, useState } from 'react'

/**
 * Branding hero — "Brand & Marketing".
 *
 * One 3D-feeling environment over a blue/white diagonal field:
 *  - TWO devices (desktop = Baserate marketing site, phone = Journalytic site)
 *    rendered in SD Studio: each rotates on a matched plane while its screen
 *    scrolls the marketing site down then back up. Transparent alpha video with
 *    a baked soft shadow. Plays ONCE when the section scrolls into view.
 *  - The Baserate + Journalytic LOGOS float and slowly rotate (live, continuous).
 *  - Soft COLOUR ORBS float with premium radial shading + drop shadows.
 *
 * The device frames are baked (they rotate in 3D), so the screen content can't
 * be a CSS overlay — it's inside the video. The logos/orbs are live layers so
 * their ambient motion never freezes.
 */

const DEVICE = {
  desktop: { webm: '/baserate/branding/devices/desktop/device.webm', mov: '/baserate/branding/devices/desktop/device.mov', poster: '/baserate/branding/devices/desktop/poster.png' },
  phone: { webm: '/baserate/branding/devices/phone/device.webm', mov: '/baserate/branding/devices/phone/device.mov', poster: '/baserate/branding/devices/phone/poster.png' },
}

/** Plays its alpha video ONCE when it first scrolls into view. */
function DeviceVideo({
  webm, mov, poster, className = '', delay = 0,
}: { webm: string; mov: string; poster: string; className?: string; delay?: number }) {
  const ref = useRef<HTMLVideoElement>(null)
  const played = useRef(false)

  useEffect(() => {
    const v = ref.current
    if (!v) return
    const io = new IntersectionObserver(
      (entries) => {
        for (const e of entries) {
          if (e.isIntersecting && !played.current) {
            played.current = true
            // small stagger so the two devices don't start in perfect lockstep
            setTimeout(() => { v.currentTime = 0; v.play().catch(() => {}) }, delay)
          }
        }
      },
      { threshold: 0.35 },
    )
    io.observe(v)
    return () => io.disconnect()
  }, [delay])

  return (
    <video
      ref={ref}
      className={className}
      muted
      playsInline
      preload="auto"
      poster={poster}
      width={1920}
      height={1080}
    >
      {/* HEVC-with-alpha first (Safari), VP9-with-alpha fallback (Chrome/FF/Edge) */}
      <source src={mov} type='video/quicktime; codecs="hvc1"' />
      <source src={webm} type="video/webm" />
    </video>
  )
}

/** A floating, slowly-rotating logo plane with a soft shadow. */
function FloatingLogo({
  src, alt, className = '', floatRange = 14, rotateRange = 5, dur = 9, delay = 0, reduce,
}: {
  src: string; alt: string; className?: string
  floatRange?: number; rotateRange?: number; dur?: number; delay?: number; reduce: boolean | null
}) {
  return (
    <motion.div
      className={`pointer-events-none absolute ${className}`}
      initial={false}
      animate={reduce ? {} : {
        y: [0, -floatRange, 0],
        rotate: [-rotateRange, rotateRange, -rotateRange],
      }}
      transition={{ duration: dur, repeat: Infinity, ease: 'easeInOut', delay }}
      style={{ filter: 'drop-shadow(0 18px 28px rgba(20,30,60,0.16))' }}
    >
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img src={src} alt={alt} className="h-full w-full object-contain" draggable={false} />
    </motion.div>
  )
}

/** A premium soft colour orb that floats. Radial gradient + specular highlight. */
function Orb({
  className = '', from, to, size, floatRange = 18, dur = 11, delay = 0, reduce,
}: {
  className?: string; from: string; to: string; size: number
  floatRange?: number; dur?: number; delay?: number; reduce: boolean | null
}) {
  return (
    <motion.div
      className={`pointer-events-none absolute rounded-full ${className}`}
      style={{
        width: size, height: size,
        background: `radial-gradient(circle at 32% 28%, ${from}, ${to} 72%)`,
        boxShadow: `0 24px 50px -14px ${to}66, inset 0 -8px 18px rgba(0,0,0,0.18), inset 0 6px 14px rgba(255,255,255,0.35)`,
      }}
      initial={false}
      animate={reduce ? {} : { y: [0, -floatRange, 0], x: [0, floatRange * 0.4, 0] }}
      transition={{ duration: dur, repeat: Infinity, ease: 'easeInOut', delay }}
    />
  )
}

export function BrandingHero() {
  const reduce = useReducedMotion()
  const [mounted, setMounted] = useState(false)
  useEffect(() => setMounted(true), [])

  return (
    <section className="relative overflow-hidden">
      {/* Blue / white diagonal field. Top-left white, bottom-right brand blue,
          split on a diagonal — matches the Figma hero. */}
      <div
        className="absolute inset-0"
        style={{
          background:
            'linear-gradient(160deg, #ffffff 0%, #ffffff 46%, #2f6db5 46.2%, #2a619f 100%)',
        }}
      />

      {/* Heading block — centered, sits above the devices */}
      <div className="br-container relative z-20 pt-20 text-center md:pt-28">
        <h2 className="text-[34px] font-semibold uppercase leading-none tracking-tight text-[var(--br-ink)] md:text-[52px]">
          Brand &amp; Marketing
        </h2>
        <p className="mt-4 text-lg text-[var(--br-muted)] md:text-[22px]">
          Ran in tandem with product implementation.
        </p>
      </div>

      {/* The 3D stage: devices + floating logos + orbs. Reserve height so there's
          no layout shift while the alpha videos load. */}
      <div className="relative z-10 mx-auto h-[78vh] max-h-[760px] min-h-[520px] w-full max-w-[1500px]">
        {mounted && (
          <>
            {/* PHONE — left, Journalytic */}
            <DeviceVideo
              {...DEVICE.phone}
              delay={120}
              className="absolute bottom-0 left-[2%] h-[78%] w-[42%] object-contain md:left-[6%] md:w-[34%]"
            />
            {/* DESKTOP — right, Baserate */}
            <DeviceVideo
              {...DEVICE.desktop}
              delay={0}
              className="absolute bottom-[6%] right-[1%] h-[70%] w-[58%] object-contain md:right-[3%] md:w-[50%]"
            />

            {/* Floating logos */}
            <FloatingLogo
              src="/baserate/branding/logos/journalytic-app.svg"
              alt="Journalytic"
              reduce={reduce}
              className="left-[30%] top-[12%] h-12 w-12 md:h-16 md:w-16"
              dur={8} delay={0}
            />
            <FloatingLogo
              src="/baserate/branding/logos/baserate-app.svg"
              alt="Baserate"
              reduce={reduce}
              className="right-[40%] top-[40%] h-12 w-12 md:h-16 md:w-16"
              dur={10} delay={1.2}
            />

            {/* Colour orbs */}
            <Orb reduce={reduce} className="left-[18%] top-[14%]" from="#e9c46a" to="#c79016" size={26} dur={10} />
            <Orb reduce={reduce} className="left-[36%] top-[58%]" from="#5b9bd5" to="#2f6db5" size={34} dur={12} delay={0.8} />
            <Orb reduce={reduce} className="right-[33%] top-[20%]" from="#1b2440" to="#070e2c" size={30} dur={13} delay={1.5} />
            <Orb reduce={reduce} className="right-[20%] bottom-[16%]" from="#3a6fb0" to="#234d80" size={40} dur={11} delay={0.4} />
          </>
        )}
      </div>

      {/* Sub-label under the stage (over the blue) */}
      <div className="br-container relative z-20 pb-20 text-center md:pb-28">
        <h3 className="text-[22px] font-semibold uppercase tracking-tight text-white md:text-[28px]">
          B2C Brand Exploration
        </h3>
        <p className="mx-auto mt-3 max-w-xl text-white/80 md:text-lg">
          The B2C brand Journalytic was finished first, with consumer-focussed branding and messaging.
        </p>
      </div>
    </section>
  )
}
