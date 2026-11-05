import { useState } from 'react'
import { Link } from 'react-router'
import { useGamesList } from '../hooks/useGamesList.js'
import { GENRES, PLATFORMS, STATUSES } from '../constants.js'
import Loader from '../components/Loader.jsx'

export default function DashboardPage() {
  // load every game once, then calculate the stats on the client
  const list = useGamesList('?limit=1000')
  const [platform, setPlatform] = useState('') // '' = all platforms

  if (list.status === 'loading') return <Loader text="Loading stats…" />

  if (list.status === 'error') {
    return (
      <div className="state state-error">
        <p>Failed to load stats: {list.error}</p>
        <button className="btn btn-primary" onClick={list.reload}>Try again</button>
      </div>
    )
  }

  // the filter affects everything below
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
  const topRated = [...rated].sort((a, b) => b.rating - a.rating).slice(0, 3)
  const playingNow = games.filter((g) => g.status === 'playing')

  // link to the games list with the same platform filter
  function gamesLink(key, value) {
    const params = new URLSearchParams({ [key]: value })
    if (platform) params.set('platform', platform)
    return `/games?${params}`
  }

  return (
    <section>
      <div className="page-head">
        <div>
          <h1>Dashboard</h1>
          <p className="muted">Stats calculated from your library</p>
        </div>
        <select className="input" value={platform} onChange={(e) => setPlatform(e.target.value)}>
          <option value="">All platforms</option>
          {PLATFORMS.map((p) => <option key={p} value={p}>{p}</option>)}
        </select>
      </div>

      <div className="stats">
        <div className="panel stat"><span>Total games</span><strong>{total}</strong></div>
        <div className="panel stat"><span>Completed</span><strong>{completed} <small>({completedPercent}%)</small></strong></div>
        <div className="panel stat"><span>Average rating</span><strong>{avgRating}</strong></div>
        <div className="panel stat"><span>Hours played</span><strong>{totalHours} h</strong></div>
      </div>

      {total === 0 ? (
        <div className="state"><p>No games on this platform yet.</p></div>
      ) : (
        <div className="dash-grid">
          <Breakdown title="By status" rows={byStatus} total={total} linkTo={(row) => gamesLink('status', row.value)} />
          <Breakdown title="By genre" rows={byGenre} total={total} linkTo={(row) => gamesLink('genre', row.value)} />

          <div className="panel">
            <h2 className="panel-title">Top rated</h2>
            <ul className="link-list">
              {topRated.map((g) => (
                <li key={g.id}>
                  <Link to={`/games/${g.id}`}>{g.name}</Link>
                  <span>★ {g.rating}</span>
                </li>
              ))}
            </ul>
          </div>

          <div className="panel">
            <h2 className="panel-title">Playing now</h2>
            {playingNow.length === 0 ? (
              <p className="muted">Nothing in progress.</p>
            ) : (
              <ul className="link-list">
                {playingNow.map((g) => (
                  <li key={g.id}>
                    <Link to={`/games/${g.id}`}>{g.name}</Link>
                    <span>{g.progress ?? 0}%</span>
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

function Breakdown({ title, rows, total, linkTo }) {
  return (
    <div className="panel">
      <h2 className="panel-title">{title}</h2>
      <ul className="bars">
        {rows.map((row) => (
          <li key={row.value}>
            <Link to={linkTo(row)} className="bar-row">
              <span className="bar-label">{row.label}</span>
              <span className="bar-track">
                <span className="bar-fill" style={{ width: `${(row.count / total) * 100}%` }} />
              </span>
              <span className="bar-count">{row.count}</span>
            </Link>
          </li>
        ))}
      </ul>
    </div>
  )
}
