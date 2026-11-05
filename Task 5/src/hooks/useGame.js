import { useEffect, useState } from 'react'
import { getItem } from '../services/service.js'

// Loads one game by id. Status is one of: loading | error | notfound | success.
// If the id changes (user opens another game) while a request is in flight,
// cleanup sets `cancelled` and the old response is ignored.
export function useGame(id) {
  const [game, setGame] = useState(null)
  const [status, setStatus] = useState('loading')
  const [error, setError] = useState(null)
  const [reloadKey, setReloadKey] = useState(0)

  useEffect(() => {
    let cancelled = false
    setGame(null)
    setStatus('loading')
    setError(null)

    getItem(id)
      .then((data) => {
        if (cancelled) return
        setGame(data)
        setStatus('success')
      })
      .catch((err) => {
        if (cancelled) return
        // the API throws "Item not found" for ids that do not exist (or are not numbers)
        if (err.message === 'Item not found') {
          setStatus('notfound')
        } else {
          setError(err.message)
          setStatus('error')
        }
      })

    return () => {
      cancelled = true
    }
  }, [id, reloadKey])

  function reload() {
    setReloadKey((n) => n + 1)
  }

  return { game, setGame, status, error, reload }
}
