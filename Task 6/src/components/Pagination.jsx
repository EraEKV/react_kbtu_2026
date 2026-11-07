export default function Pagination({ page, totalPages, onPageChange }) {
  if (totalPages <= 1) return null

  // [1, 2, 3, ..., totalPages]
  const pages = Array.from({ length: totalPages }, (_, i) => i + 1)

  return (
    <nav className="pagination" aria-label="Pagination">
      <button type="button" className="pagination-btn" onClick={() => onPageChange(page - 1)} disabled={page <= 1}>
        ‹ Prev
      </button>

      {pages.map((p) => (
        <button
          key={p}
          type="button"
          className="pagination-btn"
          aria-current={p === page ? 'page' : undefined}
          onClick={() => onPageChange(p)}
        >
          {p}
        </button>
      ))}

      <button
        type="button"
        className="pagination-btn"
        onClick={() => onPageChange(page + 1)}
        disabled={page >= totalPages}
      >
        Next ›
      </button>
    </nav>
  )
}
