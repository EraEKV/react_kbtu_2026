import { useState } from 'react'
import { useNavigate, useParams } from 'react-router'
import { useGame } from '../hooks/useGame.js'
import { useDeleteGame, useUpdateGame } from '../hooks/useGameMutations.js'
import BackLinks from '../components/BackLinks.jsx'
import Button from '../components/Button.jsx'
import Loader from '../components/Loader.jsx'
import StatusBadge from '../components/StatusBadge.jsx'
import StatusMessage from '../components/StatusMessage.jsx'

function formatDate(iso) {
  return iso ? new Date(iso).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' }) : '—'
}

export default function GameDetailsPage() {
  const { id } = useParams()
  const navigate = useNavigate()
  const { game, status, error, reload } = useGame(id)
  const updateGame = useUpdateGame()
  const deleteGame = useDeleteGame()

  const [busy, setBusy] = useState(null) // null | 'complete' | 'delete'
  const [notice, setNotice] = useState(null) // { type: 'success' | 'error', text }

  async function handleComplete() {
    setBusy('complete')
    setNotice(null)
    try {
      // the mutation writes the result into the cache, so the page updates by itself
      await updateGame.mutateAsync({
        id: game.id,
        changes: { status: 'completed', progress: 100, completedAt: new Date().toISOString() },
      })
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
      await deleteGame.mutateAsync(game.id)
      navigate('/games')
    } catch (err) {
      setNotice({ type: 'error', text: `Could not remove the game: ${err.message}` })
      setBusy(null)
    }
  }

  if (status === 'loading') {
    return (
      <section>
        <BackLinks />
        <Loader text="Loading game…" />
      </section>
    )
  }

  if (status === 'notfound') {
    return (
      <section>
        <BackLinks />
        <StatusMessage title="Game not found" action={<Button to="/games">Browse games</Button>}>
          There is no game with id “{id}”. It may have been removed.
        </StatusMessage>
      </section>
    )
  }

  if (status === 'error') {
    return (
      <section>
        <BackLinks />
        <StatusMessage tone="error" title="Could not load the game" action={<Button onClick={reload}>Try again</Button>}>
          {error}
        </StatusMessage>
      </section>
    )
  }

  const done = game.status === 'completed'
  const progress = game.progress ?? 0

  return (
    <section>
      <BackLinks />

      {notice && (
        <div className="details-notice" data-type={notice.type} role="status">
          <span>{notice.text}</span>
          <button type="button" onClick={() => setNotice(null)} aria-label="Dismiss">×</button>
        </div>
      )}

      <article className="details-hero" style={{ '--cover': game.cover ?? '#8b7cff' }}>
        <div className="details-glow" />
        <div className="details-content">
          <div className="details-top">
            <StatusBadge status={game.status} />
            {game.rating && <span className="details-rating">★ {game.rating} / 10</span>}
          </div>
          <h1 className="details-title">{game.name}</h1>
          <p className="details-description">{game.description}</p>

          <dl className="details-facts">
            <div><dt>Developer</dt><dd>{game.developer || '—'}</dd></div>
            <div><dt>Release year</dt><dd>{game.releaseYear ?? '—'}</dd></div>
            <div><dt>Platform</dt><dd>{game.platform ?? '—'}</dd></div>
            <div><dt>Genre</dt><dd>{game.genre ?? '—'}</dd></div>
            <div><dt>Hours played</dt><dd>{game.hoursPlayed ?? 0} h</dd></div>
            <div><dt>Completed on</dt><dd>{formatDate(game.completedAt)}</dd></div>
          </dl>

          <div className="details-progress">
            <div className="details-progress-label">
              <span>Progress</span>
              <span>{progress}%</span>
            </div>
            <div className="details-track">
              <div className="details-bar" style={{ width: `${progress}%` }} />
            </div>
          </div>

          <div className="details-notes">
            <h2>Notes</h2>
            <p>{game.notes || 'No notes yet.'}</p>
          </div>

          <div className="details-actions">
            <Button onClick={handleComplete} disabled={Boolean(busy) || done}>
              {busy === 'complete' ? 'Completing…' : done ? '✓ Completed' : 'Mark as completed'}
            </Button>
            <Button variant="ghost" to={`/games/${game.id}/edit`}>Edit</Button>
            <Button variant="danger" onClick={handleDelete} disabled={Boolean(busy)}>
              {busy === 'delete' ? 'Removing…' : 'Remove'}
            </Button>
          </div>
        </div>
      </article>
    </section>
  )
}
