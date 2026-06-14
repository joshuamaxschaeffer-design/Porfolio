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

// Shadow colour — a DESATURATED BLUE, not near-black/grey (per Josh Comeau,
// "Designing Beautiful Shadows": match the environment's hue + drop saturation/
// lightness so the shadow reads richer and not washed-out grey). The hero/
// Baserate field is teal→blue, so a deep blue cast sits more naturally than the
// old #07112b near-black navy. Opacity is applied separately (α track / layer
// gradients), so this only sets the hue/tone of the cast shadow.
export const SHADOW_COLOR = '#101d33' // hsl(218 53% 13%) — deep, slightly blue

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
    silCtx.fillStyle = SHADOW_COLOR
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

// ───────────────────────────────────────────────────────────────────────────
// SHADOW V3 (alternative renderer — does NOT replace createShadowPipeline).
//
// Instead of recompositing a multi-band blurred canvas every frame, v3 draws
// ONE SVG polygon (the object's footprint run through the per-frame affine),
// filled with an opacity gradient along the near→far axis, under a Gaussian
// blur whose strength is the height-graded σ. A few stacked, gradient-masked
// blurred copies approximate the blur-INCREASE along the axis (sharp at the
// contact/near edge, soft at the far edge) — the same look the canvas version
// builds with bands, but as cheap GPU-composited SVG (no per-frame raster of a
// big bitmap). Reads the SAME shadow-v2 data; no new SD Studio export needed.
//
// Build with createSvgShadow(svgEl); call size(w,h) then draw(frameIdx, track).
// Toggle between this and the canvas pipeline via StudioObject `shadowMode`.
// ───────────────────────────────────────────────────────────────────────────

const SVGNS = 'http://www.w3.org/2000/svg'
// how many blur layers approximate the near→far blur ramp (3 = sharp/mid/soft)
const SVG_BLUR_LAYERS = 3

export function createSvgShadow(svg: SVGSVGElement) {
  let W = 0
  let H = 0
  let uid = Math.random().toString(36).slice(2, 8)
  // lazily-built reusable nodes
  let defs: SVGDefsElement | null = null
  const layers: { g: SVGGElement; poly: SVGPolygonElement; blur: SVGFEGaussianBlurElement; grad: SVGLinearGradientElement; stopA: SVGStopElement; stopM: SVGStopElement; stopB: SVGStopElement }[] = []

  const size = (firstW: number, firstH: number) => {
    W = firstW
    H = firstH
    // viewBox spans the padded box (same geometry as the shadow canvas):
    // from -pad..(1+pad) of the object in each axis, in OBJECT pixels.
    const padX = W * STUDIO_PAD
    const padY = H * STUDIO_PAD
    const vbW = W * (1 + STUDIO_PAD * 2)
    const vbH = H * (1 + STUDIO_PAD * 2)
    svg.setAttribute('viewBox', `${-padX} ${-padY} ${vbW} ${vbH}`)
    svg.setAttribute('preserveAspectRatio', 'none')
    // (re)build the layer stack
    svg.innerHTML = ''
    layers.length = 0
    defs = document.createElementNS(SVGNS, 'defs') as SVGDefsElement
    svg.appendChild(defs)
    for (let i = 0; i < SVG_BLUR_LAYERS; i++) {
      const filter = document.createElementNS(SVGNS, 'filter')
      const fid = `sh3f_${uid}_${i}`
      filter.setAttribute('id', fid)
      // generous region so the blur isn't clipped
      filter.setAttribute('x', '-50%'); filter.setAttribute('y', '-50%')
      filter.setAttribute('width', '200%'); filter.setAttribute('height', '200%')
      const blur = document.createElementNS(SVGNS, 'feGaussianBlur') as SVGFEGaussianBlurElement
      blur.setAttribute('stdDeviation', '4')
      filter.appendChild(blur)
      defs.appendChild(filter)

      const grad = document.createElementNS(SVGNS, 'linearGradient') as SVGLinearGradientElement
      const gid = `sh3g_${uid}_${i}`
      grad.setAttribute('id', gid)
      grad.setAttribute('gradientUnits', 'userSpaceOnUse')
      // 3 stops: 0 (transparent) → mid (opaque) → 1 (transparent) — a soft band
      // along the near→far axis so stacked layers crossfade into a smooth ramp.
      const stopA = document.createElementNS(SVGNS, 'stop') as SVGStopElement
      const stopM = document.createElementNS(SVGNS, 'stop') as SVGStopElement
      const stopB = document.createElementNS(SVGNS, 'stop') as SVGStopElement
      for (const s of [stopA, stopM, stopB]) s.setAttribute('stop-color', SHADOW_COLOR)
      grad.appendChild(stopA); grad.appendChild(stopM); grad.appendChild(stopB)
      defs.appendChild(grad)

      const g = document.createElementNS(SVGNS, 'g') as SVGGElement
      g.setAttribute('filter', `url(#${fid})`)
      const poly = document.createElementNS(SVGNS, 'polygon') as SVGPolygonElement
      poly.setAttribute('fill', `url(#${gid})`)
      g.appendChild(poly)
      svg.appendChild(g)
      layers.push({ g, poly, blur, grad, stopA, stopM, stopB })
    }
  }

  // affine helper: map an object-space point through af [a,b,c,d,e,f]
  const ap = (af: number[], x: number, y: number) => [af[0] * x + af[2] * y + af[4], af[1] * x + af[3] * y + af[5]]

  // Trace the object's actual SILHOUETTE in object space so the shadow follows
  // the real outline (circle for a sphere, ring-ish for a torus, rounded rect
  // for a chip) — not just a bbox quad. Radial sweep from the alpha centroid at
  // N angles finds the farthest opaque pixel along each ray → an N-point closed
  // contour. Cheap, and star-convex which is fine for every studio kind. Cached
  // on a tiny offscreen so re-tracing the same frame image is free.
  const traceCanvas = document.createElement('canvas')
  const traceCtx = traceCanvas.getContext('2d', { willReadFrequently: true })!
  let tracedSrc: any = null
  let tracedPts: number[][] = []
  const ANGLES = 48
  const TRACE_RES = 96 // sample the silhouette at ≤96px (plenty for an outline)
  const traceSilhouette = (img: HTMLImageElement | HTMLCanvasElement | ImageBitmap) => {
    if (img === tracedSrc && tracedPts.length) return tracedPts
    const sw = (img as any).naturalWidth || (img as any).width
    const sh = (img as any).naturalHeight || (img as any).height
    if (!sw || !sh) return tracedPts
    const scale = Math.min(1, TRACE_RES / Math.max(sw, sh))
    const tw = Math.max(8, Math.round(sw * scale))
    const th = Math.max(8, Math.round(sh * scale))
    traceCanvas.width = tw; traceCanvas.height = th
    traceCtx.clearRect(0, 0, tw, th)
    traceCtx.drawImage(img as any, 0, 0, tw, th)
    let data: Uint8ClampedArray
    try { data = traceCtx.getImageData(0, 0, tw, th).data } catch { return tracedPts }
    // centroid of opaque pixels
    let cx = 0, cy = 0, n = 0
    for (let y = 0; y < th; y++) for (let x = 0; x < tw; x++) {
      if (data[(y * tw + x) * 4 + 3] > 40) { cx += x; cy += y; n++ }
    }
    if (!n) { tracedSrc = img; tracedPts = []; return tracedPts }
    cx /= n; cy /= n
    const maxR = Math.hypot(tw, th)
    const pts: number[][] = []
    for (let a = 0; a < ANGLES; a++) {
      const th0 = (a / ANGLES) * Math.PI * 2
      const dx = Math.cos(th0), dy = Math.sin(th0)
      let rHit = 0
      // march outward, remember the farthest opaque sample (handles concavity
      // by taking the outer edge along each ray)
      for (let r = 1; r < maxR; r += 1.0) {
        const sx = Math.round(cx + dx * r), sy = Math.round(cy + dy * r)
        if (sx < 0 || sy < 0 || sx >= tw || sy >= th) break
        if (data[(sy * tw + sx) * 4 + 3] > 40) rHit = r
      }
      // back to OBJECT space (0..W, 0..H)
      pts.push([((cx + dx * rHit) / tw) * W, ((cy + dy * rHit) / th) * H])
    }
    tracedSrc = img; tracedPts = pts
    return pts
  }

  const draw = (img: HTMLImageElement | HTMLCanvasElement | ImageBitmap, frameIdx: number, track: ShadowTrack) => {
    if (!W || !layers.length) return
    const fr: any = track?.frames?.[frameIdx]
    if (!(track && (track as any).v2 && fr && fr.af)) {
      // v3 only supports v2 data; hide if unavailable (canvas mode covers the rest)
      for (const L of layers) L.g.style.display = 'none'
      return
    }
    const { sigma_base_px: s0, sigma_per_h_px: s1, alpha_base: a0, alpha_per_h: a1 } = (track as any).calib
    const af = fr.af as number[]
    // shadow shape = the object's SILHOUETTE contour mapped through the affine
    // (curved outlines preserved). Falls back to the bbox quad if tracing fails.
    const contour = traceSilhouette(img)
    const src = contour.length >= 6 ? contour : [[0, 0], [W, 0], [W, H], [0, H]]
    const polyStr = src.map((q) => { const p = ap(af, q[0], q[1]); return `${p[0].toFixed(1)},${p[1].toFixed(1)}` }).join(' ')
    const h0 = fr.h0
    const h1 = Math.max(fr.h1, h0 + 0.001)
    // near (sharp/low) → far (soft/high) axis from the calibrated anchor points
    const near = fr.pn as number[]
    const far = fr.pf as number[]
    // split the near→far span across the layers: layer i covers its slab with
    // its own blur (σ at that height) and an opacity gradient that fades it in
    // over the slab so the layers sum to a smooth ramp.
    const cl = (v: number) => Math.max(0, Math.min(1, v))
    const F = 0.15 // slab feather (fraction of the near→far span)
    for (let i = 0; i < layers.length; i++) {
      const L = layers[i]
      const t0 = i / layers.length
      const t1 = (i + 1) / layers.length
      const tm = (t0 + t1) / 2
      const hMid = h0 + (h1 - h0) * tm
      // v3 tuning: the polygon is the full object footprint (larger than the
      // calibrated silhouette the canvas bands warp), so push blur + opacity up
      // a bit to land near the canvas look. SVG feGaussianBlur stdDeviation also
      // reads slightly tighter than the canvas chain at the same number.
      const sigma = Math.max(0.6, (s0 + s1 * hMid) * 1.6)
      const alpha = Math.max(0, (a0 + a1 * hMid) * 1.7)
      if (alpha <= 0.004) { L.g.style.display = 'none'; continue }
      L.g.style.display = ''
      L.g.style.opacity = String(Math.min(1, alpha))
      L.blur.setAttribute('stdDeviation', sigma.toFixed(2))
      L.poly.setAttribute('points', polyStr)
      // gradient runs along the near→far axis (userSpace), so its 0..1 offsets
      // map onto t along that axis. This layer is opaque across its slab [t0,t1]
      // and feathers to 0 just outside → stacked slabs sum to a smooth ramp.
      L.grad.setAttribute('x1', near[0].toFixed(1)); L.grad.setAttribute('y1', near[1].toFixed(1))
      L.grad.setAttribute('x2', far[0].toFixed(1)); L.grad.setAttribute('y2', far[1].toFixed(1))
      const oA = i === 0 ? 0 : cl(t0 - F)            // first layer is opaque from the contact edge
      const oM = tm
      const oB = i === layers.length - 1 ? 1 : cl(t1 + F) // last layer opaque to the far edge
      L.stopA.setAttribute('offset', `${(oA * 100).toFixed(1)}%`); L.stopA.setAttribute('stop-opacity', i === 0 ? '1' : '0')
      L.stopM.setAttribute('offset', `${(oM * 100).toFixed(1)}%`); L.stopM.setAttribute('stop-opacity', '1')
      L.stopB.setAttribute('offset', `${(oB * 100).toFixed(1)}%`); L.stopB.setAttribute('stop-opacity', i === layers.length - 1 ? '1' : '0')
    }
  }

  const clear = () => { for (const L of layers) L.g.style.display = 'none' }

  return { size, draw, clear }
}
