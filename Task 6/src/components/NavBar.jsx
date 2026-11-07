import { NavLink, useNavigate } from 'react-router'
import { useAuth } from '../context/AuthContext.jsx'

// NavLink gives the link of the current page the "active" class
function navClass({ isActive }) {
  return isActive ? 'active' : undefined
}

export default function NavBar() {
  const { user, loading, logout } = useAuth()
  const navigate = useNavigate()

  async function handleLogout() {
    try {
      await logout()
      navigate('/')
    } catch {
      // the error is kept in AuthContext
    }
  }

  return (
    <header className="navbar">
      <div className="navbar-inner">
        <NavLink to="/" className="navbar-logo">
          Game<span>Vault</span>
        </NavLink>

        <nav className="navbar-nav">
          <NavLink to="/" end className={navClass}>Home</NavLink>
          <NavLink to="/games" className={navClass}>Games</NavLink>
          <NavLink to="/dashboard" className={navClass}>Dashboard</NavLink>
          <NavLink to="/about" className={navClass}>About</NavLink>
        </nav>

        {/* nothing is shown while the saved session is being restored, to avoid flicker */}
        <div className="navbar-auth">
          {!loading && user && (
            <>
              <NavLink to="/profile" className="navbar-login">Profile</NavLink>
              <button type="button" className="navbar-login navbar-logout" onClick={handleLogout}>
                Logout
              </button>
            </>
          )}
          {!loading && !user && (
            <>
              <NavLink to="/login" className="navbar-login">Login</NavLink>
              <NavLink to="/signup" className="navbar-login navbar-signup">Sign up</NavLink>
            </>
          )}
        </div>
      </div>
    </header>
  )
}
