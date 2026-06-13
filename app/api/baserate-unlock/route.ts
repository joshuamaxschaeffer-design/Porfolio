import { NextRequest, NextResponse } from 'next/server'
import {
  BASERATE_UNLOCK_COOKIE,
  BASERATE_UNLOCK_VALUE,
  isBaseratePasswordCorrect,
} from '@/lib/baserateGate'

/**
 * Baserate NDA unlock endpoint.
 *
 * The password is checked HERE, on the server, so the real value never reaches
 * the client bundle. On a correct (fuzzy) match we set an httpOnly session
 * cookie — no maxAge/expires, so it dies when the browser closes (session-only
 * unlock, per the owner's choice). The client then calls router.refresh() and
 * the server re-renders the case study with the gate open.
 */
export const runtime = 'nodejs'

export async function POST(request: NextRequest) {
  let password: unknown
  try {
    const body = await request.json()
    password = (body as { password?: unknown })?.password
  } catch {
    return NextResponse.json({ ok: false }, { status: 400 })
  }

  if (!isBaseratePasswordCorrect(password)) {
    // Constant generic response — don't hint how close they were.
    return NextResponse.json({ ok: false }, { status: 401 })
  }

  const res = NextResponse.json({ ok: true })
  res.cookies.set(BASERATE_UNLOCK_COOKIE, BASERATE_UNLOCK_VALUE, {
    httpOnly: true,
    sameSite: 'lax',
    secure: process.env.NODE_ENV === 'production',
    path: '/',
    // No maxAge/expires => session cookie (cleared when the browser closes).
  })
  return res
}
