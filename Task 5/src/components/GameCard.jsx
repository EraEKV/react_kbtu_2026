import { Link } from 'react-router'
import { statusLabel } from '../constants.js'

export default function GameCard({ game }) {
  return (
    <Link to={`/games/${game.id}`} className="card" style={{ '--cover': game.cover ?? '#6c8cff' }}>
      <div className="card-cover" />
      <div className="card-body">
        <div className="card-top">
          <h3>{game.name}</h3>
          <span className={`badge badge-${game.status}`}>{statusLabel(game.status)}</span>
        </div>
        <p className="card-desc">{game.description}</p>
        <div className="card-meta">
          <span>{game.genre ?? '—'}</span>
          <span>{game.platform ?? '—'}</span>
          <span>★ {game.rating ?? '—'}</span>
        </div>
      </div>
    </Link>
  )
}
