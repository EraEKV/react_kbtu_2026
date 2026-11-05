import { Link, useNavigate, useParams } from 'react-router'
import { useGame } from '../hooks/useGame.js'
import { updateItem } from '../services/service.js'
import GameForm from '../components/GameForm.jsx'
import Loader from '../components/Loader.jsx'

export default function EditGamePage() {
  const { id } = useParams()
  const navigate = useNavigate()
  const { game, status, error, reload } = useGame(id)

  // Throws on failure, so GameForm shows the error and keeps the input.
  async function handleSave(data) {
    await updateItem(id, data)
    navigate(`/games/${id}`)
  }

  if (status === 'loading') return <Loader text="Loading game…" />

  if (status === 'notfound') {
    return (
      <div className="state">
        <h2>Game not found</h2>
        <Link to="/games" className="btn">All games</Link>
      </div>
    )
  }

  if (status === 'error') {
    return (
      <div className="state state-error">
        <p>Failed to load the game: {error}</p>
        <button className="btn btn-primary" onClick={reload}>Try again</button>
      </div>
    )
  }

  // fill empty fields for games created without details
  const initial = {
    name: game.name ?? '',
    description: game.description ?? '',
    genre: game.genre ?? 'RPG',
    status: game.status ?? 'backlog',
    developer: game.developer ?? '',
    releaseYear: game.releaseYear ?? new Date().getFullYear(),
    platform: game.platform ?? 'PC',
    rating: game.rating ?? 8,
    hoursPlayed: game.hoursPlayed ?? 0,
    notes: game.notes ?? '',
  }

  return (
    <GameForm
      key={game.id}
      title={`Edit ${game.name}`}
      initial={initial}
      onSubmit={handleSave}
      onCancel={() => navigate(`/games/${id}`)}
    />
  )
}
