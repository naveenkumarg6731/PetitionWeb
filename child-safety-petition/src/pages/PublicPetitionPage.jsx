import { useEffect, useMemo, useState } from 'react'
import { motion } from 'framer-motion'
import CountersSection from '../components/CountersSection'
import FloatingWhatsAppButton from '../components/FloatingWhatsAppButton'
import FooterSection from '../components/FooterSection'
import HeroSection from '../components/HeroSection'
import PetitionContent from '../components/PetitionContent'
import SignatureModal from '../components/SignatureModal'
import SupportersSection from '../components/SupportersSection'
import TopBanner from '../components/TopBanner'
import ParticleBackground from '../components/ui/ParticleBackground'
import RecentSupportersTicker from '../components/ui/RecentSupportersTicker'
import SocialShareButtons from '../components/ui/SocialShareButtons'
import SuccessPopup from '../components/ui/SuccessPopup'
import ThemeToggle from '../components/ui/ThemeToggle'
import { computeStats, listenSupporters } from '../services/petitionService'

function PublicPetitionPage() {
  const [supporters, setSupporters] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [loadError, setLoadError] = useState('')
  const [showSignModal, setShowSignModal] = useState(true)
  const [isDarkMode, setIsDarkMode] = useState(true)
  const [showSuccess, setShowSuccess] = useState(false)

  useEffect(() => {
    const unsubscribe = listenSupporters(
      (items) => {
        setSupporters(items)
        setLoadError('')
        setIsLoading(false)
      },
      (error) => {
        setLoadError(error)
        setIsLoading(false)
      },
    )

    return () => unsubscribe()
  }, [])

  useEffect(() => {
    document.documentElement.classList.toggle('dark', isDarkMode)
  }, [isDarkMode])

  const stats = useMemo(() => computeStats(supporters), [supporters])

  const onSupportSuccess = (newSupporter) => {
    setSupporters((previous) => [newSupporter, ...previous])
    setShowSuccess(true)
    setTimeout(() => setShowSuccess(false), 2600)
  }

  return (
    <div className="relative min-h-screen text-white">
      <ParticleBackground />
      <TopBanner />

      <main className="mx-auto flex w-full max-w-6xl flex-col gap-6 px-4 pb-16 pt-6 sm:px-6 lg:px-8">
        <div className="flex justify-end">
          <ThemeToggle
            isDarkMode={isDarkMode}
            onToggle={() => setIsDarkMode((previous) => !previous)}
          />
        </div>

        <HeroSection supporterCount={stats.totalSignatures} onOpenSign={() => setShowSignModal(true)} />

        <RecentSupportersTicker supporters={supporters} />

        <CountersSection stats={stats} />

        <motion.section
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.2 }}
          className="rounded-2xl border border-red-300/35 bg-white/10 p-4 backdrop-blur"
        >
          <div className="flex flex-wrap items-center justify-between gap-3">
            <h2 className="text-lg font-bold text-amber-200">Share this movement</h2>
            <SocialShareButtons />
          </div>
        </motion.section>

        <PetitionContent />

        <SupportersSection supporters={supporters} isLoading={isLoading} loadError={loadError} />

        <FooterSection />
      </main>

      <FloatingWhatsAppButton onOpenSign={() => setShowSignModal(true)} />

      <SignatureModal
        open={showSignModal}
        onClose={() => setShowSignModal(false)}
        supporters={supporters}
        onSuccess={onSupportSuccess}
      />

      <SuccessPopup open={showSuccess} message="உங்கள் கையொப்பம் வெற்றிகரமாக பதிவு செய்யப்பட்டது." />
    </div>
  )
}

export default PublicPetitionPage
