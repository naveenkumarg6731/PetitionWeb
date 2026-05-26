function FooterSection() {
  return (
    <footer className="mt-12 rounded-2xl border border-red-200 bg-white/95 p-6 text-sm text-zinc-700 shadow-sm">
      <p className="font-semibold">பொதுமக்கள் மனு குழு</p>
      <p>குழந்தைகள் பாதுகாப்பு விழிப்புணர்வு முயற்சி</p>
      <p>தமிழ்நாடு மக்கள் ஒருங்கிணைப்பு</p>
      <div className="mt-3 flex gap-3 text-xs text-red-800">
        <a href="https://x.com" target="_blank" rel="noreferrer">X</a>
        <a href="https://facebook.com" target="_blank" rel="noreferrer">Facebook</a>
        <a href="https://instagram.com" target="_blank" rel="noreferrer">Instagram</a>
      </div>
    </footer>
  )
}

export default FooterSection
