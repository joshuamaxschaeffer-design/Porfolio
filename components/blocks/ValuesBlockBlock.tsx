interface ValuesBlockBlockProps {
  heading?: string
  values: Array<{ title: string; description: string }>
}

export function ValuesBlockBlock({ heading, values }: ValuesBlockBlockProps) {
  if (!values?.length) return null

  return (
    <section className="container my-16 px-6 md:my-24">
      {heading && (
        <h2 className="mb-10 text-3xl font-semibold tracking-tight md:text-4xl">
          {heading}
        </h2>
      )}
      <div className="grid gap-10 md:grid-cols-3 md:gap-12">
        {values.map((value, i) => (
          <div key={i}>
            <p className="text-sm font-mono uppercase tracking-wider text-neutral-500">
              {String(i + 1).padStart(2, '0')}
            </p>
            <h3 className="mt-3 text-xl font-semibold tracking-tight">{value.title}</h3>
            <p className="mt-3 text-neutral-600 dark:text-neutral-400">{value.description}</p>
          </div>
        ))}
      </div>
    </section>
  )
}
