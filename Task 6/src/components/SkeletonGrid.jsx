// Grey placeholder cards shown while the list is loading
export default function SkeletonGrid({ count = 6 }) {
  return (
    <ul className="skeleton-grid" aria-busy="true" aria-label="Loading games">
      {Array.from({ length: count }, (_, i) => (
        <li key={i} className="skeleton-card">
          <div className="skeleton-art" />
          <div className="skeleton-line" />
          <div className="skeleton-line skeleton-short" />
        </li>
      ))}
    </ul>
  )
}
