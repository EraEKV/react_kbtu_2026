import { useQuery } from '@tanstack/react-query'
import { getItemsList } from '../services/service.js'
import { gameKeys } from './queryKeys.js'

// Loads a page of games for the given query string ("?search=...&page=2").
// The query string is part of the query key, so every filter/page combination
// has its own cache entry. When the query changes, the old request is aborted
// (via `signal`) and its result can never overwrite the newer one.
export function useGamesList(query) {
  const q = useQuery({
    queryKey: gameKeys.list(query),
    queryFn: ({ signal }) => getItemsList(query, { signal }),
  })

  return {
    result: q.data ?? null, // { data, total, page, totalPages }
    status: q.isPending ? 'loading' : q.isError ? 'error' : 'success',
    error: q.error?.message ?? null,
    reload: () => q.refetch(),
  }
}
