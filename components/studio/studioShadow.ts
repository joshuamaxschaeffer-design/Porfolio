/**
 * Shared SD Studio shadow core — renders the studio-calibrated, physically
 * projected shadows for ANY studio export (device sequences, icon/shape/SVG
 * stills) on a padded companion canvas.
 *
 * Three data tiers, best available wins:
 *  · shadow-v2.json — per-frame affine (object-screen → shadow-screen) +
 *    σ(h)/α(h) calibrated against the studio PCSS render. Exact shape,
 *    height-graded blur/opacity.
 *  · shadow-v1.json — offset/scale/blur-gradient track (legacy exports).
 *  · none — generic 3-pass soft shadow.
 *
 * Cross-browser: blur uses ctx.filter where supported; Safari (no canvas
 * filter) gets a bilinear down/upscale chain. Bands accumulate ADDITIVELY
 * (gCO 'lighter') with symmetric feathers so crossfades sum to exactly 1 —
 * no seams. The shadow canvas runs at SHADOW_RES internal resolution
 * (blurry content → ~9x cheaper, indistinguishable after CSS upscale).
 */

export const STUDIO_PAD = 0.3
export const SHADOW_RES = 0.34

export type ShadowTrack =
  | { v2: true; calib: { sigma_base_px: number; sigma_per_h_px: number; alpha_base: number; alpha_per_h: number }; frames: any[] }
  | { v2: false; frames: any[] }
  | null

/** Once per load: does CanvasRenderingContext2D support .filter? Safari doesn't. */
let _ctxFilterOK: boolean | null = null
export function ctxFilterSupported(): boolean {
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
 * the chain approximates a Gaussian of ~`radius`px.
 */
export function drawBlurred(
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
 * Build a shadow pipeline bound to an object canvas + its padded shadow
 * canvas. Call `size(firstImage)` once dimensions are known, then
 * `draw(img, frameIdx, track)` per frame.
 */
export function createShadowPipeline(canvas: HTMLCanvasElement, shadow: HTMLCanvasElement) {
  const sctx = shadow.getContext('2d')!
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

  const size = (firstW: number, firstH: number) => {
    canvas.width = firstW
    canvas.height = firstH
    shadow.width = Math.round(firstW * (1 + STUDIO_PAD * 2) * SHADOW_RES)
    shadow.height = Math.round(firstH * (1 + STUDIO_PAD * 2) * SHADOW_RES)
    for (const c of [tmp, sharp, acc, scrA, scrB]) {
      c.width = shadow.width
      c.height = shadow.height
    }
  }

  /** Banded shadow accumulator — additive crossfade, seam-free. */
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

  const draw = (img: HTMLImageElement | HTMLCanvasElement | ImageBitmap, frameIdx: number, track: ShadowTrack) => {
    const W = canvas.width
    const H = canvas.height
    const padX = Math.round(W * STUDIO_PAD)
    const padY = Math.round(H * STUDIO_PAD)
    const k = W > 0 ? shadow.width / (W * (1 + STUDIO_PAD * 2)) : SHADOW_RES
    // dark silhouette of THIS frame
    sil.width = W
    sil.height = H
    silCtx.clearRect(0, 0, W, H)
    silCtx.drawImage(img, 0, 0, W, H)
    silCtx.globalCompositeOperation = 'source-in'
    silCtx.fillStyle = '#07112b'
    silCtx.fillRect(0, 0, W, H)
    silCtx.globalCompositeOperation = 'source-over'
    sctx.clearRect(0, 0, shadow.width, shadow.height)
    const fr: any = track?.frames?.[frameIdx]

    if (track && (track as any).v2 && fr && fr.af) {
      // ── v2: studio-mirrored shadow ──
      const { sigma_base_px: s0, sigma_per_h_px: s1, alpha_base: a0, alpha_per_h: a1 } = (track as any).calib
      const [a, b, cc, dd, e, f] = fr.af
      const h0 = fr.h0
      const h1 = Math.max(fr.h1, h0 + 0.001)
      const hAt = (t: number) => h0 + (h1 - h0) * t
      bandedShadow(
        (c) => { c.setTransform(a * k, b * k, cc * k, dd * k, (e + padX) * k, (f + padY) * k); c.drawImage(sil, 0, 0) },
        { x0: (fr.pn[0] + padX) * k, y0: (fr.pn[1] + padY) * k, x1: (fr.pf[0] + padX) * k, y1: (fr.pf[1] + padY) * k },
        6,
        (t) => (s0 + s1 * hAt(t)) * k,
        (t) => Math.max(0, a0 + a1 * hAt(t)),
      )
      return
    }

    if (fr && fr.dcx != null) {
      // ── v1 track: silhouette at the projected shadow position ──
      const cx = padX + fr.dcx + fr.dx
      const cy = padY + fr.dcy + fr.dy
      const ox = cx - fr.dcx * fr.sx
      const oy = cy - fr.dcy * fr.sy
      const rad = (fr.ang * Math.PI) / 180
      const dirx = Math.cos(rad)
      const diry = Math.sin(rad)
      const ext = (Math.abs(dirx) * fr.dw * fr.sx + Math.abs(diry) * fr.dh * fr.sy) / 2 + 4
      bandedShadow(
        (c) => c.drawImage(sil, ox * k, oy * k, W * fr.sx * k, H * fr.sy * k),
        { x0: (cx - dirx * ext) * k, y0: (cy - diry * ext) * k, x1: (cx + dirx * ext) * k, y1: (cy + diry * ext) * k },
        4,
        (t) => (fr.bn + (fr.bf - fr.bn) * t) * k,
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
        const dw = W * p.s * k
        const dh = H * p.s * k
        const ox2 = (padX + p.dx - (W * p.s - W) / 2) * k
        const oy2 = (padY + p.dy - (H * p.s - H) / 2) * k
        const blurK = p.blur * k
        tmpCtx.clearRect(0, 0, tmp.width, tmp.height)
        if (ctxFilterSupported()) {
          tmpCtx.save()
          tmpCtx.filter = `blur(${blurK.toFixed(1)}px)`
          tmpCtx.drawImage(sil, ox2, oy2, dw, dh)
          tmpCtx.restore()
        } else {
          sharpCtx.clearRect(0, 0, sharp.width, sharp.height)
          sharpCtx.drawImage(sil, ox2, oy2, dw, dh)
          drawBlurred(tmpCtx, sharp, blurK, scrA, scrB)
        }
        sctx.save()
        sctx.globalAlpha = p.alpha
        sctx.drawImage(tmp, 0, 0)
        sctx.restore()
      }
    }
  }

  return { size, draw }
}
