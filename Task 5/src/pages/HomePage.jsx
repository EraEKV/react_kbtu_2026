import { Link } from 'react-router'
import heroImage from '../assets/hero.svg'

export default function HomePage() {
  return (
    <section className="home">
      <div className="home-text">
        <h1>Your personal game library</h1>
        <p>
          Game Vault keeps track of the games you play: what is in the backlog, what you are playing now and
          what you have already finished. Rate games, count hours and see your stats.
        </p>
        <div className="actions">
          <Link to="/games" className="btn btn-primary">Browse games</Link>
          <Link to="/dashboard" className="btn">Open dashboard</Link>
          <Link to="/about" className="btn">About the project</Link>
        </div>
      </div>
      <img src={heroImage} alt="Game controller illustration" className="home-image" />
    </section>
  )
}
