import { Link } from 'react-router'
import heroImage from '../assets/hero.svg'
import Button from '../components/Button.jsx'

const features = [
  { to: '/games', title: 'Browse your library', text: 'Search, filter by genre, status or platform and sort your games.' },
  { to: '/dashboard', title: 'See your stats', text: 'Completion rate, average rating, hours played and more.' },
  { to: '/games/new', title: 'Add a new game', text: 'Keep track of what you play next and how far you got.' },
]

export default function HomePage() {
  return (
    <>
      <section className="home-hero">
        <div>
          <p className="home-eyebrow">Game backlog tracker</p>
          <h1 className="home-title">
            Every game you play, <span>in one place.</span>
          </h1>
          <p className="home-text">
            Game Vault keeps track of your games: what is in the backlog, what you are playing now and what you have
            already finished. Rate games, count hours and see your stats.
          </p>
          <div className="home-actions">
            <Button to="/games">Browse games</Button>
            <Button to="/about" variant="ghost">About the project</Button>
          </div>
        </div>
        <img src={heroImage} alt="Game controller illustration" className="home-image" />
      </section>

      <ul className="home-features">
        {features.map((f) => (
          <li key={f.to}>
            <Link to={f.to} className="home-feature">
              <strong>{f.title} →</strong>
              <span>{f.text}</span>
            </Link>
          </li>
        ))}
      </ul>
    </>
  )
}
