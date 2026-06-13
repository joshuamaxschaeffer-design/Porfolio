import { intro, directContact } from './data'
import { ContactForm } from './ContactForm'

/**
 * Contact page — editorial two-column layout, fully responsive.
 *
 * Left: header + the structured inquiry form (the primary path). Right: a quiet
 * direct-contact rail (email, intro call, LinkedIn) for buyers who'd rather not
 * fill a form — senior buyers often prefer a direct line. Reuses the br-*
 * design system so it matches the rest of the site.
 *
 * Server component; the interactive form is the only client island.
 */
export function ContactPage() {
  return (
    <article className="br-article bg-white">
      <header className="br-container pt-16 pb-10 md:pt-24 md:pb-14">
        <p className="br-data text-xs font-semibold uppercase tracking-[0.18em] text-[var(--br-gold)] md:text-sm">
          {intro.eyebrow}
        </p>
        <h1 className="mt-4 max-w-3xl whitespace-pre-line text-[40px] font-medium leading-[1.03] tracking-[-0.01em] text-[var(--br-ink)] md:text-[68px]">
          {intro.heading}
        </h1>
        <p className="mt-6 max-w-2xl text-lg leading-relaxed text-[var(--br-muted)] md:text-[22px]">
          {intro.lead}
        </p>
      </header>

      <div className="br-container grid grid-cols-1 gap-12 border-t border-[var(--br-line)] pt-12 pb-24 md:pb-32 lg:grid-cols-[1.5fr_0.8fr] lg:gap-20">
        {/* Form — primary path */}
        <div className="order-2 lg:order-1">
          <ContactForm />
        </div>

        {/* Direct-contact rail */}
        <aside className="order-1 lg:order-2">
          <div className="rounded-[var(--br-card-radius)] border border-[var(--br-line)] bg-[var(--br-bg-2)] p-7 md:p-8">
            <h2 className="text-[12px] font-semibold uppercase tracking-[0.14em] text-[var(--br-muted-2)]">
              {directContact.heading}
            </h2>

            <ul className="mt-5 space-y-5">
              <li>
                <p className="text-[11px] uppercase tracking-[0.12em] text-[var(--br-muted-2)]">Email</p>
                <a
                  href={`mailto:${directContact.email}`}
                  className="br-data mt-1 block break-all text-[15px] text-[var(--br-ink)] underline decoration-[var(--br-divider)] underline-offset-2 transition-colors hover:decoration-[var(--br-ink)]"
                >
                  {directContact.email}
                </a>
              </li>

              <li>
                <p className="text-[11px] uppercase tracking-[0.12em] text-[var(--br-muted-2)]">Intro call</p>
                <a
                  href={directContact.callHref}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-1 inline-flex items-center gap-1.5 text-[15px] text-[var(--br-ink)] underline decoration-[var(--br-divider)] underline-offset-2 transition-colors hover:decoration-[var(--br-ink)]"
                >
                  {directContact.callLabel}
                  <span aria-hidden>↗</span>
                </a>
              </li>

              <li>
                <p className="text-[11px] uppercase tracking-[0.12em] text-[var(--br-muted-2)]">Elsewhere</p>
                <a
                  href={directContact.linkedinHref}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-1 inline-flex items-center gap-1.5 text-[15px] text-[var(--br-ink)] underline decoration-[var(--br-divider)] underline-offset-2 transition-colors hover:decoration-[var(--br-ink)]"
                >
                  {directContact.linkedinLabel}
                  <span aria-hidden>↗</span>
                </a>
              </li>
            </ul>

            <p className="mt-7 border-t border-[var(--br-line)] pt-5 text-[13px] leading-relaxed text-[var(--br-muted-2)]">
              {directContact.location}
            </p>
          </div>
        </aside>
      </div>
    </article>
  )
}
