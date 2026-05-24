function RecentSupportersTicker({ supporters }) {
  if (!supporters.length) {
    return null
  }

  const text = supporters
    .slice(0, 12)
    .map((item) => `${item.name} (${item.district})`)
    .join('  •  ')

  return (
    <div className="overflow-hidden rounded-xl border border-red-300/50 bg-black/40 px-4 py-2 text-xs text-amber-100">
      <div className="ticker whitespace-nowrap">{`${text}  •  ${text}`}</div>
    </div>
  )
}

export default RecentSupportersTicker
