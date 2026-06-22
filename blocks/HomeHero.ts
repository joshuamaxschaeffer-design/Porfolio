import type { Block } from 'payload'

/**
 * Home top section — the big SCHAEFFER / DESIGN wordmark (Figma 335-73237).
 * Name-aware nav: the hero name hides the nav wordmark until scrolled past.
 * Copy defaults live in components/blocks/home/HomeHero.tsx.
 */
export const HomeHero: Block = {
  slug: 'homeHero',
  labels: { singular: 'Home Hero (wordmark)', plural: 'Home Hero (wordmark)' },
  fields: [
    { name: 'name', type: 'text', admin: { description: 'Big wordmark. Blank = "Schaeffer".' } },
    { name: 'label', type: 'text', admin: { description: 'Small label under it. Blank = "Design".' } },
  ],
}

/**
 * Home closing band — three numbered about blocks + availability CTA
 * (Figma 346-47084). Copy defaults live in components/blocks/home/HomeAboutCta.tsx.
 */
export const HomeAboutCta: Block = {
  slug: 'homeAboutCta',
  labels: { singular: 'Home About + CTA', plural: 'Home About + CTA' },
  fields: [
    { name: 'ctaHeading', type: 'text' },
    { name: 'ctaBody', type: 'text' },
    { name: 'ctaLabel', type: 'text' },
    { name: 'ctaUrl', type: 'text', admin: { description: 'Default /contact.' } },
  ],
}
