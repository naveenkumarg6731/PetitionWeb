import { useEffect, useMemo, useState } from 'react'
import { motion } from 'framer-motion'
import TopBanner from './components/TopBanner'
import HeroSection from './components/HeroSection'
import PetitionContent from './components/PetitionContent'
import SignatureForm from './components/SignatureForm'
import SupportersSection from './components/SupportersSection'
import FloatingWhatsAppButton from './components/FloatingWhatsAppButton'
import { listenSupporters } from './services/petitionService'

function App() {
  const [supporters, setSupporters] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [loadError, setLoadError] = useState('')

  useEffect(() => {
    const unsubscribe = listenSupporters(
      (items) => {
        setSupporters(items)
        setIsLoading(false)
        setLoadError('')
      },
      (errorMessage) => {
        setIsLoading(false)
        setLoadError(errorMessage)
      },
    )

    return () => unsubscribe()
  }, [])

  const supporterCount = useMemo(() => supporters.length, [supporters])

  return (
    <div className="relative min-h-screen overflow-hidden bg-stone-50 text-zinc-900">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_20%_20%,rgba(127,29,29,0.15),transparent_45%),radial-gradient(circle_at_80%_0%,rgba(153,27,27,0.15),transparent_35%),linear-gradient(180deg,#fff_0%,#fff6f6_45%,#ffffff_100%)]" />

      <TopBanner />

      <main className="relative z-10 mx-auto flex w-full max-w-6xl flex-col gap-7 px-4 pb-16 pt-6 sm:px-6 lg:px-8">
        <HeroSection supporterCount={supporterCount} />

        <PetitionContent />

        <motion.section
          initial={{ opacity: 0, y: 22 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.2 }}
          transition={{ duration: 0.5, ease: 'easeOut' }}
          className="grid gap-4 rounded-2xl border border-red-200 bg-white/95 p-5 shadow-lg shadow-red-200/40 backdrop-blur sm:p-6"
        >
          <h2 className="text-2xl font-bold text-red-950">உங்கள் ஆதரவை பதிவு செய்யுங்கள்</h2>
          <p className="text-sm leading-relaxed text-zinc-700 sm:text-base">
            கீழே உள்ள விவரங்களை நிரப்பி கையொப்பமிட்டு மனுவுக்கு ஆதரவு தெரிவியுங்கள்.
          </p>
          <SignatureForm onSubmitted={setSupporters} supporters={supporters} />
        </motion.section>

        <SupportersSection
          supporters={supporters}
          isLoading={isLoading}
          loadError={loadError}
        />
      </main>

      <FloatingWhatsAppButton />
    </div>
  )
}

export default App
