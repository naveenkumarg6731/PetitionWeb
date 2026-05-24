function ThemeToggle({ isDarkMode, onToggle }) {
  return (
    <button
      type="button"
      onClick={onToggle}
      className="inline-flex items-center rounded-full border border-amber-300/50 bg-white/10 px-3 py-1.5 text-xs font-semibold text-amber-100 backdrop-blur transition hover:bg-white/20"
      aria-label="Toggle dark mode"
    >
      {isDarkMode ? 'Light' : 'Dark'} Mode
    </button>
  )
}

export default ThemeToggle
