import { NextResponse, type NextRequest } from 'next/server'
import { brandFromHostname, asBrand, type Brand } from '@/lib/brand'

/**
 * Multi-tenant middleware.
 *
 * One codebase serves two sites:
 *   - schaeffer.design      → personal
 *   - schaefferpractice.com → practice
 *
 * Brand is encoded as an internal route segment (`app/(frontend)/[brand]/...`)
 * so that Next's static/ISR cache key INCLUDES the brand. Two domains can then
 * share the same public slug (e.g. "/about") without colliding in the cache:
 * one resolves to `/personal/about`, the other to `/practice/about`.
 *
 * The public URL stays clean — we REWRITE (not redirect), so the address bar
 * still shows `schaeffer.design/about` while Next renders `/personal/about`.
 *
 * Dev override: append `?brand=practice` (or `?brand=personal`) on localhost
 * to preview the other site. The flag is consumed here and not forwarded.
 */
export function middleware(request: NextRequest) {
  const { pathname, search, searchParams } = request.nextUrl

  // ── Staging lock ────────────────────────────────────────────────────────
  // On Vercel *preview* deployments (the `staging` branch, served privately at
  // schaeffer.studio) require HTTP Basic auth so work-in-progress is never
  // publicly visible. Production (schaeffer.design) has VERCEL_ENV set to
  // 'production', so this block never runs there. Password comes from the
  // STAGING_PASSWORD env var (preview scope); the fallback only exists so the
  // lock is closed even before that var is configured.
  if (process.env.VERCEL_ENV === 'preview') {
    const expected = process.env.STAGING_PASSWORD || 'unfold2026'
    const auth = request.headers.get('authorization') || ''
    let ok = false
    if (auth.startsWith('Basic ')) {
      try {
        const decoded = atob(auth.slice(6))
        ok = decoded.slice(decoded.indexOf(':') + 1) === expected
      } catch {
        ok = false
      }
    }
    if (!ok) {
      return new NextResponse('Staging — authentication required', {
        status: 401,
        headers: {
          'WWW-Authenticate': 'Basic realm="Schaeffer Staging"',
          'X-Robots-Tag': 'noindex, nofollow',
        },
      })
    }
  }

  // Never touch the Payload admin/API, Next internals, the revalidate route,
  // or any static file (anything with a file extension, e.g. /baserate/...png).
  // (Belt-and-suspenders alongside `config.matcher` below.)
  if (
    pathname.startsWith('/admin') ||
    pathname.startsWith('/api') ||
    pathname.startsWith('/_next') ||
    pathname === '/favicon.ico' ||
    /\.[a-zA-Z0-9]+$/.test(pathname) // has a file extension → static asset
  ) {
    return NextResponse.next()
  }

  // If a request already targets an internal brand path, leave it alone —
  // prevents a rewrite loop.
  if (pathname.startsWith('/personal') || pathname.startsWith('/practice')) {
    return NextResponse.next()
  }

  // Resolve the brand: explicit dev override wins, else derive from hostname.
  const override = searchParams.get('brand')
  const brand: Brand =
    override === 'practice' || override === 'personal'
      ? asBrand(override)
      : brandFromHostname(request.headers.get('host') || '')

  // Rewrite to the internal brand-prefixed path. Strip the dev `brand` param
  // so it doesn't leak into the rendered URL / cache key, but preserve any
  // other query (e.g. `?preview=true`).
  const url = request.nextUrl.clone()
  url.pathname = `/${brand}${pathname === '/' ? '' : pathname}`
  if (override) {
    url.searchParams.delete('brand')
  }

  const res = NextResponse.rewrite(url)
  // Belt-and-suspenders: keep staging pages out of search engines. Production
  // deployments never have VERCEL_ENV === 'preview', so this is a no-op there.
  if (process.env.VERCEL_ENV === 'preview') {
    res.headers.set('X-Robots-Tag', 'noindex, nofollow')
  }
  return res
}

export const config = {
  // Run on everything except Next internals, the favicon, and static assets.
  // Admin/API are also guarded inside the function above.
  matcher: ['/((?!_next/static|_next/image|favicon.ico|admin|api|.*\\.[a-zA-Z0-9]+$).*)'],
}
