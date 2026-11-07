import { useSearchParams } from 'react-router'
import { useGamesList } from '../hooks/useGamesList.js'
import { GENRES, PAGE_SIZE, PLATFORMS, SORTS, STATUSES } from '../constants.js'
import Button from '../components/Button.jsx'
import GameCard from '../components/GameCard.jsx'
import Pagination from '../components/Pagination.jsx'
import SelectField from '../components/SelectField.jsx'
import SkeletonGrid from '../components/SkeletonGrid.jsx'
import StatusMessage from '../components/StatusMessage.jsx'

// options for the <SelectField>s; '' means "no filter"
const genreOptions = [{ value: '', label: 'All genres' }, ...GENRES.map((g) => ({ value: g, label: g }))]
const statusOptions = [{ value: '', label: 'All statuses' }, ...STATUSES]
const platformOptions = [{ value: '', label: 'All platforms' }, ...PLATFORMS.map((p) => ({ value: p, label: p }))]

export default function GamesPage() {
  // All filters live in the URL: /games?search=witcher&genre=RPG&page=2
  const [searchParams, setSearchParams] = useSearchParams()

  const search = searchParams.get('search') || ''
  const genre = searchParams.get('genre') || ''
  const status = searchParams.get('status') || ''
  const platform = searchParams.get('platform') || ''
  const sort = searchParams.get('sort') || 'name'
  const page = Number(searchParams.get('page')) || 1

  // the API query = URL params + page size
  const query = new URLSearchParams(searchParams)
  query.set('limit', PAGE_SIZE)
  const list = useGamesList('?' + query.toString())

  // Change one param in the URL. Any filter change sends the user back to page 1.
  function updateParam(key, value) {
    const next = new URLSearchParams(searchParams)
    if (value) {
      next.set(key, value)
    } else {
      next.delete(key)
    }
    next.delete('page')
    // typing in the search box should not add a history entry for every letter
    setSearchParams(next, { replace: key === 'search' })
  }

  function changePage(newPage) {
    const next = new URLSearchParams(searchParams)
    next.set('page', newPage)
    setSearchParams(next)
    window.scrollTo(0, 0)
  }

  function resetFilters() {
    setSearchParams({})
  }

  const hasFilters = search || genre || status || platform || sort !== 'name'

  return (
    <section>
      <div className="games-header">
        <div>
          <h1>Games</h1>
          <p className="games-count">
            {list.status === 'success' ? `${list.result.total} games found` : 'Loading library…'}
          </p>
        </div>
        <Button to="/games/new">+ Add game</Button>
      </div>

      <div className="games-search">
        <span className="games-search-icon" aria-hidden="true">⌕</span>
        <input
          type="search"
          className="games-search-input"
          placeholder="Search by name or description…"
          aria-label="Search games"
          value={search}
          onChange={(e) => updateParam('search', e.target.value)}
        />
      </div>

      <div className="games-filters">
        <div className="games-fields">
          <SelectField label="Genre" value={genre} options={genreOptions} onChange={(v) => updateParam('genre', v)} />
          <SelectField label="Status" value={status} options={statusOptions} onChange={(v) => updateParam('status', v)} />
          <SelectField label="Platform" value={platform} options={platformOptions} onChange={(v) => updateParam('platform', v)} />
          <SelectField label="Sort by" value={sort} options={SORTS} onChange={(v) => updateParam('sort', v)} />
        </div>
        <Button variant="ghost" onClick={resetFilters} disabled={!hasFilters}>
          Reset
        </Button>
      </div>

      {list.status === 'loading' && <SkeletonGrid count={PAGE_SIZE} />}

      {list.status === 'error' && (
        <StatusMessage tone="error" title="Could not load games" action={<Button onClick={list.reload}>Try again</Button>}>
          {list.error}
        </StatusMessage>
      )}

      {list.status === 'success' && list.result.data.length === 0 && (
        <StatusMessage
          title="No games found"
          action={<Button variant="ghost" onClick={resetFilters}>Clear filters</Button>}
        >
          Try another search or remove some filters.
        </StatusMessage>
      )}

      {list.status === 'success' && list.result.data.length > 0 && (
        <>
          <ul className="games-grid">
            {list.result.data.map((game) => (
              <li key={game.id}>
                <GameCard game={game} />
              </li>
            ))}
          </ul>
          <Pagination page={page} totalPages={list.result.totalPages} onPageChange={changePage} />
        </>
      )}
    </section>
  )
}
