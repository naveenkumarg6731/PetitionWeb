import { useState } from 'react'
import { Navigate, useNavigate } from 'react-router-dom'
import { useAuth } from '../hooks/useAuth'

function AdminLoginPage() {
  const navigate = useNavigate()
  const { user, login } = useAuth()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  if (user) {
    return <Navigate to="/admin" replace />
  }

  const handleSubmit = async (event) => {
    event.preventDefault()
    setError('')
    setLoading(true)

    try {
      await login(email, password)
      navigate('/admin')
    } catch (loginError) {
      setError(loginError.message || 'Login failed')
    } finally {
      setLoading(false)
    }
  }

  return (
    <main className="grid min-h-screen place-items-center bg-[linear-gradient(130deg,#210505,#060606)] p-4">
      <form
        onSubmit={handleSubmit}
        className="w-full max-w-md rounded-2xl border border-red-300/30 bg-white/10 p-6 text-white backdrop-blur"
      >
        <h1 className="text-2xl font-bold">Admin Login</h1>
        <p className="mt-1 text-sm text-zinc-200">Secure control panel for petition management.</p>

        <div className="mt-4 grid gap-3">
          <input
            type="email"
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            className="rounded-lg border border-red-300/35 bg-black/30 px-3 py-2 text-sm"
            placeholder="Admin Email"
            required
          />
          <input
            type="password"
            value={password}
            onChange={(event) => setPassword(event.target.value)}
            className="rounded-lg border border-red-300/35 bg-black/30 px-3 py-2 text-sm"
            placeholder="Password"
            required
          />
        </div>

        {error ? <p className="mt-2 text-sm text-amber-200">{error}</p> : null}

        <button
          type="submit"
          disabled={loading}
          className="mt-4 w-full rounded-lg bg-red-800 py-2 text-sm font-semibold"
        >
          {loading ? 'Signing in...' : 'Login to Dashboard'}
        </button>
      </form>
    </main>
  )
}

export default AdminLoginPage
