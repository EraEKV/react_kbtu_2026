// One place for query keys. Every games query starts with ['games'],
// so invalidateQueries({ queryKey: gameKeys.all }) refreshes lists and details together.
export const gameKeys = {
  all: ['games'],
  lists: () => [...gameKeys.all, 'list'],
  list: (query) => [...gameKeys.lists(), query],
  details: () => [...gameKeys.all, 'detail'],
  detail: (id) => [...gameKeys.details(), String(id)],
}
