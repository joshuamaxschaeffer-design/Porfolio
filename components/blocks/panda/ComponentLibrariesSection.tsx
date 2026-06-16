import { componentLibraries as defaults } from './data'

const P = '/panda/components'

/**
 * Component Libraries — part of the MVP Fast-Launch section: the design-system
 * artifacts (palette, controls, icon set, product cards, type scale) that
 * shipped with the MVP. Mirrors the Baserate "Component Libraries" panel: an
 * uppercase label + one-line description, then the artifacts on white cards.
 *
 * Two flat Figma sheets (node 263:46908):
 *   1. Component Sheet — colour palette, form controls, tags, icon grids,
 *      product cards, map, and the type scale. DENSE; on mobile it follows the
 *      Baserate treatment: the card is ~2× the viewport and bleeds OFF the
 *      right screen edge (clipped, no page scroll) so the detail stays legible
 *      instead of collapsing to thumbnail size. Fits the column at md+.
 *   2. Icon Sheet — two rows of illustrative line-art food icons in Panda red.
 *      Wide but short, so it scales down cleanly full-width at every breakpoint.
 *
 * The sheets always sit on soft-shadowed WHITE cards (no border — the red field
 * provides the separation) with white header/body copy.
 *
 * RENDER MODES:
 *   • `contained` (default here): rendered as a plain block INSIDE an already
 *     full-bleed red parent (the MVP Fast-Launch `#mvp` section, below the UX
 *     chart). No own background / container — the parent's red field + its
 *     `br-container` supply both. The mobile sheet still bleeds to the screen
 *     edge via `-mr-6` (cancels the parent container's right gutter).
 *   • standalone (`contained={false}`): paints its OWN full-bleed Panda-red band
 *     and re-establishes a `br-container` inside (for use outside a red section).
 *
 * Assets: /public/panda/components/{component-sheet,icon-sheet}.webp
 * No transforms/animation on the images — those rasterize and soften the art.
 */
export function ComponentLibrariesSection({
  title,
  body,
  contained = true,
}: {
  title?: string
  body?: string
  /** true = bare block inside an already-red parent; false = own red band */
  contained?: boolean
} = {}) {
  const content = (
    <>
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
    </>
  )

  // Contained: a bare block inside an already-red parent section (the MVP
  // module). The parent supplies the red field + the br-container; we just add
  // top spacing to separate from the UX chart above.
  if (contained) {
    return (
      <div data-anim="complib" className="mt-14 md:mt-20">
        {content}
      </div>
    )
  }

  // Standalone: paint our own full-bleed red band + container.
  return (
    <section
      data-anim="complib"
      aria-label="Component libraries"
      className="relative left-1/2 isolate -ml-[50vw] mt-16 w-screen overflow-hidden bg-[var(--px-red)] py-16 md:mt-24 md:py-24"
    >
      <div className="br-container">{content}</div>
    </section>
  )
}
