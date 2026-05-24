import { useMemo, useRef, useState } from 'react'
import SignatureCanvas from 'react-signature-canvas'
import { AnimatePresence, motion } from 'framer-motion'
import { submitSupporter } from '../services/petitionService'

const districts = [
  'சென்னை',
  'கோயம்புத்தூர்',
  'மதுரை',
  'சேலம்',
  'திருச்சி',
  'திருநெல்வேலி',
  'ஈரோடு',
  'வேலூர்',
  'கன்னியாகுமரி',
  'மற்ற மாவட்டம்',
]

const SUBMIT_COOLDOWN_MS = 90_000

function SignatureModal({ open, onClose, supporters, onSuccess }) {
  const signatureRef = useRef(null)
  const [activeTab, setActiveTab] = useState('draw')
  const [firstName, setFirstName] = useState('')
  const [lastName, setLastName] = useState('')
  const [mobile, setMobile] = useState('')
  const [district, setDistrict] = useState(districts[0])
  const [message, setMessage] = useState('')
  const [otp, setOtp] = useState('')
  const [uploadedSignature, setUploadedSignature] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const [signaturePreview, setSignaturePreview] = useState('')

  const existingMobiles = useMemo(
    () => new Set(supporters.map((item) => item.mobile).filter(Boolean)),
    [supporters],
  )

  const clearSignature = () => {
    signatureRef.current?.clear()
    setUploadedSignature('')
    setSignaturePreview('')
  }

  const getSignatureData = () => {
    if (activeTab === 'upload') {
      return uploadedSignature
    }

    if (!signatureRef.current || signatureRef.current.isEmpty()) {
      return ''
    }

    return signatureRef.current.getTrimmedCanvas().toDataURL('image/png')
  }

  const updateDrawPreview = () => {
    const nextSignature = getSignatureData()
    if (nextSignature) {
      setSignaturePreview(nextSignature)
    }
  }

  const onUploadSignature = (event) => {
    const file = event.target.files?.[0]
    if (!file) {
      return
    }

    const reader = new FileReader()
    reader.onload = () => {
      const value = String(reader.result || '')
      setUploadedSignature(value)
      setSignaturePreview(value)
    }
    reader.readAsDataURL(file)
  }

  const handleSubmit = async (event) => {
    event.preventDefault()
    setError('')

    const normalizedMobile = mobile.replace(/\D/g, '')
    const fullName = `${firstName.trim()} ${lastName.trim()}`.trim()

    if (firstName.trim().length < 2 || lastName.trim().length < 1) {
      setError('First name and last name are required.')
      return
    }

    if (normalizedMobile && normalizedMobile.length !== 10) {
      setError('If mobile is entered, it must be a valid 10-digit number.')
      return
    }

    if (normalizedMobile && existingMobiles.has(normalizedMobile)) {
      setError('இந்த எண்ணில் ஏற்கனவே பதிவு செய்யப்பட்டுள்ளது.')
      return
    }

    const previousSubmit = Number(localStorage.getItem('petition_last_submit') || '0')
    const now = new Date().getTime()
    if (now - previousSubmit < SUBMIT_COOLDOWN_MS) {
      setError('Please wait a moment before another submission.')
      return
    }

    const signatureDataUrl = getSignatureData()
    if (!signatureDataUrl) {
      setError('Signature is required. Draw or upload to continue.')
      return
    }

    setLoading(true)

    try {
      const newSupporter = await submitSupporter({
        name: fullName,
        mobile: normalizedMobile,
        district,
        message,
        signatureDataUrl,
      })

      localStorage.setItem('petition_last_submit', String(now))
      onSuccess(newSupporter)
      setFirstName('')
      setLastName('')
      setMobile('')
      setDistrict(districts[0])
      setMessage('')
      setOtp('')
      clearSignature()
      onClose()
    } catch (submitError) {
      setError(submitError.message || 'Submission failed. Please retry.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <AnimatePresence>
      {open ? (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 grid place-items-center bg-black/70 p-3"
        >
          <motion.div
            initial={{ scale: 0.95, opacity: 0, y: 20 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.95, opacity: 0 }}
            className="w-full max-w-2xl rounded-2xl border border-red-300/40 bg-white p-4 shadow-2xl sm:p-6"
          >
            <div className="mb-4 flex items-start justify-between gap-3">
              <div>
                <h3 className="text-xl font-bold text-red-950">நானும் கையெழுத்திடுகிறேன்</h3>
                <p className="text-sm text-zinc-600">Sign this public petition for child safety.</p>
              </div>
              <button
                type="button"
                onClick={onClose}
                className="rounded-lg border border-red-200 px-3 py-1 text-sm text-red-900"
              >
                Close
              </button>
            </div>

            <form onSubmit={handleSubmit} className="grid gap-3">
              <div className="grid gap-3 sm:grid-cols-3">
                <label className="grid gap-1 text-xs font-semibold text-zinc-700">
                  First Name *
                  <input
                    value={firstName}
                    onChange={(event) => setFirstName(event.target.value)}
                    placeholder="First Name"
                    className="rounded-lg border border-red-200 bg-white px-3 py-2 text-sm font-medium text-zinc-900 placeholder:text-zinc-400"
                    required
                  />
                </label>
                <label className="grid gap-1 text-xs font-semibold text-zinc-700">
                  Last Name *
                  <input
                    value={lastName}
                    onChange={(event) => setLastName(event.target.value)}
                    placeholder="Last Name"
                    className="rounded-lg border border-red-200 bg-white px-3 py-2 text-sm font-medium text-zinc-900 placeholder:text-zinc-400"
                    required
                  />
                </label>
                <label className="grid gap-1 text-xs font-semibold text-zinc-700">
                  Mobile Number (Optional)
                  <input
                    value={mobile}
                    onChange={(event) => setMobile(event.target.value)}
                    placeholder="Mobile Number"
                    className="rounded-lg border border-red-200 bg-white px-3 py-2 text-sm font-medium text-zinc-900 placeholder:text-zinc-400"
                  />
                </label>
              </div>

              <div className="grid gap-3 sm:grid-cols-2">
                <select
                  value={district}
                  onChange={(event) => setDistrict(event.target.value)}
                  className="rounded-lg border border-red-200 bg-white px-3 py-2 text-sm font-medium text-zinc-900"
                >
                  {districts.map((item) => (
                    <option key={item} value={item}>
                      {item}
                    </option>
                  ))}
                </select>
                <input
                  value={otp}
                  onChange={(event) => setOtp(event.target.value)}
                  placeholder="OTP (optional)"
                  className="rounded-lg border border-red-200 bg-white px-3 py-2 text-sm font-medium text-zinc-900 placeholder:text-zinc-400"
                />
              </div>

              <textarea
                value={message}
                onChange={(event) => setMessage(event.target.value)}
                rows={3}
                placeholder="Optional message"
                className="rounded-lg border border-red-200 bg-white px-3 py-2 text-sm font-medium text-zinc-900 placeholder:text-zinc-400"
              />

              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={() => setActiveTab('draw')}
                  className={`rounded-lg px-3 py-1.5 text-sm ${
                    activeTab === 'draw' ? 'bg-red-900 text-white' : 'border border-red-200 text-red-900'
                  }`}
                >
                  Draw Signature
                </button>
                <button
                  type="button"
                  onClick={() => setActiveTab('upload')}
                  className={`rounded-lg px-3 py-1.5 text-sm ${
                    activeTab === 'upload' ? 'bg-red-900 text-white' : 'border border-red-200 text-red-900'
                  }`}
                >
                  Upload Signature
                </button>
              </div>

              {activeTab === 'draw' ? (
                <div className="rounded-xl border border-red-200 p-2">
                  <SignatureCanvas
                    ref={signatureRef}
                    penColor="#7f1d1d"
                    onEnd={updateDrawPreview}
                    canvasProps={{ className: 'signature-canvas' }}
                  />
                </div>
              ) : (
                <label className="grid gap-2 rounded-xl border border-red-200 p-3 text-sm">
                  <span>Upload signature image</span>
                  <input type="file" accept="image/*" onChange={onUploadSignature} />
                </label>
              )}

              {signaturePreview ? (
                <div className="rounded-lg border border-red-200 bg-red-50/40 p-2">
                  <p className="mb-1 text-xs font-semibold text-red-900">Preview</p>
                  <img src={signaturePreview} alt="Signature preview" className="h-20 object-contain" />
                </div>
              ) : null}

              {error ? <p className="text-sm text-red-700">{error}</p> : null}

              <div className="flex justify-end gap-2">
                <button
                  type="button"
                  onClick={clearSignature}
                  className="rounded-lg border border-red-200 px-3 py-2 text-sm text-red-900"
                >
                  Clear
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  className="rounded-lg bg-red-900 px-4 py-2 text-sm font-semibold text-white"
                >
                  {loading ? 'Submitting...' : 'Submit Signature'}
                </button>
              </div>
            </form>
          </motion.div>
        </motion.div>
      ) : null}
    </AnimatePresence>
  )
}

export default SignatureModal
