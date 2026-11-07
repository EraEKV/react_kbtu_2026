import { useNavigate } from 'react-router'
import { useCreateGame } from '../hooks/useGameMutations.js'
import GameForm from '../components/GameForm.jsx'

export default function NewGamePage() {
  const navigate = useNavigate()
  const createGame = useCreateGame()

  // If creating fails, the error goes back to the form and the input is kept.
  async function handleCreate(data) {
    const { id, complete } = await createGame.mutateAsync(data)
    // when the second request failed, let the user finish the game on the edit page
    navigate(complete ? `/games/${id}` : `/games/${id}/edit`)
  }

  return <GameForm title="Add a game" onSubmit={handleCreate} onCancel={() => navigate('/games')} />
}
