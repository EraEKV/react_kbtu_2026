import { useState } from 'react'
import { Link } from 'react-router'
import { useGamesList } from '../hooks/useGamesList.js'
import { GENRES, PLATFORMS, STATUSES } from '../constants.js'
import Button from '../components/Button.jsx'
import Loader from '../components/Loader.jsx'
import SelectField from '../components/SelectField.jsx'
import StatusMessage from '../components/StatusMessage.jsx'

const platformOptions = [{ value: '', label: 'All platforms' }, ...PLATFORMS.map((p) => ({ value: p, label: p }))]

export default function DashboardPage() {
  // load every game once, then calculate the stats on the client
  const list = useGamesList('?limit=1000')
  const [platform, setPlatform] = useState('') // '' = all platforms

  if (list.status === 'loading') return <Loader text="Loading stats…" />

  if (list.status === 'error') {
    return (
      <StatusMessage tone="error" title="Could not load stats" action={<Button onClick={list.reload}>Try again</Button>}>
        {list.error}
      </StatusMessage>
    )
  }

  // the platform filter affects everything below
  const allGames = list.result.data
  const games = platform ? allGames.filter((g) => g.platform === platform) : allGames

  // ---- statistics ----
  const total = games.length
  const completed = games.filter((g) => g.status === 'completed').length
  const completedPercent = total ? Math.round((completed / total) * 100) : 0
  const rated = games.filter((g) => g.rating)
  const avgRating = rated.length ? (rated.reduce((sum, g) => sum + g.rating, 0) / rated.length).toFixed(1) : '—'
  const totalHours = games.reduce((sum, g) => sum + (g.hoursPlayed ?? 0), 0)

  // ---- breakdowns ----
  const byStatus = STATUSES.map((s) => ({
    label: s.label,
    value: s.value,
    count: games.filter((g) => g.status === s.value).length,
  }))
  const byGenre = GENRES.map((genre) => ({
    label: genre,
    value: genre,
    count: games.filter((g) => g.genre === genre).length,
  })).filter((row) => row.count > 0)

  // ---- lists with links ----
  const topRated = [...rated].sort((a, b) => b.rating - a.rating).slice(0, 5)
  const playingNow = games.filter((g) => g.status === 'playing')

  // link to the games list with the same platform filter
  function gamesLink(key, value) {
    const params = new URLSearchParams({ [key]: value })
    if (platform) params.set('platform', platform)
    return `/games?${params}`
  }

  return (
    <section>
      <div className="dash-header">
        <div>
          <h1>Dashboard</h1>
          <p className="dash-subtitle">Stats calculated from your library</p>
        </div>
        <div className="dash-filter">
          <SelectField label="Platform" value={platform} options={platformOptions} onChange={setPlatform} />
        </div>
      </div>

      <div className="dash-stats">
        <StatCard label="Total games" value={total} />
        <StatCard label="Completed" value={completed} hint={`${completedPercent}% of library`} />
        <StatCard label="Average rating" value={avgRating} hint="out of 10" />
        <StatCard label="Hours played" value={totalHours} hint="hours in total" />
      </div>

      {total === 0 ? (
        <StatusMessage title="No games on this platform" action={<Button variant="ghost" onClick={() => setPlatform('')}>Show all platforms</Button>} />
      ) : (
        <div className="dash-grid">
          <Breakdown title="By status" rows={byStatus} total={total} linkTo={(row) => gamesLink('status', row.value)} />
          <Breakdown title="By genre" rows={byGenre} total={total} linkTo={(row) => gamesLink('genre', row.value)} />

          <div className="dash-panel">
            <h2 className="dash-panel-title">Top rated</h2>
            <ol className="dash-list">
              {topRated.map((g) => (
                <li key={g.id}>
                  <Link to={`/games/${g.id}`}>
                    <span className="dash-dot" style={{ background: g.cover }} />
                    {g.name}
                  </Link>
                  <span className="dash-star">★ {g.rating}</span>
                </li>
              ))}
            </ol>
          </div>

          <div className="dash-panel">
            <h2 className="dash-panel-title">Playing now</h2>
            {playingNow.length === 0 ? (
              <p className="dash-empty">Nothing in progress.</p>
            ) : (
              <ul className="dash-list">
                {playingNow.map((g) => (
                  <li key={g.id}>
                    <Link to={`/games/${g.id}`}>
                      <span className="dash-dot" style={{ background: g.cover }} />
                      {g.name}
                    </Link>
                    <span className="dash-muted">{g.progress ?? 0}%</span>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>
      )}
    </section>
  )
}

function StatCard({ label, value, hint }) {
  return (
    <div className="dash-stat">
      <span className="dash-stat-label">{label}</span>
      <strong className="dash-stat-value">{value}</strong>
      {hint && <span className="dash-stat-hint">{hint}</span>}
    </div>
  )
}

function Breakdown({ title, rows, total, linkTo }) {
  return (
    <div className="dash-panel">
      <h2 className="dash-panel-title">{title}</h2>
      <ul className="dash-bars">
        {rows.map((row) => (
          <li key={row.value}>
            <Link to={linkTo(row)} className="dash-bar-row">
              <span>{row.label}</span>
              <span className="dash-track">
                <span className="dash-fill" style={{ width: `${(row.count / total) * 100}%` }} />
              </span>
              <span className="dash-muted">{row.count}</span>
            </Link>
          </li>
        ))}
      </ul>
    </div>
  )
}
