import { Navigate, Route, Routes } from 'react-router-dom'
import { useAuth } from './hooks/useAuth'
import AdminDashboardPage from './pages/AdminDashboardPage'
import AdminLoginPage from './pages/AdminLoginPage'
import NotFoundPage from './pages/NotFoundPage'
import PublicPetitionPage from './pages/PublicPetitionPage'

function ProtectedRoute({ children }) {
  const { user, isAuthLoading } = useAuth()

  if (isAuthLoading) {
    return <div className="grid min-h-screen place-items-center">Loading...</div>
  }

  if (!user) {
    return <Navigate to="/admin/login" replace />
  }

  return children
}

function App() {
  return (
    <Routes>
      <Route path="/" element={<PublicPetitionPage />} />
      <Route path="/admin/login" element={<AdminLoginPage />} />
      <Route
        path="/admin"
        element={
          <ProtectedRoute>
            <AdminDashboardPage />
          </ProtectedRoute>
        }
      />
      <Route path="*" element={<NotFoundPage />} />
    </Routes>
  )
}

export default App
