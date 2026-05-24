function ParticleBackground() {
  return (
    <div className="pointer-events-none fixed inset-0 -z-10 overflow-hidden">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_20%,rgba(139,0,0,0.28),transparent_40%),radial-gradient(circle_at_85%_10%,rgba(184,134,11,0.22),transparent_30%),linear-gradient(180deg,#1a0404_0%,#200707_40%,#0c0c0c_100%)]" />
      {Array.from({ length: 24 }).map((_, index) => (
        <span
          key={`particle-${index}`}
          className="particle absolute h-1.5 w-1.5 rounded-full bg-amber-300/70"
          style={{
            left: `${(index * 17) % 100}%`,
            top: `${(index * 13) % 100}%`,
            animationDelay: `${index * 0.2}s`,
            animationDuration: `${6 + (index % 6)}s`,
          }}
        />
      ))}
    </div>
  )
}

export default ParticleBackground
