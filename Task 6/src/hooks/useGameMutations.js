import { useMutation, useQueryClient } from '@tanstack/react-query'
import { createItem, deleteItem, updateItem } from '../services/service.js'
import { gameKeys } from './queryKeys.js'

// Create / update / delete. After each one the cache is invalidated so that
// lists (and details) are refetched and never show outdated data.

export function useCreateGame() {
  const queryClient = useQueryClient()
  return useMutation({
    // The API's createItem only stores name + description, so the other fields
    // are saved with a second request (updateItem) on the created id.
    mutationFn: async (data) => {
      const { name, description, ...rest } = data
      const created = await createItem({ name, description })
      try {
        await updateItem(created.id, { ...rest, progress: 0, completedAt: null, cover: '#8b7cff' })
        return { id: created.id, complete: true }
      } catch {
        // the game exists but without details, so the caller sends the user to the edit page
        return { id: created.id, complete: false }
      }
    },
    onSettled: () => queryClient.invalidateQueries({ queryKey: gameKeys.all }),
  })
}

export function useUpdateGame() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: ({ id, changes }) => updateItem(id, changes),
    onSuccess: (updated) => {
      // the details page shows the new data immediately...
      queryClient.setQueryData(gameKeys.detail(updated.id), updated)
    },
    // ...and all lists are refetched (the game may now match other filters/sorting)
    onSettled: () => queryClient.invalidateQueries({ queryKey: gameKeys.all }),
  })
}

export function useDeleteGame() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (id) => deleteItem(id),
    onSuccess: (_, id) => {
      // Mark the deleted game's details as outdated WITHOUT refetching: the page showing it
      // is about to navigate away, and a refetch would flash "Game not found".
      // Opening that id later refetches it and correctly shows "not found".
      queryClient.invalidateQueries({ queryKey: gameKeys.detail(id), refetchType: 'none' })
    },
    // lists are refetched right away
    onSettled: () => queryClient.invalidateQueries({ queryKey: gameKeys.lists() }),
  })
}
