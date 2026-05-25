import { supabase } from './supabaseClient'
const LOCAL_CACHE_KEY = 'petition_local_supporters'

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

const mergeSupporterLists = (...lists) => {
  const map = new Map()

  lists.flat().forEach((item) => {
    if (item?.id) {
      map.set(item.id, item)
    }
  })

  return Array.from(map.values()).sort((a, b) => Number(b.createdAt || 0) - Number(a.createdAt || 0))
}

const getCachedSupporters = () => {
  try {
    const raw = localStorage.getItem(LOCAL_CACHE_KEY)
    const parsed = raw ? JSON.parse(raw) : []
    return Array.isArray(parsed) ? parsed : []
  } catch {
    return []
  }
}

const saveCachedSupporters = (supporters) => {
  try {
    localStorage.setItem(LOCAL_CACHE_KEY, JSON.stringify(supporters))
  } catch {
    // Ignore cache write failures (quota exceeded/private mode).
  }
}

const addToCache = (supporter) => {
  const next = mergeSupporterLists([supporter], getCachedSupporters())
  saveCachedSupporters(next)
  return supporter
}
}

const removeFromCache = (id) => {
  saveCachedSupporters(next)
}

const isLocalRuntime = () => {
  if (typeof window === 'undefined') {
    return false
  }

  const host = window.location.hostname
  return host === 'localhost' || host === '127.0.0.1'
}

const requestJson = async (url, options = {}) => {
  const payloadSize = options?.body?.length || 0
  console.log(`Request to ${url} with payload size: ${payloadSize} bytes`)

  const response = await fetch(url, options)
  const raw = await response.text().catch(() => '')

  let payload = {}
  if (raw) {
    try {
      payload = JSON.parse(raw)
    } catch {
      console.warn('Non-JSON response:', raw.slice(0, 200))
    }
  }

  if (!response.ok) {
    console.error(`Request failed with status ${response.status}:`, payload.error || raw)
    if (response.status === 413) {
      throw new Error('Uploaded signature image is too large. Please use a smaller image.')
    }
    throw new Error(payload.error || 'Request failed')
  }

  console.log(`Response from ${url}:`, payload)
  return payload
}

export const submitSupporter = async ({ name, mobile, district, message, signatureDataUrl }) => {
  const normalizedMobile = normalizePhone(mobile)

  if (isLocalRuntime()) {
    const localSupporter = buildLocalSupporter({
      name,
      mobile: normalizedMobile,
      district,
      message,
      signatureDataUrl,
    })
    return addToCache(localSupporter)
  }

  // Upload signature image to Supabase Storage
  let signatureUrl = ''
  if (signatureDataUrl) {
    const res = await fetch(signatureDataUrl)
    const blob = await res.blob()
    const fileName = `signatures/${Date.now()}-${Math.random().toString(36).slice(2, 8)}.jpg`
    const { error: uploadError } = await supabase.storage.from('signatures').upload(fileName, blob, {
      contentType: 'image/jpeg',
      upsert: false,
    })
    if (uploadError) {
      throw new Error('Signature upload failed: ' + uploadError.message)
    }
    signatureUrl = supabase.storage.from('signatures').getPublicUrl(fileName).data.publicUrl
  }

  // Insert supporter data into Supabase
  const { data: supporter, error } = await supabase
    .from('supporters')
    .insert([
      {
        name,
        mobile: normalizedMobile,
        district,
        message,
        signature_url: signatureUrl,
      },
    ])
    .select()
    .single()

  if (error) {
    throw new Error('Could not save supporter: ' + error.message)
  }

  return addToCache({
    ...supporter,
    signatureUrl: signatureUrl,
    createdAt: supporter.created_at ? new Date(supporter.created_at).getTime() : Date.now(),
  })
}

  let disposed = false

  if (isLocalRuntime()) {
    onData(getCachedSupporters())
    return () => {
      disposed = true
    }
  }

  const fetchSupporters = async () => {
    try {
      const { data, error } = await supabase
        .from('supporters')
        .select('*')
        .order('created_at', { ascending: false })
      if (error) throw error
      const list = (data || []).map((item) => ({
        ...item,
        signatureUrl: item.signature_url,
        createdAt: item.created_at ? new Date(item.created_at).getTime() : Date.now(),
      }))
      saveCachedSupporters(list)
      if (!disposed) {
        onData(list)
      }
    } catch {
      if (!disposed) {
        onData(getCachedSupporters())
        onError?.('Supabase backend not reachable. Running in local mode.')
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
  if (isLocalRuntime()) {
    const cache = getCachedSupporters()
    return district ? cache.filter((item) => item.district === district) : cache
  }

  let query = supabase.from('supporters').select('*')
  if (district) {
    query = query.eq('district', district)
  }
  const { data, error } = await query.order('created_at', { ascending: false })
  if (error) throw error
  const list = (data || []).map((item) => ({
    ...item,
    signatureUrl: item.signature_url,
    createdAt: item.created_at ? new Date(item.created_at).getTime() : Date.now(),
  }))
  saveCachedSupporters(list)
  return list
}

export const deleteSupporter = async (id) => {
  if (isLocalRuntime()) {
    removeFromCache(id)
    return
  }

  // Delete supporter from Supabase
  const { error } = await supabase.from('supporters').delete().eq('id', id)
  if (error) throw error
  removeFromCache(id)
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
