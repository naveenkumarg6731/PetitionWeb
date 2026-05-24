import { AnimatePresence, motion } from 'framer-motion'

function SuccessPopup({ open, message }) {
  return (
    <AnimatePresence>
      {open ? (
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 20 }}
          className="fixed bottom-20 right-4 z-40 max-w-sm rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm font-medium text-emerald-800 shadow-xl"
        >
          {message}
        </motion.div>
      ) : null}
    </AnimatePresence>
  )
}

export default SuccessPopup
