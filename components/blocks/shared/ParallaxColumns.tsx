'use client'

import { motion, useReducedMotion, useScroll, useTransform } from 'motion/react'
import { useRef } from 'react'

export interface ParallaxTile {
  /** image url; a tinted swatch is shown if omitted */
  src?: string
  label?: string
  accent?: string
}

/**
 * ParallaxColumns — adjacent columns of media tiles that scroll at slightly
 * different speeds for depth, without any 3D. Reads as craft on a flat white
 * layout. Two columns on mobile, three on desktop; the middle column lags.
 * Reduced-motion → a plain grid.
 */
export function ParallaxColumns({ tiles, className }: { tiles: ParallaxTile[]; className?: string }) {
  const reduce = useReducedMotion()
  const ref = useRef<HTMLDivElement>(null)
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start end', 'end start'] })
  const yA = useTransform(scrollYProgress, [0, 1], [60, -60])
  const yB = useTransform(scrollYProgress, [0, 1], [-40, 40])
  const yC = useTransform(scrollYProgress, [0, 1], [90, -90])
  const cols = [yA, yB, yC]

  // distribute tiles round-robin into 3 columns (2 visible cols on mobile via CSS)
  const buckets: ParallaxTile[][] = [[], [], []]
  tiles.forEach((t, i) => buckets[i % 3].push(t))

  return (
    <div ref={ref} className={`grid grid-cols-2 gap-3 md:grid-cols-3 md:gap-5 ${className ?? ''}`}>
      {buckets.map((bucket, c) => (
        <motion.div
          key={c}
          className={`flex flex-col gap-3 md:gap-5 ${c === 2 ? 'hidden md:flex' : ''}`}
          style={reduce ? undefined : { y: cols[c] }}
        >
          {bucket.map((tile, i) => (
            <Tile key={i} tile={tile} offset={(c + i) % 2 === 0} />
          ))}
        </motion.div>
      ))}
    </div>
  )
}

function Tile({ tile, offset }: { tile: ParallaxTile; offset: boolean }) {
  return (
    <div
      className="overflow-hidden rounded-[var(--br-card-radius)] border border-[var(--br-line)]"
      style={{ aspectRatio: offset ? '3 / 4' : '4 / 5' }}
    >
      {tile.src ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img src={tile.src} alt={tile.label ?? ''} className="h-full w-full object-cover" draggable={false} />
      ) : (
        <div
          className="flex h-full w-full items-end p-4"
          style={{ background: `linear-gradient(150deg, ${tile.accent ?? 'var(--br-pill)'} 0%, #ffffff 130%)` }}
        >
          {tile.label ? (
            <span className="br-data text-[11px] uppercase tracking-[0.12em] text-[var(--br-muted)]">{tile.label}</span>
          ) : null}
        </div>
      )}
    </div>
  )
}
