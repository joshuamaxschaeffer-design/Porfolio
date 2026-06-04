/**
 * Speculation Rules API: tells Chrome/Edge to prerender same-origin pages
 * when the user shows intent (hovers a link for ~200ms, or it enters the
 * viewport at 'eager' settings). Falls back silently in Firefox/Safari.
 *
 * Result: clicking a prefetched/prerendered link feels instant — the new
 * page is already fully loaded and only swaps in.
 *
 * Place this in the root layout once.
 */
export function SpeculationRules() {
  const rules = JSON.stringify({
    prerender: [
      {
        source: 'document',
        // Only prerender same-origin links, skip outbound and downloads.
        where: {
          and: [
            { href_matches: '/*' },
            { not: { href_matches: '/admin/*' } },
            { not: { href_matches: '/api/*' } },
            { not: { selector_matches: '[rel~="external"]' } },
            { not: { selector_matches: '[data-no-prerender]' } },
          ],
        },
        // "moderate" — prerender after 200ms hover (or pointerdown on mobile).
        // Bump to "eager" for even more aggressive behavior on a low-traffic portfolio.
        eagerness: 'moderate',
      },
    ],
    prefetch: [
      {
        source: 'document',
        where: {
          and: [
            { href_matches: '/*' },
            { not: { href_matches: '/admin/*' } },
            { not: { href_matches: '/api/*' } },
          ],
        },
        eagerness: 'eager',
      },
    ],
  })

  return (
    <script
      type="speculationrules"
      // eslint-disable-next-line react/no-danger
      dangerouslySetInnerHTML={{ __html: rules }}
    />
  )
}
