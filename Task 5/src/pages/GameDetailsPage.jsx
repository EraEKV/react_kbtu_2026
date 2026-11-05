import { useState } from 'react'
import { Link, useNavigate, useParams } from 'react-router'
import { useGame } from '../hooks/useGame.js'
import { deleteItem, updateItem } from '../services/service.js'
import { statusLabel } from '../constants.js'
import Loader from '../components/Loader.jsx'

function formatDate(iso) {
  return iso ? new Date(iso).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' }) : '—'
}

export default function GameDetailsPage() {
  const { id } = useParams()
  const navigate = useNavigate()
  const { game, setGame, status, error, reload } = useGame(id)

  const [busy, setBusy] = useState(null) // null | 'complete' | 'delete'
  const [notice, setNotice] = useState(null) // { type: 'success' | 'error', text }

  async function handleComplete() {
    setBusy('complete')
    setNotice(null)
    try {
      const updated = await updateItem(game.id, {
        status: 'completed',
        progress: 100,
        completedAt: new Date().toISOString(),
      })
      // only update if the user is still looking at the same game
      setGame((prev) => (prev && prev.id === updated.id ? updated : prev))
      setNotice({ type: 'success', text: 'Marked as completed.' })
    } catch (err) {
      setNotice({ type: 'error', text: `Could not complete the game: ${err.message}` })
    } finally {
      setBusy(null)
    }
  }

  async function handleDelete() {
    if (!window.confirm('Remove this game from your library?')) return
    setBusy('delete')
    setNotice(null)
    try {
      await deleteItem(game.id)
      navigate('/games')
    } catch (err) {
      setNotice({ type: 'error', text: `Could not remove the game: ${err.message}` })
      setBusy(null)
    }
  }

  const links = (
    <div className="back-links">
      <button className="btn" onClick={() => navigate(-1)}>← Back</button>
      <Link to="/games" className="btn">All games</Link>
    </div>
  )

  if (status === 'loading') {
    return (
      <section>
        {links}
        <Loader text="Loading game…" />
      </section>
    )
  }

  if (status === 'notfound') {
    return (
      <section>
        {links}
        <div className="state">
          <h2>Game not found</h2>
          <p>There is no game with id “{id}”. It may have been removed.</p>
        </div>
      </section>
    )
  }

  if (status === 'error') {
    return (
      <section>
        {links}
        <div className="state state-error">
          <p>Failed to load the game: {error}</p>
          <button className="btn btn-primary" onClick={reload}>Try again</button>
        </div>
      </section>
    )
  }

  const done = game.status === 'completed'

  return (
    <section>
      {links}

      {notice && (
        <div className={`notice notice-${notice.type}`}>
          <span>{notice.text}</span>
          <button onClick={() => setNotice(null)} aria-label="Dismiss">×</button>
        </div>
      )}

      <div className="panel" style={{ '--cover': game.cover ?? '#6c8cff' }}>
        <div className="details-hero">
          <span className={`badge badge-${game.status}`}>{statusLabel(game.status)}</span>
          <h2>{game.name}</h2>
          <p>{game.description}</p>
        </div>

        <dl className="fields">
          <div><dt>Developer</dt><dd>{game.developer || '—'}</dd></div>
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
          <button className="btn btn-primary" onClick={handleComplete} disabled={Boolean(busy) || done}>
            {busy === 'complete' ? 'Completing…' : done ? '✓ Completed' : 'Mark as completed'}
          </button>
          <Link to={`/games/${game.id}/edit`} className="btn">Edit</Link>
          <button className="btn btn-danger" onClick={handleDelete} disabled={Boolean(busy)}>
            {busy === 'delete' ? 'Removing…' : 'Remove'}
          </button>
        </div>
      </div>
    </section>
  )
}
