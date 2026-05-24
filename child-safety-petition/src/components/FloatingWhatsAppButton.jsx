const whatsappMessage = encodeURIComponent(
  'குழந்தைகள் பாதுகாப்பு மனுவில் நீங்களும் கையொப்பமிடுங்கள். இந்த மனுவை பகிர்ந்து விழிப்புணர்வை ஏற்படுத்துங்கள்.',
)

function FloatingWhatsAppButton({ onOpenSign }) {
  const shareUrl = encodeURIComponent(window.location.href)
  const href = `https://wa.me/?text=${whatsappMessage}%20${shareUrl}`

  return (
    <div className="fixed bottom-4 right-4 z-40 flex flex-col gap-2 sm:right-6">
      <button
        type="button"
        onClick={onOpenSign}
        className="inline-flex items-center justify-center rounded-full border border-red-200/60 bg-red-800 px-4 py-3 text-sm font-bold text-white shadow-xl"
      >
        Support Petition
      </button>
      <a
        href={href}
        target="_blank"
        rel="noreferrer"
        className="inline-flex items-center justify-center rounded-full border border-green-300 bg-green-600 px-4 py-3 text-sm font-semibold text-white shadow-lg shadow-green-700/30 transition hover:-translate-y-0.5 hover:bg-green-500"
        aria-label="WhatsApp இல் பகிரவும்"
      >
        WhatsApp பகிர்வு
      </a>
    </div>
  )
}

export default FloatingWhatsAppButton
