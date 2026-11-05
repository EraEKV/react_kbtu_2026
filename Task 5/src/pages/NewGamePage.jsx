import { useNavigate } from 'react-router'
import { createItem, updateItem } from '../services/service.js'
import GameForm from '../components/GameForm.jsx'

export default function NewGamePage() {
  const navigate = useNavigate()

  // The API's createItem only stores name + description, so the other fields
  // are saved with a second request (updateItem) on the created id.
  // If createItem fails, the error goes back to the form and the input is kept.
  async function handleCreate(data) {
    const { name, description, ...rest } = data
    const created = await createItem({ name, description })

    try {
      await updateItem(created.id, { ...rest, progress: 0, completedAt: null, cover: '#6c8cff' })
      navigate(`/games/${created.id}`)
    } catch {
      // the game exists but without details, so let the user finish it on the edit page
      navigate(`/games/${created.id}/edit`)
    }
  }

  return <GameForm title="Add a game" onSubmit={handleCreate} onCancel={() => navigate('/games')} />
}
