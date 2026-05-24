import { getAdminToken } from './authService'

const API = '/.netlify/functions'

export const normalizePhone = (value) => value.replace(/\D/g, '')

const todayBoundary = () => {
  const now = new Date()
  now.setHours(0, 0, 0, 0)
  return now.getTime()
}

const buildLocalSupporter = ({ name, mobile, district, message, signatureDataUrl }) => {
  const createdAt = Date.now()
  const fallbackId = mobile || `no-mobile-${createdAt}-${Math.random().toString(36).slice(2, 8)}`

  return {
    id: fallbackId,
    name: String(name || '').trim(),
    mobile,
    district,
    message: String(message || '').trim(),
    signatureUrl: signatureDataUrl,
    createdAt,
  }
}

const requestJson = async (url, options = {}) => {
  const response = await fetch(url, options)
  const payload = await response.json().catch(() => ({}))

  if (!response.ok) {
    throw new Error(payload.error || 'Request failed')
  }

  return payload
}

export const submitSupporter = async ({ name, mobile, district, message, signatureDataUrl }) => {
  const normalizedMobile = normalizePhone(mobile)

  try {
    return await requestJson(`${API}/submit-supporter`, {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify({
        name,
        mobile: normalizedMobile,
        district,
        message,
        signatureDataUrl,
      }),
    })
  } catch (error) {
    if (error instanceof Error && error.message.includes('ஏற்கனவே பதிவு')) {
      throw error
    }

    return buildLocalSupporter({
      name,
      mobile: normalizedMobile,
      district,
      message,
      signatureDataUrl,
    })
  }
}

export const listenSupporters = (onData, onError) => {
  let disposed = false

  const fetchSupporters = async () => {
    try {
      const payload = await requestJson(`${API}/supporters`)
      if (!disposed) {
        onData(payload.supporters || [])
      }
    } catch {
      if (!disposed) {
        onData([])
        onError('Netlify backend not reachable. Running in local mode.')
      }
    }
  }

  fetchSupporters()
  const timer = setInterval(fetchSupporters, 5000)

  return () => {
    disposed = true
    clearInterval(timer)
  }
}

export const fetchSupportersByDistrict = async (district) => {
  const query = district ? `?district=${encodeURIComponent(district)}` : ''
  const payload = await requestJson(`${API}/supporters${query}`)
  return payload.supporters || []
}

export const deleteSupporter = async (id) => {
  const token = getAdminToken()

  if (!token) {
    throw new Error('Admin session expired. Please login again.')
  }

  await requestJson(`${API}/delete-supporter`, {
    method: 'POST',
    headers: {
      'content-type': 'application/json',
      authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({ id }),
  })
}

export const computeStats = (supporters) => {
  const districts = new Set(supporters.map((item) => item.district).filter(Boolean))
  const todayStart = todayBoundary()
  const todaysSupporters = supporters.filter((item) => Number(item.createdAt) >= todayStart).length

  return {
    totalSignatures: supporters.length,
    districtsParticipated: districts.size,
    todaysSupporters,
  }
}
