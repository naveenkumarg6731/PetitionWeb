import { motion } from 'framer-motion'
import {
  HERO_DESCRIPTION,
  HERO_HEADLINE,
  WEBSITE_SUBTITLE,
  WEBSITE_TITLE,
} from '../constants/petitionText'

function HeroSection({ supporterCount, onOpenSign }) {
  return (
    <section className="grid gap-4 rounded-3xl border border-red-300/35 bg-white/10 p-5 shadow-2xl shadow-black/40 backdrop-blur-xl sm:p-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="space-y-4"
      >
        <p className="inline-flex w-fit rounded-full border border-amber-300/40 bg-black/45 px-3 py-1 text-xs font-semibold text-amber-100 sm:text-sm">
          {WEBSITE_SUBTITLE}
        </p>
        <h1 className="text-3xl font-extrabold leading-tight text-white sm:text-5xl">{WEBSITE_TITLE}</h1>
        <h2 className="text-2xl font-bold text-amber-200 sm:text-3xl">{HERO_HEADLINE}</h2>
        <p className="max-w-4xl text-sm leading-relaxed text-zinc-100 sm:text-lg">{HERO_DESCRIPTION}</p>
        <button
          type="button"
          onClick={onOpenSign}
          className="inline-flex rounded-xl bg-red-800 px-5 py-3 text-sm font-semibold text-white transition duration-300 hover:-translate-y-0.5 hover:bg-red-700"
        >
          நானும் கையெழுத்திடுகிறேன்
        </button>
      </motion.div>

      <div className="grid gap-3 sm:grid-cols-[1fr_auto] sm:items-center">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.2, duration: 0.4 }}
          className="rounded-2xl border border-red-300/40 bg-gradient-to-r from-red-950 to-red-700 px-5 py-4 text-white"
        >
          <p className="text-xs uppercase tracking-widest text-red-100">மொத்த ஆதரவாளர்கள்</p>
          <p className="mt-1 text-3xl font-bold sm:text-4xl">{supporterCount.toLocaleString('en-IN')}</p>
        </motion.div>

        <div className="rounded-xl border border-amber-300/50 bg-black/35 px-4 py-3 text-xs text-amber-100">
          This petition is intended to be submitted to Tamil Nadu leadership and police authorities.
        </div>
      </div>
    </section>
  )
}

export default HeroSection
