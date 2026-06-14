'use client'

import { useRef, useState, useCallback, useEffect } from 'react'
import type { ReactNode } from 'react'

/**
 * ImageCompareSlider — a draggable before/after reveal. Drag the handle (or
 * click anywhere on the track) to wipe between two layers. The standard
 * redesign / before-after device on case studies. Keyboard accessible (arrow
 * keys move the divider); works with images OR arbitrary children.
 */
export function ImageCompareSlider({
  before,
  after,
  beforeLabel = 'Before',
  afterLabel = 'After',
  ratio = '16 / 10',
  className,
}: {
  /** image src OR node for the BASE (under) layer */
  before: string | ReactNode
  /** image src OR node for the TOP (clipped) layer */
  after: string | ReactNode
  beforeLabel?: string
  afterLabel?: string
  ratio?: string
  className?: string
}) {
  const ref = useRef<HTMLDivElement>(null)
  const [pos, setPos] = useState(50) // percent
  const dragging = useRef(false)

  const setFromClientX = useCallback((clientX: number) => {
    const r = ref.current?.getBoundingClientRect()
    if (!r) return
    const p = ((clientX - r.left) / r.width) * 100
    setPos(Math.max(0, Math.min(100, p)))
  }, [])

  useEffect(() => {
    const move = (e: PointerEvent) => { if (dragging.current) setFromClientX(e.clientX) }
    const up = () => { dragging.current = false }
    window.addEventListener('pointermove', move)
    window.addEventListener('pointerup', up)
    return () => { window.removeEventListener('pointermove', move); window.removeEventListener('pointerup', up) }
  }, [setFromClientX])

  const renderLayer = (layer: string | ReactNode, alt: string) =>
    typeof layer === 'string' ? (
      // eslint-disable-next-line @next/next/no-img-element
      <img src={layer} alt={alt} draggable={false} className="absolute inset-0 h-full w-full select-none object-cover" />
    ) : (
      <div className="absolute inset-0 h-full w-full">{layer}</div>
    )

  return (
    <div
      ref={ref}
      className={`relative touch-none overflow-hidden rounded-[var(--br-card-radius)] border border-[var(--br-line)] ${className ?? ''}`}
      style={{ aspectRatio: ratio }}
      onPointerDown={(e) => { dragging.current = true; setFromClientX(e.clientX) }}
    >
      {/* base = before */}
      {renderLayer(before, beforeLabel)}
      <span className="br-data absolute bottom-3 left-3 z-10 rounded bg-black/55 px-2.5 py-1 text-[11px] uppercase tracking-[0.12em] text-white">{beforeLabel}</span>

      {/* top = after, clipped to pos */}
      <div className="absolute inset-0" style={{ clipPath: `inset(0 ${100 - pos}% 0 0)`, WebkitClipPath: `inset(0 ${100 - pos}% 0 0)` }}>
        {renderLayer(after, afterLabel)}
        <span className="br-data absolute bottom-3 right-3 z-10 rounded bg-black/55 px-2.5 py-1 text-[11px] uppercase tracking-[0.12em] text-white">{afterLabel}</span>
      </div>

      {/* divider + handle */}
      <div className="absolute inset-y-0 z-20" style={{ left: `${pos}%`, transform: 'translateX(-50%)' }}>
        <div className="h-full w-[2px] bg-white shadow-[0_0_0_1px_rgba(0,0,0,0.15)]" />
        <button
          type="button"
          aria-label="Drag to compare"
          role="slider"
          aria-valuenow={Math.round(pos)}
          aria-valuemin={0}
          aria-valuemax={100}
          tabIndex={0}
          onKeyDown={(e) => {
            if (e.key === 'ArrowLeft') setPos((p) => Math.max(0, p - 4))
            if (e.key === 'ArrowRight') setPos((p) => Math.min(100, p + 4))
          }}
          className="absolute left-1/2 top-1/2 flex h-11 w-11 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full bg-white text-[var(--br-ink)] shadow-[0_6px_16px_-4px_rgba(7,14,44,0.5)] outline-none ring-[var(--br-gold)] focus-visible:ring-2"
        >
          <span aria-hidden className="text-sm tracking-tighter">‹ ›</span>
        </button>
      </div>
    </div>
  )
}
