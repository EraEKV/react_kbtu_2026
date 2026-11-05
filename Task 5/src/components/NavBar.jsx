import { Link, NavLink } from 'react-router'

// NavLink adds "active" styling to the link of the current page
function navClass({ isActive }) {
  return isActive ? 'nav-link active' : 'nav-link'
}

export default function NavBar() {
  return (
    <header className="navbar">
      <Link to="/" className="logo">
        🎮 Game Vault
      </Link>
      <nav className="nav-links">
        <NavLink to="/" end className={navClass}>Home</NavLink>
        <NavLink to="/games" className={navClass}>Games</NavLink>
        <NavLink to="/dashboard" className={navClass}>Dashboard</NavLink>
        <NavLink to="/about" className={navClass}>About</NavLink>
        <NavLink to="/login" className={navClass}>Login</NavLink>
      </nav>
    </header>
  )
}
