import { NavLink } from 'react-router'

// NavLink gives the link of the current page the "active" class
function navClass({ isActive }) {
  return isActive ? 'active' : undefined
}

export default function NavBar() {
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

        <NavLink to="/login" className="navbar-login">Sign in</NavLink>
      </div>
    </header>
  )
}
