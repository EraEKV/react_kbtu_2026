import { Link } from 'react-router'

export default function NotFoundPage() {
  return (
    <section className="state not-found">
      <h1>404</h1>
      <p>This page does not exist.</p>
      <div className="actions">
        <Link to="/" className="btn btn-primary">Go home</Link>
        <Link to="/games" className="btn">All games</Link>
      </div>
    </section>
  )
}
