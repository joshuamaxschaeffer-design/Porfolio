'use client'

import { useEffect, useRef } from 'react'
import { STUDIO_PAD, createShadowPipeline, type ShadowTrack } from './studioShadow'

function pad4(n: number) {
  return String(n).padStart(4, '0')
}

/**
 * StudioObject — universal renderer for SD Studio site exports, so every 3D
 * mockup on the site (device sequences, app icons, extruded SVGs, shapes)
 * ships with the same studio-calibrated shadow treatment.
 *
 * Assets under `base` follow the studio's site/ export layout:
 *  · still:    `${base}/still.webp`            (+ shadow-v2.json)
 *  · sequence: `${base}/frames-v2/frame_NNNN.webp` (+ shadow-v2/v1.json)
 *
 * Sequences preload politely from page load (8-way, fetchpriority=low) and
 * play ONCE when scrolled into view — gated on the full cache so playback
 * never frame-skips. Stills draw as soon as the image lands.
 */
export function StudioObject({
  base,
  frameCount = 1,
  fps = 30,
  delay = 0,
  className = '',
  alt = '',
}: {
  base: string
  frameCount?: number
  fps?: number
  delay?: number
  className?: string
  alt?: string
}) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const shadowRef = useRef<HTMLCanvasElement>(null)
  const played = useRef(false)
  const trackRef = useRef<ShadowTrack>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    const shadow = shadowRef.current
    if (!canvas || !shadow) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    const isSeq = frameCount > 1
    const pipe = createShadowPipeline(canvas, shadow)
    let raf = 0
    let disposed = false
    const imgs: HTMLImageElement[] = []
    const srcFor = (i: number) =>
      isSeq ? `${base}/frames-v2/frame_${pad4(i)}.webp` : `${base}/still.webp`

    // shadow data: v2 preferred, v1 fallback (legacy sequences), else generic
    fetch(`${base}/shadow-v2.json`)
      .then((r) => (r.ok ? r.json() : null))
      .then((j) => {
        if (j?.version === 2) {
          trackRef.current = { v2: true, calib: j.calib, frames: j.frames }
          redrawCurrent()
        } else throw new Error('no v2')
      })
      .catch(() =>
        fetch(`${base}/shadow-v1.json`)
          .then((r) => (r.ok ? r.json() : null))
          .then((j) => {
            if (j?.frames) {
              trackRef.current = { v2: false, frames: j.frames }
              redrawCurrent()
            }
          })
          .catch(() => {}),
      )

    let lastDrawn = 0
    const drawFrame = (i: number) => {
      const img = imgs[i]
      if (img && img.complete && img.naturalWidth) {
        lastDrawn = i
        ctx.clearRect(0, 0, canvas.width, canvas.height)
        ctx.drawImage(img, 0, 0, canvas.width, canvas.height)
        pipe.draw(img, i, trackRef.current)
      }
    }
    // re-render the current frame when the shadow track arrives late
    const redrawCurrent = () => {
      if (!disposed && canvas.width) drawFrame(lastDrawn)
    }

    const first = new Image()
    first.onload = () => {
      if (disposed) return
      pipe.size(first.naturalWidth, first.naturalHeight)
      imgs[0] = first
      drawFrame(0)
    }
    first.src = srcFor(0)

    if (!isSeq) {
      return () => {
        disposed = true
      }
    }

    // ── sequence: polite preload + gated play-once-in-view ──
    const play = () => {
      // prefers-reduced-motion: settle straight at the final pose
      if (window.matchMedia?.('(prefers-reduced-motion: reduce)').matches) {
        drawFrame(frameCount - 1)
        return
      }
      const start = performance.now()
      const tick = (now: number) => {
        const elapsed = (now - start) / 1000
        const frame = Math.min(frameCount - 1, Math.floor(elapsed * fps))
        drawFrame(frame)
        if (frame < frameCount - 1) raf = requestAnimationFrame(tick)
      }
      raf = requestAnimationFrame(tick)
    }

    let loadedCount = 0
    let framesReady = false
    let pendingPlay = false
    let nextIdx = 0
    const CONCURRENCY = 8
    const onAllLoaded = () => {
      framesReady = true
      if (pendingPlay && !played.current) {
        played.current = true
        setTimeout(play, delay)
      }
    }
    const loadWorker = () => {
      if (disposed) return
      const i = nextIdx++
      if (i >= frameCount) return
      const img = new Image()
      img.decoding = 'async'
      img.setAttribute('fetchpriority', 'low')
      const done = () => {
        imgs[i] = img
        loadedCount++
        if (loadedCount >= frameCount) onAllLoaded()
        else loadWorker()
      }
      img.onload = done
      img.onerror = done
      img.src = srcFor(i)
    }
    for (let w = 0; w < CONCURRENCY; w++) loadWorker()

    const io = new IntersectionObserver(
      (entries) => {
        for (const e of entries) {
          if (e.isIntersecting && !played.current) {
            if (framesReady) {
              played.current = true
              setTimeout(play, delay)
            } else {
              pendingPlay = true
            }
          }
        }
      },
      { threshold: 0.3 },
    )
    io.observe(canvas)

    return () => {
      disposed = true
      io.disconnect()
      cancelAnimationFrame(raf)
    }
  }, [base, frameCount, fps, delay])

  const padPct = `${(STUDIO_PAD * 100).toFixed(0)}%`
  return (
    <div className={`relative ${className}`}>
      <canvas
        ref={shadowRef}
        aria-hidden
        className="pointer-events-none absolute"
        style={{
          left: `-${padPct}`,
          top: `-${padPct}`,
          width: `${100 + STUDIO_PAD * 200}%`,
          height: `${100 + STUDIO_PAD * 200}%`,
        }}
      />
      <canvas ref={canvasRef} className="relative h-auto w-full" aria-label={alt} />
    </div>
  )
}
