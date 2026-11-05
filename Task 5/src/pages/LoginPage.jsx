import { useState } from 'react'
import Button from '../components/Button.jsx'

// Placeholder: real authentication will be added later.
export default function LoginPage() {
  const [submitted, setSubmitted] = useState(false)

  function handleSubmit(e) {
    e.preventDefault()
    setSubmitted(true)
  }

  return (
    <section className="login">
      <form className="login-card" onSubmit={handleSubmit}>
        <div className="login-head">
          <h1>Welcome back</h1>
          <p>Sign in to sync your game library</p>
        </div>

        <label className="login-field">
          <span>Email</span>
          <input type="email" placeholder="you@example.com" required />
        </label>
        <label className="login-field">
          <span>Password</span>
          <input type="password" placeholder="••••••••" required />
        </label>

        <Button type="submit" className="login-submit">Sign in</Button>

        {submitted && <p className="login-note">Authentication is not implemented yet. Coming soon!</p>}
      </form>
    </section>
  )
}
