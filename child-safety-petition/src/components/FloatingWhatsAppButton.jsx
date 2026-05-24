const whatsappMessage = encodeURIComponent(
  'குழந்தைகள் பாதுகாப்பு மனுவில் நீங்களும் கையொப்பமிடுங்கள். இந்த மனுவை பகிர்ந்து விழிப்புணர்வை ஏற்படுத்துங்கள்.',
)

function FloatingWhatsAppButton() {
  const shareUrl = encodeURIComponent(window.location.href)
  const href = `https://wa.me/?text=${whatsappMessage}%20${shareUrl}`

  return (
    <a
      href={href}
      target="_blank"
      rel="noreferrer"
      className="fixed bottom-5 right-4 z-30 inline-flex items-center gap-2 rounded-full border border-green-300 bg-green-600 px-4 py-3 text-sm font-semibold text-white shadow-lg shadow-green-700/30 transition hover:-translate-y-0.5 hover:bg-green-500 sm:right-6"
      aria-label="WhatsApp இல் பகிரவும்"
    >
      <span className="text-lg">↗</span>
      <span>WhatsApp பகிர்வு</span>
    </a>
  )
}

export default FloatingWhatsAppButton
