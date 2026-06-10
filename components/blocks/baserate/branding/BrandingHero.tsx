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
        // shadow-screen, solved from the device's corners cast along the key
        // light onto the surface). Blur + opacity: banded along the height
        // gradient from the corner CLOSEST to the surface (sharp, dense) to
        // the FURTHEST (soft, faint), using σ(h)/α(h) calibrated against the
        // actual SD Studio PCSS render.
        const { sigma_base_px: s0, sigma_per_h_px: s1, alpha_base: a0, alpha_per_h: a1 } = track.calib
        const [a, b, cc, dd, e, f] = fr.af
        const pnx = fr.pn[0] + padX, pny = fr.pn[1] + padY
        const pfx = fr.pf[0] + padX, pfy = fr.pf[1] + padY
        const h0 = fr.h0, h1 = Math.max(fr.h1, h0 + 0.001)
        const BANDS = 5, F = 0.12
        tmp.width = shadow.width; tmp.height = shadow.height
        for (let j = 0; j < BANDS; j++) {
          const t0 = j / BANDS, t1 = (j + 1) / BANDS
          const hMid = h0 + (h1 - h0) * ((t0 + t1) / 2)
          const alpha = Math.max(0, a0 + a1 * hMid)
          if (alpha <= 0.004) continue
          const blur = Math.max(0.5, s0 + s1 * hMid)
          tmpCtx.clearRect(0, 0, tmp.width, tmp.height)
          tmpCtx.save()
          tmpCtx.filter = `blur(${blur.toFixed(1)}px)`
          tmpCtx.setTransform(a, b, cc, dd, e + padX, f + padY)
          tmpCtx.drawImage(sil, 0, 0)
          tmpCtx.restore()
          // band mask along the height gradient (near → far corner)
          const g = tmpCtx.createLinearGradient(pnx, pny, pfx, pfy)
          const stop = (v: number) => Math.max(0, Math.min(1, v))
          if (j === 0) { g.addColorStop(0, 'rgba(0,0,0,1)'); g.addColorStop(stop(t1), 'rgba(0,0,0,1)'); g.addColorStop(stop(t1 + F), 'rgba(0,0,0,0)') }
          else if (j === BANDS - 1) { g.addColorStop(stop(t0 - F), 'rgba(0,0,0,0)'); g.addColorStop(stop(t0), 'rgba(0,0,0,1)'); g.addColorStop(1, 'rgba(0,0,0,1)') }
          else { g.addColorStop(stop(t0 - F), 'rgba(0,0,0,0)'); g.addColorStop(stop(t0), 'rgba(0,0,0,1)'); g.addColorStop(stop(t1), 'rgba(0,0,0,1)'); g.addColorStop(stop(t1 + F), 'rgba(0,0,0,0)') }
          tmpCtx.save()
          tmpCtx.globalCompositeOperation = 'destination-in'
          tmpCtx.fillStyle = g
          tmpCtx.fillRect(0, 0, tmp.width, tmp.height)
          tmpCtx.restore()
          sctx.save()
          sctx.globalAlpha = alpha
          sctx.drawImage(tmp, 0, 0)
          sctx.restore()
        }
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
        const BANDS = 3, F = 0.14
        tmp.width = shadow.width; tmp.height = shadow.height
        for (let j = 0; j < BANDS; j++) {
          const t0 = j / BANDS, t1 = (j + 1) / BANDS
          const blur = fr.bn + (fr.bf - fr.bn) * ((t0 + t1) / 2)
          tmpCtx.clearRect(0, 0, tmp.width, tmp.height)
          tmpCtx.save()
          tmpCtx.filter = `blur(${blur.toFixed(1)}px)`
          tmpCtx.drawImage(sil, ox, oy, W * fr.sx, H * fr.sy)
          tmpCtx.restore()
          // band mask along the gradient direction
          const g = tmpCtx.createLinearGradient(cx - dirx * ext, cy - diry * ext, cx + dirx * ext, cy + diry * ext)
          const stop = (v: number) => Math.max(0, Math.min(1, v))
          if (j === 0) { g.addColorStop(0, 'rgba(0,0,0,1)'); g.addColorStop(stop(t1), 'rgba(0,0,0,1)'); g.addColorStop(stop(t1 + F), 'rgba(0,0,0,0)') }
          else if (j === BANDS - 1) { g.addColorStop(stop(t0 - F), 'rgba(0,0,0,0)'); g.addColorStop(stop(t0), 'rgba(0,0,0,1)'); g.addColorStop(1, 'rgba(0,0,0,1)') }
          else { g.addColorStop(stop(t0 - F), 'rgba(0,0,0,0)'); g.addColorStop(stop(t0), 'rgba(0,0,0,1)'); g.addColorStop(stop(t1), 'rgba(0,0,0,1)'); g.addColorStop(stop(t1 + F), 'rgba(0,0,0,0)') }
          tmpCtx.save()
          tmpCtx.globalCompositeOperation = 'destination-in'
          tmpCtx.fillStyle = g
          tmpCtx.fillRect(0, 0, tmp.width, tmp.height)
          tmpCtx.restore()
          sctx.save()
          sctx.globalAlpha = fr.a
          sctx.drawImage(tmp, 0, 0)
          sctx.restore()
        }
      } else {
        // ── fallback: generic 3-pass soft shadow ──
        const unit = Math.max(6, W * 0.012)
        const passes = [
          { blur: unit * 1.0, alpha: 0.3, dx: unit * 0.7, dy: unit * 1.1, s: 1.0 },
          { blur: unit * 2.4, alpha: 0.22, dx: unit * 1.6, dy: unit * 2.4, s: 1.02 },
          { blur: unit * 4.6, alpha: 0.15, dx: unit * 2.8, dy: unit * 4.2, s: 1.05 },
        ]
        for (const p of passes) {
          sctx.save()
          sctx.filter = `blur(${p.blur.toFixed(1)}px)`
          sctx.globalAlpha = p.alpha
          const dw = W * p.s, dh = H * p.s
          sctx.drawImage(sil, padX + p.dx - (dw - W) / 2, padY + p.dy - (dh - H) / 2, dw, dh)
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
        className="h-full w-full"
        initial={false}
        animate={reduce ? {} : { y: [0, -8, 0] }}
        transition={{ duration: 7.5, repeat: Infinity, ease: 'easeInOut', delay }}
      >
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
      {/* contact shadow cast onto the field below */}
      <div className="absolute left-1/2 top-[112%] h-[16%] w-[78%] -translate-x-1/2 rounded-full bg-[#081a33]/30 blur-md" />
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
        className="h-full w-full rounded-full"
        style={{
          background: `radial-gradient(circle at 32% 27%, ${from}, ${to} 72%)`,
          boxShadow:
            '0 30px 45px -12px rgba(7,18,40,0.4), inset 0 -8px 16px rgba(0,0,0,0.25), inset 0 8px 14px rgba(255,255,255,0.35)',
        }}
        initial={false}
        animate={reduce ? {} : {
          x: [0, size * 0.34, -size * 0.18, size * 0.1, 0],
          y: [0, -size * 0.42, -size * 0.12, -size * 0.5, 0],
          scale: [1, 1.04, 0.985, 1.03, 1],
        }}
        transition={{ duration: dur, repeat: Infinity, ease: 'easeInOut', delay, times: [0, 0.3, 0.55, 0.8, 1] }}
      />
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
      {/* White top over the gradient field — gentle diagonal, higher on the right */}
      <div
        className="absolute inset-0 bg-white"
        style={{ clipPath: 'polygon(0 0, 100% 0, 100% 47%, 0 65%)' }}
      />

      {/* Heading */}
      <div className="relative z-30 px-6 pt-16 text-center md:pt-[132px]">
        <h2 className="text-[30px] font-semibold uppercase leading-none tracking-tight text-[var(--br-ink)] md:text-[44px]">
          Brand &amp; Marketing
        </h2>
        <p className="mt-3 text-[16px] text-[#2a3050] md:text-[21px]">
          Ran in tandem with product implementation.
        </p>
      </div>

      {/* Stage spacer — the floaters live in the absolute layer */}
      <div className="h-[66vw] max-h-[460px] min-h-[230px] md:h-[clamp(340px,30vw,470px)]" />

      {/* B2C label on the blue */}
      <div className="relative z-30 px-6 pb-16 text-center md:pb-[88px]">
        <h3 className="text-[19px] font-semibold uppercase tracking-[0.05em] text-white md:text-[24px]">
          B2C Brand Exploration
        </h3>
        <p className="mx-auto mt-3 max-w-[560px] text-[15px] leading-relaxed text-white/90 md:text-[17px]">
          The B2C brand Journalytic was finished first, with consumer focussed branding and messaging.
        </p>
      </div>

      {/* ——— Floating scene ——— */}
      {mounted && (
        <div className="pointer-events-none absolute inset-0">
          {/* PHONE — render carries the Figma pose; silhouette drop-shadow lives in the canvas */}
          <div className="absolute left-[0%] top-[14%] z-10 w-[42%] md:left-[5.5%] md:-top-[5%] md:w-[24%]">
            <DeviceCanvas dir="phone" delay={120} className="w-full" />
          </div>

          {/* DESKTOP — render carries the Figma pose; silhouette drop-shadow lives in the canvas */}
          <div className="absolute right-[-7%] top-[15%] z-10 w-[58%] md:right-[-4%] md:-top-[8%] md:w-[46%]">
            <DeviceCanvas dir="desktop" delay={0} className="w-full" />
          </div>

          {/* 3D extruded chips — rotate in once, SETTLE at the Figma pose */}
          <ExtrudedChip
            src="/baserate/branding/logos/journalytic-app.svg"
            alt="Journalytic"
            reduce={reduce}
            inView={inView}
            size={92}
            endX={7}
            endY={16}
            endZ={-9}
            className="left-[36%] top-[27%] z-[15] scale-[0.55] md:left-[26%] md:top-[2%] md:scale-100"
            dur={2.8}
          />
          <ExtrudedChip
            src="/baserate/branding/logos/baserate-app.svg"
            alt="Baserate"
            reduce={reduce}
            inView={inView}
            size={116}
            endX={5}
            endY={-20}
            endZ={10}
            className="left-[8%] top-[48%] z-[15] scale-[0.55] md:left-[10.5%] md:top-[71%] md:scale-100"
            dur={3.2}
            delay={0.25}
          />

          {/* Shadow-casting colour orbs on slow drifts */}
          <Orb reduce={reduce} className="left-[10%] top-[20%] z-[15] scale-75 md:left-[14%] md:top-[7%] md:scale-100" from="#e3cfa0" to="#a07d20" size={44} dur={15} />
          <Orb reduce={reduce} className="left-[32.5%] top-[41%] z-[15] scale-75 md:scale-100" from="#4f9fcb" to="#1c5e8c" size={56} dur={18} delay={1.2} />
          <Orb reduce={reduce} className="left-[69.5%] top-[14%] z-[15] scale-75 md:top-[9%] md:scale-100" from="#2a2f3a" to="#05070d" size={50} dur={17} delay={2.2} />
          <Orb reduce={reduce} className="left-[80%] top-[52%] z-[15] scale-75 md:left-[78.5%] md:top-[64%] md:scale-100" from="#1e63c0" to="#06337a" size={64} dur={14} delay={0.6} />
        </div>
      )}
    </section>
  )
}
