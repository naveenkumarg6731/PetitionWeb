function AdminToolbar({ districts, selectedDistrict, onDistrictChange, onDownloadCsv, onDownloadZip, onExportPdf }) {
  return (
    <div className="mb-4 grid gap-3 rounded-xl border border-red-200 bg-white p-3 sm:grid-cols-[1fr_auto_auto_auto] sm:items-center">
      <select
        value={selectedDistrict}
        onChange={(event) => onDistrictChange(event.target.value)}
        className="rounded-lg border border-red-200 px-3 py-2 text-sm"
      >
        <option value="">All Districts</option>
        {districts.map((item) => (
          <option key={item} value={item}>
            {item}
          </option>
        ))}
      </select>
      <button type="button" onClick={onDownloadCsv} className="rounded-lg bg-zinc-800 px-3 py-2 text-xs font-semibold text-white">
        Download CSV
      </button>
      <button type="button" onClick={onDownloadZip} className="rounded-lg bg-zinc-800 px-3 py-2 text-xs font-semibold text-white">
        Download Signatures
      </button>
      <button type="button" onClick={onExportPdf} className="rounded-lg bg-red-900 px-3 py-2 text-xs font-semibold text-white">
        Export PDF Report
      </button>
    </div>
  )
}

export default AdminToolbar
