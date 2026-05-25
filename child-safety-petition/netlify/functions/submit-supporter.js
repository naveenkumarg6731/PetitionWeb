import { findByMobile, saveSupporter } from './_supportersStore.js'
const MAX_SIGNATURE_DATA_URL_LENGTH = 380_000

const json = (status, payload) =>
  new Response(JSON.stringify(payload), {
    status,
    headers: { 'content-type': 'application/json' },
  })

export default async (request) => {
  if (request.method !== 'POST') {
    return json(405, { error: 'Method not allowed' })
  }

  try {
    const body = await request.json()
    const { name, mobile, district, message, signatureDataUrl } = body

    if (!name || !district || !signatureDataUrl) {
      return json(400, { error: 'Required fields missing' })
    }

    if (String(signatureDataUrl).length > MAX_SIGNATURE_DATA_URL_LENGTH) {
      return json(413, { error: 'Uploaded signature image is too large. Please use a smaller image.' })
    }

    if (mobile) {
      const duplicate = await findByMobile(mobile)
      if (duplicate) {
        return json(409, { error: 'இந்த மொபைல் எண்ணில் ஏற்கனவே பதிவு உள்ளது.' })
      }
    }

    const createdAt = Date.now()
    const supporter = {
      id: mobile || `no-mobile-${createdAt}-${Math.random().toString(36).slice(2, 8)}`,
      name: String(name).trim(),
      mobile: String(mobile || '').trim(),
      district: String(district || '').trim(),
      message: String(message || '').trim(),
      signatureUrl: String(signatureDataUrl),
      createdAt,
    }

    await saveSupporter(supporter)
    return json(200, supporter)
  } catch (error) {
    return json(500, { error: error instanceof Error ? error.message : 'Submit failed' })
  }
}
