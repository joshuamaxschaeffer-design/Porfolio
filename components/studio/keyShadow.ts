/**
 * ONE global key light for every CSS-shadowed floating element on the site
 * (chips, orbs, cards) — agrees with the physically-rendered SD Studio
 * shadows so cheap CSS shadows and baked exports read as one scene.
 *
 * Direction: BOTTOM-RIGHT (Joshua's spec, 2026-06-10) — and it matches the
 * baked device shadow-v2 data (phone end-frame offset ≈ +176,+377 px;
 * desktop ≈ +60,+520 px → down, leaning right). The earlier down-LEFT
 * derivation had a sign error; do not revert.
 *
 * Blur: applied via CSS `filter: blur(σ)` which is a true Gaussian σ —
 * it reads ~2× softer than a box-shadow radius of the same number. The
 * factors below are σ values, already halved to compensate (his "2× too
 * blurry" fix). If this ever moves to box-shadow, double them back.
 */
export const KEY_SHADOW = {
  x: 0.16, // offset, fraction of element size (positive = right)
  y: 0.2, //  fraction of element size (positive = down)
  scale: 1.02,
  color: 'rgba(8,20,44,0.3)',
  blur: (s: number) => Math.max(5, s * 0.075),
}
