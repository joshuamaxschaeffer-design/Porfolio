import { componentLibraries as defaults } from './data'

const P = '/panda/components'

/**
 * Component Libraries — the SECOND item inside the MVP Fast-Launch section
 * (the first being the 2020-Pivot two-card block). Mirrors the Baserate
 * "Component Libraries" panel pattern (DesignSystemsSection): an uppercase
 * label + one-line description, then the design artifacts on white cards.
 *
 * FULL-BLEED PANDA-RED BAND. This component is rendered INSIDE ReleasesSection's
 * `br-container`, so it breaks OUT to the full viewport width (left-1/2 +
 * -ml-[50vw] + w-screen) to paint a red band edge-to-edge — matching the Figma
 * frame (node 263:46908), where the sheets sit on a red field, and consistent
 * with the device-scatter band (`#mvp-reordering`) that follows. The content is
 * then re-wrapped in its own `br-container` so the column width/padding still
 * lines up with the rest of the case study.
 *
 * Two sheets, exported flat from Figma:
 *   1. Component Sheet — colour palette, form controls, tags, icon grids,
 *      product cards, map, and the type scale. DENSE; on mobile it follows the
 *      Baserate treatment: the card is ~2× the viewport and bleeds OFF the
 *      right screen edge (clipped, no page scroll) so the detail stays legible
 *      instead of collapsing to thumbnail size. Fits the column at md+.
 *   2. Icon Sheet — two rows of illustrative line-art food icons in Panda red.
 *      Wide but short, so it scales down cleanly full-width at every breakpoint.
 *
 * On the red field each sheet sits on a soft-shadowed WHITE card (no border —
 * the red provides the separation), reading as a distinct artifact like the
 * Figma. Header + body copy are white.
 *
 * Assets: /public/panda/components/{component-sheet,icon-sheet}.webp
 * No transforms/animation on the images — those rasterize and soften the art.
 */
export function ComponentLibrariesSection({
  title,
  body,
}: {
  title?: string
  body?: string
} = {}) {
  return (
    <section
      data-anim="complib"
      aria-label="Component libraries"
      className="relative left-1/2 isolate -ml-[50vw] mt-16 w-screen overflow-hidden bg-[var(--px-red)] py-16 md:mt-24 md:py-24"
    >
      <div className="br-container">
        {/* Panel header — white on the red field. */}
        <h3
          data-anim="complib-title"
          className="text-[24px] font-semibold uppercase leading-tight text-white md:text-[28px]"
        >
          {title ?? defaults.title}
        </h3>
        <p
          data-anim="complib-body"
          className="br-body mt-3 max-w-3xl text-[16px] leading-relaxed text-white/90 md:text-[18px]"
        >
          {body ?? defaults.body}
        </p>

        {/* ── Sheet 1: Component Sheet ───────────────────────────────────────
            Mobile: the CARD is ~2× the viewport and bleeds OFF the right SCREEN
            edge. `-mr-6` cancels the br-container right gutter so the card reaches
            the very edge; the wrapper clips the off-screen part with
            `overflow-x: clip` — crops, never scrolls the page. Desktop: card fits
            the column, fully rounded. `vw` resolves against the viewport. */}
        <div data-anim="complib-sheet" className="-mr-6 mt-9 md:mr-0 md:mt-12" style={{ overflowX: 'clip' }}>
          <div className="w-[190vw] overflow-hidden rounded-l-2xl bg-white shadow-[0_24px_60px_-28px_rgba(0,0,0,0.5)] md:w-full md:rounded-2xl">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={`${P}/component-sheet.webp`}
              alt="Panda Express component library — colour palette, form fields, tags, icon set, product cards, and type scale"
              width={2400}
              height={1350}
              className="block w-full"
            />
          </div>
        </div>

        {/* ── Sheet 2: Icon Sheet ────────────────────────────────────────────
            Wide-but-short (two rows of illustrative food icons). Scales down
            cleanly, so it fits the column full-width on every breakpoint — no
            off-edge bleed needed. */}
        <div data-anim="complib-icons" className="mt-6 md:mt-8">
          <div className="overflow-hidden rounded-2xl bg-white shadow-[0_24px_60px_-28px_rgba(0,0,0,0.5)]">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={`${P}/icon-sheet.webp`}
              alt="Panda Express illustrative iconography — line-art food and ordering icons in Panda red"
              width={2400}
              height={562}
              className="block w-full"
            />
          </div>
        </div>
      </div>
    </section>
  )
}
