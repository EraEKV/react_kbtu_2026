import { SORT_OPTIONS, STATUSES } from '../data/games.js'

const FILTERS = [{ value: 'all', label: 'All' }, ...STATUSES]

export default function Toolbar({
  statusFilter,
  onStatusFilterChange,
  counts,
  search,
  onSearchChange,
  sortBy,
  onSortChange,
  reversed,
  onToggleReverse,
  keyMode,
  onKeyModeChange,
}) {
  console.log('[render] Toolbar')

  return (
    <section className="panel toolbar">
      <div className="chips">
        {FILTERS.map((f) => (
          <button
            key={f.value}
            type="button"
            className={`chip ${statusFilter === f.value ? 'chip-active' : ''}`}
            onClick={() => onStatusFilterChange(f.value)}
          >
            {f.label}
            <span className="chip-count">{counts[f.value]}</span>
          </button>
        ))}
      </div>

      <div className="controls">
        <input
          className="search"
          type="search"
          value={search}
          onChange={(e) => onSearchChange(e.target.value)}
          placeholder="Search title or studio…"
        />

        <select value={sortBy} onChange={(e) => onSortChange(e.target.value)}>
          {SORT_OPTIONS.map((o) => (
            <option key={o.value} value={o.value}>
              Sort: {o.label}
            </option>
          ))}
        </select>

        <button
          type="button"
          className={`btn ${reversed ? 'btn-active' : ''}`}
          onClick={onToggleReverse}
        >
          ⇅ Reverse
        </button>

        <div className="segmented" title="Which key each card gets in the list">
          <span className="segmented-label">key =</span>
          <button
            type="button"
            className={keyMode === 'id' ? 'active' : ''}
            onClick={() => onKeyModeChange('id')}
          >
            game.id
          </button>
          <button
            type="button"
            className={keyMode === 'index' ? 'active danger' : ''}
            onClick={() => onKeyModeChange('index')}
          >
            index
          </button>
        </div>
      </div>

      {keyMode === 'index' && (
        <p className="warning">
          Keys are array indexes now. Add some progress to a card, then reverse or
          filter — the progress stays in the same <em>slot</em> and jumps to another game.
        </p>
      )}
    </section>
  )
}
