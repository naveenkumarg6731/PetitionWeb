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
      className="rounded-2xl border border-red-300/35 bg-white/10 p-5 shadow-xl shadow-black/25 backdrop-blur sm:p-6"
    >
      <div className="mb-5 flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
        <h2 className="text-2xl font-bold text-amber-200">ஆதரவாளர்கள் பட்டியல்</h2>
        <p className="text-sm text-zinc-200">பெயர், மாவட்டம், கையொப்பம், பதிவு தேதி</p>
      </div>

      {loadError ? (
        <p className="rounded-lg border border-amber-300/40 bg-amber-200/10 px-3 py-3 text-sm text-amber-100">
          {loadError}
        </p>
      ) : null}

      {isLoading ? (
        <div className="grid gap-4 sm:grid-cols-2">
          {Array.from({ length: 4 }).map((_, index) => (
            <div
              key={`skeleton-${index}`}
              className="loading-pulse rounded-xl border border-red-200/20 bg-black/30 p-4"
            >
              <div className="h-4 w-2/3 rounded bg-red-200/30" />
              <div className="mt-3 h-3 w-1/2 rounded bg-red-200/30" />
              <div className="mt-4 h-24 rounded-lg bg-red-200/30" />
            </div>
          ))}
        </div>
      ) : null}

      {!isLoading && supporters.length === 0 ? (
        <p className="rounded-lg border border-red-300/30 bg-black/30 px-3 py-4 text-sm text-zinc-100">
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
              className="rounded-xl border border-red-300/25 bg-black/35 p-4 shadow-lg"
            >
              <h3 className="text-lg font-bold text-amber-200">{supporter.name}</h3>
              <p className="mt-1 text-sm text-zinc-100">மாவட்டம்: {supporter.district}</p>
              <p className="mt-1 text-xs text-zinc-300">
                {supporter.createdAt
                  ? dateFormatter.format(new Date(supporter.createdAt))
                  : 'தேதி கிடைக்கவில்லை'}
              </p>
              {supporter.message ? (
                <p className="mt-1 text-xs italic text-zinc-200">"{supporter.message}"</p>
              ) : null}
              <img
                src={supporter.signatureUrl}
                alt={`${supporter.name} கையொப்பம்`}
                className="mt-3 h-24 w-full rounded-lg border border-red-200/30 bg-white object-contain"
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
