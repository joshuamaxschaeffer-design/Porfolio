'use client'

import { motion, useMotionValue, useReducedMotion, useScroll, useSpring, useTransform, type MotionValue } from 'motion/react'
import { useEffect, useRef, useState } from 'react'

/**
 * ScreenStack — a generalized port of the Baserate ScalabilityTimeline. A real
 * pinhole-perspective "zoom-out" deck: cards sit at equal depth intervals and a
 * pinhole camera projects depth → scale + screen position, so the far cards
 * bunch toward a vanishing point exactly like a real lens. Scroll is the dolly:
 * the cards start near the front and spread into depth as the section scrolls in.
 *
 * Differences from the Baserate original: takes arbitrary `screens` (image
 * URLs), works on light OR dark sections (`dark` controls the dissolve color),
 * and the blur is frozen at the settled depth (Safari-safe), same as Baserate.
 */

const F = 1500
const GAP_MAX = 560
const GAP_MIN = 230
const VP_X = 88
const VP_Y = 20
const FRONT_X = 33
const FRONT_Y = 48

function project(z: number, frontX = FRONT_X, vpX = VP_X) {
  const s = F / (F + z)
  const k = 1 - s
  return { s, x: frontX + (vpX - frontX) * k, y: FRONT_Y + (VP_Y - FRONT_Y) * k }
}
function darkenForD(d: number) {
  return Math.max(0, Math.min(0.95, (d - 1) * 0.2))
}
function blurForD(d: number) {
  return Math.max(0, (d - 1) * 7)
}

export function ScreenStack({
  screens,
  dark = false,
  cardWidth = '46%',
  height = 'h-[360px] sm:h-[460px] lg:h-[560px]',
}: {
  screens: { src: string; alt?: string }[]
  dark?: boolean
  /** Front-card width as a % of the stage. Phone screens read well ~46%. */
  cardWidth?: string
  height?: string
}) {
  const reduce = useReducedMotion()
  const stageRef = useRef<HTMLDivElement>(null)
  const [mobile, setMobile] = useState(false)
  useEffect(() => {
    const mq = window.matchMedia('(max-width: 1023px)')
    const apply = () => setMobile(mq.matches)
    apply()
    mq.addEventListener('change', apply)
    return () => mq.removeEventListener('change', apply)
  }, [])
  const frontX = mobile ? 45 : FRONT_X
  const vpX = mobile ? 94 : VP_X

  const { scrollYProgress } = useScroll({ target: stageRef, offset: ['start end', 'center center'] })
  const p = useSpring(scrollYProgress, { stiffness: 110, damping: 30, mass: 0.6 })
  const gap = useTransform(p, [0, 1], [GAP_MIN, GAP_MAX])
  const gapStatic = useMotionValue(GAP_MAX)
  const gapMV = reduce ? gapStatic : gap

  const n = screens.length
  const dissolve = dark ? '11,16,32' : '244,245,247'

  return (
    <div ref={stageRef} className={`relative mx-auto block w-full max-w-[1240px] pt-4 ${height}`}>
      {screens.map((s, i) => (
        <Card key={s.src} src={s.src} alt={s.alt} index={i} gap={gapMV} total={n} frontX={frontX} vpX={vpX} cardWidth={cardWidth} dissolve={dissolve} />
      ))}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0"
        style={{
          background: `radial-gradient(120% 110% at 84% 28%, rgba(${dissolve},0) 30%, rgba(${dissolve},0.55) 62%, rgba(${dissolve},0.98) 88%)`,
        }}
      />
    </div>
  )
}

function Card({
  src,
  alt,
  index,
  gap,
  total,
  frontX,
  vpX,
  cardWidth,
  dissolve,
}: {
  src: string
  alt?: string
  index: number
  gap: MotionValue<number>
  total: number
  frontX: number
  vpX: number
  cardWidth: string
  dissolve: string
}) {
  const d = useTransform(gap, (g) => (index * g) / GAP_MAX)
  const proj = useTransform(gap, (g) => project(index * g, frontX, vpX))
  const left = useTransform(proj, (pr) => `${pr.x}%`)
  const top = useTransform(proj, (pr) => `${pr.y}%`)
  const scale = useTransform(proj, (pr) => pr.s)
  const darken = useTransform(d, (dd) => darkenForD(dd))
  const qStep = (v: number, step: number) => Math.round(v / step) * step
  const dSettled = index
  const blurOuter = `blur(${qStep(blurForD(dSettled) * 0.45, 2)}px)`
  const blurInner = `blur(${qStep(blurForD(dSettled) * 0.55, 2)}px)`
  return (
    <motion.div
      className="absolute"
      style={{ left, top, width: cardWidth, x: '-50%', y: '-50%', scale, zIndex: total - index, filter: blurOuter, willChange: 'transform' }}
    >
      <motion.div className="relative overflow-hidden rounded-xl bg-white" style={{ boxShadow: '0 30px 70px -28px rgba(0,0,0,0.55)', filter: blurInner }}>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={src} alt={alt ?? ''} draggable={false} className="block w-full select-none" />
        <motion.div className="pointer-events-none absolute inset-0" style={{ opacity: darken, background: `rgb(${dissolve})` }} />
      </motion.div>
    </motion.div>
  )
}
