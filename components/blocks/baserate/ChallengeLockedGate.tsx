'use client'

import { useRef, useState } from 'react'
import { useRouter } from 'next/navigation'
import { LockIcon } from './LockIcon'

/**
 * NDA gate shown in place of everything below the Overview when the case study
 * is locked. It is an 800px-tall band: the real "2. The Challenge" heading sits
 * on top (the teaser), behind a centered password card, over a HEAVILY BLURRED,
 * fully non-interactive smear of the first challenge frames. None of the gated
 * content is interactive or readable — the blur + pointer-events:none guarantee
 * it — and the actual password is verified server-side (the value never reaches
 * this bundle). A correct entry sets a session cookie, then router.refresh()
 * re-renders the page server-side with the real sections revealed.
 */

// Ambient-only backdrop frames (kept blurred + aria-hidden; never legible).
const BACKDROP = ['/baserate/challenge/problem-1.webp', '/baserate/challenge/problem-3.webp']

export function ChallengeLockedGate({
  heading = 'THE CHALLENGE',
  intro = 'We identified 7 key problems in the process of investment teams.',
}: {
  heading?: string
  intro?: string
}) {
  const router = useRouter()
  const inputRef = useRef<HTMLInputElement>(null)
  const [value, setValue] = useState('')
  const [status, setStatus] = useState<'idle' | 'checking' | 'error'>('idle')

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (status === 'checking') return
    setStatus('checking')
    try {
      const res = await fetch('/api/baserate-unlock', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ password: value }),
      })
      if (res.ok) {
        // Cookie is set; re-render the server component with the gate open.
        router.refresh()
        return
      }
      setStatus('error')
      inputRef.current?.focus()
      inputRef.current?.select()
    } catch {
      setStatus('error')
    }
  }

  return (
    <section
      id="challenge"
      aria-label="The Challenge — locked under NDA"
      className="relative h-[800px] overflow-hidden bg-[var(--br-bg-2)]"
    >
      {/* Teaser heading — the only non-sensitive copy, shown above the blur. */}
      <div className="br-container relative z-20 pt-20 md:pt-[120px]">
        <h2 className="text-[32px] font-medium uppercase leading-none text-[var(--br-ink)] md:text-[40px]">
          2. {heading}
        </h2>
        <p className="mt-4 max-w-2xl text-lg text-[var(--br-muted)] md:text-[22px]">{intro}</p>
      </div>

      {/* Blurred, inert backdrop. aria-hidden + pointer-events-none + select-none
          + a heavy blur and scrim → no interactivity and nothing legible. */}
      <div aria-hidden className="pointer-events-none absolute inset-0 z-0 select-none">
        <div className="absolute inset-x-0 bottom-0 top-[180px] flex gap-5 px-6">
          {BACKDROP.map((src) => (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              key={src}
              src={src}
              alt=""
              draggable={false}
              className="h-full flex-1 rounded-2xl object-cover opacity-60 blur-[28px]"
            />
          ))}
        </div>
        {/* wash so the blur reads as a soft, locked surface, not a real section */}
        <div className="absolute inset-0 bg-[rgba(248,248,251,0.55)]" />
      </div>

      {/* Password card */}
      <div className="absolute inset-0 z-30 grid place-items-center px-6">
        <div className="w-full max-w-[420px] rounded-2xl border border-[var(--br-stroke)] bg-white/90 p-8 text-center backdrop-blur-xl [box-shadow:0_20px_60px_rgba(7,14,44,0.16),0_4px_14px_rgba(7,14,44,0.08)]">
          <div className="mx-auto grid h-12 w-12 place-items-center rounded-full border border-[var(--br-stroke)] bg-[var(--br-bg-2)]">
            <LockIcon className="h-6 w-6 text-[var(--br-ink)]" title="Locked" />
          </div>
          <h3 className="mt-5 text-[20px] font-medium leading-snug text-[var(--br-ink)] md:text-[22px]">
            Content locked under NDA
          </h3>
          <p className="mx-auto mt-2 max-w-[320px] text-[15px] leading-relaxed text-[var(--br-muted)]">
            The rest of this case study is protected. Reach out for access, or enter the password
            if you have it.
          </p>

          <form onSubmit={onSubmit} className="mt-6 flex flex-col gap-3 text-left">
            <label htmlFor="br-nda-pw" className="sr-only">
              Password
            </label>
            <input
              id="br-nda-pw"
              ref={inputRef}
              type="password"
              autoComplete="off"
              value={value}
              onChange={(e) => {
                setValue(e.target.value)
                if (status === 'error') setStatus('idle')
              }}
              aria-invalid={status === 'error'}
              placeholder="Enter password"
              className={`h-11 w-full rounded-lg border bg-white px-4 text-[15px] text-[var(--br-ink)] outline-none transition placeholder:text-neutral-400 focus:ring-2 ${
                status === 'error'
                  ? 'border-red-400 focus:ring-red-100'
                  : 'border-[var(--br-stroke)] focus:border-[var(--br-ink)] focus:ring-[rgba(7,14,44,0.08)]'
              }`}
            />
            <button
              type="submit"
              disabled={status === 'checking'}
              className="h-11 w-full rounded-lg bg-[var(--br-ink)] text-[15px] font-medium text-white transition hover:opacity-90 disabled:opacity-60"
            >
              {status === 'checking' ? 'Checking…' : 'Unlock'}
            </button>
            <p
              role="status"
              aria-live="polite"
              className={`min-h-[18px] text-[13px] ${
                status === 'error' ? 'text-red-500' : 'text-transparent'
              }`}
            >
              {status === 'error' ? 'That password didn’t work. Try again.' : ' '}
            </p>
          </form>

          <a
            href="mailto:josh@journalytic.com?subject=Baserate%20case%20study%20access"
            className="mt-1 inline-block text-[13px] font-medium text-[var(--br-muted)] underline-offset-4 hover:text-[var(--br-ink)] hover:underline"
          >
            Reach out for access
          </a>
        </div>
      </div>

      {/* Bottom fade so the 800px band dissolves cleanly into the page. */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-x-0 bottom-0 z-10 h-32 bg-gradient-to-b from-transparent to-[#f8f8fb]"
      />
    </section>
  )
}
