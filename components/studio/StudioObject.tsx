'use client'

import { type MotionValue } from 'motion/react'
import { useEffect, useRef } from 'react'
import { STUDIO_PAD, createShadowPipeline, createSvgShadow, type ShadowTrack } from './studioShadow'

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
 *
 * SCRUB MODE: pass `scrub` (a 0→1 MotionValue, e.g. section scroll progress)
 * and the sequence becomes scroll-scrubbed instead of play-once — frame index
 * = round(scrub · (frameCount−1)), bidirectional, redrawn ONLY when the index
 * changes (no per-frame canvas churn when idle). Frames preload eagerly so the
 * scrub never misses. Reduced-motion settles on the last frame.
 */
export function StudioObject({
  base,
  frameCount = 1,
  fps = 30,
  delay = 0,
  className = '',
  alt = '',
  scrub,
  staticFrame,
  shadowMode = 'canvas',
}: {
  base: string
  frameCount?: number
  fps?: number
  delay?: number
  className?: string
  alt?: string
  scrub?: MotionValue<number>
  /** Render exactly ONE frame (its image + shadow) once, then nothing else —
   *  no sequence preload, no scroll subscription, no per-scroll canvas work.
   *  Use the settled-pose index for a fast static hero. -1 = last frame. */
  staticFrame?: number
  /** Shadow renderer: 'canvas' (default, the multi-band recompose) or 'svg'
   *  (v3 — a cheap blurred gradient polygon; far lighter, animatable). */
  shadowMode?: 'canvas' | 'svg'
}) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const shadowRef = useRef<HTMLCanvasElement>(null)
  const svgRef = useRef<SVGSVGElement>(null)
  const played = useRef(false)
  const trackRef = useRef<ShadowTrack>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    const shadow = shadowRef.current
    if (!canvas || !shadow) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    const isSeq = frameCount > 1
    const useSvg = shadowMode === 'svg' && !!svgRef.current
    const pipe = createShadowPipeline(canvas, shadow)
    const svgShadow = useSvg ? createSvgShadow(svgRef.current!) : null
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
    const drawFrame = (i: number, withShadow = true) => {
      const img = imgs[i]
      if (img && img.complete && img.naturalWidth) {
        lastDrawn = i
        ctx.clearRect(0, 0, canvas.width, canvas.height)
        ctx.drawImage(img, 0, 0, canvas.width, canvas.height)
        if (withShadow) {
          // v3 SVG shadow is cheap enough to update every frame; the canvas
          // recomposite (multi-band blur warp) is the expensive path skipped
          // during scrub and refreshed lazily.
          if (svgShadow) svgShadow.draw(i, trackRef.current)
          else pipe.draw(img, i, trackRef.current)
        }
      }
    }
    // re-render the current frame when the shadow track arrives late
    const redrawCurrent = () => {
      if (!disposed && canvas.width) drawFrame(lastDrawn)
    }

    // Static mode draws its own single frame below — don't preload/draw frame 0
    // first (avoids a flash of the start pose before the settled frame).
    if (staticFrame === undefined) {
      const first = new Image()
      first.onload = () => {
        if (disposed) return
        pipe.size(first.naturalWidth, first.naturalHeight)
        svgShadow?.size(first.naturalWidth, first.naturalHeight)
        imgs[0] = first
        drawFrame(0)
      }
      first.src = srcFor(0)
    }

    if (!isSeq) {
      return () => {
        disposed = true
      }
    }

    // ── STATIC FRAME: render ONE frame once (image + shadow), no scroll work ──
    if (staticFrame !== undefined) {
      const idx = staticFrame < 0 ? frameCount - 1 : Math.min(frameCount - 1, staticFrame)
      const img = new Image()
      img.decoding = 'async'
      img.onload = () => {
        if (disposed) return
        if (!canvas.width) pipe.size(img.naturalWidth, img.naturalHeight)
        svgShadow?.size(img.naturalWidth, img.naturalHeight)
        imgs[idx] = img
        drawFrame(idx, true)
      }
      img.src = srcFor(idx)
      return () => { disposed = true }
    }

    // ── SCRUB MODE: frame index driven by the `scrub` MotionValue ──
    if (scrub) {
      const reduce = window.matchMedia?.('(prefers-reduced-motion: reduce)').matches
      // eager preload (8-way) — small 20-frame sets, want them all ready fast
      let nextIdx = 0
      let loaded = 0
      let curIdx = -1
      let shadowTimer = 0
      const CONC = 8
      const clampIdx = (p: number) =>
        Math.max(0, Math.min(frameCount - 1, Math.round(p * (frameCount - 1))))
      // The cast shadow barely changes across this short scrub range (devices
      // tilt 1/3, chips spin 45°), but recompositing it (multi-band blur warp)
      // every scrub frame across 4 objects tanked the page to ~3fps. So during
      // scroll we redraw ONLY the cheap device image; the shadow is refreshed
      // lazily ~120ms after scrubbing settles. Result: smooth scroll, shadow
      // still correct at rest.
      const refreshShadowSoon = () => {
        if (reduce) return
        clearTimeout(shadowTimer)
        shadowTimer = window.setTimeout(() => { if (!disposed) drawFrame(curIdx, true) }, 120)
      }
      const renderAt = (p: number) => {
        if (disposed) return
        const i = reduce ? frameCount - 1 : clampIdx(p)
        if (i === curIdx) return // redraw only on index change
        if (imgs[i] && imgs[i].complete) {
          curIdx = i
          drawFrame(i, false) // cheap: image only, no shadow recomposite
          refreshShadowSoon()
        }
      }
      const loadWorker = () => {
        if (disposed) return
        const i = nextIdx++
        if (i >= frameCount) return
        const img = new Image()
        img.decoding = 'async'
        const done = () => {
          imgs[i] = img
          loaded++
          // once enough frames exist, reflect the current scrub position
          renderAt(scrub.get())
          if (loaded >= frameCount) { if (!disposed) drawFrame(curIdx < 0 ? frameCount - 1 : curIdx, true) }
          else loadWorker()
        }
        img.onload = done
        img.onerror = done
        img.src = srcFor(i)
      }
      for (let w = 0; w < CONC; w++) loadWorker()
      // draw the settled frame immediately for reduced-motion / first paint
      const unsub = reduce ? undefined : scrub.on('change', renderAt)
      renderAt(scrub.get())
      return () => {
        disposed = true
        clearTimeout(shadowTimer)
        unsub?.()
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
  }, [base, frameCount, fps, delay, scrub, staticFrame, shadowMode])

  const padPct = `${(STUDIO_PAD * 100).toFixed(0)}%`
  const padBox = {
    left: `-${padPct}`,
    top: `-${padPct}`,
    width: `${100 + STUDIO_PAD * 200}%`,
    height: `${100 + STUDIO_PAD * 200}%`,
  } as const
  const svgMode = shadowMode === 'svg'
  return (
    <div className={`relative ${className}`}>
      {/* v3 SVG shadow overlay (only when shadowMode==='svg'); same padded box
          as the canvas shadow so geometry matches. */}
      <svg
        ref={svgRef}
        aria-hidden
        className="pointer-events-none absolute"
        style={{ ...padBox, display: svgMode ? 'block' : 'none', overflow: 'visible' }}
      />
      {/* canvas shadow (default renderer); hidden in svg mode */}
      <canvas
        ref={shadowRef}
        aria-hidden
        className="pointer-events-none absolute"
        style={{ ...padBox, display: svgMode ? 'none' : 'block' }}
      />
      <canvas ref={canvasRef} className="relative h-auto w-full" aria-label={alt} />
    </div>
  )
}
