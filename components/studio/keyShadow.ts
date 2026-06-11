/**
 * ONE global key light for every CSS-shadowed floating element on the site
 * (chips, orbs, cards) — derived from the SD Studio Site Rig so cheap CSS
 * shadows agree with the physically-rendered device/object shadows.
 *
 * Provenance: rig key light sits high front-right of the scene
 * (`__siteRig__` in sd-image-gen/projects/device-studio-projects.json;
 * default key pos (0, 14, 6)) → shadows fall slightly down-left and sit
 * BEHIND the object rather than under it. Offsets/blur are proportional to
 * the element's size so every element reads as lit by the same source.
 * If Joshua re-saves the rig with a different key light, refresh x/y here:
 * x ≈ -lightDir.x * 0.2, y ≈ +lightDir.z * 0.2 (screen-space approximation
 * at the rig's top-down camera family).
 */
export const KEY_SHADOW = {
  x: -0.07, // offset, fraction of element size (negative = left)
  y: 0.09, //  fraction of element size (positive = down)
  scale: 1.04,
  color: 'rgba(8,20,44,0.32)',
  blur: (s: number) => Math.max(10, s * 0.13),
}
