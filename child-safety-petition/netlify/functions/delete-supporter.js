import { removeSupporter } from './_supportersStore.js'

const json = (status, payload) =>
  new Response(JSON.stringify(payload), {
    status,
    headers: { 'content-type': 'application/json' },
  })

const getBearerToken = (request) => {
  const authorization = request.headers.get('authorization') || ''
  if (!authorization.startsWith('Bearer ')) {
    return ''
  }

  return authorization.slice('Bearer '.length)
}

export default async (request) => {
  if (request.method !== 'POST') {
    return json(405, { error: 'Method not allowed' })
  }

  const adminToken = String(process.env.NETLIFY_ADMIN_TOKEN || '')
  const sentToken = getBearerToken(request)

  if (!adminToken || sentToken !== adminToken) {
    return json(403, { error: 'Unauthorized' })
  }

  const body = await request.json().catch(() => null)
  const id = String(body?.id || '').trim()

  if (!id) {
    return json(400, { error: 'Supporter id is required' })
  }

  await removeSupporter(id)
  return json(200, { success: true })
}
