import { useState } from 'react'

// Placeholder: real authentication will be added later.
export default function LoginPage() {
  const [submitted, setSubmitted] = useState(false)

  function handleSubmit(e) {
    e.preventDefault()
    setSubmitted(true)
  }

  return (
    <section className="login">
      <form className="panel form login-form" onSubmit={handleSubmit}>
        <h2>Sign in</h2>
        <label className="wide">
          Email
          <input type="email" placeholder="you@example.com" required />
        </label>
        <label className="wide">
          Password
          <input type="password" placeholder="••••••••" required />
        </label>
        <button className="btn btn-primary wide" type="submit">Sign in</button>
        {submitted && <p className="muted wide">Authentication is not implemented yet. Coming soon!</p>}
      </form>
    </section>
  )
}
