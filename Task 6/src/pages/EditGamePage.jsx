import { useNavigate, useParams } from 'react-router'
import { useGame } from '../hooks/useGame.js'
import { useUpdateGame } from '../hooks/useGameMutations.js'
import BackLinks from '../components/BackLinks.jsx'
import Button from '../components/Button.jsx'
import GameForm from '../components/GameForm.jsx'
import Loader from '../components/Loader.jsx'
import StatusMessage from '../components/StatusMessage.jsx'

export default function EditGamePage() {
  const { id } = useParams()
  const navigate = useNavigate()
  const { game, status, error, reload } = useGame(id)
  const updateGame = useUpdateGame()

  // Throws on failure, so GameForm shows the error and keeps the input.
  async function handleSave(data) {
    await updateGame.mutateAsync({ id, changes: data })
    navigate(`/games/${id}`)
  }

  if (status === 'loading') return <Loader text="Loading game…" />

  if (status === 'notfound') {
    return (
      <section>
        <BackLinks />
        <StatusMessage title="Game not found" action={<Button to="/games">Browse games</Button>} />
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
