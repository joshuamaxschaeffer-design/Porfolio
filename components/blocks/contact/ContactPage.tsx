import { intro } from './data'
import { ContactForm } from './ContactForm'

/**
 * Contact page — split hero layout, fully responsive.
 *
 * Desktop: a two-column split — big editorial hero text on the left, the
 * structured inquiry form (fields + dropdowns) in a card on the right. The
 * left column is sticky so the headline holds while the form scrolls. Mobile:
 * the two columns stack, hero first, form below. Reuses the br-* design system
 * so it matches the rest of the site.
 *
 * Server component; the interactive form is the only client island.
 */
export function ContactPage() {
  return (
    <article className="br-article bg-white">
      <div className="br-container grid grid-cols-1 items-start gap-12 pt-24 pb-24 md:pt-36 md:pb-32 lg:grid-cols-[1fr_1fr] lg:gap-20 xl:gap-28">
        {/* Hero — left */}
        <header className="lg:sticky lg:top-32">
          <p className="br-data text-xs font-semibold uppercase tracking-[0.2em] text-[var(--br-gold)] md:text-sm">
            {intro.eyebrow}
          </p>
          <h1 className="mt-5 whitespace-pre-line text-[44px] font-medium leading-[1.0] tracking-[-0.02em] text-[var(--br-ink)] md:text-[72px] xl:text-[84px]">
            {intro.heading}
          </h1>
          <p className="mt-7 max-w-md text-lg leading-relaxed text-[var(--br-muted)] md:text-[22px]">
            {intro.lead}
          </p>
        </header>

        {/* Form — right */}
        <div className="rounded-[var(--br-card-radius)] border border-[var(--br-line)] bg-[var(--br-bg-2)] p-6 md:p-9 lg:p-10">
          <ContactForm />
        </div>
      </div>
    </article>
  )
}
