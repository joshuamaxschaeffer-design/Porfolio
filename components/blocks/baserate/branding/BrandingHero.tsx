'use client'

import { motion, useInView, useReducedMotion } from 'motion/react'
import { useEffect, useRef, useState } from 'react'

/**
 * Branding hero — "Brand & Marketing". Matched to Figma 224:53188.
 *
 * Composition (one 3D scene):
 *  - White top split from the teal→blue gradient field on a GENTLE diagonal.
 *  - Devices are SD Studio renders: transparent webp frame sequences whose
 *    pose was solved against the Figma frame (silhouette match). They fly in
 *    and SETTLE at the exact Figma pose — played once on scroll-in. No CSS
 *    3D transforms here: the perspective is baked into the render.
 *  - No baked shadows in the frames — each device casts a CSS shadow with a
 *    PROGRESSIVE BLUR (sharper near contact, dissolving with distance), same
 *    stacked-masked-layers technique as EdgeFadeBlur elsewhere on the site.
 *  - App-icon chips rotate in slowly with extruded depth and STOP at their
 *    Figma pose. Colour orbs drift on slow multi-axis paths.
 */

const FRAME_COUNT = 120
const FPS = 30

function pad(n: number) {
  return String(n).padStart(4, '0')
}

/**
 * ONE global key light for every floating element (matches the device shadow
 * track: light high front-right → shadows fall slightly down-left, sitting
 * BEHIND the object rather than under it). Offsets/blur are proportional to
 * the element's size so every chip/orb reads as lit by the same source.
 */
const KEY_SHADOW = {
  x: -0.07, // offset, fraction of element size (negative = left)
  y: 0.09, //  fraction of element size (positive = down)
  scale: 1.04,
  color: 'rgba(8,20,44,0.32)',
  blur: (s: number) => Math.max(10, s * 0.13),
}

/** Once per load: does CanvasRenderingContext2D support .filter? Safari doesn't. */
let _ctxFilterOK: boolean | null = null
function ctxFilterSupported(): boolean {
  if (_ctxFilterOK !== null) return _ctxFilterOK
  try {
    const c = document.createElement('canvas')
    c.width = 24
    c.height = 24
    const x = c.getContext('2d')
    if (!x) return (_ctxFilterOK = false)
    x.filter = 'blur(4px)'
    if (!x.filter || x.filter === 'none') return (_ctxFilterOK = false)
    x.fillStyle = '#000'
    x.fillRect(10, 10, 4, 4)
    // if blur ran, alpha bleeds outside the filled rect
    _ctxFilterOK = x.getImageData(4, 12, 1, 1).data[3] > 0
  } catch {
    _ctxFilterOK = false
  }
  return _ctxFilterOK
}

/**
 * Gaussian-ish blur WITHOUT ctx.filter (the Safari path): chain bilinear
 * half-downscales then doubling upscales — every resample spreads energy, so
 * the chain approximates a Gaussian of ~`radius`px. Scratch canvases must be
 * at least as large as `src`.
 */
function drawBlurred(
  out: CanvasRenderingContext2D,
  src: HTMLCanvasElement,
  radius: number,
  scrA: HTMLCanvasElement,
  scrB: HTMLCanvasElement,
) {
  const W = src.width
  const H = src.height
  if (radius < 1.25) {
    out.drawImage(src, 0, 0)
    return
  }
  const steps = Math.max(1, Math.min(7, Math.round(Math.log2(radius))))
  let cur: HTMLCanvasElement = src
  let cw = W
  let ch = H
  let flip = false
  const next = () => {
    flip = !flip
    return flip ? scrA : scrB
  }
  for (let i = 0; i < steps; i++) {
    const nw = Math.max(1, Math.round(cw / 2))
    const nh = Math.max(1, Math.round(ch / 2))
    const dst = next()
    const dctx = dst.getContext('2d')!
    dctx.clearRect(0, 0, nw + 2, nh + 2)
    dctx.drawImage(cur, 0, 0, cw, ch, 0, 0, nw, nh)
    cur = dst
    cw = nw
    ch = nh
  }
  while (cw < W || ch < H) {
    const nw = Math.min(W, cw * 2)
    const nh = Math.min(H, ch * 2)
    const dst = next()
    const dctx = dst.getContext('2d')!
    dctx.clearRect(0, 0, nw + 2, nh + 2)
    dctx.drawImage(cur, 0, 0, cw, ch, 0, 0, nw, nh)
    cur = dst
    cw = nw
    ch = nh
  }
  out.drawImage(cur, 0, 0, cw, ch, 0, 0, W, H)
}

/**
 * Canvas frame-sequence player with a PHYSICALLY-DERIVED drop shadow.
 *
 * SD Studio exports a per-frame shadow track (shadow-v1.json): the device's
 * bbox corners cast along the key light onto the surface plane, reduced to
 * offset / scale / blur-near / blur-far / gradient direction / opacity in
 * frame pixels. The shadow canvas redraws the current frame's silhouette with
 * those parameters — three blur bands along the height gradient, so the parts
 * of the device farther from the surface cast a softer, lighter shadow,
 * exactly like a real 3D shadow. Falls back to a generic soft shadow until
 * the track loads.
 */
function DeviceCanvas({
  dir, className = '', delay = 0,
}: { dir: 'desktop' | 'phone'; className?: string; delay?: number }) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const shadowRef = useRef<HTMLCanvasElement>(null)
  const played = useRef(false)
  const trackRef = useRef<any>(null)

  // Shadow canvas oversizes the device by PAD on every side so blur can spill.
  const PAD = 0.3

  useEffect(() => {
    const canvas = canvasRef.current
    const shadow = shadowRef.current
    if (!canvas || !shadow) return
    const ctx = canvas.getContext('2d')
    const sctx = shadow.getContext('2d')
    if (!ctx || !sctx) return

    let raf = 0
    const base = `/baserate/branding/devices/${dir}/frames-v2/frame_`
    const imgs: HTMLImageElement[] = []
    const sil = document.createElement('canvas')
    const silCtx = sil.getContext('2d')!
    const tmp = document.createElement('canvas')
    const tmpCtx = tmp.getContext('2d')!
    const sharp = document.createElement('canvas') // pre-blur stamp (Safari path)
    const sharpCtx = sharp.getContext('2d')!
    const acc = document.createElement('canvas') // additive band accumulator
    const accCtx = acc.getContext('2d')!
    const scrA = document.createElement('canvas') // blur-chain scratch
    const scrB = document.createElement('canvas')

    // v2: physically calibrated against the SD Studio PCSS render — exact
    // affine shadow shape + blur/opacity that grow with each point's height
    // above the surface (σ(h), α(h) fitted to the studio). Falls back to v1.
    fetch(`/baserate/branding/devices/${dir}/shadow-v2.json`)
      .then((r) => (r.ok ? r.json() : null))
      .then((j) => {
        if (j?.version === 2) { trackRef.current = { v2: true, calib: j.calib, frames: j.frames } }
        else throw new Error('no v2')
      })
      .catch(() =>
        fetch(`/baserate/branding/devices/${dir}/shadow-v1.json`)
          .then((r) => (r.ok ? r.json() : null))
          .then((j) => { trackRef.current = j?.frames ? { v2: false, frames: j.frames } : null })
          .catch(() => {}),
      )

    /**
     * Banded shadow accumulator. Bands crossfade ADDITIVELY (gCO 'lighter' on
     * a single dark hue = alphas sum linearly), so adjacent feathered bands
     * interpolate blur/opacity smoothly. The old source-over stacking
     * compounded alpha where feathers overlapped — that's what read as the
     * shadow "randomly getting lighter and darker" across the desktop. Blur
     * goes through ctx.filter when supported, else the Safari-safe
     * down/upscale chain.
     */
    const bandedShadow = (
      stamp: (c: CanvasRenderingContext2D) => void,
      grad: { x0: number; y0: number; x1: number; y1: number },
      bands: number,
      blurAt: (t: number) => number,
      alphaAt: (t: number) => number,
    ) => {
      accCtx.clearRect(0, 0, acc.width, acc.height)
      const F = Math.min(0.45 / bands, 0.08)
      const s = (v: number) => Math.max(0, Math.min(1, v))
      for (let j = 0; j < bands; j++) {
        const t0 = j / bands
        const t1 = (j + 1) / bands
        const alpha = alphaAt((t0 + t1) / 2)
        if (alpha <= 0.004) continue
        const blur = Math.max(0.5, blurAt((t0 + t1) / 2))
        tmpCtx.clearRect(0, 0, tmp.width, tmp.height)
        if (ctxFilterSupported()) {
          tmpCtx.save()
          tmpCtx.filter = `blur(${blur.toFixed(1)}px)`
          stamp(tmpCtx)
          tmpCtx.restore()
        } else {
          sharpCtx.clearRect(0, 0, sharp.width, sharp.height)
          sharpCtx.save()
          stamp(sharpCtx)
          sharpCtx.restore()
          drawBlurred(tmpCtx, sharp, blur, scrA, scrB)
        }
        // band mask along the height gradient — SYMMETRIC feather so each
        // adjacent pair of ramps sums to exactly 1 (no seams)
        const g = tmpCtx.createLinearGradient(grad.x0, grad.y0, grad.x1, grad.y1)
        if (j === 0) g.addColorStop(0, 'rgba(0,0,0,1)')
        else {
          g.addColorStop(s(t0 - F), 'rgba(0,0,0,0)')
          g.addColorStop(s(t0 + F), 'rgba(0,0,0,1)')
        }
        if (j === bands - 1) g.addColorStop(1, 'rgba(0,0,0,1)')
        else {
          g.addColorStop(s(t1 - F), 'rgba(0,0,0,1)')
          g.addColorStop(s(t1 + F), 'rgba(0,0,0,0)')
        }
        tmpCtx.save()
        tmpCtx.globalCompositeOperation = 'destination-in'
        tmpCtx.fillStyle = g
        tmpCtx.fillRect(0, 0, tmp.width, tmp.height)
        tmpCtx.restore()
        accCtx.save()
        accCtx.globalCompositeOperation = 'lighter'
        accCtx.globalAlpha = alpha
        accCtx.drawImage(tmp, 0, 0)
        accCtx.restore()
      }
      sctx.drawImage(acc, 0, 0)
    }

    const drawShadow = (img: HTMLImageElement, frameIdx: number) => {
      const W = canvas.width, H = canvas.height
      const padX = Math.round(W * PAD), padY = Math.round(H * PAD)
      // dark silhouette of THIS frame
      sil.width = W; sil.height = H
      silCtx.clearRect(0, 0, W, H)
      silCtx.drawImage(img, 0, 0, W, H)
      silCtx.globalCompositeOperation = 'source-in'
      silCtx.fillStyle = '#07112b'
      silCtx.fillRect(0, 0, W, H)
      silCtx.globalCompositeOperation = 'source-over'
      sctx.clearRect(0, 0, shadow.width, shadow.height)
      const track = trackRef.current
      const fr = track?.frames?.[frameIdx]

      if (track?.v2 && fr) {
        // ── v2: studio-mirrored shadow ──
        // Shape: the silhouette warped by the per-frame affine (device-screen →
        // shadow-screen). Blur + opacity: banded along the height gradient
        // near→far corner with the studio-calibrated σ(h)/α(h), accumulated
        // additively so the gradient is seam-free.
        const { sigma_base_px: s0, sigma_per_h_px: s1, alpha_base: a0, alpha_per_h: a1 } = track.calib
        const [a, b, cc, dd, e, f] = fr.af
        const h0 = fr.h0, h1 = Math.max(fr.h1, h0 + 0.001)
        const hAt = (t: number) => h0 + (h1 - h0) * t
        bandedShadow(
          (c) => { c.setTransform(a, b, cc, dd, e + padX, f + padY); c.drawImage(sil, 0, 0) },
          { x0: fr.pn[0] + padX, y0: fr.pn[1] + padY, x1: fr.pf[0] + padX, y1: fr.pf[1] + padY },
          6,
          (t) => s0 + s1 * hAt(t),
          (t) => Math.max(0, a0 + a1 * hAt(t)),
        )
        return
      }

      if (fr) {
        // ── track-driven: place silhouette at the projected shadow position,
        //    blur banded along the height gradient (near=sharp, far=soft) ──
        const cx = padX + fr.dcx + fr.dx
        const cy = padY + fr.dcy + fr.dy
        const ox = cx - fr.dcx * fr.sx
        const oy = cy - fr.dcy * fr.sy
        const rad = (fr.ang * Math.PI) / 180
        const dirx = Math.cos(rad), diry = Math.sin(rad)
        const ext = (Math.abs(dirx) * fr.dw * fr.sx + Math.abs(diry) * fr.dh * fr.sy) / 2 + 4
        bandedShadow(
          (c) => c.drawImage(sil, ox, oy, W * fr.sx, H * fr.sy),
          { x0: cx - dirx * ext, y0: cy - diry * ext, x1: cx + dirx * ext, y1: cy + diry * ext },
          4,
          (t) => fr.bn + (fr.bf - fr.bn) * t,
          () => fr.a,
        )
      } else {
        // ── fallback: generic 3-pass soft shadow ──
        const unit = Math.max(6, W * 0.012)
        const passes = [
          { blur: unit * 1.0, alpha: 0.3, dx: unit * 0.7, dy: unit * 1.1, s: 1.0 },
          { blur: unit * 2.4, alpha: 0.22, dx: unit * 1.6, dy: unit * 2.4, s: 1.02 },
          { blur: unit * 4.6, alpha: 0.15, dx: unit * 2.8, dy: unit * 4.2, s: 1.05 },
        ]
        for (const p of passes) {
          const dw = W * p.s, dh = H * p.s
          const ox2 = padX + p.dx - (dw - W) / 2
          const oy2 = padY + p.dy - (dh - H) / 2
          tmpCtx.clearRect(0, 0, tmp.width, tmp.height)
          if (ctxFilterSupported()) {
            tmpCtx.save()
            tmpCtx.filter = `blur(${p.blur.toFixed(1)}px)`
            tmpCtx.drawImage(sil, ox2, oy2, dw, dh)
            tmpCtx.restore()
          } else {
            sharpCtx.clearRect(0, 0, sharp.width, sharp.height)
            sharpCtx.drawImage(sil, ox2, oy2, dw, dh)
            drawBlurred(tmpCtx, sharp, p.blur, scrA, scrB)
          }
          sctx.save()
          sctx.globalAlpha = p.alpha
          sctx.drawImage(tmp, 0, 0)
          sctx.restore()
        }
      }
    }

    const drawFrame = (i: number) => {
      const img = imgs[i]
      if (img && img.complete && img.naturalWidth) {
        ctx.clearRect(0, 0, canvas.width, canvas.height)
        ctx.drawImage(img, 0, 0, canvas.width, canvas.height)
        drawShadow(img, i)
      }
    }

    const first = new Image()
    first.onload = () => {
      canvas.width = first.naturalWidth
      canvas.height = first.naturalHeight
      shadow.width = Math.round(first.naturalWidth * (1 + PAD * 2))
      shadow.height = Math.round(first.naturalHeight * (1 + PAD * 2))
      for (const c of [tmp, sharp, acc, scrA, scrB]) {
        c.width = shadow.width
        c.height = shadow.height
      }
      ctx.clearRect(0, 0, canvas.width, canvas.height)
      ctx.drawImage(first, 0, 0)
      drawShadow(first, 0)
    }
    first.src = `${base}0000.webp`

    for (let i = 0; i < FRAME_COUNT; i++) {
      const img = new Image()
      img.src = `${base}${pad(i)}.webp`
      imgs[i] = img
    }

    const play = () => {
      const start = performance.now()
      const tick = (now: number) => {
        const elapsed = (now - start) / 1000
        const frame = Math.min(FRAME_COUNT - 1, Math.floor(elapsed * FPS))
        drawFrame(frame)
        if (frame < FRAME_COUNT - 1) raf = requestAnimationFrame(tick)
      }
      raf = requestAnimationFrame(tick)
    }

    const io = new IntersectionObserver(
      (entries) => {
        for (const e of entries) {
          if (e.isIntersecting && !played.current) {
            played.current = true
            setTimeout(play, delay)
          }
        }
      },
      { threshold: 0.3 },
    )
    io.observe(canvas)

    return () => { io.disconnect(); cancelAnimationFrame(raf) }
  }, [dir, delay])

  const padPct = `${(PAD * 100).toFixed(0)}%`
  return (
    <div className={`relative ${className}`}>
      <canvas
        ref={shadowRef}
        aria-hidden
        className="pointer-events-none absolute"
        style={{
          left: `-${padPct}`, top: `-${padPct}`,
          width: `${100 + PAD * 200}%`, height: `${100 + PAD * 200}%`,
        }}
      />
      <canvas ref={canvasRef} className="relative h-auto w-full" aria-label={`${dir} device`} />
    </div>
  )
}

/**
 * App-icon chip: extruded 3D tile that rotates in ONCE and settles at its
 * Figma pose (rotation stops exactly where the mockup has it). A gentle
 * float continues on the wrapper so it still feels alive.
 */
function ExtrudedChip({
  src, alt, size, endX, endY, endZ, depth = 12, dur = 2.8, delay = 0, reduce, inView, className = '',
}: {
  src: string; alt: string; size: number
  endX: number; endY: number; endZ: number
  depth?: number; dur?: number; delay?: number
  reduce: boolean | null; inView: boolean; className?: string
}) {
  const layers = Array.from({ length: depth }, (_, i) => i)
  return (
    <div className={`pointer-events-none absolute ${className}`} style={{ width: size, height: size }}>
      <motion.div
        className="relative h-full w-full"
        initial={false}
        animate={reduce ? {} : { y: [0, -8, 0] }}
        transition={{ duration: 7.5, repeat: Infinity, ease: 'easeInOut', delay }}
      >
        {/* cast shadow — same tile shape (rounded square at the settle pose),
            offset along the global key light so it sits BEHIND the chip.
            CSS filter blur (not ctx.filter) — works in Safari. */}
        <div
          aria-hidden
          className="absolute inset-0"
          style={{
            transform: `translate(${(KEY_SHADOW.x * size).toFixed(1)}px, ${(KEY_SHADOW.y * size).toFixed(1)}px) rotateX(${endX}deg) rotateZ(${endZ}deg) scale(${KEY_SHADOW.scale})`,
            borderRadius: '20%',
            background: KEY_SHADOW.color,
            filter: `blur(${KEY_SHADOW.blur(size).toFixed(1)}px)`,
          }}
        />
        <div className="h-full w-full" style={{ perspective: 900 }}>
          <motion.div
            className="relative h-full w-full"
            style={{ transformStyle: 'preserve-3d', rotateX: endX, rotateZ: endZ }}
            initial={{ rotateY: endY - 360 }}
            animate={reduce ? { rotateY: endY } : (inView ? { rotateY: endY } : { rotateY: endY - 360 })}
            transition={{ duration: dur, ease: [0.16, 0.8, 0.3, 1], delay }}
          >
            {layers.map((i) => (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                key={i}
                src={src}
                alt={i === depth - 1 ? alt : ''}
                draggable={false}
                className="absolute inset-0 h-full w-full"
                style={{
                  transform: `translateZ(${(i - (depth - 1) / 2) * 1.6}px)`,
                  filter: i === depth - 1 ? 'none' : 'brightness(0.6)',
                  borderRadius: '20%',
                }}
              />
            ))}
          </motion.div>
        </div>
      </motion.div>
    </div>
  )
}

/** Soft colour orb on a slow multi-axis drift, casting a soft shadow. */
function Orb({
  className = '', from, to, size, dur = 16, delay = 0, reduce,
}: {
  className?: string; from: string; to: string; size: number; dur?: number; delay?: number; reduce: boolean | null
}) {
  return (
    <div className={`pointer-events-none absolute ${className}`} style={{ width: size, height: size }}>
      <motion.div
        className="relative h-full w-full"
        initial={false}
        animate={reduce ? {} : {
          x: [0, size * 0.34, -size * 0.18, size * 0.1, 0],
          y: [0, -size * 0.42, -size * 0.12, -size * 0.5, 0],
          scale: [1, 1.04, 0.985, 1.03, 1],
        }}
        transition={{ duration: dur, repeat: Infinity, ease: 'easeInOut', delay, times: [0, 0.3, 0.55, 0.8, 1] }}
      >
        {/* cast shadow — circle matching the orb, offset along the global key
            light so it peeks out BEHIND the sphere (same blur/direction/
            darkness rules as the chips). */}
        <div
          aria-hidden
          className="absolute inset-0 rounded-full"
          style={{
            transform: `translate(${(KEY_SHADOW.x * size).toFixed(1)}px, ${(KEY_SHADOW.y * size).toFixed(1)}px) scale(${KEY_SHADOW.scale})`,
            background: KEY_SHADOW.color,
            filter: `blur(${KEY_SHADOW.blur(size).toFixed(1)}px)`,
          }}
        />
        <div
          className="absolute inset-0 rounded-full"
          style={{
            background: `radial-gradient(circle at 32% 27%, ${from}, ${to} 72%)`,
            boxShadow:
              'inset 0 -8px 16px rgba(0,0,0,0.25), inset 0 8px 14px rgba(255,255,255,0.35)',
          }}
        />
      </motion.div>
    </div>
  )
}

export function BrandingHero() {
  const reduce = useReducedMotion()
  const [mounted, setMounted] = useState(false)
  const stageRef = useRef<HTMLDivElement>(null)
  const inView = useInView(stageRef, { once: true, amount: 0.25 })
  useEffect(() => setMounted(true), [])

  return (
    <section ref={stageRef} className="relative overflow-hidden">
      {/* White top over the gradient field — gentle diagonal, higher on the
          right (Figma 243:54723 boundary mapped to the new section height). */}
      <div className="absolute inset-0 bg-white [clip-path:polygon(0_0,100%_0,100%_57%,0_78%)] md:[clip-path:polygon(0_0,100%_0,100%_35.5%,0_50%)]" />

      {/* STAGE — a centered max-w-[1443px] frame mirroring the Figma artboard
          (1443×893). Every md+ percentage below is a literal Figma coordinate,
          so the whole composition clusters around the frame's center instead
          of spreading to the viewport edges on wide screens. */}
      <div className="relative mx-auto w-full max-w-[1443px]">
        {/* height: phone-friendly tall block on mobile, Figma aspect at md+ */}
        <div className="h-[124vw] max-h-[700px] min-h-[320px] md:h-auto md:max-h-none md:aspect-[1443/893]" />

        {/* Heading — SOLID white card stacked above the whole scene, so
            devices/chips/orbs can pass behind it without colliding with the
            text (per Figma: white fill, hairline border, soft lift). */}
        <div className="absolute left-1/2 top-[3%] z-40 w-[92%] -translate-x-1/2 rounded-[10px] border border-[#e7e9f1] bg-white px-5 py-6 text-center shadow-[0_24px_48px_-24px_rgba(10,23,48,0.28)] md:top-[15.7%] md:w-[41.3%] md:px-8 md:py-[34px]">
          <h2 className="text-[30px] font-semibold uppercase leading-none tracking-tight text-[var(--br-ink)] md:text-[44px]">
            Brand &amp; Marketing
          </h2>
          <p className="mt-3 text-[16px] text-[#2a3050] md:text-[21px]">
            Ran in tandem with product implementation.
          </p>
        </div>

        {/* ——— Floating scene (inside the 1443 frame) ——— */}
        {mounted && (
          <div className="pointer-events-none absolute inset-0">
            {/* PHONE — render carries the Figma pose; silhouette drop-shadow lives in the canvas */}
            <div className="absolute left-[0%] top-[26%] z-10 w-[42%] md:left-[11%] md:top-[18.5%] md:w-[18%]">
              <DeviceCanvas dir="phone" delay={120} className="w-full" />
            </div>

            {/* DESKTOP — pulled fully inside the frame, toward the center */}
            <div className="absolute right-[-7%] top-[27%] z-10 w-[58%] md:left-[63.5%] md:right-auto md:top-[17%] md:w-[33%]">
              <DeviceCanvas dir="desktop" delay={0} className="w-full" />
            </div>

            {/* 3D extruded chips — rotate in once, SETTLE at the Figma pose.
                md positions are literal Figma 243:54723 coordinates (box ÷ 1443×893). */}
            <ExtrudedChip
              src="/baserate/branding/logos/journalytic-app.svg"
              alt="Journalytic"
              reduce={reduce}
              inView={inView}
              size={124}
              endX={7}
              endY={16}
              endZ={-9}
              className="left-[36%] top-[40%] z-[15] scale-[0.55] md:left-[21.5%] md:top-[4.5%] md:scale-100"
              dur={2.8}
            />
            <ExtrudedChip
              src="/baserate/branding/logos/baserate-app.svg"
              alt="Baserate"
              reduce={reduce}
              inView={inView}
              size={94}
              endX={5}
              endY={-20}
              endZ={10}
              className="left-[7%] top-[66%] z-[15] scale-[0.55] md:left-[58%] md:top-[38.5%] md:scale-100"
              dur={3.2}
              delay={0.25}
            />

            {/* Colour orbs on slow drifts — Figma spots; the navy one is moved
                LEFT of the desktop so it floats in clean space */}
            <Orb reduce={reduce} className="left-[10%] top-[32%] z-[15] scale-75 md:left-[15.1%] md:top-[7.5%] md:scale-100" from="#e3cfa0" to="#a07d20" size={30} dur={15} />
            <Orb reduce={reduce} className="left-[32.5%] top-[53%] z-[15] scale-75 md:left-[33.2%] md:top-[36.4%] md:scale-100" from="#4f9fcb" to="#1c5e8c" size={46} dur={18} delay={1.2} />
            <Orb reduce={reduce} className="left-[69.5%] top-[26%] z-[15] scale-75 md:left-[69.6%] md:top-[9%] md:scale-100" from="#2a2f3a" to="#05070d" size={46} dur={17} delay={2.2} />
            <Orb reduce={reduce} className="left-[64%] top-[64%] z-[15] scale-75 md:left-[55.5%] md:top-[57.5%] md:scale-100" from="#1e63c0" to="#06337a" size={46} dur={14} delay={0.6} />
          </div>
        )}
      </div>

      {/* B2C label on the blue */}
      <div className="relative z-30 px-6 pb-16 text-center md:pb-[88px]">
        <h3 className="text-[19px] font-semibold uppercase tracking-[0.05em] text-white md:text-[24px]">
          B2C Brand Exploration
        </h3>
        <p className="mx-auto mt-3 max-w-[560px] text-[15px] leading-relaxed text-white/90 md:text-[17px]">
          The B2C brand Journalytic was finished first, with consumer focussed branding and messaging.
        </p>
      </div>
    </section>
  )
}
