import { useState } from 'react'
import { STATUSES } from '../data/games.js'

export default function GameCard({ game, onStatusChange, onReset, onRemove }) {
  const [hours, setHours] = useState(() => {
    console.log(`[mount] GameCard: ${game.title}`)
    return 0
  })
  const [progress, setProgress] = useState(0)
  const [note, setNote] = useState('')
  const [notesOpen, setNotesOpen] = useState(false)

  console.log(`[render] GameCard: ${game.title}`)

  const hasProgress = hours > 0 || progress > 0 || note !== ''

  return (
    <li className={`game-card status-${game.status}`} style={{ '--accent': game.color }}>
      <div className="cover">
        <span className="cover-year">{game.year}</span>
        <span className="cover-rating">★ {game.rating}/10</span>
        <h3>{game.title}</h3>
      </div>

      <div className="card-body">
        <div className="meta">
          <span>{game.studio}</span>
          <span className="dot">•</span>
          <span>{game.genre}</span>
        </div>
        {game.tagline && <p className="tagline">{game.tagline}</p>}

        <label className="status-select">
          <span>Status</span>
          <select value={game.status} onChange={(e) => onStatusChange(game.id, e.target.value)}>
            {STATUSES.map((s) => (
              <option key={s.value} value={s.value}>
                {s.label}
              </option>
            ))}
          </select>
        </label>

        <div className="save">
          <div className="save-header">
            <span>My save</span>
            {progress === 100 && <span className="badge-done">100% ✓</span>}
          </div>

          <div className="save-row">
            <span className="save-label">Hours played</span>
            <div className="stepper">
              <button
                type="button"
                onClick={() => setHours((h) => Math.max(0, h - 1))}
                disabled={hours === 0}
              >
                −
              </button>
              <span className="stepper-value">{hours}h</span>
              <button type="button" onClick={() => setHours((h) => h + 1)}>
                +
              </button>
            </div>
          </div>

          <div className="save-row">
            <span className="save-label">Story progress</span>
            <div className="stepper">
              <button
                type="button"
                onClick={() => setProgress((p) => Math.max(0, p - 10))}
                disabled={progress === 0}
              >
                −
              </button>
              <span className="stepper-value">{progress}%</span>
              <button
                type="button"
                onClick={() => setProgress((p) => Math.min(100, p + 10))}
                disabled={progress === 100}
              >
                +
              </button>
            </div>
          </div>
          <div className="progress-bar">
            <div className="progress-fill" style={{ width: `${progress}%` }} />
          </div>

          <button type="button" className="link-btn" onClick={() => setNotesOpen((o) => !o)}>
            {notesOpen ? '▾ Hide notes' : `▸ Notes${note ? ' •' : ''}`}
          </button>
          {notesOpen && (
            <textarea
              value={note}
              onChange={(e) => setNote(e.target.value)}
              placeholder="Where did you stop? Builds, quests, thoughts…"
              rows={3}
            />
          )}
        </div>

        <div className="card-actions">
          <button
            type="button"
            className="btn btn-small"
            onClick={() => onReset(game.id)}
            disabled={!hasProgress}
          >
            ↺ Reset save
          </button>
          <button
            type="button"
            className="btn btn-small btn-danger"
            onClick={() => onRemove(game.id)}
          >
            Remove
          </button>
        </div>
      </div>
    </li>
  )
}
