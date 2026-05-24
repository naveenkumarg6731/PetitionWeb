import { motion } from 'framer-motion'

const dateFormatter = new Intl.DateTimeFormat('ta-IN', {
  dateStyle: 'medium',
  timeStyle: 'short',
})

function SupportersSection({ supporters, isLoading, loadError }) {
  return (
    <motion.section
      initial={{ opacity: 0, y: 18 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.2 }}
      transition={{ duration: 0.5 }}
      className="rounded-2xl border border-red-200 bg-white/95 p-5 shadow-lg shadow-red-200/40 sm:p-6"
    >
      <div className="mb-5 flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
        <h2 className="text-2xl font-bold text-red-950">ஆதரவாளர்கள் பட்டியல்</h2>
        <p className="text-sm text-zinc-600">பெயர், மாவட்டம், கையொப்பம், பதிவு தேதி</p>
      </div>

      {loadError ? (
        <p className="rounded-lg border border-amber-300 bg-amber-50 px-3 py-3 text-sm text-amber-800">
          {loadError}
        </p>
      ) : null}

      {isLoading ? (
        <div className="grid gap-4 sm:grid-cols-2">
          {Array.from({ length: 4 }).map((_, index) => (
            <div
              key={`skeleton-${index}`}
              className="loading-pulse rounded-xl border border-red-100 bg-red-50/50 p-4"
            >
              <div className="h-4 w-2/3 rounded bg-red-200/70" />
              <div className="mt-3 h-3 w-1/2 rounded bg-red-200/70" />
              <div className="mt-4 h-24 rounded-lg bg-red-200/70" />
            </div>
          ))}
        </div>
      ) : null}

      {!isLoading && supporters.length === 0 ? (
        <p className="rounded-lg border border-red-200 bg-red-50/40 px-3 py-4 text-sm text-zinc-700">
          இன்னும் ஆதரவாளர்கள் பதிவு செய்யவில்லை. முதல் கையொப்பத்தை நீங்கள் தொடங்கலாம்.
        </p>
      ) : null}

      {!isLoading && supporters.length > 0 ? (
        <div className="grid gap-4 sm:grid-cols-2">
          {supporters.map((supporter, index) => (
            <motion.article
              key={supporter.id}
              initial={{ opacity: 0, y: 14 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.2 }}
              transition={{ duration: 0.3, delay: index * 0.04 }}
              className="rounded-xl border border-red-200 bg-white p-4 shadow-sm"
            >
              <h3 className="text-lg font-bold text-red-900">{supporter.fullName}</h3>
              <p className="mt-1 text-sm text-zinc-600">மாவட்டம்: {supporter.district}</p>
              <p className="mt-1 text-xs text-zinc-500">
                {supporter.submittedAt
                  ? dateFormatter.format(new Date(supporter.submittedAt))
                  : 'தேதி கிடைக்கவில்லை'}
              </p>
              <img
                src={supporter.signatureUrl}
                alt={`${supporter.fullName} கையொப்பம்`}
                className="mt-3 h-24 w-full rounded-lg border border-red-100 object-contain"
                loading="lazy"
              />
            </motion.article>
          ))}
        </div>
      ) : null}
    </motion.section>
  )
}

export default SupportersSection
