const ADMIN_TOKEN_KEY = 'petition_admin_token'
const ADMIN_USER_KEY = 'petition_admin_user'

const parseStoredUser = () => {
  const token = localStorage.getItem(ADMIN_TOKEN_KEY) || ''
  const userRaw = localStorage.getItem(ADMIN_USER_KEY)

  if (!token || !userRaw) {
    return null
  }

  try {
    const user = JSON.parse(userRaw)
    return { token, ...user }
  } catch {
    return null
  }
}

export const getAdminToken = () => localStorage.getItem(ADMIN_TOKEN_KEY) || ''

export const watchAuthState = (onUserChange) => {
  onUserChange(parseStoredUser())

  const onStorage = () => onUserChange(parseStoredUser())
  window.addEventListener('storage', onStorage)

  return () => window.removeEventListener('storage', onStorage)
}

export const adminLogin = async (email, password) => {
  const response = await fetch('/.netlify/functions/admin-login', {
    method: 'POST',
    headers: { 'content-type': 'application/json' },
    body: JSON.stringify({ email, password }),
  })

  const payload = await response.json().catch(() => ({}))

  if (!response.ok) {
    throw new Error(payload.error || 'Admin login failed')
  }

  localStorage.setItem(ADMIN_TOKEN_KEY, payload.token)
  localStorage.setItem(ADMIN_USER_KEY, JSON.stringify(payload.user))

  return payload.user
}

export const adminLogout = async () => {
  localStorage.removeItem(ADMIN_TOKEN_KEY)
  localStorage.removeItem(ADMIN_USER_KEY)
}
