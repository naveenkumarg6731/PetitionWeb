import {
  collection,
  deleteDoc,
  doc,
  getDoc,
  getDocs,
  onSnapshot,
  orderBy,
  query,
  setDoc,
  where,
} from 'firebase/firestore'
import { deleteObject, getDownloadURL, ref, uploadString } from 'firebase/storage'
import { db, isFirebaseConfigured, storage } from './firebase'

const SUPPORTERS_COLLECTION = 'supporters'
const configError = 'Firebase configuration missing. Update .env values to enable submissions.'

export const normalizePhone = (value) => value.replace(/\D/g, '')

const todayBoundary = () => {
  const now = new Date()
  now.setHours(0, 0, 0, 0)
  return now.getTime()
}

export const submitSupporter = async ({ name, mobile, district, message, signatureDataUrl }) => {
  const normalizedMobile = normalizePhone(mobile)

  if (!isFirebaseConfigured || !db || !storage) {
    const createdAt = Date.now()
    const fallbackId =
      normalizedMobile || `no-mobile-${createdAt}-${Math.random().toString(36).slice(2, 8)}`

    return {
      id: fallbackId,
      name: name.trim(),
      mobile: normalizedMobile,
      district,
      message: message.trim(),
      signatureUrl: signatureDataUrl,
      createdAt,
    }
  }

  let supporterId = normalizedMobile

  if (normalizedMobile) {
    const existingRef = doc(db, SUPPORTERS_COLLECTION, normalizedMobile)
    const existing = await getDoc(existingRef)

    if (existing.exists()) {
      throw new Error('இந்த மொபைல் எண்ணில் ஏற்கனவே பதிவு உள்ளது.')
    }
  } else {
    supporterId = `no-mobile-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`
  }

  const createdAt = Date.now()
  const supporterRef = doc(db, SUPPORTERS_COLLECTION, supporterId)
  const signatureRef = ref(storage, `signatures/${supporterId}_${createdAt}.png`)

  await uploadString(signatureRef, signatureDataUrl, 'data_url')
  const signatureUrl = await getDownloadURL(signatureRef)

  const payload = {
    id: supporterId,
    name: name.trim(),
    mobile: normalizedMobile,
    district,
    message: message.trim(),
    signatureUrl,
    createdAt,
  }

  await setDoc(supporterRef, payload)
  return payload
}

export const listenSupporters = (onData, onError) => {
  if (!isFirebaseConfigured || !db) {
    onData([])
    onError('Firebase not configured. Running in local submit mode.')
    return () => {}
  }

  const supportersQuery = query(
    collection(db, SUPPORTERS_COLLECTION),
    orderBy('createdAt', 'desc'),
  )

  return onSnapshot(
    supportersQuery,
    (snapshot) => {
      onData(snapshot.docs.map((item) => item.data()))
    },
    () => onError('ஆதரவாளர்கள் தரவைப் பெற முடியவில்லை. பின்னர் முயற்சிக்கவும்.'),
  )
}

export const fetchSupportersByDistrict = async (district) => {
  if (!isFirebaseConfigured || !db) {
    throw new Error(configError)
  }

  const supportersRef = collection(db, SUPPORTERS_COLLECTION)
  const supportersQuery = district
    ? query(supportersRef, where('district', '==', district), orderBy('createdAt', 'desc'))
    : query(supportersRef, orderBy('createdAt', 'desc'))

  const snapshot = await getDocs(supportersQuery)
  return snapshot.docs.map((item) => item.data())
}

export const deleteSupporter = async (id, signatureUrl) => {
  if (!isFirebaseConfigured || !db || !storage) {
    throw new Error(configError)
  }

  await deleteDoc(doc(db, SUPPORTERS_COLLECTION, id))

  if (signatureUrl) {
    try {
      await deleteObject(ref(storage, signatureUrl))
    } catch {
      // Signature might have already been removed or URL may be invalid.
    }
  }
}

export const computeStats = (supporters) => {
  const districts = new Set(supporters.map((item) => item.district).filter(Boolean))
  const todayStart = todayBoundary()
  const todaysSupporters = supporters.filter((item) => item.createdAt >= todayStart).length

  return {
    totalSignatures: supporters.length,
    districtsParticipated: districts.size,
    todaysSupporters,
  }
}
