import { saveSupporter } from './_supportersStore.js'
const MAX_SIGNATURE_DATA_URL_LENGTH = 380_000

const json = (status, payload) =>
  new Response(JSON.stringify(payload), {
    status,
    headers: { 'content-type': 'application/json' },
  })

export default async (request) => {
  console.log('Incoming request headers:', request.headers);
  const body = await request.text();
  console.log(`Incoming payload size: ${body.length} bytes`);

  try {
    const parsedBody = JSON.parse(body);
    const { name, mobile, district, message, signatureDataUrl } = parsedBody;

    if (!name || !district || !signatureDataUrl) {
      console.warn('Validation failed: Missing required fields');
      return json(400, { error: 'Required fields missing' });
    }

    if (String(signatureDataUrl).length > MAX_SIGNATURE_DATA_URL_LENGTH) {
      console.warn('Validation failed: Signature data URL too large');
      return json(413, { error: 'Uploaded signature image is too large. Please use a smaller image.' });
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
    console.log('Supporter saved successfully:', supporter);
    return json(200, supporter)
  } catch (error) {
    console.error('Error processing request:', error);
    return json(500, { error: error instanceof Error ? error.message : 'Submit failed' })
  }
}
