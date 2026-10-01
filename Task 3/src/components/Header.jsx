export default function Header({ games }) {
  console.log('[render] Header')

  const playing = games.filter((g) => g.status === 'playing').length
  const completed = games.filter((g) => g.status === 'completed').length
  const avgRating = games.length
    ? (games.reduce((sum, g) => sum + g.rating, 0) / games.length).toFixed(1)
    : '—'

  return (
    <header className="header">
      <div className="brand">
        <span className="brand-logo">▶</span>
        <div>
          <h1>Save Point</h1>
          <p className="subtitle">My game library & progress tracker</p>
        </div>
      </div>
      <dl className="stats">
        <div className="stat">
          <dt>Games</dt>
          <dd>{games.length}</dd>
        </div>
        <div className="stat">
          <dt>Playing</dt>
          <dd>{playing}</dd>
        </div>
        <div className="stat">
          <dt>Completed</dt>
          <dd>{completed}</dd>
        </div>
        <div className="stat">
          <dt>Avg rating</dt>
          <dd>{avgRating}</dd>
        </div>
      </dl>
    </header>
  )
}
