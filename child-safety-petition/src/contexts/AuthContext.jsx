import { useEffect, useMemo, useState } from 'react'
import { adminLogin, adminLogout, watchAuthState } from '../services/authService'
import { AuthContext } from './auth-context'

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null)
  const [isAuthLoading, setIsAuthLoading] = useState(true)

  useEffect(() => {
    const unsubscribe = watchAuthState((nextUser) => {
      setUser(nextUser)
      setIsAuthLoading(false)
    })

    return () => unsubscribe()
  }, [])

  const value = useMemo(
    () => ({
      user,
      isAuthLoading,
      login: adminLogin,
      logout: adminLogout,
    }),
    [user, isAuthLoading],
  )

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}
