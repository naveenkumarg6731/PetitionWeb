import {
  collection,
  doc,
  getDoc,
  onSnapshot,
  orderBy,
  query,
  setDoc,
} from 'firebase/firestore'
import { getDownloadURL, ref, uploadString } from 'firebase/storage'
import { db, isFirebaseConfigured, storage } from './firebase'

const SUPPORTERS_COLLECTION = 'supporters'

const getConfigError =
  'Firebase configuration missing. Update .env values to enable submissions.'

const normalizePhone = (value) => value.replace(/\D/g, '')

export const submitSupporter = async ({ fullName, phoneNumber, district, signatureDataUrl }) => {
  if (!isFirebaseConfigured || !db || !storage) {
    throw new Error(getConfigError)
  }

  const normalizedPhone = normalizePhone(phoneNumber)
  const supporterDoc = doc(db, SUPPORTERS_COLLECTION, normalizedPhone)
  const existingDoc = await getDoc(supporterDoc)

  if (existingDoc.exists()) {
    throw new Error('இந்த மொபைல் எண்ணில் ஏற்கனவே ஆதரவு பதிவு செய்யப்பட்டுள்ளது.')
  }

  const submittedAt = Date.now()
  const signatureRef = ref(storage, `signatures/${normalizedPhone}_${submittedAt}.png`)

  await uploadString(signatureRef, signatureDataUrl, 'data_url')
  const signatureUrl = await getDownloadURL(signatureRef)

  const payload = {
    fullName: fullName.trim(),
    phoneNumber: normalizedPhone,
    district,
    signatureUrl,
    submittedAt,
  }

  await setDoc(supporterDoc, payload)

  return {
    id: normalizedPhone,
    ...payload,
  }
}

export const listenSupporters = (onData, onError) => {
  if (!isFirebaseConfigured || !db) {
    onError(getConfigError)
    return () => {}
  }

  const supportersQuery = query(
    collection(db, SUPPORTERS_COLLECTION),
    orderBy('submittedAt', 'desc'),
  )

  return onSnapshot(
    supportersQuery,
    (snapshot) => {
      const data = snapshot.docs.map((supporterDoc) => ({
        id: supporterDoc.id,
        ...supporterDoc.data(),
      }))
      onData(data)
    },
    () => {
      onError('ஆதரவாளர்கள் பட்டியலை பெற முடியவில்லை. பின்னர் மீண்டும் முயற்சிக்கவும்.')
    },
  )
}
