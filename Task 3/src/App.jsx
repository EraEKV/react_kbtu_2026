import { useState } from 'react'
import Header from './components/Header.jsx'
import AddGameForm from './components/AddGameForm.jsx'
import Toolbar from './components/Toolbar.jsx'
import GameList from './components/GameList.jsx'
import { initialGames, STATUSES } from './data/games.js'

function sortGames(games, sortBy) {
  const copy = [...games]
  if (sortBy === 'title') return copy.sort((a, b) => a.title.localeCompare(b.title))
  if (sortBy === 'year') return copy.sort((a, b) => b.year - a.year)
  if (sortBy === 'rating') return copy.sort((a, b) => b.rating - a.rating)
  return copy.reverse() // 'added': newest first
}

export default function App() {
  const [games, setGames] = useState(initialGames)
  const [statusFilter, setStatusFilter] = useState('all')
  const [search, setSearch] = useState('')
  const [sortBy, setSortBy] = useState('added')
  const [reversed, setReversed] = useState(false)
  const [keyMode, setKeyMode] = useState('id')

  console.log('[render] App')

  function addGame(game) {
    setGames((prev) => [...prev, { ...game, id: crypto.randomUUID(), resetCount: 0 }])
  }

  function removeGame(id) {
    setGames((prev) => prev.filter((g) => g.id !== id))
  }

  function changeStatus(id, status) {
    setGames((prev) => prev.map((g) => (g.id === id ? { ...g, status } : g)))
  }

  // Bumping resetCount changes the card's key -> React unmounts the old
  // card and mounts a fresh one, so its local state starts from scratch.
  function resetSave(id) {
    setGames((prev) =>
      prev.map((g) => (g.id === id ? { ...g, resetCount: g.resetCount + 1 } : g)),
    )
  }

  const counts = { all: games.length }
  for (const s of STATUSES) {
    counts[s.value] = games.filter((g) => g.status === s.value).length
  }

  const query = search.trim().toLowerCase()
  const filtered = games.filter(
    (g) =>
      (statusFilter === 'all' || g.status === statusFilter) &&
      (g.title.toLowerCase().includes(query) || g.studio.toLowerCase().includes(query)),
  )
  const sorted = sortGames(filtered, sortBy)
  const visibleGames = reversed ? sorted.reverse() : sorted

  return (
    <div className="page">
      <Header games={games} />
      <div className="layout">
        <aside className="sidebar">
          <AddGameForm onAdd={addGame} />
        </aside>
        <main className="content">
          <Toolbar
            statusFilter={statusFilter}
            onStatusFilterChange={setStatusFilter}
            counts={counts}
            search={search}
            onSearchChange={setSearch}
            sortBy={sortBy}
            onSortChange={setSortBy}
            reversed={reversed}
            onToggleReverse={() => setReversed((r) => !r)}
            keyMode={keyMode}
            onKeyModeChange={setKeyMode}
          />
          <GameList
            games={visibleGames}
            keyMode={keyMode}
            onStatusChange={changeStatus}
            onReset={resetSave}
            onRemove={removeGame}
          />
        </main>
      </div>
    </div>
  )
}
