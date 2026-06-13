'use client'

import { useState } from 'react'
import { projectTypes, budgets, timelines, formNote } from './data'

/**
 * Contact form — client component.
 *
 * A real form (NOT a mailto: link, per Joshua): structured fields + dropdowns
 * that frame the request, POSTed to /api/contact which emails Joshua via Resend.
 * On success the form swaps to a confirmation panel. Field-level errors returned
 * by the API (422) are shown inline; transport errors show a single banner with
 * a direct-email fallback.
 *
 * Styling reuses the br-* editorial system (Lexend Deca headings, Noto Sans
 * body, gold accent, hairline borders) so it matches the case-study pages.
 */

type Status = 'idle' | 'submitting' | 'success' | 'error'

interface FieldErrors {
  name?: string
  email?: string
  message?: string
  projectType?: string
  budget?: string
  timeline?: string
}

const initialValues = {
  name: '',
  email: '',
  company: '',
  projectType: '',
  budget: '',
  timeline: '',
  message: '',
  website: '', // honeypot
}

export function ContactForm() {
  const [values, setValues] = useState(initialValues)
  const [status, setStatus] = useState<Status>('idle')
  const [errors, setErrors] = useState<FieldErrors>({})
  const [banner, setBanner] = useState<string>('')

  function update<K extends keyof typeof values>(key: K, value: string) {
    setValues((v) => ({ ...v, [key]: value }))
    // Clear a field's error as soon as the user edits it.
    if (errors[key as keyof FieldErrors]) {
      setErrors((e) => ({ ...e, [key]: undefined }))
    }
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setStatus('submitting')
    setBanner('')
    setErrors({})

    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(values),
      })

      if (res.ok) {
        setStatus('success')
        return
      }

      const data = await res.json().catch(() => ({}))
      if (res.status === 422 && data.errors) {
        setErrors(data.errors as FieldErrors)
        setStatus('idle')
        return
      }

      setBanner(
        data.error ||
          'Something went wrong sending that. Please email joshuamaxschaeffer@gmail.com directly.',
      )
      setStatus('error')
    } catch {
      setBanner(
        'Network hiccup — your message didn’t send. Please email joshuamaxschaeffer@gmail.com directly.',
      )
      setStatus('error')
    }
  }

  if (status === 'success') {
    return (
      <div
        role="status"
        className="flex min-h-[420px] flex-col justify-center rounded-[var(--br-card-radius)] border border-[var(--br-line)] bg-[var(--br-bg-2)] p-8 md:p-12"
      >
        <span className="br-data text-xs font-semibold uppercase tracking-[0.16em] text-[var(--br-gold)]">
          Message sent
        </span>
        <h2 className="mt-4 text-[28px] font-medium leading-tight tracking-[-0.01em] text-[var(--br-ink)] md:text-[34px]">
          Thanks{values.name ? `, ${values.name.split(' ')[0]}` : ''} — got it.
        </h2>
        <p className="mt-4 max-w-md text-[16px] leading-relaxed text-[var(--br-muted)]">
          Your note is on its way to my inbox. I read every message myself and
          reply within a couple of business days. If it’s urgent, email{' '}
          <a
            href="mailto:joshuamaxschaeffer@gmail.com"
            className="text-[var(--br-ink)] underline decoration-[var(--br-divider)] underline-offset-2"
          >
            joshuamaxschaeffer@gmail.com
          </a>
          .
        </p>
      </div>
    )
  }

  return (
    <form onSubmit={handleSubmit} noValidate className="space-y-6">
      {status === 'error' && banner && (
        <p
          role="alert"
          className="rounded-[var(--br-tag-radius)] border border-[#e7c7c7] bg-[#fbf2f2] px-4 py-3 text-sm text-[#8a2b2b]"
        >
          {banner}
        </p>
      )}

      {/* Name + Email */}
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
        <Field label="Name" htmlFor="name" error={errors.name} required>
          <input
            id="name"
            type="text"
            autoComplete="name"
            value={values.name}
            onChange={(e) => update('name', e.target.value)}
            className={inputCls(!!errors.name)}
            placeholder="Your name"
          />
        </Field>
        <Field label="Email" htmlFor="email" error={errors.email} required>
          <input
            id="email"
            type="email"
            autoComplete="email"
            value={values.email}
            onChange={(e) => update('email', e.target.value)}
            className={inputCls(!!errors.email)}
            placeholder="you@company.com"
          />
        </Field>
      </div>

      {/* Company */}
      <Field label="Company" htmlFor="company" hint="Optional">
        <input
          id="company"
          type="text"
          autoComplete="organization"
          value={values.company}
          onChange={(e) => update('company', e.target.value)}
          className={inputCls(false)}
          placeholder="Where you’re from"
        />
      </Field>

      {/* Dropdowns: project type + budget + timeline */}
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-3">
        <Field label="What do you need?" htmlFor="projectType" error={errors.projectType}>
          <Select
            id="projectType"
            value={values.projectType}
            onChange={(v) => update('projectType', v)}
            placeholder="Select…"
            options={projectTypes}
            invalid={!!errors.projectType}
          />
        </Field>
        <Field label="Budget" htmlFor="budget" error={errors.budget}>
          <Select
            id="budget"
            value={values.budget}
            onChange={(v) => update('budget', v)}
            placeholder="Select…"
            options={budgets}
            invalid={!!errors.budget}
          />
        </Field>
        <Field label="Timeline" htmlFor="timeline" error={errors.timeline}>
          <Select
            id="timeline"
            value={values.timeline}
            onChange={(v) => update('timeline', v)}
            placeholder="Select…"
            options={timelines}
            invalid={!!errors.timeline}
          />
        </Field>
      </div>

      {/* Message */}
      <Field label="Project details" htmlFor="message" error={errors.message} required>
        <textarea
          id="message"
          rows={5}
          value={values.message}
          onChange={(e) => update('message', e.target.value)}
          className={inputCls(!!errors.message) + ' resize-y'}
          placeholder="What are you building, what’s the goal, and where do you need help?"
        />
      </Field>

      {/* Honeypot — visually hidden, off the tab order. Bots fill it; humans don't. */}
      <div className="absolute left-[-9999px]" aria-hidden>
        <label htmlFor="website">Website</label>
        <input
          id="website"
          type="text"
          tabIndex={-1}
          autoComplete="off"
          value={values.website}
          onChange={(e) => update('website', e.target.value)}
        />
      </div>

      <div className="flex flex-col gap-4 pt-2 sm:flex-row sm:items-center sm:justify-between">
        <button
          type="submit"
          disabled={status === 'submitting'}
          className="br-data inline-flex items-center justify-center gap-2 rounded-[var(--br-tag-radius)] bg-[var(--br-ink)] px-7 py-3.5 text-sm font-semibold uppercase tracking-[0.04em] text-white transition-opacity hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-60"
        >
          {status === 'submitting' ? 'Sending…' : 'Send message'}
          {status !== 'submitting' && <span aria-hidden>→</span>}
        </button>
        <p className="max-w-xs text-[13px] leading-snug text-[var(--br-muted-2)]">{formNote}</p>
      </div>
    </form>
  )
}

/* ── small building blocks ────────────────────────────────────────────────── */

function inputCls(invalid: boolean): string {
  return (
    'w-full rounded-[var(--br-tag-radius)] border bg-white px-3.5 py-3 text-[15px] text-[var(--br-body)] ' +
    'placeholder:text-[var(--br-muted-2)] transition-colors outline-none ' +
    'focus:border-[var(--br-ink)] focus:ring-1 focus:ring-[var(--br-ink)] ' +
    (invalid ? 'border-[#d99a9a]' : 'border-[var(--br-stroke)]')
  )
}

function Field({
  label,
  htmlFor,
  error,
  hint,
  required = false,
  children,
}: {
  label: string
  htmlFor: string
  error?: string
  hint?: string
  required?: boolean
  children: React.ReactNode
}) {
  return (
    <div>
      <div className="mb-2 flex items-baseline justify-between gap-2">
        <label
          htmlFor={htmlFor}
          className="text-[12px] font-semibold uppercase tracking-[0.12em] text-[var(--br-muted-2)]"
        >
          {label}
          {required && <span className="ml-0.5 text-[var(--br-gold)]">*</span>}
        </label>
        {hint && <span className="text-[12px] text-[var(--br-muted-2)]">{hint}</span>}
      </div>
      {children}
      {error && <p className="mt-1.5 text-[13px] text-[#8a2b2b]">{error}</p>}
    </div>
  )
}

/**
 * Native <select> styled to match the inputs, with a custom chevron. Native is
 * deliberate: it's accessible, keyboard-friendly, and renders the OS picker on
 * mobile — the right call for a contact form.
 */
function Select({
  id,
  value,
  onChange,
  options,
  placeholder,
  invalid,
}: {
  id: string
  value: string
  onChange: (v: string) => void
  options: string[]
  placeholder: string
  invalid: boolean
}) {
  return (
    <div className="relative">
      <select
        id={id}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className={
          inputCls(invalid) +
          ' appearance-none pr-9 ' +
          (value ? 'text-[var(--br-body)]' : 'text-[var(--br-muted-2)]')
        }
      >
        <option value="">{placeholder}</option>
        {options.map((opt) => (
          <option key={opt} value={opt} className="text-[var(--br-body)]">
            {opt}
          </option>
        ))}
      </select>
      <span
        aria-hidden
        className="pointer-events-none absolute right-3.5 top-1/2 -translate-y-1/2 text-[var(--br-muted-2)]"
      >
        <svg width="12" height="8" viewBox="0 0 12 8" fill="none">
          <path d="M1 1.5L6 6.5L11 1.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </span>
    </div>
  )
}
