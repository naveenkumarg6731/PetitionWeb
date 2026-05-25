import { getStore } from '@netlify/blobs'

const store = getStore('supporters')

const supporterKey = (id) => `supporter:${id}`

export const listSupporters = async () => {
  const listing = await store.list({ prefix: 'supporter:' })
  const supporters = await Promise.all(
    listing.blobs.map(async (item) => store.get(item.key, { type: 'json' })),
  )

  return supporters
    .filter(Boolean)
    .sort((a, b) => Number(b.createdAt || 0) - Number(a.createdAt || 0))
}

export const saveSupporter = async (supporter) => {
  await store.setJSON(supporterKey(supporter.id), supporter)
  return supporter
}

export const findByMobile = async (mobile) => {
  if (!mobile) {
    return null
  }

  const supporters = await listSupporters()
  return supporters.find((item) => item.mobile === mobile) || null
}

export const removeSupporter = async (id) => {
  await store.delete(supporterKey(id))
}
