import { useEffect, useMemo, useState } from 'react'
import { Navigate, useNavigate } from 'react-router-dom'
import AdminTable from '../components/admin/AdminTable'
import AdminToolbar from '../components/admin/AdminToolbar'
import { useAuth } from '../hooks/useAuth'
import {
  computeStats,
  deleteSupporter,
  fetchSupportersByDistrict,
  listenSupporters,
} from '../services/petitionService'
import {
  downloadAllSignaturesZip,
  downloadCampaignPdf,
  downloadSupportersCsv,
} from '../utils/reportUtils'

function AdminDashboardPage() {
  const navigate = useNavigate()
  const { user, logout } = useAuth()
  const [supporters, setSupporters] = useState([])
  const [selectedDistrict, setSelectedDistrict] = useState('')
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    const unsubscribe = listenSupporters(
      (items) => {
        setSupporters(items)
        setLoading(false)
      },
      (message) => {
        setError(message)
        setLoading(false)
      },
    )

    return () => unsubscribe()
  }, [])

  const districts = useMemo(
    () => Array.from(new Set(supporters.map((item) => item.district))).filter(Boolean),
    [supporters],
  )

  const filteredSupporters = useMemo(
    () =>
      selectedDistrict
        ? supporters.filter((item) => item.district === selectedDistrict)
        : supporters,
    [selectedDistrict, supporters],
  )

  const stats = useMemo(() => computeStats(filteredSupporters), [filteredSupporters])

  const refreshByDistrict = async (district) => {
    setSelectedDistrict(district)
    setLoading(true)
    try {
      const items = await fetchSupportersByDistrict(district)
      setSupporters(items)
      setError('')
    } catch {
      setError('Unable to filter by district now.')
    } finally {
      setLoading(false)
    }
  }

  const handleDelete = async (item) => {
    if (!window.confirm('Delete this entry?')) {
      return
    }

    await deleteSupporter(item.id, item.signatureUrl)
    setSupporters((previous) => previous.filter((entry) => entry.id !== item.id))
  }

  const handleLogout = async () => {
    await logout()
    navigate('/admin/login')
  }

  if (!user) {
    return <Navigate to="/admin/login" replace />
  }

  return (
    <main className="min-h-screen bg-zinc-100 p-4 sm:p-6">
      <section className="mx-auto max-w-7xl">
        <header className="mb-4 flex flex-wrap items-center justify-between gap-3">
          <div>
            <h1 className="text-2xl font-bold text-red-900">Admin Dashboard</h1>
            <p className="text-sm text-zinc-700">Manage public petition submissions</p>
          </div>
          <button
            type="button"
            onClick={handleLogout}
            className="rounded-lg bg-zinc-900 px-3 py-2 text-xs font-semibold text-white"
          >
            Logout
          </button>
        </header>

        <div className="mb-4 grid gap-3 sm:grid-cols-3">
          <article className="rounded-xl border border-red-200 bg-white p-4">
            <p className="text-xs text-zinc-500">Total Signatures</p>
            <p className="text-2xl font-black text-red-900">{stats.totalSignatures}</p>
          </article>
          <article className="rounded-xl border border-red-200 bg-white p-4">
            <p className="text-xs text-zinc-500">Districts Participated</p>
            <p className="text-2xl font-black text-red-900">{stats.districtsParticipated}</p>
          </article>
          <article className="rounded-xl border border-red-200 bg-white p-4">
            <p className="text-xs text-zinc-500">Today's Supporters</p>
            <p className="text-2xl font-black text-red-900">{stats.todaysSupporters}</p>
          </article>
        </div>

        <AdminToolbar
          districts={districts}
          selectedDistrict={selectedDistrict}
          onDistrictChange={refreshByDistrict}
          onDownloadCsv={() => downloadSupportersCsv(filteredSupporters)}
          onDownloadZip={() => downloadAllSignaturesZip(filteredSupporters)}
          onExportPdf={() => downloadCampaignPdf({ stats, supporters: filteredSupporters })}
        />

        {error ? <p className="mb-2 text-sm text-red-700">{error}</p> : null}
        {loading ? <p className="text-sm text-zinc-600">Loading...</p> : null}

        {!loading ? <AdminTable supporters={filteredSupporters} onDelete={handleDelete} /> : null}
      </section>
    </main>
  )
}

export default AdminDashboardPage
