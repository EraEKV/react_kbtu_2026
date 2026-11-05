import { Link } from 'react-router'
import StatusBadge from './StatusBadge.jsx'

// "Red Dead Redemption 2" -> "RD"
function initials(name) {
  return name
    .split(' ')
    .filter((word) => /[a-z0-9]/i.test(word[0]))
    .slice(0, 2)
    .map((word) => word[0].toUpperCase())
    .join('')
}

export default function GameCard({ game }) {
  return (
    <Link to={`/games/${game.id}`} className="game-card" style={{ '--cover': game.cover ?? '#8b7cff' }}>
      <div className="game-card-art">
        <span className="game-card-initials">{initials(game.name)}</span>
        <div className="game-card-badges">
          <StatusBadge status={game.status} />
          {game.rating && <span className="game-card-rating">★ {game.rating}</span>}
        </div>
      </div>

      <div className="game-card-body">
        <h3 className="game-card-title">{game.name}</h3>
        <p className="game-card-meta">{[game.genre, game.releaseYear].filter(Boolean).join(' · ')}</p>
        <p className="game-card-desc">{game.description}</p>

        <div className="game-card-footer">
          <span>{game.platform ?? '—'}</span>
          <span>{game.hoursPlayed ?? 0} h</span>
        </div>
        <div className="game-card-progress">
          <div className="game-card-progress-bar" style={{ width: `${game.progress ?? 0}%` }} />
        </div>
      </div>
    </Link>
  )
}
