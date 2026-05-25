import { listSupporters } from './_supportersStore.js'

const json = (status, payload) =>
  new Response(JSON.stringify(payload), {
    status,
    headers: { 'content-type': 'application/json' },
  })

export default async (request) => {
  if (request.method !== 'GET') {
    return json(405, { error: 'Method not allowed' })
  }

  try {
    const supporters = await listSupporters()
    const district = new URL(request.url).searchParams.get('district')

    const filtered = district
      ? supporters.filter((item) => item.district === district)
      : supporters

    return json(200, { supporters: filtered })
  } catch {
    return json(500, { error: 'Failed to load supporters' })
  }
}
