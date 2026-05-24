const json = (status, payload) =>
  new Response(JSON.stringify(payload), {
    status,
    headers: { 'content-type': 'application/json' },
  })

export default async (request) => {
  if (request.method !== 'POST') {
    return json(405, { error: 'Method not allowed' })
  }

  const body = await request.json().catch(() => null)
  const email = String(body?.email || '').trim().toLowerCase()
  const password = String(body?.password || '')

  const adminEmail = String(process.env.NETLIFY_ADMIN_EMAIL || '').trim().toLowerCase()
  const adminPassword = String(process.env.NETLIFY_ADMIN_PASSWORD || '')
  const adminToken = String(process.env.NETLIFY_ADMIN_TOKEN || '')

  if (!adminEmail || !adminPassword || !adminToken) {
    return json(500, { error: 'Admin environment variables are not configured.' })
  }

  if (email !== adminEmail || password !== adminPassword) {
    return json(401, { error: 'Invalid admin credentials' })
  }

  return json(200, {
    token: adminToken,
    user: {
      email: adminEmail,
      role: 'admin',
    },
  })
}
