import { useEffect, useState } from 'react'
import { createItem, deleteItem, getItem, getItemsList, updateItem } from './api/fakeApi.js'
import GameDetails from './components/GameDetails.jsx'
import GameForm from './components/GameForm.jsx'
import GameList from './components/GameList.jsx'

// the list only keeps the light fields, the same ones getItemsList returns
function toSummary(game) {
  const { id, name, description, genre, status, cover } = game
  return { id, name, description, genre, status, cover }
}

export default function App() {
  // ---- list ----
  const [items, setItems] = useState([])
  const [listStatus, setListStatus] = useState('loading') // loading | error | success
  const [listError, setListError] = useState(null)
  const [listReload, setListReload] = useState(0)

  // ---- selected item details ----
  const [selectedId, setSelectedId] = useState(null)
  const [details, setDetails] = useState(null)
  const [detailsStatus, setDetailsStatus] = useState('idle') // idle | loading | error | success
  const [detailsError, setDetailsError] = useState(null)
  const [detailsReload, setDetailsReload] = useState(0)

  // ---- mutations ----
  const [pending, setPending] = useState({}) // { [id]: 'complete' | 'save' | 'delete' }
  const [mode, setMode] = useState(null) // null | { type: 'create' } | { type: 'edit', id }
  const [notice, setNotice] = useState(null) // { type: 'error' | 'success', text }

  // Load the list on mount and on every Reload click.
  useEffect(() => {
    let cancelled = false
    setListStatus('loading')
    setListError(null)

    getItemsList('?limit=100')
      .then((result) => {
        if (cancelled) return
        setItems(result.data)
        setListStatus('success')
      })
      .catch((err) => {
        if (cancelled) return
        setListError(err.message)
        setListStatus('error')
      })

    return () => {
      cancelled = true
    }
  }, [listReload])

  // Load the details of the selected item. If the selection changes while a
  // request is in flight, cleanup flips `cancelled` and the old response is dropped.
  useEffect(() => {
    if (selectedId === null) {
      setDetails(null)
      setDetailsStatus('idle')
      return
    }

    let cancelled = false
    setDetails(null)
    setDetailsStatus('loading')
    setDetailsError(null)

    getItem(selectedId)
      .then((game) => {
        if (cancelled) return
        setDetails(game)
        setDetailsStatus('success')
      })
      .catch((err) => {
        if (cancelled) return
        setDetailsError(err.message)
        setDetailsStatus('error')
      })

    return () => {
      cancelled = true
    }
  }, [selectedId, detailsReload])

  function startPending(id, kind) {
    setPending((prev) => ({ ...prev, [id]: kind }))
  }

  function endPending(id) {
    setPending((prev) => {
      const next = { ...prev }
      delete next[id]
      return next
    })
  }

  function handleSelect(id) {
    setMode(null)
    setSelectedId(id)
  }

  // `id` is captured when the click happens. Even if the user selects another
  // game before the response arrives, the update lands on the right item.
  async function handleComplete(id) {
    if (pending[id]) return
    startPending(id, 'complete')
    setNotice(null)
    try {
      const updated = await updateItem(id, {
        status: 'completed',
        progress: 100,
        completedAt: new Date().toISOString(),
      })
      setItems((prev) => prev.map((g) => (g.id === id ? toSummary(updated) : g)))
      setDetails((prev) => (prev && prev.id === id ? updated : prev))
      setNotice({ type: 'success', text: `"${updated.name}" marked as completed.` })
    } catch (err) {
      setNotice({ type: 'error', text: `Could not complete the game: ${err.message}` })
    } finally {
      endPending(id)
    }
  }

  async function handleDelete(id) {
    if (pending[id]) return
    if (!window.confirm('Remove this game from your library?')) return
    startPending(id, 'delete')
    setNotice(null)
    try {
      await deleteItem(id)
      setItems((prev) => prev.filter((g) => g.id !== id))
      setSelectedId((current) => (current === id ? null : current))
      setMode((m) => (m && m.type === 'edit' && m.id === id ? null : m))
      setNotice({ type: 'success', text: 'Game removed.' })
    } catch (err) {
      setNotice({ type: 'error', text: `Could not remove the game: ${err.message}` })
    } finally {
      endPending(id)
    }
  }

  // Throws on failure so the form can show the error and keep the user's input.
  // The API's createItem only stores name + description, so the rest of the
  // fields are saved with a second request (updateItem) on the created id.
  async function handleCreate(data) {
    const { name, description, ...rest } = data
    const created = await createItem({ name, description })
    let full = created
    let failed = null
    try {
      full = await updateItem(created.id, { ...rest, progress: 0, completedAt: null, cover: '#6c8cff' })
    } catch (err) {
      failed = err
    }
    setItems((prev) => [...prev, toSummary(full)])
    setMode(null)
    setSelectedId(created.id)
    setNotice(
      failed
        ? { type: 'error', text: `"${name}" was created, but its details were not saved (${failed.message}). Open Edit to fill them in.` }
        : { type: 'success', text: `"${name}" added.` },
    )
  }

  async function handleEdit(id, data) {
    startPending(id, 'save')
    try {
      const updated = await updateItem(id, data)
      setItems((prev) => prev.map((g) => (g.id === id ? toSummary(updated) : g)))
      setDetails((prev) => (prev && prev.id === id ? updated : prev))
      setMode((m) => (m && m.type === 'edit' && m.id === id ? null : m))
      setNotice({ type: 'success', text: `"${updated.name}" saved.` })
    } finally {
      endPending(id)
    }
  }

  let rightPane
  if (mode && mode.type === 'create') {
    rightPane = <GameForm key="create" title="Add a game" onSubmit={handleCreate} onCancel={() => setMode(null)} />
  } else if (mode && mode.type === 'edit' && details && details.id === mode.id) {
    const { id, cover, progress, completedAt, ...editable } = details
    rightPane = (
      <GameForm
        key={`edit-${id}`}
        title={`Edit ${details.name}`}
        initial={editable}
        onSubmit={(data) => handleEdit(id, data)}
        onCancel={() => setMode(null)}
      />
    )
  } else {
    rightPane = (
      <GameDetails
        selectedId={selectedId}
        status={detailsStatus}
        error={detailsError}
        game={details}
        pending={pending}
        onRetry={() => setDetailsReload((n) => n + 1)}
        onComplete={handleComplete}
        onEdit={(id) => setMode({ type: 'edit', id })}
        onDelete={handleDelete}
      />
    )
  }

  return (
    <div className="app">
      <header className="topbar">
        <div>
          <h1>Game Vault</h1>
          <p>Async library: simulated API with random delays and errors</p>
        </div>
        <button className="btn btn-primary" onClick={() => { setMode({ type: 'create' }); setNotice(null) }}>
          + Add game
        </button>
      </header>

      {notice && (
        <div className={`notice notice-${notice.type}`}>
          <span>{notice.text}</span>
          <button onClick={() => setNotice(null)} aria-label="Dismiss">×</button>
        </div>
      )}

      <main className="layout">
        <GameList
          items={items}
          status={listStatus}
          error={listError}
          selectedId={selectedId}
          pending={pending}
          onSelect={handleSelect}
          onReload={() => setListReload((n) => n + 1)}
        />
        {rightPane}
      </main>
    </div>
  )
}
