import { statusLabel } from '../constants.js'

function formatDate(iso) {
  return iso ? new Date(iso).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' }) : '—'
}

export default function GameDetails({ selectedId, status, error, game, pending, onRetry, onComplete, onEdit, onDelete }) {
  if (selectedId === null) {
    return (
      <section className="panel details-panel">
        <div className="state">
          <p>Select a game to see its details.</p>
        </div>
      </section>
    )
  }

  if (status === 'loading') {
    return (
      <section className="panel details-panel">
        <div className="state">
          <div className="spinner" />
          <p>Loading details…</p>
        </div>
      </section>
    )
  }

  if (status === 'error') {
    return (
      <section className="panel details-panel">
        <div className="state state-error">
          <p>Failed to load details: {error}</p>
          <button className="btn btn-primary" onClick={onRetry}>
            Try again
          </button>
        </div>
      </section>
    )
  }

  if (!game) return null

  const busy = pending[game.id]
  const done = game.status === 'completed'

  return (
    <section className="panel details-panel" style={{ '--cover': game.cover }}>
      <div className="details-hero">
        <span className={`badge badge-${game.status}`}>{statusLabel(game.status)}</span>
        <h2>{game.name}</h2>
        <p>{game.description}</p>
      </div>

      <dl className="fields">
        <div><dt>Developer</dt><dd>{game.developer ?? '—'}</dd></div>
        <div><dt>Release year</dt><dd>{game.releaseYear ?? '—'}</dd></div>
        <div><dt>Platform</dt><dd>{game.platform ?? '—'}</dd></div>
        <div><dt>Genre</dt><dd>{game.genre ?? '—'}</dd></div>
        <div><dt>My rating</dt><dd>{game.rating ?? '—'} / 10</dd></div>
        <div><dt>Hours played</dt><dd>{game.hoursPlayed ?? 0} h</dd></div>
        <div><dt>Completed on</dt><dd>{formatDate(game.completedAt)}</dd></div>
      </dl>

      <div className="progress-block">
        <div className="progress-label">
          <span>Progress</span>
          <span>{game.progress ?? 0}%</span>
        </div>
        <div className="progress"><div className="progress-bar" style={{ width: `${game.progress ?? 0}%` }} /></div>
      </div>

      <div className="notes">
        <h3>Notes</h3>
        <p>{game.notes || 'No notes yet.'}</p>
      </div>

      <div className="actions">
        <button className="btn btn-primary" onClick={() => onComplete(game.id)} disabled={Boolean(busy) || done}>
          {busy === 'complete' ? 'Completing…' : done ? '✓ Completed' : 'Mark as completed'}
        </button>
        <button className="btn" onClick={() => onEdit(game.id)} disabled={Boolean(busy)}>
          {busy === 'save' ? 'Saving…' : 'Edit'}
        </button>
        <button className="btn btn-danger" onClick={() => onDelete(game.id)} disabled={Boolean(busy)}>
          {busy === 'delete' ? 'Removing…' : 'Remove'}
        </button>
      </div>
    </section>
  )
}
