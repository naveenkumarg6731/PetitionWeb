import { motion } from 'framer-motion'
import { DEMANDS, PETITION_DRAFT } from '../constants/petitionText'

function PetitionContent() {
  return (
    <motion.section
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.2 }}
      transition={{ duration: 0.5, ease: 'easeOut' }}
      className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:p-7"
    >
      <h2 className="mb-4 text-2xl font-bold text-slate-900">மனு வரைவு</h2>
      <pre className="whitespace-pre-wrap text-sm leading-8 text-zinc-800 sm:text-base">
        {PETITION_DRAFT}
      </pre>

      <div className="mt-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {DEMANDS.map((item) => (
          <article key={item.id} className="rounded-xl border border-slate-200 bg-slate-50 p-4">
            <h3 className="text-sm font-bold text-slate-800">{item.title}</h3>
            <p className="mt-1 text-sm leading-relaxed text-zinc-700">{item.detail}</p>
          </article>
        ))}
      </div>
    </motion.section>
  )
}

export default PetitionContent
