export default function Pagination({ page, totalPages, onChange }) {
  if (totalPages <= 1) return null

  return (
    <div className="pagination">
      <button className="btn" onClick={() => onChange(page - 1)} disabled={page <= 1}>
        ← Prev
      </button>
      <span>
        Page {page} of {totalPages}
      </span>
      <button className="btn" onClick={() => onChange(page + 1)} disabled={page >= totalPages}>
        Next →
      </button>
    </div>
  )
}
