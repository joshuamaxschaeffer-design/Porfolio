import type { FieldHook, Validate } from 'payload'

/**
 * Multi-tenant slug handling.
 *
 * The two sites (personal / practice) share one Payload instance and one
 * codebase, so the SAME slug — e.g. "home", "about", "contact" — must be
 * allowed once per brand. A plain `unique: true` on the slug column enforces
 * GLOBAL uniqueness across both brands and would reject the second site's
 * "home". So we drop `unique` and enforce uniqueness scoped to brand here.
 *
 * `brand` is a `hasMany` select (a document can appear on both sites), so a
 * collision exists when another published-or-draft doc in the same collection
 * shares this slug AND overlaps on at least one brand value.
 *
 * Wire into a collection's slug field as:
 *   { name: 'slug', type: 'text', required: true, index: true,
 *     hooks: { beforeValidate: [formatSlug] },
 *     validate: uniqueSlugPerBrand }
 */

/** Normalize a slug: lowercase, spaces→hyphens, strip junk, collapse repeats. */
export const formatSlug: FieldHook = ({ value, originalDoc, data }) => {
  const source =
    (typeof value === 'string' && value) ||
    (typeof data?.title === 'string' && data.title) ||
    (typeof originalDoc?.title === 'string' && originalDoc.title) ||
    ''
  if (!source) return value
  return source
    .toString()
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9/\s-]/g, '') // keep slashes for nested paths like "work/foo"
    .replace(/[\s_]+/g, '-')
    .replace(/-+/g, '-')
    .replace(/^-+|-+$/g, '')
}

/**
 * Field-level validate that enforces slug uniqueness *within a brand*.
 * Returns `true` when valid, or an error string when a collision is found.
 */
export const uniqueSlugPerBrand: Validate = async (value, { req, id, data, collectionSlug }) => {
  if (!value || typeof value !== 'string') return 'A slug is required.'
  if (!collectionSlug) return true // safety; should always be present on a collection field

  // Brands this document will live on. brandField() is hasMany → an array.
  const brands: string[] = Array.isArray(data?.brand)
    ? (data!.brand as string[])
    : data?.brand
      ? [data.brand as string]
      : []

  // If brand isn't set yet, let the required-validation on the brand field
  // handle it; we can't meaningfully scope without it.
  if (brands.length === 0) return true

  const result = await req.payload.find({
    collection: collectionSlug as 'pages' | 'case-studies',
    where: {
      and: [
        { slug: { equals: value } },
        { brand: { in: brands } }, // overlaps on at least one brand
        ...(id ? [{ id: { not_equals: id } }] : []), // ignore self on update
      ],
    },
    limit: 1,
    depth: 0,
    pagination: false,
    overrideAccess: true,
  })

  if (result.docs.length > 0) {
    const clash = brands.join(' / ')
    return `The slug "${value}" is already used on the ${clash} site. Slugs must be unique per site.`
  }
  return true
}
