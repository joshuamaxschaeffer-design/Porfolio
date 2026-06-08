'use client'

import { motion, useReducedMotion, useScroll, useSpring, useTransform } from 'motion/react'
import { useRef } from 'react'

/**
 * The three product devices (desktop UI + two phones) with a subtle scroll
 * animation: as the stage scrolls in, the desktop UI rises + comes forward, and
 * the two phones rotate and slide into their final placement. Each device sits
 * on its own soft ~15%-opacity shadow. Shadows are attached to each device's
 * own wrapper (drop-shadow that hugs the silhouette) so the desktop's shadow
 * doesn't fall across the phone screens.
 *
 * Rendered inside the absolutely-positioned 1283×689 stage; positions match the
 * Figma exactly. Reduced-motion users get the settled final state.
 */
export function ProductDeviceStage({
  desktopSrc,
  phone1Src,
  phone2Src,
}: {
  desktopSrc: string
  phone1Src: string
  phone2Src: string
}) {
  const reduce = useReducedMotion()
  const ref = useRef<HTMLDivElement>(null)
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start end', 'center center'] })
  const p = useSpring(scrollYProgress, { stiffness: 90, damping: 28, mass: 0.7 })

  // Desktop: rises + comes forward (scale up a touch) as you scroll in.
  const deskY = useTransform(p, [0, 1], [44, 0]) // px, settles to 0
  const deskScale = useTransform(p, [0, 1], [0.96, 1])
  const deskOpacity = useTransform(p, [0, 1], [0.6, 1])

  // Phones: rotate + slide into place.
  const p1Rot = useTransform(p, [0, 1], [-10, 0]) // deg
  const p1X = useTransform(p, [0, 1], [-26, 0]) // px
  const p1Y = useTransform(p, [0, 1], [28, 0])
  const p2Rot = useTransform(p, [0, 1], [12, 0])
  const p2X = useTransform(p, [0, 1], [34, 0])
  const p2Y = useTransform(p, [0, 1], [40, 0])
  const phoneOpacity = useTransform(p, [0, 0.5, 1], [0, 0.7, 1])

  return (
    <div ref={ref} className="pointer-events-none absolute inset-0">
      {/* Desktop UI screenshot (with its own soft shadow) */}
      <motion.div
        className="absolute overflow-hidden rounded-[4px] bg-white"
        style={{
          left: '5.14%',
          top: '16.3%',
          width: '42.8%',
          height: '49.8%',
          // soft ~15% shadow that hugs the panel
          boxShadow: '0 24px 50px -12px rgba(0,0,0,0.15)',
          transformOrigin: '50% 100%',
          ...(reduce ? {} : { y: deskY, scale: deskScale, opacity: deskOpacity }),
        }}
      >
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={desktopSrc} alt="Baserate product" className="h-full w-full object-cover object-left-top" />
      </motion.div>

      {/* Phone 1 (left, upright) — drop-shadow hugs the device silhouette so it
          doesn't cast a box onto the other phone's screen. */}
      <motion.img
        src={phone1Src}
        alt=""
        aria-hidden
        className="absolute object-contain"
        style={{
          left: '65.5%',
          top: '27%',
          width: '15%',
          height: '56.6%',
          filter: 'drop-shadow(0 18px 26px rgba(0,0,0,0.15))',
          transformOrigin: '50% 90%',
          ...(reduce ? {} : { rotate: p1Rot, x: p1X, y: p1Y, opacity: phoneOpacity }),
        }}
      />
      {/* Phone 2 (right, larger, lower) */}
      <motion.img
        src={phone2Src}
        alt=""
        aria-hidden
        className="absolute object-contain"
        style={{
          left: '76%',
          top: '29.2%',
          width: '20.4%',
          height: '58.7%',
          filter: 'drop-shadow(0 20px 30px rgba(0,0,0,0.15))',
          transformOrigin: '50% 90%',
          ...(reduce ? {} : { rotate: p2Rot, x: p2X, y: p2Y, opacity: phoneOpacity }),
        }}
      />
    </div>
  )
}
