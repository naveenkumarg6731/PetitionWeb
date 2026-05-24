import { motion } from 'framer-motion'
import { downloadPetitionPdf } from '../utils/downloadPetitionPdf'

function HeroSection({ supporterCount }) {
  return (
    <section className="grid gap-4 rounded-3xl border border-red-200 bg-white/95 p-5 shadow-xl shadow-red-200/45 sm:p-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="space-y-4"
      >
        <p className="inline-flex w-fit rounded-full border border-red-300 bg-red-50 px-3 py-1 text-xs font-semibold text-red-900 sm:text-sm">
          மக்கள் மனு | Public Petition
        </p>
        <h1 className="text-3xl font-extrabold leading-tight text-red-950 sm:text-5xl">
          குழந்தைகள் பாதுகாப்புக்காக ஒன்றிணைவோம்
        </h1>
        <p className="max-w-4xl text-sm leading-relaxed text-zinc-700 sm:text-lg">
          கோயம்புத்தூர் சிறுமி சம்பவத்திற்கு நீதியும், இனி இதுபோன்ற சம்பவங்கள் நடக்காத பாதுகாப்பான
          தமிழ்நாட்டும் உறுதி செய்யும் நோக்கில் இந்த பொதுமக்கள் மனு உருவாக்கப்பட்டுள்ளது.
        </p>
      </motion.div>

      <div className="grid gap-3 sm:grid-cols-[1fr_auto] sm:items-center">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.2, duration: 0.4 }}
          className="rounded-2xl border border-red-300 bg-gradient-to-r from-red-900 to-red-700 px-5 py-4 text-white"
        >
          <p className="text-xs uppercase tracking-widest text-red-100">மொத்த ஆதரவாளர்கள்</p>
          <p className="mt-1 text-3xl font-bold sm:text-4xl">{supporterCount.toLocaleString('en-IN')}</p>
        </motion.div>

        <button
          type="button"
          onClick={downloadPetitionPdf}
          className="inline-flex items-center justify-center rounded-xl border border-red-300 bg-white px-5 py-3 text-sm font-semibold text-red-900 transition duration-300 hover:-translate-y-0.5 hover:bg-red-50"
        >
          மனுவை PDF ஆக பதிவிறக்கவும்
        </button>
      </div>
    </section>
  )
}

export default HeroSection
