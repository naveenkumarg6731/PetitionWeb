import { SHARE_TEXT } from '../../constants/petitionText'

function SocialShareButtons() {
  const encodedUrl = encodeURIComponent(window.location.href)
  const encodedText = encodeURIComponent(SHARE_TEXT)

  const actions = [
    {
      id: 'wa',
      label: 'WhatsApp',
      href: `https://wa.me/?text=${encodedText}%20${encodedUrl}`,
    },
    {
      id: 'fb',
      label: 'Facebook',
      href: `https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}`,
    },
    {
      id: 'x',
      label: 'Twitter/X',
      href: `https://twitter.com/intent/tweet?text=${encodedText}&url=${encodedUrl}`,
    },
  ]

  const copyLink = async () => {
    await navigator.clipboard.writeText(window.location.href)
  }

  return (
    <div className="flex flex-wrap gap-2">
      {actions.map((item) => (
        <a
          key={item.id}
          href={item.href}
          target="_blank"
          rel="noreferrer"
          className="rounded-lg border border-red-300/60 bg-white/15 px-3 py-1.5 text-xs font-semibold text-white transition hover:bg-white/30"
        >
          {item.label}
        </a>
      ))}
      <button
        type="button"
        onClick={copyLink}
        className="rounded-lg border border-red-300/60 bg-white/15 px-3 py-1.5 text-xs font-semibold text-white transition hover:bg-white/30"
      >
        Copy Link
      </button>
    </div>
  )
}

export default SocialShareButtons
