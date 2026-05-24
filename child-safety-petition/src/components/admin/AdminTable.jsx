function AdminTable({ supporters, onDelete }) {
  return (
    <div className="overflow-x-auto rounded-xl border border-red-200 bg-white">
      <table className="min-w-full text-left text-sm">
        <thead className="bg-red-50 text-red-900">
          <tr>
            <th className="px-3 py-2">Name</th>
            <th className="px-3 py-2">Mobile</th>
            <th className="px-3 py-2">District</th>
            <th className="px-3 py-2">Date</th>
            <th className="px-3 py-2">Action</th>
          </tr>
        </thead>
        <tbody>
          {supporters.map((item) => (
            <tr key={item.id} className="border-t border-red-100">
              <td className="px-3 py-2">{item.name}</td>
              <td className="px-3 py-2">{item.mobile}</td>
              <td className="px-3 py-2">{item.district}</td>
              <td className="px-3 py-2">{new Date(item.createdAt).toLocaleString('en-IN')}</td>
              <td className="px-3 py-2">
                <button
                  type="button"
                  onClick={() => onDelete(item)}
                  className="rounded-md bg-red-700 px-2 py-1 text-xs text-white"
                >
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

export default AdminTable
