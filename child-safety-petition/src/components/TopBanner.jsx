import { motion } from 'framer-motion'
import { TOP_BANNER_TEXT } from '../constants/petitionText'

function TopBanner() {
  return (
    <motion.header
      initial={{ y: -24, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.45, ease: 'easeOut' }}
      className="sticky top-0 z-30 border-b border-slate-200 bg-white px-4 py-3 text-center text-sm font-semibold tracking-wide text-slate-700 shadow-sm sm:text-base"
    >
      {TOP_BANNER_TEXT}
    </motion.header>
  )
}

export default TopBanner
