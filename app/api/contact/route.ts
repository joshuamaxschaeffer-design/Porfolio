import { NextRequest, NextResponse } from 'next/server'

/**
 * Contact form endpoint.
 *
 * Receives the structured inquiry from /contact and emails it to Joshua. We
 * call the Resend HTTP API directly with fetch() — no SDK dependency to install
 * or keep updated (per the "no new node_modules unless necessary" preference).
 *
 * Required env (set in Vercel → Project → Settings → Environment Variables):
 *   RESEND_API_KEY    — from resend.com (free tier: 3k emails/mo, 100/day)
 *   CONTACT_EMAIL_TO  — recipient; defaults to joshuamaxschaeffer@gmail.com
 *   CONTACT_EMAIL_FROM— a verified sender on your Resend domain. Until
 *                       schaeffer.design is verified there, Resend's shared
 *                       'onboarding@resend.dev' works for testing.
 *
 * Graceful degradation: if RESEND_API_KEY is missing, we DON'T 500. We log the
 * submission server-side and return ok:true with delivered:false so the form
 * still confirms to the user and nothing is lost while the key is being set up.
 * Swap that behavior by setting CONTACT_REQUIRE_EMAIL=1 to hard-fail instead.
 */
export const runtime = 'nodejs'

const TO = process.env.CONTACT_EMAIL_TO || 'joshuamaxschaeffer@gmail.com'
const FROM = process.env.CONTACT_EMAIL_FROM || 'Schaeffer Site <onboarding@resend.dev>'

// Mirror the option sets the form offers, so the server validates against the
// same closed lists the UI presents (and rejects anything hand-crafted).
const PROJECT_TYPES = [
  'Product / app design',
  'Brand identity & systems',
  'Product + brand (full engagement)',
  'Design systems & implementation',
  'Fractional / interim design lead',
  'Marketing site or landing page',
  'Something else',
]
const BUDGETS = [
  'Under $10k',
  '$10k–$25k',
  '$25k–$50k',
  '$50k–$100k',
  '$100k+',
  'Not sure yet',
]
const TIMELINES = [
  'As soon as possible',
  'In the next month',
  '1–3 months out',
  'Just exploring',
]

interface ContactPayload {
  name?: unknown
  email?: unknown
  company?: unknown
  projectType?: unknown
  budget?: unknown
  timeline?: unknown
  message?: unknown
  /** honeypot — must stay empty; bots fill it */
  website?: unknown
}

function isNonEmptyString(v: unknown): v is string {
  return typeof v === 'string' && v.trim().length > 0
}

// Minimal, permissive email shape check — real validation is the reply landing.
function looksLikeEmail(v: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v.trim())
}

function escapeHtml(s: string): string {
  return s
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
}

export async function POST(request: NextRequest) {
  let body: ContactPayload
  try {
    body = (await request.json()) as ContactPayload
  } catch {
    return NextResponse.json({ ok: false, error: 'Invalid request.' }, { status: 400 })
  }

  // Honeypot: a real user never fills #website. Pretend success, send nothing.
  if (isNonEmptyString(body.website)) {
    return NextResponse.json({ ok: true, delivered: false })
  }

  // ---- Validation ---------------------------------------------------------
  const errors: Record<string, string> = {}
  if (!isNonEmptyString(body.name)) errors.name = 'Please add your name.'
  if (!isNonEmptyString(body.email)) errors.email = 'Please add an email.'
  else if (!looksLikeEmail(body.email)) errors.email = 'That email looks off.'
  if (!isNonEmptyString(body.message)) errors.message = 'Add a line about the project.'

  // Dropdowns: optional, but if present must be from the offered list.
  const projectType = isNonEmptyString(body.projectType) ? body.projectType : ''
  const budget = isNonEmptyString(body.budget) ? body.budget : ''
  const timeline = isNonEmptyString(body.timeline) ? body.timeline : ''
  if (projectType && !PROJECT_TYPES.includes(projectType)) errors.projectType = 'Invalid option.'
  if (budget && !BUDGETS.includes(budget)) errors.budget = 'Invalid option.'
  if (timeline && !TIMELINES.includes(timeline)) errors.timeline = 'Invalid option.'

  if (Object.keys(errors).length > 0) {
    return NextResponse.json({ ok: false, errors }, { status: 422 })
  }

  const name = (body.name as string).trim()
  const email = (body.email as string).trim()
  const company = isNonEmptyString(body.company) ? body.company.trim() : ''
  const message = (body.message as string).trim()

  // ---- Compose ------------------------------------------------------------
  const rows: [string, string][] = [
    ['Name', name],
    ['Email', email],
    ['Company', company || '—'],
    ['Project type', projectType || '—'],
    ['Budget', budget || '—'],
    ['Timeline', timeline || '—'],
  ]

  const subject = `New inquiry — ${name}${projectType ? ` · ${projectType}` : ''}`

  const textBody =
    rows.map(([k, v]) => `${k}: ${v}`).join('\n') + `\n\nMessage:\n${message}\n`

  const htmlBody = `
    <div style="font-family:ui-sans-serif,system-ui,sans-serif;color:#242627;max-width:560px">
      <h2 style="font-size:18px;margin:0 0 16px;color:#070e2c">New inquiry from the site</h2>
      <table style="border-collapse:collapse;width:100%;font-size:14px">
        ${rows
          .map(
            ([k, v]) =>
              `<tr>
                 <td style="padding:6px 12px 6px 0;color:#7e7f88;white-space:nowrap;vertical-align:top">${k}</td>
                 <td style="padding:6px 0;color:#242627">${escapeHtml(v)}</td>
               </tr>`,
          )
          .join('')}
      </table>
      <div style="margin-top:20px;padding-top:16px;border-top:1px solid #dcdce1">
        <div style="color:#7e7f88;font-size:13px;margin-bottom:6px">Message</div>
        <div style="white-space:pre-wrap;line-height:1.55">${escapeHtml(message)}</div>
      </div>
    </div>`

  // ---- Send via Resend ----------------------------------------------------
  const apiKey = process.env.RESEND_API_KEY

  if (!apiKey) {
    // No key yet — don't lose the lead or error the user.
    console.warn('[contact] RESEND_API_KEY not set; submission logged, not emailed:', {
      name,
      email,
      company,
      projectType,
      budget,
      timeline,
    })
    if (process.env.CONTACT_REQUIRE_EMAIL === '1') {
      return NextResponse.json(
        { ok: false, error: 'Email is not configured yet. Please email joshuamaxschaeffer@gmail.com directly.' },
        { status: 503 },
      )
    }
    return NextResponse.json({ ok: true, delivered: false })
  }

  try {
    const res = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        from: FROM,
        to: [TO],
        reply_to: email, // hitting "reply" in Gmail goes straight to the sender
        subject,
        text: textBody,
        html: htmlBody,
      }),
    })

    if (!res.ok) {
      const detail = await res.text().catch(() => '')
      console.error('[contact] Resend error', res.status, detail)
      return NextResponse.json(
        { ok: false, error: 'Could not send right now. Please try again or email directly.' },
        { status: 502 },
      )
    }

    return NextResponse.json({ ok: true, delivered: true })
  } catch (err) {
    console.error('[contact] send failed', err)
    return NextResponse.json(
      { ok: false, error: 'Could not send right now. Please try again or email directly.' },
      { status: 502 },
    )
  }
}
