/**
 * Strip undefined / null / '' so blank Payload fields fall back to a component's
 * default parameters. Payload returns `null` for unset optional fields, and a
 * JS default only fires on `undefined` — so without this a blank CMS field would
 * override the default (and a null href would crash Next's <Link> formatter).
 */
export function stripEmpty<T extends object>(obj: T): Partial<T> {
  return Object.fromEntries(
    Object.entries(obj).filter(([, v]) => v !== undefined && v !== null && v !== ''),
  ) as Partial<T>
}
