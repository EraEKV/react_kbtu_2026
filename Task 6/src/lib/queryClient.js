import { QueryClient } from '@tanstack/react-query'

// Cache settings shared by every query (see "Caching strategy" in README).
export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 60 * 1000, // data is "fresh" for 1 minute: no refetch when it is reused
      gcTime: 5 * 60 * 1000, // unused cache entries are removed after 5 minutes
      retry: (failureCount, error) => error.message !== 'Item not found' && failureCount < 1,
      refetchOnWindowFocus: true, // stale data is revalidated when the tab gets focus
    },
  },
})
