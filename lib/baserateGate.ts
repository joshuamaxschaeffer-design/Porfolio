/**
 * Server-only gate logic for the Baserate case study (NDA soft-lock).
 *
 * The real password ("Buffett") lives here and is imported ONLY by server code
 * (the unlock API route + the server-rendered case study), never by a client
 * component, so it never ships in the browser bundle.
 *
 * Matching is forgiving, but only across the variations the owner asked for:
 * any capitalization, a missing 'f', and/or a missing 't'. Leading/trailing
 * whitespace is ignored. Everything else is rejected.
 */

/** Name of the httpOnly session cookie set once the viewer unlocks. */
export const BASERATE_UNLOCK_COOKIE = 'br_nda'

/** Opaque value stored in the unlock cookie (presence is what matters). */
export const BASERATE_UNLOCK_VALUE = '1'

const PASSWORD = 'Buffett'

/**
 * Build the set of accepted spellings from PASSWORD: the word itself, plus the
 * word with any single 'f' removed and/or any single 't' removed. Generated
 * (not hardcoded) so it stays correct if PASSWORD ever changes. All lowercase.
 */
function buildAccepted(word: string): Set<string> {
  const base = word.toLowerCase()
  const accepted = new Set<string>([base])

  const dropOne = (s: string, ch: string): string[] => {
    const out: string[] = []
    for (let i = 0; i < s.length; i++) {
      if (s[i] === ch) out.push(s.slice(0, i) + s.slice(i + 1))
    }
    return out
  }

  const missingF = dropOne(base, 'f') // e.g. "bufett"
  const missingT = dropOne(base, 't') // e.g. "buffet"
  for (const v of missingF) accepted.add(v)
  for (const v of missingT) accepted.add(v)
  // Missing one 'f' AND one 't' (e.g. "bufet")
  for (const v of missingF) for (const w of dropOne(v, 't')) accepted.add(w)

  return accepted
}

const ACCEPTED = buildAccepted(PASSWORD)

/** True if `input` is an accepted (fuzzy) spelling of the password. */
export function isBaseratePasswordCorrect(input: unknown): boolean {
  if (typeof input !== 'string') return false
  return ACCEPTED.has(input.trim().toLowerCase())
}
