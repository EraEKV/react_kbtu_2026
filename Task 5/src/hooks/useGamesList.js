import { useEffect, useState } from 'react'
import { getItemsList } from '../services/service.js'

// Loads a page of games for the given query string ("?search=...&page=2").
// When the query changes before the old request finishes, cleanup sets
// `cancelled` and the old (stale) response is ignored.
export function useGamesList(query) {
  const [result, setResult] = useState(null) // { data, total, page, totalPages }
  const [status, setStatus] = useState('loading') // loading | error | success
  const [error, setError] = useState(null)
  const [reloadKey, setReloadKey] = useState(0)

  useEffect(() => {
    let cancelled = false
    setStatus('loading')
    setError(null)

    getItemsList(query)
      .then((res) => {
        if (cancelled) return
        setResult(res)
        setStatus('success')
      })
      .catch((err) => {
        if (cancelled) return
        setError(err.message)
        setStatus('error')
      })

    return () => {
      cancelled = true
    }
  }, [query, reloadKey])

  function reload() {
    setReloadKey((n) => n + 1)
  }

  return { result, status, error, reload }
}
