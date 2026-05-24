import { useMemo, useRef, useState } from 'react'
import SignatureCanvas from 'react-signature-canvas'
import { motion } from 'framer-motion'
import { submitSupporter } from '../services/petitionService'

const districtOptions = [
  'சென்னை',
  'கோயம்புத்தூர்',
  'மதுரை',
  'சேலம்',
  'திருச்சி',
  'திருநெல்வேலி',
  'வேலூர்',
  'ஈரோடு',
  'கடலூர்',
  'கன்னியாகுமரி',
  'மற்ற மாவட்டம்',
]

function SignatureForm({ onSubmitted, supporters }) {
  const signatureRef = useRef(null)
  const [fullName, setFullName] = useState('')
  const [phoneNumber, setPhoneNumber] = useState('')
  const [district, setDistrict] = useState(districtOptions[0])
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [errorMessage, setErrorMessage] = useState('')
  const [successMessage, setSuccessMessage] = useState('')

  const normalizedNumbers = useMemo(
    () => new Set(supporters.map((item) => item.phoneNumber)),
    [supporters],
  )

  const clearSignature = () => {
    signatureRef.current?.clear()
  }

  const handleSubmit = async (event) => {
    event.preventDefault()
    setErrorMessage('')
    setSuccessMessage('')

    const normalizedPhone = phoneNumber.replace(/\D/g, '')

    if (fullName.trim().length < 3) {
      setErrorMessage('தயவுசெய்து உங்கள் முழுப்பெயரை சரியாக உள்ளிடவும்.')
      return
    }

    if (normalizedPhone.length !== 10) {
      setErrorMessage('10 இலக்க மொபைல் எண்ணை உள்ளிடவும்.')
      return
    }

    if (normalizedNumbers.has(normalizedPhone)) {
      setErrorMessage('இந்த மொபைல் எண்ணில் ஏற்கனவே பதிவு செய்யப்பட்டுள்ளது.')
      return
    }

    if (!signatureRef.current || signatureRef.current.isEmpty()) {
      setErrorMessage('கையொப்பம் இடாமல் சமர்ப்பிக்க முடியாது.')
      return
    }

    setIsSubmitting(true)

    try {
      const signatureDataUrl = signatureRef.current
        .getTrimmedCanvas()
        .toDataURL('image/png')

      const savedSupporter = await submitSupporter({
        fullName,
        phoneNumber: normalizedPhone,
        district,
        signatureDataUrl,
      })

      onSubmitted((prev) => [savedSupporter, ...prev])
      setSuccessMessage('உங்கள் ஆதரவு வெற்றிகரமாக பதிவு செய்யப்பட்டது. நன்றி!')
      setFullName('')
      setPhoneNumber('')
      setDistrict(districtOptions[0])
      clearSignature()
    } catch (error) {
      setErrorMessage(error.message || 'சமர்ப்பிப்பில் பிழை ஏற்பட்டது. மீண்டும் முயற்சிக்கவும்.')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="grid gap-4">
      <div className="grid gap-4 sm:grid-cols-2">
        <label className="grid gap-2 text-sm font-medium text-zinc-800">
          Full Name
          <input
            type="text"
            value={fullName}
            onChange={(event) => setFullName(event.target.value)}
            className="rounded-xl border border-red-200 bg-white px-3 py-3 text-sm outline-none ring-red-300 transition focus:ring"
            placeholder="உங்கள் முழுப் பெயர்"
            required
          />
        </label>

        <label className="grid gap-2 text-sm font-medium text-zinc-800">
          Phone Number
          <input
            type="tel"
            value={phoneNumber}
            onChange={(event) => setPhoneNumber(event.target.value)}
            className="rounded-xl border border-red-200 bg-white px-3 py-3 text-sm outline-none ring-red-300 transition focus:ring"
            placeholder="9876543210"
            required
          />
        </label>
      </div>

      <label className="grid gap-2 text-sm font-medium text-zinc-800">
        District
        <select
          value={district}
          onChange={(event) => setDistrict(event.target.value)}
          className="rounded-xl border border-red-200 bg-white px-3 py-3 text-sm outline-none ring-red-300 transition focus:ring"
          required
        >
          {districtOptions.map((districtName) => (
            <option key={districtName} value={districtName}>
              {districtName}
            </option>
          ))}
        </select>
      </label>

      <div className="space-y-2">
        <p className="text-sm font-medium text-zinc-800">கையொப்பம் (Signature Pad)</p>
        <div className="rounded-xl border border-red-200 bg-white p-2">
          <SignatureCanvas
            ref={signatureRef}
            penColor="#7f1d1d"
            canvasProps={{
              className: 'signature-canvas',
            }}
          />
        </div>
        <button
          type="button"
          onClick={clearSignature}
          className="w-fit rounded-lg border border-red-200 px-3 py-2 text-xs font-semibold text-red-900 transition hover:bg-red-50"
        >
          கையொப்பத்தை அழிக்கவும்
        </button>
      </div>

      {errorMessage ? (
        <p className="rounded-lg border border-red-300 bg-red-50 px-3 py-2 text-sm text-red-800">
          {errorMessage}
        </p>
      ) : null}

      {successMessage ? (
        <p className="rounded-lg border border-emerald-300 bg-emerald-50 px-3 py-2 text-sm text-emerald-700">
          {successMessage}
        </p>
      ) : null}

      <motion.button
        whileTap={{ scale: 0.98 }}
        whileHover={{ scale: 1.01 }}
        type="submit"
        disabled={isSubmitting}
        className="inline-flex items-center justify-center rounded-xl bg-red-900 px-5 py-3 text-sm font-semibold text-white shadow-lg shadow-red-900/30 transition hover:bg-red-800 disabled:cursor-not-allowed disabled:opacity-70"
      >
        {isSubmitting ? 'சமர்ப்பிக்கப்படுகிறது...' : 'ஆதரவு கையொப்பம் சமர்ப்பிக்கவும்'}
      </motion.button>
    </form>
  )
}

export default SignatureForm
