export const STATUSES = [
  { value: 'backlog', label: 'Backlog' },
  { value: 'playing', label: 'Playing' },
  { value: 'completed', label: 'Completed' },
  { value: 'dropped', label: 'Dropped' },
]

export const GENRES = [
  'Action-Adventure',
  'RPG',
  'Survival Horror',
  'Simulation',
  'Shooter',
  'Strategy',
  'Indie',
]

export const PLATFORMS = ['PC', 'PlayStation 5', 'Xbox Series X', 'Nintendo Switch']

export function statusLabel(value) {
  const found = STATUSES.find((s) => s.value === value)
  return found ? found.label : value
}

export const SORTS = [
  { value: 'name', label: 'Name A–Z' },
  { value: 'name-desc', label: 'Name Z–A' },
  { value: 'rating', label: 'Rating (high first)' },
  { value: 'year', label: 'Release year (new first)' },
  { value: 'hours', label: 'Hours played (most first)' },
]

export const PAGE_SIZE = 6
