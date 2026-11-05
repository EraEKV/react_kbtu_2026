import { Link, useSearchParams } from 'react-router'
import { useGamesList } from '../hooks/useGamesList.js'
import { GENRES, PAGE_SIZE, PLATFORMS, SORTS, STATUSES } from '../constants.js'
import GameCard from '../components/GameCard.jsx'
import Pagination from '../components/Pagination.jsx'
import Loader from '../components/Loader.jsx'

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
  }

  function resetFilters() {
    setSearchParams({})
  }

  const hasFilters = search || genre || status || platform || sort !== 'name'

  return (
    <section>
      <div className="page-head">
        <div>
          <h1>Games</h1>
          {list.status === 'success' && <p className="muted">{list.result.total} games found</p>}
        </div>
        <Link to="/games/new" className="btn btn-primary">+ Add game</Link>
      </div>

      <div className="panel filters">
        <input
          className="input search"
          type="search"
          placeholder="Search by name or description…"
          value={search}
          onChange={(e) => updateParam('search', e.target.value)}
        />
        <select className="input" value={genre} onChange={(e) => updateParam('genre', e.target.value)}>
          <option value="">All genres</option>
          {GENRES.map((g) => <option key={g} value={g}>{g}</option>)}
        </select>
        <select className="input" value={status} onChange={(e) => updateParam('status', e.target.value)}>
          <option value="">All statuses</option>
          {STATUSES.map((s) => <option key={s.value} value={s.value}>{s.label}</option>)}
        </select>
        <select className="input" value={platform} onChange={(e) => updateParam('platform', e.target.value)}>
          <option value="">All platforms</option>
          {PLATFORMS.map((p) => <option key={p} value={p}>{p}</option>)}
        </select>
        <select className="input" value={sort} onChange={(e) => updateParam('sort', e.target.value)}>
          {SORTS.map((s) => <option key={s.value} value={s.value}>{s.label}</option>)}
        </select>
        <button className="btn" onClick={resetFilters} disabled={!hasFilters}>
          Reset
        </button>
      </div>

      {list.status === 'loading' && <Loader text="Loading games…" />}

      {list.status === 'error' && (
        <div className="state state-error">
          <p>Failed to load games: {list.error}</p>
          <button className="btn btn-primary" onClick={list.reload}>Try again</button>
        </div>
      )}

      {list.status === 'success' && list.result.data.length === 0 && (
        <div className="state">
          <p>No games match your filters.</p>
          <button className="btn" onClick={resetFilters}>Clear filters</button>
        </div>
      )}

      {list.status === 'success' && list.result.data.length > 0 && (
        <>
          <div className="card-grid">
            {list.result.data.map((game) => (
              <GameCard key={game.id} game={game} />
            ))}
          </div>
          <Pagination page={page} totalPages={list.result.totalPages} onChange={changePage} />
        </>
      )}
    </section>
  )
}
