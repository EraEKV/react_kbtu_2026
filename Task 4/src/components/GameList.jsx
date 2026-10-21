import { statusLabel } from '../constants.js'

export default function GameList({ items, status, error, selectedId, pending, onSelect, onReload }) {
  return (
    <section className="panel list-panel">
      <div className="panel-head">
        <h2>Library {status === 'success' && <span className="count">{items.length}</span>}</h2>
        <button className="btn" onClick={onReload} disabled={status === 'loading'}>
          {status === 'loading' ? 'Loading…' : '↻ Reload'}
        </button>
      </div>

      {status === 'loading' && (
        <div className="state">
          <div className="spinner" />
          <p>Loading games…</p>
        </div>
      )}

      {status === 'error' && (
        <div className="state state-error">
          <p>Failed to load the list: {error}</p>
          <button className="btn btn-primary" onClick={onReload}>
            Try again
          </button>
        </div>
      )}

      {status === 'success' && items.length === 0 && (
        <div className="state">
          <p>Your library is empty. Add your first game!</p>
        </div>
      )}

      {status === 'success' && items.length > 0 && (
        <ul className="game-list">
          {items.map((game) => (
            <li key={game.id}>
              <button
                className={`game-row ${game.id === selectedId ? 'is-selected' : ''}`}
                style={{ '--cover': game.cover }}
                onClick={() => onSelect(game.id)}
              >
                <span className="cover" />
                <span className="game-row-text">
                  <strong>{game.name}</strong>
                  <small>{game.genre}</small>
                </span>
                <span className={`badge badge-${game.status}`}>
                  {pending[game.id] ? '…' : statusLabel(game.status)}
                </span>
              </button>
            </li>
          ))}
        </ul>
      )}
    </section>
  )
}
