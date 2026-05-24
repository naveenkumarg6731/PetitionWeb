import { Link } from 'react-router-dom'

function NotFoundPage() {
  return (
    <main className="grid min-h-screen place-items-center bg-zinc-950 p-4 text-white">
      <div className="text-center">
        <h1 className="text-4xl font-black">404</h1>
        <p className="mt-2 text-sm text-zinc-300">Page not found.</p>
        <Link to="/" className="mt-4 inline-flex rounded-lg bg-red-800 px-4 py-2 text-sm font-semibold">
          Back to Petition
        </Link>
      </div>
    </main>
  )
}

export default NotFoundPage
