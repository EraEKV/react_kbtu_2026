import { useQuery } from '@tanstack/react-query'
import { getItem } from '../services/service.js'
import { gameKeys } from './queryKeys.js'

// Loads one game by id. Status is one of: loading | error | notfound | success.
// Each id has its own cache entry, so opening a game twice is instant.
export function useGame(id) {
  const q = useQuery({
    queryKey: gameKeys.detail(id),
    queryFn: ({ signal }) => getItem(id, { signal }),
  })

  // the API throws "Item not found" for ids that do not exist (or are not numbers)
  const notFound = q.isError && q.error.message === 'Item not found'

  return {
    game: q.data ?? null,
    status: q.isPending ? 'loading' : notFound ? 'notfound' : q.isError ? 'error' : 'success',
    error: q.error?.message ?? null,
    reload: () => q.refetch(),
  }
}
