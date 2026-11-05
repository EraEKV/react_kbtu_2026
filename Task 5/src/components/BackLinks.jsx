import { Link, useLocation, useNavigate } from 'react-router'

// "Back" returns to the previous page (with its filters).
// If the page was opened directly by URL there is no previous page, so it goes to /games.
export default function BackLinks() {
  const navigate = useNavigate()
  const location = useLocation()
  const hasHistory = location.key !== 'default'

  return (
    <div className="back-links">
      <button type="button" className="back-links-btn" onClick={() => (hasHistory ? navigate(-1) : navigate('/games'))}>
        ← Back
      </button>
      <Link to="/games" className="back-links-btn">
        All games
      </Link>
    </div>
  )
}
