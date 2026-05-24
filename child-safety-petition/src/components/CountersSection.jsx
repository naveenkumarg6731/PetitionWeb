import { motion } from 'framer-motion'

function CounterCard({ label, value }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.2 }}
      className="rounded-xl border border-amber-300/30 bg-black/35 p-4 backdrop-blur"
    >
      <p className="text-xs uppercase tracking-widest text-amber-200">{label}</p>
      <p className="mt-2 text-3xl font-black text-white">{value}</p>
    </motion.div>
  )
}

function CountersSection({ stats }) {
  return (
    <section className="grid gap-3 sm:grid-cols-3">
      <CounterCard label="Total Signatures" value={stats.totalSignatures.toLocaleString('en-IN')} />
      <CounterCard
        label="Districts Participated"
        value={stats.districtsParticipated.toLocaleString('en-IN')}
      />
      <CounterCard label="Today's Supporters" value={stats.todaysSupporters.toLocaleString('en-IN')} />
    </section>
  )
}

export default CountersSection
